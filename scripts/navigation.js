
document.addEventListener("DOMContentLoaded", function() {
    var twHeader = document.querySelector('header');
    var twNavBar = document.querySelector('.header__nav-bar');
    var twMain   = document.querySelector('main');

    twNavBar.style.visibility = 'hidden';

    window.onscroll = function() {
        var scrollPos = document.getElementsByTagName("body")[0].scrollTop;
        if ( scrollPos > twMain.offsetTop )
        {
            twNavBar.style.visibility = 'visible';
        } else {
            twNavBar.style.visibility = 'hidden';
        }
    };
});

