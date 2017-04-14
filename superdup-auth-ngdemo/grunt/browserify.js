//************************************************************************
//* 
//************************************************************************
module.exports.tasks = {
    browserify: {
        options: {
            browserifyOptions: {
                //require: ['jquery','angular','bootstrap','angular-jwt'],
                debug: true
            },
            configure: function ( bundler )
            {
                //bundler.plugin(require('tsify', { noImplicitAny: true }));
                //bundler.transform(
                //require( 'aliasify' ),
                //{
                //    aliases: {
                //        "app-module": "./build/app-module.js"
                //    },
                //    verbose: false
                //}
                //);

                bundler.transform( require( 'babelify' ), {
                    presets: ['es2015'],
                    extensions: ['.js']
                } );
            }
        },

        bundle: {
            src: ['build/**/*.js'],
            entry: 'build/index.js',
            dest: 'www/app-browserify.js',
            reference: ['superdup-auth-core', 'superdup-auth-angular'],
            //reference: [
            //    'angular-jwt',
            //    'superdup-auth',
            //    'superdup-auth-auth0js',
            //    'superdup-auth-angular',
            //    'superdup-log',
            //    'superdup-log-angular',
            //    "angular"
            //]
            //external: [],
            //bundleOptions: { standalone: 'app-browserify' }
        }
    }
}
