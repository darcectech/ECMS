/**
 * Created by darylcecile on 07/06/2017.
 */

use.this = (function(){

    window['_i_structure'] = (window['_i_structure'] || {});
    let o = {
        get FILE() {
            return fs.readFileSync(path.join(__dirname, 'setup', 'NSinfo.json'), 'utf8');
        },
        get STRUCTURE() {
            if (Object.keys(window['_i_structure']).length === 0) {
                window['_i_structure'] = JSON.parse(o.FILE);
            }
            return window['_i_structure'];
        },
        set STRUCTURE(v) {
            fs.writeFileSync(path.join(__dirname, 'setup', 'NSinfo.json'), JSON.stringify(v, null, '\t'), 'utf8');
            if (v !== window['_i_structure']) {
                window['_i_structure'] = v;
            }
        }
    };
    return o;
})();