const nunjucks = require("nunjucks");
const stylus = require("stylus");
const fs = require("fs");
const del = require("del");
const yamljs = require("yamljs");

const homepageContext = yamljs.load("config/homepage.yaml");

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));
const homepage = nunjucksEnvironment.render("pages/homepage.njk", homepageContext);

del.sync(["build/**"]);
fs.mkdirSync("build");
fs.writeFileSync("build/index.html", homepage, {encoding: "UTF-8"});