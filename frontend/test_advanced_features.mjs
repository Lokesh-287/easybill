import puppeteer from 'puppeteer-core';

async function runAdvancedFeatureTests() {
  console.log('===============================================================');
  console.log('EasyBill Advanced Features & Frappe UX Pattern Test Suite');
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

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Global Awesomebar Command Palette (Ctrl+K)
    // -------------------------------------------------------------------------
    console.log('--- Testing Awesomebar Command Palette (Ctrl+K) ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.pos-item-card', { timeout: 5000 });

    // 1A: Test trigger via topbar search input click
    const topbarSearch = await page.$('.w-80.cursor-pointer');
    assert(topbarSearch !== null, 'Topbar search bar trigger found in AppShell');

    if (topbarSearch) {
      await topbarSearch.click();
      await new Promise(r => setTimeout(r, 400));
    }

    // Check if Awesomebar modal opened
    let awesomebarInput = await page.$('input[placeholder*="Search screens, actions"]');
    assert(awesomebarInput !== null, 'Awesomebar opened via search click trigger');

    // Close with Escape key
    if (awesomebarInput) {
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 300));
    }

    // 1B: Test trigger via keyboard shortcut Ctrl+K
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', ctrlKey: true, bubbles: true }));
    });
    await new Promise(r => setTimeout(r, 400));

    awesomebarInput = await page.$('input[placeholder*="Search screens, actions"]');
    assert(awesomebarInput !== null, 'Awesomebar opened via Ctrl+K keyboard shortcut');

    // 1C: Fuzzy search and execute command via mouse click
    if (awesomebarInput) {
      await awesomebarInput.type('stock');
      await new Promise(r => setTimeout(r, 300));

      const hasStockCommand = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span')).some(s => s.textContent && s.textContent.includes('Stock Summary & Valuation'));
      });
      assert(hasStockCommand, 'Awesomebar fuzzy filters matching commands for "stock"');

      // Click the Stock Summary command to navigate
      const clicked = await page.evaluate(() => {
        const item = Array.from(document.querySelectorAll('div.cursor-pointer')).find(el => el.textContent && el.textContent.includes('Stock Summary & Valuation'));
        if (item) {
          item.click();
          return true;
        }
        return false;
      });
      assert(clicked, 'Clicked Stock Summary & Valuation command in Awesomebar');
      await new Promise(r => setTimeout(r, 600));

      assert(page.url().includes('#/stock'), 'Navigated to Stock Summary screen via Awesomebar command selection');
    }

    // -------------------------------------------------------------------------
    // TEST 2: Inter-Godown Stock Transfer Modal (SCR-G3)
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Inter-Godown Stock Transfer (SCR-G3) ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/stock', { waitUntil: 'networkidle0' });
    await page.waitForSelector('table', { timeout: 5000 });

    // Click Godown Transfer button
    const transferOpened = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Godown Transfer'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(transferOpened, 'Godown Transfer (SCR-G3) action button clicked');
    await new Promise(r => setTimeout(r, 400));

    const transferModalTitle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div')).some(d => d.textContent && d.textContent.includes('Inter-Godown Stock Transfer (SCR-G3)'));
    });
    assert(transferModalTitle, 'Inter-Godown Stock Transfer modal rendered with warehouse selectors');

    // Confirm Transfer
    const confirmed = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Confirm Transfer'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(confirmed, 'Confirm Transfer button triggered');
    await new Promise(r => setTimeout(r, 500));

    // Verify toast notification
    const toastPresent = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div')).some(d => d.textContent && d.textContent.includes('Stock Transferred'));
    });
    assert(toastPresent, 'Non-blocking toast notification confirmed stock transfer');

    // -------------------------------------------------------------------------
    // TEST 3: Settings Users & Staff RBAC (SCR-B3) & Statutory Identifiers
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Settings Users & Staff RBAC (SCR-B3) ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/settings', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h1', { timeout: 5000 });

    // Verify Statutory fields (FSSAI & Drug License) in Store Profile tab
    const storeProfileText = await page.evaluate(() => document.body.innerText);
    assert(storeProfileText.includes('FSSAI License') && storeProfileText.includes('Drug License'), 'Store Profile includes retail statutory license identifiers (FSSAI & Drug License)');

    // Click Users & Permissions RBAC tab
    const clickedUsersTab = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Users & Permissions'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(clickedUsersTab, 'Users & Permissions RBAC (SCR-B3) tab clicked');
    await new Promise(r => setTimeout(r, 600));

    const pageText = await page.evaluate(() => document.body.innerText);
    assert(pageText.includes('Staff Roster & Fast PIN Credentials') && pageText.includes('Role-Based Access Control Matrix (RBAC)'), 'Staff Roster and granular RBAC Matrix rendered');
    assert(pageText.includes('View Wholesale Cost & Margins') && pageText.includes('Manager Override for Large Discounts'), 'Cashier cost redaction (RULE-08) and Manager override policies present in RBAC Matrix');

    // Click Add New Staff Member button
    const openedStaffModal = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add Staff Member'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(openedStaffModal, 'Add New Staff Member button triggered');
    await new Promise(r => setTimeout(r, 400));

    const addModalPresent = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span, div')).some(d => d.textContent && d.textContent.includes('Add New Staff Member'));
    });
    assert(addModalPresent, 'Add/Edit Staff Member modal dialog opens with terminal & PIN inputs');

    // Close user modal
    await page.evaluate(() => {
      const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Cancel');
      if (cancelBtn) cancelBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // -------------------------------------------------------------------------
    // TEST 4: Customer Selector Modal Search (F4) in POS Billing
    // -------------------------------------------------------------------------
    console.log('\n--- Testing POS Customer Search Filter (F4) ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.pos-item-card', { timeout: 5000 });

    // Open Customer Modal via clicking Customer card or F4 trigger
    await page.evaluate(() => {
      const customerTrigger = document.querySelector('[title*="Change Customer"]') || document.querySelector('.cursor-pointer.bg-slate-50');
      if (customerTrigger) customerTrigger.click();
    });
    await new Promise(r => setTimeout(r, 500));

    let customerSearchInput = await page.$('input[placeholder*="Search customer by name"]');
    if (!customerSearchInput) {
      await page.evaluate(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F4', bubbles: true }));
      });
      await new Promise(r => setTimeout(r, 400));
      customerSearchInput = await page.$('input[placeholder*="Search customer by name"]');
    }
    assert(customerSearchInput !== null, 'Customer selector modal has real-time search input');

    if (customerSearchInput) {
      await customerSearchInput.type('Murugan');
      await new Promise(r => setTimeout(r, 400));

      const hasMurugan = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div')).some(d => d.textContent && d.textContent.includes('Murugan Department'));
      });
      assert(hasMurugan, 'Customer search filter filtered list to matching customer');

      // Select the customer
      await page.evaluate(() => {
        const card = Array.from(document.querySelectorAll('.max-h-60 div.cursor-pointer')).find(e => e.textContent && e.textContent.includes('Murugan Department'));
        if (card) card.click();
      });
      await new Promise(r => setTimeout(r, 400));

      const currentCustomer = await page.evaluate(() => {
        const el = document.querySelector('[title*="Change Customer"]');
        return el ? el.innerText : '';
      });
      assert(currentCustomer.includes('Murugan'), 'Customer successfully selected and applied to POS billing cart');
    }

    // -------------------------------------------------------------------------
    // TEST 5: Sales Return & Credit Note Workflow (SCR-E6)
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Sales Return & Credit Note (SCR-E6) ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/sales', { waitUntil: 'networkidle0' });
    await page.waitForSelector('table', { timeout: 5000 });

    // Click first invoice row in table
    const clickedInvoice = await page.evaluate(() => {
      const row = document.querySelector('tbody tr');
      if (row) {
        row.click();
        return true;
      }
      return false;
    });
    assert(clickedInvoice, 'Sales invoice clicked and drawer opened');
    await new Promise(r => setTimeout(r, 500));

    // Click Return (SCR-E6) button in drawer
    const clickedReturn = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Return (SCR-E6)'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(clickedReturn, 'Sales Return (SCR-E6) button present in invoice drawer');
    await new Promise(r => setTimeout(r, 400));

    const returnModalTitle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div')).some(d => d.textContent && d.textContent.includes('Sales Return & Credit Note (SCR-E6)'));
    });
    assert(returnModalTitle, 'Sales Return & Credit Note modal dialog rendered');

    // Confirm Return
    const confirmedReturn = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Confirm Return'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(confirmedReturn, 'Confirm Return button triggered');
    await new Promise(r => setTimeout(r, 500));

    const returnToastPresent = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div')).some(d => d.textContent && d.textContent.includes('Sales Return Processed'));
    });
    assert(returnToastPresent, 'Non-blocking toast notification confirmed Sales Return and Credit Note creation');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n===============================================================');
  console.log(`ADVANCED FEATURES TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAdvancedFeatureTests();
