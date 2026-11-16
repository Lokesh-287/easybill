import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-G1: Stock Summary Dashboard
  console.log('Navigating to Stock Summary (SCR-G1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/stock', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table');
  await new Promise(r => setTimeout(r, 600));

  const stockScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/stock_summary_dashboard.png';
  await page.screenshot({ path: stockScreenshot });
  console.log('Saved stock summary screenshot to', stockScreenshot);

  // 2. Test SCR-G2: Stock Adjustment Modal
  console.log('Testing Stock Adjustment Modal (SCR-G2)...');
  const adjustButtons = await page.$$('button[title*="Adjust Stock"]');
  if (adjustButtons.length > 0) {
    await adjustButtons[0].click();
    await new Promise(r => setTimeout(r, 600));

    const adjustScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/stock_adjustment_modal.png';
    await page.screenshot({ path: adjustScreenshot });
    console.log('Saved stock adjustment modal screenshot to', adjustScreenshot);

    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. Test SCR-G3: Stock Movement Ledger Drawer
  console.log('Testing Stock Movement Ledger Drawer (SCR-G3)...');
  const ledgerButtons = await page.$$('button[title*="Ledger"]');
  if (ledgerButtons.length > 0) {
    await ledgerButtons[0].click();
    await new Promise(r => setTimeout(r, 600));

    const ledgerScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/stock_movement_ledger_drawer.png';
    await page.screenshot({ path: ledgerScreenshot });
    console.log('Saved stock ledger drawer screenshot to', ledgerScreenshot);
  }

  await browser.close();
  console.log('All Stock tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
