
document.addEventListener("DOMContentLoaded", function() {
    const cardList = document.querySelectorAll('.feature-card');

    changeCardDetailColors(cardList);
    setupInitialCardState(cardList);
});

function changeCardDetailColors(cardList) {
    for( i = 0; i < cardList.length; i++ )
    {
        const card = cardList[i];
        setStatusColor(card);
        setAvailableColor(card);
    }
}

function setStatusColor(card) {
    const cardLabelElement = card.querySelector('.feature-card__status-value');

    addStatusColorClass(cardLabelElement);

}

function addStatusColorClass(cardLabelElement) {
    const cardLabelValue = cardLabelElement.innerHTML;

    if(cardLabelValue == 'Upcoming')
    {
        cardLabelElement.className += ' status-upcoming';
    }
    else if(cardLabelValue == 'In Progress')
    {
        cardLabelElement.className += ' status-in-progress';
    }
    else if(cardLabelValue == 'Complete')
    {
        cardLabelElement.className += ' status-complete';
    }

}

function setAvailableColor(card) {
    const cardLabelElement = card.querySelector('.feature-card__available-value');

    addAvailableColorClass(cardLabelElement);
}

function addAvailableColorClass(cardLabelElement) {
    const cardLabelValue = cardLabelElement.innerHTML;

    if(cardLabelValue == 'Within the next three years' || cardLabelValue == 'Next year')
    {
        cardLabelElement.className += ' available-next-or-three-years';
    }
    else if(cardLabelValue == 'This year')
    {
        cardLabelElement.className += ' available-this-year';
    }
    else if(cardLabelValue == 'Now')
    {
        cardLabelElement.className += ' available-now';
    }
}

function setupInitialCardState(cardList) {
    for( i = 0; i < cardList.length; i++ )
    {
        if(i == 0)
        {
            continue;
        }
        setCardAsInactive(cardList[i]);
    }

}

function setCardAsInactive(card) {
    card.classList.add('inactive-card');

}

function setCardAsActive() {
    card.classList.remove('inactive-card');

}