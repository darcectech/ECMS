/**
 * Created by darylcecile on 12/06/2017.
 */

use.this = {
    beginUpdate:function(fn){

        let foldersToGet = ['css','lib','licenses','NSActivePages','NSCore','NSCoreUI'];

        let completedCount = 0;

        let svnUltimate = require('node-svn-ultimate');

        takeNote('Update started');

        let loop = setInterval(function(){

            if (completedCount >= foldersToGet.length){
                clearInterval(loop);
                takeNote('Update Complete');
                fn();
            }

        },500);

        foldersToGet.forEach(function(folder){

            takeNote(`Update for ${folder} started!`);
            svnUltimate.commands.checkout( 'https://github.com/darcectech/ECMS/trunk/dist/resources/app/'+folder , path.join(__dirname,folder), function( err ) {
                takeNote(`Update attempt for ${folder}. Success? ${(err !== undefined).toString()}`);
                completedCount ++;
            } );

        });


    },
    convertUpdateToNumeric:function(version:string,service:string){

        let p1,p2,p3,prts;
        prts = version.split('.');
        p1 = prts[0].toString();
        p2 = prts[1].toString();
        p3 = prts[2].toString();
        prts = [p1,p2,p3];

        prts.forEach(function(p,i){
            while (p.length < 3){
                prts[i] = '0' + prts[i];
                p = prts[i];
            }
        });

        return Number.parseInt(prts.join('') + service)

    }
};