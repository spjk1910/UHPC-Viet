# Admin product management

The admin page is available at `/admin`. Sign in with the credentials configured in
`ADMIN_USERNAME` and `ADMIN_PASSWORD`; the backend refuses to start if either value is
missing. Set these values in the environment or your untracked `.env` file, and do not
commit real credentials.

The backend stores the administrator as an in-memory account with a BCrypt-encoded
password. Admin authentication uses a server-side session cookie and CSRF tokens.
Product catalogue reads remain public, while creating, updating, deleting, uploading
product images, and reading the admin product list require an admin session.

For a production HTTPS deployment, set `SESSION_COOKIE_SECURE=true` and terminate TLS
at the public reverse proxy. Keep it `false` only for local HTTP development.
