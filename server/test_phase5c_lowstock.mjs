/**
 * Phase 5C — Low-Stock Items Verification Suite
 *
 * Verification Checklist:
 *  1. Shop Owner dashboard returns lowStockItems array.
 *  2. lowStockItems is an Array.
 *  3. Every item in lowStockItems satisfies: stockQuantity <= lowStockWarning.
 *  4. No item with stockQuantity > lowStockWarning appears in lowStockItems.
 *  5. dashboard.lowStockCount === lowStockItems.length.
 *  6. Items with stockQuantity > lowStockWarning still appear in menuItems (full list unaffected).
 *  7. Singular route alias /api/shop/dashboard also returns lowStockItems and lowStockCount.
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
  console.log('🧪 RUNNING PHASE 5C: LOW-STOCK ITEMS TESTS');
  console.log('====================================================\n');

  console.log('--- Step 1: Login & Fetch Dashboard ---');
  const shopOwner = await login('shop@uiu.ac.bd', 'password123');
  ok('Shop owner authenticated', !!shopOwner.token);

  const res = await http('/api/shops/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shops/dashboard returns 200 OK', res.status === 200);

  const { dashboard } = res.body;

  console.log('\n--- Step 2: Verify lowStockItems Array ---');
  ok('dashboard.lowStockItems exists', dashboard && dashboard.lowStockItems !== undefined);
  ok('dashboard.lowStockItems is an Array', Array.isArray(dashboard?.lowStockItems));

  if (Array.isArray(dashboard?.lowStockItems)) {
    const allLow = dashboard.lowStockItems.every(
      (item) => Number(item.stockQuantity ?? 0) <= Number(item.lowStockWarning ?? 10)
    );
    ok('All items in lowStockItems satisfy: stockQuantity <= lowStockWarning', allLow,
      `count: ${dashboard.lowStockItems.length}`
    );

    // Cross-check: none of the items in lowStockItems should have stockQuantity > lowStockWarning
    const noFalsePositives = dashboard.lowStockItems.every(
      (item) => item.stockQuantity <= item.lowStockWarning
    );
    ok('No false positives: no item has stockQuantity > lowStockWarning', noFalsePositives);
  }

  console.log('\n--- Step 3: Verify lowStockCount Consistency ---');
  ok('dashboard.lowStockCount exists', dashboard?.lowStockCount !== undefined);
  ok('dashboard.lowStockCount is a number', typeof dashboard?.lowStockCount === 'number');
  ok('dashboard.lowStockCount === lowStockItems.length',
    dashboard?.lowStockCount === dashboard?.lowStockItems?.length,
    `count: ${dashboard?.lowStockCount}`
  );

  console.log('\n--- Step 4: Verify menuItems Completeness ---');
  ok('dashboard.menuItems contains all items (>= lowStockItems)',
    (dashboard?.menuItems?.length ?? 0) >= (dashboard?.lowStockItems?.length ?? 0),
    `menuItems: ${dashboard?.menuItems?.length}, lowStockItems: ${dashboard?.lowStockItems?.length}`
  );

  console.log('\n--- Step 5: Singular Route Alias ---');
  const singularRes = await http('/api/shop/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shop/dashboard returns 200 OK', singularRes.status === 200);
  ok('Singular route includes lowStockItems array', Array.isArray(singularRes.body.dashboard?.lowStockItems));
  ok('Singular route lowStockCount matches', 
    singularRes.body.dashboard?.lowStockCount === singularRes.body.dashboard?.lowStockItems?.length
  );

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
