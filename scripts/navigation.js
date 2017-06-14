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
});
