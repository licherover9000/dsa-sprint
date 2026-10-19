# Study roadmap

You do not need to understand every file before starting. Learn one complete request at a time: a person clicks a button, the browser sends a request, the API checks it, the database stores it, and the browser displays the reply.

## First session: run and explore

Follow the [README setup](../README.md#run-it-on-your-computer). Create an account and log one practice problem. Then open browser developer tools (**F12 → Network**) and inspect the requests to `/api/auth/login`, `/api/submissions`, `/api/submissions/streak`, and `/api/submissions/heatmap`.

## How one login travels through the code

1. `frontend/src/features/auth/AuthScreen.jsx` collects the username and password.
2. `frontend/src/features/auth/authSlice.js` sends the login request and stores the returned session in Redux.
3. `frontend/src/app/api.js` adds the JWT to later requests.
4. `backend/src/main/java/com/dsasprint/controller/AuthController.java` receives the request.
5. `backend/src/main/java/com/dsasprint/service/AuthService.java` checks the password hash and creates a token.
6. `backend/src/main/java/com/dsasprint/repository/UserRepository.java` reads the user through JPA from PostgreSQL.

Try following the same path for logging a problem: `ProblemForm` → `dashboardSlice.js` → `api.js` → `SubmissionController` → `SubmissionService` → `SubmissionRepository` → `Submission` entity.

## Learn in this order

### 1. Web basics

Learn what a URL, HTTP method, request body, response status, JSON, and header are. In the Network tab, open a submission request and identify its URL, `POST` method, JSON body, `Authorization` header, and response.

### 2. Java and Spring layers

Read `SubmissionController`, then `SubmissionService`, then `SubmissionRepository`, then `Submission`. The controller handles HTTP, the service owns decisions, the repository queries the database, and the entity maps to a table.

**Exercise:** Add a `topic` field to a submission, pass it through the request and response records, persist it, and show it on each problem row. Follow one field end to end.

### 3. PostgreSQL and JPA

Learn tables, primary keys, foreign keys, unique constraints, indexes, and SQL `SELECT`/`GROUP BY`. The `Submission` table points to `app_users`; inspect `SubmissionRepository` to see how the app scopes data by user.

**Exercise:** Write down the SQL shape behind the heatmap query. Then add a filter for one platform. Learn Flyway migrations before changing a deployed database; `ddl-auto=update` is only a starter convenience.

### 4. React and forms

Read `ProblemForm`, `ProblemRow`, and `Dashboard`. Learn props, component state, event handlers, lists, conditional rendering, and controlled form fields.

**Exercise:** Add a tag selector or a “favorite” toggle and display the saved value. Follow it from form state into the JSON request and back into the list.

### 5. Redux and API state

Read `frontend/src/app/store.js` and `dashboardSlice.js`. Learn reducers, async thunks, pending/success/error states, selectors, and why API data is stored centrally.

**Exercise:** Add a platform filter in the dashboard. First implement it locally from loaded submissions; later decide whether the API should accept a filter parameter.

### 6. Authentication and security

Read `JwtAuthenticationFilter`, `JwtService`, `SecurityConfig`, and `AuthService`. Learn password hashing, stateless sessions, token expiry, CORS, input validation, and ownership checks.

**Exercise:** Trace a request without a token and one with an expired token. Explain why a request body must never be allowed to choose its own `userId`.

### 7. Containers and CI

Read both Dockerfiles and `docker-compose.yml`. Learn images, containers, ports, environment variables, volumes, and service health checks. Then inspect `.github/workflows/ci.yml` and follow its two build jobs.

**Exercise:** Change a frontend label, rebuild, and see the changed page. Then break a build on a temporary branch and observe how GitHub Actions reports it.

## Feature ladder

Build these one at a time so each new concept has a purpose:

1. Edit and delete a problem, with ownership checks in the API.
2. Search and filter by platform, difficulty, category, and date.
3. Add pagination so the API need not return every row.
4. Add topics and tags, then show topic-level progress.
5. Export a user's own data as CSV or JSON.
6. Add Flyway migrations and account deletion.
7. Add real reminders only after choosing an email or notification service.
8. Add automated API and UI checks, then require them in CI before deployment.

For every feature, write down the user story, API request/response, database change, and UI state before coding. Implement one layer at a time, then follow the request across the whole app.

## Run without Docker

This route is for learning the individual services. You need Node.js, Java 17, Maven, and PostgreSQL. First run `.\scripts\setup.ps1` from the project root to create the ignored `.env`, then start PostgreSQL with `docker compose up -d db`.

Open a PowerShell window at the repo root and load the generated values into that window:

```powershell
. .\scripts\load-env.ps1
Set-Location backend
mvn spring-boot:run
```

In a second PowerShell window:

```powershell
Set-Location "C:\web projects\full stack\frontend"
npm ci
npm run dev
```

Open `http://localhost:5173`. The frontend points to the local API at `http://localhost:8080/api` by default.
