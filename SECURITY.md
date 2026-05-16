# Security Policy

## Secret Management

Never commit real `.env` files, database URLs, JWT secrets, API keys, private keys, or production credentials.

Use the example files instead:

- `backend/.env.example`
- `frontend/.env.example`

For production, store secrets in the deployment provider:

- Vercel environment variables for the frontend.
- Render, Railway, Fly.io, or similar provider environment variables for the backend.
- Neon dashboard for database credentials.

## Baseline Security Checklist

- Hash passwords with `bcrypt` before storing them.
- Use a strong `JWT_SECRET`, generated with a command such as `openssl rand -base64 32`.
- Validate and sanitize all request bodies before writing to the database.
- Do not return password hashes from API responses.
- Restrict CORS to the real frontend domain in production.
- Use HTTPS for all deployed frontend and backend traffic.
- Keep dependency updates visible with Dependabot.
- Review GitHub secret scanning alerts if GitHub reports one.
- Remember that `.gitignore` is not a security boundary; ignored files stay local, but they are not protected if the machine or workspace is compromised.
- Review local helper scripts before running them, and never store real secrets inside convenience scripts.

## Reporting

This is currently a learning project. If a vulnerability is found, rotate any affected secrets immediately and patch the code before redeploying.
