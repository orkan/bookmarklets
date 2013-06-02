(function(){
  var window = this;

  /* Extract URL query of [this] script */
  var params = {};
  var scripts = document.getElementsByTagName("script");
  if(scripts.length) {
    var path  = scripts[scripts.length - 1].src,
        query = path.slice(path.indexOf("?") + 1, path.length),
        pars  = (path!=query && query!="") ? query.split("&") : [];
    for(var i=0; i < pars.length; i++) {
      var p = pars[i].split("=");
      params[p[0]] = p[1];
    }
  }
  
  if(typeof(window.OrkanBar) == "undefined")
  {
    window.OrkanBar = {
      loadJS: function(u, s) {
        var e = document.createElement("script");
        e.setAttribute("type","text/javascript");
        e.setAttribute("language","javascript");
        u ? e.setAttribute("src",u) : e.text = s;
        document.body.appendChild(e);
      },
      loadCSS: function(u) {
        var e = document.createElement("link");
        e.setAttribute("type","text/css");
        e.setAttribute("rel","stylesheet");
        e.setAttribute("media","screen");
        e.setAttribute("href",u);
        try {
          document.getElementsByTagName("head")[0].appendChild(e);
        } catch(z) {
          document.body.appendChild(e);
        }
      },
      params: {}
    };

    OrkanBar.loadJS("http://localhost:1601/shared/jquery.js?v=1.3.2");
    OrkanBar.loadJS("","OrkanBar.jQuery = jQuery.noConflict(true);");
    OrkanBar.loadCSS("http://localhost:1601/urldecode/bar.css?build=1.31");
  }
  
  /* Save URL params in global obj */
  OrkanBar.params = params;
  
  /* Create new bar / replace existing */
  OrkanBar.$continer && OrkanBar.$continer.remove();
  OrkanBar.loadJS("http://localhost:1601/urldecode/bar.js?build=1.31");

})();

