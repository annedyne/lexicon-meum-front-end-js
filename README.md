## LexiconMeum Frontend

A vanilla JavaScript frontend for querying Latin word prefixes.

---

### Getting Started

#### Prerequisites

- Node.js (v18+ recommended)
- A running backend (see `../backend/README.md`)

#### Running Locally

1. Clone the repo
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Ensure the backend is running at the URL configured in `.env.development` (VITE_API_BASE_URL). By default: `http://localhost:8085/api/v1`

---

### Testing

- Run all tests: `npm test`
- Watch mode (re-run on file changes): `npm run test -- --watch`
- Run a specific file: `npx vitest run path/to/file.test.js`
- If a test needs a DOM (browser-like) environment: `npx vitest --environment jsdom`

Tests are located in the `test/` directory.

---

### ️ Env Configuration
This project uses Vite’s environment variables instead of a config.js switch. Environment-specific values live in root-level .env files:

- .env.development
    - VITE_API_BASE_URL=http://localhost:8085/api/v1
- .env.production
    - VITE_API_BASE_URL=/api/v1

How it works:
- Vite loads .env.[mode] automatically:
    - npm run dev uses mode development -> .env.development
    - npm run build and npm run preview use mode production -> .env.production
- You can override the mode with the --mode flag (e.g., vite build --mode development).
- Only variables prefixed with VITE_ are exposed to the client code.
- Access variables in code via import.meta.env, for example:
  import.meta.env.VITE_API_BASE_URL

To change environments, edit the corresponding .env.* file or run commands with a different mode as needed.

---

### Deployment

When ready for production:

- Build the app with Vite: `npm run build` (outputs to `dist/`)
- Deploy the contents of `dist/` to a static host (Netlify, Vercel, S3, etc.)
- Configure the production API base URL via `.env.production` (VITE_API_BASE_URL), not a config.js file

## Backend Info (External)

This frontend depends on a Spring Boot backend available in a **separate repository**.

### Repository

- **URL**: `https://github.com/annedyne/lexiconmeum`

### Running the Backend

- Make sure Java 8+ is installed
- Clone and start the backend:

  ```bash
  git clone https://github.com/annedyne/lexiconmeum.git
  cd lexiconmeum
  ./mvnw spring-boot:run
  ```

- By default it runs at `http://localhost:8080`. Adjust your `.env.*` files (VITE_API_BASE_URL) if your backend runs on a different host/port or path.

### API Contract

- The frontend relies on these endpoints:
  - `GET /api/v1/autocomplete/prefix?prefix=<string>`
    Response: JSON array of matching words (e.g., `["amare", "amatus"]`)

  - `GET /api/v1/autocomplete/suffix?suffix=<string>`
    Response: JSON array of matching words (e.g., `["amaturus", "amonibus, "]`)
  - `GET /api/v1/lexemes/123/detail?type=<string>` #type is optional
    Response: JSON object of word definitions and inflections

### CORS

Ensure CORS is enabled in the backend to allow frontend requests from `http://localhost:PORT` during development.

## TODO

- [x] Add front-end unit tests
- [x] Port to Vite
- Port to React
