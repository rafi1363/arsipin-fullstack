# Security Policy

## Secret Management

Never commit real `.env` files, database URLs, JWT secrets, API keys, private keys, or production credentials.

Use the example files instead:

- `backend/.env.example`
- `frontend/.env.example`

For production, store secrets in the deployment provider:

- Vercel environment variables for the frontend project `arsipin-fullstack`.
- Vercel environment variables for the backend project `arsipin-backend`.
- Neon dashboard for database credentials.
- GitHub environment secrets for deployment automation.

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

## Current Repo Security Snapshot

As of `2026-05-16`, the repo already includes:

- CI checks for backend and frontend
- `CodeQL Analyze`
- `Gitleaks` secret scanning
- `Trivy` dependency and filesystem scanning
- Dependabot updates

Important limitations that still remain:

- `VERCEL_TOKEN` must still be created manually and stored in GitHub environments
- staging and production currently may share the same Neon database unless a separate staging database is created
- automated tests for security-sensitive flows are not implemented yet
- file upload and object storage security are not implemented yet

## Frontend Auth Note

Frontend currently has an early token helper that uses browser `localStorage` as a practical starting point for the upcoming login flow.

Keep in mind:

- this is acceptable for an early learning-stage MVP, but it is not the strongest option for long-term auth hardening
- if the app later handles more sensitive use cases, the auth storage approach should be reviewed again
- do not treat the presence of a token helper as a completed auth security design
