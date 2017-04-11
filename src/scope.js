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
        category = null,
        status = DefaultStatus,
        description,
        features = []
    } = featureDatum;

    return {
        name,
        category,
        status: checkIfStatusIsValid(status) ? status : DefaultStatus,
        description,
        features: features.map(transformFeature)
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

    function buildFeatureMessageWithoutFeatures(feature){
        const featureMessage = JSON.stringify(feature);
        return featureMessage.substring(0, featureMessage.length - 1);
    }
}

module.exports = {process, getFeatureMessageForError};