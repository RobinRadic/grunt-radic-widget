/*
 * grunt-minscript-tpl
 *
 *
 * Copyright (c) 2014 Robin Radic
 * Licensed under the MIT license.
 */

'use strict';
var lib = require('../lib');
var util = require('util');
var path = require('path');
var _ = require('lodash'),
//    chalk = require('chalk'),
    Handlebars = require('handlebars'),
    fs = require('fs-extra'),
    async = require('async'),
    UglifyJS = require('uglifyjs'),
    exec = require('child_process').exec;

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    //grunt.option('stack', true);
    grunt.registerMultiTask('build_widget', 'The best Grunt plugin ever.', function () {
        var self = this;
        var taskDone = this.async();
        var options = this.options({
            punctuation: '.',
            separator: ', ',
            template: {
                ext: 'hbs',
                minify: false,
                keepCompiledFile: false
            },
            sass: {
                enabled: true,
                style: 'expanded',
                sourcemap: 'none'
            },
            header: true,
            concat: true,
            minify: true
        });

        function nameFile(ext){
            return self.target + '.' + ext;
        }

        var paths = {
            rootDir: path.join(options.rootDir, this.target)

        };
        paths.scriptPath = path.join(paths.rootDir, nameFile('js'));
        paths.tplFile = path.join(paths.rootDir, nameFile('tpls.js'));
        paths.headerFile = path.join(paths.rootDir, 'header');
        paths.scssFile = path.join(paths.rootDir, nameFile('scss'));


        var actions = {
            precompile: function (data, next) {
                var cmd = 'handlebars -e ' + options.template.ext + (options.template.minify === true ? ' -m ' : ' ') + paths.rootDir + ' -f ' + paths.tplFile;
                var child = exec(cmd, function (error, stdout, stderr) {
                    grunt.log.ok('Precompiled handlebars');
                    if(error) grunt.log.warn('precompile error, cmd: ' + cmd);
                    next(error, data);
                });
            },
            read: function (data, next) {
                async.parallel({
                    script: function (cb) {
                        fs.readFile(paths.scriptPath, function (err, data) {
                            cb(err, data);
                        });
                    },
                    template: function (cb) {
                        fs.readFile(paths.tplFile, function (err, data) {
                            cb(err, data);
                        });
                    },
                    header: function (cb) {
                        fs.readFile(paths.headerFile, function (err, data) {
                            cb(err, data);
                        });
                    }
                }, function (err, data) {
                    grunt.log.ok('Loaded script and precompiled template files');
                    next(err, data);
                })
            },
            write: function (data, next) {
                data.output = data.script;
                if (options.concat === true) {
                    data.output = data.template + "\n;\n" + data.script;
                }
                if(options.header === true){
                    data.output = data.header + data.output;
                }
                fs.outputFile(path.join(options.dest, nameFile('js')), data.output, function (err) {
                    grunt.log.ok('Written output to ' + paths.destFile);
                    next(err, data);
                });

            },
            minify: function(data, next){
                var result = UglifyJS.minify(data.output, {fromString: true});
                data.minified = (options.header === true ? data.header : '') + result.code;
                var outputFile = path.join(options.dest, nameFile('min.js'));
                fs.outputFile(outputFile, data.minified, function (err) {
                    grunt.log.ok('Written minified output to ' + outputFile);
                    next(err, data);
                });
            },
            clean: function (data, next) {
                fs.remove(paths.tplFile, function (err) {
                    grunt.log.ok('Cleaned up temporary compiled template file');
                    next(err, data);
                });
            },
            sass2css: function(data, next){

                var cmd = 'sass -f --sourcemap=' + options.sass.sourcemap + ' --style ' + options.sass.style + ' ' +
                    paths.scssFile +
                    ' ' +
                    path.join(options.dest, nameFile('css'));

                //console.log(cmd);

                var child = exec(cmd, function (error, stdout, stderr) {
                    grunt.log.ok('preprocessed scss');
                    next(error, data);
                });
            }
        };


        var execute = [
            function (next) {
                grunt.log.subhead('Building widget: ' + self.target);
                next(null, {});
            }
        ];

        execute.push(actions.precompile, actions.read, actions.write);
        if(options.sass.enabled === true && fs.existsSync(paths.scssFile)){
            execute.push(actions.sass2css);
        }
        if(options.minify === true){
            execute.push(actions.minify);
        }
        if (options.template.keepCompiledFile !== true) {
            execute.push(actions.clean);
        }

        async.waterfall(execute, function (err, data) {
            if (err) grunt.fail.fatal(new Error(err));
            taskDone();
        });

    });

};
