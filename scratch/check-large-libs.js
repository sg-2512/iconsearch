const fs = require('fs');
const zlib = require('zlib');

const canonicalPathGz = 'c:/Users/Sanchit Gupta/OneDrive/Desktop/icon-hub/data/canonical-icon-search.json.gz';
const compressed = fs.readFileSync(canonicalPathGz);
const list = JSON.parse(zlib.gunzipSync(compressed).toString('utf-8'));

const libs = {};
list.forEach(icon => {
  if (!libs[icon.library]) {
    libs[icon.library] = { count: 0, sampleUrls: [] };
  }
  libs[icon.library].count++;
  if (libs[icon.library].sampleUrls.length < 2) {
    libs[icon.library].sampleUrls.push(icon.svgUrl);
  }
});

for (const [lib, info] of Object.entries(libs)) {
  if (info.count > 1000) {
    console.log(`Library: ${lib} (${info.count} icons)`);
    console.log('  Samples:', info.sampleUrls);
  }
}
