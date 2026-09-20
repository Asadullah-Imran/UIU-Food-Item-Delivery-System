/**
 * Phase 6: Customer Reviews & Ratings Verification Suite
 *
 * Checks:
 *  1. No JWT → 401 Unauthorized
 *  2. Student JWT → 403 Forbidden
 *  3. Shop A JWT → 200 OK
 *  4. Shop B JWT → 200 OK
 *  5. Multi-tenant isolation: Shop A cannot see Shop B reviews, Shop B cannot see Shop A reviews
 *  6. Response shape: success, count, totalReviews, averageRating, distribution, reviews
 *  7. Review fields: orderId, orderNumber, student (populated), shopRating, comment, createdAt
 *  8. Rating filters:
 *      - ?rating=5 → returns only 5-star reviews
 *      - ?rating=1 → returns only 1-star reviews
 *      - ?rating=9 → 400 Bad Request
 *      - ?rating=invalid → 400 Bad Request
 *  9. Route aliases: both /api/shops/reviews and /api/shop/reviews work
 * 10. Frontend integration check: ShopCustomerReviews.jsx calls /api/shops/reviews with auth token
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
  console.log('🧪 RUNNING PHASE 6: CUSTOMER REVIEWS & RATINGS TESTS');
  console.log('====================================================\n');

  // --- Step 1: Authentication & Authorization Guards ---
  console.log('--- Step 1: Auth & Role Guards ---');
  const unauthRes = await http('/api/shops/reviews');
  ok('GET /api/shops/reviews without token returns 401', unauthRes.status === 401);

  const student = await login('student@uiu.ac.bd', 'password123');
  const studentRes = await http('/api/shops/reviews', { headers: authHeaders(student.token) });
  ok('GET /api/shops/reviews with Student token returns 403 Forbidden', studentRes.status === 403);

  // --- Step 2: Shop Owner Reviews Access ---
  console.log('\n--- Step 2: Shop Owner Reviews Retrieval ---');
  const shopA = await login('shop@uiu.ac.bd', 'password123');
  const shopARes = await http('/api/shops/reviews', { headers: authHeaders(shopA.token) });
  ok('Shop A (Chef\'s Table) returns 200 OK', shopARes.status === 200);
  ok('Response has success === true', shopARes.body.success === true);

  const dataA = shopARes.body;
  ok('Response includes count property', typeof dataA.count === 'number');
  ok('Response includes averageRating property', typeof dataA.averageRating === 'number');
  ok('Response includes distribution object', typeof dataA.distribution === 'object' && dataA.distribution !== null);
  ok('Distribution has keys 1 to 5', [1, 2, 3, 4, 5].every(k => k in dataA.distribution));
  ok('Response includes reviews array', Array.isArray(dataA.reviews));

  // --- Step 3: Review Item Structure Validation ---
  console.log('\n--- Step 3: Review Items & Student Population ---');
  if (dataA.reviews.length > 0) {
    const rev = dataA.reviews[0];
    ok('Review has orderId', !!rev.orderId);
    ok('Review has orderNumber', !!rev.orderNumber);
    ok('Review student is populated', typeof rev.student === 'object' && rev.student !== null);
    ok('Review student has name', typeof rev.student?.name === 'string');
    ok('Review has shopRating', typeof rev.shopRating === 'number' && rev.shopRating >= 1 && rev.shopRating <= 5);
    ok('Review has comment or feedback string', typeof rev.comment === 'string');
    ok('Review has createdAt timestamp', !!rev.createdAt);
  } else {
    console.log('  INFO  Shop A has 0 reviews; skipping item structure check');
  }

  // --- Step 4: Multi-Tenant Isolation (Shop A vs Shop B) ---
  console.log('\n--- Step 4: Multi-Tenant Review Isolation ---');
  const shopB = await login('chillox@uiu.ac.bd', 'password123');
  const shopBRes = await http('/api/shops/reviews', { headers: authHeaders(shopB.token) });
  ok('Shop B (Chillox) returns 200 OK', shopBRes.status === 200);

  const dataB = shopBRes.body;
  ok('Shop B reviews do not contain Shop A reviews', 
    dataB.reviews.every(bRev => !dataA.reviews.some(aRev => aRev.orderId === bRev.orderId))
  );
  ok('Shop B count reflects only Shop B reviews', dataB.count === dataB.reviews.length);

  // --- Step 5: Rating Filtering (?rating=X) ---
  console.log('\n--- Step 5: Rating Filtering Validation ---');
  const filter5Res = await http('/api/shops/reviews?rating=5', { headers: authHeaders(shopA.token) });
  ok('?rating=5 returns 200 OK', filter5Res.status === 200);
  ok('?rating=5 returns only 5-star reviews', 
    filter5Res.body.reviews?.every(r => r.shopRating === 5)
  );

  const filter1Res = await http('/api/shops/reviews?rating=1', { headers: authHeaders(shopA.token) });
  ok('?rating=1 returns 200 OK', filter1Res.status === 200);
  ok('?rating=1 returns only 1-star reviews', 
    filter1Res.body.reviews?.every(r => r.shopRating === 1)
  );

  const filter9Res = await http('/api/shops/reviews?rating=9', { headers: authHeaders(shopA.token) });
  ok('?rating=9 returns 400 Bad Request', filter9Res.status === 400);
  ok('?rating=9 returns helpful error message', 
    filter9Res.body.message?.includes('between 1 and 5')
  );

  const filterInvalidRes = await http('/api/shops/reviews?rating=invalid', { headers: authHeaders(shopA.token) });
  ok('?rating=invalid returns 400 Bad Request', filterInvalidRes.status === 400);

  // --- Step 6: Route Alias Compatibility ---
  console.log('\n--- Step 6: Route Alias Compatibility ---');
  const aliasRes = await http('/api/shop/reviews', { headers: authHeaders(shopA.token) });
  ok('GET /api/shop/reviews singular alias returns 200 OK', aliasRes.status === 200);
  ok('Singular route matches plural count and averageRating',
    aliasRes.body.count === dataA.count && aliasRes.body.averageRating === dataA.averageRating
  );

  // --- Step 7: Frontend ShopCustomerReviews.jsx Integration ---
  console.log('\n--- Step 7: Frontend Page Verification ---');
  const pagePath = path.resolve('../client/src/pages/shop/ShopCustomerReviews.jsx');
  const pageCode = fs.readFileSync(pagePath, 'utf8');

  ok('ShopCustomerReviews.jsx calls fetch(\'/api/shops/reviews\')', 
    pageCode.includes('/api/shops/reviews')
  );
  ok('ShopCustomerReviews.jsx uses Authorization header with uiu_auth_token', 
    pageCode.includes('uiu_auth_token') && pageCode.includes('Authorization')
  );
  ok('ShopCustomerReviews.jsx updates reviews, averageRating, and distribution state',
    pageCode.includes('setReviews') && pageCode.includes('setAverageRating') && pageCode.includes('setDistribution')
  );
  ok('ShopCustomerReviews.jsx does not import mock shopOrdersData.json',
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
