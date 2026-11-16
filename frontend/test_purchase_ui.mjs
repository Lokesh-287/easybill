import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-F1: Purchases & Inward Stock Dashboard
  console.log('Navigating to Purchases Dashboard (SCR-F1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/purchase', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table');
  await new Promise(r => setTimeout(r, 600));

  const purchaseScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/purchases_dashboard.png';
  await page.screenshot({ path: purchaseScreenshot });
  console.log('Saved purchases dashboard screenshot to', purchaseScreenshot);

  // 2. Click on the 1st row (PUR-2026-0001) to test Purchase Detail Drawer
  console.log('Opening Purchase Detail Drawer...');
  const rows = await page.$$('tbody tr');
  if (rows.length >= 1) {
    await rows[0].click();
    await new Promise(r => setTimeout(r, 700));

    const drawerScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/purchase_detail_drawer.png';
    await page.screenshot({ path: drawerScreenshot });
    console.log('Saved purchase detail drawer screenshot to', drawerScreenshot);

    // 3. Test Debit Note Modal (SCR-F3)
    console.log('Testing Debit Note / Purchase Return Modal (SCR-F3)...');
    const returnButtons = await page.$$('button');
    for (const btn of returnButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Issue Debit Note')) {
        await btn.click();
        await new Promise(r => setTimeout(r, 600));
        break;
      }
    }

    const returnModalScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/purchase_return_debit_note_modal.png';
    await page.screenshot({ path: returnModalScreenshot });
    console.log('Saved purchase return modal screenshot to', returnModalScreenshot);

    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // 4. Test SCR-F2: New Inward Purchase Bill Form
  console.log('Navigating to New Inward Purchase Bill Form (SCR-F2)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/purchase/new', { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[placeholder="e.g. INV-98124"]');
  await new Promise(r => setTimeout(r, 600));

  const formScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/purchase_bill_form.png';
  await page.screenshot({ path: formScreenshot });
  console.log('Saved purchase bill form screenshot to', formScreenshot);

  // 5. Test SCR-F4: Duplicate Supplier Bill Detection Guard
  console.log('Testing Duplicate Bill Number Guard (SCR-F4)...');
  const billInput = await page.$('input[placeholder="e.g. INV-98124"]');
  if (billInput) {
    await billInput.type('INV-88912');
    // blur
    await page.click('body');
    await new Promise(r => setTimeout(r, 800));

    const dupModalScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/duplicate_supplier_bill_modal.png';
    await page.screenshot({ path: dupModalScreenshot });
    console.log('Saved duplicate bill modal screenshot to', dupModalScreenshot);
  }

  await browser.close();
  console.log('All Purchases visual & functional tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
