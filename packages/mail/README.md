# @powerchain/mail

Reusable React email templates for PowerChain Launchpad.

The package owns presentation and deterministic HTML/text rendering. Delivery
credentials remain backend-only.

Exports:

- `EmailTemplate`
- `ContactEmailTemplate`
- `AuthEmailTemplate`
- `renderContactEmail`
- `renderAuthEmail`

The backend currently supports Resend-compatible HTTPS delivery through its
mail service without exposing provider credentials to frontend or mobile code.
