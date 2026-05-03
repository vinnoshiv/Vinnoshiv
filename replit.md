# Vinnoshiv — MERN Web Application

## Overview
Full-stack MERN (MongoDB, Express, React, Node.js) web app for the Vinnoshiv brand.
Frontend and backend run on the **same port** — Express serves the React build.

## Project Structure
```
/
├── backend/
│   ├── controllers/authController.js   # Admin login & verify logic
│   ├── middleware/auth.js              # JWT protection middleware
│   ├── routes/auth.js                 # /api/auth routes
│   └── db.js                          # MongoDB connection
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.js                     # Router & PrivateRoute
│       ├── index.js
│       ├── pages/
│       │   ├── Home.jsx               # Landing page
│       │   ├── AutomationTools.jsx    # /tools/automation
│       │   ├── AdminLogin.jsx         # /admin/login
│       │   └── AdminPanel.jsx         # /admin (protected)
│       └── styles/                    # Pure CSS — no frameworks
├── index.js                           # Express entry point (serves API + React build)
└── package.json                       # Root package (backend deps + scripts)
```

## Pages
- `/`                  — Home / landing page
- `/tools/automation`  — Automation tools store (supports `?ref=<key>` param)
- `/admin/login`       — Admin login (credentials from env secrets)
- `/admin`             — Protected admin dashboard

## Environment Variables / Secrets
- `PORT`           — Server port (default 3000), set as shared env var
- `MONGO_URI`      — MongoDB connection string, set as shared env var
- `JWT_SECRET`     — Secret for signing JWTs (Replit Secret)
- `ADMIN_USERNAME` — Admin login username (Replit Secret)
- `ADMIN_PASSWORD` — Admin login password (Replit Secret)

## Running the App

### Development (workflow)
The workflow runs: `npm install && cd frontend && npm install && npm run build && cd .. && node index.js`

### First-time build
```bash
npm install
cd frontend && npm install && npm run build && cd ..
node index.js
```

## Tech Stack
- **Backend**: Node.js, Express, Mongoose, JWT (jsonwebtoken)
- **Frontend**: React 18, React Router v6, plain CSS (no frameworks)
- **Icons**: FontAwesome 6 (CDN)
- **Fonts**: Google Fonts — Inter

## Key Notes
- Admin credentials are checked against `ADMIN_USERNAME` / `ADMIN_PASSWORD` env secrets only (not MongoDB)
- No third-party UI frameworks — all styling is custom CSS
- React Router catch-all handled by Express `*` route sending `index.html`
