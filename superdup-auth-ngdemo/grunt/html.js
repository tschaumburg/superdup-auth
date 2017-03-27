//************************************************************************
//* 
//************************************************************************
module.exports.tasks = {
    // Deploy:
    // =======
    copy: {
        html: {
            files: [
              // includes files within path 
              {
                  expand: true,
                  cwd: 'source',
                  src: ['**/*.html'],
                  dest: 'www/',
              }
            ]
        }
    },

    // Cleaning up
    // ===========
    clean: {
        html: ['www/**/*.html']
    }
}
