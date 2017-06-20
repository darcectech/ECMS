/**
 * Created by darylcecile on 08/06/2017.
 */
use.page = {
    main: function () {
        let v = $('.switch input');
        v.hide();
        pages.maintenance.isWebsiteOnline(function (a) {
            v.show().prop('checked', a);
        });
        v.on('click', function () {
            setTimeout(() => {
                if (v.prop('checked') === true) {
                    pages.maintenance.putWebsiteOnline();
                }
                else {
                    pages.maintenance.putWebsiteOffline();
                }
            }, 1000);
        });
    },
    putWebsiteOffline: function () {
        let n = pages.maintenance.communicatorLocal;
        n.rename(path.join(NSCore.use('NSSettings').STRUCTURE.server.root, '_maintenance.php'), path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'maintenance.php'), function (err) {
            console.log(err, 1);
            n.end();
            Materialize.toast('Website Offline!', 2000);
        });
    },
    putWebsiteOnline: function () {
        let n = pages.maintenance.communicatorLocal;
        n.rename(path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'maintenance.html'), path.join(NSCore.use('NSSettings').STRUCTURE.server.root, '_maintenance.html'), function (err) {
            console.log(err, 1);
            n.end();
            Materialize.toast('Website Online!', 2000);
        });
    },
    isWebsiteOnline: function (resCB) {
        $.get("http://3dpthings.com/_maintenance.html").done(function () {
            //online
            resCB(true);
        }).fail(function () {
            resCB(false);
        });
    },
    get communicatorLocal() { return NSCore.use('NSServerInterface').communicator(); }
};
//# sourceMappingURL=maintenance.js.map