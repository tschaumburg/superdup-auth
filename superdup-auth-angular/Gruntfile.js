/// <binding BeforeBuild='prebuild' AfterBuild='postbuild' />
var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (grunt)
{
    //Add all plugins that your project needs here
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-publish');
    grunt.loadNpmTasks('grunt-bump');
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
                    'superdup-auth-core': 'superdup-auth-core',
                    'angular': 'angular'
                }
            },
            prod: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-angular-min.js',
                    library: 'sdpAuthAngular'
                },
                plugins: [
                    new UglifyJSPlugin()
                ]
            },
            debug: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-angular.js',
                    //library: 'sdpAuthAngular',
                    libraryTarget: 'commonjs'
                }
            }
        },
        //'npm-command': {
        //    'update-core': {
        //        options: {
        //            cmd: 'update',
        //            args: ['superdup-auth-core']
        //        }
        //    }
        //},
        //'npm-command': {
        //    'update-core': {
        //        options: {
        //            cmd: 'update',
        //            args: ['superdup-auth-core']
        //        }
        //    }
        //},
        //bump: {
        //    options: {
        //        files: ['package.json'],
        //        updateConfigs: [],
        //        commit: false,
        //        createTag: false,
        //        push: false,
        //        globalReplace: false,
        //        prereleaseName: 'build', //false,
        //        metadata: '',
        //        regExp: false
        //    }
        //},
        //publish: {
        //    main: {
        //        src: [
        //            '.'
        //        ]
        //    }
        //}
    });

    grunt.registerTask('cleanup', ['clean:build']);
    grunt.registerTask(
        'prebuild',
        [
            //// Make sure all needed packages are loaded
            //'npm-command:update-core'
        ]
    );
    grunt.registerTask(
        'postbuild',
        [
            'webpack:debug',
            //// Increase npm version 1.2.3-build.12 => 1.2.3-build.13
            //'bump:prerelease',
            //// Publish to npm
            //'publish'
        ]
    );
};

