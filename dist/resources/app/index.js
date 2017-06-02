

const electron = require('electron');
const app = electron.app;
const path = require('path');



let options = [
    //'enable-tcp-fastopen',
    //'enable-experimental-canvas-features',
    'enable-experimental-web-platform-features',
    'enable-overlay-scrollbars',
    //'enable-hardware-overlays',
    //'enable-universal-accelerated-overflow-scroll',
    'allow-file-access-from-files',
    'allow-insecure-websocket-from-https-origin',
    // ['js-flags', '--harmony_collections']
];

for(let i=0; i < options.length; ++i) {
    if (typeof options[i] === 'string')
        app.commandLine.appendSwitch(options[i]);
    else
        app.commandLine.appendSwitch(options[i][0], options[i][1]);
}



app.once('ready',()=>{
    let win = new electron.BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable:false,
        show:false,
        webPreferences:{
            showDevTools: true,
            experimentalFeatures: true,
            blinkfeatures:"CSSVariables,KeyboardEventKey",
            allowRunningInsecureContent:true,
            webSecurity:false,
            nodeIntegrationInWorker:true,
            flags:"--harmony_proxies --harmony_collections",
            icon:path.join(__dirname,'assets/logo/primary.png'),
            blinkFeatures:"CustomElementsV1"
        },
        title:'PHP Shimmer'
    });
    win.on('closed', () => {
        win = null
    });

    win.once('ready-to-show', () => {
        win.show()
    });

    win.loadURL(`file://${__dirname}/main.html`);
});
