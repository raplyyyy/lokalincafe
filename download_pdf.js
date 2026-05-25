const https = require('https');
const fs = require('fs');

const fileId = '1nPQnoSNVqrk1a5Z0OEoCVlqTzZa1tf27';
const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
const dest = 'menu_lokalin2.pdf';

const download = (url, dest) => {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      download(res.headers.location, dest);
    } else {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download complete');
      });
    }
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error('Download error:', err.message);
  });
};

download(url, dest);
