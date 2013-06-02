(function(){

  if(!OrkanBar.jQuery) { // Quick & ugly fix for FF 8.0.1
    OrkanBar.loadJS("http://localhost:1601/shared/jquery.js?v=1.3.2");
    OrkanBar.jQuery = jQuery.noConflict(true);
  }
  
  var $ = OrkanBar.jQuery;

  var $continer = $("<div/>")
      .attr({id: "_b_urldecode_continer"});

  var $iframe = $("<iframe/>")
      .attr({
        id: "_b_urldecode_iframe",
        src: "http://localhost:1601/urldecode/bar.php?u="+encodeURIComponent(document.URL)+"&s="+encodeURIComponent($.trim(document.title)),
        allowtransparency: "true",
        scrolling: "no"
      });

  var $close = $("<div/>")
      .attr({id: "_b_urldecode_close"})
      .text("Close sidebar")
      .addClass("_b_urldecode_btn")
      .click(function(){
        OrkanBar.$continer.remove();
        OrkanBar.$continer = OrkanBar.$slider_btn = null;
      });

  var $slider = $("<div/>")
      .attr({id: "_b_urldecode_slider"});

  var $slider_btn = $("<div/>")
      .attr({id: "_b_urldecode_slider_btn"})
      .text("Show / hide sidebar")
      .addClass("_b_urldecode_btn")
      .toggle(
        function(){
          OrkanBar.$continer.animate({marginTop: "-="+OrkanBar.ifr_height}, function(){
              OrkanBar.$slider_btn.addClass("arrDown");
          });
        },
        function(){
          OrkanBar.$continer.animate({marginTop: "+="+OrkanBar.ifr_height}, function(){
              OrkanBar.$slider_btn.removeClass("arrDown");
          });
        }
      );

  $continer.append($iframe);
  $continer.append($close);
  $slider.append($slider_btn);
  $continer.append($slider);
  $continer.appendTo("body");

  OrkanBar.$continer = $continer;
  OrkanBar.$slider_btn = $slider_btn;
  
  setTimeout(function(){
    OrkanBar.ifr_height = $iframe.height(); /* Needs some delay for DOM update */
    OrkanBar.params.min && $slider_btn.click(); /* Start collapsed */
    },
    100);

})();
