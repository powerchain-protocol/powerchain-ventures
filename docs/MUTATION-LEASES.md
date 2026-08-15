# Mutation Leases

Long-running or crash-prone mutations now use a short renewable lease.

Defaults:

- lease: 30 seconds
- heartbeat: 10 seconds
- maximum recovery attempts: 3

Only the current lease owner may heartbeat, complete, or fail a lease.

If an instance crashes, another instance may take over after lease expiry instead of leaving the mutation permanently stuck.
