/// <binding AfterBuild='postbuild' Clean='cleanup' />
var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webpack');
    //grunt.loadNpmTasks('grunt-npm-command'); // DON'T USE => MAX_PATH error

    grunt.initConfig({
        clean: {
            build: ['build', 'dist'],
            release: []
        },
        webpack: {
            options: {
                entry: './dist/index.js',
                stats: {
                    colors: false,
                    modules: true,
                    reasons: false
                },
                progress: true,
                failOnError: true,
                externals: {
                    'jwt-decode': 'jwt-decode',
                    //'superdup-auth-core-providers': 'superdup-auth-core-providers',
                    //'superdup-auth-core-login': 'superdup-auth-core-login',
                    //'superdup-auth-core-tokens': 'superdup-auth-core-tokens',
                    //'superdup-auth-core-apis': 'superdup-auth-core-apis',
                    //'superdup-auth-core': 'superdup-auth-core',
                    //'superdup-auth-log': 'superdup-auth-log',
                    'angular': 'angular',
                    'auth0-js': 'auth0-js',
                    'jwt-decode': 'jwt-decode',
                    'babel-polyfill': 'babel-polyfill'
                }
            },
            prod: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-min.js',
                    //library: 'sdpAuthCore',
                    libraryTarget: 'commonjs'
                },
                plugins: [
                    new UglifyJSPlugin()
                ]
            },
            debug: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth.js',
                    //library: 'sdpAuthCore',
                    libraryTarget: 'commonjs'
                }
            }
        }
    });

    grunt.registerTask('cleanup', ['clean:build']);
    grunt.registerTask(
        'prebuild',
        [
            // Make sure all needed packages are loaded
            //'npm-install'
        ]
    );
    grunt.registerTask(
        'postbuild',
        [
            'webpack:debug',
            'webpack:prod',
            //'bump:prerelease',
            //'publish'
        ]
    );
};
