# Audit Retention

Runtime audit records contain operational metadata such as event type, request ID, route, status, and safe structured metadata.

They must not contain:

- wallet private keys
- seed phrases
- provider API secrets
- authorization headers
- session cookies
- raw card data
- signing material

The supplied cleanup function retains runtime audit events for 90 days by default. Adjust retention according to operational/legal requirements before deployment.
