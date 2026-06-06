const fs = require('fs');
const zlib = require('zlib');

const canonicalPathGz = 'c:/Users/Sanchit Gupta/OneDrive/Desktop/icon-hub/data/canonical-icon-search.json.gz';
const compressed = fs.readFileSync(canonicalPathGz);
const list = JSON.parse(zlib.gunzipSync(compressed).toString('utf-8'));

const antDesignIcons = list.filter(icon => icon.library === 'iconify-ant-design');
console.log('Ant Design Icons Count:', antDesignIcons.length);
if (antDesignIcons.length > 0) {
  console.log('Sample Ant Design Icon in DB:', antDesignIcons[0]);
}

const fontawesome = list.filter(icon => icon.library === 'iconify-fa6-solid' || icon.library.includes('fa'));
console.log('FontAwesome Icons Count:', fontawesome.length);
if (fontawesome.length > 0) {
  console.log('Sample FontAwesome Icon in DB:', fontawesome[0]);
}
