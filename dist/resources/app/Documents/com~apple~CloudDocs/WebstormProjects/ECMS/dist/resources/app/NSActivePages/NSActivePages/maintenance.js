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
        n.rename(path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'index.php'), path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'offline_.php'), function (err) {
            console.log(err, 1);
            n.rename(path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'maintenance.html'), path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'index.html'), function (err) {
                console.log(err, 2);
                n.end();
                Materialize.toast('Website Offline!', 2000);
            });
        });
    },
    putWebsiteOnline: function () {
        let n = pages.maintenance.communicatorLocal;
        n.rename(path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'index.html'), path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'maintenance.html'), function (err) {
            console.log(err, 1);
            n.rename(path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'offline_.php'), path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'index.php'), function (err) {
                console.log(err, 2);
                n.end();
                Materialize.toast('Website Online!', 2000);
            });
        });
    },
    isWebsiteOnline: function (resCB) {
        pages.maintenance.communicatorLocal.size(path.join(NSCore.use('NSSettings').STRUCTURE.server.root, 'index.php'), function (err, inte) {
            if (err) {
                resCB(false);
            }
            else {
                resCB(true);
            }
        });
    },
    get communicatorLocal() { return NSCore.use('NSServerInterface').communicator(); }
};
//# sourceMappingURL=maintenance.js.map