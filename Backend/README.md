# ReliefSync AI — Backend

REST API for **ReliefSync AI**, a disaster relief coordination platform for NGOs. It handles authentication, community reports (text and PDF), AI-assisted extraction of structured need data, volunteer records, skill-based matching, assignments, summaries, and dashboard metrics.

**Stack:** Node.js (ES modules), Express 5, MongoDB (Mongoose), JWT auth, OpenAI (structured extraction), Nodemailer (optional Gmail), Helmet, CORS.

## Prerequisites

- **Node.js** 18+ (with npm)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string
- **OpenAI API key** — used for report text extraction (see [OpenAI](https://platform.openai.com/))
- **Gmail (optional)** — for outbound email (critical need alerts, assignment notifications). Use an [app password](https://support.google.com/accounts/answer/185833) if 2FA is enabled.

## Setup

1. **Install dependencies**

   ```bash
   cd Backend
   npm install
   ```

2. **Environment**

   Copy the example file and fill in real values:

   ```bash
   cp .env.example .env
   ```

   | Variable        | Description |
   | --------------- | ----------- |
   | `MONGO_URL`     | MongoDB connection string (required) |
   | `PORT`          | Server port (default: `5000`) |
   | `NODE_ENV`      | e.g. `development` or `production` |
   | `JWT_SECRET`    | Secret for signing JWTs (required for auth) |
   | `OPENAI_API_KEY`| OpenAI API key (required for AI extraction / summaries) |
   | `EMAIL_USER`    | Gmail address for sending mail (optional) |
   | `EMAIL_PASS`    | Gmail app password (optional) |

3. **Upload directory**

   PDF report uploads are written to `uploads/reports/`. Create it if it does not exist (Multer may fail otherwise):

   ```bash
   mkdir -p uploads/reports
   ```

   On Windows PowerShell:

   ```powershell
   New-Item -ItemType Directory -Force -Path uploads\reports
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm start
   ```

   With default `PORT`, the API listens at **http://localhost:5000**.

## CORS

The server allows browser origins `http://localhost:3000` and `http://localhost:5173` (typical Create React App and Vite dev servers). Add more origins in `server.js` if your frontend runs elsewhere.

## API overview

**Public**

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET`  | `/api/health` | Liveness / health check |
| `POST` | `/api/auth/register-ngo` | Register NGO user |
| `POST` | `/api/auth/login` | Login, returns JWT |

**Protected** — send header `Authorization: Bearer <token>` for all routes below.

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET`  | `/api/needs` | List needs for the NGO |
| `GET`  | `/api/needs/:id` | Get a need by ID |
| `POST` | `/api/reports/text` | Create report from raw text (AI extraction) |
| `POST` | `/api/reports/pdf` | Upload PDF report (`pdf` field, `title` in body) — max 5 MB |
| `GET`  | `/api/reports` | List reports |
| `GET`  | `/api/reports/:id` | Get report by ID |
| `POST` | `/api/volunteers` | Create volunteer |
| `GET`  | `/api/volunteers` | List volunteers |
| `GET`  | `/api/volunteers/:id` | Get volunteer |
| `PUT`  | `/api/volunteers/:id` | Update volunteer |
| `GET`  | `/api/matching/needs/:needId/recommendations` | Recommended volunteers for a need |
| `POST` | `/api/assignments` | Create assignment |
| `GET`  | `/api/assignments` | List assignments |
| `PUT`  | `/api/assignments/:id/status` | Update assignment status |
| `POST` | `/api/summaries/generate` | Generate summary |
| `GET`  | `/api/dashboard/overview` | Dashboard overview |
| `GET`  | `/api/dashboard/critical-needs` | Critical needs |
| `GET`  | `/api/dashboard/active-assignments` | Active assignments |
| `GET`  | `/api/dashboard/volunteer-stats` | Volunteer stats |

## Project layout

- `server.js` — Express app, middleware, route mounting, startup
- `src/config/` — database connection
- `src/controllers/` — request handlers
- `src/middlewares/` — auth, errors
- `src/models/` — Mongoose models
- `src/repositories/` — data access
- `src/routes/` — route definitions
- `src/services/` — business logic (AI, email, matching, etc.)

## Scripts

| Script   | Command        |
| -------- | -------------- |
| Dev (watch) | `npm run dev`  |
| Start       | `npm start`    |

## Related

This repository also contains a **Frontend** (e.g. Vite + React) that should be configured to call this API’s base URL (for example `http://localhost:5000` in development).
