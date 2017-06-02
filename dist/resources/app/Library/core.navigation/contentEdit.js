
window.startContentEdit =()=>{

    let electron = require('electron').remote;
    let path = require('path');
    let url = require('url');

    let win = new electron.BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable:false,
        flags:"--harmony_proxies --harmony_collections",
        title:'3DPThings Content Manager',
        icon:path.join(__dirname,'assets/logo/primary.png'),
        show:false,
        blinkFeatures:"CustomElementsV1"
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol:'file:',
        slashes: true
    }));
    win.once('ready-to-show', () => {
        win.show();
        win.maximize();
    });
}