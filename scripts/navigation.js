// Globals
const className = 'header__nav-bar__links__mobile--collapsed';

document.addEventListener("DOMContentLoaded", function() {
    const twHeader = document.querySelector('header');
    const twNavBar = document.querySelector('.header__nav-bar');
    const twMain   = document.querySelector('main');

    const twMobileButton = document.querySelector('.header__nav-bar__button');
    const twMobileLinks  = document.querySelector('.header__nav-bar__links__mobile');
    const twMobileLink   = document.querySelector('.header__nav-bar__links__mobile__link');

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
                translateY: -(twNavBar.offsetHeight),
                begin: function() {
                    getCollapsingAnimation();
                }
            });   
        }
    };

    twMobileButton.addEventListener('click', function() {
        const isCollapsed = checkIfCollapsed(twMobileLinks); 
        this.disabled = true;

        if( isCollapsed ){
            getExpandingAnimation();
        }
        else {
            getCollapsingAnimation();
        }

    });

    twMobileLink.addEventListener('click', function() {
        console.log('You clicked a link');
        getCollapsingAnimation();
    });

    function checkIfCollapsed() {
        const currentObjectDisplay = getCurrentCollapsedClassState(twMobileLinks);
        return currentObjectDisplay;
    }

    function getCurrentCollapsedClassState(element) {
        if ( element.classList.contains(className) )
            return true;
        else
            return false;
    }

    function changeButtonHTML(button, isCollapsed) {
        if( isCollapsed )
            button.innerHTML = '&#9776;';
        else
            button.innerHTML = 'X';
    }
    
    function addCollapsedClass() {
        twMobileLinks.classList.add(className);
    }

    function removeCollapsedClass() {
        twMobileLinks.classList.remove(className);
    }

    function getCollapsingAnimation() {
        return anime({
            targets: twMobileLinks,
            translateY: 0,
            complete: function() {
                twMobileButton.disabled = false;
                addCollapsedClass();
                changeButtonHTML(twMobileButton, checkIfCollapsed());
            }
        });
    }

    function getExpandingAnimation() {
        removeCollapsedClass();
        return anime({
            targets: twMobileLinks,
            translateY: twMobileLinks.offsetHeight,
            complete: function() {
                twMobileButton.disabled = false;
                changeButtonHTML(twMobileButton, checkIfCollapsed());
            }
        });
    }

});

