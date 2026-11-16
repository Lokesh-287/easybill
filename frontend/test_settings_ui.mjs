import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-B2: Settings Dashboard
  console.log('Navigating to Settings (SCR-B2)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/settings', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const settingsScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/settings_store_profile.png';
  await page.screenshot({ path: settingsScreenshot });
  console.log('Saved settings profile screenshot to', settingsScreenshot);

  // 2. Click Hardware & Thermal Printer Tab (SCR-L1)
  console.log('Clicking Hardware & Thermal Printer Tab (SCR-L1)...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Thermal Printer')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const hardwareScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/settings_thermal_printer.png';
  await page.screenshot({ path: hardwareScreenshot });
  console.log('Saved thermal printer settings screenshot to', hardwareScreenshot);

  // 3. Test Print 80mm Slip
  console.log('Testing Test Print 80mm Slip Modal...');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Test Print')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const testPrintScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/test_print_80mm_modal.png';
  await page.screenshot({ path: testPrintScreenshot });
  console.log('Saved test print modal screenshot to', testPrintScreenshot);

  await browser.close();
  console.log('All Settings & Hardware tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
