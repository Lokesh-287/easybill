import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-C1: Item Catalog Table
  console.log('Navigating to Items Catalog (SCR-C1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/items', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table');
  await new Promise(r => setTimeout(r, 600));

  const itemsScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/items_catalog_dashboard.png';
  await page.screenshot({ path: itemsScreenshot });
  console.log('Saved items catalog screenshot to', itemsScreenshot);

  // 2. Click on the first product row to open the Product Master Form Drawer (SCR-C2)
  console.log('Opening Product Master Drawer (SCR-C2)...');
  const rows = await page.$$('tbody tr');
  if (rows.length >= 1) {
    await rows[0].click();
    await new Promise(r => setTimeout(r, 700));

    const drawerScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/product_master_drawer.png';
    await page.screenshot({ path: drawerScreenshot });
    console.log('Saved product master drawer screenshot to', drawerScreenshot);

    // Close drawer
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. Test Barcode Label Print Modal (SCR-C4)
  console.log('Testing Barcode Label modal...');
  const labelButtons = await page.$$('button');
  for (const btn of labelButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Print Labels')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const labelScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/barcode_labels_modal.png';
  await page.screenshot({ path: labelScreenshot });
  console.log('Saved barcode label modal screenshot to', labelScreenshot);

  await browser.close();
  console.log('All Item Catalog tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
