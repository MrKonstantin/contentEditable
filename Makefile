# Patterns matching CSS files that should be minified. Files with a -min.css
# suffix will be ignored.
CSS_FILES = $(filter-out %-min.css,$(wildcard src/*.css ))

# Patterns matching JS files that should be minified. Files with a -min.js
# suffix will be ignored.
JS_FILES = $(filter-out %-min.js,$(wildcard src/*.js ))

# Command to run to execute the YUI Compressor.
JSC = node ./node_modules/.bin/uglifyjs
CSSC = node ./node_modules/.bin/sqwish

CSS_MINIFIED = $(CSS_FILES:.css=-min.css)
JS_MINIFIED = $(JS_FILES:.js=-min.js)

all: help

# target: minify - Minifies CSS and JS.
minify: minify-css minify-js

# target: minify-css - Minifies CSS.
minify-css: $(CSS_FILES) $(CSS_MINIFIED)

# target: minify-js - Minifies JS.
minify-js: $(JS_FILES) $(JS_MINIFIED)

%-min.css: %.css
	@echo '==> Minifying $<'
	$(CSSC) $< -o $@
	@echo

%-min.js: %.js
	@echo '==> Minifying $<'
	$(JSC) $< >$@
	@echo

# target: contenteditable.js the full uncompressed library
contenteditable.js:
	@echo 'making the full library $<'
	cat $(JS_FILES) > $<

# target: contenteditable.js the full minified library
contenteditable.min.js: minify
	@echo 'making the full library $<'
	cat $(JS_MINIFIED) > $<

# target: clean - Removes minified CSS and JS files.
clean:
	rm -f $(CSS_MINIFIED) $(JS_MINIFIED)

# target: help - Displays help.
help:
	@egrep "^# target:" Makefile

smush:
	node make/build.js

serve:
	open http://localhost:4567/demo
	http-server -p 4567 ./

.PHONY: all serve smush help
