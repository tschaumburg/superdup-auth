/// <binding BeforeBuild='prebuild' AfterBuild='postbuild' />
module.exports = function (grunt) {
    //Add all plugins that your project needs here
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-npm-command');

    ////loads the various task configuration files
    configs = require( 'load-grunt-configs' )( grunt, { config: { src: "grunt/*.js" } } );
    grunt.initConfig( configs );

    grunt.registerTask('clean-all', ['clean:json', 'clean:html', 'clean:javascript', 'clean:images', 'clean:css'] );
    grunt.registerTask(
        'prebuild',
        [
            //// Make sure all needed packages are loaded
            //'npm-command:update-auth'
        ]
    );
    grunt.registerTask('postbuild', ['copy:json', 'browserify:bundle', 'copy:html', 'copy:javascript', 'copy:images', 'cssmin:all'] );
}

