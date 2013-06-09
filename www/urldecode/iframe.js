$(function(){

    // Config
    orkan = {
        params: {},
        tick: 0,
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
            $('.output').empty();
        })
        .ajaxError(function(event, xhr, ajaxOptions, thrownError) {
            var json = {error: '['+ xhr.status +'] '+ xhr.statusText};
            try {
                json = $.parseJSON(xhr.responseText);
                console.log(json.console);
            } catch(e){
                console.log(e.message);
            }
            $('#status').addClass('error').text(json.error);
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
                    $('#out_src').attr({href: json.src, title: json.src}).text(json.src);
                    $('#out_dec').attr({href: json.dec, title: json.dec}).text(json.dec);
                    $('#out_ent').attr({href: json.ent, title: json.ent}).text(json.ent);
                    $('#status').text(json.status);
                },
                'json'
            )
            .always(function(){
                $('#source').val('');
                orkan.running = false;
            });
        }
        
        $(this).attr('placeholder', ++orkan.tick % 2 ? '*' : '');
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
});