/// <binding AfterBuild='postbuild' Clean='cleanup' />
var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (grunt) {
    //Add all plugins that your project needs here
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-publish');
    //grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-webpack');
    //grunt.loadNpmTasks('grunt-npm-command'); // DON'T USE => MAX_PATH error

    //configs = require('load-grunt-configs')(grunt, { config: { src: "grunt/*.js" } });
    //grunt.initConfig(configs);

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
                    'superdup-auth-core-providers': 'superdup-auth-core-providers',
                    'superdup-auth-core-login': 'superdup-auth-core-login',
                    'superdup-auth-core-tokens': 'superdup-auth-core-tokens',
                    'superdup-auth-core-apis': 'superdup-auth-core-apis',
                    'superdup-auth-log': 'superdup-auth-log'
                }
            },
            prod: {
                output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: 'superdup-auth-core-min.js',
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
                    filename: 'superdup-auth-core.js',
                    //library: 'sdpAuthCore',
                    libraryTarget: 'commonjs'
                }
            }
        },
        //bump: {
        //    options: {
        //        files: ['package.json'],
        //        updateConfigs: [],
        //        commit: false,
        //        //commitMessage: 'Release v%VERSION%',
        //        //commitFiles: ['package.json'],
        //        createTag: false,
        //        //tagName: 'v%VERSION%',
        //        //tagMessage: 'Version %VERSION%',
        //        push: false,
        //        //pushTo: 'upstream',
        //        //gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
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

    //grunt.registerTask('bundle', ['uglify:minify', 'uglify:beautify']);
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
