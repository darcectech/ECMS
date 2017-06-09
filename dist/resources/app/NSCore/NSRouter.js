/**
 * Created by darylcecile on 05/06/2017.
 */
use.this = {
    filterDev: function (fnc, elseFnc, devOnly = true) {
        if ((NSCore.use('NSSettings').STRUCTURE.release === "developer") === devOnly) {
            fnc();
        }
        else {
            if (elseFnc)
                elseFnc();
        }
    }
};
//# sourceMappingURL=NSRouter.js.map