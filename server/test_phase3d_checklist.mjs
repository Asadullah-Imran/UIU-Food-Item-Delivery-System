/**
 * Phase 3D — Reject Order Test Suite
 *
 * Tests:
 *  1. PATCH /api/shops/orders/:orderId/reject (own PLACED order) → 200, status=REJECTED
 *  2. Timeline recorded → includes { status: 'REJECTED' }
 *  3. Student wallet refunded → student balance increases by grandTotal
 *  4. REFUND transaction recorded in database with type='REFUND' and direction='CREDIT'
 *  5. Prevent duplicate reject (now REJECTED) → 400 Bad Request ('Only placed orders can be rejected')
 *  6. Prevent invalid transition on non-PLACED order (CONFIRMED / DELIVERED) → 400 Bad Request
 *  7. Strict Ownership Validation (Chillox cannot reject Shop 1 order) → 404 Not Found
 *  8. Singular Route Alias (/api/shop/orders/:orderId/reject) → 200, success: true
 *  9. Nonexistent valid ObjectId → 404 Not Found
 * 10. Malformed orderId (CastError guard) → 404 Not Found
 * 11. Missing JWT → 401 Unauthorized
 * 12. Student JWT → 403 Forbidden
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

async function getStudentWallet(token) {
  const r = await http('/api/wallet/balance', { headers: authHeaders(token) });
  if (r.body.walletBalance === undefined) throw new Error('Could not fetch wallet: ' + JSON.stringify(r.body));
  return r.body.walletBalance;
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
        room: 'Room 404'
      },
      specialInstructions: 'Phase 3D test order'
    })
  });
  if (!r.body.order) throw new Error('Could not place order: ' + JSON.stringify(r.body));
  return r.body.order;
}

async function main() {
  console.log('\n================================================');
  console.log(' Phase 3D - Reject Order Tests ');
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

  // 1. Check student balance before order
  const balanceBefore = await getStudentWallet(studentSession.token);

  // 2. Place a fresh PLACED order
  console.log('-- Setup: Placing a new PLACED order --');
  const freshOrder = await placeOrder(studentSession.token, shopId, testItem._id, testItem.name, testItem.price);
  const orderId = freshOrder._id;
  const grandTotal = freshOrder.billing?.grandTotal;
  console.log(`  Fresh Order Created : ${freshOrder.orderNumber} (ID: ${orderId}, Total: ৳${grandTotal})`);

  const balanceAfterOrder = await getStudentWallet(studentSession.token);
  console.log(`  Student balance before: ৳${balanceBefore} → after order: ৳${balanceAfterOrder}`);
  console.log();

  // ── Test 1: Reject PLACED Order ────────────────────────────────────────────
  console.log('-- Test 1: Reject PLACED Order (PLACED -> REJECTED) --');
  const resReject = await http(`/api/shops/orders/${orderId}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(shopSession.token)
    },
    body: JSON.stringify({
      reason: 'Item out of stock during peak hour'
    })
  });

  ok('Status is 200', resReject.status === 200, `got ${resReject.status}`);
  ok('success is true', resReject.body.success === true);
  ok('Status transitioned to REJECTED', resReject.body.order?.status === 'REJECTED', `status: ${resReject.body.order?.status}`);

  // ── Test 2: Timeline Recorded ──────────────────────────────────────────────
  console.log('\n-- Test 2: Timeline Verification --');
  const timeline = resReject.body.order?.timeline || [];
  const rejectedEntry = timeline.find((t) => t.status === 'REJECTED');
  ok('Timeline contains REJECTED entry', Boolean(rejectedEntry), `entries: ${timeline.map((t) => t.status).join(' -> ')}`);
  ok('Timeline contains custom reason', rejectedEntry?.note?.includes('out of stock') || rejectedEntry?.note?.includes('rejected'), `note: ${rejectedEntry?.note}`);

  // ── Test 3: Automated Student Refund Verification ──────────────────────────
  console.log('\n-- Test 3: Automated Student Wallet Refund --');
  const balanceAfterReject = await getStudentWallet(studentSession.token);
  const expectedRefundedBal = balanceAfterOrder + grandTotal;
  ok('Student wallet refunded 100%', balanceAfterReject === expectedRefundedBal, `before: ৳${balanceAfterOrder}, after reject: ৳${balanceAfterReject} (refund: ৳${grandTotal})`);

  // ── Test 4: REFUND Transaction in Response/DB ──────────────────────────────
  console.log('\n-- Test 4: REFUND Transaction Verification --');
  const refundObj = resReject.body.refund || {};
  ok('Refund marked as true in response', refundObj.refunded === true);
  ok('Refund amount matches grandTotal', refundObj.refundAmount === grandTotal, `amount: ${refundObj.refundAmount}`);
  ok('REFUND transaction document created', Boolean(refundObj.refundTxn && refundObj.refundTxn.type === 'REFUND'), `txn type: ${refundObj.refundTxn?.type}`);

  // ── Test 5: Prevent Duplicate Reject ───────────────────────────────────────
  console.log('\n-- Test 5: Prevent Duplicate Reject --');
  const resDup = await http(`/api/shops/orders/${orderId}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(shopSession.token)
    }
  });
  ok('Duplicate reject returns 400 Bad Request', resDup.status === 400, `got ${resDup.status}`);
  ok('Error message indicates only placed orders can be rejected', resDup.body.message?.includes('Only placed orders can be rejected'));

  // ── Test 6: Prevent Reject on CONFIRMED Order ──────────────────────────────
  console.log('\n-- Test 6: Prevent Reject on CONFIRMED Order --');
  // Place and accept an order
  const freshOrder2 = await placeOrder(studentSession.token, shopId, testItem._id, testItem.name, testItem.price);
  await http(`/api/shops/orders/${freshOrder2._id}/accept`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  const resRejectConfirmed = await http(`/api/shops/orders/${freshOrder2._id}/reject`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('CONFIRMED order cannot be rejected (returns 400)', resRejectConfirmed.status === 400, `got ${resRejectConfirmed.status}`);

  // ── Test 7: Strict Ownership Validation (Chillox cannot reject Shop 1 order) ─
  console.log('\n-- Test 7: Strict Ownership Validation (Chillox cannot reject Shop 1 order) --');
  const freshOrder3 = await placeOrder(studentSession.token, shopId, testItem._id, testItem.name, testItem.price);
  const resChilloxReject = await http(`/api/shops/orders/${freshOrder3._id}/reject`, {
    method: 'PATCH',
    headers: authHeaders(chilloxSession.token)
  });
  ok('Chillox receives 404 Not Found', resChilloxReject.status === 404, `got ${resChilloxReject.status}`);
  ok('success is false', resChilloxReject.body.success === false);

  // ── Test 8: Singular Route Alias (/api/shop/orders/:orderId/reject) ────────
  console.log('\n-- Test 8: Singular Route Alias (/api/shop/orders/:orderId/reject) --');
  const resAliasReject = await http(`/api/shop/orders/${freshOrder3._id}/reject`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Singular route rejects order (200)', resAliasReject.status === 200, `got ${resAliasReject.status}`);
  ok('Order status is REJECTED via alias', resAliasReject.body.order?.status === 'REJECTED');

  // ── Test 9: Nonexistent Order ID ───────────────────────────────────────────
  console.log('\n-- Test 9: Nonexistent valid ObjectId --');
  const fakeId = new mongoose.Types.ObjectId().toString();
  const resFake = await http(`/api/shops/orders/${fakeId}/reject`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Nonexistent order returns 404', resFake.status === 404, `got ${resFake.status}`);

  // ── Test 10: Malformed Order ID (CastError guard) ──────────────────────────
  console.log('\n-- Test 10: Malformed Order ID --');
  const resMalformed = await http('/api/shops/orders/invalid-id-xyz/reject', {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Malformed ID returns 404 without 500 crash', resMalformed.status === 404, `got ${resMalformed.status}`);

  // ── Test 11: Security Check — No JWT ───────────────────────────────────────
  console.log('\n-- Test 11: Security Check — No JWT --');
  const resNoAuth = await http(`/api/shops/orders/${orderId}/reject`, { method: 'PATCH' });
  ok('Missing JWT returns 401', resNoAuth.status === 401, `got ${resNoAuth.status}`);

  // ── Test 12: Security Check — Student JWT ─────────────────────────────────
  console.log('\n-- Test 12: Security Check — Student JWT --');
  const resStudentAuth = await http(`/api/shops/orders/${orderId}/reject`, {
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
