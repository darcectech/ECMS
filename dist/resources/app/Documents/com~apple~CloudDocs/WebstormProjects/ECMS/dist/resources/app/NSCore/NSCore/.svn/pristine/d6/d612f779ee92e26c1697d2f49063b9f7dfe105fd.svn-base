/**
 * Created by darylcecile on 05/06/2017.
 */
use.this = {
    listFileInFolder: function (directory) {
        let sftp = NSCore.use('NSServerInterface').communicator();
        if (!directory) {
            directory = NSCore.use('NSSettings').STRUCTURE.server.root;
        }
        sftp.list(directory, function (err, list) {
            if (err)
                throw err;
            list.forEach(function (entry) {
                $('#fileexplorer').find('table tbody').append($(`
                        <tr>
                             <td>${entry.name}</td>
                             <td>${(entry.type.indexOf('d') === 0 ? 'Folder' : 'File')}</td>
                             <td>${entry.size}</td>
                        </tr>
                    `).on('click', function () {
                    if (entry.type.indexOf('d') === 0) {
                        pages.fileexplorer.loadDir(path.join(pages.fileexplorer.pathLoaded, entry.name));
                    }
                    else {
                        NSCore.use('NSModal').showModal({
                            header: `Edit ${entry.name}?`,
                            message: 'Would you like to make changes to this file?',
                            yes: {
                                text: 'Yes',
                                fn: function () { }
                            },
                            no: {
                                text: 'No',
                                fn: function () { }
                            }
                        }).then(function (outCome) {
                            if (outCome === true) {
                                //download file and start watcher
                                //chokidar.watch('file').on('change', ...
                                let n = NSCore.use('NSServerInterface').communicator();
                                n.get(path.join(pages.fileexplorer.pathLoaded, entry.name), function (er, rs) {
                                    if (er)
                                        throw er;
                                    if (fs.existsSync(path.join(remote.app.getPath('desktop'), 'TEMP_EDIT')) === false)
                                        fs.mkdirSync(path.join(remote.app.getPath('desktop'), 'TEMP_EDIT'));
                                    const chunks = [];
                                    rs.on("data", function (chunk) {
                                        chunks.push(chunk);
                                    });
                                    // Send the buffer or you can put it into a var
                                    rs.on("end", function () {
                                        fs.writeFileSync(path.join(remote.app.getPath('desktop'), 'TEMP_EDIT', entry.name), Buffer.concat(chunks).toString(), 'utf8');
                                        let needsUploading = false;
                                        let ws = new WatchSession(path.join(remote.app.getPath('desktop'), 'TEMP_EDIT', entry.name));
                                        ws.startWatching(function (a) {
                                            needsUploading = true;
                                            console.log('changed', a);
                                        });
                                        NSCore.use('NSModal').showModal({
                                            header: `Here is how...`,
                                            message: `${entry.name} has been downloaded to the "TEMP_EDIT" folder on your desktop. Make changes to it then click save below`,
                                            yes: {
                                                text: 'Save and Upload',
                                                fn: function () { }
                                            },
                                            no: {
                                                text: 'Cancel, and Dont upload',
                                                fn: function () { }
                                            }
                                        }).then(function (outCome) {
                                            ws.endAndDispose();
                                            n = NSCore.use('NSServerInterface').communicator();
                                            if (outCome === true) {
                                                //upload
                                                n.put(path.join(remote.app.getPath('desktop'), 'TEMP_EDIT', entry.name), path.join(pages.fileexplorer.pathLoaded, entry.name), function (err) {
                                                    n.end();
                                                    if (err) {
                                                        Materialize.toast('Failed to update file', 2000);
                                                        throw err;
                                                    }
                                                    else {
                                                        deleteFolderRecursive(path.join(remote.app.getPath('desktop'), 'TEMP_EDIT'));
                                                        Materialize.toast('File updated!', 2000);
                                                    }
                                                    console.log('touched', err);
                                                });
                                            }
                                            else {
                                                n.end();
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    }
                }));
            });
            window['FTPClient'].end();
        });
    },
    communicator: function () {
        let rootInf = NSCore.use('NSSettings').STRUCTURE;
        let creds = rootInf.server;
        let creds_h = "";
        let creds_u = "";
        let creds_p = "";
        let encryptor = require('simple-encryptor');
        $('#fileexplorer').find('table tbody').empty();
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
            creds_u = creds.user;
            creds_p = creds.password;
            encryptor = encryptor(rootInf.core.UUID);
            rootInf.server.host = encryptor.encrypt(creds.host);
            rootInf.server.user = encryptor.encrypt(creds.user);
            rootInf.server.password = encryptor.encrypt(creds.password);
            let s = JSON.stringify(rootInf, null, '\t');
            fs.writeFileSync(path.join(__dirname, 'setup', 'NSinfo.json'), s, 'utf8');
            SETUP_INFO = JSON.stringify(NSCore.use('NSSettings').STRUCTURE, null, '\t');
        }
        else {
            encryptor = encryptor(rootInf.core.UUID);
            creds_h = encryptor.decrypt(creds.host);
            creds_u = encryptor.decrypt(creds.user);
            creds_p = encryptor.decrypt(creds.password);
        }
        //if debugging, ignore server communication
        if (rootInf.release === "developer")
            return null;
        let config = { host: creds_h, user: creds_u, password: creds_p };
        let Client = require('ftp');
        if (window['FTPClient'])
            window['FTPClient'].destroy();
        window['FTPClient'] = new Client();
        window['FTPClient'].on('ready', function () {
            window['FTPClient'].list(function (err, list) {
                if (err)
                    throw err;
                console.dir(list);
                window['FTPClient'].end();
            });
        });
        // connect to localhost:21 as anonymous
        window['FTPClient'].connect(config);
        return window['FTPClient'];
    },
    decryptCreds: function () {
        let encryptor = require('simple-encryptor');
        let rootInf = NSCore.use('NSSettings').STRUCTURE;
        encryptor = encryptor(rootInf.core.UUID);
        let creds_h = encryptor.decrypt(rootInf.server.host);
        let creds_u = encryptor.decrypt(rootInf.server.user);
        let creds_p = encryptor.decrypt(rootInf.server.password);
        return {
            host: creds_h,
            user: creds_u,
            password: creds_p
        };
    },
    update: function (cat, prop, newVal, encrypt, push = false) {
        let encryptor = require('simple-encryptor');
        if (!window['rootInf'])
            window['rootInf'] = NSCore.use('NSSettings').STRUCTURE;
        encryptor = encryptor(window['rootInf'].core.UUID);
        window['rootInf'][cat][prop] = (encrypt === true ? encryptor.encrypt(newVal) : newVal);
        if (push === true)
            NSCore.use('NSSettings').STRUCTURE = window['rootInf'];
    }
};
//# sourceMappingURL=NSServerInterface.js.map