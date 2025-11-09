<<<<<<< HEAD
# HostedGames Frontend (Vite + React) — Demo

Quick start

1. cd into `website-demo/backend` and run `npm install` then `npm run start` to start the demo backend on port 4000.
2. cd into `website-demo/frontend` and run `npm install` then `npm run dev` to start the React app (default port 5173).

The frontend talks to the backend at `http://localhost:4000` and uses a simple JSON file (`db.json`) for persistence.
=======
# HostedGames — Demo full-stack UI

This repository contains a small demo project that implements a frontend React UI and a tiny Express backend used for prototyping a hosted tournaments experience (login/signup, tournaments, wallet, leaderboard, and a minimal admin API).

This README explains how to get the project running locally, the project structure, the available API endpoints, and how to modify or extend the demo.

Table of contents
- Project status
- Prerequisites
- Quick start (Windows / PowerShell)
- Project layout
- Backend API (endpoints & payloads)
- Frontend (how to run & where files live)
- Authentication notes
- Adding sample data / admin actions
- Responsive & Modern-Login integration
- Troubleshooting
- Contributing
- License

## Project status

- Demo quality, not production-ready. Passwords are stored in plaintext in the demo DB (db.json). Do NOT use this for real users.
- The backend is intentionally simple to make it easy to inspect and extend.

## Prerequisites

- Node.js (v16+ recommended) and npm installed. Verify with:

```powershell
node -v
npm -v
```

## Quick start (Windows / PowerShell)

1. Clone or open this repository in your workspace (you're already in d:\Programming\HostedGames\GameHosted).
2. Install backend deps and start the backend server:

```powershell
cd d:\Programming\HostedGames\GameHosted\backend
npm install
npm run dev    # starts nodemon; or `npm start` to run once
```

3. In a new terminal, install frontend deps and run the Vite dev server:

```powershell
cd d:\Programming\HostedGames\GameHosted\frontend
npm install
npm run dev
```

4. Open the URL Vite prints (usually http://localhost:5173) and navigate to `/login` to see the login page, or `/` for the home UI.

The backend listens on port 4000 by default. If you need to change it, set the `PORT` environment variable before running the backend (PowerShell example):

```powershell
$env:PORT = 5000; npm run dev
```

## Project layout

- `backend/` — Express demo API and small file-based DB (`db.json`)
	- `index.js` — API server
	- `db.json` — lightweight JSON DB (auto-created if missing)
	- `tools/` — small helper scripts (e.g. `create_freefire.js`)
	- `package.json` — backend scripts (`start`, `dev`, `add-freefire`)
- `frontend/` — React app (Vite)
	- `src/` — source files
		- `pages/Login.jsx` — integrated Modern-Login React page
		- `pages/modern-login.css` — scoped CSS for the login page
		- `auth.js` — Auth provider used by the app
	- `public/Login/Modern-Login/` — original Modern-Login assets (index.html, style.css, script.js)
	- `package.json` — frontend scripts (`dev`, `build`, `preview`)
- `README.md` — this file

## Backend API — endpoints & payloads

This demo exposes the following endpoints. The backend uses `backend/db.json` as simple storage.

Base URL: http://localhost:4000

- GET /api/tournaments
	- Returns array of tournaments.

- GET /api/tournaments/:id
	- Returns tournament object or 404.

- POST /api/tournaments/:id/join
	- Body: { userId }
	- Joins a user to a tournament if they have sufficient wallet balance.

- POST /api/auth/signup
	- Body: { name, password }
	- Response: { token, user }

- POST /api/auth/login
	- Body: { name, password }
	- Response: { token, user }

- GET /api/auth/me
	- Header: Authorization: Bearer <token>
	- Returns user info associated with token.

- GET /api/wallet/:userId
	- Returns user wallet and transactions.

- POST /api/wallet/add
	- Body: { userId, amount, note }
	- Adds funds to user's wallet (demo only).

- GET /api/leaderboard
	- Returns demo leaderboard array.

- POST /api/admin/tournaments
	- Create a tournament (admin-only). Auth options:
		- Provide `x-admin-token` header with the value of the `ADMIN_TOKEN` env var (defaults to `demo-admin-token`), OR
		- Provide a valid Bearer token for a user object that has `isAdmin: true` in `db.json`.

Notes about responses: the demo returns straightforward JSON objects. See `backend/index.js` for implementation details.

## Frontend notes

- The frontend is a Vite + React app. Main commands live in `frontend/package.json`:
	- `npm run dev` — run Vite dev server
	- `npm run build` — build static assets
	- `npm run preview` — preview built site

- Auth: `frontend/src/auth.js` implements a small React context that stores tokens in `localStorage` and calls the demo backend endpoints. It expects the backend to return `{ token, user }` on login/signup.

## Authentication details

- Signup payload: { name, password }
- Login payload: { name, password }
- Both return `{ token, user }` where `user` includes { id, name, wallet, isAdmin }
- The frontend stores `token` in `localStorage` and sends it as `Authorization: Bearer <token>` when reading `/api/auth/me`.

Important: the demo stores passwords in plaintext inside `db.json` and is for local testing only.

## Modern-Login integration & responsiveness

- The Modern-Login static assets were copied into `frontend/public/Login/Modern-Login/` and a Reactified version of the markup & behavior was implemented at `frontend/src/pages/Login.jsx`.
- The CSS used by the page has been scoped under `.modern-page` and lives at `frontend/src/pages/modern-login.css` to prevent styling leakage.
- Responsive breakpoints have been added so the login page stacks and adapts for widths <= 760px and small phones.

If you'd like different breakpoints, animations, or to preserve the toggle panel on smaller screens, edit `modern-login.css` in `frontend/src/pages/`.

## Adding sample data / admin actions

- The `backend/tools/create_freefire.js` script can add a sample tournament entry (see `backend/package.json` script `add-freefire`).

```powershell
cd backend
npm run add-freefire
```

Alternatively, manually edit `backend/db.json` to add users (set `isAdmin:true` for admin accounts), tournaments, transactions, and leaderboard entries. The server will automatically use the data in `db.json`.

To create an admin user manually: add an entry to `db.json` under `users` with `isAdmin: true`, then create a session token entry under `sessions` to allow admin operations, or use the `x-admin-token` header with the server's `ADMIN_TOKEN`.

## Troubleshooting

- Backend 500 / file errors: ensure `backend/db.json` exists and is writable. The server will create a basic DB if the file is missing, but permission issues can prevent writes.
- CORS: the backend enables CORS for local development. If running frontend on a different origin, ensure requests target the correct backend URL (change `frontend/src/auth.js` URLs accordingly).
- Port conflicts: backend defaults to 4000. Set `PORT` env var to change it.

Common commands recap (PowerShell):

```powershell
# Start backend in dev mode
cd d:\Programming\HostedGames\GameHosted\backend
npm install
npm run dev

# Start frontend (Vite)
cd d:\Programming\HostedGames\GameHosted\frontend
npm install
npm run dev
```

## Contributing

- Fork, make changes, open a PR. Keep changes small and focused.
- If you change API contracts, update `backend/index.js` and the frontend `auth.js` accordingly.

## License

This demo is provided without warranty for demo/development purposes. Treat it as MIT-like for experimenting (no formal license file included). If you want a proper license added, tell me which one and I can add it (MIT recommended for demos).

---

If you'd like, I can now:
- run the frontend dev server and verify responsive behavior across multiple viewport sizes, or
- add accessibility improvements (labels, aria attributes) to the login form before testing.

Tell me which you'd prefer and I'll proceed.
>>>>>>> 6f787c3fcd12ea84aa941409157fb3d0a67fd4fa
