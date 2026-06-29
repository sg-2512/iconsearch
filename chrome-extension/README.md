# IconSearch Chrome Extension

Search the live IconSearch catalog from Chrome and copy or download online SVG icons.

## What it does

- Connects to a free IconSearch account through the secure browser device flow.
- Searches `https://iconsearch.info/api/extension/icon-search`.
- Copies React Iconify snippets, raw SVG markup, or online SVG URLs.
- Downloads SVG files from the live online source.
- Uses no offline icon database.

## Local install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this `chrome-extension` folder.

## Production notes

The backend must allow the `chrome` product in the Supabase `products` table and any database checks used by the device-auth tables.
