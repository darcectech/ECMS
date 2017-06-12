/**
 * Created by darylcecile on 02/06/2017.
 */

/// <reference path="../node_modules/@types/jquery/index.d.ts" />


window['allowedDirectories'] = [`${__dirname}/setup`,`${__dirname}/node_modules`];

const _PRIV_fs = require('fs');
const path = require('path');
const remote = require('electron').remote;

let enableProxies = false;


const fs =_PRIV_fs; //proxyFS(_PRIV_fs);//_PRIV_fs;

fs['readFileSync'] = proxyFS_Read(fs['readFileSync']);



delete window['proxyFS'];

const VERSION = {
    NAME:'Lima',
    NUMBER:'1.0.12',
    SERVICE:'3'
};

let SETUP_INFO = fs.readFileSync( path.join(__dirname,'setup/NSinfo.json'),'utf8');

let filesToSetup = [
    'NSLogger',
    'NSNavigator',
    'NSTransitioner',
    'NSVisualProvider',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/js/materialize.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js',
    'register:dash'
];

let preLogMonitor = [];

if ( JSON.parse(SETUP_INFO).core.dev === "true" ){
    remote.getCurrentWindow().toggleDevTools();
}

const takeNote = function(note:string){
    if (!global['NSLogger']) preLogMonitor.push(note);
    else global['NSLogger']['rec'](note);
};

interface ModuleObjects extends Function{
    [props:string]:any,
    dependencies?:Array<{
        queryName:string,
        depUrl:string
    }>,
    options?:any
}

interface DependencyPack extends Array<any>{
    queryName:string,
    depUrl:string
}

takeNote('create "use" object');

const use:ModuleObjects = function use(moduleName){

    takeNote(`attempting to use module "${moduleName}"`);

    if (moduleName.indexOf('http://') === 0 || moduleName.indexOf('https://') === 0){

        $.getScript(moduleName, function( data:string, textStatus:string, jqxhr:JQueryXHR ) {
            console.log( data ); // Data returned
            console.log( textStatus ); // Success
            console.log( jqxhr.status ); // 200
            console.log( "Load was performed." );
            if (jqxhr.status === 200){
                try{
                    eval(data);
                }
                catch (s){}
            }
        });

        return;
    }

    let places:Array<string> = JSON.parse( SETUP_INFO ).NSNavigator.moduleFolders;

    let moduleFileContent:string = "";

    places.some(function(folder:string){

        if ( fs.existsSync( path.join(__dirname,folder,moduleName+'.js') ) ){
            moduleFileContent = fs.readFileSync( path.join(__dirname,folder,moduleName+'.js') , 'utf8' );
            return true;
        }

    });

    let plainObject = {
        _module:null,
        _options:null,
        _dependencies:null
    };
    Object.defineProperty(plainObject,'this',{
        set (z){
            plainObject._module = z
        }
    });
    Object.defineProperty(plainObject,'dependencies',{
        set (z:Array<DependencyPack>){
            plainObject._dependencies = z;
            z.forEach(function(s:DependencyPack){
                if ( global[s.queryName] === undefined ){
                    use(s.depUrl);
                }
            })
        }
    });

    let fnc = (new Function('use',moduleFileContent))(plainObject);

    if (plainObject._module !== null){
        return plainObject._module
    }
    else{
        return fnc
    }

};


const NSCore = {
    use:use
};

takeNote('creating "this" in "use" object');

Object.defineProperty(use,'this',{
    set (v){
        console.warn('Only call use.this to load usable modules');
    },
    get (){
        return undefined;
    }
});


takeNote('creating "page" in "use" object');

Object.defineProperty(use,'page',{
    set (v){
        pages[lastModuleName] = v;
    },
    get (){
        return function(name){

            let pageContent = fs.readFileSync( path.join(__dirname,'NSActivePages',name+'.js') , 'utf8' );

            eval(pageContent);

        }
    }
});

interface VPElements{
    [prop:string]:VPElement
}

interface VPElement extends Element{
    changeData?(eName:string,dataName:string,newValue:any):any,
    target?(eName:string):HTMLElement|Element|null
}

const pages:any = {};
const controls:VPElements = {};

let lastModuleName = '';
let prog_start = 0;

const closeRequested = function(){
    takeNote('closeRequested');
    remote.BrowserWindow.getFocusedWindow().close();
};

const maxRequested = function(){

    takeNote('maxRequested');

    if ( remote.BrowserWindow.getFocusedWindow().isMaximized() ){
        remote.BrowserWindow.getFocusedWindow().unmaximize();
    }
    else{
        remote.BrowserWindow.getFocusedWindow().maximize();
    }

};

const minRequested = function(){

    takeNote('minRequested');
    remote.BrowserWindow.getFocusedWindow().minimize();
};

const devToolsRequested = function(){

    remote.BrowserWindow.getFocusedWindow().openDevTools()

};

window.addEventListener('onerror',function(e:ErrorEvent){
    try{
        let errId = global['NSLogger']['log'](`${e.message} in ${e.filename}[${e.lineno}:${e.colno}]`);
        takeNote(`Error! Check ${errId}`);
    }
    catch(ex){
        takeNote(`Error! Could not file error: 
                ${e.message} in ${e.filename}[${e.lineno}:${e.colno}]
                
                {failed to file error because ${ex.toString()}}
                `);
    }
});

const chokidar = require('chokidar');

class WatchSession{
    public fileBeingWatched:string = "";
    public watcher:any;
    constructor(fileToWatch){
        this.fileBeingWatched = fileToWatch;
    }
    startWatching(onChange){
        this.watcher = chokidar.watch(this.fileBeingWatched);
        this.watcher.on('change', onChange)
    }
    endAndDispose(){
        this.watcher.close()
    }
}

let deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

let loadScript = function(file:string,isLocal:boolean=true){

    return new Promise((resolve,reject)=>{

        takeNote(`setting up "${file}".`);

        if (isLocal===true){
            if (file.indexOf('register:')===0){
                try{
                    file = file.split(':')[1];
                    lastModuleName = file;
                    use.page(file);
                    lastModuleName = '';
                    resolve();
                }
                catch(s){
                    reject(s);
                }
            }
            else{
                try{
                    global[file] = use(file);
                    resolve();
                }
                catch (s){
                    reject(s);
                }
            }
        }
        else{
            $.getScript(file,(script, textStatus, jqXHR)=>{
                if (textStatus.indexOf('timeout') > -1 || textStatus.indexOf('error') > -1){
                    reject(textStatus);
                }
                else{
                    resolve(textStatus);
                }
            });
        }

    });
};

let progressIncrementAmount = -1;
let fileToSetup_PointerIndex = 0;

let getProgressIncrement = function () {
    if (progressIncrementAmount === -1){
        let p = $(".progressbar");
        let pw = (p.width() / 100) * (100 / filesToSetup.length);
        progressIncrementAmount = pw;
        return pw;
    }
    else{
        return progressIncrementAmount;
    }
};

let incrementProgress = function(){
    let p = $(".progressbar");
    let pb = p.find('.bar');
    prog_start += getProgressIncrement();
    pb.width( prog_start );
};

let nextScript = function(){
    incrementProgress();
    if (fileToSetup_PointerIndex === filesToSetup.length){
        //finished
        enableProxies = true;

        global['NSNavigator']['goto']('dash',function(){
            pages.dash.main();
        });
    }
    else{
        let scriptToLoad = filesToSetup[fileToSetup_PointerIndex];
        loadScript(scriptToLoad,(scriptToLoad.indexOf('http') !== 0)).then(function(){
            nextScript(); // succeed
        },function() {
            takeNote('Failed to load a script. Skipping. . .');
            nextScript(); // failed
        });

        remote.getCurrentWindow().openDevTools();

        fileToSetup_PointerIndex++;
    }
};

nextScript();

// window.onload = function(){
//     takeNote('onload');
//     setTimeout(()=>{
//         filesToSetup.forEach(function(file){
//
//             takeNote(`setting up "${file}".`);
//
//             if (file.indexOf('register:')===0){
//                 file = file.split(':')[1];
//                 lastModuleName = file;
//                 use.page(file);
//                 lastModuleName = '';
//             }
//             else{
//                 global[file] = use(file);
//             }
//             let p = $(".progressbar");
//             let pw = (p.width() / 100) * (100 / filesToSetup.length);
//             let pb = p.find('.bar');
//             prog_start += pw;
//             pb.width( prog_start );
//         });
//
//         setTimeout(function(){
//             global['NSNavigator']['goto']('dash',function(){
//                 pages.dash.main();
//             });
//         },10);
//         window.onload = null;
//     },1000);
// };

function proxyFS_Read(obj){
    return new Proxy(obj,{
        apply: function(target, name, argumentsList) {

            let rawURI = argumentsList[0];
            let formattedURI = filterRequest(argumentsList[0]);

            if (rawURI === formattedURI){
                return target.apply(name,argumentsList);
            }
            else{
                if (enableProxies === true){
                    jQuery.ajaxSetup({async:false});
                    console.log(0,formattedURI);
                    let v =  $.get(formattedURI).responseText;
                    jQuery.ajaxSetup({async:true});
                    return v;
                }
                else{
                    return target.apply(name,argumentsList);
                }
            }

        }
    });
}


function filterRequest(requestedPath:string):string{

    let isencoded = (requestedPath !== decodeURIComponent(requestedPath));

    requestedPath = decodeURIComponent(requestedPath);

    if (requestedPath.indexOf(window['allowedDirectories'][0]) > -1 || requestedPath.indexOf(window['allowedDirectories'][1]) > -1){
        if (isencoded) {
            return encodeURIComponent(requestedPath);
        }
        else{
            return requestedPath;
        }
    }
    else{
        if (isencoded){
            return encodeURIComponent(requestedPath.replace(__dirname,'https://raw.githubusercontent.com/darcectech/ECMS/master/dist/resources/app') );
        }
        else{
            return (requestedPath.replace(__dirname,'https://raw.githubusercontent.com/darcectech/ECMS/master/dist/resources/app') );
        }
    }
}