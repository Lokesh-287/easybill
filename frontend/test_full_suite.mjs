import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    { name: 'Login & Fast PIN Pad (SCR-A1)', path: '#/login', selector: 'button' },
    { name: 'Setup Wizard (SCR-B1)', path: '#/setup', selector: 'h1' },
    { name: 'POS Rapid Billing (SCR-E1)', path: '#/bill/new', selector: '.pos-item-card' },
    { name: 'Sales Invoices Dashboard (SCR-E2)', path: '#/sales', selector: 'table' },
    { name: 'Items Catalog Master (SCR-C1)', path: '#/items', selector: 'table' },
    { name: 'Customers & Vendors Master (SCR-D1)', path: '#/parties', selector: 'table' },
    { name: 'Purchases & Inward Stock (SCR-F1)', path: '#/purchase', selector: 'table' },
    { name: 'Stock Summary & Valuation (SCR-G1)', path: '#/stock', selector: 'table' },
    { name: 'Day Book & Cash Drawer (SCR-I1)', path: '#/cash', selector: 'table' },
    { name: 'GST Compliance Dashboard (SCR-K1)', path: '#/gst', selector: 'table' },
    { name: 'Business Analytics & Reports (SCR-J1)', path: '#/reports', selector: 'h1' },
    { name: 'Settings & Hardware Config (SCR-B2)', path: '#/settings', selector: 'h1' }
  ];

  console.log(`Starting Full End-to-End Audit across ${routes.length} screens...`);

  for (const r of routes) {
    const url = `http://easybill.localhost:8007/frontend/easybill${r.path}`;
    process.stdout.write(`Testing ${r.name.padEnd(42)} ... `);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector(r.selector, { timeout: 5000 });
    console.log('✓ PASS');
  }

  // Take full verification screenshots for Login and Setup
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/login', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/login_pin_screen.png' });

  await page.goto('http://easybill.localhost:8007/frontend/easybill#/setup', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/setup_wizard_screen.png' });

  await browser.close();
  console.log('\n======================================================');
  console.log('ALL 12 SCREENS TESTED AND PASSED VERIFICATION (100%)');
  console.log('======================================================');
}

run().catch(err => {
  console.error('Test suite failure:', err);
  process.exit(1);
});
