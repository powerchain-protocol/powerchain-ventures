# Mail

Reusable email presentation lives in:

```text
packages/mail/
```

The backend owns delivery configuration.

Current environment:

```text
MAIL_PROVIDER=disabled|resend
MAIL_FROM=PowerChain Launchpad <no-reply@powerchain.energy>
MAIL_CONTACT_TO=support@powerchain.energy
RESEND_API_KEY=
```

`RESEND_API_KEY` must remain server-only.

Templates include:

- contact request
- email confirmation
- password reset
- security notice

The contact API is:

```text
GET  /api/v1/contact
POST /api/v1/contact
GET  /api/v1/mail/status
```
