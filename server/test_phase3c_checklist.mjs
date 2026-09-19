/**
 * Phase 3C — Accept Order Test Suite
 *
 * Tests:
 *  1. PATCH /api/shops/orders/:orderId/accept (own PLACED order) → 200, status=CONFIRMED
 *  2. Timeline recorded → timeline includes { status: 'CONFIRMED' }
 *  3. Prevent duplicate accept (now CONFIRMED) → 400 Bad Request ('Only placed orders can be accepted')
 *  4. Prevent invalid transition (e.g. DELIVERED order) → 400 Bad Request
 *  5. Strict Ownership Validation (Chillox cannot accept Shop 1 order) → 404 Not Found
 *  6. Singular Route Alias (/api/shop/orders/:orderId/accept) → 200, success: true
 *  7. Nonexistent valid ObjectId → 404 Not Found
 *  8. Malformed orderId (CastError guard) → 404 Not Found
 *  9. Missing JWT → 401 Unauthorized
 * 10. Student JWT → 403 Forbidden
 */

import mongoose from 'mongoose';

const BASE = 'http://localhost:5001';

let passed = 0;
let failed = 0;

function ok(label, cond, extra = '') {
  if (cond) {
    console.log(`  PASS  ${label}${extra ? '  (' + extra + ')' : ''}`);
    passed++;
  } else {
    console.log(`  FAIL  ${label}${extra ? '  (' + extra + ')' : ''}`);
    failed++;
  }
}

async function http(url, opts = {}) {
  const res = await fetch(`${BASE}${url}`, opts);
  let body;
  try { body = await res.json(); } catch { body = {}; }
  return { status: res.status, body };
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function login(email, password) {
  const r = await http('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!r.body.token) throw new Error(`Login failed for ${email}: ${JSON.stringify(r.body)}`);
  return { token: r.body.token, user: r.body.user };
}

async function getMyShop(token) {
  const r = await http('/api/shops/my-shop', { headers: authHeaders(token) });
  if (!r.body.shop) throw new Error('Could not fetch my-shop: ' + JSON.stringify(r.body));
  return r.body;
}

async function topup(token, amount = 500) {
  await http('/api/wallet/topup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ amount })
  });
}

async function placeOrder(studentToken, shopId, itemId, itemName, price) {
  const r = await http('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(studentToken)
    },
    body: JSON.stringify({
      shopId,
      items: [{
        id: itemId,
        name: itemName,
        price,
        quantity: 1
      }],
      deliveryAddress: {
        building: 'Academic Building',
        room: 'Room 305'
      },
      specialInstructions: 'Phase 3C test order'
    })
  });
  if (!r.body.order) throw new Error('Could not place order: ' + JSON.stringify(r.body));
  return r.body.order;
}

async function main() {
  console.log('\n================================================');
  console.log(' Phase 3C - Accept Order Tests ');
  console.log('================================================\n');

  // ── Setup Sessions ──────────────────────────────────────────────────────────
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const chilloxSession = await login('chillox@uiu.ac.bd', 'password123');
  const studentSession = await login('student@uiu.ac.bd', 'password123');

  const myShopData  = await getMyShop(shopSession.token);
  const chilloxData = await getMyShop(chilloxSession.token);

  const shopId    = myShopData.shop._id;
  const chilloxId = chilloxData.shop._id;

  const testItem = myShopData.menuItems?.[0] || { _id: null, name: 'Burger', price: 100 };

  console.log(`  Shop Owner 1 : ${shopSession.user.name} (Shop: ${myShopData.shop.name})`);
  console.log(`  Shop Owner 2 : ${chilloxSession.user.name} (Shop: ${chilloxData.shop.name})`);
  console.log();

  // Top up student wallet to guarantee sufficient test balance
  await topup(studentSession.token, 1000);

  // Create a fresh PLACED order for Shop 1
  console.log('-- Setup: Placing a new PLACED order --');
  const freshOrder = await placeOrder(studentSession.token, shopId, testItem._id, testItem.name, testItem.price);
  const orderId = freshOrder._id;
  console.log(`  Fresh Order Created : ${freshOrder.orderNumber} (ID: ${orderId}, status: ${freshOrder.status})`);
  console.log();

  // ── Test 1: PATCH /api/shops/orders/:orderId/accept ────────────────────────
  console.log('-- Test 1: Accept PLACED Order (PLACED -> CONFIRMED) --');
  const resAccept = await http(`/api/shops/orders/${orderId}/accept`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(shopSession.token)
    }
  });

  ok('Status is 200', resAccept.status === 200, `got ${resAccept.status}`);
  ok('success is true', resAccept.body.success === true);
  ok('Status transitioned to CONFIRMED', resAccept.body.order?.status === 'CONFIRMED', `status: ${resAccept.body.order?.status}`);
  ok('Success message returned', resAccept.body.message === 'Order accepted successfully');

  // ── Test 2: Timeline Recorded & MongoDB Persistence Check ────────────────
  console.log('\n-- Test 2: Timeline Verification & Database Persistence --');
  const timeline = resAccept.body.order?.timeline || [];
  const confirmedEntry = timeline.find((t) => t.status === 'CONFIRMED');
  ok('Timeline contains CONFIRMED entry', Boolean(confirmedEntry), `entries: ${timeline.map((t) => t.status).join(' -> ')}`);
  ok('Timeline entry has timestamp', Boolean(confirmedEntry?.time));

  // Verify directly from database via GET /api/shops/orders/:orderId
  const resDbCheck = await http(`/api/shops/orders/${orderId}`, {
    headers: authHeaders(shopSession.token)
  });
  ok('Database check: status is CONFIRMED', resDbCheck.body.order?.status === 'CONFIRMED');
  const dbTimelineConfirmed = resDbCheck.body.order?.timeline?.find((t) => t.status === 'CONFIRMED');
  ok('Database check: timeline contains CONFIRMED in MongoDB', Boolean(dbTimelineConfirmed?.time));

  // ── Test 3: Prevent Duplicate Accept ───────────────────────────────────────
  console.log('\n-- Test 3: Prevent Duplicate Accept --');
  const resDup = await http(`/api/shops/orders/${orderId}/accept`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(shopSession.token)
    }
  });
  ok('Duplicate accept rejected with 400', resDup.status === 400, `got ${resDup.status}`);
  ok('success is false', resDup.body.success === false);
  ok('Error message indicates only placed orders can be accepted', resDup.body.message?.includes('Only placed orders can be accepted'), `msg: ${resDup.body.message}`);

  // ── Test 4: Prevent Invalid Transition on DELIVERED Order ──────────────────
  console.log('\n-- Test 4: Prevent Invalid Transition on non-PLACED Order --');
  const listRes = await http('/api/shops/orders', { headers: authHeaders(shopSession.token) });
  const deliveredOrd = listRes.body.orders?.find((o) => o.status === 'DELIVERED');
  if (deliveredOrd) {
    const resDelivAccept = await http(`/api/shops/orders/${deliveredOrd._id}/accept`, {
      method: 'PATCH',
      headers: authHeaders(shopSession.token)
    });
    ok('DELIVERED order cannot be accepted (400)', resDelivAccept.status === 400, `got ${resDelivAccept.status}`);
  } else {
    ok('DELIVERED order check skipped (no delivered order found)', true);
  }

  // ── Test 5: Strict Ownership Validation (Other shop cannot accept) ─────────
  console.log('\n-- Test 5: Strict Ownership Validation (Chillox cannot accept Shop 1 order) --');
  // Place another fresh order for Shop 1
  const freshOrder2 = await placeOrder(studentSession.token, shopId, testItem._id, testItem.name, testItem.price);
  const resChilloxAccept = await http(`/api/shops/orders/${freshOrder2._id}/accept`, {
    method: 'PATCH',
    headers: authHeaders(chilloxSession.token)
  });
  ok('Chillox receives 404 Not Found', resChilloxAccept.status === 404, `got ${resChilloxAccept.status}`);
  ok('success is false', resChilloxAccept.body.success === false);

  // ── Test 6: Singular Route Alias (/api/shop/orders/:orderId/accept) ────────
  console.log('\n-- Test 6: Singular Route Alias (/api/shop/orders/:orderId/accept) --');
  const resAliasAccept = await http(`/api/shop/orders/${freshOrder2._id}/accept`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Singular route accepts order (200)', resAliasAccept.status === 200, `got ${resAliasAccept.status}`);
  ok('Status updated to CONFIRMED via alias route', resAliasAccept.body.order?.status === 'CONFIRMED');

  // ── Test 7: Nonexistent Order ID ───────────────────────────────────────────
  console.log('\n-- Test 7: Nonexistent valid ObjectId --');
  const fakeId = new mongoose.Types.ObjectId().toString();
  const resFake = await http(`/api/shops/orders/${fakeId}/accept`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Nonexistent order returns 404', resFake.status === 404, `got ${resFake.status}`);

  // ── Test 8: Malformed Order ID (CastError guard) ───────────────────────────
  console.log('\n-- Test 8: Malformed Order ID --');
  const resMalformed = await http('/api/shops/orders/not-a-valid-id/accept', {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Malformed ID returns 404 without 500 crash', resMalformed.status === 404, `got ${resMalformed.status}`);

  // ── Test 9: Security Check — No JWT ────────────────────────────────────────
  console.log('\n-- Test 9: Security Check — No JWT --');
  const resNoAuth = await http(`/api/shops/orders/${orderId}/accept`, { method: 'PATCH' });
  ok('Missing JWT returns 401', resNoAuth.status === 401, `got ${resNoAuth.status}`);

  // ── Test 10: Security Check — Student JWT ──────────────────────────────────
  console.log('\n-- Test 10: Security Check — Student JWT --');
  const resStudentAuth = await http(`/api/shops/orders/${orderId}/accept`, {
    method: 'PATCH',
    headers: authHeaders(studentSession.token)
  });
  ok('Student JWT returns 403 Forbidden', resStudentAuth.status === 403, `got ${resStudentAuth.status}`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n================================================');
  console.log(` RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================\n');

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
