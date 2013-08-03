module.exports = function(grunt) {
  'use strict';
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    srcDir: "src",
    buildDir: "bin",

    watch: {
      jsx: {
        files: ['<%= srcDir %>/*.jsx', '!<%= srcDir %>/meta.jsx'],
        tasks: ['exec:make_compiler']
      },
    },

    exec: {
      make_compiler: {
        command: "make compiler",
      },
    },
  });

  for (var key in pkg.devDependencies) {
    if (/grunt-/.test(key)) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['exec:make_compiler']);
};
// vim: set expandtab tabstop=2 shiftwidth=2:
