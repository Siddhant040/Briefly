# Briefly

**Product Requirements Document**
**Version:** 1.0
**Status:** MVP / POC

## 1. Product Summary

**Briefly** is a lightweight platform for creating and sharing notes through secure, controlled-access links.

The product is designed for situations where someone needs to share information temporarily without requiring the recipient to create an account. The owner controls how long the information remains accessible and whether additional verification is required.

## 2. Problem

Traditional note-sharing often provides a permanent URL or requires the recipient to have an account. This creates unnecessary exposure when information is intended for a limited audience or a limited period.

Briefly addresses this by allowing the creator to control **who can access a note and for how long**.

## 3. Product Goals

Briefly should provide:

* Fast note creation.
* Simple link-based sharing.
* Controlled access without recipient registration.
* Temporary or one-time information sharing.
* Password protection for sensitive notes.
* The ability to revoke access at any time.
* Clear feedback when shared content is no longer available.

## 4. Target Users

### Note Creator

An authenticated user who wants to create and share information.

They should be able to:

1. Create a note.
2. Configure its sharing behavior.
3. Generate a share link.
4. Share the link with another person.
5. Revoke the link when required.
6. See how many successful accesses occurred.

### Recipient

A person who receives a Briefly link.

The recipient should not need an account.

Depending on the link configuration, they can:

* Open the note directly.
* Provide an access key.
* Access the note once.
* Access the note until its expiry.

## 5. Core User Experience

### Create

```text
Login
  ↓
Create Note
  ↓
Title + Content
  ↓
Configure Sharing
  ↓
Generate Link
```

### Share

The creator receives:

```text
Share URL
+
Access Key (when required)
```

The creator can then send these to the recipient.

### Access

```text
Recipient opens link
        ↓
Briefly validates access
        ↓
Valid?
 ┌──────┴──────┐
No             Yes
 ↓              ↓
Explain why   Show note
```

The recipient should receive a clear message for invalid, expired, revoked, or already-consumed links.

## 6. Access Model

Each share has two independent controls.

### Duration

**One-time**

The note can be successfully accessed once.

**Time-based**

The note remains accessible until its configured expiry time.

### Protection

**Public**

The link itself is sufficient for access.

**Protected**

The recipient must provide the generated access key.

This creates four supported sharing combinations:

| Duration   | Protection |
| ---------- | ---------- |
| One-time   | Public     |
| One-time   | Protected  |
| Time-based | Public     |
| Time-based | Protected  |

## 7. Security Principles

Security is part of the product experience, not an implementation afterthought.

Briefly should ensure that:

* Share URLs are difficult to guess.
* Authentication credentials are securely handled.
* Access keys are never stored in plaintext.
* Revoked links cannot be reused.
* Expired links cannot be accessed.
* Incorrect access keys do not consume a one-time link.
* A one-time link can only be successfully consumed once, even under concurrent requests.
* Successful access is recorded accurately.

## 8. MVP Scope

### Included

* User authentication
* Note creation
* Note ownership
* Configurable sharing
* Secure share links
* Public access
* Protected access
* One-time access
* Time-based expiry
* Link revocation
* Successful access tracking

### Not Included

* File uploads
* Rich-text editing
* Real-time collaboration
* Comments
* Notifications
* Social/OAuth login
* Complex analytics
* Mobile application

## 9. Success Criteria

The MVP is successful when a user can complete the entire lifecycle:

```text
Create account
     ↓
Create note
     ↓
Configure sharing
     ↓
Generate secure link
     ↓
Share with recipient
     ↓
Recipient accesses note
     ↓
Access rules are enforced
     ↓
Successful access is recorded
     ↓
Creator can revoke access
```

The system must remain correct when multiple recipients attempt to access the same one-time link concurrently.

## 10. Product Direction

Briefly should remain intentionally **simple, secure, and focused**.

The product's value is not in providing a sophisticated note editor. Its core value is providing **controlled, temporary sharing of information through a simple link**.
