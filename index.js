const nunjucks = require("nunjucks");
const stylus = require("stylus");
const fs = require("fs");
const del = require("del");
const yamljs = require("yamljs");
const constants = require("./constants");

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader(constants.TEMPLATE_DIR));

cleanAndMkdirBuild();
buildHTML();
buildCSS();

function cleanAndMkdirBuild() {
    del.sync([constants.BUILD_DIR + "**"]);
    fs.mkdirSync(constants.BUILD_DIR);
}

function getConfig() {
    return yamljs.load(constants.CONFIG_DIR + "homepage.yaml");
}

function buildHTML() {
    const homepage = nunjucksEnvironment.render(constants.MAIN_TEMPLATE, getConfig());
    fs.writeFileSync(constants.BUILD_DIR + "index.html", homepage, {encoding: "UTF-8"});
}

function buildCSS() {
    const homepageStyle = fs.readFileSync(constants.MAIN_STYLUS_SHEET, "UTF-8");
    const homepageCSS = stylus(homepageStyle)
        .set('paths', [constants.TEMPLATE_DIR])
        .render();
    fs.writeFileSync(constants.MAIN_STYLESHEET, homepageCSS, {encoding: "UTF-8"});
}