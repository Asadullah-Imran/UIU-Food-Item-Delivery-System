/**
 * Phase 3B — Get One Order Test Suite
 *
 * Tests:
 *  1. GET /api/shops/orders/:orderId (own order)   → 200, success: true, populated order object
 *  2. Payload completeness:
 *      - orderNumber
 *      - student (name, email, phone, universityId)
 *      - runner (if assigned)
 *      - items (name, price, quantity) & menuItem
 *      - billing (subtotal, grandTotal)
 *      - deliveryAddress (building, room)
 *      - specialInstructions
 *      - status
 *      - createdAt / order time
 *  3. Strict Ownership Validation:
 *      - Querying Shop 1's order as Shop 2 (Chillox) → 404 Not Found
 *  4. Singular Route Alias (/api/shop/orders/:orderId) → 200, success: true
 *  5. Querying with orderNumber (e.g. #UIU-xxxx)  → 200, success: true
 *  6. Nonexistent valid ObjectId                  → 404 Not Found
 *  7. Invalid ObjectId format (CastError guard)   → 404 Not Found (no 500)
 *  8. No JWT                                      → 401 Unauthorized
 *  9. Student JWT                                 → 403 Forbidden
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

async function main() {
  console.log('\n================================================');
  console.log(' Phase 3B - Get One Order Tests ');
  console.log('================================================\n');

  // ── Setup Sessions ──────────────────────────────────────────────────────────
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const chilloxSession = await login('chillox@uiu.ac.bd', 'password123');
  const studentSession = await login('student@uiu.ac.bd', 'password123');

  const myShopData  = await getMyShop(shopSession.token);
  const chilloxData = await getMyShop(chilloxSession.token);

  const shopId    = myShopData.shop._id;
  const chilloxId = chilloxData.shop._id;

  console.log(`  Shop Owner 1 : ${shopSession.user.name} (Shop: ${myShopData.shop.name}, ID: ${shopId})`);
  console.log(`  Shop Owner 2 : ${chilloxSession.user.name} (Shop: ${chilloxData.shop.name}, ID: ${chilloxId})`);
  console.log();

  // Fetch an order for Shop 1
  const ordersListRes = await http('/api/shops/orders', {
    headers: authHeaders(shopSession.token)
  });

  if (!ordersListRes.body.orders || ordersListRes.body.orders.length === 0) {
    throw new Error('No orders found for Shop 1 to test with');
  }

  const targetOrder = ordersListRes.body.orders[0];
  const orderId = targetOrder._id;
  const orderNum = targetOrder.orderNumber;

  console.log(`  Target Order : ${orderNum} (ID: ${orderId})`);
  console.log();

  // ── Test 1: GET /api/shops/orders/:orderId ─────────────────────────────────
  console.log('-- Test 1: GET /api/shops/orders/:orderId (Shop Owner JWT) --');
  const res1 = await http(`/api/shops/orders/${orderId}`, {
    headers: authHeaders(shopSession.token)
  });
  ok('Status is 200', res1.status === 200, `got ${res1.status}`);
  ok('success is true', res1.body.success === true);
  ok('order is returned as object', typeof res1.body.order === 'object' && res1.body.order !== null);
  ok('order._id matches target', res1.body.order?._id === orderId);

  // ── Test 2: Payload Completeness ───────────────────────────────────────────
  console.log('\n-- Test 2: Payload Completeness --');
  const ord = res1.body.order || {};
  ok('Order Number present', Boolean(ord.orderNumber), `orderNumber: ${ord.orderNumber}`);
  ok('Student populated', Boolean(ord.student && ord.student.name), `student: ${ord.student?.name}`);
  ok('Student phone present', Boolean(ord.student && ord.student.phone), `phone: ${ord.student?.phone}`);
  ok('Student ID present', Boolean(ord.student && ord.student.universityId), `universityId: ${ord.student?.universityId}`);
  ok('Items array present & non-empty', Array.isArray(ord.items) && ord.items.length > 0, `count: ${ord.items?.length}`);
  ok('Item quantity and price present', Boolean(ord.items?.[0]?.quantity && ord.items?.[0]?.price !== undefined));
  ok('Billing subtotal present', ord.billing?.subtotal !== undefined, `subtotal: ${ord.billing?.subtotal}`);
  ok('Billing grandTotal present', ord.billing?.grandTotal !== undefined, `grandTotal: ${ord.billing?.grandTotal}`);
  ok('Delivery room present', Boolean(ord.deliveryAddress?.room), `room: ${ord.deliveryAddress?.room}`);
  ok('Status present', Boolean(ord.status), `status: ${ord.status}`);
  ok('Order time (createdAt) present', Boolean(ord.createdAt));

  // ── Test 3: Strict Ownership Validation (Other Shop cannot view) ───────────
  console.log('\n-- Test 3: Strict Ownership Validation (Other Shop Access) --');
  const resChillox = await http(`/api/shops/orders/${orderId}`, {
    headers: authHeaders(chilloxSession.token)
  });
  ok('Other shop cannot view order (returns 404)', resChillox.status === 404, `got ${resChillox.status}`);
  ok('success is false', resChillox.body.success === false);

  // ── Test 4: Singular Route Alias (/api/shop/orders/:orderId) ───────────────
  console.log('\n-- Test 4: Singular Route Alias (/api/shop/orders/:orderId) --');
  const resAlias = await http(`/api/shop/orders/${orderId}`, {
    headers: authHeaders(shopSession.token)
  });
  ok('Status is 200 on /api/shop/orders/:orderId', resAlias.status === 200);
  ok('success is true', resAlias.body.success === true);
  ok('order matches', resAlias.body.order?._id === orderId);

  // ── Test 5: Fetch by orderNumber (#UIU-xxxx) ──────────────────────────────
  console.log('\n-- Test 5: Fetch by orderNumber identifier --');
  const resByNum = await http(`/api/shops/orders/${encodeURIComponent(orderNum)}`, {
    headers: authHeaders(shopSession.token)
  });
  ok('Status is 200 when querying by orderNumber', resByNum.status === 200, `query: ${orderNum}`);
  ok('Order._id matches', resByNum.body.order?._id === orderId);

  // ── Test 6: Nonexistent valid ObjectId ────────────────────────────────────
  console.log('\n-- Test 6: Nonexistent valid ObjectId --');
  const fakeId = new mongoose.Types.ObjectId().toString();
  const resFake = await http(`/api/shops/orders/${fakeId}`, {
    headers: authHeaders(shopSession.token)
  });
  ok('Nonexistent order returns 404', resFake.status === 404, `got ${resFake.status}`);
  ok('success is false', resFake.body.success === false);

  // ── Test 7: Invalid ObjectId format (CastError guard) ─────────────────────
  console.log('\n-- Test 7: Invalid ObjectId format (CastError guard) --');
  const resInvalid = await http('/api/shops/orders/not-a-valid-id-12345', {
    headers: authHeaders(shopSession.token)
  });
  ok('Malformed ID returns 404 (not 500)', resInvalid.status === 404, `got ${resInvalid.status}`);
  ok('success is false', resInvalid.body.success === false);

  // ── Test 8: Security Check — No JWT ────────────────────────────────────────
  console.log('\n-- Test 8: Security Check — No JWT --');
  const resNoAuth = await http(`/api/shops/orders/${orderId}`);
  ok('Missing JWT returns 401', resNoAuth.status === 401, `got ${resNoAuth.status}`);
  ok('success is false', resNoAuth.body.success === false);

  // ── Test 9: Security Check — Student JWT ──────────────────────────────────
  console.log('\n-- Test 9: Security Check — Student JWT --');
  const resStudentAuth = await http(`/api/shops/orders/${orderId}`, {
    headers: authHeaders(studentSession.token)
  });
  ok('Student JWT returns 403 Forbidden', resStudentAuth.status === 403, `got ${resStudentAuth.status}`);
  ok('success is false', resStudentAuth.body.success === false);

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
