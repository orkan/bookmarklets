$(function(){

    // Config
    orkan = {
        params: {}
    };
    
    // Parse URL
    if(window.location.search != '' && window.location.search != '?') {
        var search = window.location.search;
        var query = search.slice(1, search.length);
        var pars = query.split('&');
        for(var i in pars) {
            pars[i] = pars[i].split('=');
            orkan.params[pars[i][0]] = pars[i][1];
        }
    }
        
    // Ajax globals
    $(document)
        .ajaxStart(function() {
            $('#status').empty().removeClass('error').addClass('loader');
        })
        .ajaxError(function(event, xhr, ajaxOptions, thrownError) {
            $('#status').addClass('error').text('['+ xhr.status +'] '+ xhr.statusText);
            try {
                console.log($.parseJSON(xhr.responseText).error);
            } catch(e){
                console.log(e.message);
            }
        })
        .ajaxComplete(function(event, xhr, ajaxOptions) {
            $('#status').removeClass('loader');
        });

    // textarea onchange hack (Drag & Drop)
    setInterval(function(){$('#source').trigger('tick.orkan')}, 500);
    $('#source').on('tick.orkan', function()
    {
        if(!orkan.running && $(this).val().length > 0)
        {
            orkan.running = true;
            $.post(
                'decoder.php',
                $('#form1').serialize(),
                function(json)
                {
                    var setHref = function(id, href){
                        $('#'+id).attr({href: href, title: href}).text('').text(href);
                    };
                    setHref('out_src', json.src);
                    setHref('out_dec', json.dec);
                    setHref('out_ent', json.ent);
                    $('#status').text(json.status);
                },
                'json'
            )
            .always(function(){
                $('#source').val('');
                orkan.running = false;
            });
        }
    });
    
    // other...
    $('#site')
        .attr({
            href:  decodeURIComponent(orkan.params.site_url), 
            title: decodeURIComponent(orkan.params.site_title)
        })
        .text(decodeURIComponent(orkan.params.site_title));
        
    $('#entity').click(function(){$('#entity_custom')[0].focus()});
    $('#entity_custom').click(function(){$('#entity').trigger('click')});
    
    // because of ugly rendered fonts in FF 21.0
    // position:fixed replaced with position:absolute + this hack
    /*
    $(window).on('scroll.orkan', function(){
        $('#orkan_wrapper').css('top', $(this).scrollTop() + 'px');
    });
    */

});