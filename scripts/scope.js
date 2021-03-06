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
        FeatureCore: 'feature-core',
        CardCollapsed: 'feature-card--collapsed',
        ExpandButtonContainer: 'feature-card__expand-button-container',
        CardContent: 'feature-card__content',
        ExpandTopBorder: 'expand-button__top-border',
        ExpandRightBorder: 'expand-button__right-border',
        ExpandLeftBorder: 'expand-button__left-border',
        ExpandBottomLeftBorder: 'expand-button__bottom-left-border',
        ExpandBottomRightBorder: 'expand-button__bottom-right-border',
        Connector: 'expand-button__connector',
        FeatureTopLine: 'feature-card__top-border-line',
        FeatureDotActive: 'feature-core__dot--active',
        FeatureMenuButtonActive: 'feature-core__feature-menu-button--active-feature'
    };

    const ScrollTopOffset = 80; //For navbar
    const ScrollDurationInFrames = 16;
    const TopLevelCardDuration = 300;
    const TopLevelCardDelay = 0;

    const featureCardNodes = Array.from(document.querySelectorAll(`[${Attributes.FeatureId}]`));
    const topLevelFeatureCardNodes = featureCardNodes.filter(node => node.hasAttribute(Attributes.TopLevel));
    const topLevelFeatureDots = Array.from( document.querySelectorAll('.js-feature-dot') );
    const featureMenuButtonNodes = Array.from( document.querySelectorAll('.js-feature-menu-button') );
    const featureCoreNode = document.querySelector(`.${Classes.FeatureCore}`);

    changeCardDetailColors(featureCardNodes);
    setupInitialCardState(featureCardNodes);

    setupControlButtons();
    setupFeatureCoreSwiping();
    setupSubfeatureButtons();
    setupExpandButtons();
    setupFeatureMenuButtons();
    updateFeatureMenuButtonState();
    updateFeatureDotState();

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

    function setupControlButtons() {
        document.querySelector('.js-next-button').addEventListener('click', goToNextTopLevelFeature, false);
        document.querySelector('.js-previous-button').addEventListener('click', goToPreviousTopLevelFeature, false);
    }

    function goToNextTopLevelFeature() {
        let index = findActiveIndex();

        if (index < topLevelFeatureCardNodes.length - 1) {
            const cardGoingOut = topLevelFeatureCardNodes[index];
            index++;
            const cardGoingIn = topLevelFeatureCardNodes[index];

            transitionCardsFromRight(cardGoingOut, cardGoingIn);

            setIndexToActive(index);
        }
    }

    function goToPreviousTopLevelFeature() {
        let index = findActiveIndex();

        if (index > 0) {
            const cardGoingOut = topLevelFeatureCardNodes[index];
            index--;
            const cardGoingIn = topLevelFeatureCardNodes[index];

            transitionCardsFromLeft(cardGoingOut, cardGoingIn);

            setIndexToActive(index);
        }
    }

    function transitionCardsFromRight(cardGoingOut, cardGoingIn) {
        lockCoreHeight();

        transitionCardOutToLeft( cardGoingOut );
        transitionCardInFromRight( cardGoingIn, afterTopLevelAnimation);
    }

    function transitionCardsFromLeft(cardGoingOut, cardGoingIn) {
        lockCoreHeight();

        transitionCardOutToRight( cardGoingOut );
        transitionCardInFromLeft( cardGoingIn, afterTopLevelAnimation);
    }

    function findActiveIndex() {
        return topLevelFeatureCardNodes.findIndex(cardNode => !cardNode.hasAttribute(Attributes.Inactive));
    }

    function afterTopLevelAnimation() {
        cleanUpTopLevelFeatureCards();
        unlockCoreHeight();
    }

    function setIndexToActive(newActiveIndex) {
        topLevelFeatureCardNodes.forEach((node, index) => {
            if (newActiveIndex === index)
                setFeatureNodeAsActive(node);
            else
                setFeatureNodeAsInactive(node);
        });
        updateFeatureDotState();
    }

    function transitionCardOutToLeft(featureCard) {
        transitionCardOut(featureCard, '-150%');
    }

    function transitionCardOutToRight(featureCard) {
        transitionCardOut(featureCard, '150%');
    }

    function transitionCardOut(featureCard, endX) {
        setUpCardForAnimation(featureCard);
        anime({
            targets: featureCard,
            translateX: ['0%', endX],
            duration: TopLevelCardDuration,
            easing: 'easeInOutQuad'
        });
    }

    function transitionCardInFromRight(featureCard, callback) {
        transitionCardIn(featureCard, `150%`, callback);
    }

    function transitionCardInFromLeft(featureCard, callback) {
        transitionCardIn(featureCard, '-150%', callback);
    }

    function transitionCardIn(featureCard, startingX, callback) {
        setUpCardForAnimation(featureCard, startingX);
        anime({
            targets: featureCard,
            translateX: [startingX, '0'],
            duration: TopLevelCardDuration,
            delay: TopLevelCardDelay,
            easing: 'easeInOutQuad',
            complete: callback
        });
    }

    function setUpCardForAnimation(featureCard, startingX = 0) {
        featureCard.style.transform = `translateX(${startingX})`;
        featureCard.style.display = 'block';
        featureCard.style.position = 'absolute';
        featureCard.style.top = 0;
        featureCard.style.left = 0;
        featureCard.style.right = 0;
    }

    function cleanUpTopLevelFeatureCards() {
        topLevelFeatureCardNodes.forEach(node => {
            node.style.transform = '';
            node.style.display = '';
            node.style.position = '';
            node.style.top = '';
            node.style.left = '';
            node.style.right = '';
        });
    }

    function setupFeatureCoreSwiping() {
        const hammer = new Hammer(featureCoreNode);
        hammer.on('swipe', onFeatureCoreSwipe);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    }

    function onFeatureCoreSwipe(event) {
        if (event.direction === Hammer.DIRECTION_LEFT)
            goToNextTopLevelFeature();
        else if (event.direction === Hammer.DIRECTION_RIGHT)
            goToPreviousTopLevelFeature();
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
        lockCoreHeight();
        transitionToCollapsed(getParentFeatureNode(featureNode), _ => {
            setFeatureNodeAsActive(featureNode);
            transitionFeatureToActive(featureNode, _ => {
                unlockCoreHeight();
            });
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
            })
            .add({
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
            })
            .add({
                targets: expandButtonContainerNode,
                opacity: [0, 1],
                easing: 'easeInOutQuart',
                duration: 150,
                offset: 200
            })
            .add({
                targets: expandTopBorder,
                scaleX: [0, 1],
                easing: 'easeInOutQuart',
                duration: 100,
                offset: 250
            })
            .add({
                targets: expandLeftBorder,
                scaleY: [0, 1],
                easing: 'easeInOutQuart',
                duration: 50,
                offset: 350
            })
            .add({
                targets: expandRightBorder,
                scaleY: [0, 1],
                easing: 'easeInOutQuart',
                duration: 50,
                offset: 350
            })
            .add({
                targets: expandBottomLeftBorder,
                scaleX: [0, 1],
                easing: 'easeInOutQuart',
                duration: 50,
                offset: 400
            })
            .add({
                targets: expandBottomRightBorder,
                scaleX: [0, 1],
                easing: 'easeInOutQuart',
                duration: 50,
                offset: 400
            })
            .add({
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

    function transitionFeatureToActive(featureNode, callback) {
        lockCoreHeight();
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
                offset: 75,
                complete: function() {
                    callback();
                }
            });
    }

    function lockCoreHeight() {
        featureCoreNode.style.minHeight = '';
        const height = featureCoreNode.getBoundingClientRect().height;
        featureCoreNode.style.minHeight = `${height}px`;
    }

    function unlockCoreHeight() {
        featureCoreNode.style.minHeight = '';
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
        const featureNode = featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === featureId);
        expandFeature( featureNode );
        scrollTo(featureNode);
    }

    function expandFeature(featureNode) {
        featureNode.classList.remove(Classes.CardCollapsed);
        resetChildFeatures( featureNode.getAttribute(Attributes.FeatureId) );
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

    function setupFeatureMenuButtons() {
        featureMenuButtonNodes.forEach(node => {
            node.addEventListener('click', featureMenuButtonClicked, false);
        });
    }

    function featureMenuButtonClicked(event) {
        const featureIdToActivate = this.getAttribute(Attributes.FeatureRef);
        const featureIndexOfCardToActivate = topLevelFeatureCardNodes
            .findIndex(node => node.getAttribute(Attributes.FeatureId) === featureIdToActivate);
        const activeFeatureCard = topLevelFeatureCardNodes
            .find(node => !node.hasAttribute(Attributes.Inactive));
        const activeFeatureIndex = topLevelFeatureCardNodes
            .findIndex(node => !node.hasAttribute(Attributes.Inactive));
        const featureCardToActivate = topLevelFeatureCardNodes
            .find(node => node.getAttribute(Attributes.FeatureId) === featureIdToActivate);

        if (activeFeatureIndex < featureIndexOfCardToActivate)
            transitionCardsFromRight(activeFeatureCard, featureCardToActivate);
        else if (activeFeatureIndex > featureIndexOfCardToActivate)
            transitionCardsFromLeft(activeFeatureCard, featureCardToActivate);

        activeFeatureIdAndDeactivateAllOthers(featureIdToActivate);

        updateFeatureMenuButtonState();
    }

    function activeFeatureIdAndDeactivateAllOthers(featureIdToActivate) {
        topLevelFeatureCardNodes.forEach(node => {
            if (node.getAttribute(Attributes.FeatureId) === featureIdToActivate) {
                setFeatureNodeAsActive(node);
                expandFeature(node);
            } else
                setFeatureNodeAsInactive(node);
        });
    }

    function updateFeatureMenuButtonState() {
        const activeTopLevelId = topLevelFeatureCardNodes
            .find(node => !node.hasAttribute(Attributes.Inactive)).getAttribute(Attributes.FeatureId);

        featureMenuButtonNodes.forEach(node => {
            if (node.getAttribute(Attributes.FeatureRef) === activeTopLevelId)
                node.classList.add(Classes.FeatureMenuButtonActive);
            else
                node.classList.remove(Classes.FeatureMenuButtonActive);
        });
    }

    function updateFeatureDotState() {
        topLevelFeatureCardNodes.forEach(node => {
            const active = !node.hasAttribute(Attributes.Inactive);
            const dotNode = getFeatureDot(node.getAttribute(Attributes.FeatureId));
            if (active)
                dotNode.classList.add(Classes.FeatureDotActive);
            else
                dotNode.classList.remove(Classes.FeatureDotActive);
        });
    }

    function getFeatureDot(featureId) {
        return topLevelFeatureDots.find(node => {
            return node.getAttribute(Attributes.FeatureRef) === featureId;
        });
    }
}