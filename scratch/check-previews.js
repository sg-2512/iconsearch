const fs = require('fs');
const zlib = require('zlib');

const canonicalPathGz = 'c:/Users/Sanchit Gupta/OneDrive/Desktop/icon-hub/data/canonical-icon-search.json.gz';
if (!fs.existsSync(canonicalPathGz)) {
  console.log('Database not found');
  process.exit(1);
}

const compressed = fs.readFileSync(canonicalPathGz);
const list = JSON.parse(zlib.gunzipSync(compressed).toString('utf-8'));

console.log('Total icons in database:', list.length);

const missingSvgUrl = list.filter(icon => !icon.svgUrl);
console.log('Icons missing svgUrl:', missingSvgUrl.length);

const sampleByLibrary = {};
list.forEach(icon => {
  if (!sampleByLibrary[icon.library]) {
    sampleByLibrary[icon.library] = [];
  }
  if (sampleByLibrary[icon.library].length < 3) {
    sampleByLibrary[icon.library].push({
      name: icon.name,
      svgUrl: icon.svgUrl,
      library: icon.library
    });
  }
});

console.log('Sample icons by library:');
console.log(JSON.stringify(sampleByLibrary, null, 2).slice(0, 1000));
