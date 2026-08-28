# Reviewer Queue — repository overview

This repository contains a small, self-contained reviewer-queue application used for pre-interview familiarisation. It intentionally contains no interview brief, assessment criteria, or task instructions.

## What is here

- `backend/`: a FastAPI service that exposes review items and workflow action endpoints.
- `frontend/`: a Vue 3 + Vite interface for viewing the active queue and a selected item.
- `data/review_items.json`: local seed data used by the API.
- `examples/seed_preview.md`: a concise description of the seed-data shape.
- `bin/start`: a convenience script that starts the API and frontend together.

## Local setup

Requirements: Python 3.11+ and Node.js 20+.

```bash
pip install -r backend/requirements.txt
npm ci --prefix frontend
```

Run the application:

```bash
./bin/start
```

The frontend is served at `http://localhost:3000`; it proxies API calls to the FastAPI service at `http://127.0.0.1:8000`.

## Checks

```bash
(cd backend && pytest)
npm test --prefix frontend
```

## Repository boundaries

The source and supporting setup files are included so candidates can orient themselves beforehand. The repository deliberately excludes the CoderPad challenge material and interviewer-only notes.
