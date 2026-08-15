# API Compatibility Policy

PowerChain Launchpad v1 public endpoints follow additive compatibility rules.

Allowed without a new major API/schema version:
- adding optional response fields
- adding new endpoints
- adding non-breaking diagnostic headers

Requires a new API/schema version:
- removing or renaming documented fields
- changing field types
- changing numeric units or amount representation
- changing the meaning of deployment status
- changing settlement semantics
- making formerly optional fields required for existing clients

Dynamic sale and settlement APIs remain server-authoritative and are not replaced by public-data snapshots.
