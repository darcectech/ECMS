
use.page = {
   main:function(){

       function getDirectories (srcpath) {
           return fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
       }

       getDirectories( path.join(__dirname) ).forEach(function(d){
           $('select').append(`<option value="${d}">${d}</option>`);
       });

       $('select').val(NSCore.use('NSSettings').STRUCTURE.NSNavigator.moduleFolders).material_select();


       let v = use('NSServerInterface').decryptCreds();
       let p = use('NSSettings').STRUCTURE;

       let s = !!JSON.parse(String(p.core.dev).toLowerCase());
       console.log(s);

       $('#vAutoDev').prop('checked',s);
       $('#icon_prefix_root').val(p.server.root).trigger('autoresize');
       $('#icon_prefix_host').val(v.host).trigger('autoresize');
       $('#icon_prefix_username').val(v.user).trigger('autoresize');
       $('#icon_prefix').val(v.password).trigger('autoresize');


       Materialize.updateTextFields();

       $('#saveButt').on('click',function(){

           let nssi = use('NSServerInterface');

           // $('#vAutoDev').prop('checked')

           nssi.update('core','dev',$('#vAutoDev').prop('checked'),false);

           nssi.update('server','host',$('#icon_prefix_host').val(),true);
           nssi.update('server','user',$('#icon_prefix_username').val(),true);
           nssi.update('server','password',$('#icon_prefix').val(),true);

           nssi.update('server','root',$('#icon_prefix_root').val(),false,true); // update root then push to file


           Materialize.toast('Settings Saved!',2000);


       });
   }
};