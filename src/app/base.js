/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
export const cfg = { placeholder: '', api: 'none' };

// ############################################################################
/*
  Send FORM and return JSON.

  NOTES:
  The `body: new FormData(form)` will send it as 'Content-Type': 'multipart/form-data' 
  and requires PHP8::request_parse_body(data)
  Standard JSON format requires only: PHP::json_decode(data)
*/
export function postForm(url, form) {
  // Convert to JSON
  const formData = new FormData(form);
  const data = {};
  formData.forEach((v, k) => (data[k] = v));
  const json = JSON.stringify(data);

  return fetchJson(url, {
    method: 'POST',
    headers: {
      'X-Api-Key': cfg.api,
      'Content-Type': 'application/json',
    },
    body: json,
  });
}

// ############################################################################
/*
  GET JSON from PHP Server.

  NOTES:
  JS.fetch() does NOT send well known 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  resulting in empty arrays PHP::$_GET and PHP::$_POST.
  To get the contents use PHP::file_get_contents('php://input')
*/
export async function fetchJson(url, opts = {}) {
  let data, error;

  try {
    var res = await fetch(url, opts);

    data = await res.text(); // keep php errors as text...
    data = JSON.parse(data); // ...or decode php response
    error = data.error ? `PHP: ${data.error}` : null;
    data = data.data;
  } catch (er) {
    error = `JS: ${er.message}`;
  }

  return { data, error };
}

// ############################################################################
// Properly display text in html elements like: INPUT, A, DIV, etc...
export function setText(el, s) {
  const where = 'value' in el ? 'value' : 'innerText';
  el[where] = s ? s : cfg.placeholder;
  if (s && 'href' in el) {
    const Url = new URL(s);
    el.href = Url.href;
  }
}

// ############################################################################
export function error(el, s = '') {
  blink(el, s);
}

// ############################################################################
var infoT;
export function info(el, s = '') {
  blink(el, s);
  // Auto clear after x sec...
  infoT && clearTimeout(infoT);
  infoT = setTimeout(() => {
    el.innerText = '';
    infoT = null;
  }, 2000);
}

// ############################################################################
// Show feedback even if the same message is displayed
export function blink(el, s) {
  el.innerText = '';
  setTimeout(() => (el.innerText = s), 100);
}

// ############################################################################
export function onLoad(fn) {
  if (typeof window === 'object') {
    // Save bookmarklet data [window.ork] to [cfg.app]
    const searchParams = new URL(window.location).searchParams;
    cfg.app = JSON.parse(searchParams.get('app'));
    window.onload = fn;
  }
}
