import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-E2: Sales Invoices Dashboard
  console.log('Navigating to Invoices Dashboard (SCR-E2)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/sales', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table');
  await new Promise(r => setTimeout(r, 600));

  const salesScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/sales_invoices_dashboard.png';
  await page.screenshot({ path: salesScreenshot });
  console.log('Saved sales invoices dashboard screenshot to', salesScreenshot);

  // 2. Click on the 3rd invoice row (Priya Traders) to test slide-over drawer
  console.log('Clicking an invoice row to test slide-over drawer...');
  const rows = await page.$$('tbody tr');
  if (rows.length >= 3) {
    await rows[2].click();
    await new Promise(r => setTimeout(r, 600));

    const drawerScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/invoice_detail_drawer.png';
    await page.screenshot({ path: drawerScreenshot });
    console.log('Saved invoice drawer screenshot to', drawerScreenshot);
  }

  // 3. Test SCR-E1: Redesigned Billing POS Terminal
  console.log('Navigating to Redesigned Billing POS Terminal (SCR-E1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pos-item-card');
  await new Promise(r => setTimeout(r, 600));

  const billingScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/billing_behance_redesign.png';
  await page.screenshot({ path: billingScreenshot });
  console.log('Saved redesigned billing screenshot to', billingScreenshot);

  await browser.close();
  console.log('All visual tests passed!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
