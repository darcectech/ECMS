
Framework.expose('core.framework',(tool)=>{

    tool.define('webview','webview.js');
    tool.define('logger','logger.js');

    return {
        unload:function(){
            console.log('namespace unloaded')
        }
    }

});