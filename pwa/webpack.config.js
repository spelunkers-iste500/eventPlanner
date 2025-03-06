const path = require('path');

module.exports = {
    resolve: {
        alias: {
            'Utils/*': path.resolve(__dirname, './utils/*'),
            'Components/*': path.resolve(__dirname, './components/*'),
            'Types/*': path.resolve(__dirname, './types')
        }
    }
}