# Public launch checklist

The GitHub source is public, but the application is not hosted on the public internet yet. Running it on your computer at `localhost` only makes it available to you.

## Before inviting public users

- Deploy the React frontend, Spring API, and PostgreSQL database to hosting services you control.
- Set a long random `JWT_SECRET` and unique database credentials in the hosting provider's secret manager. Never upload `.env`.
- Set `APP_CORS_ALLOWED_ORIGIN` to the exact HTTPS frontend origin and set `VITE_API_BASE_URL` to the deployed API URL.
- Replace `spring.jpa.hibernate.ddl-auto=update` with Flyway or Liquibase schema migrations.
- Add rate limits for login and registration, account verification and password recovery, and a plan for abusive accounts.
- Review JWT storage and expiry, HTTPS behavior, database backups, account deletion, and privacy disclosures.
- Add automated API and UI checks, then make CI run them before deployment.
- Decide what user data is collected, how long it is kept, and how users can export or delete it.

## Current limits

- No hosted frontend, API, or database is configured by this repository.
- The local Docker Compose credentials are for development only.
- The starter has build workflows but not automated tests or a deployment workflow.
- Accounts do not yet have email verification or password reset.
- JWTs are stored by the browser app in local storage; review this design before storing sensitive data.

Treat a deployed copy as a demo until the checklist is addressed. Never use production credentials in local files or commits.
