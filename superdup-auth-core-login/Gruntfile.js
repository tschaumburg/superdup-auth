/// <binding AfterBuild='postbuild' Clean='cleanup' />
var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.initConfig({
        clean: {
            build: ['build', 'dist'],
            release: []
        },
        webpack: {
            options: {
                stats: true,
                entry: './dist/index.js',
                externals: {
                    'superdup-auth-log': 'superdup-auth-log',
                    'superdup-auth-core-providers': 'superdup-auth-core-providers'
                }
            },
            prod: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-core-login-min.js',
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
                    filename: 'superdup-auth-core-login.js',
                    //library: 'sdpAuthCore',
                    libraryTarget: 'commonjs'
                }
            }
        },
    });

    grunt.registerTask(
        'cleanup',
        [
            'clean:build'
        ]
    );

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
