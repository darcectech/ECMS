/**
 * Created by darylcecile on 03/06/2017.
 */
use.this = {
    setComponent: function (templateName, parent) {
        takeNote(`mk new component ${templateName}`);
        let c_c = fs.readFileSync(path.join('NSCoreUI', templateName + '._'), 'utf8');
        let c = document.createElement('div');
        c.innerHTML = c_c;
        let fc = c.children.item(0);
        fc.setAttribute('guid', this.generateUUID());
        fc.setAttribute('componentRef', templateName);
        controls[templateName] = fc;
        fc['changeData'] = function (eName, dataName, newValue) {
            takeNote(`changing data on VPElement ${eName} to "${newValue}"`);
            $(`[vp-target=${eName}],[guid=${eName}]`).each(function (m, e) {
                e[dataName] = newValue;
            });
        };
        fc['target'] = function (eName) {
            return $(`[vp-target=${eName}]`)[0];
        };
        if (parent) {
            let ec = $(`[componentRef=${templateName}][guid]`, parent);
            if (ec.length > 0) {
                ec[0].parentElement.replaceChild(fc, ec[0]);
            }
            else {
                parent.appendChild(fc);
            }
        }
        else {
            return fc;
        }
    },
    removeComponent: function (el) {
        delete el['changeData'];
        delete el['target'];
        delete controls[el.getAttribute('componentRef')];
        let p = el.parentElement;
        p.removeChild(el);
    },
    record: {},
    generateUUID: function () {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
};
//# sourceMappingURL=NSVisualProvider.js.map