
document.addEventListener("DOMContentLoaded", function() {
    let featureCardList = document.querySelectorAll('.feature-card');
    console.log(featureCardList);

    for( i = 0; i < featureCardList.length; i++ )
    {
        // let featureCardLabelElement = featureCard.querySelector('.feature-card__status-label').value;
        // let featuredCardLabelValue = featureCard.querySelector('.feature-card__status-value').value;
        // console.log(featuredCardLabelValue);
        console.log('Number of loops: ' + i);
    }

});

