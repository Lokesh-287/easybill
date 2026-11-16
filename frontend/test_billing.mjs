import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to EasyBill POS...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill', { waitUntil: 'networkidle0' });

  // Wait for item cards to appear
  await page.waitForSelector('.pos-item-card');
  console.log('Page loaded successfully.');

  // Click on the first item (Paracetamol) and second item (Amoxicillin)
  const items = await page.$$('.pos-item-card');
  console.log(`Found ${items.length} items in catalog`);

  if (items.length >= 2) {
    console.log('Clicking item 1 (Paracetamol)...');
    await items[0].click();
    await new Promise(r => setTimeout(r, 400));
    console.log('Clicking item 1 again to test qty increment...');
    await items[0].click();
    await new Promise(r => setTimeout(r, 400));
    console.log('Clicking item 2 (Amoxicillin)...');
    await items[1].click();
    await new Promise(r => setTimeout(r, 400));
    console.log('Clicking item 4 (N95 Mask)...');
    await items[3].click();
    await new Promise(r => setTimeout(r, 500));
  }

  // Take screenshot with populated cart
  const cartScreenshotPath = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/billing_cart_active.png';
  await page.screenshot({ path: cartScreenshotPath });
  console.log('Saved cart screenshot to', cartScreenshotPath);

  // Press Save & Print
  console.log('Clicking Save & Print button...');
  const saveBtn = await page.$('[data-testid="btn-save-print"]');
  if (saveBtn) {
    await saveBtn.click();
    await new Promise(r => setTimeout(r, 700));
  } else {
    console.log('Pressing F8...');
    await page.keyboard.press('F8');
    await new Promise(r => setTimeout(r, 700));
  }

  // Take screenshot of Receipt modal
  const receiptScreenshotPath = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/billing_receipt_modal.png';
  await page.screenshot({ path: receiptScreenshotPath });
  console.log('Saved receipt modal screenshot to', receiptScreenshotPath);

  await browser.close();
  console.log('All tests completed successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
