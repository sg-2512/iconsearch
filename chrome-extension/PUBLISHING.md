# Publishing Checklist

## Release Package

Run from the repository root:

```powershell
npm run check:chrome-extension
npm run package:chrome
```

The ZIP is written to `dist/iconsearch-chrome-<version>.zip`. Upload that ZIP in the Chrome Web Store Developer Dashboard.

## Store Listing

- Name: IconSearch - Free SVG Icons
- Category: Developer Tools or Productivity
- Single purpose: Search IconSearch and copy, drag, pin, download, or open SVG icons.
- Privacy policy: https://iconsearch.info/privacy-policy
- Support URL: https://iconsearch.info/contact
- Extension page: https://iconsearch.info/chrome-extension

## Reviewer Notes

- The extension uses browser device sign-in and stores a revocable app token in `chrome.storage.local`.
- No passwords are collected by the extension.
- Online icon search calls `https://iconsearch.info/api/extension/icon-search`.
- Clipboard access is used only after the user copies or drags an icon.
- Downloads are used only when the user clicks the SVG download action.
- Include a test account or approval flow instructions in the private reviewer notes.

## Manual Smoke Test

- Load the unpacked `chrome-extension` folder.
- Confirm the extension card shows the current `manifest.json` version.
- Sign in with a test account.
- Search for `home`, copy a graphic, and paste into Google Docs.
- Drag a result into Google Docs.
- Change size and color, then copy again.
- Pin and unpin an icon.
- Open the About sheet links.
- Run keyboard navigation: `/`, arrow keys, `Enter`, `p`, `Escape`.
- Clear old extension errors before final submission.
