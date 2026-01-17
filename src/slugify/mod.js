/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
import * as utils from '../../node_modules/@orkans/utilsjs/src/utils.js';

var ork = (window.ork = { el: {}, placeholder: 'waiting...', sep: ' - ' });

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
  const out = { obj: {}, arr: [], all: '' };

  try {
    const Url = new URL(web);
    out.obj.host = Url.hostname;
    out.obj.path = Url.pathname.replaceAll('/', ' ');
    out.obj.srch = Url.search.replaceAll('?', '');
    out.obj.hash = Url.hash.replaceAll('#', '');
    out.obj.file = utils.pathBasename(img);

    out.arr = Object.values(out.obj);
    out.arr = out.arr.map((v) => decodeURIComponent(v.trim())); // replace %xx elements
    // out.arr = out.arr.filter((v) => v); // remove missing params
    out.all = out.arr.join(sep);
  } catch (E) {
    console.error(E);
    error(`${E.name}: ${E.message}`);
    throw E;
  }

  return out;
}
export function decode(all = '') {
  const sep = ork.sep;
  const out = { obj: {}, arr: [], url: '', img: '' };

  out.arr = all.split(sep);
  out.obj.host = out.arr[0] ?? '';
  out.obj.path = out.arr[1] ?? '';
  out.obj.srch = out.arr[2] ?? '';
  out.obj.hash = out.arr[3] ?? '';
  out.obj.file = out.arr[4] ?? '';

  out.obj.path = out.obj.path.replaceAll(' ', '/');
  out.obj.srch = out.obj.srch ? `?${out.obj.srch}` : '';
  out.obj.hash = out.obj.hash ? `#${out.obj.hash}` : '';

  out.url = `https://${out.obj.host}/${out.obj.path}${out.obj.srch}${out.obj.hash}`;
  out.img = out.obj.file;

  return out;
}

// ============================================================================
// EVENTS
function onInputWeb(ev) {
  error('');
  const enc = encode(ork.el.pagWeb.value, ork.el.pagImg.value);
  const dec = decode(enc.all);

  // Update [Results] fields
  setText(ork.el.encAll, enc.all);
  setText(ork.el.decUrl, dec.url);
  setText(ork.el.decImg, dec.img);

  // Debug
  console.log('encode() obj', enc.obj);
  console.log('encode() arr', enc.arr);
  console.log('encode() all', `"${enc.all}"`);
  console.log('decode() url', `"${dec.url}"`);
  console.log('decode() img', `"${dec.img}"`);
}
function onInputAll(ev) {
  error('');
  const dec = decode(ork.el.encAll.value);

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

// ============================================================================
// RUN
window.onload = () => {
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
};
