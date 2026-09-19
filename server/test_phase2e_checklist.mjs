/**
 * Phase 2E — Delete Menu Item Test Suite
 *
 * Tests:
 *  1. Delete own menu item           → 200
 *  2. Item gone on page refresh      → not in GET /my-shop response
 *  3. No JWT                         → 401
 *  4. Student JWT                    → 403
 *  5. Another shop's item            → 404
 *  6. Nonexistent valid ObjectId     → 404
 *  7. Invalid ObjectId (CastError)   → 404 (not 500)
 *
 * Note: Cloudinary cleanup is best-effort; verified via imagePublicId
 * being present on the item before deletion (logged, not asserted).
 * MongoDB removal is confirmed via Test 2.
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

async function addItem(token, shopData) {
  const fd = new FormData();
  fd.append('name',          'Test Item Phase 2E');
  fd.append('price',         '99');
  fd.append('category',      'Meals');
  fd.append('stockQuantity', '10');
  const r = await http('/api/shops/menu', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });
  if (!r.body.menuItem) throw new Error('Could not add test item: ' + JSON.stringify(r.body));
  return r.body.menuItem;
}

async function main() {
  console.log('\n================================================');
  console.log(' Phase 2E - Delete Menu Item Tests ');
  console.log('================================================\n');

  // ── Setup ──────────────────────────────────────────────────────────────────
  const shopSession    = await login('shop@uiu.ac.bd', 'password123');
  const studentSession = await login('student@uiu.ac.bd', 'password123');
  const chilloxSession = await login('chillox@uiu.ac.bd', 'password123');

  const myShopData     = await getMyShop(shopSession.token);
  const chilloxData    = await getMyShop(chilloxSession.token);

  const chilloxItems   = chilloxData.menuItems || [];
  const chilloxItem    = chilloxItems[0];

  console.log(`  Shop         : ${myShopData.shop.name}`);
  console.log(`  Student      : ${studentSession.user.name}`);
  console.log(`  Other Shop   : ${chilloxData.shop.name}`);
  if (chilloxItem) console.log(`  Other Item   : ${chilloxItem.name}`);
  console.log();

  // ── Create a disposable test item ─────────────────────────────────────────
  console.log('-- Setup: Creating disposable test item --');
  const testItem = await addItem(shopSession.token, myShopData.shop);
  console.log(`  Created item : "${testItem.name}"  (id=${testItem._id})`);
  if (testItem.imagePublicId) {
    console.log(`  imagePublicId: ${testItem.imagePublicId}  (Cloudinary cleanup will fire)`);
  } else {
    console.log(`  imagePublicId: (none — default image URL, no Cloudinary asset to clean)`);
  }
  console.log();

  const ITEM_ID    = testItem._id;
  const deleteEndpoint = `/api/shops/menu/${ITEM_ID}`;

  // ── Test 1: Delete own item → 200 ─────────────────────────────────────────
  console.log('-- Test 1: Delete own item → 200 --');
  const t1 = await http(deleteEndpoint, {
    method: 'DELETE',
    headers: authHeaders(shopSession.token)
  });
  ok('Status 200', t1.status === 200, `got ${t1.status}`);
  ok('success: true', t1.body.success === true);
  ok('message: deleted', t1.body.message?.toLowerCase().includes('deleted'));
  console.log();

  // ── Test 2: Refresh — item no longer in GET /my-shop ──────────────────────
  console.log('-- Test 2: Item absent from GET /my-shop after deletion --');
  const refreshed = await getMyShop(shopSession.token);
  const stillThere = (refreshed.menuItems || []).some(
    i => i._id?.toString() === ITEM_ID?.toString()
  );
  ok('Item not in /my-shop response (MongoDB removed)', !stillThere);
  console.log();

  // ── Test 3: No JWT → 401 ──────────────────────────────────────────────────
  console.log('-- Test 3: No JWT → 401 --');
  const t3 = await http(deleteEndpoint, { method: 'DELETE' });
  ok('Status 401', t3.status === 401, `got ${t3.status}`);
  ok('success: false', t3.body.success === false);
  console.log();

  // ── Test 4: Student JWT → 403 ─────────────────────────────────────────────
  console.log('-- Test 4: Student JWT → 403 --');
  const t4 = await http(deleteEndpoint, {
    method: 'DELETE',
    headers: authHeaders(studentSession.token)
  });
  ok('Status 403', t4.status === 403, `got ${t4.status}`);
  ok('success: false', t4.body.success === false);
  console.log();

  // ── Test 5: Another shop's item → 404 ─────────────────────────────────────
  console.log("-- Test 5: Another shop's item → 404 --");
  if (chilloxItem) {
    const t5 = await http(`/api/shops/menu/${chilloxItem._id}`, {
      method: 'DELETE',
      headers: authHeaders(shopSession.token)
    });
    ok('Status 404', t5.status === 404, `got ${t5.status}`);
    ok('success: false', t5.body.success === false);
  } else {
    console.log('  SKIP  No chillox items found');
  }
  console.log();

  // ── Test 6: Nonexistent valid ObjectId → 404 ──────────────────────────────
  console.log('-- Test 6: Nonexistent valid ObjectId → 404 --');
  const fakeId = '000000000000000000000099';
  const t6 = await http(`/api/shops/menu/${fakeId}`, {
    method: 'DELETE',
    headers: authHeaders(shopSession.token)
  });
  ok('Status 404', t6.status === 404, `got ${t6.status}`);
  ok('success: false', t6.body.success === false);
  console.log();

  // ── Test 7: Invalid ObjectId (CastError) → 404 ───────────────────────────
  console.log('-- Test 7: Invalid ObjectId (CastError) → 404 (not 500) --');
  const t7 = await http('/api/shops/menu/abc123', {
    method: 'DELETE',
    headers: authHeaders(shopSession.token)
  });
  ok('Status 404', t7.status === 404, `got ${t7.status}`);
  ok('success: false', t7.body.success === false);
  ok('Not a 500 error', t7.status !== 500);
  console.log();

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('================================================');
  console.log(`  RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================\n');

  if (failed > 0) process.exit(1);
}

main().catch(err => { console.error('\nTest runner crashed:', err.message); process.exit(1); });
