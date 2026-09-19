/**
 * Phase 4E — Timeline Verification & Transition Guard Test Suite
 *
 * Verifies:
 *  1. Step-by-step timeline entry generation:
 *     - PLACED (length 1)
 *     - CONFIRMED (length 2)
 *     - PREPARING (length 3)
 *     - READY_FOR_PICKUP (length 4)
 *  2. Timeline timestamps are valid dates and chronologically ordered
 *  3. Out-of-order transitions are strictly rejected (400 Bad Request):
 *     - PLACED -> PREPARING (blocked)
 *     - PLACED -> READY_FOR_PICKUP (blocked)
 *     - CONFIRMED -> READY_FOR_PICKUP (blocked)
 *     - Backward transitions: READY_FOR_PICKUP -> PREPARING (blocked)
 *  4. Duplicate transitions are strictly rejected (400 Bad Request):
 *     - Duplicate accept on CONFIRMED (blocked, no duplicate in timeline)
 *     - Duplicate start preparing on PREPARING (blocked, no duplicate in timeline)
 *     - Duplicate mark ready on READY_FOR_PICKUP (blocked, no duplicate in timeline)
 *  5. Database persistence: Order fetched via GET /api/shops/orders/:orderId has exact 4 timeline entries
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
      deliveryAddress: { building: 'UIU Campus', room: 'Lab 3', dropOffNote: '' }
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
  console.log(' Phase 4E — Order Timeline & Transition Guard Tests');
  console.log('================================================\n');

  try {
    // ── 1. Setup ──────────────────────────────────────────────────────────────
    const shopSession    = await login('shop@uiu.ac.bd', 'password123');
    const studentSession = await login('student@uiu.ac.bd', 'password123');

    const { shop, menuItems } = await getMyShop(shopSession.token);
    const item = menuItems?.[0];
    if (!item) throw new Error('No menu item available for test');

    await topUp(studentSession.token, 5000);

    console.log(`  Shop : ${shop.name}`);
    console.log(`  Item : ${item.name} (৳${item.price})\n`);

    // ── 2. Sequential Transitions & Timeline Structure ────────────────────────
    console.log('--- Step 1: PLACED order timeline ---');
    const order1 = await placeOrder(studentSession.token, shop._id, item._id, item.name, item.price);
    ok('Order starts with status PLACED', order1.status === 'PLACED');
    ok('Timeline array exists on creation', Array.isArray(order1.timeline));
    ok('Timeline length is 1', order1.timeline?.length === 1);
    ok('timeline[0].status === "PLACED"', order1.timeline?.[0]?.status === 'PLACED');
    ok('timeline[0].time is a valid date', Boolean(Date.parse(order1.timeline?.[0]?.time)));

    console.log('\n--- Step 2: Transition PLACED -> CONFIRMED ---');
    const confRes = await patch(`/api/shops/orders/${order1._id}/accept`, shopSession.token);
    ok('Accept returns 200', confRes.status === 200);
    const confOrder = confRes.body.order;
    ok('Status updated to CONFIRMED', confOrder.status === 'CONFIRMED');
    ok('Timeline length is 2', confOrder.timeline?.length === 2);
    ok('timeline[1].status === "CONFIRMED"', confOrder.timeline?.[1]?.status === 'CONFIRMED');
    ok('timeline[1].time is valid date', Boolean(Date.parse(confOrder.timeline?.[1]?.time)));

    const tPlaced = new Date(confOrder.timeline[0].time).getTime();
    const tConfirmed = new Date(confOrder.timeline[1].time).getTime();
    ok('Chronological order: CONFIRMED >= PLACED', tConfirmed >= tPlaced);

    console.log('\n--- Step 3: Transition CONFIRMED -> PREPARING ---');
    const prepRes = await patch(`/api/shops/orders/${order1._id}/preparing`, shopSession.token);
    ok('Preparing returns 200', prepRes.status === 200);
    const prepOrder = prepRes.body.order;
    ok('Status updated to PREPARING', prepOrder.status === 'PREPARING');
    ok('Timeline length is 3', prepOrder.timeline?.length === 3);
    ok('timeline[2].status === "PREPARING"', prepOrder.timeline?.[2]?.status === 'PREPARING');
    ok('timeline[2].time is valid date', Boolean(Date.parse(prepOrder.timeline?.[2]?.time)));

    const tPreparing = new Date(prepOrder.timeline[2].time).getTime();
    ok('Chronological order: PREPARING >= CONFIRMED', tPreparing >= tConfirmed);

    console.log('\n--- Step 4: Transition PREPARING -> READY_FOR_PICKUP ---');
    const readyRes = await patch(`/api/shops/orders/${order1._id}/ready`, shopSession.token);
    ok('Ready returns 200', readyRes.status === 200);
    const readyOrder = readyRes.body.order;
    ok('Status updated to READY_FOR_PICKUP', readyOrder.status === 'READY_FOR_PICKUP');
    ok('Timeline length is 4', readyOrder.timeline?.length === 4);
    ok('timeline[3].status === "READY_FOR_PICKUP"', readyOrder.timeline?.[3]?.status === 'READY_FOR_PICKUP');
    ok('timeline[3].time is valid date', Boolean(Date.parse(readyOrder.timeline?.[3]?.time)));

    const tReady = new Date(readyOrder.timeline[3].time).getTime();
    ok('Chronological order: READY_FOR_PICKUP >= PREPARING', tReady >= tPreparing);

    console.log('\n--- Step 5: Database Persistence Check ---');
    const fetchRes = await http(`/api/shops/orders/${order1._id}`, {
      headers: authHeaders(shopSession.token)
    });
    ok('GET /api/shops/orders/:id returns 200', fetchRes.status === 200);
    const dbTimeline = fetchRes.body.order?.timeline || [];
    ok('Persisted DB timeline length is exactly 4', dbTimeline.length === 4);
    const statuses = dbTimeline.map((t) => t.status);
    ok(
      'Exact timeline sequence: PLACED -> CONFIRMED -> PREPARING -> READY_FOR_PICKUP',
      statuses[0] === 'PLACED' &&
        statuses[1] === 'CONFIRMED' &&
        statuses[2] === 'PREPARING' &&
        statuses[3] === 'READY_FOR_PICKUP',
      statuses.join(' -> ')
    );

    // ── 3. Prevention of Out-of-Order Transitions ─────────────────────────────
    console.log('\n--- Step 6: Guard Against Out-of-Order Transitions ---');
    // Fresh PLACED order
    const order2 = await placeOrder(studentSession.token, shop._id, item._id, item.name, item.price);

    // Test 6a: PLACED -> PREPARING directly (skip CONFIRMED)
    const ooo1 = await patch(`/api/shops/orders/${order2._id}/preparing`, shopSession.token);
    ok('Blocked: PLACED -> PREPARING returns 400', ooo1.status === 400, ooo1.body.message);

    // Test 6b: PLACED -> READY_FOR_PICKUP directly (skip CONFIRMED & PREPARING)
    const ooo2 = await patch(`/api/shops/orders/${order2._id}/ready`, shopSession.token);
    ok('Blocked: PLACED -> READY_FOR_PICKUP returns 400', ooo2.status === 400, ooo2.body.message);

    // Accept it to CONFIRMED
    await patch(`/api/shops/orders/${order2._id}/accept`, shopSession.token);

    // Test 6c: CONFIRMED -> READY_FOR_PICKUP directly (skip PREPARING)
    const ooo3 = await patch(`/api/shops/orders/${order2._id}/ready`, shopSession.token);
    ok('Blocked: CONFIRMED -> READY_FOR_PICKUP returns 400', ooo3.status === 400, ooo3.body.message);

    // Advance order2 to PREPARING then READY
    await patch(`/api/shops/orders/${order2._id}/preparing`, shopSession.token);
    await patch(`/api/shops/orders/${order2._id}/ready`, shopSession.token);

    // Test 6d: READY_FOR_PICKUP -> PREPARING (backward transition)
    const backward = await patch(`/api/shops/orders/${order2._id}/preparing`, shopSession.token);
    ok('Blocked: READY_FOR_PICKUP -> PREPARING returns 400', backward.status === 400, backward.body.message);

    // ── 4. Prevention of Duplicate Transitions ────────────────────────────────
    console.log('\n--- Step 7: Guard Against Duplicate Transitions ---');
    // Fresh order for duplicate tests
    const order3 = await placeOrder(studentSession.token, shop._id, item._id, item.name, item.price);
    await patch(`/api/shops/orders/${order3._id}/accept`, shopSession.token);

    // Test 7a: Duplicate accept on CONFIRMED
    const dupAccept = await patch(`/api/shops/orders/${order3._id}/accept`, shopSession.token);
    ok('Blocked: Duplicate /accept on CONFIRMED returns 400', dupAccept.status === 400, dupAccept.body.message);

    // Advance to PREPARING
    await patch(`/api/shops/orders/${order3._id}/preparing`, shopSession.token);

    // Test 7b: Duplicate preparing on PREPARING
    const dupPrep = await patch(`/api/shops/orders/${order3._id}/preparing`, shopSession.token);
    ok('Blocked: Duplicate /preparing on PREPARING returns 400', dupPrep.status === 400, dupPrep.body.message);

    // Advance to READY_FOR_PICKUP
    await patch(`/api/shops/orders/${order3._id}/ready`, shopSession.token);

    // Test 7c: Duplicate ready on READY_FOR_PICKUP
    const dupReady = await patch(`/api/shops/orders/${order3._id}/ready`, shopSession.token);
    ok('Blocked: Duplicate /ready on READY_FOR_PICKUP returns 400', dupReady.status === 400, dupReady.body.message);

    // Verify order3 timeline still has exactly 4 items with zero duplicates
    const checkOrder3 = await http(`/api/shops/orders/${order3._id}`, {
      headers: authHeaders(shopSession.token)
    });
    const tl3 = checkOrder3.body.order?.timeline || [];
    const statusCounts = {};
    tl3.forEach((t) => { statusCounts[t.status] = (statusCounts[t.status] || 0) + 1; });
    const hasDuplicates = Object.values(statusCounts).some((cnt) => cnt > 1);
    ok('No duplicate statuses in timeline array', !hasDuplicates, `Counts: ${JSON.stringify(statusCounts)}`);

    console.log('\n================================================');
    console.log(` Results: ${passed} passed, ${failed} failed`);
    console.log('================================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
})();
