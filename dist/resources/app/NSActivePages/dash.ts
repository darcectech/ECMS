/**
 * Created by darylcecile on 03/06/2017.
 */


use.page = {
    main: function(){
        console.log('dash page called main');

        $('body').css('background','transparent');

        global['NSVisualProvider']['setComponent']('toolbar',document.body);

        controls.toolbar.changeData('title','innerHTML','Source<span style="font-weight: 300">Xero</span>');

        controls.toolbar.addEventListener("ondblclick",function(){
            maxRequested();
        });

        controls.toolbar.target('searchbar').addEventListener('focusin',function(){
            $('#dashboard').addClass('active').addClass('searching');
        });

        controls.toolbar.target('searchbar').addEventListener('focusout',function(){
            $('#dashboard').removeClass('active').removeClass('searching');
            $('#search').removeClass('size');
        });

        global['NSVisualProvider']['setComponent']('statusbar',document.body);
        global['NSVisualProvider']['setComponent']('dashboard',document.body);

        controls.statusbar.changeData('status','innerHTML',`v${VERSION.NUMBER} - ${VERSION.SERVICE}`);

        global['toggleMenu'] = function(){
            $('#dashboard').toggleClass('active');
            $('#search').toggleClass('size');
        };

        controls.dashboard.target('files_button').addEventListener('click',function(){

            if ( $('#fileexplorer').length > 0 ) return;

            $('.page').empty();

            lastModuleName = 'fileexplorer';
            use.page('fileexplorer');
            lastModuleName = '';

            global['NSNavigator']['changePage']('fileexplorer',function(){
                pages.fileexplorer.main();
            },'.page');

        });

        let Mousetrap = require('mousetrap');
        Mousetrap.bind("#", function() { (<HTMLElement>controls.toolbar.target('searchbar')).focus() });
        Mousetrap.bind("f i n d", function() { (<HTMLElement>controls.toolbar.target('searchbar')).focus() });
        Mousetrap.bind("/", function() { (<HTMLElement>controls.toolbar.target('searchbar')).focus() });

        Mousetrap.bind("?", function() { alert('Help could not be opened') });
        Mousetrap.bind("h e l p", function() { alert('Help could not be opened') });

        Mousetrap.bind(['command+k', 'ctrl+k'],function(){
            (<HTMLElement>controls.dashboard.target('files_button')).click()
        });
    }
};