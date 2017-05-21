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
                entry: './dist/index.js',
                externals: {
                    'superdup-auth-log': 'superdup-auth-log'
                }
            },
            prod: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-core-providers-min.js',
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
                    filename: 'superdup-auth-core-providers.js',
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
