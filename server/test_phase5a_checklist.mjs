/**
 * Phase 5A — Shop Dashboard Backend Endpoint Verification Suite
 *
 * Verification Checklist:
 *  1. Without JWT -> 401 Unauthorized
 *  2. Student JWT -> 403 Forbidden
 *  3. Shop Owner JWT -> 200 OK
 *  4. Response structure: success === true, dashboard object exists
 *  5. dashboard contains: todayOrders, incomingOrders, preparingOrders, readyOrders, completedOrders, recentOrders, menuItems
 *  6. todayOrders is numeric >= 0
 *  7. incomingOrders is numeric >= 0
 *  8. preparingOrders is numeric >= 0
 *  9. readyOrders is numeric >= 0
 *  10. completedOrders is numeric >= 0
 *  11. recentOrders is Array, max 5 items
 *  12. menuItems is Array
 *  13. Singular route alias GET /api/shop/dashboard -> 200 OK
 *  14. Plural route GET /api/shops/dashboard -> 200 OK
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
  console.log('🧪 RUNNING PHASE 5A: SHOP DASHBOARD ENDPOINT TESTS');
  console.log('====================================================\n');

  // Step 1: Authentication & Authorization Guards
  console.log('--- Step 1: Auth & Role Guards ---');
  const unauthRes = await http('/api/shops/dashboard');
  ok('GET /api/shops/dashboard without token returns 401', unauthRes.status === 401);

  const student = await login('student@uiu.ac.bd', 'password123');
  const studentRes = await http('/api/shops/dashboard', { headers: authHeaders(student.token) });
  ok('GET /api/shops/dashboard with Student token returns 403 Forbidden', studentRes.status === 403);

  // Step 2: Shop Owner Dashboard Access
  console.log('\n--- Step 2: Shop Owner Dashboard Endpoint ---');
  const shopOwner = await login('shop@uiu.ac.bd', 'password123');
  
  const pluralRes = await http('/api/shops/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shops/dashboard returns 200 OK', pluralRes.status === 200);
  ok('Response has success === true', pluralRes.body.success === true);
  ok('Response contains dashboard object', pluralRes.body.dashboard && typeof pluralRes.body.dashboard === 'object');

  const { dashboard } = pluralRes.body;
  if (dashboard) {
    ok('dashboard.todayOrders is a number >= 0', typeof dashboard.todayOrders === 'number' && dashboard.todayOrders >= 0, `value: ${dashboard.todayOrders}`);
    ok('dashboard.incomingOrders is a number >= 0', typeof dashboard.incomingOrders === 'number' && dashboard.incomingOrders >= 0, `value: ${dashboard.incomingOrders}`);
    ok('dashboard.preparingOrders is a number >= 0', typeof dashboard.preparingOrders === 'number' && dashboard.preparingOrders >= 0, `value: ${dashboard.preparingOrders}`);
    ok('dashboard.readyOrders is a number >= 0', typeof dashboard.readyOrders === 'number' && dashboard.readyOrders >= 0, `value: ${dashboard.readyOrders}`);
    ok('dashboard.completedOrders is a number >= 0', typeof dashboard.completedOrders === 'number' && dashboard.completedOrders >= 0, `value: ${dashboard.completedOrders}`);
    ok('dashboard.recentOrders is an Array', Array.isArray(dashboard.recentOrders));
    ok('dashboard.recentOrders length <= 5', Array.isArray(dashboard.recentOrders) && dashboard.recentOrders.length <= 5, `count: ${dashboard.recentOrders.length}`);
    ok('dashboard.menuItems is an Array', Array.isArray(dashboard.menuItems), `count: ${dashboard.menuItems?.length}`);
  }

  // Step 3: Singular Route Alias Verification
  console.log('\n--- Step 3: Route Alias Compatibility ---');
  const singularRes = await http('/api/shop/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shop/dashboard returns 200 OK', singularRes.status === 200);
  ok('Singular route dashboard matches plural structure', singularRes.body.success === true && typeof singularRes.body.dashboard?.todayOrders === 'number');

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
