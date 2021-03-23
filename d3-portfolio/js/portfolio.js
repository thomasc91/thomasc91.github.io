window.onload = function() {
	modalTitleOnLoad();
}

function openNav() {

    $('#overlay').show();

    // add listener to disable scroll
    disableScroll();
}

function closeNav() {

    $('#overlay').hide();

    enableScroll();
}

var chapterlist = new Array("bc", "lc", "dc", "bw", "nc");
var chapter_list = new Array("bar-charts", "line-charts", "donut-charts", "beeswarm-charts", "network-charts");

function modalTitleOnLoad() {


    $('.modal-chapter-titles li').on("click", function() {
        var cur_id = $(this).attr("id").slice(0, 2);
        var a = chapterlist.indexOf(cur_id);

        window.location.href = "../" + chapter_list[a] + "/index.html";

    })

    $('.modal-chapter-titles li').on("click", function() {
        $('.modal-chapter-titles li').removeClass('chapter-highlighted');
        $(this).addClass('chapter-highlighted');
        var cur_id = $(this).attr("id").slice(0, 2);

        var a = chapterlist.indexOf(cur_id);


        if ($(window).width() < 750) {
            window.location.href = "../" + chapter_list[a] + "/index.html";
        } else {
            hideAllTiles();
            $("#" + cur_id).css("display", "block");
        }

    });

}

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function hideAllTiles() {
    $('#bp,#cp,#pd,#fi,#ra,#bi').css("display", "none");
}
