﻿/* jQuery.contentEditable Plugin
Copyright © 2011 FreshCode
http://www.freshcode.co.za/

DHTML text editor jQuery plugin that uses contentEditable attribute in modern browsers for in-place editing.

Dependencies
------------
 - jQuery core
 - shortcut.js for keyboard hotkeys
 
Issues
------
 - no image support
 - no <code> or <blockquote> buttons (use Tab key for quotes)
 - no text alignment support
 
To Do
-----
 - let plugin build the toolbar
 - moves hard-coded IDs to options

License
-------
Let's keep it simple:
 1. You may use this code however you wish, including for commercial projects.
 2. You may not sell it or charge for it without my written permission.
 3. You muse retain the license information in this file.
 4. You are encouraged to contribute to the plugin on bitbucket (https://bitbucket.org/freshcode/jquery.contenteditable)
 5. You are encouraged to link back to www.freshcode.co.za if you publish something about it so everyone can benefit from future updates.

Best regards
Petrus Theron
contenteditable@freshcode.co.za
FreshCode Software Development
 
*/
(function ($) {

	var methods = {
		edit: function (isEditing) {
			return this.each(function () {
				$(this).attr("contentEditable", (isEditing === true) ? true : false);
			});
		},
		bold: function () {
			document.execCommand("bold", false, null);
		},
		italicize: function () {
			document.execCommand("italic", false, null);
		},
		underline: function () {
			document.execCommand("underline", false, null);
		},
		orderedList: function () {
			document.execCommand("InsertOrderedList", false, null);
		},
		unorderedList: function () {
			document.execCommand("InsertUnorderedList", false, null);
		},
		indent: function () {
			document.execCommand("indent", false, null);
		},
		outdent: function () {
			document.execCommand("outdent", false, null);
		},
		superscript: function () {
			document.execCommand("superscript", false, null);
		},
		subscript: function () {
			document.execCommand("subscript", false, null);
		},
		createLink: function () { /* This can be improved */
			var urlPrompt = prompt("Enter URL:", "http://");
			document.execCommand("createLink", false, urlPrompt);
		},
		formatBlock: function (block) {
			document.execCommand("FormatBlock", null, block);
		},
		removeFormat: function () {
			document.execCommand("removeFormat", false, null);
		},
		copy: function () {
			document.execCommand("Copy", false, null);
		},
		paste: function () {
			document.execCommand("Paste", false, null);
		},
		save: function (callback) {
			return this.each(function () {
				(callback)($(this).attr("id"), $(this).html());
			});
		},
		init: function (options) {

			var $toolbar = $("#editor-toolbar"); // put in options

			$(window).scroll(function () {
				var docTop = $(window).scrollTop();

				var toolbarTop = $toolbar.offset().top;
				if (docTop > toolbarTop) {
					$("div.buttons", $toolbar).css({ "position": "fixed", "top": "0" });
				} else {
					$("div.buttons", $toolbar).css("position", "relative");
				}
			});

			/* Bind Toolbar Clicks */

			$("a.toolbar_bold", $toolbar).click(function () { methods.bold.apply(this); });

			$("a.toolbar_italic", $toolbar).click(function () { methods.italicize.apply(this); });

			$("a.toolbar_underline", $toolbar).click(function () { methods.underline.apply(this); });

			$("a.toolbar_ol", $toolbar).click(function () { methods.orderedList.apply(this); });
			$("a.toolbar_ul", $toolbar).click(function () { methods.unorderedList.apply(this); });
			$("a.toolbar_sup", $toolbar).click(function () { methods.superscript.apply(this); });
			$("a.toolbar_sub", $toolbar).click(function () { methods.subscript.apply(this); });
			$("a.toolbar_link", $toolbar).click(function () { methods.createLink.apply(this); });

			$("a.toolbar_p", $toolbar).click(function () { methods.formatBlock.apply(this, ["<P>"]); });
			$("a.toolbar_h1", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H1>"]); });
			$("a.toolbar_h2", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H2>"]); });
			$("a.toolbar_h3", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H3>"]); });
			$("a.toolbar_h4", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H4>"]); });
			$("a.toolbar_h5", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H5>"]); });
			$("a.toolbar_remove", $toolbar).click(function () { methods.removeFormat.apply(this); });

			var shortcuts = [
				{ keys: 'Ctrl+l', method: function () { methods.createLink.apply(this); } },
				{ keys: 'Ctrl+j', method: function () { methods.unorderedList.apply(this); } },
				{ keys: 'Ctrl+k', method: function () { methods.orderedList.apply(this); } },
				{ keys: 'Ctrl+.', method: function () { methods.superscript.apply(this); } },
				{ keys: 'Ctrl+Shift+.', method: function () { methods.subscript.apply(this); } },
				{ keys: 'Ctrl+Alt+0', method: function () { methods.formatBlock.apply(this, ["p"]); } },
				{ keys: 'Ctrl+b', method: function () { methods.bold.apply(this); } },
				{ keys: 'Ctrl+i', method: function () { methods.italicize.apply(this); } },
				{ keys: 'Ctrl+Alt+1', method: function () { methods.formatBlock.apply(this, ["h1"]); } },
				{ keys: 'Ctrl+Alt+2', method: function () { methods.formatBlock.apply(this, ["h2"]); } },
				{ keys: 'Ctrl+Alt+3', method: function () { methods.formatBlock.apply(this, ["h3"]); } },
				{ keys: 'Ctrl+Alt+4', method: function () { methods.formatBlock.apply(this, ["h4"]); } },
				{ keys: 'Ctrl+Alt+4', method: function () { methods.formatBlock.apply(this, ["h4"]); } },
				{ keys: 'Ctrl+m', method: function () { methods.removeFormat.apply(this); } },
				{ keys: 'Ctrl+u', method: function () { methods.underline.apply(this); } },
				{ keys: 'tab', method: function () { methods.indent.apply(this); } },
				{ keys: 'Ctrl+tab', method: function () { methods.indent.apply(this); } },
				{ keys: 'Shift+tab', method: function () { methods.outdent.apply(this); } }
			];

			$.each(shortcuts, function (index, elem) {
				shortcut.add(elem.keys, function () {
					elem.method();
					return false;
				}, { 'type': 'keydown', 'propagate': false });
			});

			return this.each(function () {

				var $this = $(this), data = $this.data('fresheditor'),
					tooltip = $('<div />', {
						text: $this.attr('title')
					});

				// If the plugin hasn't been initialized yet
				if (!data) {
					/* Do more setup stuff here */

					$(this).data('fresheditor', {
						target: $this,
						tooltip: tooltip
					});
				}
			});
		}
	};

	$.fn.fresheditor = function (method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.contentEditable');
		}
		
		return;
	};

})(jQuery);