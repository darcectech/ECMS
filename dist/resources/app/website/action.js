function start() {
    let images=$(".thumbnail img");
    images.each(function(){
        let image = $(this);
        image.click(function() {
            swap(this)
        });
    });
}

function swap(currentImage) {
    let preview=$(".preview img")[0];
    preview.src = currentImage.src;
}

function wikiLoad(name,cb){
    $('#wiki').wikiblurb({
        page: name,
        type: 'blurb',
        removeLinks:true,
        callback: function(d){
            window.wd = d;
            if (cb) cb(d);
        }

    });
}

function loadProjectsFromList(projectNameList){
    projectNameList.forEach(function(n){
        loadProject(n);
    });
}

function loadProject(projectName){
    if (projectName.indexOf(' ') > -1) projectName = projectName.split(' ').join('_');
    _template( 'available.template' , {
        place:{
            parentSelector:'#latest_project',
            templateSelector: '.item_box',
            direct: true,
            projectName: projectName
        },
        events:{
            click:projectClickHandler
        }
    } );
}

let projectClickHandler = function(itemBox){
    let reference =  $(itemBox).attr('ref');
    $('<a href="projects.php?project='+reference+'">'+reference+'</a>')[0].click();
};


function show($elems){
    $elems.each(function(index,item){
        if ( $(item).css('display') === 'none' ) $(item).stop(true,true).show(200);
    });
}
function hide($elems){
    $elems.each(function(index,item){
        if ( $(item).css('display') !== 'none' ) $(item).stop(true,true).hide(200);
    });
}

function beginSearch(){
    let items = $('.item_box');
    if (searchFilter.val().length === 0) {
        show(items);
        return;
    }

    Array.from(items).forEach(function(itm){
        if ( $(itm).find('h3').text().toLowerCase().indexOf( searchFilter.val().toLowerCase() ) > -1 ){
            show($(itm));
        }
        else{
            let keyword = searchFilter.val().toLowerCase();
            let name = $(itm).attr('ref').toLowerCase().split(' ').join('_');

            console.log(name,keyword,window._template_cache[name].categories.join('|?|').toLowerCase().split('|?|').indexOf(keyword));


            if ( window._template_cache[name] === undefined ){
                hide($(itm));
            }
            else{
                let hasKeyword = window._template_cache[name].categories.join('|?|').toLowerCase().split('|?|').indexOf(keyword) > -1;

                if ( !hasKeyword ){
                    hide($(itm));
                }
                else{
                    show($(itm));
                }
            }
        }
    });
}

const filter = {
    /**
     * @return {string}
     */
    get Location(){

        return location.href.replace('//localhost:63342/','//3dpthings.com/');

    },
    trimStart(sentence,length=20){
        if (sentence.length > length){
            return '...' + sentence.substr( sentence.length - length, length );
        }
        else{
            return sentence
        }
    }
};
