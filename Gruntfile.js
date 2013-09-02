module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: '<json:package.json>'
    });

    grunt.loadTasks('tasks');
};