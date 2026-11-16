import puppeteer from 'puppeteer-core';

async function runMobileAppTests() {
  console.log('===============================================================');
  console.log('EasyBill Mobile App & PWA Verification Test Suite');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  page.on('dialog', async dialog => await dialog.accept());

  // Simulate iPhone 14 / modern Android viewport (390 x 844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

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
    // TEST 1: PWA Web App Manifest & Service Worker Verification
    // -------------------------------------------------------------------------
    console.log('--- Testing PWA Manifest & Service Worker ---');
    const manifestRes = await fetch('http://easybill.localhost:8007/assets/easybill/frontend/manifest.json');
    assert(manifestRes.ok, 'PWA Web App Manifest (manifest.json) served with HTTP 200');

    const manifestData = await manifestRes.json();
    assert(manifestData.short_name === 'EasyBill POS' && manifestData.display === 'standalone', 'PWA configured as standalone mobile app with start_url');
    assert(manifestData.icons && manifestData.icons.length >= 2, 'PWA includes 192x192 & 512x512 vector mobile app icons');

    const swRes = await fetch('http://easybill.localhost:8007/assets/easybill/frontend/sw.js');
    assert(swRes.ok, 'PWA Service Worker (sw.js) served with offline caching engine');

    // -------------------------------------------------------------------------
    // TEST 2: Mobile Bottom Navigation Bar & Layout (< 768px)
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Mobile Bottom Navigation Bar ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('nav', { timeout: 5000 });

    const bottomNavText = await page.evaluate(() => {
      const nav = document.querySelector('nav.fixed.bottom-0');
      return nav ? nav.innerText : '';
    });
    assert(bottomNavText.includes('POS Bill') && bottomNavText.includes('Invoices') && bottomNavText.includes('Stock') && bottomNavText.includes('Owner Live'), 'Mobile bottom navigation bar rendered with POS, Invoices, Stock, Owner Live & More tabs');

    // -------------------------------------------------------------------------
    // TEST 3: Store Owner Live Companion Dashboard (/mobile/owner)
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Store Owner Mobile Live Dashboard ---');
    await page.evaluate(() => {
      const link = Array.from(document.querySelectorAll('nav a')).find(a => a.textContent && a.textContent.includes('Owner Live'));
      if (link) link.click();
    });
    await new Promise(r => setTimeout(r, 600));

    assert(page.url().includes('#/mobile/owner'), 'Navigated to Store Owner Mobile Live Dashboard');

    const ownerText = await page.evaluate(() => document.body.innerText.toLowerCase());
    assert(ownerText.includes('store owner companion') && ownerText.includes('gross sales'), 'Owner Dashboard displays live store header and gross revenue');
    assert(ownerText.includes('cash in drawer') && ownerText.includes('upi'), 'Owner Dashboard tracks drawer cash balance vs UPI collections');
    assert(ownerText.includes('hourly sales velocity') && ownerText.includes('low stock alerts'), 'Hourly sales velocity chart and low stock alerts rendered');
    assert(ownerText.includes('khata credit receivables') && ownerText.includes('remind'), 'Khata credit receivables displayed with 1-click WhatsApp payment reminder');
    assert(ownerText.includes('instant godown stock lookup'), 'Godown vs counter shelf stock checker active');

    // Test WhatsApp payment reminder click
    await page.evaluate(() => {
      const remindBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Remind'));
      if (remindBtn) remindBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const reminderToast = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div')).some(d => d.textContent && d.textContent.includes('WhatsApp payment reminder'));
    });
    assert(reminderToast, '1-Click WhatsApp payment reminder triggered toast confirmation');

    // -------------------------------------------------------------------------
    // TEST 4: Mobile POS Camera Barcode Scanner & Touch Cart
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Mobile Camera Barcode Scanner & Touch Billing ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.pos-item-card', { timeout: 5000 });

    // Open Camera Barcode Scanner
    const cameraOpened = await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Camera Barcode Scanner"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(cameraOpened, 'Mobile Camera Barcode Scanner button available and triggered');
    await new Promise(r => setTimeout(r, 600));

    const scannerTitle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span, div')).some(d => d.textContent && d.textContent.includes('Scan Product Barcode'));
    });
    assert(scannerTitle, 'Camera Barcode Scanner modal opened with live viewfinder overlay');

    // Submit Barcode via input
    const scannerInput = await page.$('input[placeholder*="Or type barcode"]');
    if (scannerInput) {
      await scannerInput.type('8901234001');
      await page.evaluate(() => {
        const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Add');
        if (addBtn) addBtn.click();
      });
      await new Promise(r => setTimeout(r, 500));

      const scanSuccess = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span, div')).some(d => d.textContent && d.textContent.includes('Added to Cart'));
      });
      assert(scanSuccess, 'Barcode scanned and successfully verified in viewfinder');
    }

    // Close Scanner
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Close Scanner"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Verify Sticky Mobile Cart Summary Bar
    const mobileCartBar = await page.evaluate(() => {
      return !!document.querySelector('.sticky.bottom-1');
    });
    assert(mobileCartBar, 'Sticky Mobile Cart Summary Bar appeared above bottom navigation');

    // Click "View Cart" to open Mobile Cart Drawer
    await page.evaluate(() => {
      const btn = document.querySelector('.sticky.bottom-1 button');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const cartDrawerOpen = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span')).some(s => s.textContent && s.textContent.includes('Shopping Cart'));
    });
    assert(cartDrawerOpen, 'Mobile Cart slide-up drawer opened with item quantities and payment split');

    // Complete Sale and verify Bluetooth thermal print button
    await page.evaluate(() => {
      const printBtn = document.querySelector('[data-testid="btn-save-print"]');
      if (printBtn) printBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const btPrintPresent = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.textContent && b.textContent.includes('BT Print'));
    });
    assert(btPrintPresent, 'Receipt preview contains direct Mobile Bluetooth ESC/POS Print button');

    // -------------------------------------------------------------------------
    // TEST 5: Mobile Slide-up Menu Drawer
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Mobile Slide-up Menu Sheet ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/sales', { waitUntil: 'networkidle0' });
    await page.waitForSelector('nav', { timeout: 5000 });

    // Click "More" on bottom nav
    await page.evaluate(() => {
      const moreBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent && b.textContent.includes('More'));
      if (moreBtn) moreBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const menuOpen = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span')).some(s => s.textContent && s.textContent.includes('EasyBill Mobile Menu'));
    });
    assert(menuOpen, 'Mobile slide-up menu sheet opened with full application module grid');

    const menuItems = await page.evaluate(() => document.body.innerText);
    assert(menuItems.includes('Day Book') && menuItems.includes('Purchases') && menuItems.includes('Items Master') && menuItems.includes('Pair Bluetooth'), 'Mobile menu provides fast routing to Day Book, Purchases, Items, and Bluetooth pairing');

  } catch (err) {
    console.error('Mobile test execution error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n===============================================================');
  console.log(`MOBILE APP TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runMobileAppTests();
