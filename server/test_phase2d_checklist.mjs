/**
 * Phase 2D Checklist — Pure HTTP Test Suite
 * No direct DB connection. Uses the running server at localhost:5001.
 *
 * Credentials (from seeder):
 *   shop owner : shop@uiu.ac.bd     / password123
 *   student    : student@uiu.ac.bd  / password123
 *   chillox    : chillox@uiu.ac.bd  / password123  (second shop, for cross-shop test)
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
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
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

async function setAvailabilityDirect(itemId, token, isAvailable) {
  return http(`/api/shops/menu/${itemId}/availability`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ isAvailable })
  });
}

async function main() {
  console.log('\n================================================');
  console.log(' Phase 2D - Availability Management Tests ');
  console.log('================================================\n');

  // ── Setup ─────────────────────────────────────────────────────────────────
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const studentSession = await login('student@uiu.ac.bd', 'password123');
  const chilloxSession = await login('chillox@uiu.ac.bd', 'password123');

  const myShopData     = await getMyShop(shopSession.token);
  const chilloxData    = await getMyShop(chilloxSession.token);

  const shopItems    = myShopData.menuItems || [];
  const chilloxItems = chilloxData.menuItems || [];

  if (shopItems.length === 0) { console.error('No menu items for shop@uiu.ac.bd — re-seed first'); process.exit(1); }

  // Use first item for main tests
  let item = shopItems[0];
  let chilloxItem = chilloxItems[0];
  const shopId = myShopData.shop._id;
  const ITEM_ID = item._id;
  const endpoint = `/api/shops/menu/${ITEM_ID}/availability`;

  console.log(`  Shop       : ${myShopData.shop.name}`);
  console.log(`  Test Item  : ${item.name}  (isAvailable=${item.isAvailable}, stock=${item.stockQuantity})`);
  console.log(`  Student    : ${studentSession.user.name}`);
  console.log(`  Other Shop : ${chilloxData.shop.name}`);
  if (chilloxItem) console.log(`  Other Item : ${chilloxItem.name}`);
  console.log();

  // ── Test 1: Available → Unavailable ───────────────────────────────────────
  console.log('-- Test 1: Available -> Unavailable (200) --');
  // Ensure it starts available
  await setAvailabilityDirect(ITEM_ID, shopSession.token, true);
  const t1 = await setAvailabilityDirect(ITEM_ID, shopSession.token, false);
  ok('Status 200', t1.status === 200, `got ${t1.status}`);
  ok('success: true', t1.body.success === true);
  ok('isAvailable = false in response', t1.body.menuItem?.isAvailable === false);
  ok('Message is unavailable wording', t1.body.message?.toLowerCase().includes('unavailable'));
  console.log();

  // ── Test 2: Unavailable → Available ───────────────────────────────────────
  console.log('-- Test 2: Unavailable -> Available (200) --');
  // item is currently unavailable; also ensure stock > 0 via edit endpoint
  // (stock was already > 0 from seeder unless we touched it)
  const t2 = await setAvailabilityDirect(ITEM_ID, shopSession.token, true);
  ok('Status 200', t2.status === 200, `got ${t2.status}`);
  ok('success: true', t2.body.success === true);
  ok('isAvailable = true in response', t2.body.menuItem?.isAvailable === true);
  ok('Message is available wording', t2.body.message?.toLowerCase().includes('available'));
  console.log();

  // ── Test 3: Refresh — verify persisted in MongoDB via GET ────────────────
  console.log('-- Test 3: State persists (fresh GET /my-shop) --');
  const refreshed = await getMyShop(shopSession.token);
  const freshItem = (refreshed.menuItems || []).find(i => i._id === ITEM_ID || i._id?.toString() === ITEM_ID?.toString());
  ok('Item found on refresh', !!freshItem);
  ok('isAvailable = true in refreshed data', freshItem?.isAvailable === true);
  console.log();

  // ── Test 4: stockQuantity = 0 + isAvailable = true → 400 ─────────────────
  console.log('-- Test 4: stockQuantity=0 + isAvailable=true -> 400 --');
  // Step 4a: Set stock to 0 via PUT /api/shops/menu/:itemId
  const editRes = await http(`/api/shops/menu/${ITEM_ID}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${shopSession.token}` },
    body: (() => { const fd = new FormData(); fd.append('stockQuantity', '0'); return fd; })()
  });
  // Step 4b: Mark unavailable first (avoids guard mismatch since stock=0 now)
  await setAvailabilityDirect(ITEM_ID, shopSession.token, false);
  // Step 4c: Try to mark available with stock=0
  const t4 = await setAvailabilityDirect(ITEM_ID, shopSession.token, true);
  ok('Status 400', t4.status === 400, `got ${t4.status}`);
  ok('success: false', t4.body.success === false);
  ok('Message mentions stock is 0', t4.body.message?.includes('stock is 0'));
  // Restore stock via edit
  await http(`/api/shops/menu/${ITEM_ID}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${shopSession.token}` },
    body: (() => { const fd = new FormData(); fd.append('stockQuantity', '50'); return fd; })()
  });
  await setAvailabilityDirect(ITEM_ID, shopSession.token, true);
  console.log();

  // ── Test 5: No JWT → 401 ──────────────────────────────────────────────────
  console.log('-- Test 5: No JWT -> 401 --');
  const t5 = await http(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAvailable: false })
  });
  ok('Status 401', t5.status === 401, `got ${t5.status}`);
  ok('success: false', t5.body.success === false);
  console.log();

  // ── Test 6: Student JWT → 403 ────────────────────────────────────────────
  console.log('-- Test 6: Student JWT -> 403 --');
  const t6 = await http(endpoint, {
    method: 'PATCH',
    headers: authHeaders(studentSession.token),
    body: JSON.stringify({ isAvailable: false })
  });
  ok('Status 403', t6.status === 403, `got ${t6.status}`);
  ok('success: false', t6.body.success === false);
  console.log();

  // ── Test 7: Other Shop's item → 404 ──────────────────────────────────────
  console.log("-- Test 7: Other shop's item -> 404 --");
  if (chilloxItem) {
    const t7 = await http(`/api/shops/menu/${chilloxItem._id}/availability`, {
      method: 'PATCH',
      headers: authHeaders(shopSession.token),
      body: JSON.stringify({ isAvailable: false })
    });
    ok('Status 404', t7.status === 404, `got ${t7.status}`);
    ok('success: false', t7.body.success === false);
  } else {
    console.log('  SKIP  No second shop items found');
  }
  console.log();

  // ── Test 8: Student shop view strips unavailable items ───────────────────
  console.log('-- Test 8: Student shop view excludes unavailable items --');
  // Mark item unavailable
  await setAvailabilityDirect(ITEM_ID, shopSession.token, false);

  // Hit public shop endpoint (used by student ShopDetails.jsx)
  const t8pub = await http(`/api/shops/${shopId}`);
  ok('Public GET /api/shops/:id returns 200', t8pub.status === 200, `got ${t8pub.status}`);
  const pubIds = (t8pub.body.menuItems || []).map(m => m._id?.toString());
  ok('Unavailable item absent from public shop response', !pubIds.includes(ITEM_ID?.toString()));

  // Hit student-specific endpoint
  const t8stu = await http(`/api/student/shops/${shopId}`);
  ok('/api/student/shops/:id returns 200', t8stu.status === 200, `got ${t8stu.status}`);
  const stuIds = (t8stu.body.menuItems || []).map(m => m._id?.toString());
  ok('Unavailable item absent from student shop response', !stuIds.includes(ITEM_ID?.toString()));

  // Restore
  await setAvailabilityDirect(ITEM_ID, shopSession.token, false); // still has stock=0 risk? No, we restored to 50 above
  // Re-ensure available
  const restoreResult = await setAvailabilityDirect(ITEM_ID, shopSession.token, true);
  ok('Item restored to available after test', restoreResult.body.menuItem?.isAvailable === true);
  console.log();

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('================================================');
  console.log(`  RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================\n');

  if (failed > 0) process.exit(1);
}

main().catch(err => { console.error('\nTest runner crashed:', err.message); process.exit(1); });
