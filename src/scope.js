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
    return data.features.map(featureDatum => {
        const {
            name,
            category = null,
            status = DefaultStatus,
            description
        } = featureDatum;

        return {
            name,
            category,
            status: checkIfStatusIsValid(status) ? status : DefaultStatus,
            description
        };
    });
}

function validate(data) {
    validateFeaturesExist(data);
    data.features.forEach(validateFeature);
}

function validateFeature(featureDatum, index) {
    validateFeatureProperty(featureDatum, `name`, index);
    validateFeatureProperty(featureDatum, `description`, index);
    validateFeatureProperty(featureDatum, `whenComplete`, index);
    validateWhenComplete(featureDatum, index);
}

function validateFeaturesExist(data) {
    if (!data.features)
        throw `Data does not contain features`;
}

function validateFeatureProperty(feature, property, index) {
    if (!feature[property])
        throw `${property} missing on feature with index ${index}`;
}

function validateWhenComplete(featureDatum, index) {
    const isValidWhenComplete = checkIfWhenCompleteIsValid(featureDatum.whenComplete);
    if (!isValidWhenComplete)
        throw `whenComplete is invalid on feature with index ${index}`;
}

function checkIfWhenCompleteIsValid(whenComplete) {
    return Object.keys(WhenCompleteEnum).map(key => WhenCompleteEnum[key]).indexOf(whenComplete) > -1;
}

function checkIfStatusIsValid(status) {
    return Object.keys(StatusEnum).map(key => StatusEnum[key]).indexOf(status) > -1;
}

module.exports = {process};