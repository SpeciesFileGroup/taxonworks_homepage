document.addEventListener("DOMContentLoaded", function() {
    var myAnimation = anime({
        targets: ['.test'],
        translateX: '13rem',
        rotate: 180,
        'border-radius': 8,
        duration: 2000,
        easing: 'easeOutQuint',
        loop: true
    });
});