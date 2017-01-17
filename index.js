const nunjucks = require("nunjucks");
const stylus = require("stylus");
const fs = require("fs");
const del = require("del");
const yamljs = require("yamljs");

del.sync(["build/**"]);
const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));

const homepageContext = yamljs.load("config/homepage.yaml");

const homepage = nunjucksEnvironment.render("pages/homepage.njk", homepageContext);
const homepageStyle = fs.readFileSync("templates/pages/homepage.styl", "UTF-8");
const homepageCSS = stylus(homepageStyle).render();

fs.mkdirSync("build");
fs.writeFileSync("build/index.html", homepage, {encoding: "UTF-8"});
fs.writeFileSync("build/homepage.css", homepageCSS, {encoding: "UTF-8"});
