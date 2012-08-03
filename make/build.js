require('smoosh').config({
    'JAVASCRIPT': {
        'DIST_DIR': './'
      , 'contenteditable': [
            './src/copyright.js'
          , './src/contenteditable.js'
        ]
    }
  , 'JSHINT_OPTS': {
        'predef': [ 'module', 'define' ]
      , 'boss': true
      , 'forin': true
      , 'curly': false
      , 'debug': true
      , 'devel': false
      , 'evil': false
      , 'regexp': false
      , 'undef': true
      , 'sub': true
      , 'white': false
      , 'indent': 2
      , 'whitespace': true
      , 'asi': true
      , 'trailing': true
      , 'latedef': true
      , 'laxbreak': true
      , 'browser': true
      , 'eqeqeq': true
      , 'bitwise': false
      , 'loopfunc': false
    }
}).run().build().analyze()