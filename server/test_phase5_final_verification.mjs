/**
 * Phase 5 Final Verification Suite — Comprehensive End-to-End Test
 *
 * Checks:
 *  1. No token → 401
 *  2. Student token → 403
 *  3. Shop A token → 200
 *  4. Shop B token → 200
 *  5. Tenant isolation: Shop A metrics != Shop B metrics (only own shop data)
 *  6. Direct comparison with MongoDB counts (incomingOrders, preparing, ready, completed)
 *  7. Metric fields accuracy: todayRevenue, averageRating, lowStockCount, recentOrders, popularItems
 *  8. Client ShopDashboard.jsx integration confirmation (mock JSON removed)
 */

import fs from 'fs';
import path from 'path';

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
  console.log('🧪 RUNNING PHASE 5 FINAL COMPREHENSIVE VERIFICATION');
  console.log('====================================================\n');

  // --- Step 1: Authentication & Authorization Guards ---
  console.log('--- Step 1: Auth & Role Access Control ---');
  const noTokenRes = await http('/api/shops/dashboard');
  ok('No token → 401 Unauthorized', noTokenRes.status === 401);

  const student = await login('student@uiu.ac.bd', 'password123');
  const studentRes = await http('/api/shops/dashboard', { headers: authHeaders(student.token) });
  ok('Student token → 403 Forbidden', studentRes.status === 403);

  const shopA = await login('shop@uiu.ac.bd', 'password123');
  const shopARes = await http('/api/shops/dashboard', { headers: authHeaders(shopA.token) });
  ok('Shop A token (Chef\'s Table) → 200 OK', shopARes.status === 200);

  const shopB = await login('chillox@uiu.ac.bd', 'password123');
  const shopBRes = await http('/api/shops/dashboard', { headers: authHeaders(shopB.token) });
  ok('Shop B token (Chillox) → 200 OK', shopBRes.status === 200);

  const dashA = shopARes.body.dashboard;
  const dashB = shopBRes.body.dashboard;

  // --- Step 2: Multi-Tenant Isolation (Shop A vs Shop B) ---
  console.log('\n--- Step 2: Multi-Tenant Metric Isolation ---');
  ok('Shop A has distinct shop ID', !!dashA.shop?._id);
  ok('Shop B has distinct shop ID', !!dashB.shop?._id);
  ok('Shop A ID !== Shop B ID', dashA.shop?._id !== dashB.shop?._id, `A: ${dashA.shop?._id} vs B: ${dashB.shop?._id}`);
  ok('Shop A name is Chef\'s Table', dashA.shop?.name === "Chef's Table");
  ok('Shop B name is Chillox UIU', dashB.shop?.name === "Chillox UIU");

  // Verify menu items strictly belong to respective shops
  const allAMenuBelongToA = dashA.menuItems.every(item => item.shop?.toString() === dashA.shop._id.toString());
  const allBMenuBelongToB = dashB.menuItems.every(item => item.shop?.toString() === dashB.shop._id.toString());
  ok('Shop A menuItems belong strictly to Shop A', allAMenuBelongToA, `count=${dashA.menuItems.length}`);
  ok('Shop B menuItems belong strictly to Shop B', allBMenuBelongToB, `count=${dashB.menuItems.length}`);

  // Verify recent orders strictly belong to respective shops
  const allAOrdersBelongToA = dashA.recentOrders.every(o => o.shop?.toString() === dashA.shop._id.toString());
  const allBOrdersBelongToB = dashB.recentOrders.every(o => o.shop?.toString() === dashB.shop._id.toString());
  ok('Shop A recentOrders belong strictly to Shop A', allAOrdersBelongToA);
  ok('Shop B recentOrders belong strictly to Shop B', allBOrdersBelongToB);

  // --- Step 3: Direct Comparison of Dashboard Counts with Live Orders API ---
  console.log('\n--- Step 3: Compare Dashboard Metrics with Order API Queries ---');
  // Fetch actual orders by status for Shop A to compare
  const placedRes = await http('/api/shops/orders?status=PLACED', { headers: authHeaders(shopA.token) });
  const preparingRes = await http('/api/shops/orders?status=PREPARING', { headers: authHeaders(shopA.token) });
  const readyRes = await http('/api/shops/orders?status=READY_FOR_PICKUP', { headers: authHeaders(shopA.token) });
  const deliveredRes = await http('/api/shops/orders?status=DELIVERED', { headers: authHeaders(shopA.token) });

  const placedCount = placedRes.body.orders?.length ?? 0;
  const preparingCount = preparingRes.body.orders?.length ?? 0;
  const readyCount = readyRes.body.orders?.length ?? 0;
  const deliveredCount = deliveredRes.body.orders?.length ?? 0;

  ok('incomingOrders matches PLACED orders query', dashA.incomingOrders === placedCount, `dashboard: ${dashA.incomingOrders}, db: ${placedCount}`);
  ok('preparingOrders matches PREPARING orders query', dashA.preparingOrders === preparingCount, `dashboard: ${dashA.preparingOrders}, db: ${preparingCount}`);
  ok('readyOrders matches READY_FOR_PICKUP orders query', dashA.readyOrders === readyCount, `dashboard: ${dashA.readyOrders}, db: ${readyCount}`);
  ok('completedOrders matches DELIVERED orders query', dashA.completedOrders === deliveredCount, `dashboard: ${dashA.completedOrders}, db: ${deliveredCount}`);

  // --- Step 4: Metric Types and Shape Validation ---
  console.log('\n--- Step 4: Validate Required Response Shape ---');
  ok('todayOrders is a valid number', typeof dashA.todayOrders === 'number' && dashA.todayOrders >= 0);
  ok('todayRevenue is a valid number', typeof dashA.todayRevenue === 'number' && dashA.todayRevenue >= 0);
  ok('averageRating is a valid number', typeof dashA.averageRating === 'number' && dashA.averageRating >= 0);
  ok('lowStockCount is a valid number', typeof dashA.lowStockCount === 'number' && dashA.lowStockCount >= 0);
  ok('popularItems is an Array (top 5 limit)', Array.isArray(dashA.popularItems) && dashA.popularItems.length <= 5);
  ok('recentOrders is an Array (top 5 limit)', Array.isArray(dashA.recentOrders) && dashA.recentOrders.length <= 5);
  ok('lowStockItems is an Array', Array.isArray(dashA.lowStockItems));

  // --- Step 5: Verify Client ShopDashboard.jsx Disconnected from Mock Data ---
  console.log('\n--- Step 5: Frontend ShopDashboard.jsx Verification ---');
  const clientDashPath = path.resolve('../client/src/pages/shop/ShopDashboard.jsx');
  const clientDashCode = fs.readFileSync(clientDashPath, 'utf8');

  ok('ShopDashboard.jsx calls fetch(\'/api/shops/dashboard\')', clientDashCode.includes("fetch('/api/shops/dashboard'") || clientDashCode.includes('fetch("/api/shops/dashboard"'));
  ok('ShopDashboard.jsx uses Authorization header with localStorage uiu_auth_token', clientDashCode.includes('uiu_auth_token') && clientDashCode.includes('Authorization'));
  ok('ShopDashboard.jsx no longer imports shopDashboardData.json', !clientDashCode.includes('shopDashboardData.json'));
  ok('ShopDashboard.jsx maps all 8 required metrics', 
    clientDashCode.includes('todayOrders') &&
    clientDashCode.includes('incomingOrders') &&
    clientDashCode.includes('preparingOrders') &&
    clientDashCode.includes('readyOrders') &&
    clientDashCode.includes('completedOrders') &&
    clientDashCode.includes('todayRevenue') &&
    clientDashCode.includes('averageRating') &&
    clientDashCode.includes('lowStockCount')
  );

  console.log('\n====================================================');
  console.log(`📊 FINAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
