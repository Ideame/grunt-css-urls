module.exports = function (grunt) {
    grunt.initConfig({
        pkg: '<json:package.json>'
    });

    grunt.loadTasks('tasks');
};