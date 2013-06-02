<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US">
<head>

<title>URL.decode demo</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<style type="text/css" media="screen">
body {
  margin:0; padding:0; font: normal 13px arial, sans-serif; color: #ececec; text-align: left; text-transform:none;
  background-color:transparent; border:none;
}

h2 { margin:0 0 4px; padding:0; line-height:1em; letter-spacing:-1px; overflow:hidden; white-space:nowrap; border-bottom:1px solid #ccc; }
h2 span { padding-left:6px; font-weight:normal; }
a { color:#999; outline:none !important; text-decoration:none; }
a:hover { text-decoration:none; color:#69f; }
img { border:none; }
input { border:none; color:#555; background:#fff; padding:2px; }
input[type="radio"] { position:relative; top:2px; }
label { cursor:pointer; font-weight:bold; margin-right:5px; }
input[type="text"], textarea { font: normal 13px arial, sans-serif; }


#container { padding:10px 0 0 10px; width:100%; overflow: hidden; background:#000; opacity:.9; }
#banner, #decoder { float:left; height:134px; }
#banner { width:313px; }
#decoder { width:355px; }
#results { padding:0 14px 0 690px; }

#logo { margin-bottom:4px; width:266px; height:38px; display:block; background:url(sprite.png?build=1.31) no-repeat; }
#info { font-size:11px; padding-bottom:5px; color: #292929; }
#decoder h2 span { font-size:18px; }
#results h2 span { font-size:14px; letter-spacing:0; }

#submit_form { position: relative; overflow: hidden; }
#submit_form_overlay { width: 100%; height:170px; position: absolute; top:0; opacity: 1; }
.inlineLabels > span { display:inline-block; width:60px; }

#url_text_desc { width:200px; height:55px; position:absolute; left:120px; top:67px; text-indent:-9999px; background:url(sprite.png?build=1.31) no-repeat -64px -92px; }
#url_copy_button { padding:4px 2px 0; position:absolute; right:0; top:18px; background-color:#1d1d1d; -moz-border-radius:6px 6px 0 0; }
#url_text { margin:4px 0 2px; width:100%; height:28px; /* height:60px; */ }

.btn { cursor:pointer; font-weight:bold; text-indent:-9999px; }

#btn_decode { float:left; width:68px; height:27px; background:url(sprite.png?build=1.31) no-repeat -64px -38px; }
#btn_decode:hover { background-position:-64px -65px; }
#clear { float:right; width:120px; text-align:right; }
#btn_clear { padding:6px 4px 4px; background-color:#1d1d1d; -moz-border-radius:0 0 6px 6px; }
#btn_clear:hover { background-color:#2d2d2d; }

.loader { padding-left:26px; background:url(loader.gif) no-repeat 10px center; }
.error { color:red; }

#results ul { margin:0; padding:0; list-style-type:none; }
#results li { list-style-type:none; padding:1px 0; }
#results li span { margin-top:2px; padding:0 4px; width:22px; float:left; display:inline-block; -moz-border-radius:4px; background-color:#1d1d1d;  }
#results li:nth-of-type(2) span { background-color:#414141; }
#results li:nth-of-type(3) span { background-color:#69f; }
#results li a { margin-left:42px; padding:1px 2px; display:block; overflow:hidden; white-space:nowrap; background-color:#111111; border:1px solid #333333; }

</style>

<script type="text/javascript" src="../shared/jquery.js?v=1.3.2"></script>
<script type="text/javascript" src="../shared/jquery.form.js?v=2.28"></script>
<script type="text/javascript" src="../shared/CopyClipboardButton.js?v=3.0"></script>
<script type="text/javascript">
/* <![CDATA[ */

  $(function()
  {
    window.decoder = {
      $form:    $("#submit_form"),
      $url:     $("#url_text"),
      $clear:   $("#btn_clear"),
      $aclear:  $("#auto_clear"),
      $decode:  $("#btn_decode"),
      $status:  $("#status"),
      $overlay: $("#submit_form_overlay"),
      $output:  $("#output"),
      showError: function(s){
        decoder.$status.addClass("error").text(s);
        return false;
      },
      clearError: function(){
        decoder.$status.removeClass("error").text("");
      },
      loading: function(run){
        if(run) {
          decoder.clearError();
          decoder.$status.addClass("loader");
          decoder.$form.css({opacity: "0.5"});
          decoder.$overlay.show();
          decoder.$output.empty();
        }
        else {
          decoder.$status.removeClass("loader");
          decoder.$form.fadeTo("slow", 1);
          decoder.$overlay.hide();
          decoder.$output.fadeIn("slow");
        }
        decoder.running = run;
      },
      polling: setInterval(function(){
        $(window).trigger("decoder.polling");
      }, 500)
    };


    $("a").attr({target: "_top"});
    decoder.$url[0].focus();
    decoder.$clear.click(function(){decoder.$url.val("")});
    $("#ent_fix").click(function(){$("#dec_entity")[0].focus()});
    $("#dec_entity").click(function(){$("#ent_fix").trigger("click")});


    $(window).bind("decoder.polling", function(){
        !decoder.running &&
        decoder.$aclear[0].checked &&
        decoder.$url.val().length > 0 &&
        decoder.$decode.trigger("click");
    });


    decoder.$decode.click(function()
    {
      var url_text = decoder.$url.val();

      if(decoder.running) return decoder.showError("Decoder is running");
      if(url_text == "" || url_text.indexOf("http") == -1) return decoder.showError("Wrong input");

      decoder.$form.ajaxForm({
        target:       "#output",
        dataType:     "json",
        beforeSubmit: function(){decoder.loading(true)},
        error:        function(xml,status,error){decoder.showError(status?status:error)},
        success:      function(json){
          var out = "";
          if(json.err)  for(var k in json.err)  out = out + "<li class=\"error\">"+json.err[k]+"</li>";
          else          for(var k in json.data) out = out + "<li><span>"+k+":</span><a href=\""+json.data[k]+"\">"+json.data[k]+"</a></li>";
          json.method && decoder.$status.text(json.method);
          out && decoder.$output.append(out);
        },
        complete:     function(){
          $("#output a").attr({target: "_top"});
          decoder.loading(false);
          decoder.$aclear[0].checked && decoder.$clear.trigger("click");
        }
      }).submit();
    });
  });

  // Preload some images
  $("<img/>").attr("src", "loader.gif");

/* ]]> */
</script>

</head>
<body>

<div id="container">

  <div id="banner">
    <a href="../urldecode.htm" id="logo"></a>
    <div id="info">$LastChangedDate:: 2009-09-25 #$. $Revision: 24 $</div>
  </div>

  <div id="decoder">
    <h2>URL:<span id="home_link"><a href="<?php echo $_GET['u'] ?>"><?php echo $_GET['s'] ?></a></span></h2>

    <form id="submit_form" action="decoder.php" method="post">

      <div class="inlineLabels">
        <span>Decoding:</span>
        <label><input type="radio" name="dec" id="dec_def" value="def" checked="checked" />auto</label>
        <label><input type="radio" name="dec" id="dec_b64" value="b64" />base64_decode</label>
        <label><input type="radio" name="dec" id="dec_url" value="url" />urldecode</label>
      </div>

      <div class="inlineLabels">
        <span>Entity url:</span>
        <label><input type="radio" name="ent" id="ent_def" value="def" checked="checked" />auto</label>
        <input type="radio" name="ent" id="ent_fix" value="fix" /><input type="text" name="dec_entity" value="" id="dec_entity" />
      </div>

      <span id="url_copy_button">
        <embed width="38" height="18" type="application/x-shockwave-flash" src="../shared/CopyClipboardButton.swf?v=3.0" flashvars="copyTextContainerId=url_text&amp;fontSize=14&amp;fontFace=Arial&amp;fontColor=#000000&amp;imageUrl=../shared/copy-black.png&amp;copyText=" wmode="transparent"/>
      </span>

      <textarea name="url_text" id="url_text"></textarea>

      <div id="btn_decode" class="btn">Decode</div>

      <div id="clear">
        <input type="checkbox" id="auto_clear" checked="checked" /><label for="auto_clear">(auto)</label>
        <span id="btn_clear" class="btn">Clear</span>
      </div>

      <div style="display:none;" id="submit_form_overlay"></div>
    </form>

    <div id="url_text_desc">Drag here:</div>

  </div>

  <div id="results">
    <h2>Results:<span id="status"></span></h2>
    <ul id="output"></ul>
  </div>

</div>

</body>
</html>