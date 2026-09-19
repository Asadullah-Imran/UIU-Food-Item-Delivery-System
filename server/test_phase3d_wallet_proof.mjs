/**
 * Phase 3D — Step 8: Exact Wallet Arithmetic Proof
 *
 * Verifies the full refund cycle with exact balance tracking:
 *   1. Own PLACED order         → 200, status = REJECTED
 *   2. Order status             → REJECTED
 *   3. Student wallet           → increased by EXACT refund amount
 *   4. Transaction              → REFUND entry created (type=REFUND, direction=CREDIT)
 *   5. Timeline                 → REJECTED entry added
 *   6. Reject same order again  → 400 Bad Request
 *   7. Another Shop's order     → 404 Not Found
 *   8. No JWT                   → 401 Unauthorized
 *   9. Student JWT              → 403 Forbidden
 *  10. Wallet proof             → wallet_before_purchase - order_total + refund = wallet_before_purchase
 */

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

async function getWallet(token) {
  const r = await http('/api/wallet/balance', { headers: authHeaders(token) });
  if (r.body.walletBalance === undefined) throw new Error('Cannot fetch wallet: ' + JSON.stringify(r.body));
  return r.body.walletBalance;
}

async function topUp(token, amount) {
  const r = await http('/api/wallet/topup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ amount })
  });
  return r.body;
}

async function placeOrder(token, shopId, itemId, itemName, price) {
  const r = await http('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({
      shopId,
      items: [{ id: itemId, name: itemName, price, quantity: 1, image: '' }],
      deliveryAddress: { building: 'Test Block', room: '101', dropOffNote: 'Leave at door' }
    })
  });
  if (!r.body.order) throw new Error('Order placement failed: ' + JSON.stringify(r.body));
  return r.body.order;
}

async function getMyShop(token) {
  const r = await http('/api/shops/my-shop', { headers: authHeaders(token) });
  if (!r.body.shop) throw new Error('Could not fetch my-shop: ' + JSON.stringify(r.body));
  return r.body;
}

async function getShopMenu(shopId) {
  const r = await http(`/api/shops/${shopId}`);
  return r.body.menuItems || r.body.items || [];
}

(async () => {
  console.log('\n================================================');
  console.log(' Phase 3D Step 8 — Wallet Arithmetic Proof Test');
  console.log('================================================\n');

  // ── Login ──────────────────────────────────────────────────────────────────
  const studentSession = await login('student@uiu.ac.bd', 'password123');
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const shop2Session   = await login('chillox@uiu.ac.bd', 'password123');
  const { shop }       = await getMyShop(shopSession.token);
  const { shop: shop2 }= await getMyShop(shop2Session.token);

  const items = await getShopMenu(shop._id);
  const testItem = items.find(i => i.isAvailable && i.price > 0) || items[0];
  if (!testItem) throw new Error('No menu items found for Chef\'s Table');

  console.log(`  Shop 1 : ${shop.name} (ID: ${shop._id})`);
  console.log(`  Shop 2 : ${shop2.name} (ID: ${shop2._id})`);
  console.log(`  Test Item : ${testItem.name} @ ৳${testItem.price}`);

  // ── Ensure sufficient wallet balance ──────────────────────────────────────
  const currentWallet = await getWallet(studentSession.token);
  if (currentWallet < 500) {
    const needed = 500 - currentWallet;
    await topUp(studentSession.token, needed);
    console.log(`  Topped up ৳${needed} to reach ৳500 base balance`);
  }

  // Record wallet BEFORE purchase (our baseline)
  const walletBeforePurchase = await getWallet(studentSession.token);
  console.log(`\n  Wallet BEFORE purchase : ৳${walletBeforePurchase}`);

  // ── Place a fresh order ────────────────────────────────────────────────────
  const order = await placeOrder(studentSession.token, shop._id, testItem._id, testItem.name, testItem.price);
  const orderTotal = order.billing?.grandTotal || 0;

  const walletAfterPurchase = await getWallet(studentSession.token);
  const expectedAfterPurchase = walletBeforePurchase - orderTotal;
  console.log(`  Order placed           : ${order.orderNumber} (total: ৳${orderTotal})`);
  console.log(`  Wallet AFTER purchase  : ৳${walletAfterPurchase} (expected: ৳${expectedAfterPurchase})`);

  // ── Test 1: Own PLACED order → 200 ────────────────────────────────────────
  console.log('\n-- Test 1: Own PLACED Order → 200 --');
  const rejectRes = await http(`/api/shops/orders/${order._id}/reject`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shopSession.token) },
    body: JSON.stringify({ reason: 'Kitchen is at full capacity right now' })
  });
  ok('HTTP 200 OK', rejectRes.status === 200, `got ${rejectRes.status}`);
  ok('success: true', rejectRes.body.success === true);

  // ── Test 2: Order status = REJECTED ───────────────────────────────────────
  console.log('\n-- Test 2: Order Status --');
  ok('status is REJECTED', rejectRes.body.order?.status === 'REJECTED',
    `got: ${rejectRes.body.order?.status}`);

  // ── Test 3: Student wallet increased by EXACT refund amount ───────────────
  console.log('\n-- Test 3: Student Wallet Exact Arithmetic --');
  const walletAfterRefund = await getWallet(studentSession.token);
  const refundedAmount = rejectRes.body.refundAmount || rejectRes.body.refund?.refundAmount || 0;

  console.log(`  Wallet BEFORE purchase : ৳${walletBeforePurchase}`);
  console.log(`  Order total            : ৳${orderTotal}`);
  console.log(`  Wallet AFTER purchase  : ৳${walletAfterPurchase}`);
  console.log(`  Refund amount          : ৳${refundedAmount}`);
  console.log(`  Wallet AFTER refund    : ৳${walletAfterRefund}`);

  ok('Wallet deducted correctly after purchase',
    walletAfterPurchase === expectedAfterPurchase,
    `expected ৳${expectedAfterPurchase}, got ৳${walletAfterPurchase}`);

  ok('Wallet refunded by exact order total',
    walletAfterRefund === walletAfterPurchase + orderTotal,
    `expected ৳${walletAfterPurchase + orderTotal}, got ৳${walletAfterRefund}`);

  ok('Wallet fully restored to pre-purchase balance',
    walletAfterRefund === walletBeforePurchase,
    `before: ৳${walletBeforePurchase}, after refund: ৳${walletAfterRefund}`);

  ok('Refund amount in response matches order total',
    Number(refundedAmount) === Number(orderTotal),
    `refundAmount: ৳${refundedAmount}, orderTotal: ৳${orderTotal}`);

  // ── Test 4: REFUND transaction created ────────────────────────────────────
  console.log('\n-- Test 4: REFUND Transaction --');
  const refundTxn = rejectRes.body.refundTxn || rejectRes.body.refund?.refundTxn;
  ok('REFUND transaction exists in response', Boolean(refundTxn));
  ok('Transaction type = REFUND', refundTxn?.type === 'REFUND', `got: ${refundTxn?.type}`);
  ok('Transaction direction = CREDIT', refundTxn?.direction === 'CREDIT', `got: ${refundTxn?.direction}`);
  ok('Transaction amount matches order total',
    Number(refundTxn?.amount) === Number(orderTotal),
    `txn: ৳${refundTxn?.amount}, order: ৳${orderTotal}`);
  ok('Transaction status = COMPLETED', refundTxn?.status === 'COMPLETED', `got: ${refundTxn?.status}`);
  ok('Transaction balanceAfter = wallet after refund',
    Number(refundTxn?.balanceAfter) === Number(walletAfterRefund),
    `txn.balanceAfter: ৳${refundTxn?.balanceAfter}, actual: ৳${walletAfterRefund}`);

  // ── Test 5: Timeline has REJECTED entry ───────────────────────────────────
  console.log('\n-- Test 5: Order Timeline --');
  const timeline = rejectRes.body.order?.timeline || [];
  const rejectedEntry = timeline.find(t => t.status === 'REJECTED');
  ok('Timeline contains REJECTED entry', Boolean(rejectedEntry));
  ok('Timeline note contains rejection reason',
    rejectedEntry?.note?.includes('Kitchen') || rejectedEntry?.note?.length > 0,
    `note: ${rejectedEntry?.note}`);

  // ── Test 6: Reject same order again → 400 ─────────────────────────────────
  console.log('\n-- Test 6: Reject Same Order Again → 400 --');
  const dupRes = await http(`/api/shops/orders/${order._id}/reject`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shopSession.token) }
  });
  ok('Duplicate reject → 400 Bad Request', dupRes.status === 400, `got: ${dupRes.status}`);
  ok('Error message: only PLACED orders', dupRes.body.message?.includes('Only placed orders'), `msg: ${dupRes.body.message}`);

  // Verify wallet was NOT touched by the duplicate attempt
  const walletAfterDup = await getWallet(studentSession.token);
  ok('Wallet NOT double-refunded on duplicate reject',
    walletAfterDup === walletAfterRefund,
    `after dup: ৳${walletAfterDup}, expected: ৳${walletAfterRefund}`);

  // ── Test 7: Another Shop's order → 404 ────────────────────────────────────
  console.log('\n-- Test 7: Another Shop Cannot Reject (Cross-Ownership) → 404 --');
  // Place a new order for cross-shop test
  const crossOrder = await placeOrder(studentSession.token, shop._id, testItem._id, testItem.name, testItem.price);
  const crossRes = await http(`/api/shops/orders/${crossOrder._id}/reject`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shop2Session.token) }
  });
  ok('Cross-shop reject → 404 Not Found', crossRes.status === 404, `got: ${crossRes.status}`);
  ok('success: false', crossRes.body.success === false);

  // ── Test 8: No JWT → 401 ─────────────────────────────────────────────────
  console.log('\n-- Test 8: No JWT → 401 --');
  const noJwtRes = await http(`/api/shops/orders/${crossOrder._id}/reject`, { method: 'PATCH' });
  ok('No JWT → 401 Unauthorized', noJwtRes.status === 401, `got: ${noJwtRes.status}`);

  // ── Test 9: Student JWT → 403 ────────────────────────────────────────────
  console.log('\n-- Test 9: Student JWT → 403 --');
  const studentJwtRes = await http(`/api/shops/orders/${crossOrder._id}/reject`, {
    method: 'PATCH',
    headers: authHeaders(studentSession.token)
  });
  ok('Student JWT → 403 Forbidden', studentJwtRes.status === 403, `got: ${studentJwtRes.status}`);

  // ── Final wallet proof summary ────────────────────────────────────────────
  console.log('\n================================================');
  console.log('  Wallet Proof Summary');
  console.log('================================================');
  console.log(`  Wallet BEFORE purchase : ৳${walletBeforePurchase}`);
  console.log(`  Order total            : ৳${orderTotal}`);
  console.log(`  Wallet AFTER purchase  : ৳${walletAfterPurchase}`);
  console.log(`  Refund from rejection  : ৳${refundedAmount}`);
  console.log(`  Wallet AFTER refund    : ৳${walletAfterRefund}`);
  console.log(`  Balance restored?      : ${walletAfterRefund === walletBeforePurchase ? '✅ YES' : '❌ NO'}`);

  console.log('\n================================================');
  console.log(` RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================\n');

  if (failed > 0) process.exit(1);
})().catch(err => {
  console.error('Test suite crashed:', err.message);
  process.exit(1);
});
