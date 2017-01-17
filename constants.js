const BUILD_DIR = "build/";
const CONFIG_DIR = "config/";
const TEMPLATE_DIR = "templates/";

const MAIN_TEMPLATE = "pages/homepage.njk";
const MAIN_STYLUS_SHEET = TEMPLATE_DIR + "main.styl";
const MAIN_STYLESHEET = BUILD_DIR + "homepage.css";
const MAIN_SCRIPT = BUILD_DIR + "bundle.js";

const dependenciesScripts = ["./node_modules/animejs/anime.js"];
const pageScripts = ["./scripts/helloworld.js"];

module.exports = {
    BUILD_DIR, CONFIG_DIR, TEMPLATE_DIR, MAIN_TEMPLATE, MAIN_STYLUS_SHEET, MAIN_STYLESHEET, MAIN_SCRIPT,
    dependenciesScripts, pageScripts
};
