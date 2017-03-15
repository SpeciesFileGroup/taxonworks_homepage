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

const constants = require("../constants");

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader(constants.TEMPLATE_DIR));
let savedConfig;

cleanAndMkdirBuild();
buildHTMLWithoutCritical();
buildCSS();
buildJS();
buildLogo();
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
    if (config.benefitsMarkdown)
        config.benefitsHTML = parseMarkdownFile(config.benefitsMarkdown);
    if (config.scopeMarkdown)
        config.scopeHTML = parseMarkdownFile(config.scopeMarkdown);
    if (config.gettingStartedMarkdown)
        config.gettingStartedHTML = parseMarkdownFile(config.gettingStartedMarkdown);

    savedConfig = config;
    return config;

    function parseMarkdownFile(path) {
        return markdown.render(fs.readFileSync(makePathRelativeToConfigDir(path), {encoding: 'UTF-8'}));
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

function buildLogo() {
    const config = getConfig();
    const pathToLogo = constants.CONFIG_DIR + config.logo;
    fs.copySync(pathToLogo, constants.BUILD_DEV_DIR + config.logo);
    fs.copySync(pathToLogo, constants.BUILD_PROD_DIR + config.logo);
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
