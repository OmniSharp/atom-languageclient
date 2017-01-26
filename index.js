var fs = require('fs'), path = require('path');

// Allow us to deploy a dist version... but locally not worry about it
if (fs.existsSync(path.resolve(__dirname, 'src/index.js'))) {
    module.exports = require(path.join(__dirname, 'src/index'));
} else {
    module.exports = require(path.join(__dirname, 'dist/src/index'));
}
