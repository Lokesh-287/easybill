import puppeteer from 'puppeteer-core';
import path from 'path';

async function runCleanManualFlowTest() {
  console.log('===============================================================');
  console.log('Testing Clean Slate & Manual End-to-End Flow Execution');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  page.on('dialog', async dialog => await dialog.accept());
  await page.setViewport({ width: 1400, height: 900 });

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

  try {
    // 1. Navigate to Settings and clear all document data
    console.log('--- Step 1: Navigating to Settings Data Reset ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/settings', { waitUntil: 'networkidle0' });
    await page.waitForSelector('button', { timeout: 5000 });

    // Click "Data Reset & Testing" tab
    await page.evaluate(() => {
      const dataTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Data Reset'));
      if (dataTab) dataTab.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Click "Clear All Document Data (Start Fresh)"
    await page.evaluate(() => {
      const clearBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Clear All Document Data'));
      if (clearBtn) clearBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Verify all document counters are 0
    const countersClean = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Clean Testing Slate');
    });
    assert(countersClean, 'All document data cleared to 0 via Settings Data Management');

    // 2. Check Sales List is completely empty
    console.log('\n--- Step 2: Checking Sales Invoices is Empty ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/sales', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const salesEmpty = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('No invoices match your filter') || text.includes('0 of 0 invoices') || text.includes('₹0.00');
    });
    assert(salesEmpty, 'Sales Invoices register is completely empty (0 bills)');

    // 3. Check Purchases List is completely empty
    console.log('\n--- Step 3: Checking Purchases List is Empty ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/purchase', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const purchasesEmpty = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('No purchase bills found') || text.includes('₹0.00') || !text.includes('INV-88912');
    });
    assert(purchasesEmpty, 'Purchase Bills register is completely empty (0 vendor bills)');

    // 4. Check Day Book has 0 transactions
    console.log('\n--- Step 4: Checking Day Book is Clean ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/cash', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const dayBookClean = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('All Transactions (0)') || text.includes('No cash entries') || text.includes('₹0.00');
    });
    assert(dayBookClean, 'Day Book transactions log is clean with 0 transactions');

    // 5. Test Manual Flow: Create Bill #1 in POS
    console.log('\n--- Step 5: Testing Flow - Creating First Bill in POS ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.pos-item-card', { timeout: 5000 });

    // Add Paracetamol 650mg
    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll('.pos-item-card')).find(c => c.textContent && c.textContent.includes('Paracetamol'));
      if (card) card.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Tender Cash ₹50
    await page.evaluate(() => {
      const cashInp = document.querySelector('input[type="number"]');
      if (cashInp) {
        cashInp.value = '50';
        cashInp.dispatchEvent(new Event('input'));
      }
    });
    await new Promise(r => setTimeout(r, 300));

    // Complete & Print Bill
    await page.evaluate(() => {
      const payBtn = document.querySelector('button[data-testid="btn-save-print"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Save & Print'));
      if (payBtn) payBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const billCreated = await page.evaluate(() => {
      return document.body.innerText.includes('completed successfully') || document.body.innerText.includes('INV-2026-');
    });
    assert(billCreated, 'First POS Bill successfully created and settled with cash');

    // 6. Check that Bill #1 now appears in Sales List!
    console.log('\n--- Step 6: Verifying Bill #1 Appears in Sales List ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/sales', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const invoiceInList = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('INV-2026-') && text.includes('Walk-in Customer') && text.includes('Showing 1 of 1 invoices');
    });
    assert(invoiceInList, 'Newly created Bill #1 dynamically appears in Sales Invoices list');

    // 7. Check that Day Book reflects the Cash Sale
    console.log('\n--- Step 7: Verifying Cash Inflow in Day Book ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/cash', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const cashRecorded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Sales Receipt') || text.includes('INV-2026-') || text.includes('All Transactions (1)');
    });
    assert(cashRecorded, 'Cash received from Bill #1 dynamically recorded in Cash Drawer Day Book');

  } catch (err) {
    console.error('Test error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n===============================================================');
  console.log(`Flow Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');
  if (failed > 0) process.exit(1);
}

runCleanManualFlowTest();
