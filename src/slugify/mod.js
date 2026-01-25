/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
import * as utils from '../../node_modules/@orkans/utilsjs/src/utils.js';
import * as base from '../app/base.js';

const cfg = base.cfg;
cfg.sep = ' - ';

// ############################################################################
// LIBRARY
// ############################################################################
export function encode(web = '', img = '') {
  const out = { raw: {}, map: {}, log: [], img: '', all: '' };

  const Url = new URL(web);
  out.raw.host = Url.hostname;
  out.raw.path = Url.pathname.replaceAll('/', ' ');
  out.raw.srch = Url.search.replaceAll('?', '');
  out.raw.hash = Url.hash.replaceAll('#', '');

  // Image: host/image | host/image/ | host/image/?a=a
  if (URL.canParse(img)) {
    const Img = new URL(img);
    out.raw.file = Img.pathname.split('/');
    out.raw.file = out.raw.file.filter((v) => v).pop();
    out.raw.file = out.raw.file ?? Img.hostname ?? 'unknown';
    out.log.push('encode() img as: URL');
  } else {
    out.raw.file = utils.pathBasename(img);
    out.raw.file = out.raw.file.replace(/\\|\/|:|\*|\?|"|<|>|\|/g, ' ');
  }

  // Decode all %xx elements to ASCII chars
  out.map = utils.objMap(out.raw, (v) => decodeURIComponent(v.trim()));

  out.img = out.map.file;
  out.all = Object.values(out.map).join(cfg.sep).trim();

  return out;
}
export function decode(all = '') {
  const out = { raw: [], map: {}, log: [], img: '', url: '' };

  // Recover trailing space if truncated by Windows
  all += ' ';

  out.raw = all.split(cfg.sep);
  out.raw = out.raw.map((s) => s.trim());

  out.map.host = out.raw[0] ?? '';
  out.map.path = out.raw[1] ?? '';
  out.map.srch = out.raw[2] ?? '';
  out.map.hash = out.raw[3] ?? '';
  out.map.file = out.raw[4] ?? '';

  out.map.path = out.map.path.replaceAll(' ', '/');
  out.map.path = out.map.path ? `/${out.map.path}` : '';
  out.map.srch = out.map.srch ? `?${out.map.srch}` : '';
  out.map.hash = out.map.hash ? `#${out.map.hash}` : '';

  out.img = out.map.file;
  out.url = `https://${out.map.host}${out.map.path}${out.map.srch}${out.map.hash}`;

  return out;
}

// ############################################################################
// HELPERS
// ############################################################################
function error(s = '') {
  base.error(document.getElementById('err-out'), s);
}
function info(s = '') {
  base.info(document.getElementById('inf-out'), s);
}

// ############################################################################
// EVENTS
// ############################################################################
function onInputWeb(ev) {
  const pagWeb = document.getElementById('pag-web');
  const pagImg = document.getElementById('pag-img');
  const encAll = document.getElementById('enc-all');
  const decUrl = document.getElementById('dec-url');
  const decImg = document.getElementById('dec-img');

  try {
    error();
    var enc = encode(pagWeb.value, pagImg.value);
    var dec = decode(enc.all);
  } catch (E) {
    error(E);
    throw E;
  }

  // Update [Results] fields
  base.setText(encAll, enc.all);
  base.setText(decUrl, dec.url);
  base.setText(decImg, dec.img);

  // Debug
  enc.log.concat(dec.log).map((v) => console.log(v));
  console.log('enc.obj', enc.raw);
  console.log('enc.arr', enc.map);
  console.log('enc.all', `"${enc.all}"`);
  console.log('dec.url', `"${dec.url}"`);
  console.log('dec.img', `"${dec.img}"`);
}
// ============================================================================
function onInputAll(ev) {
  const encAll = document.getElementById('enc-all');
  const decUrl = document.getElementById('dec-url');
  const decImg = document.getElementById('dec-img');

  try {
    error();
    var dec = decode(encAll.value);
  } catch (E) {
    error(E);
    throw E;
  }

  // Update [Results] fields
  base.setText(decUrl, dec.url);
  base.setText(decImg, dec.img);

  // Debug
  console.log('decode() url', `"${dec.url}"`);
  console.log('decode() img', `"${dec.img}"`);
}
// ============================================================================
function onClickCopy(ev) {
  const id = ev.currentTarget.dataset?.copy;
  const el = document.getElementById(id);
  const value = el?.value ?? el?.innerText ?? cfg.placeholder;
  if (value != cfg.placeholder) {
    navigator.clipboard.writeText(value);
    info(`Copied: ${id}`);
    console.log(`onClickCopy() ${id} "${value}"`);
  }
}
// ============================================================================
function onDrop(ev) {
  ev.preventDefault();
  ev.target.value = ev.dataTransfer.getData('text/plain');
  ev.target.dispatchEvent(new Event('input'));
}

// ############################################################################
// RUN
// ############################################################################
base.onLoad(() => {
  const pagWeb = document.getElementById('pag-web');
  const encAll = document.getElementById('enc-all');

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
  encAll.addEventListener('input', onInputAll);

  // --------------------------------------------------------------------------
  // Init...
  pagWeb.value = cfg.app.url;
  // Trigger...
  var eInput = new Event('input');
  pagWeb.dispatchEvent(eInput);
});
