/**
 * Created by darylcecile on 03/06/2017.
 */
use.page = {
    main: function () {
        let rootInf = JSON.parse(SETUP_INFO);
        let creds = rootInf.server;
        let creds_h = "";
        let creds_u = "";
        let creds_p = "";
        let encryptor = require('simple-encryptor');
        //set up one layer encryption
        if (rootInf.core.UUID === "") {
            rootInf.core.UUID = (function () {
                let d = new Date().getTime();
                if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                    d += performance.now(); //use high-precision timer if available
                }
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    let r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            })();
            creds_h = creds.host;
            creds_u = creds.username;
            creds_p = creds.password;
            encryptor = encryptor(rootInf.core.UUID);
            rootInf.server.host = encryptor.encrypt(creds.host);
            rootInf.server.username = encryptor.encrypt(creds.username);
            rootInf.server.password = encryptor.encrypt(creds.password);
            let s = JSON.stringify(rootInf, null, '\t');
            fs.writeFileSync(path.join(__dirname, 'setup', 'NSinfo.json'), s, 'utf8');
            SETUP_INFO = fs.readFileSync(path.join(__dirname, 'setup', 'NSinfo.json'), 'utf8');
        }
        else {
            encryptor = encryptor(rootInf.core.UUID);
            creds_h = encryptor.decrypt(creds.host);
            creds_u = encryptor.decrypt(creds.username);
            creds_p = encryptor.decrypt(creds.password);
        }
        //debug
        // if (VERSION) return;
        let config = { host: creds_h, username: creds_u, password: creds_p };
        let SFTPClient = require('sftp-promises');
        let sftp = new SFTPClient(config);
        sftp.ls(rootInf.server.root).then(function (list) {
            console.log(list);
            list.entries.forEach(function (entry) {
                $('#fileexplorer').find('table tbody').append(`
                        <tr>
                             <td>${entry.filename}</td>
                             <td>${(entry.longname.indexOf('d') === 0 ? 'Folder' : 'File')}</td>
                             <td>${entry.attrs.size}</td>
                        </tr>
                `);
            });
        });
        /*<tr>
         <td>Example</td>
         <td>12mb</td>
         <td>Folder</td>
         </tr>*/
    }
};
//# sourceMappingURL=fileexplorer.js.map