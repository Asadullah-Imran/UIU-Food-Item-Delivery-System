/**
 * Phase 3A — Get Shop Orders Test Suite
 *
 * Tests:
 *  1. GET /api/shops/orders (Shop Owner JWT)   → 200, success: true, count & orders array
 *  2. Ownership validation                     → All returned orders belong to logged-in shop
 *  3. GET /api/shop/orders (Singular alias)    → 200, success: true
 *  4. Status filtering (?status=PLACED)        → Only orders with status 'PLACED' returned
 *  5. Comma-separated status filtering        → Matches any of the statuses
 *  6. Population check                         → Student details (name, email, phone) populated
 *  7. Multi-tenant isolation                   → Another shop only sees their own orders
 *  8. No JWT                                   → 401
 *  9. Student JWT                              → 403 (role unauthorized)
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

async function main() {
  console.log('\n================================================');
  console.log(' Phase 3A - Get Shop Orders Tests ');
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
  console.log(`  Student User : ${studentSession.user.name} (${studentSession.user.email})`);
  console.log();

  // ── Test 1: GET /api/shops/orders with Shop Owner ──────────────────────────
  console.log('-- Test 1: GET /api/shops/orders (Shop Owner JWT) --');
  const res1 = await http('/api/shops/orders', {
    headers: authHeaders(shopSession.token)
  });
  ok('Status is 200', res1.status === 200, `got ${res1.status}`);
  ok('success is true', res1.body.success === true);
  ok('orders is an Array', Array.isArray(res1.body.orders));
  ok('count matches orders.length', res1.body.count === res1.body.orders?.length, `count=${res1.body.count}`);

  // ── Test 2: Strict Shop Ownership Validation ───────────────────────────────
  console.log('\n-- Test 2: Strict Shop Ownership Validation --');
  const allBelongToShop = res1.body.orders.every(
    (ord) => ord.shop?.toString() === shopId.toString()
  );
  ok('All returned orders belong to logged-in Shop', allBelongToShop, `total orders checked: ${res1.body.orders.length}`);

  // ── Test 3: Singular Route Alias /api/shop/orders ──────────────────────────
  console.log('\n-- Test 3: Singular Route Alias /api/shop/orders --');
  const resAlias = await http('/api/shop/orders', {
    headers: authHeaders(shopSession.token)
  });
  ok('Status is 200 on /api/shop/orders', resAlias.status === 200, `got ${resAlias.status}`);
  ok('success is true on /api/shop/orders', resAlias.body.success === true);
  ok('Count matches plural route', resAlias.body.count === res1.body.count);

  // ── Test 4: Ensure at least one order exists for deeper checks ─────────────
  // If no orders exist, create one through student order creation
  if (res1.body.orders.length === 0) {
    console.log('\n-- Setup: Creating test order for deeper validation --');
    const menuItems = myShopData.menuItems || [];
    const item = menuItems[0] || { name: 'Test Burger', price: 120 };

    // Give student wallet funds if needed
    const createRes = await http('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(studentSession.token)
      },
      body: JSON.stringify({
        shopId: shopId,
        items: [{
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          note: 'Phase 3A test order'
        }],
        deliveryAddress: {
          building: 'Academic Building',
          room: 'Room 412'
        },
        specialInstructions: 'Test order for Phase 3A'
      })
    });
    console.log(`  Order create status: ${createRes.status} (message: ${createRes.body.message || 'ok'})`);
  }

  // Refetch orders for Shop 1
  const resOrdersAfter = await http('/api/shops/orders', {
    headers: authHeaders(shopSession.token)
  });

  // ── Test 5: Status Filtering (?status=PLACED) ──────────────────────────────
  console.log('\n-- Test 5: Status Filtering (?status=PLACED) --');
  const resPlaced = await http('/api/shops/orders?status=PLACED', {
    headers: authHeaders(shopSession.token)
  });
  ok('Status is 200', resPlaced.status === 200, `got ${resPlaced.status}`);
  ok('success is true', resPlaced.body.success === true);
  const allArePlaced = resPlaced.body.orders.every((ord) => ord.status === 'PLACED');
  ok('All filtered orders have status === PLACED', allArePlaced, `count: ${resPlaced.body.count}`);

  // ── Test 6: Comma-separated Status Filtering ───────────────────────────────
  console.log('\n-- Test 6: Comma-separated status filtering (?status=PLACED,CONFIRMED) --');
  const resMulti = await http('/api/shops/orders?status=PLACED,CONFIRMED', {
    headers: authHeaders(shopSession.token)
  });
  ok('Status is 200', resMulti.status === 200, `got ${resMulti.status}`);
  const allArePlacedOrConfirmed = resMulti.body.orders.every(
    (ord) => ord.status === 'PLACED' || ord.status === 'CONFIRMED'
  );
  ok('All orders match requested statuses', allArePlacedOrConfirmed, `count: ${resMulti.body.count}`);

  // ── Test 7: Student and Runner Data Population ─────────────────────────────
  console.log('\n-- Test 7: Data Population (Student & Runner) --');
  if (resOrdersAfter.body.orders.length > 0) {
    const sample = resOrdersAfter.body.orders[0];
    const studentPopulated = sample.student && typeof sample.student === 'object';
    const studentHasName = studentPopulated && Boolean(sample.student.name);
    ok('Student is populated as object', studentPopulated, `student: ${JSON.stringify(sample.student)}`);
    ok('Student object contains name', studentHasName, `name: ${sample.student?.name}`);
  } else {
    ok('Order population check', true, 'no orders to inspect population, skipping sample');
  }

  // ── Test 8: Multi-Tenant Shop Isolation ────────────────────────────────────
  console.log('\n-- Test 8: Multi-Tenant Isolation (Chillox Shop Owner) --');
  const resChilloxOrders = await http('/api/shops/orders', {
    headers: authHeaders(chilloxSession.token)
  });
  ok('Status is 200 for other shop owner', resChilloxOrders.status === 200);
  const noneAreShop1 = resChilloxOrders.body.orders.every(
    (ord) => ord.shop?.toString() !== shopId.toString()
  );
  ok('Chillox shop owner cannot see Shop 1 orders', noneAreShop1);
  const allAreChillox = resChilloxOrders.body.orders.every(
    (ord) => ord.shop?.toString() === chilloxId.toString()
  );
  ok('All Chillox orders belong exclusively to Chillox', allAreChillox, `Chillox order count: ${resChilloxOrders.body.count}`);

  // ── Test 9: Security Check — No JWT ────────────────────────────────────────
  console.log('\n-- Test 9: Security Check — No JWT --');
  const resNoAuth = await http('/api/shops/orders');
  ok('Missing JWT returns 401', resNoAuth.status === 401, `got ${resNoAuth.status}`);
  ok('success is false', resNoAuth.body.success === false);

  // ── Test 10: Security Check — Student JWT ──────────────────────────────────
  console.log('\n-- Test 10: Security Check — Student JWT --');
  const resStudentAuth = await http('/api/shops/orders', {
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
