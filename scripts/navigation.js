
document.addEventListener("DOMContentLoaded", function() {
    const twHeader = document.querySelector('header');
    const twNavBar = document.querySelector('.header__nav-bar');
    const twMain   = document.querySelector('main');

    const twMobileButton = document.querySelector('.header__nav-bar__button');
    const twMobileLinks  = document.querySelector('.header__nav-bar__links__mobile');

    window.onscroll = function() {
        const scrollPosition = document.getElementsByTagName("body")[0].scrollTop;
        const windowYPosition = window.scrollY;

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

    twMobileButton.addEventListener('click', function() {
        const isCollapsed = checkIfCollapsed(twMobileLinks);
        this.disabled = true;

        if( isCollapsed ){
            twMobileLinks.style.display = "block";
            var showMobileLinks = anime({
                targets: twMobileLinks,
                translateY: twMobileLinks.offsetHeight,
                complete: function() {
                    twMobileButton.disabled = false;
                    changeButtonHTML(twMobileButton, isCollapsed);
                }
            });
        }
        else {
            var hideMobileLinks = anime({
                targets: twMobileLinks,
                translateY: 0,
                complete: function() {
                    twMobileButton.disabled = false;
                    twMobileLinks.style.display = "none";
                    changeButtonHTML(twMobileButton, isCollapsed);
                }
            });
            
        }

        function checkIfCollapsed(object) {
            var currentObjectDisplay;

            if ( object.currentStyle )
                currentObjectDisplay = object.currentStyle.display;
            else
                currentObjectDisplay = getComputedStyle(object, null).display;

            if( object.style.display == "none" || currentObjectDisplay == "none" )
                return true;
            else
                return false;
        }

        function changeButtonHTML(button, isCollapsed){
            if( isCollapsed )
                button.innerHTML = 'X';
            else
                button.innerHTML = '&#9776;';
        }

    });

});

