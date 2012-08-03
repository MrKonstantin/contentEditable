all: ender

jquery:
	node ../node_modules/.bin/ender build jquery valentine keymaster

ender:
	node ../node_modules/.bin/ender build domready qwery bean bonzo valentine keymaster

refresh:
	node ../node_modules/.bin/ender refresh

clean:
	rm -rf ender.min.js ender.js node_modules

.PHONY: all ender jquery refresh clean