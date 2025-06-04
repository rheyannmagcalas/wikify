# Wikify Frontend

This is the React frontend application for **Wikify** — a tool that suggests Wikipedia articles for cleanup based on user interests.

---

## Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)
- Make (to use the provided Makefile)

---

## Quick Start

Use the provided `Makefile` to easily install dependencies, run the development server, build for production, and clean the project.

### Install dependencies and start dev server

```bash
make
```

This runs the default all target which installs dependencies and starts the development server on: http://localhost:5174

## Makefile Targets

- **install**  
  Install npm dependencies (`npm install`) and ensure `js-cookie` and `bootstrap` are installed.

- **start**  
  Kill any process using port 5174, then start the dev server on port 5174 using Vite.

- **build**  
  Build the app for production (`npm run build`).

- **clean**  
  Remove `node_modules`, build directory (`dist`), and `package-lock.json`.

- **format**  
  Run Prettier to format source files.

## Development

- The app runs on Vite dev server: http://localhost:5174
- Live reload enabled for fast iteration.
- User preferences (username & categories) are stored in cookies.
- Modify source files in src/ to add or update features.

## Cleaning

To reset your environment and clean install dependencies, run:

```
make clean
make install
```

## Notes

- The frontend expects an API backend running locally on port 8000 to fetch recommendations.
- Categories can be toggled on the main page to filter article suggestions.
- Refresh button reloads suggestions based on current categories.
