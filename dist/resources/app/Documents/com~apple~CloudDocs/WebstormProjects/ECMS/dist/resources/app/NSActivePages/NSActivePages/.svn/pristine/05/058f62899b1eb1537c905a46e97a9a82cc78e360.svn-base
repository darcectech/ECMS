/**
 * Created by darylcecile on 08/06/2017.
 */

use.page = {
    main:function(){

        let i = use('NSSettings').STRUCTURE.user;
        let alicenses = use('NSLicense').list;
        let l = $('#licenseList');

        alicenses.forEach(function(n){
            l.append( $(`<option value="${n}">${n.toUpperCase()}</option>`) );
        });

        $('#first_name2').val(i.firstName+' '+i.lastName);
        $('#email').val(i.email);

        Materialize.updateTextFields();
        $('select').material_select();
    },
    showLicenseSelected:function(){

        let licenseName = $('select').val();
        let licenseContainer = $('.licenseView pre');

        licenseContainer.empty();

        //[year]

        let c = fs.readFileSync( path.join(__dirname,'licenses','licenses',licenseName+'.txt') , 'utf8' );

        c = c.replace(/\[year]/g,'2017');
        c = c.replace(/\[fullname]/g, $('#first_name2').val() );

        licenseContainer.append( c );

    },
    copyLicense:function(){

        remote.clipboard.writeText( $('.licenseView pre').html() );

        Materialize.toast('Copied to clipboard!',2000);

    },
    saveLicense:function(){

        fs.writeFileSync( path.join( remote.app.getPath('desktop') , 'LICENSE' ) , $('.licenseView pre').html() , 'utf8' );

        Materialize.toast('Saved to desktop as "LICENSE"',2000);

    }
};