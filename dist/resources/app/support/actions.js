
function populateFilesList(){

    let listOfFiles = documents( path.join(__dirname,'website','projects') ).getAll();

    setPath(path.join(__dirname,'website','projects'));

    listOfFiles.forEach(function(paths){
        let fileName = paths;
        let filePath = path.join(__dirname,'website','projects',paths);

        let files = $('#files table');
        files.append( '<tr> <td row1>'+fileName+'</td> <td row2><button onclick="loadProject(\''+fileName+'\')">Edit</button></td><td row3><button onclick="deleteProject(\''+fileName+'\')">Delete</button></td> </tr>' );
    });


    $('.dropZone').hide(300);
}

function setPath(pathx){
    $('#path').empty();
    let list = pathx.split(path.sep);
    list.shift();
    let madePath = "";

    $('#path').append('<span sep>'+path.sep+'</span>');
    madePath += path.sep;

    list.forEach(function(t){
        madePath += t;
        $('#path').append('<span onclick="openPage(\''+madePath+'\')" ham>'+t+'</span>');
        madePath += path.sep;
        $('#path').append('<span onclick="openPage(\''+madePath+'\')" sep>'+path.sep+'</span>');
    });
}

function openPage(loc){
    let res = require('electron').shell.showItemInFolder( path.resolve(loc) );
    if (res === false){
        alert('Failed to show file in your File explorer');
    }
}

window.stores = {};

window.propertyFormat = {
    "name":"<STRING>",
    "customizable":"<BOOLEAN>",
    "categories":"<LIST>",
    "reference":"<INT>",
    "description":"<STRING>",
    "price":"<COST>",
    "images":"<LIST>",
    "video":"<LIST>",
    "guide":"<STRING>",
    "file":"<STRING>",
    "buzz":"<STRING>",
    "thingiverse":"<STRING>"
};

function setUpClickRouter(){

    // fileselect.addEventListener("change", fileDropped, false);
    $('.dropZone')[0].addEventListener("dragover", FileDragHover, false);
    $('.dropZone')[0].addEventListener("dragleave", FileDragHover, false);
    $('.dropZone')[0].addEventListener("drop", fileDropped, false);

    window.hooks = {};

    window.hooks.Apply = function(){
        saveProperty();
    };

    window.hooks.Command = toggleCommand;

    window.hooks.Cancel = function(){
        window.stores = {};

        $('[conditional]').hide(300);
        $('.creator').empty();
        $('.dropZone').hide(300);

        window.hooks.refresh();
    };

    window.hooks.Finder = function(){
        let res = require('electron').shell.showItemInFolder( path.join(__dirname,'website','index.html') );
        if (res === false){
            alert('Failed to show file in your File explorer');
        }
    };

    window.hooks.New = function(){
        setUpCreatorUI();
        $('[conditional]').show(300);
    };

    window.hooks.refresh = function(){
        $('#files table').empty();
        populateFilesList();
    };

    $('body').on('click','span[hook]',function(){

        let fn = window.hooks[ $(this).attr('hook') ];
        if (fn) fn();

    });

}

function setUpCreatorUI(){
    $('.creator').empty();
    $('.dropZone').show(300);
    $('<h2 style="width: 100%;text-align: center">Project Editor</h2>').appendTo('.creator');
    $('<table>').appendTo( $('.creator') );
    $('<tr> <td>Name:</td> <td> <input type="text" class="textbox" property="name"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Customizable:</td> <td> <input placeholder="false" type="text" class="textbox" property="customizable"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Reference:</td> <td> <input placeholder="'+ ( documents( path.join(__dirname,'website','projects') ).getCount() - 1 ) +'" type="text" class="textbox" property="reference"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Description:</td> <td> <input type="text" class="textbox" property="description"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Price:</td> <td> <input placeholder="£0.00" type="text" class="textbox" property="price"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Tip:</td> <td> <input type="text" class="textbox" property="guide"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Also known as:</td> <td> <input type="text" class="textbox" property="aka"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Thingiverse code:</td> <td> <input type="text" class="textbox" property="thing"> </td> </tr>').appendTo( $('.creator table') );
    $('<tr> <td>Files: </td> <td class="fileCount"> 0 </td> </tr>').appendTo('.creator table');
}

function deleteProject(projectName){

    res = confirm('You are about to Delete ' + projectName + '!' );

    if (res === false) return;

    let properties = documents().getJSON(projectName.split('.')[0]);

    try{
        fs.unlinkSync( path.join(__dirname,'website','projects',projectName) );
    } catch(a){
        alert('Failed to delete this project. Please try removing it manually');
    }

    alert('Dont forget to backup or delete the project files from the "Website/Others" folder!');

    window.hooks.refresh();
}

function loadProject(name){
    setUpCreatorUI();

    name = name.split('.')[0];

    let props = documents().getJSON(name);

    $('.textbox[property=name]').val(props.name);
    $('.textbox[property=customizable]').val( props.customizable.toString() );
    window.stores['categories'] = props.categories;
    $('.textbox[property=reference]').val( props.reference );
    $('.textbox[property=description]').val(props.description);
    $('.textbox[property=price]').val( props.price );
    window.stores['images'] = props.images;
    window.stores['videos'] = props.video;
    $('.textbox[property=guide]').val(props.guide);

    $('.textbox[property=aka]').val(props.buzz);
    $('.textbox[property=thing]').val(props.thingiverse);

    $('.fileCount').text( props.images.length + props.video.length );

    $('[conditional]').show(300);
}


function saveProperty(){
    let prop = {};
    //language=JQuery-CSS
    prop.name = $('.textbox[property=name]').val();
    prop.customizable = ( $('.textbox[property=customizable]').val() || false );
    prop.categories = ( window.stores['categories'] || []);
    prop.reference = ( $('.textbox[property=reference]').val() || ( documents( path.join(__dirname,'website','projects') ).getCount() - 1 ) );
    prop.description = $('.textbox[property=description]').val();
    prop.price = ( $('.textbox[property=price]').val() || "£0.00");
    prop.images = ( window.stores['images'] || []);
    prop.video = ( window.stores['videos'] || []);
    prop.guide = $('.textbox[property=guide]').val();
    prop.file = prop.name.split(' ').join('_').toLowerCase();
    prop.buzz = $('.textbox[property=aka]').val();
    prop.thingiverse = $('.textbox[property=thing]').val();

    let othersFolder = path.join(__dirname,'website','other',prop.file);

    if (!fs.existsSync(othersFolder)){
        fs.mkdirSync(othersFolder);
    }

    documents( path.join(__dirname,'website','projects',prop.file+'.json') ).write(JSON.stringify(prop));

    window.stores = {};

    $('[conditional]').hide(300);
    $('.creator').empty();

    window.hooks.refresh();

    $('.dropZone').hide(300);
}

function fileDropped(e){
    e.stopPropagation();
    e.preventDefault();

    // fetch FileList object
    let files = e.target.files || e.dataTransfer.files;

    let current = $('.textbox[property=name]').val().split(' ').join('_').toLowerCase();

    if (current.length < 3){
        alert('Unable to filter the files that were dropped! Make sure you are working on an active project.');
        return;
    }
    // process all File objects
    for (let i = 0, f; f = files[i]; i++) {

        if ( f.type.toLowerCase().indexOf("image") > -1 ){

            if ( window.stores['images'] === undefined ) window.stores['images'] = [];
            window.stores['images'].push(f.name);
            documents( path.resolve(f.path) ).copyFile( path.join(__dirname,'website','images',f.name) );

        }
        else{

            if (!fs.existsSync( path.join(__dirname,'website','other',current) )){
                fs.mkdirSync( path.join(__dirname,'website','other',current) );
            }

            documents( path.resolve(f.path) ).copyFile( path.join(__dirname,'website','other',current,f.name) );

        }

    }

    alert('Files for this project were successfully added!');

}

function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type === "dragover" ? "dropZone hover" : "dropZone");
}

populateFilesList();
setUpClickRouter();

$(document).on({
    dragover: function() {
        return false;
    },
    drop: function() {
        return false;
    }
});

function noProject(){

    if ( documents( path.join(__dirname,'website') ).getCount() === 0 ){

        if ( $('.overlay[noProject]').length === 0 ){
            $('<div class="overlay" noProject> <div class="dialog"> The Website Folder is empty, Please add files to the folder to continue </div> </div>').appendTo('main');
        }

        setTimeout(noProject,1500);
    }

}

function toggleCommand(){

    cmd = $('.overlay[cmd]');

    if (cmd.length === 0){
        $('<div class="overlay" cmd> <div class="dialog cmd"> <smart-box></smart-box> </div> </div>').appendTo('main');

        setTimeout(function(){
            let sb = $('textarea')[0].fandango;
            sb.element.value += 'SmartBox 2.0 : 2017\n';
            sb.element.setLockedArea(0,19);
            sb.element.focus();
        },1000);
    }
    else{
        cmd.remove();
    }

}

$('[conditional]').hide(300);

noProject();


function fandango_element(name,realName,targetClass){

    setInterval(function(){

        if ( $(name).length > 0 ){

            let newElement = $('<'+realName+'></'+realName+'>');
            $(name).replaceWith(newElement);

            let r = new targetClass(newElement[0]);
            newElement[0].fandango = r;

        }

    },100);

}

fandango_element('smart-box','textarea',SmartBox);

$('<div class="frost overlay"> <h2 style="pointer-events: none">Loading. . .</h2> </div>').appendTo('main');
setTimeout(function(){
    $('.overlay.frost').hide(300,function(){
        $(this).remove();
    })
},3000);

MonkeyPatcher.requestPatch('patch.update.check',function(endOfPatch){
    console.log('Checking for updates. . .');
    endOfPatch();
},function(id){
    console.log('Check for updates Completed!');
});