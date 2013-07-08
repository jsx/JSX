module.exports = function(grunt) {
  'use strict';
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    srcDir: "src",
    buildDir: "bin",

    watch: {
      jsx: {
        files: ['<%= srcDir %>/*.jsx'],
        tasks: ['jsx:release']
      },
    },

    jsx: {
      release: {
        src: '<%= srcDir %>/jsx-node-front.jsx',
        dest: '<%= buildDir %>/jsx',
        add_search_path: [],
        executable: "node",
        release: true,
      },
      dev: {
        src: '<%= srcDir %>/jsx-node-front.jsx',
        dest: '<%= buildDir %>/jsx',
        add_search_path: [],
        executable: "node",
      },
    },
  });

  for (var key in pkg.devDependencies) {
    if (/grunt-/.test(key)) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['jsx:dev']);
};
// vim: set expandtab tabstop=2 shiftwidth=2:
