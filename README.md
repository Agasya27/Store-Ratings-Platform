```markdown
# Store Rating Platform

A full-stack web application where users can discover stores and submit ratings
(1–5) for them. Built for the FullStack Intern coding challenge.

## Tech Stack

| Layer     | Technology                     |
|-----------|---------------------------------|
| Frontend  | React (Vite)                    |
| Backend   | Node.js + Express               |
| Database  | PostgreSQL                      |
| Auth      | JWT (JSON Web Tokens) + bcrypt  |

## User Roles

- **System Administrator** — manages users and stores, views platform-wide stats.
- **Normal User** — signs up, browses/searches stores, submits or edits ratings.
- **Store Owner** — views who rated their store and their average rating.

## Project Structure

```
store-rating-app/
├── server/                 # Express + PostgreSQL API
│   ├── migrations/
│   │   ├── schema.sql      # Database schema (users, stores, ratings)
│   │   └── run.js          # Migration runner (npm run migrate)
│   ├── src/
│   │   ├── config/db.js    # PostgreSQL connection pool
│   │   ├── models/         # Plain SQL data-access functions
│   │   ├── middleware/     # auth (JWT) + role guards
│   │   ├── controllers/    # request handlers / business logic
│   │   ├── routes/         # Express routers, grouped by resource
│   │   ├── utils/          # validators, token helpers
│   │   ├── app.js          # Express app (middleware + routes)
│   │   └── server.js       # entry point
│   ├── .env.example
│   └── package.json
│
└── client/                 # React frontend
    ├── src/
    │   ├── api/             # axios instance + API calls
    │   ├── context/         # AuthContext (current user, token)
    │   ├── components/      # shared UI (tables, forms, navbar)
    │   ├── pages/           # route-level pages per role
    │   └── utils/           # form validators
    └── package.json
```

## Getting Started

### 1. Database
\`\`\`bash
createdb store_ratings
psql -d store_ratings -f server/migrations/schema.sql
# or: cd server && npm run migrate
\`\`\`

### 2. Backend
\`\`\`bash
cd server
cp .env.example .env   # fill in your DB credentials + JWT secret
npm install
npm run dev             # http://localhost:5000
\`\`\`

### 3. Frontend
\`\`\`bash
cd client
npm install
npm run dev              # http://localhost:5173
\`\`\`

## Validation Rules

| Field    | Rule                                                            |
|----------|------------------------------------------------------------------|
| Name     | 20–60 characters                                                  |
| Address  | Max 400 characters                                                |
| Password | 8–16 characters, at least one uppercase letter and one special char |
| Email    | Standard email format                                             |

## Core Features

- Single login for all roles, with role-based access on both API and UI.
- Admin dashboard: total users, total stores, total ratings.
- Admin can add users/stores, list + filter (name/email/address/role) + sort.
- Normal users can sign up, search stores, submit/update a 1–5 rating.
- Store owners can see their raters and average rating.
- Sortable tables (ascending/descending) on all listings.

## Development Workflow

This repo follows a simple branch-per-phase workflow: each feature is built on
its own branch and merged into `main` via a pull request once complete. See
`EXPLANATION.md` for a breakdown of every file, function, and the reasoning
behind key decisions.
```