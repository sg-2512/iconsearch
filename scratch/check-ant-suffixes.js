const fs = require('fs');
const zlib = require('zlib');

const canonicalPathGz = 'c:/Users/Sanchit Gupta/OneDrive/Desktop/icon-hub/data/canonical-icon-search.json.gz';
const compressed = fs.readFileSync(canonicalPathGz);
const list = JSON.parse(zlib.gunzipSync(compressed).toString('utf-8'));

const antDesignIcons = list.filter(icon => icon.library === 'iconify-ant-design');
const suffixes = new Set();
antDesignIcons.forEach(icon => {
  const parts = icon.name.split('-');
  if (parts.length > 1) {
    suffixes.add(parts[parts.length - 1]);
  }
});
console.log('Ant Design icon name suffixes in DB:', Array.from(suffixes));
