// Globals
const CollapsedClassName = 'navigation__links__mobile--collapsed';

document.addEventListener("DOMContentLoaded", function() {
    const twHeader = document.querySelector('header');
    const twNavBar = document.querySelector('.js-navigation');
    const twMain   = document.querySelector('main');

    const twMobileButton = document.querySelector('.js-navigation-mobile-button');
    const twMobileLinks  = document.querySelector('.js-mobile-links');
    const twMobileLink   = document.querySelector('.js-mobile-link-anchor');

    window.onscroll = function() {
        const scrollPosition = document.getElementsByTagName("body")[0].scrollTop;
        const windowYPosition = window.scrollY;

        if ( scrollPosition > twMain.offsetTop || windowYPosition > twMain.offsetTop )
        {
            var showNavBar = anime({
                duration: 250,
                targets: twNavBar,
                translateY: twNavBar.offsetHeight,
                easing: 'easeInOutQuad'
            });
        } else {
            var hideNavBar = anime({
                duration: 250,
                targets: twNavBar,
                translateY: -(twNavBar.offsetHeight),
                easing: 'easeInOutQuad',
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
        getCollapsingAnimation();
    });

    function checkIfCollapsed() {
        const currentObjectDisplay = getCurrentCollapsedClassState(twMobileLinks);
        return currentObjectDisplay;
    }

    function getCurrentCollapsedClassState(element) {
        if ( element.classList.contains(CollapsedClassName) )
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
        twMobileLinks.classList.add(CollapsedClassName);
    }

    function removeCollapsedClass() {
        twMobileLinks.classList.remove(CollapsedClassName);
    }

    function getCollapsingAnimation() {
        return anime({
            duration: 250,
            targets: twMobileLinks,
            translateY: 0,
            easing: 'easeInOutQuad',
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
            duration: 250,
            targets: twMobileLinks,
            translateY: twMobileLinks.offsetHeight,
            easing: 'easeInOutQuad',
            complete: function() {
                twMobileButton.disabled = false;
                changeButtonHTML(twMobileButton, checkIfCollapsed());
            }
        });
    }

});

