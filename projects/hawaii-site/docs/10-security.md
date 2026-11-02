# 10 — Security: current risks and future design

## Current status — not production-ready

The public page omits edit controls, but the backend currently accepts unauthenticated write requests. The admin HTML is not protected just because it is a separate file. **Do not publish the application to the open internet in this state.**

## Authentication vs. authorization

- **Authentication:** establish who is making the request (for example, an administrator signing in).
- **Authorization:** decide whether that identity may perform an action.

Both matter. A server must check authorization on POST, PUT, DELETE, and upload endpoints, regardless of what buttons the browser displays.

## Other defenses to plan

- Secure password storage (a password hash, never plaintext); sessions or carefully designed token authentication.
- HTTPS before exposing login credentials over a network you do not fully trust.
- CSRF protection for cookie-authenticated state-changing requests.
- Input validation, upload size limits, allowed file types, safe file names, and content checks.
- Least-privilege database credentials; secrets kept outside Git; safe error messages.
- Logging, backups, restore tests, dependency updates, and a separate sample-data demo.

## Security testing ideas

Once authentication is implemented, verify that an anonymous request to each write endpoint fails with an appropriate status code. Also verify that authorized users can still create, edit, and delete. Test uploads independently: protecting memory writes but leaving `/api/upload` open is insufficient.

## Check yourself

1. Why doesn't removing a Delete button protect the database?
2. What's the difference between authentication and authorization?
3. Why must upload endpoints receive the same attention as database writes?
