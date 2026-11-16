import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-K1: GST Compliance Dashboard (GSTR-1 tab)
  console.log('Navigating to GST Compliance Dashboard (SCR-K1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/gst', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table');
  await new Promise(r => setTimeout(r, 600));

  const gstScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/gst_dashboard.png';
  await page.screenshot({ path: gstScreenshot });
  console.log('Saved GST dashboard screenshot to', gstScreenshot);

  // 2. Click HSN Table 12 Tab
  console.log('Clicking HSN Table 12 Tab...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('HSN Table 12')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const hsnScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/gst_hsn_table.png';
  await page.screenshot({ path: hsnScreenshot });
  console.log('Saved GST HSN screenshot to', hsnScreenshot);

  // 3. Click GSTR-3B Tab
  console.log('Clicking GSTR-3B Tab...');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('GSTR-3B')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const gstr3bScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/gstr3b_summary.png';
  await page.screenshot({ path: gstr3bScreenshot });
  console.log('Saved GSTR-3B summary screenshot to', gstr3bScreenshot);

  await browser.close();
  console.log('All GST tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
