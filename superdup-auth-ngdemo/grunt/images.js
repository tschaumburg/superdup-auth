//************************************************************************
//* 
//************************************************************************
module.exports.tasks = {
    // Deploy:
    // =====
    copy: {
        images: {
            files: [
              // includes files within path 
              {
                  expand: true,
                  cwd: 'source',
                  src: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
                  dest: 'www/',
              }
            ]
        }
    },

    // Cleaning up
    // ===========
    clean: {
        images: ['www/**/*.png', 'www/**/*.jpg', 'www/**/*.jpeg', 'www/**/*.gif']
    }
}
