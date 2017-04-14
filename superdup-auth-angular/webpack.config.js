var path = require('path');

module.exports = {
    entry: './dist/index.js',
    output: {
        path: path.resolve(__dirname, 'webpack'),
        filename: 'superdup-auth-angular.js',
        library: 'sdpAuthAngular'
    },
    externals: {
        'superdup-auth-core': 'sdpAuthCore',
        'angular': 'angular'
    }
};