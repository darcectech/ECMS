/**
 * Created by darylcecile on 02/06/2017.
 */

use.this = {
    goto:function(page,fn,bod='body'){
        takeNote(`navigating to ${page}, callback provided: ${fn !== undefined}`);
        let pContent = fs.readFileSync( path.join(__dirname,'NSCoreUI',page+'._') , 'utf8' );

        let NSTransitioner = global['NSTransitioner']; // fallback incase module wasnt loaded


        NSTransitioner.fadeUI(()=>{
            $(bod)[0].innerHTML = pContent;
            NSTransitioner.fadeInUI(fn);

            takeNote(`navigation complete`);
        });

    },
    changePage:function(pageName,fn,bod='.page'){

        takeNote(`changing page to to ${pageName}, callback provided: ${fn !== undefined}. `);
        let pContent = fs.readFileSync( path.join(__dirname,'NSCoreUI',pageName+'._') , 'utf8' );

        let NSTransitioner = global['NSTransitioner']; // fallback incase module wasnt loaded


        NSTransitioner.fadeUI(()=>{
            $(bod)[0].innerHTML = pContent;

            $('script',bod).each(function(i,a){
                console.log(a.innerHTML);
                eval.call(a,a.innerHTML);
                $(a).remove();
            });

            $('require',bod).each(function(i,a){
                let t = a.getAttribute('type');
                let s = a.getAttribute('source');

                if (t.toLowerCase() === 'style'){
                    NSCore.use('NSVisualProvider').injectStyleSheet(s,'#fileexplorer');
                }
            });
            NSTransitioner.fadeInUI(fn,bod);

            takeNote(`changePage complete`);
        },bod);


    }
};

use.dependencies = [{
    queryName:'NSTransitioner',
    depUrl:'NSTransitioner'
}];