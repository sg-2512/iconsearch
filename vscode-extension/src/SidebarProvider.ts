import * as vscode from 'vscode';

type ApiIcon = {
  id: string;
  name: string;
  displayName?: string;
  library: string;
  libraryName?: string;
  npmPackage?: string;
  license?: string;
  reactImport?: string;
  reactUsage?: string;
  svgUrl?: string;
  legalSafe?: boolean;
  licenseUrl?: string;
};

type WebviewIcon = ApiIcon & {
  displayName: string;
  libraryName: string;
  svgUrl: string;
  previewUrls: string[];
};

type ApiResponse = {
  icons?: unknown;
  total?: unknown;
};

type IconActionFormat = 'react' | 'svg' | 'vue' | 'svelte' | 'tailwind';

type ReactImportInfo =
  | {
      kind: 'named';
      moduleSpecifier: string;
      importedName: string;
      importText: string;
    }
  | {
      kind: 'sideEffect';
      moduleSpecifier: string;
      importText: string;
    };

type SearchRequest = {
  query: string;
  library: string;
  style: string;
  legalOnly: boolean;
};

type FreeAccess = {
  email: string;
  unlockedAt: string;
};

const DEFAULT_API_URL = 'https://iconsearch.info/api/icon-search';
const ACCESS_KEY = 'iconsearch.freeAccess';
const RECENT_KEY = 'iconsearch.recentIcons';
const MAX_RECENT_ICONS = 12;

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data: unknown) => {
      if (!isRecord(data)) return;

      switch (data.type) {
        case 'ready':
          this.postAccessState();
          break;
        case 'unlockAccess':
          await this.unlockAccess(data.value);
          break;
        case 'signOut':
          await this.signOut();
          break;
        case 'search':
          await this.handleSearch(parseSearchRequest(data.value));
          break;
        case 'insertIcon':
          await this.handleIconAction(data.value, 'insert');
          break;
        case 'copyIcon':
          await this.handleIconAction(data.value, 'copy');
          break;
        case 'openIcon':
          await this.openIcon(data.value);
          break;
        case 'onInfo':
          vscode.window.showInformationMessage(stringFrom(data.value));
          break;
        case 'onError':
          vscode.window.showErrorMessage(stringFrom(data.value));
          break;
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private postAccessState() {
    const access = this.context.globalState.get<FreeAccess>(ACCESS_KEY);
    const config = vscode.workspace.getConfiguration('iconSearch');
    const defaultFormat = config.get<string>('defaultFormat') || 'react';
    this.post({
      type: 'accessState',
      unlocked: Boolean(access),
      email: access?.email || '',
      recentIcons: this.getRecentIcons(),
      defaultFormat,
    });
  }

  private async unlockAccess(value: unknown) {
    const email = isRecord(value) ? stringFrom(value.email).trim().toLowerCase() : '';
    if (!isValidEmail(email)) {
      this.post({ type: 'unlockError', value: 'Enter a valid email to unlock free access.' });
      return;
    }

    await this.context.globalState.update(ACCESS_KEY, {
      email,
      unlockedAt: new Date().toISOString(),
    } satisfies FreeAccess);

    this.postAccessState();
    vscode.window.showInformationMessage('IconSearch extension unlocked for free.');
  }

  private async signOut() {
    await this.context.globalState.update(ACCESS_KEY, undefined);
    this.postAccessState();
  }

  private async handleSearch(request: SearchRequest) {
    const access = this.context.globalState.get<FreeAccess>(ACCESS_KEY);
    if (!access) {
      this.post({ type: 'accessRequired' });
      return;
    }

    const query = request.query.trim();
    if (query.length < 2) {
      this.post({ type: 'searchResults', value: [], total: 0, query });
      return;
    }

    try {
      const config = vscode.workspace.getConfiguration('iconSearch');
      const configuredApiUrl = config.get<string>('apiUrl') || DEFAULT_API_URL;
      const url = new URL(configuredApiUrl);
      url.searchParams.set('q', query);
      url.searchParams.set('limit', '60');
      url.searchParams.set('sort', 'relevance');
      url.searchParams.set('legalOnly', request.legalOnly ? '1' : '0');

      if (request.library !== 'all') url.searchParams.set('lib', request.library);
      if (request.style !== 'all') url.searchParams.set('style', request.style);

      const response = await fetch(url.toString(), {
        headers: { accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`IconSearch API returned ${response.status}`);
      }

      const payload = (await response.json()) as ApiResponse;
      const icons = Array.isArray(payload.icons) ? payload.icons : [];
      const onlineIcons = icons
        .map((icon) => normalizeIcon(icon))
        .filter((icon): icon is WebviewIcon => Boolean(icon));

      this.post({
        type: 'searchResults',
        value: onlineIcons,
        total: typeof payload.total === 'number' ? payload.total : onlineIcons.length,
        query,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown API error';
      this.post({ type: 'searchError', value: message, query });
    }
  }

  private async handleIconAction(value: unknown, action: 'insert' | 'copy') {
    if (!isRecord(value)) return;

    const format = parseFormat(value.format);
    const icon = normalizeIcon(value.icon);
    if (!icon) {
      vscode.window.showErrorMessage('This result does not include an online SVG preview URL.');
      return;
    }

    try {
      if (action === 'copy') {
        const snippet = await this.createCopySnippet(icon, format);
        await vscode.env.clipboard.writeText(snippet);
        await this.rememberIcon(icon);
        vscode.window.showInformationMessage(format === 'svg' ? 'Copied live SVG markup.' : 'Copied icon snippet.');
        return;
      }

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        const snippet = await this.createCopySnippet(icon, format);
        await vscode.env.clipboard.writeText(snippet);
        await this.rememberIcon(icon);
        vscode.window.showInformationMessage('No active editor. Copied snippet instead.');
        return;
      }

      if (format === 'react') {
        await insertReactIcon(editor, icon, this.createReactUsage(icon));
      } else {
        const snippet = await this.createSnippet(icon, format);
        await editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, snippet);
        });
      }

      await this.rememberIcon(icon);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not complete icon action.';
      vscode.window.showErrorMessage(message);
    }
  }

  private async openIcon(value: unknown) {
    const icon = normalizeIcon(value);
    if (!icon) return;

    await vscode.env.openExternal(vscode.Uri.parse(icon.svgUrl));
  }

  private async rememberIcon(icon: WebviewIcon) {
    const current = this.getRecentIcons();
    const next = [icon, ...current.filter((item) => item.id !== icon.id)].slice(0, MAX_RECENT_ICONS);
    await this.context.globalState.update(RECENT_KEY, next);
    this.post({ type: 'recentIcons', value: next });
  }

  private getRecentIcons(): WebviewIcon[] {
    const saved = this.context.globalState.get<unknown>(RECENT_KEY);
    if (!Array.isArray(saved)) return [];

    return saved
      .map((icon) => normalizeIcon(icon))
      .filter((icon): icon is WebviewIcon => Boolean(icon))
      .slice(0, MAX_RECENT_ICONS);
  }

  private async createSnippet(icon: WebviewIcon, format: IconActionFormat): Promise<string> {
    if (format === 'svg') {
      const svg = await fetchSvgMarkup(icon);
      return applySvgClass(svg);
    }

    if (format === 'react') return this.createReactUsage(icon);

    const config = vscode.workspace.getConfiguration('iconSearch');
    const classes = config.get<string>('tailwindClasses') || 'w-5 h-5';
    return createUrlSnippet(icon, format, classes);
  }

  private async createCopySnippet(icon: WebviewIcon, format: IconActionFormat): Promise<string> {
    if (format !== 'react') return this.createSnippet(icon, format);

    const reactUsage = this.createReactUsage(icon);
    const importInfo = parseReactImport(icon.reactImport);
    return importInfo ? `${importInfo.importText}\n\n${reactUsage}` : reactUsage;
  }

  private createReactUsage(icon: WebviewIcon): string {
    const usage = icon.reactUsage || `<${icon.displayName || toPascalCase(icon.name)} />`;
    const config = vscode.workspace.getConfiguration('iconSearch');
    const classes = config.get<string>('tailwindClasses') || 'w-5 h-5';

    return applyJsxClassName(usage, classes);
  }

  private post(message: unknown) {
    this._view?.webview.postMessage(message);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const nonce = getNonce();
    const csp = [
      "default-src 'none'",
      "img-src https: http: data:",
      `style-src ${webview.cspSource} 'unsafe-inline'`,
      `script-src 'nonce-${nonce}'`,
    ].join('; ');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="${csp}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IconSearch</title>
        <style>
          :root { color-scheme: light dark; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            color: var(--vscode-foreground);
            background: var(--vscode-sideBar-background);
            font-family: var(--vscode-font-family);
          }
          button, input, select { font: inherit; }
          .hidden { display: none !important; }
          .shell { min-height: 100vh; padding: 12px; }
          .hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
          .eyebrow { margin-bottom: 3px; color: var(--vscode-descriptionForeground); font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
          .title { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; }
          .online-pill { border: 1px solid rgba(52, 211, 153, 0.5); border-radius: 999px; padding: 3px 7px; color: #34d399; background: rgba(52, 211, 153, 0.1); font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
          .unlock-card, .empty { margin-top: 14px; padding: 14px; border: 1px solid var(--vscode-widget-border, transparent); border-radius: 14px; background: color-mix(in srgb, var(--vscode-editor-background) 82%, transparent); }
          .unlock-title { margin-bottom: 6px; font-size: 15px; font-weight: 800; }
          .unlock-copy, .small-copy { color: var(--vscode-descriptionForeground); font-size: 12px; line-height: 1.5; }
          .unlock-row { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
          .input, .select {
            width: 100%;
            min-height: 34px;
            border: 1px solid var(--vscode-input-border, transparent);
            border-radius: 9px;
            outline: none;
            color: var(--vscode-input-foreground);
            background: var(--vscode-input-background);
            padding: 0 9px;
          }
          .input:focus, .select:focus { border-color: var(--vscode-focusBorder); box-shadow: 0 0 0 1px var(--vscode-focusBorder); }
          .primary-btn, .secondary-btn, .mode-btn, .action-btn {
            border: 1px solid var(--vscode-button-border, transparent);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
          }
          .primary-btn { min-height: 34px; color: var(--vscode-button-foreground); background: var(--vscode-button-background); }
          .secondary-btn { min-height: 28px; color: var(--vscode-button-secondaryForeground); background: var(--vscode-button-secondaryBackground); }
          .unlock-error { min-height: 16px; color: var(--vscode-errorForeground); font-size: 11px; }
          .search-panel {
            position: sticky;
            top: 0;
            z-index: 2;
            margin: 0 -12px 10px;
            padding: 0 12px 10px;
            background: var(--vscode-sideBar-background);
            border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border, transparent);
          }
          .search-row { display: flex; align-items: center; gap: 8px; min-height: 38px; padding: 0 10px; border: 1px solid var(--vscode-input-border, transparent); border-radius: 10px; background: var(--vscode-input-background); }
          .search-row:focus-within { border-color: var(--vscode-focusBorder); box-shadow: 0 0 0 1px var(--vscode-focusBorder); }
          .search-icon { color: var(--vscode-descriptionForeground); font-size: 13px; }
          .search-box { width: 100%; min-width: 0; border: none; outline: none; color: var(--vscode-input-foreground); background: transparent; }
          .meta-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; }
          .status { min-width: 0; color: var(--vscode-descriptionForeground); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .account-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; color: var(--vscode-descriptionForeground); font-size: 11px; }
          .filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px; }
          .legal-toggle { display: flex; align-items: center; gap: 6px; grid-column: 1 / -1; color: var(--vscode-descriptionForeground); font-size: 11px; }
          .mode-switch { display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px; margin-top: 8px; padding: 3px; border-radius: 999px; background: var(--vscode-editor-background); border: 1px solid var(--vscode-widget-border, transparent); }
          .mode-btn { border-radius: 999px; padding: 5px 0; color: var(--vscode-button-secondaryForeground); background: transparent; font-size: 10px; }
          .mode-btn.active { color: var(--vscode-button-foreground); background: var(--vscode-button-background); }
          .results { display: flex; flex-direction: column; gap: 8px; }
          .icon-card { display: grid; grid-template-columns: 42px minmax(0, 1fr); gap: 10px; width: 100%; padding: 9px; border: 1px solid var(--vscode-widget-border, transparent); border-radius: 12px; color: var(--vscode-foreground); background: color-mix(in srgb, var(--vscode-editor-background) 82%, transparent); cursor: grab; user-select: none; outline: none; }
          .icon-card:hover, .icon-card.selected, .icon-card:focus { border-color: var(--vscode-focusBorder); background: var(--vscode-list-hoverBackground); }
          .icon-card:active { cursor: grabbing; }
          .preview { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--vscode-widget-border, transparent); border-radius: 11px; background: var(--vscode-sideBar-background); overflow: hidden; }
          .preview img { width: 24px; height: 24px; object-fit: contain; opacity: 0.92; }
          body.vscode-dark .preview img, body.vscode-high-contrast .preview img { filter: invert(1) brightness(0.96); }
          .preview.failed { color: var(--vscode-descriptionForeground); font-size: 9px; line-height: 1.2; padding: 4px; text-align: center; }
          .card-main { min-width: 0; }
          .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
          .icon-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 800; }
          .icon-lib, .icon-package { color: var(--vscode-descriptionForeground); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .icon-package { margin-top: 2px; font-size: 10px; }
          .chip { flex: 0 0 auto; border: 1px solid var(--vscode-widget-border, transparent); border-radius: 999px; padding: 2px 6px; color: var(--vscode-descriptionForeground); font-size: 9px; font-weight: 700; text-transform: uppercase; }
          .chip.safe { color: #34d399; border-color: rgba(52, 211, 153, 0.45); background: rgba(52, 211, 153, 0.08); }
          .actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 8px; }
          .action-btn { padding: 5px 6px; color: var(--vscode-button-secondaryForeground); background: var(--vscode-button-secondaryBackground); font-size: 11px; }
          .action-btn.primary { color: var(--vscode-button-foreground); background: var(--vscode-button-background); }
          .empty { color: var(--vscode-descriptionForeground); text-align: center; font-size: 12px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <main class="shell">
          <header class="hero">
            <div>
              <div class="eyebrow">Live icon search</div>
              <div class="title">IconSearch</div>
            </div>
            <div class="online-pill">Free</div>
          </header>

          <section id="unlockPanel" class="unlock-card hidden">
            <div class="unlock-title">Unlock IconSearch for free</div>
            <div class="unlock-copy">Sign up or sign in with your email. Access is free while the extension is in preview.</div>
            <div class="unlock-row">
              <input id="emailInput" class="input" type="email" placeholder="you@example.com" autocomplete="email" />
              <button id="unlockBtn" class="primary-btn" type="button">Unlock free access</button>
              <div id="unlockError" class="unlock-error"></div>
            </div>
            <div class="small-copy">By continuing, you can use live online icon search, insert, copy, and preview features.</div>
          </section>

          <section id="appPanel" class="hidden">
            <div class="account-row">
              <span id="accountLabel">Unlocked</span>
              <button id="signOutBtn" class="secondary-btn" type="button">Sign out</button>
            </div>

            <section class="search-panel">
              <div class="search-row">
                <span class="search-icon">Search</span>
                <input type="text" id="searchInput" class="search-box" placeholder="home, arrow, chart..." autocomplete="off" />
              </div>
              <div class="filter-grid">
                <select id="libraryFilter" class="select" aria-label="Library filter">
                  <option value="all">All libraries</option>
                  <option value="lucide-icons">Lucide</option>
                  <option value="heroicons">Heroicons</option>
                  <option value="tabler-icons">Tabler</option>
                  <option value="phosphor-icons">Phosphor</option>
                  <option value="bootstrap-icons">Bootstrap</option>
                  <option value="remix-icon">Remix</option>
                  <option value="feather-icons">Feather</option>
                  <option value="iconoir">Iconoir</option>
                  <option value="iconify">Iconify</option>
                </select>
                <select id="styleFilter" class="select" aria-label="Style filter">
                  <option value="all">All styles</option>
                  <option value="stroke">Outline</option>
                  <option value="solid">Solid</option>
                  <option value="duotone">Duotone</option>
                  <option value="twotone">Two tone</option>
                  <option value="sharp">Sharp</option>
                </select>
                <label class="legal-toggle">
                  <input id="legalOnly" type="checkbox" checked />
                  Legal-safe only
                </label>
              </div>
              <div class="mode-switch" aria-label="Insert format">
                <button class="mode-btn active" data-format="react" type="button">React</button>
                <button class="mode-btn" data-format="svg" type="button">SVG</button>
                <button class="mode-btn" data-format="vue" type="button">Vue</button>
                <button class="mode-btn" data-format="svelte" type="button">Svelte</button>
                <button class="mode-btn" data-format="tailwind" type="button">TW</button>
              </div>
              <div class="meta-row">
                <div id="status" class="status">Type 2+ characters to search the live API.</div>
              </div>
            </section>

            <div class="results" id="iconsGrid"></div>
            <div class="empty" id="emptyState">No offline icons are bundled. Results appear only from the live IconSearch API.</div>
          </section>
        </main>

        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
          const unlockPanel = document.getElementById('unlockPanel');
          const appPanel = document.getElementById('appPanel');
          const emailInput = document.getElementById('emailInput');
          const unlockBtn = document.getElementById('unlockBtn');
          const unlockError = document.getElementById('unlockError');
          const signOutBtn = document.getElementById('signOutBtn');
          const accountLabel = document.getElementById('accountLabel');
          const searchInput = document.getElementById('searchInput');
          const libraryFilter = document.getElementById('libraryFilter');
          const styleFilter = document.getElementById('styleFilter');
          const legalOnly = document.getElementById('legalOnly');
          const iconsGrid = document.getElementById('iconsGrid');
          const statusEl = document.getElementById('status');
          const emptyState = document.getElementById('emptyState');

          let currentFormat = 'react';
          let debounceTimer;
          let currentIcons = [];
          let recentIcons = [];
          let selectedIndex = -1;

          function escapeHtml(value) {
            return String(value ?? '')
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
          }

          function escapeAttr(value) {
            return escapeHtml(value).replace(/\\n/g, ' ');
          }

          function currentSearchRequest() {
            return {
              query: searchInput.value.trim(),
              library: libraryFilter.value,
              style: styleFilter.value,
              legalOnly: legalOnly.checked,
            };
          }

          function searchNow() {
            const request = currentSearchRequest();
            if (request.query.length < 2) {
              renderRecentOrEmpty();
              return;
            }

            statusEl.textContent = 'Searching live IconSearch API...';
            vscode.postMessage({ type: 'search', value: request });
          }

          function scheduleSearch() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(searchNow, 250);
          }

          function setAccess(unlocked, email) {
            unlockPanel.classList.toggle('hidden', unlocked);
            appPanel.classList.toggle('hidden', !unlocked);
            accountLabel.textContent = email ? 'Signed in: ' + email : 'Unlocked free access';
            if (unlocked) renderRecentOrEmpty();
          }

          function setFormat(format) {
            currentFormat = format;
            document.querySelectorAll('[data-format]').forEach((button) => {
              button.classList.toggle('active', button.dataset.format === format);
            });
          }

          function dragSnippet(icon) {
            if (currentFormat === 'svg' || currentFormat === 'vue' || currentFormat === 'svelte') {
              return '<img src="' + escapeAttr(icon.svgUrl) + '" alt="' + escapeAttr(icon.name) + '" class="w-5 h-5" />';
            }
            if (currentFormat === 'tailwind') {
              return '<span class="inline-block w-5 h-5 bg-current" style="mask:url(' + escapeAttr(icon.svgUrl) + ') center / contain no-repeat; -webkit-mask:url(' + escapeAttr(icon.svgUrl) + ') center / contain no-repeat;"></span>';
            }
            return icon.reactUsage || ('<' + (icon.displayName || icon.name) + ' className="w-5 h-5" />');
          }

          function setPreviewImage(preview, img, urls, index) {
            if (!urls[index]) {
              preview.classList.add('failed');
              preview.textContent = 'No online preview';
              return;
            }
            img.src = urls[index];
            img.dataset.index = String(index);
          }

          function setSelectedIndex(index) {
            const cards = Array.from(document.querySelectorAll('.icon-card'));
            if (!cards.length) {
              selectedIndex = -1;
              return;
            }
            selectedIndex = Math.max(0, Math.min(index, cards.length - 1));
            cards.forEach((card, cardIndex) => card.classList.toggle('selected', cardIndex === selectedIndex));
            cards[selectedIndex].focus();
          }

          function insertSelected() {
            if (selectedIndex < 0 || !currentIcons[selectedIndex]) return;
            vscode.postMessage({ type: 'insertIcon', value: { icon: currentIcons[selectedIndex], format: currentFormat } });
          }

          function renderRecentOrEmpty() {
            if (recentIcons.length) {
              renderIcons(recentIcons, recentIcons.length, '', 'Recent online picks');
              return;
            }
            iconsGrid.innerHTML = '';
            currentIcons = [];
            selectedIndex = -1;
            emptyState.style.display = 'block';
            emptyState.textContent = 'Search the live API or pick from recent icons after your first insert.';
            statusEl.textContent = 'Type 2+ characters to search the live API.';
          }

          function renderIcons(icons, total, query, label) {
            iconsGrid.innerHTML = '';
            currentIcons = icons;
            selectedIndex = -1;

            if (!icons.length) {
              emptyState.style.display = 'block';
              emptyState.textContent = query ? 'No live online results for "' + query + '".' : 'No recent icons yet.';
              statusEl.textContent = query ? 'No results from live API.' : 'Type 2+ characters to search the live API.';
              return;
            }

            emptyState.style.display = 'none';
            statusEl.textContent = label || (icons.length + ' shown' + (total ? ' from ' + total.toLocaleString() + ' online results' : ''));

            icons.forEach((icon, index) => {
              const card = document.createElement('article');
              card.className = 'icon-card';
              card.draggable = true;
              card.tabIndex = 0;

              const preview = document.createElement('div');
              preview.className = 'preview';
              const img = document.createElement('img');
              img.alt = icon.name;
              img.loading = 'lazy';
              img.decoding = 'async';
              const urls = Array.isArray(icon.previewUrls) ? icon.previewUrls : [icon.svgUrl].filter(Boolean);
              img.addEventListener('error', () => setPreviewImage(preview, img, urls, Number(img.dataset.index || '0') + 1));
              setPreviewImage(preview, img, urls, 0);
              preview.appendChild(img);

              const main = document.createElement('div');
              main.className = 'card-main';
              main.innerHTML =
                '<div class="card-top">' +
                  '<div style="min-width:0">' +
                    '<div class="icon-name" title="' + escapeAttr(icon.name) + '">' + escapeHtml(icon.name) + '</div>' +
                    '<div class="icon-lib">' + escapeHtml(icon.libraryName || icon.library) + '</div>' +
                    '<div class="icon-package">' + escapeHtml(icon.npmPackage || icon.library || 'online svg') + '</div>' +
                  '</div>' +
                  '<span class="chip ' + (icon.legalSafe ? 'safe' : '') + '">' + escapeHtml(icon.license || 'live') + '</span>' +
                '</div>' +
                '<div class="actions">' +
                  '<button class="action-btn primary insert-btn" type="button">Insert</button>' +
                  '<button class="action-btn copy-btn" type="button">Copy</button>' +
                  '<button class="action-btn open-btn" type="button">Open</button>' +
                '</div>';

              card.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', dragSnippet(icon)));
              card.addEventListener('focus', () => setSelectedIndex(index));
              card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  vscode.postMessage({ type: 'insertIcon', value: { icon, format: currentFormat } });
                }
              });
              main.querySelector('.insert-btn').addEventListener('click', () => vscode.postMessage({ type: 'insertIcon', value: { icon, format: currentFormat } }));
              main.querySelector('.copy-btn').addEventListener('click', () => vscode.postMessage({ type: 'copyIcon', value: { icon, format: currentFormat } }));
              main.querySelector('.open-btn').addEventListener('click', () => vscode.postMessage({ type: 'openIcon', value: icon }));

              card.appendChild(preview);
              card.appendChild(main);
              iconsGrid.appendChild(card);
            });
          }

          unlockBtn.addEventListener('click', () => {
            unlockError.textContent = '';
            vscode.postMessage({ type: 'unlockAccess', value: { email: emailInput.value } });
          });
          emailInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') unlockBtn.click();
          });
          signOutBtn.addEventListener('click', () => vscode.postMessage({ type: 'signOut' }));
          document.querySelectorAll('[data-format]').forEach((button) => button.addEventListener('click', () => setFormat(button.dataset.format)));
          searchInput.addEventListener('input', scheduleSearch);
          libraryFilter.addEventListener('change', searchNow);
          styleFilter.addEventListener('change', searchNow);
          legalOnly.addEventListener('change', searchNow);
          searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setSelectedIndex(selectedIndex < 0 ? 0 : selectedIndex + 1);
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setSelectedIndex(selectedIndex <= 0 ? currentIcons.length - 1 : selectedIndex - 1);
            }
            if (event.key === 'Enter' && selectedIndex >= 0) {
              event.preventDefault();
              insertSelected();
            }
          });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'accessState') {
              recentIcons = Array.isArray(message.recentIcons) ? message.recentIcons : [];
              setAccess(Boolean(message.unlocked), message.email || '');
              if (message.defaultFormat && message.defaultFormat !== 'ask') {
                setFormat(message.defaultFormat);
              }
            }
            if (message.type === 'unlockError') {
              unlockError.textContent = message.value || 'Could not unlock access.';
            }
            if (message.type === 'accessRequired') {
              setAccess(false, '');
            }
            if (message.type === 'recentIcons') {
              recentIcons = Array.isArray(message.value) ? message.value : [];
              if (!searchInput.value.trim()) renderRecentOrEmpty();
            }
            if (message.type === 'searchResults') {
              renderIcons(message.value || [], message.total || 0, message.query || '');
            }
            if (message.type === 'searchError') {
              iconsGrid.innerHTML = '';
              emptyState.style.display = 'block';
              emptyState.textContent = 'Live API error: ' + message.value;
              statusEl.textContent = 'Online search failed.';
            }
          });

          vscode.postMessage({ type: 'ready' });
        </script>
      </body>
      </html>
    `;
  }
}

function parseSearchRequest(value: unknown): SearchRequest {
  if (!isRecord(value)) {
    return { query: stringFrom(value), library: 'all', style: 'all', legalOnly: true };
  }

  return {
    query: stringFrom(value.query),
    library: stringFrom(value.library) || 'all',
    style: stringFrom(value.style) || 'all',
    legalOnly: value.legalOnly !== false,
  };
}

function parseFormat(value: unknown): IconActionFormat {
  if (value === 'svg' || value === 'vue' || value === 'svelte' || value === 'tailwind') return value;
  return 'react';
}

function normalizeIcon(value: unknown): WebviewIcon | undefined {
  if (!isRecord(value)) return undefined;

  const name = stringFrom(value.name);
  const library = stringFrom(value.library);
  const previewUrls = getPreviewUrls(value);

  if (!name || !library || previewUrls.length === 0) return undefined;

  return {
    id: stringFrom(value.id) || `${library}-${name}`,
    name,
    displayName: stringFrom(value.displayName) || toPascalCase(name),
    library,
    libraryName: stringFrom(value.libraryName) || library,
    npmPackage: stringFrom(value.npmPackage) || undefined,
    license: stringFrom(value.license) || undefined,
    reactImport: stringFrom(value.reactImport) || undefined,
    reactUsage: stringFrom(value.reactUsage) || undefined,
    svgUrl: previewUrls[0],
    legalSafe: value.legalSafe === true,
    licenseUrl: stringFrom(value.licenseUrl) || undefined,
    previewUrls,
  };
}

function getPreviewUrls(icon: Record<string, unknown>): string[] {
  const urls = new Set<string>();
  const name = stringFrom(icon.name);
  const library = stringFrom(icon.library);
  const exactName = name;
  const dashedName = name.replace(/_/g, '-');
  const underscoredName = name.replace(/-/g, '_');

  const add = (url: string) => {
    const cleaned = cleanSvgUrl(url, library);
    if (isHttpUrl(cleaned)) urls.add(cleaned);
  };

  add(stringFrom(icon.svgUrl));

  if (library === 'lucide-icons') {
    add(`https://unpkg.com/lucide-static@latest/icons/${exactName}.svg`);
    add(`https://api.iconify.design/lucide/${dashedName}.svg`);
  } else if (library === 'tabler-icons') {
    add(`https://cdn.jsdelivr.net/npm/@tabler/icons@2.47.0/icons/${dashedName}.svg`);
    add(`https://api.iconify.design/tabler/${dashedName}.svg`);
  } else if (library === 'phosphor-icons') {
    add(`https://unpkg.com/@phosphor-icons/core@latest/assets/regular/${dashedName}.svg`);
    add(`https://api.iconify.design/ph/${dashedName}.svg`);
  } else if (library === 'heroicons') {
    add(`https://api.iconify.design/heroicons/${dashedName}.svg`);
    add(`https://api.iconify.design/heroicons-outline/${dashedName}.svg`);
    add(`https://api.iconify.design/heroicons-solid/${dashedName}.svg`);
  } else if (library === 'bootstrap-icons') {
    add(`https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/icons/${dashedName}.svg`);
    add(`https://api.iconify.design/bi/${dashedName}.svg`);
  } else if (library === 'feather-icons') {
    add(`https://unpkg.com/feather-icons@latest/dist/icons/${dashedName}.svg`);
    add(`https://api.iconify.design/feather/${dashedName}.svg`);
  } else if (library === 'remix-icon') {
    add(`https://api.iconify.design/ri/${dashedName}.svg`);
  } else if (library === 'iconoir') {
    add(`https://api.iconify.design/iconoir/${dashedName}.svg`);
  } else if (library === 'ionicons') {
    add(`https://api.iconify.design/ion/${exactName}.svg`);
    add(`https://api.iconify.design/ion/${dashedName}.svg`);
    add(`https://api.iconify.design/ion/${underscoredName}.svg`);
  } else if (library === 'octicons') {
    add(`https://api.iconify.design/octicon/${exactName}.svg`);
    add(`https://api.iconify.design/octicon/${dashedName}.svg`);
    add(`https://api.iconify.design/octicon/${underscoredName}.svg`);
  } else if (library === 'ant-design-icons') {
    add(`https://api.iconify.design/ant-design/${dashedName}.svg`);
    add(`https://api.iconify.design/ant-design/${dashedName}-outlined.svg`);
    add(`https://api.iconify.design/ant-design/${dashedName}-filled.svg`);
  } else if (library.startsWith('iconify-')) {
    const prefix = library.replace(/^iconify-/, '');
    add(`https://api.iconify.design/${prefix}/${exactName}.svg`);
    add(`https://api.iconify.design/${prefix}/${dashedName}.svg`);
    add(`https://api.iconify.design/${prefix}/${underscoredName}.svg`);
  }

  return Array.from(urls);
}

function cleanSvgUrl(url: string, library: string): string {
  if (!url) return '';
  if (library === 'tabler-icons' && url.includes('@tabler/icons/icons/')) {
    return url.replace('@tabler/icons/icons/', '@tabler/icons@2.47.0/icons/');
  }
  if (library === 'phosphor-icons' && url.includes('@phosphor-icons/core/assets/')) {
    return url.replace('@phosphor-icons/core/assets/', '@phosphor-icons/core@2.1.1/assets/');
  }
  if (library === 'lucide-icons' && url.includes('lucide-static/icons/')) {
    return url.replace('lucide-static/icons/', 'lucide-static@0.415.0/icons/');
  }
  return url;
}

async function fetchSvgMarkup(icon: WebviewIcon): Promise<string> {
  let lastError = '';

  for (const url of icon.previewUrls) {
    try {
      const response = await fetch(url, {
        headers: { accept: 'image/svg+xml,text/plain,*/*' },
      });

      if (!response.ok) {
        lastError = `SVG request returned ${response.status}`;
        continue;
      }

      const text = await response.text();
      if (text.includes('<svg')) return text.trim();
      lastError = 'Response was not SVG markup';
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'SVG request failed';
    }
  }

  throw new Error(`Could not fetch live SVG for ${icon.name}. ${lastError}`);
}

function applySvgClass(svg: string): string {
  const config = vscode.workspace.getConfiguration('iconSearch');
  const classes = config.get<string>('tailwindClasses') || '';
  if (!classes.trim()) return svg;

  const escapedClasses = escapeAttribute(classes.trim());
  if (/\sclass=/.test(svg.slice(0, 300))) {
    return svg.replace(/\sclass=(["'])(.*?)\1/, ` class=$1$2 ${escapedClasses}$1`);
  }

  return svg.replace('<svg', `<svg class="${escapedClasses}"`);
}

function createUrlSnippet(icon: WebviewIcon, format: Exclude<IconActionFormat, 'react' | 'svg'>, classes: string): string {
  const safeClasses = escapeAttribute(classes.trim() || 'w-5 h-5');
  const safeName = escapeAttribute(icon.name);
  const safeUrl = escapeAttribute(icon.svgUrl);

  if (format === 'tailwind') {
    return `<span class="inline-block ${safeClasses} bg-current" style="mask: url('${safeUrl}') center / contain no-repeat; -webkit-mask: url('${safeUrl}') center / contain no-repeat;" role="img" aria-label="${safeName}"></span>`;
  }

  return `<img src="${safeUrl}" alt="${safeName}" class="${safeClasses}" />`;
}

async function insertReactIcon(editor: vscode.TextEditor, icon: WebviewIcon, reactUsage: string): Promise<void> {
  const document = editor.document;
  const text = document.getText();
  const importInfo = parseReactImport(icon.reactImport);
  const importEdit = importInfo ? getReactImportEdit(document, text, importInfo) : undefined;

  await editor.edit((editBuilder) => {
    if (importEdit) {
      if (importEdit.type === 'insert') {
        editBuilder.insert(importEdit.position, importEdit.text);
      } else {
        editBuilder.replace(importEdit.range, importEdit.text);
      }
    }

    editBuilder.replace(editor.selection, reactUsage);
  });
}

function parseReactImport(value: string | undefined): ReactImportInfo | undefined {
  if (!value) return undefined;

  const trimmed = value.trim().replace(/;$/, '');
  const sideEffectMatch = /^import\s+['"]([^'"]+)['"]$/.exec(trimmed);
  if (sideEffectMatch) {
    const moduleSpecifier = sideEffectMatch[1];
    return {
      kind: 'sideEffect',
      moduleSpecifier,
      importText: `import '${moduleSpecifier}';`,
    };
  }

  const namedMatch = /^import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]$/.exec(trimmed);
  if (!namedMatch) return undefined;

  const importedName = normalizeNamedImport(namedMatch[1].split(',')[0]);
  const moduleSpecifier = namedMatch[2];
  if (!importedName || !moduleSpecifier) return undefined;

  return {
    kind: 'named',
    moduleSpecifier,
    importedName,
    importText: `import { ${importedName} } from '${moduleSpecifier}';`,
  };
}

function getReactImportEdit(
  document: vscode.TextDocument,
  text: string,
  importInfo: ReactImportInfo
):
  | { type: 'insert'; position: vscode.Position; text: string }
  | { type: 'replace'; range: vscode.Range; text: string }
  | undefined {
  if (importInfo.kind === 'sideEffect') {
    if (hasImportFromModule(text, importInfo.moduleSpecifier)) return undefined;
    const offset = getImportInsertOffset(text);
    return {
      type: 'insert',
      position: document.positionAt(offset),
      text: withImportSpacing(text, importInfo.importText, offset),
    };
  }

  const existingNamedImport = findNamedImportFromModule(document, text, importInfo.moduleSpecifier);
  if (existingNamedImport) {
    const names = splitNamedImports(existingNamedImport.importsText);
    if (names.some((name) => normalizeNamedImport(name) === importInfo.importedName)) return undefined;

    return {
      type: 'replace',
      range: existingNamedImport.range,
      text: [...names, importInfo.importedName].join(', '),
    };
  }

  const offset = getImportInsertOffset(text);
  return {
    type: 'insert',
    position: document.positionAt(offset),
    text: withImportSpacing(text, importInfo.importText, offset),
  };
}

function findNamedImportFromModule(document: vscode.TextDocument, text: string, moduleSpecifier: string) {
  const importPattern = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"];?/g;
  let match: RegExpExecArray | null;

  while ((match = importPattern.exec(text))) {
    if (match[2] !== moduleSpecifier) continue;

    const importsStart = match.index + match[0].indexOf(match[1]);
    const importsEnd = importsStart + match[1].length;
    return {
      importsText: match[1],
      range: new vscode.Range(document.positionAt(importsStart), document.positionAt(importsEnd)),
    };
  }

  return undefined;
}

function hasImportFromModule(text: string, moduleSpecifier: string): boolean {
  return new RegExp(`import\\s+(?:[^;]*?\\s+from\\s+)?['"]${escapeRegExp(moduleSpecifier)}['"]`).test(text);
}

function getImportInsertOffset(text: string): number {
  const importPattern = /import\s+(?:[\s\S]*?\s+from\s+['"][^'"]+['"]|['"][^'"]+['"]);?/g;
  let lastImportEnd = 0;
  let match: RegExpExecArray | null;

  while ((match = importPattern.exec(text))) {
    lastImportEnd = match.index + match[0].length;
  }

  if (!lastImportEnd) return 0;

  const lineBreakMatch = /^\r?\n/.exec(text.slice(lastImportEnd));
  return lineBreakMatch ? lastImportEnd + lineBreakMatch[0].length : lastImportEnd;
}

function withImportSpacing(text: string, importText: string, offset: number): string {
  const before = text.slice(0, offset);
  const after = text.slice(offset);
  const prefix = offset > 0 && !before.endsWith('\n') ? '\n' : '';
  const suffix = after.startsWith('\n') || after.length === 0 ? '\n' : '\n\n';
  return `${prefix}${importText}${suffix}`;
}

function splitNamedImports(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeNamedImport(value: string): string {
  return value.trim().replace(/\s+as\s+.+$/, '');
}

function applyJsxClassName(jsx: string, classes: string): string {
  const cleanClasses = classes.trim();
  if (!cleanClasses) return jsx;

  const escapedClasses = escapeAttribute(cleanClasses);
  if (/\sclassName=/.test(jsx.slice(0, 300))) {
    return jsx.replace(/\sclassName=(["'])(.*?)\1/, ` className=$1$2 ${escapedClasses}$1`);
  }

  if (/\sclass=/.test(jsx.slice(0, 300))) {
    return jsx.replace(/\sclass=(["'])(.*?)\1/, ` className=$1$2 ${escapedClasses}$1`);
  }

  return jsx.replace(/^<([A-Za-z][\w:.]*)(\s|\/?>)/, `<$1 className="${escapedClasses}"$2`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function stringFrom(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function isHttpUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://');
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function toPascalCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
