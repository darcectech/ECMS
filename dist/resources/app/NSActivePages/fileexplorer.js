/**
 * Created by darylcecile on 03/06/2017.
 */
use.page = {
    main: function () {
        let p = NSCore.use('NSSettings').STRUCTURE.server.root;
        pages.fileexplorer.loadDir(p);
        // youAreHere
    },
    loadDir(dir) {
        pages.fileexplorer.pathLoaded = dir;
        NSCore.use('NSServerInterface').listFileInFolder(dir);
        pages.fileexplorer.enableFilter();
        pages.fileexplorer.setBreadCrumbs(dir);
    },
    setBreadCrumbs(dir) {
        let bc = $('#youAreHere');
        let p = dir;
        let mex = dir;
        let crumbs = [];
        bc.empty();
        let rooot = NSCore.use('NSSettings').STRUCTURE.server.root;
        while (mex.length > 0) {
            console.log(p);
            if (p === rooot || p + '/' === rooot) {
                crumbs.push(p);
                break;
            }
            mex = path.basename(p);
            crumbs.push(mex);
            p = path.dirname(p);
        }
        let pathSoFar = "";
        crumbs.reverse();
        crumbs.some(function (e) {
            pathSoFar = pathSoFar + '/' + e;
            pathSoFar = pathSoFar.replace('//', '/');
            if (bc.height() > $('#filter_box').height()) {
                return true;
            }
            else {
                if (e.length <= 0 || e === rooot || e + '/' === rooot) {
                    e = '...';
                    bc.append($(`<a href="#!" class="breadcrumb" data-p="${rooot}">${e}</a>`).on('click', function () {
                        pages.fileexplorer.loadDir(rooot);
                    }));
                }
                else {
                    bc.append($(`<a href="#!" class="breadcrumb" data-p="${pathSoFar}">${e}</a>`).on('click', function () {
                        pages.fileexplorer.loadDir($(this).attr('data-p'));
                    }));
                }
                return false;
            }
        });
    },
    enableFilter() {
        $('#file_filter').on('input', function () {
            $('table tr td:nth-child(1)').each(function (i, e) {
                if (e.innerHTML.toLowerCase().indexOf($('#file_filter').val().toLowerCase()) < 0) {
                    $(e.parentElement).hide();
                }
                else {
                    $(e.parentElement).show();
                }
            });
        });
    },
    pathLoaded: ''
};
//# sourceMappingURL=fileexplorer.js.map