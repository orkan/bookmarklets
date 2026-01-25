/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
// import * as utils from '../../node_modules/@orkans/utilsjs/src/utils.js';

// ############################################################################
// EVENTS
// ############################################################################
function onClickNav(e) {
  const isClosed = e.target.classList.toggle('orkClosed');
  document.getElementById('ork-app').style.setProperty('top', isClosed ? `-${ork.max}` : '0');
}

// ############################################################################
// RUN
// ############################################################################
((ork) => {
  const app = {
    ork: ork,
    url: document.URL,
    title: document.title.trim(),
  };
  const Url = new URL(`${ork.url}/src/${ork.mod}/mod.html`);
  Url.searchParams.set('app', JSON.stringify(app));

  // --------------------------------------------------------------------------
  // HTML
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
      src="${Url}"
      ></iframe><footer><aside></aside><nav><div id="ork-nav"><i></i>${ork.mod}<i></i></nav><aside></aside></footer></div>`
  );

  // --------------------------------------------------------------------------
  // WIRE
  document.getElementById('ork-nav').addEventListener('click', onClickNav);

  // --------------------------------------------------------------------------
  // RUN
})(window.ork);
