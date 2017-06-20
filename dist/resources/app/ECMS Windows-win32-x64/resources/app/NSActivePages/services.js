/**
 * Created by darylcecile on 06/06/2017.
 */
use.page = {
    main: function () {
        let r = NSCore.use('NSSettings').STRUCTURE.services;
        window['dat'] = [];
        r.forEach(function (e) {
            window['dat'].push({
                tag: e
            });
        });
        console.log(r);
        $('.chips-autocomplete').material_chip({
            placeholder: 'Enter a Service Name',
            secondaryPlaceholder: '+Service',
            autocompleteOptions: {
                data: {
                    'Developer': null,
                    'Net-Sync': null,
                    'Incremental-Updates': null
                },
                limit: Infinity,
                minLength: 1
            },
            data: window['dat']
        });
        $('.chips').on('chip.add', function (e, chip) {
            // you have the added chip here
            let enabledChips = [];
            $('.chips').material_chip('data').forEach(function (s) {
                enabledChips.push(s.tag);
            });
            let t = NSCore.use('NSSettings').STRUCTURE;
            t.services = enabledChips;
            NSCore.use('NSSettings').STRUCTURE = t;
        });
        $('.chips').on('chip.delete', function (e, chip) {
            // you have the deleted chip here
            let enabledChips = [];
            //noinspection TypeScriptUnresolvedFunction
            $('.chips').material_chip('data').forEach(function (s) {
                enabledChips.push(s.tag);
            });
            let t = NSCore.use('NSSettings').STRUCTURE;
            t.services = enabledChips;
            NSCore.use('NSSettings').STRUCTURE = t;
        });
    }
};
//# sourceMappingURL=services.js.map