
var cors_api_url = 'https://free-cors-proxy.herokuapp.com/';
function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function() {
        printResult(
            (x.responseText || '')
        );
    };
    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}

function pushThroughCors(site,cb,type='GET'){
    doCORSRequest({
        method: type,
        url: site,
        data: ''
    }, function printResult(result) {
        if (cb) cb(result);
    });
}

window.thingiAdapter = {};

function getBatchInfo(thingID,cb){

    if ( window.thingiAdapter[thingID] !== undefined ){
        cb (window.thingiAdapter[thingID]);
    }
    else{
        pushThroughCors( 'https://www.thingiverse.com/thing:'+thingID , function(res){

            let holder = $('<div/>').append(res);
            window.thingiAdapter[thingID] = {};
            window.thingiAdapter[thingID]['title'] = holder.find('[property="og:title"]')[0].content;
            window.thingiAdapter[thingID]['creator'] = holder.find('[property="cc:attributionName"]')[0].innerText;
            window.thingiAdapter[thingID]['description'] = holder.find('[name="twitter:description"]')[0].content;
            window.thingiAdapter[thingID]['featuredImage'] = holder.find('img').filter(function(i,e){ return (e.src.indexOf('featured')>-1 && e.src.indexOf('cdn')>-1) })[0].src;

            cb( window.thingiAdapter[thingID] );
        } )

    }

}

function getTitle(thingID,cb){
    getBatchInfo(thingID,function(x){
        cb(x.title);
    })
}

function getCreator(thingID,cb){
    getBatchInfo(thingID,function(x){
        cb(x.creator);
    })
}

function getDescription(thingID,cb){
    getBatchInfo(thingID,function(x){
        cb(x.description);
    })
}

function getFeaturedImage(thingID,cb){
    getBatchInfo(thingID,function(x){
        cb(x.featuredImage);
    })
}

hide( $('#thingInfoCard') );