const expect = require('chai').expect;
const deepFreeze = require('deep-freeze');
const scope = require('../scope');

function makeMockData() {
    return {
        features: [
            {
                name: 'Nomenclature',
                status: 'upcoming',
                description: 'Curate all levels of nomenclature with specific reference to the governing codes of nomenclature, plants and animals are covered. Rich and deep coverage of nomenclatural rules are included to ensure adequate metadata are provided. Produce highly annotated nomenclatural catalogs for print.',
                whenComplete: 'this_year',
                features: [
                    makeMockFeature()
                ],
            },
            {
                name: 'Taxon, specimen and anatomical descriptions',
                status: 'upcoming',
                description: 'Make descriptions and take notes using free-text, qualitative, quantitative (including measurements), or rich semantic data.',
                whenComplete: 'three_year',
                features: [
                    makeMockFeature(),
                    makeMockFeature()
                ],
            },
            {
                name: 'Jimmy Buckets',
                status: "in_progress",
                description: "Jimmy Gets Buckets",
                whenComplete: "now",
                features: [
                    makeMockFeature({
                        name: 'Kleenex',
                        status: 'upcoming',
                        description: 'Blow your nose.',
                        whenComplete: 'this_year',
                        features: [makeMockFeature()],
                    }),
                    makeMockFeature(),
                    makeMockFeature()
                ],
            },
            {
                name: "Michael Jordan",
                status: "complete",
                description: "His Airness",
                whenComplete: "next_year",
                features: [
                    makeMockFeature()
                ],
            }
        ]
    };
}

function mockFrozenData() {
    const data = makeMockData();
    deepFreeze(data);
    return data;
}

function makeMockFeature({ name = 'Nomenclature', status = 'upcoming', description = "foo", whenComplete = 'this_year', features = [] } = {}) {
    return { name, status, description, whenComplete, features };
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
            const data = makeMockData();

            const feature = getRandomFeature(data.features);

            delete feature.name;
            const errorFn = _ => {
                scope.process(data);
            };

            expect(errorFn).to.throw(`name missing on feature ${scope.getFeatureMessageForError(feature)}`);
        });

        it(`should require a description`, () => {
            const data = makeMockData();

            const feature = getRandomFeature(data.features);

            delete feature.description;
            const errorFn = _ => {
                scope.process(data);
            };
            expect(errorFn).to.throw(`description missing on feature ${scope.getFeatureMessageForError(feature)}`);
        });

        it(`should have a completion deadline`, () => {
            const data = makeMockData();

            const feature = getRandomFeature(data.features);

            delete feature.whenComplete;
            const errorFn = _ => {
                scope.process(data);
            };
            expect(errorFn).to.throw(`whenComplete missing on feature ${scope.getFeatureMessageForError(feature)}`);
        });

        it(`should only accept valid deadlines`, () => {
            const validData = makeMockData();
            const invalidData = makeMockData();

            const invalidFeature = makeMockFeature({ whenComplete: Math.random().toString(36) });

            invalidData.features = [...invalidData.features, invalidFeature];

            const validFn = _ => {
                scope.process(validData);
            };

            const errorFn = _ => {
                scope.process(invalidData);
            };

            expect(validFn).to.not.throw();
            expect(errorFn).to.throw(`whenComplete is invalid on feature ${scope.getFeatureMessageForError(invalidFeature)}`);
        });

        it(`should validate features recursively`, () => {
            const mockData = makeMockData();

            delete mockData.features[2].features[0].features[0].name;

            const errorFn = _ => {
                scope.process(mockData);
            };

            expect(errorFn).to.throw();
        });

        it(`should only check sub-features if they are set`, () => {
            const mockData = makeMockData();

            delete mockData.features[2].features[0].features[0].features;

            const errorFn = _ => {
                scope.process(mockData);
            };

            expect(errorFn).to.not.throw();
        });
    });

    describe('error logging helpers', _ => {
        it(`should print error messages without sub-feature arrays`, () => {
            const feature = makeMockFeature({
                features: [
                    makeMockFeature(),
                    makeMockFeature()
                ]
            });

            const expectedMessage = `{"name":"Nomenclature","status":"upcoming","description":"foo","whenComplete":"this_year","features":Array(2)}`;

            expect(scope.getFeatureMessageForError(feature)).to.equal(expectedMessage);
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

        it(`should copy the status, defaulting to upcoming if none is given`, () => {
            const data = makeMockData();
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
                    makeMockFeature({ status: 'in_progress' }),
                    makeMockFeature({ status: 'complete' }),
                    makeMockFeature({ status: Math.random().toString(36) }),
                    makeMockFeature({ status: Math.random().toString(36) })
                ]
            };

            const expectedStatuses = ['in_progress', 'complete', 'upcoming', 'upcoming'];

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.status).to.equal(expectedStatuses[index]);
            });
        });

        it(`should copy whenComplete`, () => {
            const data = makeMockData();

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.whenComplete).to.equal(data.features[index].whenComplete);
            });
        });

        it(`should have a description property on each feature`, () => {
            const data = mockFrozenData();

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.description).to.equal(data.features[index].description);
            });
        });

        it(`should transform features recursively`, () => {
            const data = mockFrozenData();

            const actual = scope.process(data);

            actual.forEach((actualFeature, index) => {
                expect(actualFeature.features.length).to.equal(data.features[index].features.length);

                actualFeature.features.forEach((actualSubFeature, subIndex) => {
                    expect(actualSubFeature.features.length).to.equal(data.features[index].features[subIndex].features.length);
                });
            });
        });

        it(`should transform status and whenComplete for templates`, () => {
            const data = mockFrozenData();

            const actual = scope.process(data);

            expect(actual[0].templateStatus).to.equal(`Upcoming`);
            expect(actual[2].templateStatus).to.equal(`In Progress`);
            expect(actual[3].templateStatus).to.equal(`Complete`);

            expect(actual[0].templateWhenComplete).to.equal(`This year`);
            expect(actual[1].templateWhenComplete).to.equal(`Within the next three years`);
            expect(actual[2].templateWhenComplete).to.equal(`Now`);
            expect(actual[3].templateWhenComplete).to.equal(`Next year`);
        });
    });
});

function getRandomIndexOfFeature(features) {
    return Math.floor((Math.random() * features.length));
}

function getRandomFeature(features) {
    return features[getRandomIndexOfFeature(features)];
}