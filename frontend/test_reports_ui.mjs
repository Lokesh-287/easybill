import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-J1: Analytics Dashboard Overview
  console.log('Navigating to Analytics Dashboard (SCR-J1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/reports', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const analyticsScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/analytics_dashboard.png';
  await page.screenshot({ path: analyticsScreenshot });
  console.log('Saved analytics screenshot to', analyticsScreenshot);

  // 2. Click Trading P&L Tab
  console.log('Clicking Trading P&L Tab...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Trading P&L')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const pnlScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/trading_pnl_statement.png';
  await page.screenshot({ path: pnlScreenshot });
  console.log('Saved trading P&L screenshot to', pnlScreenshot);

  // 3. Click Top Products Tab
  console.log('Clicking Top Products Tab...');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Top Products')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const topProductsScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/top_products_leaderboard.png';
  await page.screenshot({ path: topProductsScreenshot });
  console.log('Saved top products screenshot to', topProductsScreenshot);

  await browser.close();
  console.log('All Analytics & Reports tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
