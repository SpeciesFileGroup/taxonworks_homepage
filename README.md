# TaxonWorks Homepage

## How do I install this?
Run `install_dependencies`.

If you don't have the grunt command line tool:
`npm i -g grunt-cli`.

## Build targets

1. dev: The dev target keeps code from being minified or compressed, for easy debugging. It will build to `build/dev`.
1. production: The production target will compress, minify, transpile, and concat code for real-world use. It is located at `build/production`. This is the target you should put in your docroot. It will also create critical path css, to prevent stylesheets from blocking rendering.

## What commands are available?
1. `grunt build`: Builds both environments.
1. `grunt build-dev`: Builds only the dev target.
1. `grunt build-production`: Builds only the production target.
1. `grunt publish`: Builds the production target and then pushes it to the gh-pages branch.

To see the site while developing locally, we recommend a simple node server like [live-server](https://www.npmjs.com/package/live-server).

## How do I modify the homepage content?

All editable content and configuration for the homepage is found in the `config` directory.

The root config file is `homepage.yaml`. In that file you can set site-wide variables and link to content in `.md` files. Any paths in the `homepage.yaml` are relative to the `config` directory.

Config properties are as follows:

- `title`: Title of the page
- `titleLogo`: path to logo image
- `slogan`: Appears below the title
- `introMarkdown`: Path to markdown for intro section 
- `benefitsTitle`: Title for the benefits section
- `benefits1Markdown`: Path to markdown for the first benefits section
- `benefits2Markdown`: Path to markdown for the second benefits section
- `benefits3Markdown`: Path to markdown for the third benefits section
- `benefits4Markdown`: Path to markdown for the fourth benefits section
- `sponsorsConfig`: Path to yaml representing the sponsors. Sponsors should include `name` and `src`.
- `scopeTitle`: Title of the scope section, a.k.a. the upcoming features section
- `scopeMarkdown`: Path to markdown for the intro copy of the scope section.
- `scopeConfig`: Path to config yaml of the scope section
- `gettingStartedTitle`: Title of the getting started section
- `gettingStarted1Markdown`: Path to markdown for first section of getting started 
- `gettingStarted2aMarkdown`: Path to markdown for part of the second section 
- `gettingStarted2bMarkdown`: Path to markdown for part of the second section 
- `gettingStartedLogo`: Path to image of the getting started logo
- `footerLogo`: Path to image for the footer
- `navLogo`: Path to image to use in the navigation bar
- `navText`: Path to image to use in place of text in the navigation bar
- `navBarLinkListConfig`: Path to yaml to configure the nav bar links. Expects each nav bar item to have `name` and `href`.
- `sponsor`: Text to include in the sponsor part of the footer
- `builtBy`: Raw markdown to include in the footer to represent the "Built by".
- `funding`: Path to markdown representing the funding blurb in the footer
- `disclaimer`: Path to markdown to insert a disclaimer at the very bottom
- `twitterUrl`: URL to twitter profile page
- `footerLinksCode`: Path to yaml of links to include in the code section of footer
- `footerLinksContact`: Path to yaml of links to include in the contact section of footer
- `footerLinksSocial`: Path to yaml of links to include in the social section of footer

## How do I modify templates and styles?

Templates and styles are both located in the `templates` directory. HTML Templates are written with Nunjucks, which is based on jinja2 from the Python world. CSS is composed with Stylus, a popular node package.

We recommend using Visual Studio Code with packages for Nunjucks and Stylus for nice syntax highlighting. But any IDE should work pretty well.

### How are the templates organized?

The templates are broken into two areas:

1. partials: re-usable bits that can be inserted into any nunjucks template. Every section of the page is a partial, including the footer, header, and navigation.
1. pages: Only one page exists now, named `homepage.njk`. If more pages needed to be added, this is where you could put them.

### How is the Stylus organized?

The main entry point for the Stylus sheet is in `templates/main.styl`. This is where everything is included together and some resets are applied.

Styles that belong to a certain partial or page are adjacent to those `.njk` templates to keep things easy to find.

Re-usable styles, such as variables, placeholder classes, or mixins, are found in the `templates/styles` directory.

## How do I modify the front-end scripts?

Front-end scripts are in `scripts`. If you need to add a new script, be sure to update the `pageScripts` variable in `src/constants.js`.

Scripts that are from dependency packages are configured in the `dependenciesScripts` variable in `constants.js`. These scripts are prepended before any page script. For example, we use [anime](http://anime-js.com/) to handle JavaScript animations, so we added `"./node_modules/animejs/anime.min.js"` to our `dependencyScripts`.

### constants.js

This file represents constants in the build process. It's located at `src/constants.js`. If you reorganize things in the project it will hopefully be simple to update the constants to match the new structure.