Framework.expose('core.navigation',(tool)=>{

    tool.define('nav','nav.js');

    tool.dependency('core.navigation.contentEdit');

    return {
        unload:function(){
            console.log('namespace unloaded')
        }
    }

});