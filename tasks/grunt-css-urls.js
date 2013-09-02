/*
 * grunt-css-urls
 * https://github.com/Ideame/grunt-css-urls
 *
 * Copyright (c) 2012 Juan Pablo Garcia & Ideame Dev Team
 */
module.exports = function (grunt) {
    var fs = require('fs');
    var path = require('path');
    var util = require('util');

    grunt.registerMultiTask("cssUrls", "Parses a given main css file with @import rules, iterates through them replacing url() relative references with a relative url to the main css file.", function () {

        this.files.forEach(function(file) {
            var contents = file.orig.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                var baseDir = path.dirname(path.join(process.cwd(), filepath));
                var importContents = grunt.file.read(filepath);

                importContents.replace(/@import\s+'([^']+)/gim, function(match, location){
                    location = location.replace(/'|"/g, '');
                    var filename =  path.resolve(path.dirname(filepath), location);
                    var content = grunt.file.read(filename).toString(); // sometimes css is interpreted as object

                    grunt.log.writeln('Parsing "' + location + '"...');

                    var css = content.replace(/url(?:\s+)?\(([^\)]+)\)/igm, function(match, url){
                        url = url.replace(/'|"/g, '');

                        if (/^\//.test(url)) {
                            grunt.log.writeln(" - Absolute urls are not supported, url ignored => " + url);
                            return url;
                        }
                        if (/^(\s+)?$/.test(url)) {
                            grunt.log.writeln(" - Empty urls are not supported, url ignored => " + url);
                            return url;
                        }

                        if (/#/.test(url) && !/\?#iefix|svg#/.test(url)) {
                            grunt.log.writeln(" - Anchors not allowed, url ignored => " + url);
                            return url;
                        }

                        var newUrl = path.resolve(path.dirname(filename), url ).replace(baseDir, '.');
                        return util.format("url(%s)", newUrl);
                    });

                    grunt.file.write(filename, css);
                });
            });
        });
    });
};
