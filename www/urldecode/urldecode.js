if(typeof orkan == 'undefined')
{
    // config
    orkan = {};
    orkan['url']        = 'http://localhost:1601';
    orkan['home']       = orkan['url'] + '/urldecode';
    orkan['shared']     = orkan['url'] + '/shared';
    orkan['t']          = 't='+(new Date()).getTime();

    // console.log() fallback
    if(typeof console==='undefined'||typeof console.log==='undefined'){console={log:function(s){alert(s)}}}

    // load jQuery (mod by orkan)
    // http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
    (function(){
        var
        head        = document.getElementsByTagName('head')[0],
        script      = document.createElement('script'),
        callback    = function()
        {
            orkan.jQuery = jQuery.noConflict(true); // move newly loaded jQuery object to orkan.jQuery
            
            (function($)
            {
                // shared CSS (wrapper & iframe)
                $('head').append($('<link rel="stylesheet" href="' + orkan.home + '/urldecode.css?' + orkan.t + '" />'));
                
                // deprecated
                //$.getScript(orkan.home + '/iframe.js');
                
                // Must use append() here! Can't make cross-domain load() because of "Same origin policy"
                $('body').append(
                
'<div id="orkan_wrapper">'+
    '<iframe id="orkan_body" src="' + orkan.home + '/iframe-body.htm?' + 
        orkan.t + 
        '&site_url=' + encodeURIComponent(document.URL) + 
        '&site_title=' + encodeURIComponent($.trim(document.title)) + 
    '" allowtransparency="true" scrolling="no"></iframe>'+
    '<div id="orkan_slider"><div id="orkan_slider_btn" class="slider_dn"></div></div>'+
'</div>'
                );
                
                $('#orkan_slider_btn').click(function(){
                    $self = $(this);
                    if($self.hasClass('slider_dn')) {
                        $('#orkan_body').animate({marginTop: '-=' + $('#orkan_body').height()}, function(){
                          $self.removeClass('slider_dn').addClass('slider_up');
                        });
                    }
                    else {
                        $('#orkan_body').animate({marginTop: '+=' + $('#orkan_body').height()}, function(){
                          $self.removeClass('slider_up').addClass('slider_dn');
                        });
                    }
                });
                
            })(orkan.jQuery);
        };
        script.src      = orkan.shared + '/jquery.js';
        script.onload   = script.onreadystatechange = callback; // bind callback to several events for cross browser compatibility
        head.appendChild(script); // fire the loading
    })();
}
else
{
    // do nothing, or add an ON/OFF switch maybe?
    console.log('Already running!');
}
