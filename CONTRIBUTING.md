# Contributing

Thanks for helping improve DSA Sprint. Start with a GitHub issue to describe a bug or feature idea. For code changes, make a branch, keep the change focused, and open a pull request against `main`.

## Run the app

See the [README](README.md) for the Docker setup. GitHub Actions currently builds the React app and Spring Boot API on pushes and pull requests to `main`.

## Pull request checklist

- Describe the user-visible change and how to try it.
- Keep passwords, JWT keys, database credentials, and `.env` files out of commits.
- Update the README or API notes if a route or setup step changes.
- Confirm the relevant frontend build (`npm run build`) or backend package (`mvn --batch-mode -DskipTests package`) completes.
- Do not include personal data in screenshots, sample data, or logs.
