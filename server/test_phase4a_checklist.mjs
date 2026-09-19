/**
 * Phase 4A — Start Preparing Order Test Suite
 *
 * Tests:
 *  1. CONFIRMED order         → 200, status = PREPARING
 *  2. Timeline entry added    → { status: 'PREPARING' }
 *  3. PLACED order            → 400 (only CONFIRMED allowed)
 *  4. PREPARING order again   → 400 (duplicate transition blocked)
 *  5. Another Shop's order    → 404 (strict ownership)
 *  6. Nonexistent valid ObjectId → 404
 *  7. Malformed orderId       → 404 (no 500 CastError crash)
 *  8. Singular route alias    → 200 (/api/shop/orders/:id/preparing)
 *  9. No JWT                  → 401
 * 10. Student JWT             → 403
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

async function getMyShop(token) {
  const r = await http('/api/shops/my-shop', { headers: authHeaders(token) });
  if (!r.body.shop) throw new Error('Could not fetch my-shop: ' + JSON.stringify(r.body));
  return r.body;
}

async function topUp(token, amount) {
  await http('/api/wallet/topup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ amount })
  });
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

async function acceptOrder(token, orderId) {
  const r = await http(`/api/shops/orders/${orderId}/accept`, {
    method: 'PATCH',
    headers: authHeaders(token)
  });
  if (r.body.order?.status !== 'CONFIRMED') throw new Error('Accept failed: ' + JSON.stringify(r.body));
  return r.body.order;
}

(async () => {
  console.log('\n================================================');
  console.log(' Phase 4A — Start Preparing Order Tests');
  console.log('================================================\n');

  // ── Login ──────────────────────────────────────────────────────────────────
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const shop2Session   = await login('chillox@uiu.ac.bd', 'password123');
  const studentSession = await login('student@uiu.ac.bd', 'password123');

  const { shop, menuItems } = await getMyShop(shopSession.token);
  const { shop: shop2 }     = await getMyShop(shop2Session.token);

  const testItem = menuItems?.[0];
  if (!testItem) throw new Error('No menu items found for shop');

  console.log(`  Shop 1  : ${shop.name} (ID: ${shop._id})`);
  console.log(`  Shop 2  : ${shop2.name} (ID: ${shop2._id})`);
  console.log(`  Item    : ${testItem.name} @ ৳${testItem.price}\n`);

  // Ensure sufficient wallet balance
  const walletRes = await http('/api/wallet/balance', { headers: authHeaders(studentSession.token) });
  if ((walletRes.body.walletBalance || 0) < 400) {
    await topUp(studentSession.token, 500);
  }

  // ── Setup: Place + Accept an order → CONFIRMED ────────────────────────────
  console.log('-- Setup: Place + Accept order to get CONFIRMED status --');
  const placedOrder = await placeOrder(studentSession.token, shop._id, testItem._id, testItem.name, testItem.price);
  const confirmedOrder = await acceptOrder(shopSession.token, placedOrder._id);
  console.log(`  Order ${confirmedOrder.orderNumber} is now CONFIRMED\n`);

  // ── Test 1: CONFIRMED order → 200, status = PREPARING ────────────────────
  console.log('-- Test 1: CONFIRMED Order → 200 (CONFIRMED → PREPARING) --');
  const prepRes = await http(`/api/shops/orders/${confirmedOrder._id}/preparing`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shopSession.token) }
  });
  ok('HTTP 200 OK', prepRes.status === 200, `got ${prepRes.status}`);
  ok('success: true', prepRes.body.success === true);
  ok('status transitioned to PREPARING', prepRes.body.order?.status === 'PREPARING',
    `got: ${prepRes.body.order?.status}`);
  ok('message confirms preparing', prepRes.body.message?.toLowerCase().includes('prepar'));

  // ── Test 2: Timeline entry ─────────────────────────────────────────────────
  console.log('\n-- Test 2: Timeline Entry --');
  const timeline = prepRes.body.order?.timeline || [];
  const prepEntry = timeline.find(t => t.status === 'PREPARING');
  ok('Timeline contains PREPARING entry', Boolean(prepEntry));
  ok('Timeline entry has timestamp', Boolean(prepEntry?.time));

  // ── Test 3: PLACED order → 400 ────────────────────────────────────────────
  console.log('\n-- Test 3: PLACED Order → 400 --');
  const placedOrder2 = await placeOrder(studentSession.token, shop._id, testItem._id, testItem.name, testItem.price);
  const placedRes = await http(`/api/shops/orders/${placedOrder2._id}/preparing`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shopSession.token) }
  });
  ok('PLACED order → 400 Bad Request', placedRes.status === 400, `got ${placedRes.status}`);
  ok('Error message: only CONFIRMED', placedRes.body.message?.toLowerCase().includes('confirmed'),
    `msg: ${placedRes.body.message}`);

  // ── Test 4: PREPARING order again → 400 (duplicate) ──────────────────────
  console.log('\n-- Test 4: PREPARING Order Again → 400 --');
  const dupRes = await http(`/api/shops/orders/${confirmedOrder._id}/preparing`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shopSession.token) }
  });
  ok('Duplicate PREPARING → 400 Bad Request', dupRes.status === 400, `got ${dupRes.status}`);
  ok('Error message: only CONFIRMED', dupRes.body.message?.toLowerCase().includes('confirmed'),
    `msg: ${dupRes.body.message}`);

  // ── Test 5: Another Shop's order → 404 ────────────────────────────────────
  console.log('\n-- Test 5: Cross-Shop Ownership → 404 --');
  const crossRes = await http(`/api/shops/orders/${confirmedOrder._id}/preparing`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shop2Session.token) }
  });
  ok('Cross-shop → 404 Not Found', crossRes.status === 404, `got ${crossRes.status}`);
  ok('success: false', crossRes.body.success === false);

  // ── Test 6: Nonexistent valid ObjectId → 404 ──────────────────────────────
  console.log('\n-- Test 6: Nonexistent Order → 404 --');
  const fakeId = '6aaaaaaaaaaaaaaaaaaaaa00';
  const fakeRes = await http(`/api/shops/orders/${fakeId}/preparing`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Nonexistent order → 404', fakeRes.status === 404, `got ${fakeRes.status}`);

  // ── Test 7: Malformed orderId → 404 (not 500) ─────────────────────────────
  console.log('\n-- Test 7: Malformed Order ID → 404 (no 500 crash) --');
  const badRes = await http(`/api/shops/orders/not-a-valid-id/preparing`, {
    method: 'PATCH',
    headers: authHeaders(shopSession.token)
  });
  ok('Malformed ID → 404 (no 500 crash)', badRes.status === 404, `got ${badRes.status}`);

  // ── Test 8: Singular route alias → 200 ────────────────────────────────────
  console.log('\n-- Test 8: Singular Route Alias (/api/shop/orders/.../preparing) --');
  // Need a fresh CONFIRMED order for the alias test
  const aliasPlaced = await placeOrder(studentSession.token, shop._id, testItem._id, testItem.name, testItem.price);
  const aliasConfirmed = await acceptOrder(shopSession.token, aliasPlaced._id);
  const aliasRes = await http(`/api/shop/orders/${aliasConfirmed._id}/preparing`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shopSession.token) }
  });
  ok('Singular alias → 200', aliasRes.status === 200, `got ${aliasRes.status}`);
  ok('Order status = PREPARING via alias', aliasRes.body.order?.status === 'PREPARING');

  // ── Test 9: No JWT → 401 ─────────────────────────────────────────────────
  console.log('\n-- Test 9: No JWT → 401 --');
  const noJwtRes = await http(`/api/shops/orders/${confirmedOrder._id}/preparing`, { method: 'PATCH' });
  ok('No JWT → 401 Unauthorized', noJwtRes.status === 401, `got ${noJwtRes.status}`);

  // ── Test 10: Student JWT → 403 ────────────────────────────────────────────
  console.log('\n-- Test 10: Student JWT → 403 --');
  const studentRes = await http(`/api/shops/orders/${confirmedOrder._id}/preparing`, {
    method: 'PATCH',
    headers: authHeaders(studentSession.token)
  });
  ok('Student JWT → 403 Forbidden', studentRes.status === 403, `got ${studentRes.status}`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n================================================');
  console.log(` RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================\n');

  if (failed > 0) process.exit(1);
})().catch(err => {
  console.error('\nTest suite crashed:', err.message);
  process.exit(1);
});
