const nunjucks = require('nunjucks');
const constants = require('./src/constants');
const scope = require('./src/scope');
const markdown = require('markdown-it')();

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader(constants.TEMPLATE_DIR));
let savedConfig;

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    function getConfig() {
        if(savedConfig)
            return savedConfig;

        const config = grunt.file.readYAML(constants.HOMEPAGE_YAML);
        if (config.introMarkdown)
            config.introHTML = parseMarkdownFile(config.introMarkdown);
        if (config.benefits1Markdown)
            config.benefits1HTML = parseMarkdownFile(config.benefits1Markdown);
        if (config.benefits2Markdown)
            config.benefits2HTML = parseMarkdownFile(config.benefits2Markdown);
        if (config.benefits3Markdown)
            config.benefits3HTML = parseMarkdownFile(config.benefits3Markdown);
        if (config.benefits4Markdown)
            config.benefits4HTML = parseMarkdownFile(config.benefits4Markdown);
        if (config.benefits5Markdown)
            config.benefits5HTML = parseMarkdownFile(config.benefits5Markdown);
        if (config.scopeMarkdown)
            config.scopeHTML = parseMarkdownFile(config.scopeMarkdown);
        if (config.scopeConfig) {
            try {
                config.scopeFeatures = scope.process(parseYamlFile(config.scopeConfig));
            } catch(error) {
                grunt.fail.fatal(error);
            }
        }
        if (config.gettingStarted1Markdown)
            config.gettingStarted1HTML = parseMarkdownFile(config.gettingStarted1Markdown);
        if (config.gettingStarted2aMarkdown)
            config.gettingStarted2aHTML = parseMarkdownFile(config.gettingStarted2aMarkdown);
        if (config.gettingStarted2bMarkdown)
            config.gettingStarted2bHTML = parseMarkdownFile(config.gettingStarted2bMarkdown);
        if (config.funding)
            config.fundingHTML = parseMarkdownFile(config.funding);
        if (config.disclaimer)
            config.disclaimerHTML = parseMarkdownFile(config.disclaimer);
        if (config.builtBy)
            config.builtByHTML = parseMarkdown(config.builtBy);
        if (config.footerLinksCode)
            config.footerLinksCode = parseYamlFile(config.footerLinksCode);
        if (config.footerLinksContact)
            config.footerLinksContact = parseYamlFile(config.footerLinksContact);
        if (config.footerLinksSocial)
            config.footerLinksSocial = parseYamlFile(config.footerLinksSocial);

        config.sponsors = parseYamlFile(config.sponsorsConfig);
        config.navBarLinks = parseYamlFile(config.navBarLinkListConfig);

        Object.assign(config, constants.templateConstants);

        savedConfig = config;
        return config;

        function parseYamlFile(path) {
            return grunt.file.readYAML(makePathRelativeToConfigDir(path));
        }

        function parseMarkdownFile(path) {
            return markdown.render(grunt.file.read(makePathRelativeToConfigDir(path)));
        }

        function parseMarkdown(content) {
            return markdown.render(content);
        }

        function makePathRelativeToConfigDir(path) {
            return constants.CONFIG_DIR + path;
        }
    }

    const taskConfig = {
        babel: {
            options: {
                presets: ['es2015']
            },
            production: {
                options: {
                    minified: true
                },
                files: [
                    {
                        src: constants.UNTRANSPILED_JS,
                        dest: constants.TRANSPILED_JS
                    }
                ]
            }
        },
        buildHTMLWithoutCritical: {
            dev: {
                dest: constants.INDEX_DEV
            },
            production: {
                dest: constants.BUILD_PROD_DIR + constants.INDEX_PROD_WITHOUT_CRITICAL_FILENAME
            }
        },
        clean: {
            build: [constants.BUILD_DIR]
        },
        critical: {
            production: {
                options: {
                    base: constants.BUILD_PROD_DIR,
                    css: [
                        constants.BUILD_PROD_STYLESHEET
                    ],
                    minify: true
                },
                files: [
                    {
                        src: `${constants.BUILD_PROD_DIR}${constants.INDEX_PROD_WITHOUT_CRITICAL_FILENAME}`,
                        dest: `${constants.BUILD_PROD_DIR}${constants.INDEX_PROD_WITH_CRITICAL_FILENAME}`
                    }
                ]
            },
        },
        concat: {
            dev: {
                files: [
                    {
                        src: [...constants.dependenciesScripts, ...constants.pageScripts],
                        dest: constants.BUILD_DEV_SCRIPT
                    }
                ],
            },
            productionBeforeTranspile: {
                files: [
                    {
                        src: constants.pageScripts,
                        dest: constants.UNTRANSPILED_JS
                    }
                ]
            },
            productionAfterTranspile: {
                files: [
                    {
                        src: [...constants.dependenciesScripts, constants.TRANSPILED_JS],
                        dest: constants.BUILD_PROD_SCRIPT
                    }
                ]
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        src: `${constants.IMAGE_DIR}**/*`,
                        dest: constants.BUILD_DEV_DIR
                    },
                    {
                        src: `${constants}`
                    }
                ]
            },
            production: {
                files: [
                    {
                        src: `${constants.IMAGE_DIR}**/*`,
                        dest: constants.BUILD_PROD_DIR
                    }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: constants.BUILD_PROD_DIR
            },
            src: ['**']
        },
        stylus: {
            options: {
                use: [
                    function() {
                        return require('autoprefixer-stylus')({browsers: ['last 2 versions', 'ie 9-11']})
                    }
                ],
                'include css': true
            },
            dev: {
                options: {
                    compress: false
                },
                files: [
                    {
                        src: constants.MAIN_STYLUS_SHEET,
                        dest: constants.BUILD_DEV_STYLESHEET
                    }
                ]

            },
            production: {
                options: {
                    compress: true
                },
                files: [
                    {
                        src: constants.MAIN_STYLUS_SHEET,
                        dest: constants.BUILD_PROD_STYLESHEET
                    }
                ]
            }
        }
    };

    grunt.registerMultiTask('buildHTMLWithoutCritical', function() {
        const done = this.async();
        nunjucksEnvironment.render(constants.MAIN_TEMPLATE, getConfig(), (error, homepageHTML) => {
            if (error)
                grunt.fail.fatal(error);
            grunt.file.write(this.data.dest, homepageHTML);
            done();
        });
    });

    grunt.initConfig(taskConfig);

    grunt.registerTask('build', [
        'clean',
        'buildHTMLWithoutCritical',
        'stylus',
        'concat:dev',
        'concat:productionBeforeTranspile',
        'babel',
        'concat:productionAfterTranspile',
        'concat',
        'copy',
        'critical'
    ]);

    grunt.registerTask('build-dev', [
        'clean',
        'buildHTMLWithoutCritical:dev',
        'stylus:dev',
        'concat:dev',
        'copy:dev'
    ]);

    grunt.registerTask('build-production', [
        'clean',
        'buildHTMLWithoutCritical:production',
        'stylus:production',
        'concat:productionBeforeTranspile',
        'babel:production',
        'concat:productionAfterTranspile',
        'copy:production',
        'critical'
    ]);

    grunt.registerTask('build-prod', ['build-production']);

    grunt.registerTask('publish', [
        'build-production',
        'gh-pages'
    ]);
};