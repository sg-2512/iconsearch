# IconSearch Chrome Extension

Search the live IconSearch catalog from Chrome, then copy, drag, or download icons.

## What it does

- Connects to a free IconSearch account through the secure browser device flow.
- Searches `https://iconsearch.info/api/extension/icon-search`.
- Copies a PNG graphic, raw SVG markup, or online SVG URLs.
- Drags icons into editors such as Google Docs as PNG image files, while keeping SVG markup available for apps that understand it.
- Pins favorite icons for quick reuse.
- Applies copy size and color preferences to generated PNG/SVG outputs.
- Shows license/source context on every result card.
- Downloads SVG files from the live online source.
- Uses no offline icon database.

## Local install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this `chrome-extension` folder.
5. After local code changes, click **Reload** on the extension card and clear old errors before retesting.

## Release

Run `npm run check:chrome-extension` before submitting and `npm run package:chrome` to create the store ZIP. See `PUBLISHING.md` for the full Chrome Web Store checklist.

## Production notes

The backend must allow the `chrome` product in the Supabase `products` table and any database checks used by the device-auth tables.
