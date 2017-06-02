
class lang_php extends Framework.Library {
    constructor() {
        super();
        this.sourcePath = "";

        let _This = this;
        this.__defineGetter__('source',function(){
            return _This.sourcePath;
        })
    }

    init() {


    }

    convert_getRequests(strCode){
        const regex = /\$_GET\[(.+?)]/g;

        return strCode.replace(regex,(fullmatch,innermatch)=>{
            return '$_get('+innermatch+')';
        });

    }

    convert_foreach(strCode){
        const regex = /foreach \((.+) as (.+)\)[ ]*{/g;

        return strCode.replace(regex,(fullmatch,arraymatch,namematch)=>{
            if (namematch.startsWith('&')) namematch = namematch.substr(1);
            return 'for (var xcxc in '+ arraymatch + ') {' +namematch+' = '+arraymatch+'[xcxc];';
        });
    }

    convert_echo(strCode){
        let regex = /echo((.|\s)+?)(?:;|$)/g;

        return strCode.replace(regex,(fullmatch,content)=>{

            return 'echo('+content+')';
        });
    }

    convert_varDeclaration(strCode){
        let regex = /(\$[^)\s_]*?)[ ]*=/g;

        return strCode.replace(regex,(fullmatch,content)=>{

            return 'var '+fullmatch;
        });
    }

    convert_dots(strCode){
        let regex = /(['](.+?)[']|["](.+?)["])/g; //to match all strings
        let matches = [];

        //remove strings
        strCode = strCode.replace(regex,(match)=>{
            matches.push(match);
            return '[catch{'+(matches.length-1)+'}catch]';
        });

        //change dots to pluses
        strCode = strCode.split('.').join('+');

        regex = /(\[catch{([0-9]+?)}catch])/g;
        strCode = strCode.replace(regex,(match,n,index)=>{
            return matches[parseInt(index)];
        });

        return strCode;
    }

    run(phpCode,spath){

        this.sourcePath = spath;

        phpCode = this.convert_getRequests(phpCode);
        phpCode = this.convert_foreach(phpCode);
        phpCode = this.convert_dots(phpCode);
        phpCode = this.convert_echo(phpCode);
        phpCode = this.convert_varDeclaration(phpCode);
        console.log(phpCode);

        console.log(eval(phpCode));

        return phpCode;
    }
}