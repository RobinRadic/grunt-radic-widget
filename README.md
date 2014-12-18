grunt-radic-widget
=============
[![Build Status](https://secure.travis-ci.org/RobinRadic/grunt-radic-widget.svg?branch=master)](https://travis-ci.org/RobinRadic/grunt-radic-widget)
[![GitHub version](https://badge.fury.io/gh/robinradic%2Fgrunt-radic-widget.svg)](http://badge.fury.io/gh/robinradic%2Fgrunt-radic-widget)
[![Goto documentation](http://img.shields.io/badge/goto-documentation-orange.svg)](http://robinradic.github.io/projects/grunt-radic-widget)
[![Goto repository](http://img.shields.io/badge/goto-repository-orange.svg)](https://github.com/robinradic/grunt-radic-widget)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](http://radic.mit-license.org)

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-radic-widget --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-radic-widget');
```

## The "build_widget" task

### Overview

```js
grunt.initConfig({
    build_widget: {    
        options: {
            rootDir: 'src/widgets',
            dest: 'src/widgets'
        },
        'github-profile': {        
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
        }
    }
});
```



## License
Copyright 2014 Robin Radic 

[MIT Licensed](http://radic.mit-license.org)

