import puppeteer from 'puppeteer-core';

async function runScenarioTests() {
  console.log('===============================================================');
  console.log('EasyBill Field-Level & Business Logic Scenario Test Suite');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // SCENARIO 1: POS Terminal Field Edge Cases (SCR-E1)
  // -------------------------------------------------------------------------
  console.log('--- Testing POS Terminal (SCR-E1) Field Validations ---');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pos-item-card', { timeout: 5000 });

  // Add first item to cart
  const itemCards = await page.$$('.pos-item-card');
  await itemCards[0].click();
  await page.waitForSelector('input[type="number"][min="1"]');

  // Verify Line Qty NaN & zero coercion
  const qtyInput = await page.$('input[type="number"][min="1"]');
  await page.evaluate(el => {
    el.value = '0';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }, qtyInput);
  await new Promise(r => setTimeout(r, 200));

  const coercedQty = await page.evaluate(el => el.value, qtyInput);
  assert(coercedQty === '1', 'TC-POS-01: Line quantity zero/invalid input coerces to min 1 (not 0 or NaN)');

  // Verify Cart Total is not NaN
  const payableText = await page.evaluate(() => document.body.innerText);
  assert(!payableText.includes('NaN'), 'TC-POS-01b: Cart totals contain no NaN values');

  // Verify Short Tender Warning
  const cashInput = await page.$('input[placeholder="0.00"]');
  if (cashInput) {
    await page.evaluate(el => {
      el.value = '10';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, cashInput);
    await new Promise(r => setTimeout(r, 200));

    const pageContent = await page.evaluate(() => document.body.innerText);
    assert(pageContent.includes('Short Tender') || pageContent.includes('needed'), 'TC-POS-02: Short tender warning displays when cash received < grand total');
  }

  // Verify Quick Cash Presets
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('₹500'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 200));
  const pageAfterPreset = await page.evaluate(() => document.body.innerText);
  assert(pageAfterPreset.includes('Change to Return'), 'TC-POS-05: Quick cash preset ₹500 calculates change return reactively');

  // Verify Bill Hold (F9 / Hold Button) and Resume
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const holdBtn = btns.find(b => b.innerText.includes('Hold Bill'));
    if (holdBtn) holdBtn.click();
  });
  await new Promise(r => setTimeout(r, 200));
  const heldCount = await page.evaluate(() => {
    return document.body.innerText.includes('1 Held');
  });
  assert(heldCount, 'TC-POS-04: Park/Hold Bill places bill in queue with counter badge');

  // -------------------------------------------------------------------------
  // SCENARIO 2: Day Book Denomination & Signed Variance (SCR-I1, SCR-I2)
  // -------------------------------------------------------------------------
  console.log('\n--- Testing Day Book & Shift Close (SCR-I1, SCR-I2) ---');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/cash', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table', { timeout: 5000 });

  // Open Shift Close modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.innerText.includes('Shift / Day Close'));
    if (closeBtn) closeBtn.click();
  });
  await page.waitForSelector('.shadow-modal', { timeout: 3000 });

  // Clear denomination input and ensure Total Counted Cash is not NaN
  const denomInputs = await page.$$('.shadow-modal input[type="number"]');
  if (denomInputs.length > 0) {
    await page.evaluate(el => {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, denomInputs[0]);
    await new Promise(r => setTimeout(r, 200));

    const modalText = await page.evaluate(() => {
      const modal = document.querySelector('.shadow-modal');
      return modal ? modal.innerText : '';
    });
    assert(!modalText.includes('NaN'), 'TC-DAY-01: Denomination counter backspace coerces to zero without producing NaN');
    assert(modalText.includes('₹'), 'TC-DAY-02: Variance formatting renders properly with currency symbol');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 3: Stock Summary Fractional Units (SCR-G1, SCR-G2)
  // -------------------------------------------------------------------------
  console.log('\n--- Testing Stock Summary & Reconciliation (SCR-G1, SCR-G2) ---');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/stock', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table', { timeout: 5000 });

  // Open Stock Reconciliation modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const recBtn = btns.find(b => b.innerText.includes('Stock Reconciliation'));
    if (recBtn) recBtn.click();
  });
  await page.waitForSelector('.shadow-modal', { timeout: 3000 });

  const hasStepAny = await page.evaluate(() => {
    const input = document.querySelector('.shadow-modal input[type="number"]');
    return input ? input.getAttribute('step') === 'any' : false;
  });
  assert(hasStepAny, 'TC-STK-01: Stock reconciliation count input supports decimal step="any" for fractional items (kg/litre)');

  // -------------------------------------------------------------------------
  // SCENARIO 4: Parties GSTIN Uppercase Normalization (SCR-D1, SCR-D2)
  // -------------------------------------------------------------------------
  console.log('\n--- Testing Parties Master GSTIN Formatting (SCR-D1, SCR-D2) ---');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/parties', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table', { timeout: 5000 });

  // Open Add Party drawer
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find(b => b.innerText.includes('Add Party'));
    if (addBtn) addBtn.click();
  });
  await page.waitForSelector('input[placeholder="e.g. 33AABCP1234F1Z1"]', { timeout: 3000 });

  const gstinInput = await page.$('input[placeholder="e.g. 33AABCP1234F1Z1"]');
  await page.evaluate(el => {
    el.value = '33aabcp1234f1z1';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, gstinInput);
  await new Promise(r => setTimeout(r, 200));

  const gstinVal = await page.evaluate(el => el.value, gstinInput);
  assert(gstinVal === '33AABCP1234F1Z1', 'TC-PAR-03: GSTIN automatically normalizes to uppercase in memory');

  const selectedState = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const stateSelect = selects.find(s => s.value.includes('Tamil Nadu'));
    return stateSelect ? stateSelect.value : '';
  });
  assert(selectedState.includes('Tamil Nadu (33)'), 'TC-PAR-02: State code 33 auto-selects Tamil Nadu (33)');

  // -------------------------------------------------------------------------
  // SCENARIO 5: Login PIN Pad Physical Keyboard Entry (SCR-A1)
  // -------------------------------------------------------------------------
  console.log('\n--- Testing Login PIN Pad Physical Numpad Entry (SCR-A1) ---');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/login', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h2', { timeout: 3000 });

  // Type 1, 2, 3, 4 via physical keyboard
  await page.keyboard.press('1');
  await page.keyboard.press('2');
  await page.keyboard.press('3');
  await page.keyboard.press('4');
  await new Promise(r => setTimeout(r, 500));

  const currentUrl = page.url();
  assert(currentUrl.includes('/bill/new'), 'TC-LOG-01: Fast PIN authentication responds to physical keyboard numpad input (1234)');

  await browser.close();

  console.log('\n===============================================================');
  console.log(`SCENARIO TEST RESULTS: ${passed} PASSED, ${failed} FAILED (100% Target)`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runScenarioTests().catch(err => {
  console.error('Scenario tests encountered unhandled error:', err);
  process.exit(1);
});
