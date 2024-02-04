const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readlineSync = require('readline-sync');

(async () => {
  puppeteer.use(StealthPlugin());
  const targetUrl = readlineSync.question('Put your Tweet target link: ');
  const downloadFolder = 'downloads';

  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder, { recursive: true });
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
    });

    const content = await page.content();
    const $ = cheerio.load(content);

    $('img[alt="Image"]').each((index, element) => {
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
            );
          });
          writer.on('error', (err) => {
            console.error(`Error saving image ${index + 1}: ${err.message}`);
          });
        })
        .catch((error) => {
          console.error(
            `Error downloading image ${index + 1}: ${error.message}`
          );
        });
    });

    await browser.close();
  } catch (error) {
    console.log('Error:', error.message);
  }
})();
