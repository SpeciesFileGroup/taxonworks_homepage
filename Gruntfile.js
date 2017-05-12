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
        if (config.scopeConfig)
            config.scopeFeatures = scope.process(parseYamlFile(config.scopeConfig));
        if (config.gettingStarted1Markdown)
            config.gettingStarted1HTML = parseMarkdownFile(config.gettingStarted1Markdown);
        if (config.gettingStarted2aMarkdown)
            config.gettingStarted2aHTML = parseMarkdownFile(config.gettingStarted2aMarkdown);
        if (config.gettingStarted2bMarkdown)
            config.gettingStarted2bHTML = parseMarkdownFile(config.gettingStarted2bMarkdown);
        if (config.funding)
            config.fundingHTML = parseMarkdown(config.funding);
        if (config.builtBy)
            config.builtByHTML = parseMarkdown(config.builtBy);
        if (config.footerLinksCodeMarkdown)
            config.footerLinksCodeHTML = parseMarkdownFile(config.footerLinksCodeMarkdown);
        if (config.footerLinksContactMarkdown)
            config.footerLinksContactHTML = parseMarkdownFile(config.footerLinksContactMarkdown);
        if (config.footerLinksSocialMarkdown)
            config.footerLinksSocialHTML = parseMarkdownFile(config.footerLinksSocialMarkdown);

        config.sponsors = parseYamlFile(config.sponsorsConfig);
        config.navBarLinks = parseYamlFile(config.navBarLinkListConfig);

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
        clean: {
            build: [constants.BUILD_DIR]
        },
        buildHTMLWithoutCritical: {
            dev: {
                dest: constants.INDEX_DEV
            },
            production: {
                dest: constants.BUILD_PROD_DIR + constants.INDEX_PROD_WITHOUT_CRITICAL_FILENAME
            }
        },
        stylus: {
            options: {
                use: [
                    function() {
                        return require('autoprefixer-stylus')({browsers: ['last 2 versions', 'ie 9-11']})
                    }
                ]
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
            prod: {
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
        grunt.file.write(this.data.dest, homepageHTML, {encoding: "UTF-8"});
    });

    grunt.initConfig(taskConfig);

    grunt.registerTask('build', [
        'clean',
        'buildHTMLWithoutCritical',
        'stylus'
    ]);
};