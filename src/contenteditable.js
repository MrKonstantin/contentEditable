/*  */
if ('function' != typeof debug) { window.debug = function(){return function(){}} };

var Editor = function($) {

  "use strict"

  var log = debug('valve');

  var default_toolbar = {
      groups: [
        'bold italic underline'
      , 'p h1 h2 h3 h4 h5 h6'
      , 'createLink insertImage'
      , 'blockquote code'
      , 'ol ul'
      , 'indent outdent'
      ]
    , buttons: {
        bold: {
          shortcut: "⌘+b, ctrl+b",
          execCommand: "bold",
          icon:"icon-bold",
          tooltip: 'Bold'
        },
        italic: {
          shortcut: "⌘+i, ctrl+i",
          execCommand: "italic",
          icon:"icon-italic",
          tooltip: 'Italic'
        },
        underline: {
          shortcut: "⌘+u, ctrl+u",
          execCommand: "underline",
          icon:"icon-underline",
          tooltip: 'Underline'
        },
        removeFormat: {
          shortcut: "⌘+m, ctrl+m",
          execCommand: ["removeFormat", "unlink", "formatBlock"],
          execCommandValue: [null, null, "<P>"],
          icon: "icon-filter",
          tooltip: 'Remove Format'
        },
        createLink: {
          shortcut: "⌘+l, ctrl+l",
          execCommand: "createLink",
          execCommandValue: function (callback) {
            callback(prompt("Enter URL:", "http://"));
          },
          icon: "icon-link",
          tooltip: 'Link'
        },
        insertImage: {
          shortcut: "⌘+g, Ctrl+g",
          execCommand: "insertImage",
          execCommandValue: function (callback) {
            callback(prompt("Enter image URL:", "http://"));
          },
          icon: 'icon-picture',
          tooltip: 'Picture'
        },
        blockquote: {
          shortcut: "⌘+q, ctrl+q",
          execCommand: "formatBlock",
          execCommandValue: ["<BLOCKQUOTE>"],
          icon: "icon-chevron-right",
          tooltip: 'Quote'
        },
        code: {
          shortcut: "⌘+⌥+k, Ctrl+Alt+k",
          execCommand: "formatBlock",
          execCommandValue: ["<PRE>"],
          icon: "icon-edit",
          tooltip: 'Code'
        },
        ol: {
          shortcut: "⌘+⌥+o, Ctrl+Alt+o",
          execCommand: "insertOrderedList",
          icon:"icon-list-ol",
          tooltip: 'Ordered List'
        },
        ul: {
          shortcut: "⌘+⌥+u, Ctrl+Alt+u",
          execCommand: "insertUnorderedList",
          icon:"icon-list-ul",
          tooltip: 'Unordered List'
        },
        sup: {
          shortcut: "⌘+., Ctrl+.",
          execCommand: "superscript",
          html:  "x<sup>2</sup>",
          tooltip: 'Superscript'
        },
        sub: {
          shortcut: "⌘+shift+., Ctrl+Shift+.",
          execCommand: "subscript",
          html:  "x<sub>2</sub>",
          tooltip: 'Subscript'
        },
        p: {
          shortcut: "⌘+⌥+0, Ctrl+Alt+0",
          execCommand: "formatBlock",
          execCommandValue: ["<P>"],
          html: "P",
          tooltip: 'Paragraph'
        },
        h1: {
          shortcut: "⌘+⌥+1, Ctrl+Alt+1",
          execCommand: "formatBlock",
          execCommandValue: ["<H1>"],
          html: "H<sub>1</sub>",
          tooltip: 'Heading 1'
        },
        h2: {
          shortcut: "⌘+⌥+u, Ctrl+Alt+2",
          execCommand: "formatBlock",
          execCommandValue: ["<H2>"],
          html: "H<sub>2</sub>",
          tooltip: 'Heading 2'
        },
        h3: {
          shortcut: "⌘+⌥+3, ctrl+alt+3",
          execCommand: "formatBlock",
          execCommandValue: ["<H3>"],
          html:  "H<sub>3</sub>",
          tooltip: 'Heading 3'
        },
        h4: {
          shortcut: "⌘+⌥+4, ctrl+alt+4",
          execCommand: "formatBlock",
          execCommandValue: ["<H4>"],
          html:  "H<sub>4</sub>",
          tooltip: 'Heading 4'
        },
        h5: {
          shortcut: "⌘+⌥+5, ctrl+alt+5",
          execCommand: "formatBlock",
          execCommandValue: ["<H5>"],
          html:  "H<sub>5</sub>",
          tooltip: 'Heading 5'
        },
        h6: {
          shortcut: "⌘+⌥+6, ctrl+alt+6",
          execCommand: "formatBlock",
          execCommandValue: ["<H6>"],
          html:  "H<sub>6</sub>",
          tooltip: 'Heading 6'
        },
        indent: {
          shortcut: "tab",
          execCommand: "indent",
          html:  "&rArr;",
          tooltip: 'Indent'
        },
        outdent: {
          shortcut: "shift+tab",
          execCommand: "outdent",
          html:  "&lArr;",
          tooltip: 'Outdent'
        }
      }
    };


  var Toolbar = function (options) {
    this.log = debug('valve:Toolbar');

    this.log('init');

    this.$el = $('<div class="btn-toolbar editor_toolbar">').appendTo('.buttons');
    this.options = _.extend(default_toolbar, options);
    this.buttons = [];

    _.bindAll(this, 'addButton', 'addGroup');

    _.each(this.options.groups, this.addGroup);
  };

  Toolbar.prototype.addGroup = function (grp) {
    this.log('addGroup');

    var self = this
      , group = $('<div class="btn-group">')
          .appendTo(this.$el);

    _.each(grp.split(' '), function (cmd) {
      self.addButton(self.options.buttons[cmd], group);
    });
  };

  Toolbar.prototype.addButton = function (btn, group) {
    this.log('addButton');

    var cmd = _.isString(btn.execCommand)? [btn.execCommand] : btn.execCommand
      , cmdval = _.isString(btn.execCommandValue)? [btn.execCommandValue] : btn.execCommandValue
      ;

    var b = $('<a class="btn" href="#">');

    // insert html inside the button
    // eventually insert an icon
    b.html(
      (btn.icon ? '<i class="' + btn.icon + '"></i>' : '')
    + (btn.html ? btn.html : ''));

    if (btn.tooltip)
      b.attr('title', btn.tooltip)
    
    b.bind('click', function (e){
      e.preventDefault();
      e.stopPropagation();

      _.each(cmd, function (cmd, i) {
        var value = _.isArray(cmdval) ? cmdval[i] : cmdval;

        // if the command wants to provide a value to the execCommand, allow
        // it to using a callback
        if (_.isFunction(value)) {

          //TODO: use ƒ(err, value)
          value(function (value) {
            if (value === false) {
              return false;
            }

            document.execCommand(cmd, false, value);
          });
        } else {
          document.execCommand(cmd, false, value);
        }
      });
      return false;
    });

    this.buttons.push(b);

    if (btn.shortcut)
      $.key(btn.shortcut.toString(), function () {
        b.click();
      });

    b.appendTo(group);
  };

  // unbind every event!
  Toolbar.prototype.unbind = function(){
    this.log('unbind');

    this.$el.find('a')
      .unbind('click');
  };
  Toolbar.prototype.appendTo = function(el) {
    this.log('appendTo');

    if (!this.attached){
      this.attached = 1;
      return this.$el.appendTo($(el));
    }
  };

  var Editor = function ( options, element ) {
    this.log = debug('valve:Editor');
    this.log('init');

    this.options = options;

    this.toolbar = new Toolbar(options.toolbar);

    _.bindAll(this, 'focus', 'blur', 'editable');

    if (element)
      this.bind(element);
  }

  Editor.prototype.editable = function (e) {
    this.log('editable');

    if (this.$el.attr('contenteditable') == 'true') {
      this.$el.attr('contenteditable', false);
    } else {
      this.$el.attr('contenteditable', true);
    }
  };
  
  Editor.prototype.bind = function ( element ) {
    this.log('bind');

    this.$el = $(element);
    this.$el
      .bind('focus', this.focus)
      .bind('blur', this.blur);

    return this;
  };

  // unbind events
  Editor.prototype.unbind = function(){
    this.log('unbind');

    this.$el
      .unbind('focus')
      .unbind('blur');
  };
  Editor.prototype.focus = function() {
    this.log('focus');

    this.toolbar.appendTo(this.options.toolbar)
  };
  Editor.prototype.clean = function(){};
  Editor.prototype.blur  = function(){};

  return Editor;
}(ender);