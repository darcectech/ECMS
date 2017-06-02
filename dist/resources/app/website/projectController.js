
function projectController(){
    _template( 'project.template' ).place( 'main' , '#project' , true , window.project_reference).done(function(r){
        start(); // Once the project template has completed loading, start the listener so images can be changed when clicked

        wikiLoad(r.buzz,function ex(data){
            let res = $(data.parse.text['*'])[0];
            if (res.className === "redirectMsg") {

                wikiLoad($(res).find('a').text(), ex);

            }
        });

        setTimeout(function(){
            if ($('.nbs-wikiblurb-error').length === 1){
                $('#wiki').hide();
                $('.wiki').hide();
            }
            console.warn('CHECKED');
        },500);

        let infoCard = $('#projectInfoCard');
        infoCard.find('h4:nth-child(1n)').text(filter.trimStart(filter.Location,32));
        infoCard.append( $('<div class=tags/>') );

        r.categories.forEach(function(cat){
            infoCard.find('.tags').append( $('<span class="tag">'+cat+'</span>') );
        });

        if (r.guide !== ""){
            $('#notes').html(r.guide);
        }

        if ( $('table tr td').length === 0 ){
            $('table').append( $('<tr><td>No Files available</td><td></td><td></td><td></td></tr>') );
        }

        if (r['thingiverse'] !== undefined){

            let tIC = $('#thingInfoCard');

            tIC.find('img')[0].src = 'https://chart.apis.google.com/chart?chs=150x150&cht=qr&chl=www.thingiverse.com/thing:'+r['thingiverse']+'&choe=UTF-8&chld=L|1';

            getTitle(r['thingiverse'],function(title){
                tIC.find('h2').text(title);
                tIC.find('h4').empty().append( $('<a style="all:inherit" href="https://www.thingiverse.com/thing:'+r['thingiverse']+'"></a>').text( "www.thingiverse.com/thing:"+r['thingiverse']) );
                getCreator(r['thingiverse'],function(creatorName){
                    tIC.find('.tags>.tag:nth-child(2n)').text(creatorName);
                    tIC.find('.tags>.tag:nth-child(3n)').text(r['thingiverse']);
                    show(tIC);
                });
            });
            getDescription(r['thingiverse'],function(description){
                let notes = $('#notes');
                notes.html( notes.html() + "<br><br>"+"<strong style='color:dodgerblue'>From Thingiverse:</strong><br> " + description );
            });

            if ( $('.preview img')[0].src.indexOf('images/undefined') > -1 ){
                getFeaturedImage(r['thingiverse'],function(imgSrc){
                    $('.preview img, .thumbnail img').attr('src', imgSrc);
                });
            }

        }
        else{
            $('#thingInfoCard').remove();
        }

    });
}