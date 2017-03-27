//************************************************************************
//* CSS:
//* ====
//* Build:   All .css files from /source are minified and combined into 
//*          /wwwroot/app.min.css
//* Runtime: /wwwroot/index.html loads app.min.css
//* Clean:   
//************************************************************************
module.exports.tasks = {
    // CSS minification:
    // =================
    cssmin: {
        all: {
            files: [{
                src: ['source/**/*.css', '!source/**/*.min.css'],
                dest: 'www/app.min.css'
            }]
        }
    },

    // Cleaning up
    // ===========
    clean: {
        css: ['www/**/*.css']
    }
}
