var CopyClipboardButton = {};

CopyClipboardButton.getCopyText = function(dom_id) {
    var el = document.getElementById(dom_id);
	try	{
		return (el.value || el.innerText || el.textContent);
	} catch(e) {
		return '';
	}
};
CopyClipboardButton.appendButton = function(appendCopyButtonContainerId, copyTextContainerId, options) {
	var a = document.getElementById(appendCopyButtonContainerId);
	var button = CopyClipboardButton.create(copyTextContainerId, options);
	a.appendChild(button);
};

CopyClipboardButton.listen = function (elem, evnt, func) {
  if (elem.addEventListener) // W3C DOM
    elem.addEventListener(evnt,func,false);
  else if (elem.attachEvent) { // IE DOM
    var r = elem.attachEvent("on"+evnt, func);
    return r;
  }
};

CopyClipboardButton.targ = function(e) {
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	return targ;
};


CopyClipboardButton.create = function(copyTextContainerId, options) {
	var opts = {
		"height": "16",
		"width": "50",
		"fontSize": "14",
		"fontColor": "#000000",
		"fontFace": "Helvetica",
		"pathToSwf": "CopyClipboardButton.swf?v=3.0",
		"imageUrl": '',
		"copyText": '',
		"wmode": "transparent"
	};
	if (typeof(options) == "undefined") { var options = {}; };
	for (var k in options) {
		opts[k] = options[k];
	};
	var e = document.createElement('embed');
    var o = document.createElement("object");
  
	o.height = opts['height'];
	e.height = o.height;
    o.width = opts['width'];
	e.width = o.width;			
	
  e.setAttribute('type', "application/x-shockwave-flash");

  var pmovie = document.createElement("param");
  pmovie.name = "movie";
  pmovie.value = opts['pathToSwf'];
  o.appendChild(pmovie);
  e.setAttribute('src', pmovie.value);

  var pFlashVars = document.createElement("param");
  pFlashVars.name = "FlashVars";
  pFlashVars.value = "copyTextContainerId="+ copyTextContainerId +"&fontSize=" + opts['fontSize'] +"&fontFace=" + opts['fontFace'] +"&fontColor=" + opts['fontColor'] + "&imageUrl=" + opts['imageUrl'] + "&copyText=" + opts['copyText'] ;
  o.appendChild(pFlashVars);
  e.setAttribute('flashVars', pFlashVars.value);

  var pquality = document.createElement("param");
  pquality.name = "quality";
  pquality.value = "high";
  o.appendChild(pquality);
  
  var pmenu = document.createElement("param");
  pmenu.name = "menu";
  pmenu.value = "false";
  o.appendChild(pmenu);
  
  var pwmode = document.createElement("param");
  pwmode.name = "wmode";
  pwmode.value = opts['wmode'];
  o.appendChild(pwmode);
  e.setAttribute('wmode', opts['wmode']);

  try {
      o.appendChild(e);
  } catch(z) {
      // Make this shit work in IE.
      var ta = document.createElement('textarea');
      if (opts['copyText']) {
          var txt = opts['copyText']; 
      } else {
          var txt = document.getElementById(copyTextContainerId).innerHTML;
      }
      ta.appendChild(document.createTextNode(txt));
      
      ta.setAttribute('style', 'display:none;');
      ta.setAttribute('class', 'hidden');
      ta.setAttribute('className', 'hidden');
      var ta_id = copyTextContainerId + "__cont";
      ta.setAttribute('id', ta_id);
      document.body.appendChild(ta);
      var a = document.createElement('a');
      a.appendChild(document.createTextNode('Copy'));
      a.href = "#";
      a.setAttribute('rel', ta_id);
      
      CopyClipboardButton.listen(a, 'click', function(e){ 
          var targ = CopyClipboardButton.targ(e); 
          var new_cont = document.getElementById(targ.rel);
          if (new_cont && new_cont.innerHTML != '') {
              cont = new_cont;
              var range = new_cont.createTextRange();
              range.execCommand('Copy');
          }
      });
      return a;
  };
    
  
  return o;
};