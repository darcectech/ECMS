/**
 * Created by darylcecile on 03/06/2017.
 */

use.this = {
    log:function(...itms:string[]){

        let errId = (function() { // Public Domain/MIT
            let d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        })();

        fs.appendFileSync( path.join(__dirname,'setup','log_NS_host.log') , ` ERR${errId} > ${itms.join(' ; ')}\n` , 'utf8' );
        return errId;
    },
    rec:function(v:string){
        fs.appendFileSync( path.join(__dirname,'setup','log_monitor.log') , (new Date()).toString() + ' > ' + v + '\n' , 'utf8' );
    }
};

fs.closeSync(fs.openSync( path.join(__dirname,'setup','log_monitor.log') , 'w'));
fs.closeSync(fs.openSync( path.join(__dirname,'setup','log_NS_host.log') , 'w'));

fs.writeFileSync(path.join(__dirname,'setup','log_monitor.log'),'','utf8');

//get logged items and write them

preLogMonitor.forEach(function(inp){
    fs.appendFileSync( path.join(__dirname,'setup','log_monitor.log') , (new Date()).toString() + ' > ' + inp + '\n' , 'utf8' );
});

preLogMonitor = [];