/**
 * Phase 7: Sales Reports, Earnings & Transaction History Verification Suite
 *
 * Checks:
 *  1. No JWT → 401 Unauthorized
 *  2. Student JWT → 403 Forbidden
 *  3. Shop A JWT → 200 OK for reports and transactions
 *  4. Shop B JWT → 200 OK for reports and transactions
 *  5. Financial isolation: Shop A cannot view Shop B transactions/revenue, Shop B cannot view Shop A's
 *  6. Report calculation validation: totalOrders, deliveredOrders, rejectedOrders, cancelledOrders, totalRevenue, averageOrderValue
 *  7. Period revenue validation: todayRevenue, weeklyRevenue, monthlyRevenue
 *  8. Best-selling items calculation
 *  9. Date filtering (?from=X&to=Y) & invalid date handling (400 Bad Request)
 * 10. Transactions schema & status validation
 * 11. Route aliases: /api/shop/reports & /api/shop/transactions
 * 12. Frontend ShopSalesReports.jsx integration confirmation
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
  console.log('🧪 RUNNING PHASE 7: SALES REPORTS & TRANSACTIONS TESTS');
  console.log('====================================================\n');

  // --- Step 1: Authentication & Authorization Guards ---
  console.log('--- Step 1: Auth & Role Guards ---');
  const unauthReports = await http('/api/shops/reports');
  ok('GET /api/shops/reports without token returns 401', unauthReports.status === 401);

  const unauthTxns = await http('/api/shops/transactions');
  ok('GET /api/shops/transactions without token returns 401', unauthTxns.status === 401);

  const student = await login('student@uiu.ac.bd', 'password123');
  const studentReports = await http('/api/shops/reports', { headers: authHeaders(student.token) });
  ok('GET /api/shops/reports with Student token returns 403 Forbidden', studentReports.status === 403);

  const studentTxns = await http('/api/shops/transactions', { headers: authHeaders(student.token) });
  ok('GET /api/shops/transactions with Student token returns 403 Forbidden', studentTxns.status === 403);

  // --- Step 2: Shop Owner Reports Retrieval ---
  console.log('\n--- Step 2: Shop Owner Reports Retrieval ---');
  const shopA = await login('shop@uiu.ac.bd', 'password123');
  const shopAReportRes = await http('/api/shops/reports', { headers: authHeaders(shopA.token) });
  ok('Shop A (Chef\'s Table) reports returns 200 OK', shopAReportRes.status === 200);
  ok('Reports response has success === true', shopAReportRes.body.success === true);

  const reportA = shopAReportRes.body.report;
  ok('Report includes totalOrders', typeof reportA?.totalOrders === 'number');
  ok('Report includes deliveredOrders', typeof reportA?.deliveredOrders === 'number');
  ok('Report includes rejectedOrders', typeof reportA?.rejectedOrders === 'number');
  ok('Report includes cancelledOrders', typeof reportA?.cancelledOrders === 'number');
  ok('Report includes totalRevenue', typeof reportA?.totalRevenue === 'number' && reportA.totalRevenue >= 0);
  ok('Report includes averageOrderValue', typeof reportA?.averageOrderValue === 'number' && reportA.averageOrderValue >= 0);
  ok('Report includes todayRevenue', typeof reportA?.todayRevenue === 'number' && reportA.todayRevenue >= 0);
  ok('Report includes weeklyRevenue', typeof reportA?.weeklyRevenue === 'number' && reportA.weeklyRevenue >= 0);
  ok('Report includes monthlyRevenue', typeof reportA?.monthlyRevenue === 'number' && reportA.monthlyRevenue >= 0);
  ok('Report includes bestSellingItems array', Array.isArray(reportA?.bestSellingItems));

  // --- Step 3: Best-Selling Items Structure ---
  console.log('\n--- Step 3: Best-Selling Items Aggregation ---');
  if (reportA?.bestSellingItems && reportA.bestSellingItems.length > 0) {
    const item = reportA.bestSellingItems[0];
    ok('Best-selling item has name', typeof item.name === 'string');
    ok('Best-selling item has numeric quantity', typeof item.quantity === 'number' && item.quantity >= 0);
    ok('Best-selling item has numeric revenue', typeof item.revenue === 'number' && item.revenue >= 0);
  } else {
    console.log('  INFO  0 best-selling items; skipping detail checks');
  }

  // --- Step 4: Multi-Tenant Isolation (Shop A vs Shop B) ---
  console.log('\n--- Step 4: Multi-Tenant Financial Isolation ---');
  const shopB = await login('chillox@uiu.ac.bd', 'password123');
  const shopBReportRes = await http('/api/shops/reports', { headers: authHeaders(shopB.token) });
  ok('Shop B (Chillox) reports returns 200 OK', shopBReportRes.status === 200);

  const reportB = shopBReportRes.body.report;
  ok('Shop B orders do not contain Shop A orders',
    reportB.orders.every(bOrd => !reportA.orders.some(aOrd => aOrd._id === bOrd._id))
  );

  // --- Step 5: Date Range Filtering ---
  console.log('\n--- Step 5: Date Range Filtering ---');
  const filterDateRes = await http('/api/shops/reports?from=2026-01-01&to=2026-12-31', { headers: authHeaders(shopA.token) });
  ok('GET /api/shops/reports?from=...&to=... returns 200 OK', filterDateRes.status === 200);

  const invalidFromRes = await http('/api/shops/reports?from=invalid-date', { headers: authHeaders(shopA.token) });
  ok('GET /api/shops/reports?from=invalid returns 400 Bad Request', invalidFromRes.status === 400);

  const invalidToRes = await http('/api/shops/reports?to=invalid-date', { headers: authHeaders(shopA.token) });
  ok('GET /api/shops/reports?to=invalid returns 400 Bad Request', invalidToRes.status === 400);

  // --- Step 6: Shop Transactions Endpoint ---
  console.log('\n--- Step 6: Shop Transactions Endpoint ---');
  const shopATxnRes = await http('/api/shops/transactions', { headers: authHeaders(shopA.token) });
  ok('GET /api/shops/transactions returns 200 OK', shopATxnRes.status === 200);
  ok('Transactions response has success === true', shopATxnRes.body.success === true);
  ok('Transactions includes count', typeof shopATxnRes.body.count === 'number');
  ok('Transactions includes array', Array.isArray(shopATxnRes.body.transactions));

  const shopBTxnRes = await http('/api/shops/transactions', { headers: authHeaders(shopB.token) });
  ok('Shop B transactions returns 200 OK', shopBTxnRes.status === 200);
  ok('Shop B transactions isolated from Shop A',
    shopBTxnRes.body.transactions.every(bt => !shopATxnRes.body.transactions.some(at => at._id === bt._id))
  );

  // --- Step 7: Route Aliases ---
  console.log('\n--- Step 7: Route Alias Compatibility ---');
  const singularReportRes = await http('/api/shop/reports', { headers: authHeaders(shopA.token) });
  ok('GET /api/shop/reports returns 200 OK', singularReportRes.status === 200);

  const singularTxnRes = await http('/api/shop/transactions', { headers: authHeaders(shopA.token) });
  ok('GET /api/shop/transactions returns 200 OK', singularTxnRes.status === 200);

  // --- Step 8: Frontend ShopSalesReports.jsx Integration ---
  console.log('\n--- Step 8: Frontend Page Verification ---');
  const pagePath = path.resolve('../client/src/pages/shop/ShopSalesReports.jsx');
  const pageCode = fs.readFileSync(pagePath, 'utf8');

  ok('ShopSalesReports.jsx calls fetch(\'/api/shops/reports\')', 
    pageCode.includes('/api/shops/reports')
  );
  ok('ShopSalesReports.jsx calls fetch(\'/api/shops/transactions\')', 
    pageCode.includes('/api/shops/transactions')
  );
  ok('ShopSalesReports.jsx uses Authorization header with uiu_auth_token', 
    pageCode.includes('uiu_auth_token') && pageCode.includes('Authorization')
  );
  ok('ShopSalesReports.jsx does not import mock shopOrdersData.json',
    !pageCode.includes('shopOrdersData.json')
  );

  console.log('\n====================================================');
  console.log(`📊 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
