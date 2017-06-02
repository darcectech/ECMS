

class nav extends Framework.Library{
    constructor(){
        super();

    }
    init(){
        const session = require('electron').remote.session;

        const filter = {
            urls: ['*.php','*.php?*','*.php&*']
        };

        session.fromPartition('view').webRequest.onBeforeRequest(filter, (details, callback) => {

            let querys = "";

            if (details.url.indexOf('.php') > -1 && details.url.indexOf('.php.html') === -1 && details.url.indexOf('file:') === 0 ){
                if (Internal.Storage) Internal.Storage.addr = details.url;
                function fix(u,withQUERY){
                    let v = u.split('%20').join(' ').split('file://').join('');
                    if (v.indexOf('?')>-1) {
                        querys = v.split('?')[1];
                        v = v.split('?')[0];
                    }
                    if (withQUERY === true){
                        v = v + '?'+querys;
                    }
                    return v;
                }

                let fs = require('fs');

                let fileContent = fs.readFileSync(fix(details.url),'utf8');

                fileContent = fileContent.split('<?php').join('<php-code> <!-- <?php').split('?>').join('?> --> </php-code>');

                fileContent = nav.parsePHP(fileContent,fix(details.url));

                let newPath = fix(details.url)+'.html';
                fs.writeFileSync(newPath,fileContent,'utf8');

                newPath = path.join('file://',newPath+'?'+querys);
                console.log(newPath);
                callback({redirectURL:newPath});

                document.querySelector('webview').insertCSS(' php-code { visibility: hidden; } ')
            }
            else{
                callback({cancel: false});
            }
        });
        console.log('setup');
    }
    static parsePHP(fullHTMLPhp,sourcepath){

        let regex = /<!-- <\?php((.|\s)+?)\?> -->/gm;
        let m;

        while ((m = regex.exec(fullHTMLPhp)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            let pairingA = [];
            let pairingB = [];
            m.forEach((match, groupIndex) => {
                if (groupIndex === 1){
                    pairingB.push(match); //insides
                }
                else if (groupIndex === 0){
                    pairingA.push(match)
                }
            });

            for (let i = 0 ; i < pairingA.length ; i++){

                let newcode =  nav.transform(pairingB[i],sourcepath);

                fullHTMLPhp = fullHTMLPhp.split( pairingA[i] ).join( newcode );

            }
        }


        fullHTMLPhp = nav.execPhp(fullHTMLPhp);

        return fullHTMLPhp;
    }
    static transform(bod='echo "Hello World"',fpath){

        let t_php = language.handler.php;

        return t_php.run(bod,fpath);
    }

    static execPhp(strCode){

        const regex = /<php-code>([^]+?)<\/php-code>/g;

        return strCode.replace(regex,(fullmatch,innerCode)=>{
            Internal.Storage.echoed = [];
            console.warn( eval(innerCode) );
            if (!Internal.Storage.echoed) console.log( Internal.Storage.echoed );
            return Internal.Storage.echoed.join('')
        });

    }
}
