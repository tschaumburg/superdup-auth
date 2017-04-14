var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './dist/index.js',
    output: {
        path: path.resolve(__dirname, 'webpack'),
        filename: 'superdup-auth-auth0js.js',
        library: 'sdpAuthAuth0js'
    },
    externals: {
        'superdup-auth-core': 'sdpAuthCore',
        'auth0-js': 'auth'
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};