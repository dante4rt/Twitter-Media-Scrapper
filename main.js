require('colors');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const readlineSync = require('readline-sync');
const { isValidHttpUrl, downloadFolder } = require('./config');
const downloadMedia = require('./downloadMedia');

const fs = require('fs');

puppeteer.use(StealthPlugin());

if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder, { recursive: true });
  console.log(`Created download folder at ${downloadFolder}`.yellow);
}

(async () => {
  console.log('Starting the script...'.green);
  const mediaType = readlineSync.question(
    'Choose the type of media to download:\n1. Image\n2. GIF (as MP4)\nEnter choice (1 or 2): '
      .blue
  );

  if (!['1', '2'].includes(mediaType)) {
    console.log('Invalid choice. Exiting...'.red);
    return;
  }

  const targetUrl = readlineSync.question('Put your Tweet target link: '.blue);

  if (!targetUrl || !isValidHttpUrl(targetUrl)) {
    console.log('Invalid or no URL provided. Exiting...'.red);
    return;
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
    });

    await downloadMedia(page, mediaType);

    await browser.close();
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
})();
