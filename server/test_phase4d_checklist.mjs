/**
 * Phase 4D — Ready-for-Pickup Queue Test Suite
 *
 * Tests:
 *  1. Login as Shop 1, Shop 2, Student
 *  2. Advance order from PLACED -> CONFIRMED -> PREPARING -> READY_FOR_PICKUP
 *  3. GET /api/shops/orders?status=READY_FOR_PICKUP returns 200 and includes ready order
 *  4. Status filter accuracy: all returned orders have status === 'READY_FOR_PICKUP'
 *  5. Population check: student (name, email, phone), items, shop
 *  6. Cross-shop isolation: Shop 1 does NOT see Shop 2's ready orders
 *  7. Singular route alias: GET /api/shop/orders?status=READY_FOR_PICKUP returns 200
 *  8. No JWT -> 401 Unauthorized
 *  9. Student JWT -> 403 Forbidden
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
      deliveryAddress: { building: 'Academic Building', room: '412', dropOffNote: 'Leave at door' }
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

(async () => {
  console.log('\n================================================');
  console.log(' Phase 4D — Ready-for-Pickup Queue Tests');
  console.log('================================================\n');

  try {
    // ── 1. Sessions & Setup ───────────────────────────────────────────────────
    const shop1Session   = await login('shop@uiu.ac.bd', 'password123');
    const shop2Session   = await login('chillox@uiu.ac.bd', 'password123');
    const studentSession = await login('student@uiu.ac.bd', 'password123');

    const { shop: shop1, menuItems: items1 } = await getMyShop(shop1Session.token);
    const { shop: shop2, menuItems: items2 } = await getMyShop(shop2Session.token);

    const item1 = items1?.[0];
    const item2 = items2?.[0];

    if (!item1 || !item2) throw new Error('Menu items not found for testing');

    console.log(`  Shop 1 : ${shop1.name}`);
    console.log(`  Shop 2 : ${shop2.name}\n`);

    await topUp(studentSession.token, 5000);

    // ── 2. Create and Advance an Order to READY_FOR_PICKUP for Shop 1 ─────────
    console.log('--- Advancing Order for Shop 1: PLACED -> CONFIRMED -> PREPARING -> READY_FOR_PICKUP ---');
    const placed1 = await placeOrder(studentSession.token, shop1._id, item1._id, item1.name, item1.price);
    ok('Shop 1 Order placed', placed1.status === 'PLACED', placed1.orderNumber);

    const conf1 = await patch(`/api/shops/orders/${placed1._id}/accept`, shop1Session.token);
    ok('Shop 1 Order accepted', conf1.status === 200 && conf1.body.order?.status === 'CONFIRMED');

    const prep1 = await patch(`/api/shops/orders/${placed1._id}/preparing`, shop1Session.token);
    ok('Shop 1 Order preparing', prep1.status === 200 && prep1.body.order?.status === 'PREPARING');

    const ready1 = await patch(`/api/shops/orders/${placed1._id}/ready`, shop1Session.token);
    ok('Shop 1 Order marked ready', ready1.status === 200 && ready1.body.order?.status === 'READY_FOR_PICKUP');

    // ── 3. GET /api/shops/orders?status=READY_FOR_PICKUP ─────────────────────
    console.log('\n--- GET /api/shops/orders?status=READY_FOR_PICKUP for Shop 1 ---');
    const queueRes = await http('/api/shops/orders?status=READY_FOR_PICKUP', {
      headers: authHeaders(shop1Session.token)
    });

    ok('Queue endpoint returns 200', queueRes.status === 200);
    ok('Queue response has success: true', queueRes.body.success === true);
    ok('Queue response returns orders array', Array.isArray(queueRes.body.orders));

    const readyOrders = queueRes.body.orders || [];
    ok('Queue contains at least 1 order', readyOrders.length >= 1, `count: ${readyOrders.length}`);

    const foundTarget = readyOrders.find((o) => o._id === placed1._id);
    ok('Newly ready order is in the handoff queue', !!foundTarget, placed1.orderNumber);

    // ── 4. Status Filter Accuracy ─────────────────────────────────────────────
    console.log('\n--- Filter Accuracy Check ---');
    const nonReadyOrders = readyOrders.filter((o) => o.status !== 'READY_FOR_PICKUP');
    ok('All orders in queue strictly have status READY_FOR_PICKUP', nonReadyOrders.length === 0);

    // ── 5. Population Verification ────────────────────────────────────────────
    console.log('\n--- Relationship Population Check ---');
    if (foundTarget) {
      ok('Student name populated', !!foundTarget.student?.name, foundTarget.student?.name);
      ok('Student phone or email populated', !!(foundTarget.student?.phone || foundTarget.student?.email));
      ok('Items list present', Array.isArray(foundTarget.items) && foundTarget.items.length > 0);
      ok('Shop populated', !!foundTarget.shop?.name, foundTarget.shop?.name);
    }

    // ── 6. Cross-Shop Isolation ───────────────────────────────────────────────
    console.log('\n--- Cross-Shop Isolation Check ---');
    // Advance an order for Shop 2
    const placed2 = await placeOrder(studentSession.token, shop2._id, item2._id, item2.name, item2.price);
    await patch(`/api/shops/orders/${placed2._id}/accept`, shop2Session.token);
    await patch(`/api/shops/orders/${placed2._id}/preparing`, shop2Session.token);
    const ready2 = await patch(`/api/shops/orders/${placed2._id}/ready`, shop2Session.token);
    ok('Shop 2 Order marked ready', ready2.status === 200 && ready2.body.order?.status === 'READY_FOR_PICKUP');

    // Shop 1 must NOT see Shop 2's ready order
    const shop1Recheck = await http('/api/shops/orders?status=READY_FOR_PICKUP', {
      headers: authHeaders(shop1Session.token)
    });
    const leakedToShop1 = (shop1Recheck.body.orders || []).some((o) => o._id === placed2._id);
    ok('Shop 1 does NOT see Shop 2 ready order (strict ownership)', !leakedToShop1);

    // Shop 2 MUST see its own ready order
    const shop2Queue = await http('/api/shops/orders?status=READY_FOR_PICKUP', {
      headers: authHeaders(shop2Session.token)
    });
    const foundInShop2 = (shop2Queue.body.orders || []).some((o) => o._id === placed2._id);
    ok('Shop 2 sees its own ready order in queue', foundInShop2);

    // ── 7. Singular Route Alias (/api/shop/orders) ───────────────────────────
    console.log('\n--- Route Aliases & Security ---');
    const singularRes = await http('/api/shop/orders?status=READY_FOR_PICKUP', {
      headers: authHeaders(shop1Session.token)
    });
    ok('Singular alias /api/shop/orders?status=READY_FOR_PICKUP returns 200', singularRes.status === 200);

    // ── 8. Authentication & Authorization Guards ─────────────────────────────
    const noAuth = await http('/api/shops/orders?status=READY_FOR_PICKUP');
    ok('No JWT returns 401 Unauthorized', noAuth.status === 401);

    const studentAuth = await http('/api/shops/orders?status=READY_FOR_PICKUP', {
      headers: authHeaders(studentSession.token)
    });
    ok('Student JWT returns 403 Forbidden', studentAuth.status === 403);

    console.log('\n================================================');
    console.log(` Results: ${passed} passed, ${failed} failed`);
    console.log('================================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
})();
