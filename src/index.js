printStart();

const nunjucks = require("nunjucks");
const stylus = require("stylus");
const autoprefixer = require("autoprefixer-stylus");
const critical = require('critical');
const fs = require("fs-extra");
const del = require("del");
const yamljs = require("yamljs");
const markdown = require('markdown-it')();
const uglify = require("uglify-js");
const scope = require('./scope');

const constants = require("../constants");
const sponsors = require("../sponsors");

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader(constants.TEMPLATE_DIR));
let savedConfig;

cleanAndMkdirBuild();
buildHTMLWithoutCritical();
buildCSS();
buildJS();
buildAssets();
buildHTMLWithCritical()
    .then(_ => printSuccess())
    .catch(err => console.error(`Build Failed ☹️ ${err}`));

function printStart() {
    console.log(`Build starting. This may take some seconds.`);
}

function cleanAndMkdirBuild() {
    del.sync([constants.BUILD_DIR + "**"]);
    fs.mkdirSync(constants.BUILD_DIR);
    fs.mkdirSync(constants.BUILD_DEV_DIR);
    fs.mkdirSync(constants.BUILD_PROD_DIR);
}

function getConfig() {
    if(savedConfig) {
        return savedConfig;
    }

    const config = yamljs.load(constants.HOMEPAGE_YAML);
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

    config.sponsors = sponsors.sponsorsList;

    savedConfig = config;
    return config;

    function parseMarkdownFile(path) {
        return markdown.render(fs.readFileSync(makePathRelativeToConfigDir(path), {encoding: 'UTF-8'}));
    }

    function parseYamlFile(path) {
        return yamljs.load(makePathRelativeToConfigDir(path));
    }

    function parseMarkdown(content) {
        return markdown.render(content);
    }

    function makePathRelativeToConfigDir(path) {
        return constants.CONFIG_DIR + path;
    }
}

function buildHTMLWithoutCritical() {
    const homepageHTML = nunjucksEnvironment.render(constants.MAIN_TEMPLATE, getConfig());
    fs.writeFileSync(constants.INDEX_DEV, homepageHTML, {encoding: "UTF-8"});
    fs.writeFileSync(constants.BUILD_PROD_DIR + constants.INDEX_PROD_WITHOUT_CRITICAL_FILENAME, homepageHTML, {encoding: "UTF-8"});
}

function buildCSS() {
    const homepageStylusSource = fs.readFileSync(constants.MAIN_STYLUS_SHEET, "UTF-8");

    const homepageStylus = stylus(homepageStylusSource)
        .use(autoprefixer({browsers: ['last 2 versions', 'ie 9-11']}))
        .set('paths', [constants.TEMPLATE_DIR]);

    renderCSSForDev(homepageStylus);
    renderCSSForProd(homepageStylus);
}

function renderCSSForDev(stylusSource) {
    const homepageDevCSS = stylusSource.render();
    fs.writeFileSync(constants.BUILD_DEV_STYLESHEET, homepageDevCSS, {encoding: "UTF-8"});
}

function renderCSSForProd(stylusSource) {
    const homepageProdCSS = stylusSource
        .set('compress', true)
        .render();
    fs.writeFileSync(constants.BUILD_PROD_STYLESHEET, homepageProdCSS, {encoding: "UTF-8"});
}

function buildJS() {
    buildJSForDev();
    buildJSForProd();
}

function buildJSForDev() {
    const scripts = constants.dependenciesScripts.concat(constants.pageScripts);
    let script = "";

    scripts.forEach(scriptFilename => {
        script += fs.readFileSync(scriptFilename, "UTF-8");
    });
    fs.writeFileSync(constants.BUILD_DEV_SCRIPT, script, {encoding: "UTF-8"});
}

function buildJSForProd() {
    const scripts = constants.dependenciesScripts.concat(constants.pageScripts);
    let script = uglify.minify(scripts).code;
    fs.writeFileSync(constants.BUILD_PROD_SCRIPT, script, {encoding: "UTF-8"});
}

function buildAssets() {
    // buildIllustrations();
    buildImages();
    buildLogos();
}

function buildIllustrations() {
    return null;
}

function buildImages() {
    const pathToImages = constants.IMAGE_DIR;
    fs.mkdirsSync(constants.BUILD_DEV_DIR + constants.IMAGE_DIR);
    fs.copySync(pathToImages, constants.BUILD_DEV_DIR + constants.IMAGE_DIR);
    fs.mkdirsSync(constants.BUILD_PROD_DIR + constants.IMAGE_DIR);
    fs.copySync(pathToImages, constants.BUILD_PROD_DIR + constants.IMAGE_DIR);
}

function buildLogos() {
    const config = getConfig();

    buildLogo(config.logo);
    buildLogo(config.logoSmall);
}

function buildLogo(logoInConfig) {
    // const config = getConfig();
    const pathToLogo = constants.IMAGE_DIR + logoInConfig;

    fs.copySync(pathToLogo, constants.BUILD_DEV_DIR + logoInConfig);
    fs.copySync(pathToLogo, constants.BUILD_PROD_DIR + logoInConfig);
}

function buildHTMLWithCritical() {
    return critical.generate({
        inline: true,
        base: constants.BUILD_PROD_DIR,
        src: constants.INDEX_PROD_WITHOUT_CRITICAL_FILENAME,
        dest: constants.INDEX_PROD_WITH_CRITICAL_FILENAME,
        minify: true,
        width: 1300,
        height: 900
    });
}

function printSuccess() {
    console.log("Build successful! 😎");
}
