# Frontend Architecture

Frontend code is organized by responsibility.

```text
actions/       user-intent orchestration
components/    UI and product components
context/       application state shared across routes
hooks/         reusable React behavior
services/      typed API/data access
types/         frontend contracts
lib/           low-level helpers/runtime configuration
```

UI primitives live in `components/ui` and should be reused instead of creating
route-specific button/card/tab implementations.

Current primitives:

- `button.tsx`
- `card.tsx`
- `tabs.tsx`
- `form-field.tsx`

Checkout state is scoped through `CheckoutProvider`. Authentication API traffic
is centralized in `services/auth-service.ts`.

Mail rendering is owned by `@powerchain/mail`; provider credentials and
delivery remain backend-only.
