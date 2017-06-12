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

        controls.dashboard.target('metrics_button').addEventListener('click',function(){

            if ( $('#metrics').length > 0 ) return;

            $('.page').empty();

            lastModuleName = 'metrics';
            use.page('metrics');
            lastModuleName = '';

            use('NSNavigator').changePage('metrics',function(){
                pages.metrics.main();
            },'.page');

        });
        //updates_button

        let Mousetrap = require('mousetrap');
        Mousetrap.bind("#", function() { (<HTMLElement>controls.toolbar.target('searchbar')).focus() });
        Mousetrap.bind("f i n d", function() { (<HTMLElement>controls.toolbar.target('searchbar')).focus() });
        Mousetrap.bind("/", function() { (<HTMLElement>controls.toolbar.target('searchbar')).focus() });

        Mousetrap.bind("?", function() { alert('Help could not be opened') });
        Mousetrap.bind("h e l p", function() { alert('Help could not be opened') });

        Mousetrap.bind(['command+k', 'ctrl+k'],function(){
            (<HTMLElement>controls.dashboard.target('files_button')).click()
        });


        let manifest = JSON.parse( fs.readFileSync( path.join(__dirname,'manifest.json') , 'utf8' ) );

        let expDate = new Date(VERSION.EXPIRE).getTime() / 1000;
        let nowDate = Date.now() / 1000;

        let updatorObject = NSCore.use('NSUpdator');

        let localVersion = updatorObject.convertUpdateToNumeric(VERSION.NUMBER,VERSION.SERVICE);
        let remoteVersion = updatorObject.convertUpdateToNumeric(manifest.Number,manifest.Service);

        console.log('remote',remoteVersion);
        console.log('local',localVersion);
        console.log('exp',expDate);
        console.log('now',nowDate);

        if (nowDate >= expDate && remoteVersion > localVersion){
            Materialize.toast('Packages out of date',2000);

            NSCore.use('NSModal').showModal({
                header:"An update is available",
                message:`
                    This update can take up to 10min, and should not be interupted!
                    Would you like to install the update?
                    
                    (We will let you know when it is done)
                    `,
                yes:{
                    text:"Yes",fn:function(){}
                },
                no:{
                    text:"Nope",fn:function(){}
                }
            }).then(function(v){

                if (v===true) updatorObject.beginUpdate(function(){
                    NSCore.use('NSModal').showModal({
                        header:"Update Complete!",
                        message:`
                    The update process has completed! Next time you open this program, you will be using the latest version.
                    `,
                        yes:{
                            text:"Okay",fn:function(){}
                        }
                    })
                });

            }).catch(function(c){

            });

        }

    }
};