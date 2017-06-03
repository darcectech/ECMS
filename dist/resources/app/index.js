/**
 * Created by darylcecile on 02/06/2017.
 */
///<reference path="node_modules/@types/node/index.d.ts"/>
const electron = require('electron');
const app = electron.app;
const _path = require('path');
let options = [
    'enable-tcp-fastopen',
    'enable-experimental-canvas-features',
    'enable-experimental-web-platform-features',
    'enable-overlay-scrollbars',
    'allow-file-access-from-files',
    'allow-insecure-websocket-from-https-origin'
];
for (let i = 0; i < options.length; ++i) {
    if (typeof options[i] === 'string')
        app.commandLine.appendSwitch(options[i]);
    else
        app.commandLine.appendSwitch(options[i][0], options[i][1]);
}
app.once('ready', () => {
    let win = new electron.BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable: false,
        show: false,
        icon: _path.join(__dirname, 'ECMS.png'),
        webPreferences: {
            showDevTools: true,
            experimentalFeatures: true,
            blinkfeatures: "CSSVariables,KeyboardEventKey",
            allowRunningInsecureContent: true,
            webSecurity: false,
            nodeIntegrationInWorker: true,
            flags: "--harmony_proxies --harmony_collections",
            blinkFeatures: "CustomElementsV1"
        },
        title: 'Com',
        frame: false,
        backgroundColor: '#343434'
    });
    win.on('closed', () => {
        win = null;
    });
    win.once('ready-to-show', () => {
        win.show();
	win.toggleDevTools();
    });
    win.loadURL(`file://${__dirname}/index.html`);
});
app.on('window-all-closed', () => {
    app.quit();
});
//# sourceMappingURL=index.js.map