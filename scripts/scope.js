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
        CardCollapsed: 'feature-card--collapsed',
        ExpandButtonContainer: 'feature-card__expand-button-container',
        CardContent: 'feature-card__content',
        ExpandTopBorder: 'expand-button__top-border',
        ExpandRightBorder: 'expand-button__right-border',
        ExpandLeftBorder: 'expand-button__left-border',
        ExpandBottomLeftBorder: 'expand-button__bottom-left-border',
        ExpandBottomRightBorder: 'expand-button__bottom-right-border',
        Connector: 'expand-button__connector',
        FeatureTopLine: 'feature-card__top-border-line'
    };

    const ScrollTopOffset = 80; //For navbar

    const ScrollDurationInFrames = 16;

    const featureCardNodes = Array.from(document.querySelectorAll(`[${Attributes.FeatureId}]`));
    const topLevelFeatureCardNodes = featureCardNodes.filter(node => node.hasAttribute(Attributes.TopLevel));

    changeCardDetailColors(featureCardNodes);
    setupInitialCardState(featureCardNodes);

    setupControlButtons();
    setupSubfeatureButtons();
    setupExpandButtons();

    function changeCardDetailColors(cardList) {
        for (var i = 0; i < cardList.length; i++) {
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

        if (cardLabelValue === 'Upcoming') {
            cardLabelElement.className += ' status-upcoming';
        }
        else if (cardLabelValue === 'In Progress') {
            cardLabelElement.className += ' status-in-progress';
        }
        else if (cardLabelValue === 'Complete') {
            cardLabelElement.className += ' status-complete';
        }

    }

    function setAvailableColor(card) {
        const cardLabelElement = card.querySelector('.feature-card__available-value');

        addAvailableColorClass(cardLabelElement);

    }

    function addAvailableColorClass(cardLabelElement) {
        const cardLabelValue = cardLabelElement.innerHTML;

        if (cardLabelValue === 'Within the next three years' || cardLabelValue === 'Next year') {
            cardLabelElement.className += ' available-next-or-three-years';
        }
        else if (cardLabelValue === 'This year') {
            cardLabelElement.className += ' available-this-year';
        }
        else if (cardLabelValue === 'Now') {
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
        card.setAttribute(Attributes.Inactive, '');
    }

    function setFeatureNodeAsActive(card) {
        card.removeAttribute(Attributes.Inactive);
    }

    function getFeatureCardNodeById(featureId) {
        return featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === featureId);
    }

    function setFeatureIdAsInactive(featureId) {
        setFeatureNodeAsInactive(getFeatureCardNodeById(featureId));
    }

    function setFeatureIdAsActive(featureId) {
        setFeatureNodeAsActive(getFeatureCardNodeById(featureId));
    }

    function setupCoreButtonEventListeners(coreButtonList, cardList, cardValueList) {
        for (i = 0; i < coreButtonList.length; i++) {
            coreButtonList[i].addEventListener("click", function() {
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
        Array.from(document.querySelectorAll('.js-subfeature-button')).forEach(button => {
            button.addEventListener('click', subfeatureButtonClicked, false);
        });
    }

    function subfeatureButtonClicked(event) {
        const featureId = this.getAttribute(Attributes.FeatureRef);
        const featureNode = getFeatureCardNodeById(featureId);
        Array.from(featureNode.parentNode.querySelectorAll(`[${Attributes.FeatureId}]`))
            .forEach(node => setFeatureNodeAsInactive(node));
        scrollToParent(featureNode);
        transitionToCollapsed(getParentFeatureNode(featureNode), _ => {
            setFeatureNodeAsActive(featureNode);
            transitionFeatureToActive(featureNode);
        });
    }

    function collapseFeature(featureNode) {
        featureNode.classList.add(Classes.CardCollapsed);
    }

    function transitionToCollapsed(featureNode, callback) {
        const expandButtonContainerNode = featureNode.querySelector(`.${Classes.ExpandButtonContainer}`);
        expandButtonContainerNode.style.display = 'block';
        const expandButtonContainerHeight = expandButtonContainerNode.getBoundingClientRect().height;

        const featureContentNode = featureNode.querySelector(`.${Classes.CardContent}`);

        const expandTopBorder = expandButtonContainerNode.querySelector(`.${Classes.ExpandTopBorder}`);
        const expandRightBorder = expandButtonContainerNode.querySelector(`.${Classes.ExpandRightBorder}`);
        const expandLeftBorder = expandButtonContainerNode.querySelector(`.${Classes.ExpandLeftBorder}`);
        const expandBottomLeftBorder = expandButtonContainerNode.querySelector(`.${Classes.ExpandBottomLeftBorder}`);
        const expandBottomRightBorder = expandButtonContainerNode.querySelector(`.${Classes.ExpandBottomRightBorder}`);

        const connector = expandButtonContainerNode.querySelector(`.${Classes.Connector}`);

        expandTopBorder.style.transform = 'scaleX(0)';
        expandLeftBorder.style.transform = 'scaleY(0)';
        expandRightBorder.style.transform = 'scaleY(0)';
        expandBottomLeftBorder.style.transform = 'scaleX(0)';
        expandBottomRightBorder.style.transform = 'scaleX(0)';
        connector.style.transform = 'scaleY(0)';

        anime.timeline()
            .add({
                targets: featureNode,
                height: expandButtonContainerHeight,
                easing: 'easeInOutQuart',
                duration: 200,
                offset: 0
            }).add({
            targets: featureContentNode,
            opacity: 0,
            easing: 'easeInOutQuart',
            duration: 200,
            offset: 0,
            complete: function() {
                collapseFeature(featureNode);
                featureContentNode.style.opacity = '';
                expandButtonContainerNode.style.display = '';
            }
        }).add({
            targets: expandButtonContainerNode,
            opacity: [0, 1],
            easing: 'easeInOutQuart',
            duration: 150,
            offset: 200
        }).add({
            targets: expandTopBorder,
            scaleX: [0, 1],
            easing: 'easeInOutQuart',
            duration: 100,
            offset: 250
        }).add({
            targets: expandLeftBorder,
            scaleY: [0, 1],
            easing: 'easeInOutQuart',
            duration: 50,
            offset: 350
        }).add({
            targets: expandRightBorder,
            scaleY: [0, 1],
            easing: 'easeInOutQuart',
            duration: 50,
            offset: 350
        }).add({
            targets: expandBottomLeftBorder,
            scaleX: [0, 1],
            easing: 'easeInOutQuart',
            duration: 50,
            offset: 400
        }).add({
            targets: expandBottomRightBorder,
            scaleX: [0, 1],
            easing: 'easeInOutQuart',
            duration: 50,
            offset: 400
        }).add({
            targets: connector,
            scaleY: [0, 1],
            easing: 'easeInOutQuart',
            duration: 50,
            offset: 450,
            complete: function() {
                featureNode.style.height = '';
                callback();
            }
        });
    }

    function transitionFeatureToActive(featureNode) {
        const height = featureNode.getBoundingClientRect().height;
        const topLineNode = featureNode.querySelector(`.${Classes.FeatureTopLine}`);

        topLineNode.style.transform = 'scaleX(0)';

        anime.timeline()
            .add({
                targets: featureNode,
                height: [0, height],
                easing: 'easeInOutQuart',
                duration: 250,
                complete: function() {
                    featureNode.style.height = '';
                }
            })
            .add({
                targets: topLineNode,
                scaleX: [0, 1],
                easing: 'easeInOutQuart',
                duration: 250,
                offset: 75
            });
    }

    function getParentFeatureNode(featureNode) {
        const parentId = featureNode.getAttribute(Attributes.ParentFeatureId);
        return featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === parentId);
    }

    function setupExpandButtons() {
        Array.from(document.querySelectorAll('.js-expand-button'))
            .forEach(button => {
                button.addEventListener('click', expandButtonClicked, false)
            });
    }

    function expandButtonClicked(event) {
        const featureId = this.getAttribute(Attributes.FeatureRef);
        const featureCard = featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === featureId);
        featureCard.classList.remove(Classes.CardCollapsed);
        resetChildFeatures(featureId);
        scrollTo(featureCard);
    }

    function resetChildFeatures(featureId) {
        featureCardNodes.filter(node => {
            const parentFeatureId = node.getAttribute(Attributes.ParentFeatureId);
            if (parentFeatureId)
                return parentFeatureId === featureId;
            return false;
        }).forEach(childNode => {
            setFeatureNodeAsInactive(childNode);
            childNode.classList.remove(Classes.CardCollapsed);
            resetChildFeatures(childNode.getAttribute(Attributes.FeatureId));
        });
    }

    function scrollToParent(featureNode) {
        const parentNode = getParentFeatureNode(featureNode);
        if (parentNode)
            scrollTo(parentNode);
    }

    function scrollTo(node) {
        const amountToScroll = node.getBoundingClientRect().top - ScrollTopOffset;
        const scrollRate = amountToScroll / ScrollDurationInFrames;
        scrollABit(amountToScroll, scrollRate);
    }

    function scrollABit(remainingScroll, idealScrollRate) {
        if (remainingScroll !== 0) {
            requestAnimationFrame(function() {
                const scrollOnThisFrame = Math.abs(remainingScroll) > Math.abs(idealScrollRate) ? idealScrollRate : remainingScroll;
                window.scrollBy(0, scrollOnThisFrame);
                remainingScroll -= scrollOnThisFrame;
                scrollABit(remainingScroll, idealScrollRate);
            });
        }
    }
}