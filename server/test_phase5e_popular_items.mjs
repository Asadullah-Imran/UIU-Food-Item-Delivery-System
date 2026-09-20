/**
 * Phase 5E — Popular Items (Best-Selling Menu Items) Verification Suite
 *
 * Verification Checklist:
 *  1. Shop Owner authenticates successfully.
 *  2. GET /api/shops/dashboard returns 200 OK.
 *  3. dashboard.popularItems exists and is an Array.
 *  4. dashboard.popularItems has at most 5 items (Top 5 limit).
 *  5. Each item in popularItems has valid name (String) and totalQuantity (Number >= 0).
 *  6. popularItems are sorted descending by totalQuantity.
 *  7. dashboard.bestSellingItem equals popularItems[0] when items exist, or null when empty.
 *  8. Route alias GET /api/shop/dashboard returns identical popularItems and bestSellingItem.
 *  9. Regression check: all previous dashboard metrics (todayOrders, revenues, lowStock, rating) remain intact.
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
  console.log('🧪 RUNNING PHASE 5E: POPULAR ITEMS TESTS');
  console.log('====================================================\n');

  console.log('--- Step 1: Login & Fetch Dashboard ---');
  const shopOwner = await login('shop@uiu.ac.bd', 'password123');
  ok('Shop owner authenticated', !!shopOwner.token);

  const res = await http('/api/shops/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shops/dashboard returns 200 OK', res.status === 200);

  const { dashboard } = res.body;

  console.log('\n--- Step 2: Verify popularItems Structure & Type ---');
  ok('dashboard exists', !!dashboard);
  ok('dashboard.popularItems exists', dashboard && dashboard.popularItems !== undefined);
  ok('dashboard.popularItems is an Array', Array.isArray(dashboard?.popularItems));
  ok('popularItems has at most 5 items', (dashboard?.popularItems?.length ?? 0) <= 5, `count=${dashboard?.popularItems?.length}`);

  console.log('\n--- Step 3: Verify Item Attributes & Sort Order ---');
  if (Array.isArray(dashboard?.popularItems) && dashboard.popularItems.length > 0) {
    let isSorted = true;
    for (let i = 0; i < dashboard.popularItems.length; i++) {
      const item = dashboard.popularItems[i];
      ok(`Item [${i}] (${item.name}) has valid name and totalQuantity`,
        typeof item.name === 'string' && item.name.length > 0 && typeof item.totalQuantity === 'number' && item.totalQuantity >= 0,
        `name="${item.name}", totalQuantity=${item.totalQuantity}`
      );
      if (i > 0) {
        if (item.totalQuantity > dashboard.popularItems[i - 1].totalQuantity) {
          isSorted = false;
        }
      }
    }
    ok('popularItems is sorted in descending order of totalQuantity', isSorted);
  } else {
    console.log('  INFO  No delivered orders with items currently in DB; array is empty as expected');
  }

  console.log('\n--- Step 4: Verify bestSellingItem Mapping ---');
  ok('dashboard.bestSellingItem exists', 'bestSellingItem' in (dashboard || {}));
  if (dashboard?.popularItems && dashboard.popularItems.length > 0) {
    ok('bestSellingItem matches popularItems[0]',
      dashboard.bestSellingItem?.name === dashboard.popularItems[0].name &&
      dashboard.bestSellingItem?.totalQuantity === dashboard.popularItems[0].totalQuantity
    );
  } else {
    ok('bestSellingItem is null when popularItems is empty', dashboard?.bestSellingItem === null);
  }

  console.log('\n--- Step 5: Verify Singular Route Alias /api/shop/dashboard ---');
  const aliasRes = await http('/api/shop/dashboard', { headers: authHeaders(shopOwner.token) });
  ok('GET /api/shop/dashboard returns 200 OK', aliasRes.status === 200);
  ok('Alias returns matching popularItems length',
    aliasRes.body?.dashboard?.popularItems?.length === dashboard?.popularItems?.length
  );
  ok('Alias returns matching bestSellingItem',
    aliasRes.body?.dashboard?.bestSellingItem?.name === dashboard?.bestSellingItem?.name
  );

  console.log('\n--- Step 6: Regression Verification of Existing Metrics ---');
  ok('todayOrders is a number', typeof dashboard?.todayOrders === 'number');
  ok('todayRevenue is a number', typeof dashboard?.todayRevenue === 'number');
  ok('totalRevenue is a number', typeof dashboard?.totalRevenue === 'number');
  ok('lowStockCount is a number', typeof dashboard?.lowStockCount === 'number');
  ok('averageRating is a number', typeof dashboard?.averageRating === 'number');
  ok('reviewsCount is a number', typeof dashboard?.reviewsCount === 'number');

  console.log('\n====================================================');
  console.log(`📊 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
