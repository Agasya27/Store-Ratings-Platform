# Store Ratings Platform

A full-stack app for the FullStack Intern coding challenge. Users can browse registered stores and leave ratings from 1 to 5. Everyone signs in through the same login page — what you can do after that depends on your role (admin, normal user, or store owner).

I built the backend with Express and PostgreSQL (plain SQL, no ORM), and the frontend with React and Vite.

Live app: https://store-ratings-client-production.up.railway.app
API: https://store-ratings-api-production.up.railway.app/health
Swagger: https://store-ratings-api-production.up.railway.app/api/docs

## What's in here

**Admin** — dashboard with user/store/rating counts, create users and stores, filter and sort listings, view individual user profiles (including store rating for owners).

**Normal user** — sign up, search stores by name or address, submit or update a star rating.

**Store owner** — see who rated their store and the average score.

Auth is JWT-based. The API checks roles on every protected route, and the React app does the same on the client so you can't stumble into the wrong dashboard by URL alone.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **API docs:** Swagger at `/api/docs` when the server is running

## Project layout

```
Store-Ratings-Platform/
├── server/          Express API, migrations, seed script
├── client/          React app
├── README.md        (you are here)
└── EXPLANATION.md   deeper walkthrough for reviewers / interviews
```

Inside `server/src/` you'll find the usual split: `routes`, `controllers`, `models` (SQL queries), `middleware` (auth + errors), and `utils` (validators, JWT helpers). The client mirrors that with `api/`, `pages/` per role, shared `components/`, and `context/` for auth state.

## Setup

You'll need Node 18+, PostgreSQL, and two terminal windows (one for the API, one for the UI).

### Database

```bash
createdb store_ratings
cd server
cp .env.example .env
npm install
npm run migrate
npm run seed
```

Edit `server/.env` before you start the server:

- **`DATABASE_URL`** — connection string for your local Postgres. On macOS with Homebrew, the default user is often your Mac username, not `postgres`. Example: `postgresql://yourname@localhost:5432/store_ratings`
- **`JWT_SECRET`** — any long random string
- **`PORT`** — I use `5003` locally because port 5000 clashes with AirPlay on Mac. The Vite dev server proxies API calls to whatever port you set here, so keep `PORT` in `.env` aligned with `client/vite.config.js` (currently `5003`).

### Backend

```bash
cd server
npm run dev
```

Health check: `http://localhost:5003/health` should return `{"status":"ok","database":"connected"}`.

Swagger UI: `http://localhost:5003/api/docs` — handy for trying endpoints without the UI. Log in first, copy the token, click Authorize, and paste `Bearer <token>`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. The app proxies `/api` to the backend, so you don't need to configure a separate API URL in the browser.

## Test login (seeded admin)

After `npm run seed`:

| | |
|---|---|
| Email | `admin@storeratings.com` |
| Password | `Admin@12345` |

Run `npm run seed` again anytime to reset that account.

To exercise the full flow: log in as admin → create an owner user → create a store with that user's ID as `ownerId` → sign up as a normal user → rate the store → log in as the owner and check the dashboard.

## Validation (enforced on API and forms)

Names must be 20–60 characters. Addresses cap at 400 characters. Passwords are 8–16 characters with at least one uppercase letter and one special character. Email must be a valid format. Ratings are integers from 1 to 5.

## Development notes

Work landed in feature branches (`feature/db-schema`, `feature/auth`, `feature/admin-stores`, `feature/owner-frontend`, `feature/final-ui-polish`) and was merged via pull requests.

For a file-by-file explanation of how auth, roles, and the database fit together, see [EXPLANATION.md](EXPLANATION.md).

Formatting uses Prettier with the root `.prettierrc`:

```bash
cd server && npm run format
cd client && npm run format
```

## Deploying to Railway

Backend and frontend are meant to run as **two Railway services** plus a **PostgreSQL** database.
