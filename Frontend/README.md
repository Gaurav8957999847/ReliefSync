# ReliefSync AI — Frontend

Web dashboard for **ReliefSync AI**: register, sign in, and manage volunteers, needs, assignments, matching, and community reports against the ReliefSync REST API.

This package is a **React + Vite** single-page application. The HTTP API is implemented in the sibling [`../Backend`](../Backend) project (Express + MongoDB).

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **Backend** running locally (default `http://localhost:5000`) or a deployed API you can point this app at

## Quick start

```bash
cd Frontend
npm install
cp .env.example .env   # optional; defaults match local backend
npm run dev
```

The dev server defaults to **http://localhost:5173** (Vite). Open that URL in a browser.

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start Vite dev server with HMR |
| `npm run build`| Production build → `dist/`     |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint                     |

## Configuration

- **`VITE_API_URL`** — Base URL for API requests (must include the `/api` prefix your server mounts). Set in `.env` (see `.env.example`). Implemented in `src/api/axios.js`.
- If unset, the client uses `http://localhost:5000/api`.

## Stack

- React 19, React Router 7
- Tailwind CSS 3, PostCSS, Autoprefixer
- Axios (JWT on requests; 401 clears session and sends user to `/login`)
- Framer Motion, Lucide React, react-hot-toast

## App structure

| Area        | Role |
| ----------- | ---- |
| `src/pages/` | Route screens: login, register, dashboard, volunteers, needs, assignments, matching, reports |
| `src/components/` | Shared UI (e.g. sidebar, protected route) |
| `src/context/AuthContext.jsx` | Auth state and token handling |
| `src/api/axios.js` | Shared Axios instance, JWT interceptors, and API base URL |

## Production build

```bash
npm run build
```

Static assets are emitted under `dist/`. Serve `dist/` with any static host or reverse proxy, and ensure `VITE_API_URL` is set at **build time** to your production API URL (Vite inlines `import.meta.env` values into the bundle).

## Backend

The **supported** API is the sibling **`Backend/`** (or `backend/`) Express app. This SPA only talks to it over HTTP using `VITE_API_URL`.
