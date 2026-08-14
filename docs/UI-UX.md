# UI/UX Production Notes

PowerChain Launchpad uses a mobile-first, light-first interface with strong hierarchy and minimal visual effects. Transaction safety information is always more prominent than decorative content.

## Current improvements

- Route-aware desktop/mobile navigation
- Accessible wallet modal with focus containment and focus restoration
- Connected-wallet popover with outside-click/Escape handling
- Copy-address status feedback
- Empty wallet-provider state
- Typed network, wallet, sale, eligibility, and transaction statuses
- Countdown timers with invalid-date and completion handling
- Reduced-motion support for animated counters
- Mainnet/deployment readiness shown before transaction actions
- Exact fee and recipient review before signing
- Responsive transaction, claim, analytics, and creator surfaces

## Interaction requirements

Buttons that trigger wallet or server mutations must expose loading/disabled state and must not depend on optimistic settlement. A Solana signature is not presented as settled until backend verification reaches the canonical settlement stage.

## Accessibility

Interactive controls use native buttons/links, visible focus styles, dialog labeling, keyboard dismissal, and semantic status/timer roles. Color is supplementary to text labels rather than the only status signal.

## Checkout

Checkout uses a light theme by default: white surfaces, light-gray framing, black text, dark-green icons/buttons, and white framed secondary actions. The layout collapses from three columns to a single mobile-first flow. Wallet is the production purchase method; Card and Onramp are provider-handoff surfaces and never collect raw card secrets directly.
