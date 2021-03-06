'use strict';
var testDatabase = require('./test/database/resetTestDatabase');

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    clean: ['./build'],

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
      },
      all: {
        src: ['Gruntfile.js', 'src/*.js', 'test/**/*.js'],
      },
    },

    jscs: {
      src: ['Gruntfile.js', 'src/*.js', 'test/**/*.js'],
      options: {
        config: '.jscsrc',
        esnext: false, // If you use ES6 http://jscs.info/overview.html#esnext
        verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
        fix: true, // Autofix code style violations when possible.
        reporter: 'node_modules/jscs-clang-reporter',
      },
    },

    watch: {
      all: {
        files: ['Gruntfile.js', 'src/*.js', 'test/**/*.js', 'test/database/*'],
        tasks: ['default'],
        options: {
          spawn: true,
          atBegin: true,
        },
      },
    },

    jasmine_node: { // jshint ignore:line
      options: {
        coverage:{
          reportFile: 'coverage.json',
          print: 'both', // none, summary, detail, both
          relativize: true,
          thresholds: {
            statements: 0,
            branches: 0,
            lines: 0,
            functions: 0,
          },
          reportDir: './build/coverage',
          report: [
            'lcov',
          ],
          collect: [// false to disable
            '*coverage.json',
          ],
          excludes: [],
        },
        forceExit: false,
        match: '.',
        matchAll: false,
        specFolders: ['test/'],
        extensions: 'js',
        specNameMatcher: 'spec|e2e',
        captureExceptions: true,
        showColors: true,
        isVerbose: true,
        junitreport: {
          report: false,
          savePath: './build/reports/jasmine/',
          useDotNotation: true,
          consolidate: true,
        },
      },
      src: 'src/*.js',
    },

  });

  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('resetTestDatabase', function () {
    var done = this.async();
    testDatabase.reset()
    .then(function () {
      done();
    })
    .fail(function (err) {
      console.log(err);
      done(false);
    });
  });

  grunt.registerTask('default', ['jscs', 'jshint', 'clean', /*'resetTestDatabase',*/ 'jasmine_node']);
};
