/**
 * Created by darylcecile on 03/06/2017.
 */


use.page = {
    main: function(){
        console.log('dash page called main');

        global['NSVisualProvider']['setComponent']('toolbar',document.body);

        controls.toolbar.changeData('title','innerHTML','ECMS - Dash');

        controls.toolbar.addEventListener("ondblclick",function(){
            maxRequested();
        });

        global['NSVisualProvider']['setComponent']('statusbar',document.body);
        global['NSVisualProvider']['setComponent']('dashboard',document.body);

        controls.statusbar.changeData('status','innerHTML','ready');

        global['toggleMenu'] = function(){
            $('#dashboard').toggleClass('active');

        }
    }
};