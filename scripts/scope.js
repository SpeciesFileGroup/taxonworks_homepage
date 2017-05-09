document.addEventListener("DOMContentLoaded", scope);

function scope() {
    const Attributes = {
        FeatureId: "data-feature-id",
        FeatureRef: "data-feature-ref",
        ParentFeatureId: "data-parent-feature-id",
        TopLevel: "data-top-level",
        Inactive: "data-inactive"
    };

    const Classes = {
        CardCollapsed: 'feature-card--collapsed'
    };

    const featureCardNodes = Array.from( document.querySelectorAll(`[${Attributes.FeatureId}]`) );
    const topLevelFeatureCardNodes = featureCardNodes.filter(node => node.hasAttribute(Attributes.TopLevel));

    changeCardDetailColors(featureCardNodes);
    setupInitialCardState(featureCardNodes);

    setupControlButtons();
    setupSubfeatureButtons();
    setupExpandButtons();

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
        cardList.slice(1).forEach(cardNode => setFeatureNodeAsInactive(cardNode));
    }

    function setFeatureNodeAsInactive(card) {
        console.log(`setFeatureNodeAsInactive`, card.getAttribute(Attributes.FeatureId));
        card.setAttribute(Attributes.Inactive, '');
    }

    function setFeatureNodeAsActive(card) {
        console.log(`setFeatureNodeAsActive`, card.getAttribute(Attributes.FeatureId));
        card.removeAttribute(Attributes.Inactive);
    }

    function getFeatureCardNodeById(featureId) {
        return featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === featureId);
    }

    function setFeatureIdAsInactive(featureId) {
        setFeatureNodeAsInactive( getFeatureCardNodeById(featureId) );
    }

    function setFeatureIdAsActive(featureId) {
        setFeatureNodeAsActive( getFeatureCardNodeById(featureId) );
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
            let index = findActiveIndex();
            index++;
            if (index >= topLevelFeatureCardNodes.length)
                index = topLevelFeatureCardNodes.length - 1;

            setIndexToActive(index);
        }, false);

        document.querySelector('.js-previous-button').addEventListener('click', function() {
            let index = findActiveIndex();
            index--;
            if (index <= 0)
                index = 0;

            setIndexToActive(index);
        }, false);
    }

    function findActiveIndex() {
        return topLevelFeatureCardNodes.findIndex(cardNode => !cardNode.hasAttribute(Attributes.Inactive));
    }

    function setIndexToActive(newActiveIndex) {
        topLevelFeatureCardNodes.forEach((node, index) => {
            if (newActiveIndex === index)
                setFeatureNodeAsActive(node);
            else
                setFeatureNodeAsInactive(node);
        });
    }

    function getCoreCardValueList(coreButtonList) {
        coreButtonList.map(coreButton => coreButton.outerText);
    }

    function setupSubfeatureButtons() {
        Array.from( document.querySelectorAll('.js-subfeature-button') ).forEach(button => {
            button.addEventListener('click', subfeatureButtonClicked, false);
        });
    }

    function subfeatureButtonClicked(event) {
        const featureId = this.getAttribute(Attributes.FeatureRef);
        const featureNode = getFeatureCardNodeById(featureId);
        Array.from( featureNode.parentNode.querySelectorAll(`[${Attributes.FeatureId}]`) )
            .forEach(node => setFeatureNodeAsInactive(node));
        setFeatureNodeAsActive(featureNode);
        collapseParentFeatures(featureNode);
    }

    function collapseParentFeatures(featureNode) {
        const parentId = featureNode.getAttribute(Attributes.ParentFeatureId);
        if (parentId) {
            const parentNode = featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === parentId);
            parentNode.classList.add(Classes.CardCollapsed);
            collapseParentFeatures(parentNode);
        }
    }

    function setupExpandButtons() {
        Array.from( document.querySelectorAll('.js-expand-button') )
            .forEach(button => {
                button.addEventListener('click', expandButtonClicked, false)
            });
    }

    function expandButtonClicked(event) {
        const featureId = this.getAttribute(Attributes.FeatureRef);
        featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === featureId)
            .classList.remove(Classes.CardCollapsed);
        setChildFeaturesInactive(featureId);
    }

    function setChildFeaturesInactive(featureId) {
        featureCardNodes.filter(node => {
            const parentFeatureId = node.getAttribute(Attributes.ParentFeatureId);
            if (parentFeatureId)
                return parentFeatureId === featureId;
            return false;
        }).forEach(childNode => {
            setFeatureNodeAsInactive(childNode);
            setChildFeaturesInactive(childNode.getAttribute(Attributes.FeatureId));
        });
    }
}