# wikify-frontend Makefile

NPM = npm
BUILD_DIR = dist
DEV_PORT = 5174

all: install start

install:
	$(NPM) install
	$(NPM) list js-cookie || $(NPM) install js-cookie
	$(NPM) list bootstrap || $(NPM) install bootstrap

# Kill any process on the desired port, then run Vite on 5174
start:
	@echo "🔄 Killing process on port $(DEV_PORT) if any..."
	- lsof -ti tcp:$(DEV_PORT) | xargs kill -9 2>/dev/null || true
	@echo "🚀 Starting dev server on http://localhost:$(DEV_PORT)"
	$(NPM) run dev -- --port $(DEV_PORT)

build:
	$(NPM) run build

clean:
	rm -rf node_modules $(BUILD_DIR) package-lock.json

format:
	npx prettier --write "src/**/*.{js,jsx,json,css,md}"
