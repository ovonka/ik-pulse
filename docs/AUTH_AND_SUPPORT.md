# Authentication and Support Sessions

## Authentication

IK Pulse uses token-based authentication.

The login flow works as follows:

1. The user submits email and password.
2. The backend verifies the user record.
3. The password is compared against the stored password hash.
4. A JWT access token is created for successful authentication.
5. The frontend stores authenticated state and uses the token for protected requests.

## Why JWT?

JWT was chosen because it supports stateless API authentication and is simple to apply in a frontend/backend separated architecture.

This is appropriate for the project scope, while still reflecting a realistic production pattern.

## Authorization

Authentication answers:
**Who are you?**

Authorization answers:
**What are you allowed to do?**

IK Pulse uses role-based access control with roles such as:

- merchant
- admin
- support
- qa

## Support Sessions

Support sessions model a controlled internal troubleshooting workflow.

### Merchant flow
A merchant can:
- create a support code
- view an active support session
- revoke a support session

### Internal user flow
An internal user can:
- consume a support code
- load merchant debug context
- resolve the support session

## Why this matters

This approach provides a more controlled alternative to unrestricted internal impersonation.

It gives:
- better traceability
- clearer session lifecycle
- more visible access boundaries

## Persistence

Support sessions are stored server-side.

That means the session can remain active even if the internal user logs out and logs back in, until it is explicitly resolved or revoked.