
document.addEventListener("DOMContentLoaded", function() {
    const cardList = document.querySelectorAll('.feature-card');
    const coreButtonList = document.querySelectorAll('.feature-core__button');
    const coreValueList = getCoreCardValueList(coreButtonList);

    changeCardDetailColors(cardList);
    setupInitialCardState(cardList);

    setupCoreButtonEventListeners(coreButtonList, cardList, coreValueList);

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
    setAllCardsAsInactive(cardList, true);

}

function setAllCardsAsInactive(cardList, startingState) {
    for( i = 0; i < cardList.length; i++ )
    {
        if(i == 0 && startingState == true)
        {
            continue;
        }
        setCardAsInactive(cardList[i]);
    }

}

function setCardAsInactive(card) {
    card.classList.add('inactive-card');

}

function setCardAsActive(card) {
    card.classList.remove('inactive-card');

}

function setupCoreButtonEventListeners(coreButtonList, cardList, cardValueList) {
    for( i = 0; i < coreButtonList.length; i++ )
    {
        coreButtonList[i].addEventListener("click", function(){
            // Add click event here
        });
    }

}

function getCoreCardValueList(coreButtonList) {
    var valueList = new Array;

    for( i = 0; i < coreButtonList.length; i++ )
    {
        valueList.push(coreButtonList[i].outerText);
    }
    return valueList;

}