const nunjucks = require('nunjucks');
const constants = require('./src/constants');
const scope = require('./src/scope');
const markdown = require('markdown-it')();
const uglify = require("uglify-es");

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
        if (config.scopeConfig)
            config.scopeFeatures = scope.process(parseYamlFile(config.scopeConfig));
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
        buildHTMLWithoutCritical: {
            dev: {
                dest: constants.INDEX_DEV
            },
            production: {
                dest: constants.BUILD_PROD_DIR + constants.INDEX_PROD_WITHOUT_CRITICAL_FILENAME
            }
        },
        buildJS: {
            dev: {
                dest: constants.BUILD_DEV_SCRIPT
            },
            production: {
                dest: constants.BUILD_PROD_SCRIPT,
                uglify: true
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
        const homepageHTML = nunjucksEnvironment.render(constants.MAIN_TEMPLATE, getConfig());
        grunt.file.write(this.data.dest, homepageHTML);
    });

    grunt.registerMultiTask('buildJS', function() {
        const scripts = constants.dependenciesScripts.concat(constants.pageScripts);
        const script = this.data.uglify ? uglify.minify(concatScripts()).code : concatScripts();
        grunt.file.write(this.data.dest, script);

        function concatScripts() {
            return scripts.reduce((currentScript, nextScript) => {
                return currentScript + grunt.file.read(nextScript);
            }, '');
        }
    });

    grunt.initConfig(taskConfig);

    grunt.registerTask('build', [
        'clean',
        'buildHTMLWithoutCritical',
        'stylus',
        'buildJS',
        'copy',
        'critical'
    ]);

    grunt.registerTask('build-dev', [
        'clean',
        'buildHTMLWithoutCritical:dev',
        'stylus:dev',
        'buildJS:dev',
        'copy:dev'
    ]);

    grunt.registerTask('build-production', [
        'clean',
        'buildHTMLWithoutCritical:production',
        'stylus:production',
        'buildJS:production',
        'copy:production',
        'critical'
    ]);

    grunt.registerTask('build-prod', ['build-production']);

    grunt.registerTask('publish', [
        'build-production',
        'gh-pages'
    ]);
};