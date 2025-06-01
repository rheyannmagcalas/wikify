# wikify-frontend Makefile

NPM = npm
BUILD_DIR = dist

all: install start

install:
	$(NPM) install
	$(NPM) list js-cookie || $(NPM) install js-cookie
	$(NPM) list bootstrap || $(NPM) install bootstrap

start:
	$(NPM) run dev

build:
	$(NPM) run build

clean:
	rm -rf node_modules $(BUILD_DIR) package-lock.json

format:
	npx prettier --write "src/**/*.{js,jsx,json,css,md}"
