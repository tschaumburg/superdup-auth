/// <binding AfterBuild='postbuild' Clean='cleanup' />
var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (grunt)
{
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-publish');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-webpack');
    //grunt.loadNpmTasks('grunt-npm-command');

    grunt.initConfig({
        clean: {
            build: ['build', 'dist'],
            release: []
        },
        webpack: {
            options: {
                entry: './dist/index.js'
            },
            prod: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-log-min.js',
                    libraryTarget: 'commonjs'
                },
                plugins: [
                    new UglifyJSPlugin()
                ]
            },
            debug: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-log.js',
                    libraryTarget: 'commonjs'
                }
            }
        },
    });

    grunt.registerTask('cleanup', ['clean:build']);
    grunt.registerTask(
        'prebuild',
        [
        ]
    );
    grunt.registerTask(
        'postbuild',
        [
            'webpack:debug',
            //'bump:prerelease',
            //'publish'
        ]
    );
};
