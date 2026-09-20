
# Briefly

Briefly is a secure note-sharing application built with Next.js, TypeScript, Hono.js, PostgreSQL, and Drizzle ORM.

Users can create notes and generate share links with controlled access:

- One-time access
- Time-based access
- Public access
- Password-protected access
- Expiration
- Manual revoke
- Successful view tracking

## Live Demo

Frontend: https://briefly-nine-puce.vercel.app

Backend: https://briefly-backend-43tv.onrender.com

## Tech Stack

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- React Hook Form
- Zod
- Axios
- Lucide React
- Sonner

### Backend

- Node.js
- Hono.js
- TypeScript
- PostgreSQL
- Neon
- Drizzle ORM
- Zod
- Argon2id

### Authentication

- Server-side sessions
- HttpOnly cookies

### Deployment

- Vercel — Frontend
- Render — Backend
- Neon — PostgreSQL

---

# Setup Instructions

## Prerequisites

- Node.js
- PostgreSQL / Neon database
- npm

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Briefly
````

## 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
```

Run the backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

## 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
```

Create `.env.local`:

```env
BACKEND_URL=http://localhost:3000
```

Run the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3001
```

---

# Database Schema

The application uses four main tables:

### Users

Stores registered users.

```text
users
- id
- name
- email
- passwordHash
- createdAt
- updatedAt
```

### Sessions

Stores server-side authentication sessions.

```text
sessions
- id
- userId
- tokenHash
- expiresAt
- createdAt
- revokedAt
```

### Notes

Stores user-owned notes.

```text
notes
- id
- userId
- title
- content
- createdAt
- updatedAt
```

### Shares

Stores share-link configuration and access state.

```text
shares
- id
- noteId
- tokenHash
- shareType
- accessType
- passwordHash
- viewCount
- usedAt
- expiresAt
- createdAt
- revokedAt
```

Relationship:

```text
User
  |
  +---- Sessions
  |
  +---- Notes
          |
          +---- Shares
```

---

# Share Link Flow

1. An authenticated user creates a note.
2. The user creates a share for that note.
3. The share is configured as:

   * `one_time` or `time_based`
   * `public` or `password`
4. A cryptographically secure random share token is generated.
5. The token is hashed before being stored in the database.
6. A share URL is returned to the user.
7. For password-protected shares, a random access key is generated.
8. The access key is hashed using Argon2id and only the generated key is returned to the note owner.
9. The recipient opens the share URL.
10. The backend validates the share before returning the note.

---

# Password / Access-Key Generation

Password-protected shares receive a dynamically generated access key.

The raw access key is never stored in PostgreSQL.

The flow is:

```text
Random Access Key
       |
       v
    Argon2id
       |
       v
 passwordHash
       |
       v
   PostgreSQL
```

When the recipient provides the key, the backend verifies it against the stored Argon2id hash.

User passwords are protected using the same Argon2id hashing approach.

---

# Expiry Logic

Every share has an `expiresAt` timestamp.

A share is available only while:

```text
current time < expiresAt
```

The backend rejects expired shares.

Expired shares:

* Cannot be accessed
* Do not increase the view count

Time-based shares can be accessed repeatedly until they expire.

One-time shares can only be successfully accessed once before expiration.

---

# Invalidate / Revoke Logic

The note owner can revoke an active share.

When revoked:

```text
revokedAt = current timestamp
```

The backend checks the revoked state during share access.

A revoked share cannot be accessed even if its expiration time has not been reached.

Revoked shares do not increase the view count.

---

# View Count Logic

Only successful accesses increase the view count.

| Access                      | View Count |
| --------------------------- | ---------: |
| Successful public access    |         +1 |
| Successful password access  |         +1 |
| Wrong password/access key   |         +0 |
| Expired share               |         +0 |
| Revoked share               |         +0 |
| Already-used one-time share |         +0 |

View count updates are performed atomically with the relevant share-access operation.

---

# Race-Condition Handling

One-time shares are protected against concurrent access using an atomic database update.

The backend only consumes a one-time share when all required conditions are true:

```text
usedAt IS NULL
revokedAt IS NULL
expiresAt > current time
shareType = one_time
```

The update also increments the view count.

Conceptually:

```sql
UPDATE shares
SET
  used_at = NOW(),
  view_count = view_count + 1
WHERE
  id = ?
  AND share_type = 'one_time'
  AND used_at IS NULL
  AND revoked_at IS NULL
  AND expires_at > NOW();
```

If two users try to access the same one-time link simultaneously, only one update can succeed.

The other request receives an unavailable/used response.

Therefore:

```text
Two concurrent requests
        |
        v
   PostgreSQL
     /     \
    /       \
Success    Fails
   |          |
   v          v
Note opens   Already used
```

---

# Security

* User passwords are hashed using Argon2id.
* Protected-share access keys are hashed using Argon2id.
* Session tokens are hashed before database storage.
* Share tokens are hashed before database storage.
* Authentication uses HttpOnly session cookies.
* Production cookies use the `Secure` flag.
* Note ownership is checked server-side.
* Share ownership is checked before revocation.
* Sensitive token hashes and password hashes are not returned to clients.

---

# Handling 1 Million Users

The current application is a modular monolith suitable for the POC.

For significantly larger traffic, the backend could be horizontally scaled behind a load balancer.

Additional improvements would include:

* PostgreSQL connection pooling
* Redis for distributed rate limiting and caching where appropriate
* Database indexing and query optimization
* Read replicas for heavy read traffic
* CDN/caching where applicable
* Monitoring and centralized logging

The one-time share consumption remains database-atomic, so multiple backend instances can still safely compete for the same one-time share.

---

# Brute-Force Protection

The current POC does not implement rate limiting.

For production, password-protected share access should be rate-limited to prevent repeated access-key guessing.

A distributed deployment could use Redis to maintain rate-limit state across backend instances.

Possible controls include:

* Per-IP rate limiting
* Per-share rate limiting
* Temporary lockouts after repeated failures
* Returning HTTP `429 Too Many Requests`

Wrong access-key attempts currently do not increase the view count or consume a one-time share.

---

# API Overview

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### Notes

```text
POST   /notes
GET    /notes
GET    /notes/:id
PATCH  /notes/:id
DELETE /notes/:id
```

### Shares

```text
POST /notes/:id/shares
GET  /notes/:id/shares

GET  /share/:token
POST /share/:token/access
POST /share/:id/revoke
```

---

# Edge Cases Tested

The application handles:

* Invalid share links
* Public share access
* Password-protected share access
* Wrong access key
* Expired shares
* Already-used one-time shares
* Revoked shares
* Concurrent access to one-time shares
* Accurate view counts

---

# Production

Frontend:

[https://briefly-nine-puce.vercel.app](https://briefly-nine-puce.vercel.app)

Backend:

[https://briefly-backend-43tv.onrender.com](https://briefly-backend-43tv.onrender.com)

Backend health check:

[https://briefly-backend-43tv.onrender.com/db-health](https://briefly-backend-43tv.onrender.com/db-health)

---

# Test Credentials

Add the test account used for the demo here:

```text
Email: test101@briefly.com
Password: 12345678
```

---

# Demo

The demo covers:

* User registration/login
* Note creation
* Share generation
* Public share flow
* Password-protected share flow
* Dynamic access-key generation
* Wrong access-key handling
* One-time share behavior
* Time-based expiry
* Share revocation
* View-count updates
* Concurrent one-time access

```
```
