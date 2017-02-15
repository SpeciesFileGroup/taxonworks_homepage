const expect = require('chai').expect;
const deepFreeze = require('deep-freeze');
const scope = require('../scope');

function mockData() {
    return {
        features: [
            {
                name: 'Nomenclature',
                status: 'upcoming',
                description: 'Curate all levels of nomenclature with specific reference to the governing codes of nomenclature, plants and animals are covered. Rich and deep coverage of nomenclatural rules are included to ensure adequate metadata are provided. Produce highly annotated nomenclatural catalogs for print.',
                whenComplete: 'this_year'
            },
            {
                name: 'Taxon, specimen and anatomical descriptions',
                status: 'upcoming',
                description: 'Make descriptions and take notes using free-text, qualitative, quantitative (including measurements), or rich semantic data.',
                whenComplete: 'three_year'
            },
            {
                name: 'Jimmy Buckets',
                category: 'basketball',
                status: "in_progress",
                description: "Jimmy Gets Buckets",
                whenComplete: "now"
            },
            {
                name: "Michael Jordan",
                category: 'basketball',
                status: "complete",
                description: "His Airness",
                whenComplete: "next_year"
            }
        ]
    };
}

function mockFrozenData() {
    const data = mockData();
    deepFreeze(data);
    return data;
}

function mockFeature({ name = 'Nomenclature', status = 'upcoming', description = "foo", whenComplete = 'this_year', category = null } = {}) {
    return { name, status, description, whenComplete, category };
}

describe(`the scope content model`, () => {
    describe(`validating features`, () => {
        it(`should have a feature list`, () => {
            const data = { foo: `bar` };

            const errorFn = _ => {
                scope.process(data);
            };

            expect(errorFn).to.throw(`Data does not contain features`);
        });

        it(`should require the name`, () => {
            const data = mockData();

            const indexOfFeatureWithoutName = getRandomIndexOfFeature(data.features);

            delete data.features[indexOfFeatureWithoutName].name;
            const errorFn = _ => {
                scope.process(data);
            };

            expect(errorFn).to.throw(`name missing on feature with index ${indexOfFeatureWithoutName}`);
        });

        it(`should require a description`, () => {
            const data = mockData();
            const indexOfFeatureWithoutDescription = getRandomIndexOfFeature(data.features);
            delete data.features[indexOfFeatureWithoutDescription].description;
            const errorFn = _ => {
                scope.process(data);
            };
            expect(errorFn).to.throw(`description missing on feature with index ${indexOfFeatureWithoutDescription}`);
        });

        it(`should have a completion deadline`, () => {
            const data = mockData();
            const indexOfFeatureWithoutDeadline = getRandomIndexOfFeature(data.features);
            delete data.features[indexOfFeatureWithoutDeadline].whenComplete;
            const errorFn = _ => {
                scope.process(data);
            };
            expect(errorFn).to.throw(`whenComplete missing on feature with index ${indexOfFeatureWithoutDeadline}`);
        });

        it(`should only accept valid deadlines`, () => {
            const validData = mockData();
            const invalidData = mockData();

            const invalidFeature = mockFeature({ whenComplete: Math.random().toString(36) });

            invalidData.features = [...invalidData.features, invalidFeature];

            const expectedErrorIndex = invalidData.features.length - 1;

            const validFn = _ => {
                scope.process(validData);
            };

            const errorFn = _ => {
                scope.process(invalidData);
            };

            expect(validFn).to.not.throw();
            expect(errorFn).to.throw(`whenComplete is invalid on feature with index ${expectedErrorIndex}`);
        });
    });

    describe(`transforming the features`, () => {
        it(`should return an array`, () => {
            const data = mockFrozenData();

            const expectedLength = data.features.length;
            const actual = scope.process(data);

            expect(actual).to.be.an(`array`)
                .and.to.have.lengthOf(expectedLength)
                .and.to.not.equal(data.features);
        });

        it(`should not copy features`, () => {
            const data = mockFrozenData();

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature).to.not.equal(data.features[index]);
            });
        });

        it(`should have a name property on each feature`, () => {
            const data = mockFrozenData();

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.name).to.equal(data.features[index].name);
            });
        });

        it(`should have a category property if one is given; else category is null`, () => {
            const data = mockFrozenData();

            const actual = scope.process(data);

            const expectedCategories = [null, null, `basketball`, `basketball`];
            actual.forEach((actualFeature, index) => {
                expect(actualFeature.category).to.equal(expectedCategories[index]);
            });
        });

        it(`should copy the status, defaulting to upcoming if none is given`, () => {
            const data = mockData();
            delete data.features[2].status;

            const expectedStatuses = [
                'upcoming',
                'upcoming',
                'upcoming',
                'complete'
            ];

            deepFreeze(data);

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.status).to.equal(expectedStatuses[index]);
            });
        });

        it(`should set status to upcoming if a value not in the enum is given`, () => {
            const data = {
                features: [
                    mockFeature({ status: 'in_progress' }),
                    mockFeature({ status: 'complete' }),
                    mockFeature({ status: Math.random().toString(36) }),
                    mockFeature({ status: Math.random().toString(36) })
                ]
            };

            const expectedStatuses = ['in_progress', 'complete', 'upcoming', 'upcoming'];

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.status).to.equal(expectedStatuses[index]);
            });
        });

        it(`should have a description property on each feature`, () => {
            const data = mockFrozenData();

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.description).to.equal(data.features[index].description);
            });
        });
    });
});

function getRandomIndexOfFeature(features) {
    return Math.floor((Math.random() * features.length));
}