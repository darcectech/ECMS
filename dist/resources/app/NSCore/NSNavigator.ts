/**
 * Created by darylcecile on 02/06/2017.
 */

use.this = {
    goto:function(page,fn){
        takeNote(`navigating to ${page}, callback provided: ${fn !== undefined}`);
        let pContent = fs.readFileSync( path.join('NSCoreUI',page+'._') , 'utf8' );

        let NSTransitioner = global['NSTransitioner']; // fallback incase module wasnt loaded


        NSTransitioner.fadeUI(()=>{
            $('body')[0].innerHTML = pContent;
            NSTransitioner.fadeInUI(fn);

            takeNote(`navigation complete`);
        });

    }
};

use.dependencies = [{
    queryName:'NSTransitioner',
    depUrl:'NSTransitioner'
}];