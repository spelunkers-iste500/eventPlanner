const path = require('path');

module.exports = {
    resolve: {
        alias: {
            'Utils/*': path.resolve(__dirname, 'utils/*'),
        }
    }
}