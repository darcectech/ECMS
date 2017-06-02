

$(function(){
    $(document.body)[0].onscroll = function(e){

        let currentPos = $(document).scrollTop();
        let iHeight = window.innerHeight;
        let navCover = iHeight - 50;

        if ( (currentPos >= navCover && currentPos < iHeight) ){
            let opacity = 1 - ( (iHeight - currentPos)*2 )/100;
            $('nav').css({
                background:"rgba(28,28,28,"+opacity+")"
            });
        }
        else if (currentPos >= iHeight){
            $('nav').css({
                background:"rgba(28,28,28,1)"
            });
        }
        else{
            $('nav').css({
                background:"rgba(28,28,28,0)"
            });
        }

        if (currentPos < iHeight && currentPos >= 0){

            let opacity = 1 - (currentPos/iHeight);

            $('.hero').css({
                opacity:opacity
            });

        }

    };
});