const ghpages = require('gh-pages');
const path = require('path');
const constants = require('./constants');

ghpages.publish(path.join(__dirname, constants.BUILD_DEV_DIR), function(err) {
    if (err)
        console.log(err);
    else
        console.log(`Publish complete!`);
});