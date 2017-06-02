

class webview extends Framework.Library{
    constructor(){
        super();
    }
    init(){

        let indicator = document.querySelector('.indicator');

        function loadStart(){
            indicator.innerHTML = 'autorenew';
            document.querySelector('webview').setZoomFactor(0.9);
        }
        function loadStop(){
            indicator.innerHTML = 'refresh';
            document.querySelector('webview').setZoomFactor(0.9);
        }

        let webview = document.querySelector('webview');
        webview.addEventListener('did-start-loading', loadStart);
        webview.addEventListener('did-stop-loading', loadStop);
    }

    parsePHP(){

    }
}
