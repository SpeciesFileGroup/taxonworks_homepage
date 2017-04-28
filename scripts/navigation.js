
document.addEventListener("DOMContentLoaded", function() {
    var twHeader = document.querySelector('header');
    var twNavBar = document.querySelector('.header__nav-bar');
    var twMain   = document.querySelector('main');

    window.onscroll = function() {
        var scrollPosition = document.getElementsByTagName("body")[0].scrollTop;
        var windowYPosition = window.scrollY;

        if ( scrollPosition > twMain.offsetTop || windowYPosition > twMain.offsetTop )
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

