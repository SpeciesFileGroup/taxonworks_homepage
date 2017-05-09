const WhenCompleteEnum = {
    Now: `now`,
    ComingThisYear: `this_year`,
    ComingNextYear: `next_year`,
    WithinTheNextThreeYears: `three_year`
};

const StatusEnum = {
    Complete: `complete`,
    InProgress: `in_progress`,
    Upcoming: `upcoming`
};

const DefaultStatus = StatusEnum.Upcoming;

const WhenCompleteTemplate = {
    [WhenCompleteEnum.Now]: "Now",
    [WhenCompleteEnum.ComingThisYear]: "This year",
    [WhenCompleteEnum.ComingNextYear]: "Next year",
    [WhenCompleteEnum.WithinTheNextThreeYears]: "Within the next three years"
};

const StatusTemplate = {
    [StatusEnum.Complete]: "Complete",
    [StatusEnum.InProgress]: "In Progress",
    [StatusEnum.Upcoming]: "Upcoming"
};

function process(data) {
    validate(data);
    return data.features.map(transformFeature);
}

function validate(data) {
    validateFeaturesExist(data);
    data.features.forEach(validateFeature);
}

function transformFeature(featureDatum) {
    const {
        name,
        status = DefaultStatus,
        description,
        features = [],
        whenComplete
    } = featureDatum;

    const statusAfterCheck = checkIfStatusIsValid(status) ? status : DefaultStatus;
    const id = generateProbablyUniqueId();

    return {
        id,
        name,
        status: statusAfterCheck,
        description,
        whenComplete,
        features: features.map(transformFeature),
        templateStatus: StatusTemplate[statusAfterCheck],
        templateWhenComplete: WhenCompleteTemplate[whenComplete]
    };
}

function validateFeature(featureDatum) {
    validateFeatureProperty(featureDatum, `name`);
    validateFeatureProperty(featureDatum, `description`);
    validateFeatureProperty(featureDatum, `whenComplete`);
    validateWhenComplete(featureDatum);
    if (featureDatum.features)
        featureDatum.features.forEach(validateFeature);
}

function validateFeaturesExist(data) {
    if (!data.features)
        throw `Data does not contain features`;
}

function validateFeatureProperty(feature, property) {
    if (!feature[property])
        throw `${property} missing on feature ${getFeatureMessageForError(feature)}`;
}

function validateWhenComplete(featureDatum) {
    const isValidWhenComplete = checkIfWhenCompleteIsValid(featureDatum.whenComplete);
    if (!isValidWhenComplete)
        throw `whenComplete is invalid on feature ${getFeatureMessageForError(featureDatum)}`;
}

function checkIfWhenCompleteIsValid(whenComplete) {
    return Object.keys(WhenCompleteEnum).map(key => WhenCompleteEnum[key]).indexOf(whenComplete) > -1;
}

function checkIfStatusIsValid(status) {
    return Object.keys(StatusEnum).map(key => StatusEnum[key]).indexOf(status) > -1;
}

function getFeatureMessageForError(feature) {
    const clonedFeature = Object.assign({}, feature);
    const subFeatureLength = feature.features.length;

    delete clonedFeature.features;

    return `${buildFeatureMessageWithoutFeatures(clonedFeature)},"features":Array(${subFeatureLength})}`;

    function buildFeatureMessageWithoutFeatures(feature) {
        const featureMessage = JSON.stringify(feature);
        return featureMessage.substring(0, featureMessage.length - 1);
    }
}

function generateProbablyUniqueId() {
    return `id-${(0 | Math.random() * 9e6).toString(36)}`;
}

module.exports = {process, getFeatureMessageForError};