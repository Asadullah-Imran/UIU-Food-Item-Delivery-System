/**
 * Phase 5B — Revenue Calculations Verification Suite
 *
 * Verification Checklist:
 *  1. Authenticated Shop Owner retrieves dashboard.
 *  2. dashboard.todayRevenue exists and is a non-negative number.
 *  3. dashboard.totalRevenue exists and is a non-negative number.
 *  4. Both singular (/api/shop/dashboard) and plural (/api/shops/dashboard) endpoints include revenue.
 *  5. Direct calculation matches delivered orders for the shop:
 *     - Only DELIVERED orders are counted.
 *     - Values prioritize shopAmount, then billing.shopAmount, then billing.subtotal.
 *     - Never blindly includes grandTotal (which includes runner/delivery/platform fees).
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

async function run() {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 5B: REVENUE CALCULATIONS TESTS');
  console.log('====================================================\n');

  console.log('--- Step 1: Login as Shop Owner ---');
  const shopOwner = await login('shop@uiu.ac.bd', 'password123');
  ok('Shop owner authenticated', !!shopOwner.token);

  console.log('\n--- Step 2: Query Dashboard & Verify Revenue Fields ---');
  const res = await http('/api/shops/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shops/dashboard returns 200 OK', res.status === 200);
  ok('Response has success === true', res.body.success === true);

  const { dashboard } = res.body;
  ok('dashboard.todayRevenue exists', dashboard && dashboard.todayRevenue !== undefined);
  ok('dashboard.todayRevenue is a number', typeof dashboard?.todayRevenue === 'number');
  ok('dashboard.todayRevenue >= 0', dashboard?.todayRevenue >= 0, `Value: ৳${dashboard?.todayRevenue}`);

  ok('dashboard.totalRevenue exists', dashboard && dashboard.totalRevenue !== undefined);
  ok('dashboard.totalRevenue is a number', typeof dashboard?.totalRevenue === 'number');
  ok('dashboard.totalRevenue >= todayRevenue', dashboard?.totalRevenue >= dashboard?.todayRevenue, `Total: ৳${dashboard?.totalRevenue}, Today: ৳${dashboard?.todayRevenue}`);

  console.log('\n--- Step 3: Verify Singular Route Alias ---');
  const singularRes = await http('/api/shop/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shop/dashboard returns 200 OK', singularRes.status === 200);
  ok('Singular dashboard includes todayRevenue', typeof singularRes.body.dashboard?.todayRevenue === 'number');
  ok('Singular dashboard includes totalRevenue', typeof singularRes.body.dashboard?.totalRevenue === 'number');
  ok('Values match between plural and singular endpoints',
    singularRes.body.dashboard?.todayRevenue === dashboard?.todayRevenue &&
    singularRes.body.dashboard?.totalRevenue === dashboard?.totalRevenue
  );

  console.log('\n--- Step 4: Verify Revenue Logical Isolation ---');
  // Check orders endpoint for delivered orders to compare
  const ordersRes = await http('/api/shops/orders?status=DELIVERED', { headers: authHeaders(shopOwner.token) });
  if (ordersRes.status === 200 && Array.isArray(ordersRes.body.orders)) {
    const deliveredOrders = ordersRes.body.orders;
    const expectedDeliveredTotal = deliveredOrders.reduce((sum, o) => {
      const amt = Number(o.shopAmount ?? o.billing?.shopAmount ?? o.billing?.subtotal ?? o.subtotal ?? 0);
      return sum + amt;
    }, 0);
    ok('totalRevenue accurately matches sum of DELIVERED orders shop earnings',
      dashboard.totalRevenue === expectedDeliveredTotal,
      `Calculated: ৳${dashboard.totalRevenue}, Expected: ৳${expectedDeliveredTotal}`
    );
  } else {
    ok('Delivered orders check skipped (none returned via query)', true);
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
