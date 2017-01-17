const nunjucks = require("nunjucks");
const stylus = require("stylus");
const autoprefixer = require("autoprefixer-stylus");
const fs = require("fs");
const del = require("del");
const yamljs = require("yamljs");
const markdown = require('markdown-it')();
const constants = require("./constants");

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader(constants.TEMPLATE_DIR));

cleanAndMkdirBuild();
buildHTML();
buildCSS();
buildJS();

function cleanAndMkdirBuild() {
    del.sync([constants.BUILD_DIR + "**"]);
    fs.mkdirSync(constants.BUILD_DIR);
}

function getConfig() {
    const config = yamljs.load(constants.CONFIG_DIR + "homepage.yaml");
    if (config.introCopy)
        config.introHTML = parseMarkdownFile(config.introCopy);

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
    fs.writeFileSync(constants.BUILD_DIR + "index.html", homepage, {encoding: "UTF-8"});
}

function buildCSS() {
    const homepageStyle = fs.readFileSync(constants.MAIN_STYLUS_SHEET, "UTF-8");
    const homepageCSS = stylus(homepageStyle)
        .use(autoprefixer({browsers: ['last 2 versions', 'ie 9-11']}))
        .set('paths', [constants.TEMPLATE_DIR])
        .render();
    fs.writeFileSync(constants.MAIN_STYLESHEET, homepageCSS, {encoding: "UTF-8"});
}

function buildJS() {
    const scripts = constants.dependenciesScripts.concat(constants.pageScripts);
    let script = "";

    scripts.forEach(scriptFilename => {
        script += fs.readFileSync(scriptFilename, "UTF-8");
    });
    fs.writeFileSync(constants.MAIN_SCRIPT, script, {encoding: "UTF-8"});
}