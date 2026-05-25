const fs = require('fs');

const pdfBuffer = fs.readFileSync('menu_lokalin2.pdf');
let startIdx = 0;
let imageCount = 0;

while (true) {
  startIdx = pdfBuffer.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]), startIdx);
  if (startIdx === -1) break;

  let endIdx = pdfBuffer.indexOf(Buffer.from([0xFF, 0xD9]), startIdx);
  if (endIdx === -1) break;
  endIdx += 2; // include the FFD9

  const imageBuffer = pdfBuffer.slice(startIdx, endIdx);
  
  // Basic validation: must be at least 10KB to avoid tiny thumbnails/icons
  if (imageBuffer.length > 10000) {
    imageCount++;
    fs.writeFileSync(`public/img/extracted_${imageCount}.jpg`, imageBuffer);
    console.log(`Extracted public/img/extracted_${imageCount}.jpg (${Math.round(imageBuffer.length / 1024)} KB)`);
  }
  
  startIdx = endIdx;
}

console.log(`Finished. Extracted ${imageCount} large JPEG images.`);
