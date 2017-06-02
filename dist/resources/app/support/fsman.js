

const fs = require('fs');
const path = require('path');

function GetFileContent(filePath){
    return fs.readFileSync(filePath,'utf8');
}

function documents(filePath){

    return {
        write : function(content){
            fs.writeFileSync(filePath,content,'utf8');
        },
        read : function(){
            return fs.readFileSync(filePath,'utf8');
        },
        createFile : function(){
            fs.writeFileSync(filePath,'','utf8');
        },
        exists : function(){
            return fs.existsSync(filePath);
        },
        getAll : function(){
            return fs.readdirSync(filePath);
        },
        getCount : function(){
            return fs.readdirSync(filePath).length;
        },
        getJSON : function(name){
            name = (filePath || name || "baby_box");
            return JSON.parse(documents(path.join(__dirname, 'website', 'projects', name + '.json')).read());
        },
        copyFile : function(target) {
            let source = filePath;
            fs.writeFileSync(target, fs.readFileSync(source));
    }
    }

}