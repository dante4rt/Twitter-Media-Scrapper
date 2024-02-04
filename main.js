require('colors');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readlineSync = require('readline-sync');

(async () => {
  puppeteer.use(StealthPlugin());
  console.log('Starting the script...'.green);
  const targetUrl = readlineSync.question('Put your Tweet target link: '.blue);

  if (!targetUrl) {
    console.log('No URL provided. Exiting...'.red);
    return;
  }

  const isValidHttpUrl = (string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  };

  if (!isValidHttpUrl(targetUrl)) {
    console.log('Invalid URL. Please enter a valid URL.'.red);
    return;
  }

  const downloadFolder = 'downloads';

  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder, { recursive: true });
    console.log(`Created download folder at ${downloadFolder}`.yellow);
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
    });

    const content = await page.content();
    const $ = cheerio.load(content);
    const images = $('img[alt="Image"]');

    if (images.length === 0) {
      console.log('No images found with alt="Image". Exiting...'.red);
      await browser.close();
      return;
    }

    console.log(`Found ${images.length} image(s) to download...`.green);

    images.each((index, element) => {
      const imgUrl = $(element).attr('src');

      axios({
        url: imgUrl,
        responseType: 'stream',
      })
        .then((response) => {
          const fileName = `image-${new Date().getTime()}-${index}.jpg`;
          const filePath = path.join(downloadFolder, fileName);
          const writer = fs.createWriteStream(filePath);

          response.data.pipe(writer);

          writer.on('finish', () => {
            console.log(
              `Image ${index + 1} has been downloaded and saved as ${filePath}!`
                .green
            );
          });
          writer.on('error', (err) => {
            console.error(
              `Error saving image ${index + 1}: ${err.message}`.red
            );
          });
        })
        .catch((error) => {
          console.error(
            `Error downloading image ${index + 1}: ${error.message}`.red
          );
        });
    });

    await browser.close();
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
})();
