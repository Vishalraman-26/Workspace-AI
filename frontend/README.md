# Workspace AI Frontend

Modern React frontend for the Workspace AI assistant platform.

## Stack

- React 19
- Vite
- React Router DOM
- Bootstrap 5
- Axios
- React Icons
- React Markdown
- Day.js

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:5000`.

Ensure the backend is running on port 5000 before using authenticated features.

## Pages

- Dashboard — summary cards, recent activity, quick actions
- Assistant — AI chat with sessions, markdown, suggested prompts
- Knowledge — PDF upload, document list, RAG Q&A
- Gmail — inbox, filters, search, AI summary
- Calendar — today's and upcoming meetings, CRUD
- Tasks — task cards with create/update/delete/complete
- Settings — profile, Google connect, theme, logout

## Authentication

Sign in uses **Google OAuth only** — no manual token entry.

1. User clicks **Continue with Google** on `/login`
2. Browser redirects to `GET /api/auth/google`
3. Backend completes Google OAuth and issues an application JWT
4. Backend redirects to `/auth/callback?token=<JWT>&email=...`
5. Frontend stores the JWT and sends `Authorization: Bearer <JWT>` on all API calls
6. Logout calls `POST /api/auth/logout` and clears local session

### Google integrations (Gmail / Calendar)

If Gmail or Calendar APIs fail because Google is not linked, the app shows a **Connect Google** screen instead of an error. Connecting uses `GET /api/google/connect` (with Bearer JWT) and returns via `/auth/google-callback`.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (default: `http://localhost:5000`) |

## Build

```bash
npm run build
npm run preview
```
