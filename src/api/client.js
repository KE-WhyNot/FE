// src/api/client.js
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080').trim();
console.log('[client] API_BASE_URL =', API_BASE_URL || '(EMPTY)');

export async function fetchFinanceProductDetail(finproductId) {
  const base = (API_BASE_URL || '').replace(/\/+$/, '');
  const url = `${base}/finance/products/${encodeURIComponent(finproductId)}`;

  console.groupCollapsed('[api] GET', url);
  try {
    console.log('[api] headers', { Accept: 'application/json' });
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    console.log('[api] status', res.status, res.statusText);

    const text = await res.text();
    console.log('[api] bodyText(0..500)', text.slice(0, 500));

    if (!res.ok) throw new Error(`${res.status} ${res.statusText} :: ${text}`);

    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch (e) {
      console.log('[api] JSON parse error', e);
      throw e;
    }
    console.groupEnd();
    return json;
  } catch (e) {
    console.log('[api] error', e);
    console.groupEnd();
    throw e;
  }
}