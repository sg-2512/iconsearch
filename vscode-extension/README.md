# IconSearch Integration - VS Code Extension

Search the live IconSearch catalog from inside VS Code and insert production-ready icon snippets without bundling any offline icon database.

## Features

1. **Secure account connection:** Sign in on iconsearch.info through a short-lived browser approval link. VS Code stores only a revocable opaque token in SecretStorage.
2. **Online-only results:** Every preview and SVG comes from the live IconSearch API or online SVG/CDN sources. No offline icons are bundled.
3. **Library and style filters:** Filter by popular icon libraries, outline/solid/duotone/two-tone/sharp styles, and legal-safe results.
4. **Multiple insert formats:** Insert React, raw SVG, Vue, Svelte, or Tailwind mask snippets.
5. **Smart React insertion:** React mode inserts JSX at the cursor and adds the required import when it is missing. Existing named imports are reused.
6. **Recent online picks:** Inserted or copied icons are remembered locally so the sidebar has useful quick picks before the next search.
7. **Keyboard-friendly UI:** Use arrow keys to move through results and Enter to insert the selected icon.

## Settings

Open VS Code settings and search for `IconSearch Integration`.

- `iconSearch.defaultFormat`: Default insert format. Supported values are `ask`, `react`, `svg`, `vue`, `svelte`, and `tailwind`.
- `iconSearch.tailwindClasses`: Classes appended to generated snippets. Default: `w-5 h-5`.

Search and catalog requests use the authenticated production endpoint at `https://iconsearch.info/api/extension/icon-search`.

## Local Development

```bash
cd vscode-extension
npm install
npm run compile
```

Then press `F5` in VS Code and choose **Run Extension**. In the Extension Development Host, open the IconSearch activity bar view, connect an IconSearch account in the browser, and search for an icon like `home`.

## Package Locally

```bash
cd vscode-extension
npx @vscode/vsce package --out iconsearch-integration-1.0.0.vsix
```

Install the generated `.vsix` from VS Code:

1. Open the Extensions panel.
2. Click `...`.
3. Choose **Install from VSIX...**.
4. Pick `vscode-extension/iconsearch-integration-1.0.0.vsix`.

## Publish Later

Publishing to the VS Code Marketplace is free, but you need a Marketplace publisher and an Azure DevOps Personal Access Token.

```bash
npm install -g @vscode/vsce
vsce login <your-publisher-id>
vsce publish
```

## Push Code To GitHub

From the repository root:

```bash
git status
git add vscode-extension
git commit -m "Improve IconSearch VS Code extension"
git push origin main
```

Use `git add .` instead of `git add vscode-extension` only when you intentionally want to include every changed file in the whole repo.
