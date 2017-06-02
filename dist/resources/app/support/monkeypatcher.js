

window.MonkeyPatcher = {};

MonkeyPatcher.constants = {
    WORKING:1,
    UPDATING:2,
    READY:3,
    STALLING:4
};

MonkeyPatcher.patches = {};

MonkeyPatcher.looper = setInterval(function(){

    if ( MonkeyPatcher.tools.checkIsWorking() === false ){

        let patches = Object.keys(MonkeyPatcher.patches);
        if (patches.length > 0){

            let patchTask = MonkeyPatcher.tools.getWaiting();
            if (patchTask === undefined) return;
            MonkeyPatcher.patches[patchTask].working = true;
            MonkeyPatcher.patches[ patchTask ].patch(function(){
                //when done, callback
                MonkeyPatcher.patches[patchTask].working = false;
                MonkeyPatcher.patches[patchTask].complete = true;
                MonkeyPatcher.patches[patchTask].callback(patchTask);
            });

        }

    }

},500);

MonkeyPatcher.tools = {};


MonkeyPatcher.tools.checkIsWorking = function(){
    let patches = Object.keys(MonkeyPatcher.patches);
    if (patches.length > 0){
        let stat = false;
        patches.forEach(function(s){
            if ( MonkeyPatcher.patches[s].working === true ) stat = true;
        });
        return stat;
    }
    else{
        return false;
    }
};

MonkeyPatcher.tools.forcePatch = function(patchId){
    if ( MonkeyPatcher.patches[patchId] === undefined ){
        return "No Patch found";
    }
    MonkeyPatcher.patches[patchId].working = true;
    MonkeyPatcher.patches[patchId].patch(function(){
        MonkeyPatcher.patches[patchId].working = false;
        MonkeyPatcher.patches[patchId].complete = true;
        MonkeyPatcher.patches[patchId].callback(patchId);
    });
    return "Patch will start soon";
};

MonkeyPatcher.tools.getWaiting = function(){
    let patches = Object.keys(MonkeyPatcher.patches);
    if (patches.length > 0){
        let stat = undefined;
        patches.forEach(function(s){
            if ( MonkeyPatcher.patches[s].working === false && MonkeyPatcher.patches[s].complete === false ) stat = s;
        });
        return stat;
    }
    else{
        return undefined;
    }
};

MonkeyPatcher.status = MonkeyPatcher.constants.READY;

MonkeyPatcher.requestPatch = function(patchId,func,cb){
    if ( MonkeyPatcher.patches[patchId] === undefined ){

        MonkeyPatcher.patches[patchId] = {
            patch:func,
            callback:cb,
            complete:false,
            working:false
        };
        return true;
    }
    else{
        return false;
    }
};