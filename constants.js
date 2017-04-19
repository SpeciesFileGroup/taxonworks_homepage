const BUILD_DIR = "build/";
const BUILD_DEV_DIR = BUILD_DIR + "dev/";
const BUILD_PROD_DIR = BUILD_DIR + "prod/";
const CONFIG_DIR = "config/";
const IMAGE_DIR = "images/";
const TEMPLATE_DIR = "templates/";

const INDEX_DEV = BUILD_DEV_DIR + "index.html";

const INDEX_PROD_WITHOUT_CRITICAL_FILENAME = "index-no-critical.html";
const INDEX_PROD_WITH_CRITICAL_FILENAME = "index.html";

const MAIN_TEMPLATE = "pages/homepage.njk";
const MAIN_STYLUS_SHEET = TEMPLATE_DIR + "main.styl";

const BUILD_DEV_STYLESHEET = BUILD_DEV_DIR + "homepage.css";
const BUILD_PROD_STYLESHEET = BUILD_PROD_DIR + "homepage.css";
const BUILD_DEV_SCRIPT = BUILD_DEV_DIR + "bundle.js";
const BUILD_PROD_SCRIPT = BUILD_PROD_DIR + "bundle.js";

const HOMEPAGE_YAML = CONFIG_DIR + "homepage.yaml";

const dependenciesScripts = ["./node_modules/animejs/anime.js"];
const pageScripts = ["./scripts/animation.js", "./scripts/navigation.js", "./scripts/scope.js"];

module.exports = {
    BUILD_DIR, BUILD_DEV_DIR, BUILD_PROD_DIR, CONFIG_DIR, IMAGE_DIR, TEMPLATE_DIR,
    INDEX_DEV, INDEX_PROD_WITHOUT_CRITICAL_FILENAME, INDEX_PROD_WITH_CRITICAL_FILENAME,
    MAIN_TEMPLATE, MAIN_STYLUS_SHEET,
    BUILD_DEV_STYLESHEET, BUILD_PROD_STYLESHEET,
    BUILD_DEV_SCRIPT, BUILD_PROD_SCRIPT,
    HOMEPAGE_YAML,
    dependenciesScripts, pageScripts
};
