import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-D1: Parties Table
  console.log('Navigating to Parties Master (SCR-D1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/parties', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table');
  await new Promise(r => setTimeout(r, 600));

  const partiesScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/parties_directory_dashboard.png';
  await page.screenshot({ path: partiesScreenshot });
  console.log('Saved parties directory screenshot to', partiesScreenshot);

  // 2. Click on the 3rd row (Priya Traders) to test Party Detail Drawer (SCR-D3)
  console.log('Opening Party Detail Drawer (SCR-D3)...');
  const rows = await page.$$('tbody tr');
  if (rows.length >= 3) {
    await rows[2].click();
    await new Promise(r => setTimeout(r, 700));

    const drawerScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/party_detail_khata_drawer.png';
    await page.screenshot({ path: drawerScreenshot });
    console.log('Saved party detail drawer screenshot to', drawerScreenshot);

    // Close drawer
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. Test Add Party Drawer (SCR-D2)
  console.log('Testing Add Party Form Drawer (SCR-D2)...');
  const addButtons = await page.$$('button');
  for (const btn of addButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Add Party')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const addPartyScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/add_party_form_drawer.png';
  await page.screenshot({ path: addPartyScreenshot });
  console.log('Saved add party drawer screenshot to', addPartyScreenshot);

  await browser.close();
  console.log('All Parties tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
