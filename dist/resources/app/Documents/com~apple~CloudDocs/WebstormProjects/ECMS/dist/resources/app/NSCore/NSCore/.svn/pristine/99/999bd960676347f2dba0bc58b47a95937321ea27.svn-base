/**
 * Created by darylcecile on 08/06/2017.
 */
use.this = {
    showModal: function (opt) {
        let mProm = new Promise((resolve, reject) => {
            $('#keeper').remove();
            let n = $(`
            <div material id="keeper"></div>
        `);
            let m = $(`
            <div id="modal1" class="modal">
                <div class="modal-content">
                    <h4>Modal Header</h4>
                    <p>A bunch of text</p>
                </div>
                <div class="modal-footer">
                </div>
            </div>
        `);
            $('body').append(n);
            $(n).append(m);
            m.find('.modal-footer').append($(`<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">${(opt.yes.text || "Okay")}</a>`).on('click', () => {
                resolve(true);
                opt.yes.fn();
            }));
            if (opt.no) {
                m.find('.modal-footer').append($(`<a href="#!" class="modal-action modal-close waves-effect waves-red btn-flat">${(opt.no.text || "Cancel")}</a>`).on('click', () => {
                    resolve(false);
                    opt.no.fn();
                }));
            }
            if (opt.header) {
                m.find('.modal-content h4').text(opt.header);
            }
            if (opt.message) {
                m.find('.modal-content p').text(opt.message);
            }
            $('#modal1').modal().modal('open');
        });
        return mProm;
    }
};
//# sourceMappingURL=NSModal.js.map