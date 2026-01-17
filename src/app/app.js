/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
import * as utils from '../../node_modules/@orkans/utilsjs/src/utils.js';

var el = {};

// ============================================================================
// EVENTS
function onClickNav(e) {
  const close = e.target.classList.toggle('orkClosed');
  el.app.style.setProperty('top', close ? `-${ork.max}` : '0');
}

// ============================================================================
// RUN
((ork) => {
  // --------------------------------------------------------------------------
  // HTML
  const inf = {
    pagUrl: document.URL,
    pagTitle: document.title.trim(),
  };
  const enc = utils.objMap(inf, encodeURIComponent);

  document.head.insertAdjacentHTML(
    'beforeend',
    `<link rel="stylesheet" href="${ork.url}/src/app/app.css" />`
  );
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="ork-app"><iframe 
      width="100%"
      height="${ork.max}"
      scrolling="no"
      allowtransparency="true"
      src="${ork.url}/src/${ork.mod}/mod.html?url=${enc.pagUrl}&title=${enc.pagTitle}" 
      ></iframe><footer><aside></aside><nav><div id="ork-nav"><i></i>${ork.mod}<i></i></nav><aside></aside></footer></div>`
  );

  // --------------------------------------------------------------------------
  // WIRE
  el.app = document.getElementById('ork-app');
  el.nav = document.getElementById('ork-nav');
  el.nav.addEventListener('click', onClickNav);

  // --------------------------------------------------------------------------
  // RUN
})(window.ork);
