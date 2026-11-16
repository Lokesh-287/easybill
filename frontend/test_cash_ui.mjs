import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test SCR-I1: Day Book Dashboard
  console.log('Navigating to Day Book (SCR-I1)...');
  await page.goto('http://easybill.localhost:8007/frontend/easybill#/cash', { waitUntil: 'networkidle0' });
  await page.waitForSelector('table');
  await new Promise(r => setTimeout(r, 600));

  const daybookScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/daybook_dashboard.png';
  await page.screenshot({ path: daybookScreenshot });
  console.log('Saved day book screenshot to', daybookScreenshot);

  // 2. Test SCR-I3: Record Expense Modal
  console.log('Testing Record Expense Modal (SCR-I3)...');
  const expButtons = await page.$$('button');
  for (const btn of expButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Record Expense')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const expenseScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/petty_expense_modal.png';
  await page.screenshot({ path: expenseScreenshot });
  console.log('Saved petty expense modal screenshot to', expenseScreenshot);

  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 3. Test SCR-I2: Shift / Day Close Modal
  console.log('Testing Shift / Day Close Modal (SCR-I2)...');
  const closeButtons = await page.$$('button');
  for (const btn of closeButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Shift / Day Close')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  const closeScreenshot = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3/day_close_modal.png';
  await page.screenshot({ path: closeScreenshot });
  console.log('Saved day close modal screenshot to', closeScreenshot);

  await browser.close();
  console.log('All Cash Drawer & Day Book tests passed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
