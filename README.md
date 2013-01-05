grunt-css-urls
==============

> Grunt task to make css urls relative to a main css file with @import rules.

Getting Started
---------------

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-css-urls`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-css-urls');
```

finally define the task indicating where the css with the **@import** rules is located:

```javascript
grunt.initConfig({
    cssUrls: {
        /* src *(required)*: The file location of the css with the @import rules. */
        src:  "public/site.css"
    }
});
```
Read the scenario described below to better understand how this task works combined together with the [grunt-css][grunt_css] task.

The Scenario
------------

Lets imagine the following folder structure and css contents:

```bash
public
├── css
│   └─── common.css
│   └─── views
│   |    └── products
│   |         └── show.css
│   |         └── img
│   |              └── product-icon.png
├── img
|   └── logo.png
|   └── arrow.png
├── vendor
│   └─── jquery-plugin
│        └── css
│             └── jquery-plugin.css
│             └── images
│                  └── plugin.png
```

#### common.css
```css
h1.logo { url('../img/logo.png') }
```

#### show.css
```css
.product-icon { url('img/product-icon.png') }
.product-table .arrow { url('../../../img/arrow.png') }
```

#### jquery-plugin.css
```css
.jquery-plugin { url('images/jquery-plugin.png') }
```

and the html file including the css inclussions:

```html
<link media="screen" rel="stylesheet" type="text/css" href="/public/css/common.css">
<link media="screen" rel="stylesheet" type="text/css" href="/public/css/views/productos/show.css">
<link media="screen" rel="stylesheet" type="text/css" href="/public/vendor/jquery-plugin/css/jquery-plugin.css">
```

## The Bundling Issue

If we want to bundle all the thing into a sinle file e.g.: **/public/site.css** including the three css files described
above, the images' references will not work as they will be now relative the new **/public** folder.

## The Solution

To solve the bundling issue we'll create a **site.css** file inside the **public** folder at the same level
of **css**, **img** and **vendor** folders taking advantage of the **@import** css rules:

```css
@import './public/css/common.css';
@import './public/css/views/productos/show.css';
@import './public/vendor/jquery-plugin/css/jquery-plugin.css';
```

and reference it in the html:

```html
<link media="screen" rel="stylesheet" type="text/css" href="/public/site.css">
```

By doing this we'll have a reference starting point to calcule the relative urls for the **url** references
inside the **css** files and replace those with the corresponding location.

And here is where the **grunt-css-url** task will do the magic. The folowing sample uses also the [grunt-css][grunt_css]
task to minify the css with the precedence defined in the **site.css** file:

```javascript
var path = require('path');

module.exports = function(grunt) {
    grunt.initConfig({
        cssUrls: {
            src:  "public/site.css"
        },
        cssmin: {
            all: {
                dest: 'public/site.min.css',
                src: function () {
                    var content = grunt.file.read('public/site.css').toString();
                    var files = [];

                    content.replace(/@import\s+'([^']+)/gim, function(match, location, a) {
                        files.push(path.resolve('public/' + location));
                    });

                    return files;
                }()
            }
        }
    });

    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-css-urls');

    grunt.registerTask('release', [ 'cssUrls', 'cssmin' ]);
};
```
Based on the scenario described above, the url references will end up like this:

```css
h1.logo { url('./img/logo.png') }
.product-icon { url('./css/views/products/img/product-icon.png') }
.product-table .arrow { url('../../../img/arrow.png') }
.jquery-plugin { url('./vendor/jquery-plugin/css/images/jquery-plugin.png') }
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
[grunt_css]: https://github.com/jzaefferer/grunt-css

Changelog
---------

#### v1.3

*   Ignore -moz urls like => url('xbl.xml#wordwrap');
*   Ignore empty urls

License
-------

Copyright (c) 2012 Juan Pablo Garcia & Ideame Dev Team
Licensed under the MIT license.
