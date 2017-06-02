/**
 * Created by darylcecile on 23/05/2017.
 *
 * About:
 *  Provides an interface to interact and load namespaced libraries
 *
 */


/** @namespace Framework */
const Framework = {};
const Internal = {};
const fs = require('fs');
const path = require('path');

Internal.Storage = {};

Internal.Storage.State = {};

Framework.register = function(namespace){

    if (!Internal.Storage.Frameworks) Internal.Storage.Frameworks = {};

    if (Internal.Storage.Frameworks[namespace] !== undefined){
        throw "Namespace conflict error! This namespace has already been claimed: "+namespace;
    }
    else{

        let script_content = fs.readFileSync( path.resolve(path.join('Library',namespace,'root.js') ), 'utf8' );

        console.log( (new Function(script_content))() );

    }

};

Framework.expose = function(namespace,setupFnc){
    let tool = {};
    tool.define = function(stub,filename){
        let script_content = fs.readFileSync( path.join('Library',namespace,filename) , 'utf8' );
        Internal.Storage.Frameworks[namespace][stub] = (new Function('return (new ('+ script_content+ '))' ))();
        Framework.CreateNS(namespace+'.'+stub,Internal.Storage.Frameworks[namespace][stub]);
    };
    tool.dependency = function(namespace){
        let ns = namespace.split('.')[0] + '.' + namespace.split('.')[1].split('.')[0];
        let fl = namespace.substr(ns.length+1).split('.').join('/');
        let script_content = fs.readFileSync( path.join('Library',ns,fl+'.js') , 'utf8' );
        Framework.CreateNS(namespace,eval(script_content));
    };
    if (!Internal.Storage.Frameworks[namespace]) Internal.Storage.Frameworks[namespace] = {};
    let res = setupFnc(tool);
    if (res.unload) Internal.Storage.Frameworks[namespace]['unload'] = res.unload;
};

Framework.unload = function(namespace){
    Internal.Storage.Frameworks[namespace].unload();
};

Framework.reload = function(namespace){
    Framework.unload(namespace);
    Framework.register(namespace);
};

Framework.Library = class{
    constructor(){
       this.init();
    }
    init(){}
};

Framework.CreateNS = function (namespace,hook) {
    let nsparts = namespace.split(".");
    let parent = window;

    // we want to be able to include or exclude the root namespace so we strip
    // it if it's in the namespace
    if (nsparts[0] === "window") {
        nsparts = nsparts.slice(1);
    }

    // loop through the parts and create a nested namespace if necessary
    for (let i = 0; i < nsparts.length; i++) {
        let partname = nsparts[i];
        // check if the current parent already has the namespace declared
        // if it isn't, then create it
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }

        // get a reference to the deepest element in the hierarchy so far
        if (i === nsparts.length-1 && hook !== undefined){
            parent[partname] = hook;
        }
        parent = parent[partname];
    }
    // the parent is now constructed with empty namespaces and can be used.
    // we return the outermost namespace

};