
document.addEventListener("DOMContentLoaded", function() {
    var twHeader = document.querySelector('header');
    var twNavBar = document.querySelector('.header__nav-bar');
    var twMain   = document.querySelector('main');

    window.onscroll = function() {
        var scrollPos = document.getElementsByTagName("body")[0].scrollTop;
        if ( scrollPos > twMain.offsetTop )
        {
            var showNavBar = anime({
                targets: twNavBar,
                translateY: twNavBar.offsetHeight
            });
        } else {
            var hideNavBar = anime({
                targets: twNavBar,
                translateY: -(twNavBar.offsetHeight)
            });   
        }
    };

});

