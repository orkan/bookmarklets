/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
import * as base from '../app/base.js';

const cfg = base.cfg;
cfg.placeholder = 'Null';
cfg.api = 'wHoPvhRaeUTdCWT0sLFWzNgsuSHKNqpn7zlZY4DfYbM=';
cfg.url = cfg.app?.ork?.end ?? 'http://localhost:6011/src/ping/end.php';

// ############################################################################
// HELPERS
// ############################################################################

/**
 * Display JS and PHP erorrs in separated elements.
 */
function error(s = '') {
  const obj = {
    'err-req': 'JS: ',
    'err-out': 'PHP: ',
  };
  Object.entries(obj).forEach(([k, v]) => {
    const str = s && s.indexOf(v) === 0 ? s.substring(v.length) : '';
    base.error(document.getElementById(k), str);
  });
}
function info(s = '') {
  base.info(document.getElementById('inf-out'), s);
}

// Send button state.
var isSending;
function sending(is) {
  if (is === isSending) {
    return false;
  }
  isSending = is;
  const icoSend = document.querySelector('#btn-send > i');
  is ? icoSend.classList.add('fa-flip') : icoSend.classList.remove('fa-flip');
  return true;
}

// ############################################################################
// EVENTS
// ############################################################################

async function onClickSend(ev) {
  const resText = document.getElementById('res-text');
  const reqForm = document.getElementById('req-form');

  info('Sending...');
  if (!sending(true)) {
    return;
  }

  // --------------------------------------------------------------------------
  error('');
  base.setText(resText, 'Wait...');
  console.log(`GET "${cfg.url}"`);

  // const json = await base.fetchJson(cfg.url);
  const json = await base.postForm(cfg.url, reqForm);
  console.log('json', json);

  error(json.error);
  base.setText(resText, json.data);
  // --------------------------------------------------------------------------

  sending(false);
  info('Done!');
}

// ############################################################################
// RUN
// ############################################################################

base.onLoad(() => {
  document.getElementById('btn-send').addEventListener('click', onClickSend);
});
