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

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

Documentation
-------------

TODO

### Target Properties

*   __src__*(required)*: The file location of the css with the @import rules.

### Example

```javascript
grunt.initConfig({
  cssUrls: {
    src:  "dist/main.css"
  }
});
```

License
-------

Copyright (c) 2012 Juan Pablo Garcia & Ideame Dev Team
Licensed under the MIT license.
