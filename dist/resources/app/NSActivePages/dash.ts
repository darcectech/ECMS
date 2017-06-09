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

        controls.dashboard.target('services_button').addEventListener('click',function(){

            if ( $('#services').length > 0 ) return;

            $('.page').empty();

            lastModuleName = 'services';
            use.page('services');
            lastModuleName = '';

            use('NSNavigator').changePage('services',function(){
                pages.services.main();
            },'.page');

        });

        controls.dashboard.target('settings_button').addEventListener('click',function(){

            if ( $('#settings').length > 0 ) return;

            $('.page').empty();

            lastModuleName = 'settings';
            use.page('settings');
            lastModuleName = '';

            use('NSNavigator').changePage('settings',function(){
                pages.settings.main();
            },'.page');

        });

        controls.dashboard.target('maintenance_button').addEventListener('click',function(){

            if ( $('#maintenance').length > 0 ) return;

            $('.page').empty();

            lastModuleName = 'maintenance';
            use.page('maintenance');
            lastModuleName = '';

            use('NSNavigator').changePage('maintenance',function(){
                pages.maintenance.main();
            },'.page');

        });

        controls.dashboard.target('lincenses_button').addEventListener('click',function(){

            if ( $('#licenses').length > 0 ) return;

            $('.page').empty();

            lastModuleName = 'licenses';
            use.page('licenses');
            lastModuleName = '';

            use('NSNavigator').changePage('licenses',function(){
                pages.licenses.main();
            },'.page');

        });

        //updates_button

        controls.dashboard.target('updates_button').addEventListener('click',function(){

            $('.page').empty();

            Materialize.toast('Checking for updates. . .',5000);



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