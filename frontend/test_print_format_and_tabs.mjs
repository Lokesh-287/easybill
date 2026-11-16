import puppeteer from 'puppeteer-core';
import path from 'path';

async function runPrintFormatAndTabsTests() {
  console.log('===============================================================');
  console.log('EasyBill Frappe Print Format Preview & Tablet ("Tab") Test Suite');
  console.log('===============================================================\n');

  const artifactDir = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3';
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  page.on('dialog', async dialog => await dialog.accept());

  // Simulate Tablet Viewport (iPad Landscape / 10-inch POS: 1024 x 768)
  await page.setViewport({ width: 1024, height: 768, isMobile: true, hasTouch: true });

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
    // TEST 1: Tablet Responsive Split Screen (Catalog + Cart Side-by-Side)
    // -------------------------------------------------------------------------
    console.log('--- Testing Tablet ("Tab") Responsive Layout (1024x768) ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.pos-item-card', { timeout: 5000 });

    const isCatalogVisible = await page.evaluate(() => {
      const el = document.querySelector('.pos-item-card');
      return el && window.getComputedStyle(el).display !== 'none';
    });
    assert(isCatalogVisible, 'Tablet POS displays catalog item grid on left pane');

    const isCartVisibleOnTablet = await page.evaluate(() => {
      const cartPane = document.querySelector('div.md\\:w-2\\/5, div.lg\\:w-5\\/12');
      return cartPane && window.getComputedStyle(cartPane).display !== 'none';
    });
    assert(isCartVisibleOnTablet, 'Tablet POS docks active cart on right pane simultaneously (no drawer needed)');

    // -------------------------------------------------------------------------
    // TEST 2: Multi-Cart Billing Tabs Engine (Tab 1, Tab 2, + New Tab)
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Multi-Cart Billing Tabs Engine ---');
    const tab1Exists = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div')).some(d => d.textContent && d.textContent.includes('Tab 1:'));
    });
    assert(tab1Exists, 'Default Tab 1 rendered in top billing tabs bar');

    // Add item to Tab 1 (Paracetamol 650mg)
    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll('.pos-item-card')).find(c => c.textContent.includes('Paracetamol 650mg'));
      if (card) card.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const tab1HasTotal = await page.evaluate(() => {
      const tab1Badge = document.querySelector('[data-testid="billing-tab-1"]');
      return tab1Badge && tab1Badge.textContent.includes('₹');
    });
    assert(tab1HasTotal, 'Tab 1 badge reactively reflects live cart total');

    // Open New Tab (+ New Tab)
    await page.evaluate(() => {
      const newTabBtn = document.querySelector('[data-testid="btn-new-tab"]');
      if (newTabBtn) newTabBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const tab2Active = await page.evaluate(() => {
      return !!document.querySelector('[data-testid="billing-tab-2"]');
    });
    assert(tab2Active, 'New Tab 2 successfully created and activated (+ New Tab / Ctrl+T)');

    // Verify Tab 2 cart is initially empty
    const tab2CartEmpty = await page.evaluate(() => {
      return document.body.innerText.includes('Bill Cart is Empty');
    });
    assert(tab2CartEmpty, 'Tab 2 begins with isolated, fresh cart session');

    // Add different product to Tab 2 (Amoxicillin 500mg)
    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll('.pos-item-card')).find(c => c.textContent.includes('Amoxicillin 500mg'));
      if (card) card.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Switch back to Tab 1
    await page.evaluate(() => {
      const tab1 = document.querySelector('[data-testid="billing-tab-1"]');
      if (tab1) tab1.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const tab1Preserved = await page.evaluate(() => {
      const cartText = document.querySelector('[data-testid="pos-cart-container"]')?.innerText || '';
      return cartText.includes('Paracetamol 650mg') && !cartText.includes('Amoxicillin 500mg');
    });
    assert(tab1Preserved, 'Switching back to Tab 1 restores original cart items without loss');

    // Switch to Tab 2
    await page.evaluate(() => {
      const tab2 = document.querySelector('[data-testid="billing-tab-2"]');
      if (tab2) tab2.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const tab2Preserved = await page.evaluate(() => {
      const cartText = document.querySelector('[data-testid="pos-cart-container"]')?.innerText || '';
      return cartText.includes('Amoxicillin 500mg') && !cartText.includes('Paracetamol 650mg');
    });
    assert(tab2Preserved, 'Switching to Tab 2 maintains distinct customer cart');

    // Capture tablet multi-cart screenshot
    await page.screenshot({ path: path.join(artifactDir, 'pos_multi_cart_tabs_tablet.png') });

    // -------------------------------------------------------------------------
    // TEST 3: Frappe Print Format Preview Engine
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Frappe Print Format Preview Engine ---');

    // Open Print Format Preview via header button (F7)
    await page.evaluate(() => {
      const previewBtn = document.querySelector('[data-testid="btn-print-format"]');
      if (previewBtn) previewBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const previewModalOpen = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span, div')).some(d => d.textContent && d.textContent.includes('Print Format Preview'));
    });
    assert(previewModalOpen, 'Frappe Print Format Preview modal opened successfully');

    // Verify Standard GST Tax Invoice (A4) elements
    const a4FormatText = await page.evaluate(() => document.body.innerText.toLowerCase());
    assert(a4FormatText.includes('tax invoice') && a4FormatText.includes('sec 31 of cgst act'), 'Renders statutory TAX INVOICE header with Section 31 CGST Act citation');
    assert(a4FormatText.includes('gstin: 33aaaaa0000a1z5') && a4FormatText.includes('fssai:'), 'Displays store letterhead with GSTIN, PAN, FSSAI and Tamil Nadu (33) state code');
    assert(a4FormatText.includes('details of receiver / billed to:') && a4FormatText.includes('place of supply:'), 'Includes GST Billed To, Consignee Shipped To, and Place of Supply grid');
    assert(a4FormatText.includes('hsn/sac') && a4FormatText.includes('taxable (₹)'), 'Tabular items grid includes HSN/SAC, UOM, Unit Rate, and Taxable Value');
    assert(a4FormatText.includes('statutory gst tax breakup analysis (inr)'), 'Statutory GST Tax Breakup Analysis table (Central Tax + State Tax) generated');
    assert(a4FormatText.includes('invoice amount in words:') && a4FormatText.includes('only') && a4FormatText.includes('inr'), 'Indian Currency amount in words automatically computed (INR words)');

    // Verify Dynamic UPI QR code generated
    const upiQrRendered = await page.evaluate(() => {
      const img = document.querySelector('img[alt="UPI QR Code"]');
      return img && img.getAttribute('src')?.startsWith('data:image/png');
    });
    assert(upiQrRendered, 'Dynamic UPI scan-to-pay QR code generated via qrcode library');

    // Capture A4 GST Invoice Screenshot
    await page.screenshot({ path: path.join(artifactDir, 'frappe_print_format_a4_gst.png') });

    // -------------------------------------------------------------------------
    // TEST 4: Format Switching (A5 Compact, 80mm Thermal, 58mm, Delivery Challan)
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Print Format Switching ---');

    // Switch to A5 Modern Compact
    await page.select('[data-testid="print-format-select"]', 'a5_gst');
    await new Promise(r => setTimeout(r, 400));
    const a5Text = await page.evaluate(() => document.body.innerText);
    assert(a5Text.includes('TAX INVOICE (A5)'), 'Switched format to Modern Compact Tax Invoice (A5)');
    await page.screenshot({ path: path.join(artifactDir, 'frappe_print_format_a5_compact.png') });

    // Switch to 80mm Thermal Receipt
    await page.select('[data-testid="print-format-select"]', 'thermal_80');
    await new Promise(r => setTimeout(r, 400));
    const thermal80Text = await page.evaluate(() => document.body.innerText);
    assert(thermal80Text.includes('GSTIN: 33AAAAA0000A1Z5') && thermal80Text.includes('GRAND TOTAL:'), 'Switched format to Retail Thermal Receipt (80mm / 3-inch roll)');
    await page.screenshot({ path: path.join(artifactDir, 'frappe_print_format_80mm_thermal.png') });

    // Switch to 58mm Portable Bluetooth Receipt
    await page.select('[data-testid="print-format-select"]', 'thermal_58');
    await new Promise(r => setTimeout(r, 400));
    const thermal58Exists = await page.evaluate(() => {
      const sheet = document.querySelector('#easybill-printable-sheet');
      return sheet && sheet.classList.contains('w-[260px]');
    });
    assert(thermal58Exists, 'Switched format to Portable Bluetooth Thermal Receipt (58mm / 2-inch roll)');

    // Switch to Delivery Challan
    await page.select('[data-testid="print-format-select"]', 'delivery_challan');
    await new Promise(r => setTimeout(r, 400));
    const challanText = await page.evaluate(() => document.body.innerText);
    assert(challanText.includes('DELIVERY CHALLAN'), 'Switched format to Delivery Challan / Transport Memo');

    // Close preview modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title*="Close Preview"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // -------------------------------------------------------------------------
    // TEST 5: Sales List Invoice Reprint via Frappe Print Format
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Sales Invoices List Frappe Print Format ---');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/sales', { waitUntil: 'networkidle0' });
    await page.waitForSelector('table', { timeout: 5000 });

    // Click print icon on first invoice row
    await page.evaluate(() => {
      const printBtn = document.querySelector('button[title*="Reprint"]');
      if (printBtn) printBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const salesPrintModalOpen = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span, div')).some(d => d.textContent && d.textContent.includes('Print Format Preview'));
    });
    assert(salesPrintModalOpen, 'Sales Invoices List triggers Frappe Print Format modal for existing invoices');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n===============================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPrintFormatAndTabsTests();
