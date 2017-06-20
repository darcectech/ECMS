
/**
 * Created by darylcecile on 03/06/2017.
 */


use.this = {
    fadeUI:function(fnc,sel='body'){
        takeNote(`fading UI`);
        $(sel).velocity({
            opacity:0
        },400,fnc);
    },
    fadeInUI:function(fnc,sel='body'){
        takeNote(`showing UI`);
        $(sel).velocity({
            opacity:1
        },400,fnc);
    }
};

use.dependencies =
    [{
        depUrl:'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
        queryName:'jQuery'
    },{
        depUrl:'velocity',
        queryName:'$'
    }];