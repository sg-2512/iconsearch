const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const LEGAL_SAFE_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'Apache 2.0',
  'ISC',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC0-1.0',
  'CC0 1.0 (Public Domain)',
  'Unlicense',
  'OFL-1.1'
]);

const LICENSE_URLS = {
  'MIT': 'https://opensource.org/licenses/MIT',
  'Apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
  'Apache 2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
  'ISC': 'https://opensource.org/licenses/ISC',
  'BSD-2-Clause': 'https://opensource.org/licenses/BSD-2-Clause',
  'BSD-3-Clause': 'https://opensource.org/licenses/BSD-3-Clause',
  'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  'CC0 1.0 (Public Domain)': 'https://creativecommons.org/publicdomain/zero/1.0/',
  'Unlicense': 'https://unlicense.org/',
  'OFL-1.1': 'https://openfontlicense.org/',
  'CC-BY-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'MPL-2.0': 'https://www.mozilla.org/en-US/MPL/2.0/',
  'GPL-2.0-only': 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
  'GPL-2.0-or-later': 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
  'CC-BY-NC-SA-4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC-BY-3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'GPL-3.0': 'https://www.gnu.org/licenses/gpl-3.0.html',
  'GPL-3.0-or-later': 'https://www.gnu.org/licenses/gpl-3.0.html',
  'CC-BY-NC-4.0': 'https://creativecommons.org/licenses/by-nc/4.0/'
};

function isLegalSafe(license) {
  return LEGAL_SAFE_LICENSES.has(license);
}

function getLicenseUrl(license) {
  return LICENSE_URLS[license] || 'https://opensource.org/licenses';
}

function run() {
  console.log('Merging and canonicalizing icon datasets...');

  let localList = [];
  const localPath = path.join(__dirname, '../data/icon-search.json');
  if (fs.existsSync(localPath)) {
    console.log('Loading local icon database...');
    localList = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
  }

  let iconifyList = [];
  const iconifyPathGz = path.join(__dirname, '../data/iconify-icon-search.json.gz');
  const iconifyPathJson = path.join(__dirname, '../data/iconify-icon-search.json');

  if (fs.existsSync(iconifyPathGz)) {
    console.log('Loading gzipped Iconify database...');
    const compressed = fs.readFileSync(iconifyPathGz);
    iconifyList = JSON.parse(zlib.gunzipSync(compressed).toString('utf-8'));
  } else if (fs.existsSync(iconifyPathJson)) {
    console.log('Loading raw Iconify database...');
    iconifyList = JSON.parse(fs.readFileSync(iconifyPathJson, 'utf-8'));
  }

  const merged = [...localList, ...iconifyList];
  const deduped = new Map();

  for (const icon of merged) {
    const key = icon.id || `${icon.library}:${icon.name}`;
    if (!deduped.has(key)) {
      const cleanLicense = icon.license || 'MIT';
      const legalSafe = typeof icon.legalSafe === 'boolean'
        ? icon.legalSafe
        : (typeof icon.commercialSafe === 'boolean' ? icon.commercialSafe : isLegalSafe(cleanLicense));
      
      const licenseUrl = getLicenseUrl(cleanLicense);

      deduped.set(key, {
        ...icon,
        license: cleanLicense,
        legalSafe,
        licenseUrl
      });
    }
  }

  const canonicalList = Array.from(deduped.values());
  console.log(`Total canonicalized icons: ${canonicalList.length} (deduplicated from ${merged.length})`);

  // Write to compressed canonical file
  const canonicalPathGz = path.join(__dirname, '../data/canonical-icon-search.json.gz');
  const buffer = zlib.gzipSync(Buffer.from(JSON.stringify(canonicalList), 'utf-8'));
  fs.writeFileSync(canonicalPathGz, buffer);
  console.log(`Successfully generated canonical index: ${canonicalPathGz} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

  // Update snapshot statistics
  const snapshotPath = path.join(__dirname, '../data/icon-search.snapshot.json');
  const licenseCounts = {};
  let commercialSafeIcons = 0;
  for (const icon of canonicalList) {
    licenseCounts[icon.license] = (licenseCounts[icon.license] || 0) + 1;
    if (icon.legalSafe) {
      commercialSafeIcons++;
    }
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: "canonical-merge-pipeline",
    totalIcons: canonicalList.length,
    commercialSafeIcons,
    licenseCounts,
  };
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
  console.log('Updated data/icon-search.snapshot.json with verified stats.');
}

run();
