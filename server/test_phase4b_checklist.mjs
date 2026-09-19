/**
 * Phase 4B — Mark Ready for Pickup Test Suite
 *
 * Tests:
 *  1. PREPARING order         → 200, status = READY_FOR_PICKUP
 *  2. Timeline entry added    → { status: 'READY_FOR_PICKUP' }
 *  3. CONFIRMED order         → 400 (only PREPARING allowed)
 *  4. PLACED order            → 400 (only PREPARING allowed)
 *  5. READY_FOR_PICKUP again  → 400 (duplicate transition blocked)
 *  6. Another Shop's order    → 404 (strict ownership)
 *  7. Nonexistent valid ObjectId → 404
 *  8. Malformed orderId       → 404 (no 500 CastError crash)
 *  9. Singular route alias    → 200 (/api/shop/orders/:id/ready)
 * 10. No JWT                  → 401
 * 11. Student JWT             → 403
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
      deliveryAddress: { building: 'Test Block', room: '101', dropOffNote: '' }
    })
  });
  if (!r.body.order) throw new Error('Order placement failed: ' + JSON.stringify(r.body));
  return r.body.order;
}

async function patch(url, token) {
  return http(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) }
  });
}

// Advance an order through the lifecycle to a given target status
async function advanceTo(targetStatus, shopToken, studentToken, shopId, itemId, itemName, price) {
  const placed = await placeOrder(studentToken, shopId, itemId, itemName, price);
  if (targetStatus === 'PLACED') return placed;

  const accepted = await patch(`/api/shops/orders/${placed._id}/accept`, shopToken);
  if (targetStatus === 'CONFIRMED') return accepted.body.order;

  const preparing = await patch(`/api/shops/orders/${placed._id}/preparing`, shopToken);
  if (targetStatus === 'PREPARING') return preparing.body.order;

  const ready = await patch(`/api/shops/orders/${placed._id}/ready`, shopToken);
  if (targetStatus === 'READY_FOR_PICKUP') return ready.body.order;
}

(async () => {
  console.log('\n================================================');
  console.log(' Phase 4B — Mark Ready for Pickup Tests');
  console.log('================================================\n');

  // ── Login ──────────────────────────────────────────────────────────────────
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const shop2Session   = await login('chillox@uiu.ac.bd', 'password123');
  const studentSession = await login('student@uiu.ac.bd', 'password123');

  const { shop, menuItems } = await getMyShop(shopSession.token);
  const { shop: shop2 }     = await getMyShop(shop2Session.token);
  const testItem = menuItems?.[0];
  if (!testItem) throw new Error('No menu items found');

  console.log(`  Shop 1  : ${shop.name}`);
  console.log(`  Shop 2  : ${shop2.name}`);
  console.log(`  Item    : ${testItem.name} @ ৳${testItem.price}\n`);

  // Ensure wallet has enough balance for multiple orders
  const walletRes = await http('/api/wallet/balance', { headers: authHeaders(studentSession.token) });
  if ((walletRes.body.walletBalance || 0) < 800) {
    await topUp(studentSession.token, 800);
    console.log('  Wallet topped up\n');
  }

  // ── Setup: Advance an order to PREPARING ──────────────────────────────────
  console.log('-- Setup: Advance order to PREPARING --');
  const preparingOrder = await advanceTo('PREPARING', shopSession.token, studentSession.token,
    shop._id, testItem._id, testItem.name, testItem.price);
  console.log(`  Order ${preparingOrder.orderNumber} is now PREPARING\n`);

  // ── Test 1: PREPARING order → 200, status = READY_FOR_PICKUP ─────────────
  console.log('-- Test 1: PREPARING Order → 200 (PREPARING → READY_FOR_PICKUP) --');
  const readyRes = await patch(`/api/shops/orders/${preparingOrder._id}/ready`, shopSession.token);
  ok('HTTP 200 OK', readyRes.status === 200, `got ${readyRes.status}`);
  ok('success: true', readyRes.body.success === true);
  ok('status = READY_FOR_PICKUP', readyRes.body.order?.status === 'READY_FOR_PICKUP',
    `got: ${readyRes.body.order?.status}`);
  ok('message confirms ready', readyRes.body.message?.toLowerCase().includes('ready'));

  // ── Test 2: Timeline entry ─────────────────────────────────────────────────
  console.log('\n-- Test 2: Timeline Entry --');
  const timeline = readyRes.body.order?.timeline || [];
  const readyEntry = timeline.find(t => t.status === 'READY_FOR_PICKUP');
  ok('Timeline contains READY_FOR_PICKUP entry', Boolean(readyEntry));
  ok('Timeline entry has timestamp', Boolean(readyEntry?.time));

  // ── Test 3: CONFIRMED order → 400 ─────────────────────────────────────────
  console.log('\n-- Test 3: CONFIRMED Order → 400 --');
  const confirmedOrder = await advanceTo('CONFIRMED', shopSession.token, studentSession.token,
    shop._id, testItem._id, testItem.name, testItem.price);
  const confirmedRes = await patch(`/api/shops/orders/${confirmedOrder._id}/ready`, shopSession.token);
  ok('CONFIRMED → ready = 400', confirmedRes.status === 400, `got ${confirmedRes.status}`);
  ok('Error: only PREPARING orders',
    confirmedRes.body.message?.toLowerCase().includes('preparing'),
    `msg: ${confirmedRes.body.message}`);

  // ── Test 4: PLACED order → 400 ────────────────────────────────────────────
  console.log('\n-- Test 4: PLACED Order → 400 --');
  const placedOrder = await advanceTo('PLACED', shopSession.token, studentSession.token,
    shop._id, testItem._id, testItem.name, testItem.price);
  const placedRes = await patch(`/api/shops/orders/${placedOrder._id}/ready`, shopSession.token);
  ok('PLACED → ready = 400', placedRes.status === 400, `got ${placedRes.status}`);
  ok('Error: only PREPARING orders',
    placedRes.body.message?.toLowerCase().includes('preparing'),
    `msg: ${placedRes.body.message}`);

  // ── Test 5: READY_FOR_PICKUP again → 400 ──────────────────────────────────
  console.log('\n-- Test 5: READY_FOR_PICKUP Again → 400 --');
  const dupRes = await patch(`/api/shops/orders/${preparingOrder._id}/ready`, shopSession.token);
  ok('Duplicate READY → 400', dupRes.status === 400, `got ${dupRes.status}`);
  ok('Error: only PREPARING orders',
    dupRes.body.message?.toLowerCase().includes('preparing'),
    `msg: ${dupRes.body.message}`);

  // ── Test 6: Another Shop's order → 404 ────────────────────────────────────
  console.log('\n-- Test 6: Cross-Shop Ownership → 404 --');
  // Advance a fresh order to PREPARING under shop1
  const crossOrder = await advanceTo('PREPARING', shopSession.token, studentSession.token,
    shop._id, testItem._id, testItem.name, testItem.price);
  const crossRes = await patch(`/api/shops/orders/${crossOrder._id}/ready`, shop2Session.token);
  ok('Cross-shop → 404', crossRes.status === 404, `got ${crossRes.status}`);
  ok('success: false', crossRes.body.success === false);

  // ── Test 7: Nonexistent valid ObjectId → 404 ──────────────────────────────
  console.log('\n-- Test 7: Nonexistent Order → 404 --');
  const fakeRes = await patch(`/api/shops/orders/6aaaaaaaaaaaaaaaaaaaaa00/ready`, shopSession.token);
  ok('Nonexistent order → 404', fakeRes.status === 404, `got ${fakeRes.status}`);

  // ── Test 8: Malformed orderId → 404 (not 500) ─────────────────────────────
  console.log('\n-- Test 8: Malformed Order ID → 404 --');
  const badRes = await patch(`/api/shops/orders/not-valid-id/ready`, shopSession.token);
  ok('Malformed ID → 404 (no 500)', badRes.status === 404, `got ${badRes.status}`);

  // ── Test 9: Singular route alias → 200 ────────────────────────────────────
  console.log('\n-- Test 9: Singular Route Alias (/api/shop/orders/.../ready) --');
  const aliasOrder = await advanceTo('PREPARING', shopSession.token, studentSession.token,
    shop._id, testItem._id, testItem.name, testItem.price);
  const aliasRes = await http(`/api/shop/orders/${aliasOrder._id}/ready`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(shopSession.token) }
  });
  ok('Singular alias → 200', aliasRes.status === 200, `got ${aliasRes.status}`);
  ok('Order status = READY_FOR_PICKUP via alias', aliasRes.body.order?.status === 'READY_FOR_PICKUP');

  // ── Test 10: No JWT → 401 ─────────────────────────────────────────────────
  console.log('\n-- Test 10: No JWT → 401 --');
  const noJwtRes = await http(`/api/shops/orders/${preparingOrder._id}/ready`, { method: 'PATCH' });
  ok('No JWT → 401', noJwtRes.status === 401, `got ${noJwtRes.status}`);

  // ── Test 11: Student JWT → 403 ────────────────────────────────────────────
  console.log('\n-- Test 11: Student JWT → 403 --');
  const studentRes = await patch(`/api/shops/orders/${preparingOrder._id}/ready`, studentSession.token);
  ok('Student JWT → 403', studentRes.status === 403, `got ${studentRes.status}`);

  // ── Full lifecycle summary ─────────────────────────────────────────────────
  console.log('\n================================================');
  console.log('  Full Lifecycle Chain Verified:');
  console.log('  PLACED → CONFIRMED → PREPARING → READY_FOR_PICKUP');
  console.log('================================================');
  console.log(` RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================\n');

  if (failed > 0) process.exit(1);
})().catch(err => {
  console.error('\nTest suite crashed:', err.message);
  process.exit(1);
});
