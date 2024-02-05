const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { downloadFolder } = require('./config');

const downloadMedia = async (page, mediaType) => {
  const content = await page.content();
  const $ = cheerio.load(content);
  const mediaElements =
    mediaType === '1' ? $('img[alt="Image"]') : $('video[preload="auto"]');

  if (mediaElements.length === 0) {
    console.log('No images/videos found. Exiting...'.red);
    return;
  }

  console.log(
    `Found ${mediaElements.length} ${
      mediaType === '1' ? 'image(s)' : 'video(s)'
    } to download...`.green
  );

  mediaElements.each((index, element) => {
    const mediaUrl = $(element).attr('src');
    axios({
      url: mediaUrl,
      responseType: 'stream',
    })
      .then((response) => {
        const fileExtension = mediaType === '1' ? 'jpg' : 'mp4';
        const fileName = `${
          mediaType === '1' ? 'image' : 'video'
        }-${new Date().getTime()}-${index}.${fileExtension}`;
        const filePath = path.join(downloadFolder, fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
          console.log(
            `Downloaded ${mediaType === '1' ? 'image' : 'video'} ${
              index + 1
            } and saved as ${filePath}`.green
          );
        });
        writer.on('error', (err) => {
          console.error(
            `Error saving ${mediaType === '1' ? 'image' : 'video'} ${
              index + 1
            }: ${err.message}`.red
          );
        });
      })
      .catch((error) => {
        console.error(
          `Error downloading ${mediaType === '1' ? 'image' : 'video'} ${
            index + 1
          }: ${error.message}`.red
        );
      });
  });
};

module.exports = downloadMedia;
