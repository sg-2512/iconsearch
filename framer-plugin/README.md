# IconSearch Framer Plugin

Search the live IconSearch catalog from inside Framer and insert online SVG icons into the canvas.

## Development

```bash
npm install
npm run dev
```

Open Framer, go to Plugins, choose development plugins, and load this plugin.

## Build

```bash
npm run build
npm run pack
```

The plugin uses the production IconSearch API at `https://iconsearch.info` and does not bundle an offline icon database.

## Publish

1. Run `npm run pack` from this folder.
2. Upload `plugin.zip` from this folder in the Framer Marketplace plugin dashboard:
   `https://www.framer.com/marketplace/dashboard/plugins/`
3. Use the local development plugin in Framer for a final smoke test before submitting the Marketplace listing.
