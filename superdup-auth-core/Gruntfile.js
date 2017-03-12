/// <binding AfterBuild='postbuild' Clean='cleanup' />
module.exports = function (grunt) {
    //Add all plugins that your project needs here
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-publish');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-npm-command');
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        clean: {
            build: ['build', 'dist'],
            release: []
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: false,
                //commitMessage: 'Release v%VERSION%',
                //commitFiles: ['package.json'],
                createTag: false,
                //tagName: 'v%VERSION%',
                //tagMessage: 'Version %VERSION%',
                push: false,
                //pushTo: 'upstream',
                //gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: 'build', //false,
                metadata: '',
                regExp: false
            }
        },
        publish: {
            main: {
                src: [
                    '.'
                ]
            }
        }
        //uglify: {
        //    minify: {
        //        files: {
        //            'dist/superdup-auth.min.js': ['build/**/*.js']
        //        },
        //        options: {
        //            mangle: true,
        //            beautify: false,
        //            sourceMap: true
        //        }
        //    },
        //    beautify: {
        //        files: {
        //        files: {
        //            'dist/superdup-auth.js': ['build/**/*.js']
        //        },
        //        options: {
        //            mangle: false,
        //            beautify: true,
        //            sourceMap: true
        //        }
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
            // Increase npm version 1.2.3-build.12 => 1.2.3-build.13
            'bump:prerelease',
            // Publish to npm
            'publish'
        ]
    );
};
