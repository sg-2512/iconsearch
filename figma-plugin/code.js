const AUTH_API_URL = 'https://iconsearch.info/api';
const EXTENSION_API_URL = 'https://iconsearch.info/api/extension/icon-search';
const SESSION_TOKEN_KEY = 'iconsearch.sessionToken';
const ACCESS_CACHE_KEY = 'iconsearch.accessCache';

let authAttempt = 0;

figma.showUI(__html__, { width: 380, height: 540, themeColors: true });

function post(message) {
  figma.ui.postMessage(message);
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function normalizeAccess(value) {
  if (!value || value.product !== 'figma') return null;
  if (value.tier !== 'free' && value.tier !== 'founder') return null;
  if (!value.expiresAt) return null;
  return {
    email: typeof value.email === 'string' ? value.email : '',
    product: 'figma',
    tier: value.tier,
    founderNumber: typeof value.founderNumber === 'number' ? value.founderNumber : null,
    expiresAt: value.expiresAt
  };
}

async function postAccessState() {
  const token = await figma.clientStorage.getAsync(SESSION_TOKEN_KEY);
  let access = await figma.clientStorage.getAsync(ACCESS_CACHE_KEY);

  if (token) {
    try {
      const response = await fetch(`${AUTH_API_URL}/entitlements/me`, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
          'x-iconsearch-product': 'figma'
        }
      });

      if (response.ok) {
        const payload = await response.json();
        access = normalizeAccess(payload.access);
        if (access) await figma.clientStorage.setAsync(ACCESS_CACHE_KEY, access);
      } else if (response.status === 401) {
        await figma.clientStorage.deleteAsync(SESSION_TOKEN_KEY);
        await figma.clientStorage.deleteAsync(ACCESS_CACHE_KEY);
        access = null;
      }
    } catch {
      // Keep a previously verified session available during a temporary outage.
    }
  } else {
    access = null;
  }

  post({ type: 'access-state', unlocked: Boolean(token && access), access: access || null });
}

async function beginSignIn() {
  const attempt = ++authAttempt;
  post({ type: 'auth-pending', message: 'Opening secure sign-in in your browser...' });

  try {
    const startResponse = await fetch(`${AUTH_API_URL}/device/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ product: 'figma', clientName: 'Figma plugin' })
    });
    const startPayload = await startResponse.json();
    if (!startResponse.ok) throw new Error(startPayload.error || 'Could not start sign-in.');

    const deviceCode = startPayload.deviceCode;
    const verificationUrl = startPayload.verificationUriComplete;
    const expiresIn = Number(startPayload.expiresIn) || 600;
    const interval = Math.max(2, Number(startPayload.interval) || 3);
    if (!deviceCode || !verificationUrl) throw new Error('The sign-in response was incomplete.');

    figma.openExternal(verificationUrl);
    post({ type: 'auth-pending', message: 'Approve the connection in your browser. This panel will update automatically.' });
    const deadline = Date.now() + expiresIn * 1000;

    while (attempt === authAttempt && Date.now() < deadline) {
      await delay(interval * 1000);
      if (attempt !== authAttempt) return;

      const statusResponse = await fetch(`${AUTH_API_URL}/device/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ deviceCode })
      });
      const statusPayload = await statusResponse.json();

      if (statusPayload.status === 'pending') continue;
      if (statusPayload.status === 'authorized') {
        const access = normalizeAccess(statusPayload.access);
        if (!statusPayload.token || !access) throw new Error('The approved session was incomplete.');

        await figma.clientStorage.setAsync(SESSION_TOKEN_KEY, statusPayload.token);
        await figma.clientStorage.setAsync(ACCESS_CACHE_KEY, access);
        await postAccessState();
        const label = access.tier === 'founder' && access.founderNumber
          ? `Founder #${access.founderNumber}`
          : 'Free';
        figma.notify(`IconSearch connected. ${label} access is active.`);
        return;
      }

      throw new Error(statusPayload.error || 'The sign-in link expired. Please try again.');
    }

    throw new Error('The sign-in link expired. Please try again.');
  } catch (error) {
    if (attempt !== authAttempt) return;
    post({
      type: 'auth-error',
      message: error instanceof Error ? error.message : 'Could not connect your IconSearch account.'
    });
  }
}

async function signOut() {
  authAttempt += 1;
  const token = await figma.clientStorage.getAsync(SESSION_TOKEN_KEY);
  if (token) {
    try {
      await fetch(`${AUTH_API_URL}/device/revoke`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` }
      });
    } catch {
      // Local sign-out still removes the token if the network is unavailable.
    }
  }

  await figma.clientStorage.deleteAsync(SESSION_TOKEN_KEY);
  await figma.clientStorage.deleteAsync(ACCESS_CACHE_KEY);
  await postAccessState();
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'auth-ready') {
    await postAccessState();
    return;
  }

  if (msg.type === 'sign-in') {
    void beginSignIn();
    return;
  }

  if (msg.type === 'sign-out') {
    await signOut();
    return;
  }

  if (msg.type === 'api-request') {
    const token = await figma.clientStorage.getAsync(SESSION_TOKEN_KEY);
    if (!token) {
      post({
        type: 'api-response',
        requestId: msg.requestId,
        ok: false,
        status: 401,
        payload: { error: 'Sign in is required.' }
      });
      return;
    }

    try {
      const response = await fetch(`${EXTENSION_API_URL}${msg.queryParams || ''}`, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
          'x-iconsearch-product': 'figma'
        }
      });
      post({
        type: 'api-response',
        requestId: msg.requestId,
        ok: response.ok,
        status: response.status,
        payload: await response.json()
      });
    } catch (error) {
      post({
        type: 'api-response',
        requestId: msg.requestId,
        ok: false,
        status: 0,
        payload: {
          error: error instanceof Error ? error.message : 'Could not reach IconSearch.'
        }
      });
    }
    return;
  }

  if (msg.type === 'insert-icon') {
    try {
      const { svg, name } = msg;
      const node = figma.createNodeFromSvg(svg);
      node.name = name || 'Icon';

      const center = figma.viewport.center;
      node.x = center.x - node.width / 2;
      node.y = center.y - node.height / 2;
      figma.currentPage.appendChild(node);
      figma.currentPage.selection = [node];

      figma.notify(`Inserted ${node.name} successfully!`);
    } catch (err) {
      console.error('Error inserting SVG into Figma:', err);
      figma.notify('Error inserting SVG: Please check the console.', { error: true });
    }
  }
};
