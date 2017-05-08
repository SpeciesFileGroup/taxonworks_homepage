const Attributes = {
    Inactive: "data-inactive"
};

let cardList;

document.addEventListener("DOMContentLoaded", function() {
    cardList = Array.from( document.querySelectorAll('.feature-card') );
    const coreButtonList = Array.from( document.querySelectorAll('.feature-core__button') );
    const coreValueList = getCoreCardValueList(coreButtonList);

    changeCardDetailColors(cardList);
    setupInitialCardState(cardList);

    setupCoreButtonEventListeners(coreButtonList, cardList, coreValueList);
    setupControlButtons();
});

function changeCardDetailColors(cardList) {
    for(var i = 0; i < cardList.length; i++ )
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

    if(cardLabelValue === 'Upcoming')
    {
        cardLabelElement.className += ' status-upcoming';
    }
    else if(cardLabelValue === 'In Progress')
    {
        cardLabelElement.className += ' status-in-progress';
    }
    else if(cardLabelValue === 'Complete')
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

    if(cardLabelValue === 'Within the next three years' || cardLabelValue === 'Next year')
    {
        cardLabelElement.className += ' available-next-or-three-years';
    }
    else if(cardLabelValue === 'This year')
    {
        cardLabelElement.className += ' available-this-year';
    }
    else if(cardLabelValue === 'Now')
    {
        cardLabelElement.className += ' available-now';
    }

}

function setupInitialCardState(cardList) {
    setAllButFirstCardAsInactive(cardList, true);
}

function setAllButFirstCardAsInactive(cardList) {
    cardList.slice(1).forEach(cardNode => setCardAsInactive(cardNode));
}

function setCardAsInactive(card) {
    card.setAttribute(Attributes.Inactive, true);
}

function setCardAsActive(card) {
    card.setAttribute(Attributes.Inactive, false);
}

function setupCoreButtonEventListeners(coreButtonList, cardList, cardValueList) {
    for( i = 0; i < coreButtonList.length; i++ ) {
        coreButtonList[i].addEventListener("click", function(){
            // Add click event here
        });
    }
}

function setupControlButtons() {
    document.querySelector('.js-next-button').addEventListener('click', function() {
        const index = findActiveIndex();
    }, false);

    document.querySelector('.js-previous-button').addEventListener('click', function() {
        const index = findActiveIndex();
    }, false);
}

function findActiveIndex() {
    return cardList.findIndex(cardNode => cardNode.getAttribute(Attributes.Inactive) === "true");
}

function getCoreCardValueList(coreButtonList) {
    coreButtonList.map(coreButton => coreButton.outerText);
}