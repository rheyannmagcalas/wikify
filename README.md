# Wikify

Wikify is a tool to help improve Wikipedia articles by suggesting cleanup tasks based on categories of interest. This repository contains the backend API, the React frontend application, and notebooks for data analysis.

---

## Project Structure

```
wikify/
├── backend/ # Backend API server (e.g., Flask, FastAPI)
├── frontend/ # React frontend application for user interaction
├── notebooks/ # Jupyter notebooks for data exploration and analysis
```

---

## Frontend (React)

The frontend React app allows users to select categories of interest, view suggested Wikipedia articles needing cleanup, and mark them as done.

### Setup & Development

A Makefile is included in the `frontend` folder to simplify common tasks:

- `make install`  
  Installs npm dependencies and ensures `js-cookie` and `bootstrap` are installed.

- `make start`  
  Kills any process running on port 5174, then starts the Vite dev server at [http://localhost:5174](http://localhost:5174).

- `make build`  
  Builds the app for production.

- `make clean`  
  Cleans `node_modules`, build directory (`dist`), and `package-lock.json`.

- `make format`  
  Formats source files using Prettier.

### Running Locally

```bash
cd frontend
make install
make start
Open http://localhost:5174 in your browser to view the app.

Backend
The backend provides a REST API to serve article recommendations based on user-selected categories.

Runs on localhost:8000 by default.

Accepts category parameters via query string, e.g.,
http://localhost:8000/recommendations?categories=Science,Technology

Refer to the backend folder README for detailed setup and API docs.

Notebooks
Contains Jupyter notebooks used for data analysis, model training, or exploring Wikipedia article data.

```
