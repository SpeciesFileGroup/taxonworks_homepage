const nunjucks = require("nunjucks");
const stylus = require("stylus");
const fs = require("fs");
const del = require("del");

const nunjucksEnvironment = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));
const homepage = nunjucksEnvironment.render("pages/homepage.njk");

del.sync(["build/**"]);
fs.mkdirSync("build");
fs.writeFileSync("build/index.html", homepage, {encoding: "UTF-8"});