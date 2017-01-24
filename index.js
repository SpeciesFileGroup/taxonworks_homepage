const nunjucks = require("nunjucks");
const stylus = require("stylus");
const autoprefixer = require("autoprefixer-stylus");
const fs = require("fs-extra");
const del = require("del");
const yamljs = require("yamljs");
const markdown = require('markdown-it')();
const constants = require("./constants");

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader(constants.TEMPLATE_DIR));
let savedConfig;

cleanAndMkdirBuild();
buildHTML();
buildCSS();
buildJS();
buildLogo();
printSuccess();

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

    const config = yamljs.load(constants.HOMEPAGE_DATA);
    if (config.introMarkdown)
        config.introHTML = parseMarkdownFile(config.introMarkdown);

    savedConfig = config;
    return config;

    function parseMarkdownFile(path) {
        return markdown.render(fs.readFileSync(makePathRelativeToConfigDir(path), {encoding: 'UTF-8'}));
    }

    function makePathRelativeToConfigDir(path) {
        return constants.CONFIG_DIR + path;
    }
}

function buildHTML() {
    const homepage = nunjucksEnvironment.render(constants.MAIN_TEMPLATE, getConfig());
    fs.writeFileSync(constants.BUILD_DEV_DIR + constants.INDEX_FILE, homepage, {encoding: "UTF-8"});
    fs.writeFileSync(constants.BUILD_PROD_DIR + constants.INDEX_FILE, homepage, {encoding: "UTF-8"});
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
    fs.writeFileSync(constants.MAIN_DEV_STYLESHEET, homepageDevCSS, {encoding: "UTF-8"});
}

function renderCSSForProd(stylusSource) {
    const homepageProdCSS = stylusSource
        .set('compress', true)
        .render();
    fs.writeFileSync(constants.MAIN_PROD_STYLESHEET, homepageProdCSS, {encoding: "UTF-8"});
}

function buildJS() {
    const scripts = constants.dependenciesScripts.concat(constants.pageScripts);
    let script = "";

    scripts.forEach(scriptFilename => {
        script += fs.readFileSync(scriptFilename, "UTF-8");
    });
    fs.writeFileSync(constants.MAIN_DEV_SCRIPT, script, {encoding: "UTF-8"});
    fs.writeFileSync(constants.MAIN_PROD_SCRIPT, script, {encoding: "UTF-8"});
}

function buildLogo() {
    const config = getConfig();
    const pathToLogo = constants.CONFIG_DIR + config.logo;
    fs.copySync(pathToLogo, constants.BUILD_DEV_DIR + config.logo);
    fs.copySync(pathToLogo, constants.BUILD_PROD_DIR + config.logo);
}

function printSuccess() {
    console.log("Build successful!");
}