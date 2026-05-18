# Security Spec

## Data Invariants
- A user can only access their own profile and crops.
- A crop cannot exist without being associated with a user.
- Health scores must be between 0 and 100.
- Timestamps for creation/update must be server-controlled if present.

## The Dirty Dozen Payloads (Deny Cases)
1. Write to another user's profile.
2. Read another user's crops.
3. Create a crop with health > 100.
4. Update a crop and change its owner (implicit via path, but any UID fields should match).
5. Delete another user's crop.
6. Create a crop with a 1MB string in the diagnosis.
7. Update health score to "very high" (wrong type).
8. Create a user profile with `isAdmin: true` (if we had such a field, we'd block it).
9. Spoofing user email in the payload.
10. Large metadata objects.
11. Bypassing path variables.
12. List queries without user filtering.

## Test Runner (firestore.rules.test.ts)
I will implement this later if needed for full verification, but I'll focus on the rules logic first.
