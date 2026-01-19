/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
import * as utils from '../../node_modules/@orkans/utilsjs/src/utils.js';

var ork = { el: {}, placeholder: '', sep: ' - ' };

// ============================================================================
// HELPERS
function findElementById(id) {
  for (const k in ork.el) {
    if (ork.el[k].id === id) {
      return ork.el[k];
    }
  }
  return null;
}
// Properly display text in html elements like: INPUT, A, DIV, etc...
function setText(el, s) {
  const where = 'value' in el ? 'value' : 'innerText';
  el[where] = s ? s : ork.placeholder;

  if (s && 'href' in el) {
    try {
      const Url = new URL(s);
      el.href = Url.href;
    } catch (E) {
      error(`${E.name}: ${E.message}`);
      throw E;
    }
  }
}
function error(s = '') {
  blink(ork.el.errOut, s);
}
function info(s = '') {
  blink(ork.el.infOut, s);
  // Auto clear after x sec...
  ork.infoT && clearTimeout(ork.infoT);
  ork.infoT = setTimeout(() => (ork.el.infOut.innerText = ''), 2000);
}
// Show feedback even if the same message is displayed
function blink(el, s) {
  el.innerText = '';
  setTimeout(() => (el.innerText = s), 100);
}

// ============================================================================
// LIBRARY
export function encode(web = '', img = '') {
  const sep = ork.sep;
  const out = { raw: {}, map: {}, log: [], img: '', all: '' };

  const Url = new URL(web);
  out.raw.host = Url.hostname;
  out.raw.path = Url.pathname.replaceAll('/', ' ');
  out.raw.srch = Url.search.replaceAll('?', '');
  out.raw.hash = Url.hash.replaceAll('#', '');

  // Image: host.com/image | host.com/image/ | host.com/image/?a=a
  if (URL.canParse(img)) {
    const Img = new URL(img);
    out.raw.file = Img.pathname.split('/');
    out.raw.file = out.raw.file.filter((v) => v).pop();
    out.log.push('encode() img as: URL');
  } else {
    out.raw.file = utils.pathBasename(img);
    out.raw.file = out.raw.file.replace(/\\|\/|:|\*|\?|"|<|>|\|/g, ' ');
  }

  // Decode all %xx elements to ASCII chars
  out.map = utils.objMap(out.raw, (v) => decodeURIComponent(v.trim()));

  out.img = out.map.file;
  out.all = Object.values(out.map).join(sep).trim();

  return out;
}
export function decode(all = '') {
  const sep = ork.sep;
  const out = { raw: [], map: {}, log: [], img: '', url: '' };

  // Recover trailing space if truncated by Windows
  all += ' ';

  out.raw = all.split(sep);
  out.raw = out.raw.map((s) => s.trim());

  out.map.host = out.raw[0] ?? '';
  out.map.path = out.raw[1] ?? '';
  out.map.srch = out.raw[2] ?? '';
  out.map.hash = out.raw[3] ?? '';
  out.map.file = out.raw[4] ?? '';

  out.map.path = out.map.path.replaceAll(' ', '/');
  out.map.srch = out.map.srch ? `?${out.map.srch}` : '';
  out.map.hash = out.map.hash ? `#${out.map.hash}` : '';

  out.img = out.map.file;
  out.url = `https://${out.map.host}/${out.map.path}${out.map.srch}${out.map.hash}`;

  return out;
}

// ============================================================================
// EVENTS
function onInputWeb(ev) {
  error();

  try {
    var enc = encode(ork.el.pagWeb.value, ork.el.pagImg.value);
    var dec = decode(enc.all);
  } catch (E) {
    error(E);
    throw E;
  }

  // Update [Results] fields
  setText(ork.el.encAll, enc.all);
  setText(ork.el.decUrl, dec.url);
  setText(ork.el.decImg, dec.img);

  // Debug
  enc.log.concat(dec.log).map((v) => console.log(v));
  console.log('enc.obj', enc.raw);
  console.log('enc.arr', enc.map);
  console.log('enc.all', `"${enc.all}"`);
  console.log('dec.url', `"${dec.url}"`);
  console.log('dec.img', `"${dec.img}"`);
}
function onInputAll(ev) {
  error();

  try {
    var dec = decode(ork.el.encAll.value);
  } catch (E) {
    error(E);
    throw E;
  }

  // Update [Results] fields
  setText(ork.el.decUrl, dec.url);
  setText(ork.el.decImg, dec.img);

  // Debug
  console.log('decode() url', `"${dec.url}"`);
  console.log('decode() img', `"${dec.img}"`);
}
function onClickCopy(ev) {
  const id = ev.currentTarget.dataset?.copy;
  const el = findElementById(id);
  const value = el?.value ?? el?.innerText ?? ork.placeholder;
  if (value != ork.placeholder) {
    navigator.clipboard.writeText(value);
    info(`Copied: ${id}`);
    console.log(`onClickCopy() ${id} "${value}"`);
  }
}
function onDrop(ev) {
  ev.preventDefault();
  ev.target.value = ev.dataTransfer.getData('text/plain');
  ev.target.dispatchEvent(new Event('input'));
}

function onLoad() {
  ork.el.pagWeb = document.getElementById('pag-web');
  ork.el.pagImg = document.getElementById('pag-img');
  ork.el.encAll = document.getElementById('enc-all');
  ork.el.decUrl = document.getElementById('dec-url');
  ork.el.decImg = document.getElementById('dec-img');
  ork.el.errOut = document.getElementById('err-out');
  ork.el.infOut = document.getElementById('inf-out');

  // --------------------------------------------------------------------------
  // Wire: copy buttons
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', onClickCopy);
  });

  // --------------------------------------------------------------------------
  // Wire: textareas
  document.querySelectorAll('textarea').forEach((el) => {
    el.addEventListener('drop', onDrop);
    el.addEventListener('input', onInputWeb);
  });

  // Wire: manual encoding
  ork.el.encAll.addEventListener('input', onInputAll);

  // --------------------------------------------------------------------------
  // Init...
  const params = new URL(window.location).searchParams;
  ork.el.pagWeb.value = params.get('url');
  // Trigger...
  var eInput = new Event('input');
  ork.el.pagWeb.dispatchEvent(eInput);
}

// ============================================================================
// RUN
if (typeof window === 'object') {
  window.onload = onLoad;
}
