
# Briefly

A simple secure note-sharing app built with Next.js, TypeScript, Hono.js, PostgreSQL, and Drizzle ORM.

## Features

- Create and manage notes
- One-time and time-based share links
- Public and password-protected sharing
- Secure share tokens
- Dynamic access keys for protected shares
- Share expiry and manual revoke
- View count tracking
- Atomic one-time share consumption

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Hono.js
- PostgreSQL
- Drizzle ORM
- Neon
- Argon2id
- Server-side sessions

## Setup

### Backend

```bash
cd Backend
npm install
````

Create `.env`:

```env
DATABASE_URL=your_neon_database_url
```

Run:

```bash
npm run dev
```

Backend runs on `http://localhost:3000`.

### Frontend

```bash
cd Frontend
npm install
```

Create `.env.local`:

```env
BACKEND_URL=http://localhost:3000
```

Run:

```bash
npm run dev
```

Frontend runs on `http://localhost:3001`.

## Database Schema

Main tables:

* `users` — user accounts
* `sessions` — server-side authentication sessions
* `notes` — user-owned notes
* `shares` — share links, access type, expiry, usage and view count

A share belongs to a note, and a note belongs to a user.

## Share Flow

1. User creates a note.
2. User creates a share with:

   * One-time or time-based access
   * Public or password-protected access
3. A secure random token is generated.
4. For protected shares, a dynamic access key is generated and hashed.
5. The share link can then be opened by anyone with the link.
6. Protected shares require the correct access key.
7. Expired or revoked shares cannot be accessed.

## Security

* Passwords and access keys are hashed using Argon2id.
* Session tokens and share tokens are hashed before database storage.
* Authentication uses HttpOnly session cookies.
* Note/share ownership is checked server-side.
* Sensitive token/password hashes are never returned to clients.

## One-Time Share & Race Condition

One-time shares are consumed using an atomic database update.

The update succeeds only when the share:

* Has not already been used
* Has not expired
* Has not been revoked

Therefore, if multiple users access the same link simultaneously, only one request can consume it successfully.

## View Count

View count is updated atomically in the database.

* Public successful access → `+1`
* Correct password → `+1`
* Wrong password → `+0`
* Expired/revoked/used share → `+0`

## Scaling

For large traffic, the API can be horizontally scaled behind a load balancer, with PostgreSQL connection pooling and Redis for distributed rate limiting/caching where needed.

## Brute-Force Protection

The current POC does not implement rate limiting. For production, password-protected share access should use rate limiting, preferably with Redis when running multiple backend instances.

## Live Demo

Frontend: https://briefly-nine-puce.vercel.app

Backend: https://briefly-backend-43tv.onrender.com

## Test Credentials

Email: `test101@briefly.com`

Password: `12345678`


