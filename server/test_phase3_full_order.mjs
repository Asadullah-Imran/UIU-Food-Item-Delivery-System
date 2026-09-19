/**
 * Phase 3 — Exact Sequence Full Verification Test Suite
 *
 * Test Order:
 *  1. GET /api/shops/orders
 *  2. GET /api/shops/orders?status=PLACED
 *  3. GET /api/shops/orders/:orderId
 *  4. Accept own PLACED order
 *  5. Try accepting same order twice
 *  6. Reject own PLACED order
 *  7. Verify refund
 *  8. Try accessing another Shop's order
 *  9. Test no JWT
 * 10. Test Student JWT
 *
 * Security Assertions:
 *  - No JWT       → 401
 *  - Student JWT  → 403
 *  - Wrong Shop   → 404 / denied
 */

import mongoose from 'mongoose';

const BASE = 'http://localhost:5001';

let passed = 0;
let failed = 0;

function ok(stepNum, label, cond, extra = '') {
  if (cond) {
    console.log(`  [Step ${stepNum}] PASS  ${label}${extra ? '  (' + extra + ')' : ''}`);
    passed++;
  } else {
    console.log(`  [Step ${stepNum}] FAIL  ${label}${extra ? '  (' + extra + ')' : ''}`);
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
        room: 'Room 501'
      },
      specialInstructions: 'Exact test sequence order'
    })
  });
  if (!r.body.order) throw new Error('Could not place order: ' + JSON.stringify(r.body));
  return r.body.order;
}

async function main() {
  console.log('\n=============================================================');
  console.log(' Phase 3 — Exact 10-Step Sequential Verification ');
  console.log('=============================================================\n');

  // ── Setup Sessions ────────────────────────────────────────────────────────
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const chilloxSession = await login('chillox@uiu.ac.bd', 'password123');
  const studentSession = await login('student@uiu.ac.bd', 'password123');

  const myShopData  = await getMyShop(shopSession.token);
  const chilloxData = await getMyShop(chilloxSession.token);

  const shopId    = myShopData.shop._id;
  const chilloxId = chilloxData.shop._id;
  const menuItem  = myShopData.menuItems?.[0] || { _id: null, name: 'Burger', price: 100 };

  console.log(`  Shop Owner 1 : ${shopSession.user.name} (${myShopData.shop.name})`);
  console.log(`  Shop Owner 2 : ${chilloxSession.user.name} (${chilloxData.shop.name})`);
  console.log(`  Student      : ${studentSession.user.name}`);
  console.log();

  // Ensure there is at least one PLACED order to begin testing
  const initialCheck = await http('/api/shops/orders?status=PLACED', {
    headers: authHeaders(shopSession.token)
  });
  if (!initialCheck.body.orders || initialCheck.body.orders.length === 0) {
    console.log('  [Setup] Creating initial PLACED order for test sequence...');
    await placeOrder(studentSession.token, shopId, menuItem._id, menuItem.name, menuItem.price);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Step 1: GET /api/shops/orders
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- Step 1: GET /api/shops/orders ---');
  const res1 = await http('/api/shops/orders', {
    headers: authHeaders(shopSession.token)
  });
  ok(1, 'Returns 200 OK', res1.status === 200, `status=${res1.status}`);
  ok(1, 'Returns success: true', res1.body.success === true);
  ok(1, 'Returns orders array', Array.isArray(res1.body.orders));
  ok(1, 'Count matches length', res1.body.count === res1.body.orders?.length, `count=${res1.body.count}`);
  const allBelong = res1.body.orders?.every((o) => o.shop?.toString() === shopId.toString());
  ok(1, 'Strict Shop ownership: all orders belong to authenticated shop', allBelong);

  // ──────────────────────────────────────────────────────────────────────────
  // Step 2: GET /api/shops/orders?status=PLACED
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 2: GET /api/shops/orders?status=PLACED ---');
  const res2 = await http('/api/shops/orders?status=PLACED', {
    headers: authHeaders(shopSession.token)
  });
  ok(2, 'Returns 200 OK', res2.status === 200, `status=${res2.status}`);
  ok(2, 'Returns success: true', res2.body.success === true);
  const allPlaced = res2.body.orders?.every((o) => o.status === 'PLACED');
  ok(2, 'Every returned order has status === "PLACED"', allPlaced, `count=${res2.body.count}`);
  const targetPlacedOrder = res2.body.orders?.[0];
  ok(2, 'At least one PLACED order exists', Boolean(targetPlacedOrder), `orderId=${targetPlacedOrder?._id}`);

  // ──────────────────────────────────────────────────────────────────────────
  // Step 3: GET /api/shops/orders/:orderId
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 3: GET /api/shops/orders/:orderId ---');
  const testOrderId = targetPlacedOrder._id;
  const res3 = await http(`/api/shops/orders/${testOrderId}`, {
    headers: authHeaders(shopSession.token)
  });
  ok(3, 'Returns 200 OK', res3.status === 200, `status=${res3.status}`);
  ok(3, 'Returns success: true', res3.body.success === true);
  const singleOrder = res3.body.order;
  ok(3, 'Order object returned matches ID', singleOrder?._id === testOrderId);
  ok(3, 'Populates student (name, email, phone)', Boolean(singleOrder?.student?.name));
  ok(3, 'Populates items and billing', Array.isArray(singleOrder?.items) && singleOrder?.billing?.grandTotal !== undefined);

  // ──────────────────────────────────────────────────────────────────────────
  // Step 4: Accept own PLACED order
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 4: Accept own PLACED order ---');
  const res4 = await http(`/api/shops/orders/${testOrderId}/accept`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(shopSession.token)
    }
  });
  ok(4, 'Returns 200 OK', res4.status === 200, `status=${res4.status}`);
  ok(4, 'Returns success: true', res4.body.success === true);
  ok(4, 'Status transitioned: PLACED -> CONFIRMED', res4.body.order?.status === 'CONFIRMED', `status=${res4.body.order?.status}`);
  const confirmedTimeline = res4.body.order?.timeline?.find((t) => t.status === 'CONFIRMED');
  ok(4, 'Timeline recorded CONFIRMED entry with timestamp', Boolean(confirmedTimeline?.time));

  // ──────────────────────────────────────────────────────────────────────────
  // Step 5: Try accepting same order twice
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 5: Try accepting same order twice ---');
  const res5 = await http(`/api/shops/orders/${testOrderId}/accept`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(shopSession.token)
    }
  });
  ok(5, 'Rejected with 400 Bad Request', res5.status === 400, `status=${res5.status}`);
  ok(5, 'Returns success: false', res5.body.success === false);
  ok(5, 'Message indicates only placed orders can be accepted', res5.body.message?.includes('Only placed orders can be accepted'), `msg: ${res5.body.message}`);

  // ──────────────────────────────────────────────────────────────────────────
  // Step 6: Reject own PLACED order
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 6: Reject own PLACED order ---');
  // Create a fresh PLACED order to reject
  const balanceBeforeOrder = await getStudentWallet(studentSession.token);
  const rejectTargetOrder = await placeOrder(studentSession.token, shopId, menuItem._id, menuItem.name, menuItem.price);
  const rejectOrderId = rejectTargetOrder._id;
  const grandTotal = rejectTargetOrder.billing?.grandTotal || 0;
  const balanceAfterOrder = await getStudentWallet(studentSession.token);

  console.log(`  Created fresh PLACED order: ${rejectTargetOrder.orderNumber} (Grand Total: ৳${grandTotal})`);
  console.log(`  Student balance: ৳${balanceBeforeOrder} -> ৳${balanceAfterOrder} (debited ৳${grandTotal})`);

  const res6 = await http(`/api/shops/orders/${rejectOrderId}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(shopSession.token)
    },
    body: JSON.stringify({
      reason: 'Shop kitchen closing early'
    })
  });
  ok(6, 'Returns 200 OK', res6.status === 200, `status=${res6.status}`);
  ok(6, 'Returns success: true', res6.body.success === true);
  ok(6, 'Status transitioned: PLACED -> REJECTED', res6.body.order?.status === 'REJECTED', `status=${res6.body.order?.status}`);
  const rejectedTimeline = res6.body.order?.timeline?.find((t) => t.status === 'REJECTED');
  ok(6, 'Timeline recorded REJECTED entry with custom reason', Boolean(rejectedTimeline?.note?.includes('closing early')));

  // ──────────────────────────────────────────────────────────────────────────
  // Step 7: Verify refund
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 7: Verify refund ---');
  const balanceAfterRefund = await getStudentWallet(studentSession.token);
  const expectedBalance = balanceAfterOrder + grandTotal;
  ok(7, 'Student wallet balance refunded 100%', balanceAfterRefund === expectedBalance, `was ৳${balanceAfterOrder}, now ৳${balanceAfterRefund} (+৳${grandTotal})`);
  const refundInfo = res6.body.refund;
  ok(7, 'Refund confirmed in response payload', refundInfo?.refunded === true && refundInfo?.refundAmount === grandTotal);
  ok(7, 'REFUND transaction document created in MongoDB', refundInfo?.refundTxn?.type === 'REFUND' && refundInfo?.refundTxn?.direction === 'CREDIT');

  // ──────────────────────────────────────────────────────────────────────────
  // Step 8: Try accessing another Shop's order
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n--- Step 8: Try accessing another Shop's order ---");
  const res8 = await http(`/api/shops/orders/${testOrderId}`, {
    headers: authHeaders(chilloxSession.token)
  });
  ok(8, 'Access denied with 404 Not Found', res8.status === 404, `got ${res8.status}`);
  ok(8, 'Returns success: false', res8.body.success === false);

  // Also test accepting another shop's order
  const res8Accept = await http(`/api/shops/orders/${testOrderId}/accept`, {
    method: 'PATCH',
    headers: authHeaders(chilloxSession.token)
  });
  ok(8, 'Cross-shop accept denied with 404 Not Found', res8Accept.status === 404, `got ${res8Accept.status}`);

  // ──────────────────────────────────────────────────────────────────────────
  // Step 9: Test no JWT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 9: Test no JWT ---');
  const res9List = await http('/api/shops/orders');
  ok(9, 'No JWT on list returns 401 Unauthorized', res9List.status === 401, `got ${res9List.status}`);

  const res9Single = await http(`/api/shops/orders/${testOrderId}`);
  ok(9, 'No JWT on single order returns 401 Unauthorized', res9Single.status === 401, `got ${res9Single.status}`);

  const res9Accept = await http(`/api/shops/orders/${testOrderId}/accept`, { method: 'PATCH' });
  ok(9, 'No JWT on accept returns 401 Unauthorized', res9Accept.status === 401, `got ${res9Accept.status}`);

  // ──────────────────────────────────────────────────────────────────────────
  // Step 10: Test Student JWT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 10: Test Student JWT ---');
  const res10List = await http('/api/shops/orders', {
    headers: authHeaders(studentSession.token)
  });
  ok(10, 'Student token on list returns 403 Forbidden', res10List.status === 403, `got ${res10List.status}`);

  const res10Single = await http(`/api/shops/orders/${testOrderId}`, {
    headers: authHeaders(studentSession.token)
  });
  ok(10, 'Student token on single order returns 403 Forbidden', res10Single.status === 403, `got ${res10Single.status}`);

  const res10Accept = await http(`/api/shops/orders/${testOrderId}/accept`, {
    method: 'PATCH',
    headers: authHeaders(studentSession.token)
  });
  ok(10, 'Student token on accept returns 403 Forbidden', res10Accept.status === 403, `got ${res10Accept.status}`);

  // ──────────────────────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n=============================================================');
  console.log(` RESULT: ${passed} PASSED, ${failed} FAILED across all 10 steps`);
  console.log('=============================================================\n');

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
