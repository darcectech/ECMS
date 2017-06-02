
Framework.expose('core.events',(tool)=>{


    tool.define('hooks','eventhooks.js');

    return {
        unload:function(){}
    }
});