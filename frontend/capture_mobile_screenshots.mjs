import puppeteer from 'puppeteer-core';
import path from 'path';

async function captureMobileScreenshots() {
  const artifactDir = '/home/lokesh/.gemini/antigravity-cli/brain/a44502d0-2a88-4513-acc0-900b52d0c1a3';
  console.log(`Starting Mobile Screenshot Capture to: ${artifactDir}`);

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  page.on('dialog', async dialog => await dialog.accept());
  // iPhone 14 / modern Android (390 x 844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  try {
    // 1. Mobile POS Billing Screen
    console.log('Capturing mobile_pos_billing_screen.png...');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/bill/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.pos-item-card', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'mobile_pos_billing_screen.png') });

    // 2. Mobile Camera Barcode Scanner Modal
    console.log('Capturing mobile_camera_scanner_modal.png...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Camera Barcode Scanner"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'mobile_camera_scanner_modal.png') });

    // Add item & close scanner
    const scannerInput = await page.$('input[placeholder*="Or type barcode"]');
    if (scannerInput) {
      await scannerInput.type('8901234001');
      await page.evaluate(() => {
        const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Add');
        if (addBtn) addBtn.click();
      });
      await new Promise(r => setTimeout(r, 400));
    }
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Close Scanner"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // 3. Mobile Cart Drawer / Bottom Sheet
    console.log('Capturing mobile_cart_drawer_sheet.png...');
    await page.evaluate(() => {
      const btn = document.querySelector('.sticky.bottom-1 button');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'mobile_cart_drawer_sheet.png') });

    // 4. Store Owner Mobile Live Dashboard
    console.log('Capturing mobile_owner_dashboard.png...');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/mobile/owner', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'mobile_owner_dashboard.png') });

    // 5. Mobile Slide-up Navigation Menu Sheet
    console.log('Capturing mobile_menu_sheet.png...');
    await page.goto('http://easybill.localhost:8007/frontend/easybill#/sales', { waitUntil: 'networkidle0' });
    await page.waitForSelector('nav', { timeout: 5000 });
    await page.evaluate(() => {
      const moreBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent && b.textContent.includes('More'));
      if (moreBtn) moreBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'mobile_menu_sheet.png') });

    console.log('Successfully captured all 5 mobile screenshots!');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    await browser.close();
  }
}

captureMobileScreenshots();
