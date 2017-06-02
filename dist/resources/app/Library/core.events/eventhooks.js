
class eventhooks extends Framework.Library{
    constructor(){ super() }

    init(){

    }

    domReady(callback) {
        const webview = document.querySelector('webview');
        function readyDom(){
            callback();
            webview.removeEventListener('dom-ready',readyDom);
        }
        webview.addEventListener('dom-ready',readyDom);
    }
}