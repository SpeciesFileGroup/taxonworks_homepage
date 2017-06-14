// Globals
const CollapsedClassName = 'navigation__links__mobile--collapsed';

document.addEventListener("DOMContentLoaded", function() {
    const Classes = {
        ShowFull: "navigation--show-full-bar",
        MobileButtonMenuOpen: "navigation__toggle-button--menu-open",
        MobileMenuOpen: 'navigation__links--open'
    };

    const benefitsSectionNode = document.querySelector('.js-benefits-section');
    const navigationNode = document.querySelector('.js-navigation');
    const fullThreshold = benefitsSectionNode.getBoundingClientRect().top;
    const mobileButtonNode = document.querySelector('.js-navigation-mobile-button');
    const mobileMenuNode = document.querySelector('.js-navigation-links');
    const linkAnchorNodes = Array.from(document.querySelectorAll('.js-navigation-link-anchor'));

    addEventListeners();

    window.onscroll = function() {
        const scrollPosition = document.getElementsByTagName("body")[0].scrollTop;
        if (scrollPosition < fullThreshold)
            navigationNode.classList.remove(Classes.ShowFull);
        else
            navigationNode.classList.add(Classes.ShowFull);
    };

    function addEventListeners() {
        mobileButtonNode.addEventListener('click', toggleMobileMenu, false);
        linkAnchorNodes.forEach(linkAnchorNode => {
            linkAnchorNode.addEventListener('click', closeMobileMenu, false);
        });
    }

    function toggleMobileMenu() {
        const isMenuOpen = mobileButtonNode.classList.contains(Classes.MobileButtonMenuOpen);
        if (isMenuOpen)
            closeMobileMenu();
        else
            openMobileMenu();
    }

    function closeMobileMenu() {
        mobileMenuNode.classList.remove(Classes.MobileMenuOpen);
        mobileButtonNode.classList.remove(Classes.MobileButtonMenuOpen);
    }

    function openMobileMenu() {
        mobileMenuNode.classList.add(Classes.MobileMenuOpen);
        mobileButtonNode.classList.add(Classes.MobileButtonMenuOpen);
    }

    return;

    const twHeader = document.querySelector('header');
    const twNavBar = document.querySelector('.js-navigation');
    const twMain   = document.querySelector('main');

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
