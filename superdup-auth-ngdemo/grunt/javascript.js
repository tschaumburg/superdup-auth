//************************************************************************
//* 
//************************************************************************
module.exports.tasks = {
    // Deploy:
    // =======
    copy: {
        javascript: {
            files: [
              // includes files within path 
              {
                  expand: true,
                  cwd: 'source',
                  src: ['**/*.js'],
                  dest: 'www/',
              }
            ]
        }
    },

    // Cleaning up
    // ===========
    clean: {
        javascript: ['www/**/*.js']
    }
}
