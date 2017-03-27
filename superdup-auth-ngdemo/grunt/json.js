//************************************************************************
//* 
//************************************************************************
module.exports.tasks = {
    // Deploy:
    // =======
    copy: {
        json: {
            files: [
              // includes files within path 
              {
                  expand: true,
                  cwd: 'source',
                  src: ['**/*.json'],
                  dest: 'build/',
              }
            ]
        }
    },

    // Cleaning up
    // ===========
    clean: {
        json: ['www/**/*.json']
    }
}
