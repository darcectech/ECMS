
/** @namespace language.handler.php */
_this = language.handler.php;

window.strncmp = function(wA,wB,len){
    let workwithA = wA.substr(0,len);
    let workwithB = wB.substr(0,len);
    return workwithA.indexOf(workwithB);
};

window.strlen = function(str){
    return str.length;
};

window.floor = Math.floor;
window.log = Math.log;
window.pow = Math.pow;
window.array = function(...num){
    return num;
};

window.filesize = function(fpath){
    const fs = require("fs"),
        path = require("path");
    let newPath = fpath;
    if (path.isAbsolute(newPath) === false) newPath = path.join( path.dirname(_this.source) , fpath );
    const stats = fs.statSync(newPath);
    return stats.size;
};

window.$_get = function(itm){

    let loc = Internal.Storage.addr;
    let vars = loc.split('?')[1];

    if (vars.indexOf('&')>-1){
        vars = vars.split('&');
    }
    else{
        vars = [vars];
    }

    let val = {};

    vars.forEach(function(v){
        val[v.split('=')[0]] = v.split('=')[1]
    });

    return val[itm];
};

window.scandir = function(fpath){
    let fs = require('fs'),
        path = require('path');
    let newPath = fpath;
    if (path.isAbsolute(newPath) === false) newPath = path.join( path.dirname(_this.source) , fpath );
    let m = fs.readdirSync(newPath);
    return m;
};

window.number_format = function(n,c, d, t){

    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? "." : d;
    t = t === undefined ? "," : t;
    let s = n < 0 ? "-" : "";
    let i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    let j = 0;
    j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

window.startsWithChar = function(chr,w){
    return (w.startsWith(chr));
};

window.echo = function(content){
    if (!Internal.Storage.echoed) Internal.Storage.echoed = [];
    console.info ('adding',content);
    Internal.Storage.echoed.push(content);
};

window.empty = function(v){
    return (v === undefined || v === "")
};