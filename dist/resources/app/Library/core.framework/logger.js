
class logger extends Framework.Library{
    constructor(){
        super();
    }
    init(){

        let webview = document.querySelector('webview');
        webview.addEventListener('did-fail-load', (e) => {
            console.warn(e);

        })
    }

    parsePHP(){

    }
}
