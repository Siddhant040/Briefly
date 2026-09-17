# Briefly — Technical Requirements Document

**Version:** 0.1
**Status:** Initial Design
**Last Updated:** 16 September 2026

---

## 1. Technical Objective

Build a secure note-sharing application that supports authenticated note creation and controlled sharing through public or password-protected links with one-time or time-based access.

The implementation should prioritize:

* Security
* Correctness
* Simple architecture
* Maintainability
* Concurrency safety
* Clear separation of responsibilities

---

## 2. Technology Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Hono.js
* TypeScript
* Zod for request validation

### Database

* PostgreSQL
* Drizzle ORM

### Authentication

* Server-side sessions
* HTTP-only cookies
* Secure random session tokens
* Hashed session tokens stored in the database

### Password Security

* Argon2id for password hashing

---

## 3. Initial Architecture

```text
                    ┌─────────────────┐
                    │    Next.js      │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                          HTTP/API
                             │
                             ▼
                    ┌─────────────────┐
                    │    Hono.js      │
                    │     Backend     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
           Auth           Notes          Shares
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

The application will initially use a **modular monolithic architecture**. Distributed infrastructure will not be introduced unless a concrete requirement justifies it.

---

## 4. Backend Modules

Initial modules:

```text
src/
├── config/
├── db/
├── middleware/
├── lib/
│
├── modules/
│   ├── auth/
│   ├── notes/
│   └── shares/
│
└── index.ts
```

### Auth

Responsible for:

* Registration
* Login
* Logout
* Session validation
* Current-user retrieval

### Notes

Responsible for:

* Note creation
* Note retrieval
* Note ownership

### Shares

Responsible for:

* Share creation
* Share-token generation
* Access validation
* Password verification
* Expiry
* One-time consumption
* Revocation
* View counting

---

## 5. Initial Data Model

### User

```text
users
├── id
├── email
├── password_hash
├── created_at
└── updated_at
```

### Session

```text
sessions
├── id
├── user_id
├── token_hash
├── expires_at
├── created_at
└── revoked_at
```

### Note

```text
notes
├── id
├── user_id
├── title
├── content
├── created_at
└── updated_at
```

### Share

```text
shares
├── id
├── note_id
├── token_hash
├── share_type
├── access_type
├── password_hash
├── expires_at
├── used_at
├── revoked_at
├── view_count
└── created_at
```

The exact column types, constraints, indexes, and relationships will be finalized during database design.

---

## 6. Authentication Design

Briefly will use server-side sessions instead of access/refresh JWT authentication.

### Login flow

```text
Credentials
     ↓
Validate input
     ↓
Find user
     ↓
Verify password
     ↓
Generate secure random session token
     ↓
Hash token
     ↓
Store session
     ↓
Set HTTP-only cookie
```

### Authenticated request

```text
Cookie
  ↓
Session token
  ↓
Hash token
  ↓
Find session
  ↓
Validate expiry/revocation
  ↓
Resolve user
  ↓
Request continues
```

### Security requirements

* Passwords must never be stored in plaintext.
* Session tokens must be cryptographically random.
* Raw session tokens should not be stored in PostgreSQL.
* Authentication cookies should use appropriate `HttpOnly`, `Secure`, and `SameSite` settings.
* Sessions must support expiration and revocation.

---

## 7. Share Token Design

A share URL will use a cryptographically secure random token.

Conceptually:

```text
Random token
     ↓
Hash
     ↓
Store hash
```

The raw token is used only to construct the share URL.

Example:

```text
/share/<secure-random-token>
```

The token must not be derived from:

* Note ID
* User ID
* Sequential numbers
* Predictable timestamps

---

## 8. Share Access Model

### Share Type

```text
ONE_TIME
TIME_BASED
```

### Access Type

```text
PUBLIC
PASSWORD_PROTECTED
```

Both dimensions are independent.

```text
                 Share
                   │
          ┌────────┴────────┐
          │                 │
       Duration          Protection
          │                 │
     ┌────┴────┐       ┌────┴────┐
     │         │       │         │
 One-time   Time-based Public  Protected
```

---

## 9. Access Validation

A share must pass all applicable checks before successful access.

```text
Token exists?
     ↓
Not revoked?
     ↓
Not expired?
     ↓
Password required?
     ↓
Password valid?
     ↓
One-time available?
     ↓
Successful access
```

Failed validation must not increment the view count.

---

## 10. One-Time Share Concurrency

One-time shares must be consumed atomically.

The implementation must not rely on:

```text
SELECT
  ↓
check used_at
  ↓
UPDATE
```

because concurrent requests could both observe an unused share.

Instead, the database will perform an atomic conditional update so that only one request can transition the share from:

```text
used_at = NULL
```

to:

```text
used_at = timestamp
```

The exact transaction/query implementation will be finalized during the share module implementation.

---

## 11. View Count

Successful access will increment the share's `view_count`.

The increment must be performed atomically at the database level:

```text
view_count = view_count + 1
```

The application must not use a read-modify-write approach for the counter.

---

## 12. Authorization

Authentication and authorization are separate concerns.

Authenticated users may only manage resources they own.

For example:

```text
Authenticated User
        ↓
Share
        ↓
Share → Note
        ↓
Note.user_id == authenticated_user.id
        ↓
Allow
```

A user must not be able to revoke or modify another user's share by manipulating request parameters.

---

## 13. Initial API Contract

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### Notes

```text
POST /notes
GET  /notes/:id
```

### Shares

```text
POST /notes/:id/shares
POST /shares/:id/revoke
```

### Public Sharing

```text
GET  /share/:token
POST /share/:token/access
```

Request and response schemas will be defined before implementing each module.

---

## 14. Validation & Error Handling

All externally supplied input will be validated on the server.

Initial validation areas:

* Email
* Password
* Note title
* Note content
* Share type
* Access type
* Expiry
* Access key

Errors should return consistent HTTP status codes and structured responses without exposing sensitive implementation details.

---

## 15. Rate Limiting

Password-protected share access should be protected against brute-force attempts.

Initial design:

```text
Share token + client identifier
          ↓
Rate limiter
          ↓
Password verification
```

The exact rate-limiting mechanism will be selected based on the final deployment architecture.

---

## 16. Testing Strategy

Testing will focus on business flows and security-critical behavior.

### Authentication

* Registration
* Duplicate email
* Invalid credentials
* Session persistence
* Logout
* Expired session

### Notes

* Create note
* Retrieve owned note
* Unauthorized note access

### Shares

* Public access
* Protected access
* Wrong key
* Expired share
* Revoked share
* Invalid token
* One-time share
* Reuse of one-time share
* Concurrent one-time requests
* View-count accuracy

---

## 17. Deployment

Initial deployment architecture will remain simple.

```text
Frontend
   ↓
Backend
   ↓
PostgreSQL
```

Dockerization and production deployment details will be documented once the application is functional.

---

## 18. Future Scaling Considerations

The initial implementation will use PostgreSQL directly.

If traffic increases significantly, potential improvements include:

* Horizontal API scaling
* Connection pooling
* Redis for rate limiting/caching where appropriate
* CDN/caching for suitable read workloads
* Database read replicas
* Asynchronous analytics/event processing

One-time share consumption must continue to use a strongly consistent mechanism even after scaling.

---

# 19. Development Status

| Area                   | Status         |
| ---------------------- | -------------- |
| Product definition     | 🟢 Complete    |
| Technical architecture | 🟡 Initial     |
| Database schema        | 🟡 To finalize |
| Authentication         | ⚪ Not started  |
| Notes module           | ⚪ Not started  |
| Share module           | ⚪ Not started  |
| Concurrency handling   | ⚪ Not started  |
| Testing                | ⚪ Not started  |
| Frontend               | ⚪ Not started  |
| Deployment             | ⚪ Not started  |
| README                 | ⚪ Not started  |

---

# 20. Change Log

### v0.1 — Initial Design

* Selected Hono.js + TypeScript + PostgreSQL + Drizzle.
* Selected server-side sessions instead of JWT authentication.
* Defined initial modules and data models.
* Defined secure share-token strategy.
* Defined one-time access concurrency requirement.
* Defined atomic view-count requirement.
* Established modular-monolith architecture.
* Established initial API boundaries.
