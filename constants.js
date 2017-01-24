const BUILD_DIR = "build/";
const BUILD_DEV_DIR = BUILD_DIR + "dev/";
const BUILD_PROD_DIR = BUILD_DIR + "prod/";
const CONFIG_DIR = "config/";
const TEMPLATE_DIR = "templates/";

const MAIN_TEMPLATE = "pages/homepage.njk";
const INDEX_FILE = "index.html";
const MAIN_STYLUS_SHEET = TEMPLATE_DIR + "main.styl";
const MAIN_DEV_STYLESHEET = BUILD_DEV_DIR + "homepage.css";
const MAIN_PROD_STYLESHEET = BUILD_PROD_DIR + "homepage.css";
const MAIN_DEV_SCRIPT = BUILD_DEV_DIR + "bundle.js";
const MAIN_PROD_SCRIPT = BUILD_PROD_DIR + "bundle.js";

const HOMEPAGE_DATA = CONFIG_DIR + "homepage.yaml";

const dependenciesScripts = ["./node_modules/animejs/anime.js"];
const pageScripts = ["./scripts/animation.js"];

module.exports = {
    BUILD_DIR, BUILD_DEV_DIR, BUILD_PROD_DIR, CONFIG_DIR, TEMPLATE_DIR,
    MAIN_TEMPLATE, INDEX_FILE, MAIN_STYLUS_SHEET,
    MAIN_DEV_STYLESHEET, MAIN_PROD_STYLESHEET,
    MAIN_DEV_SCRIPT, MAIN_PROD_SCRIPT,
    HOMEPAGE_DATA,
    dependenciesScripts, pageScripts
};
