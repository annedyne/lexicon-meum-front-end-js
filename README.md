##  LexiconMeum Frontend

A vanilla JavaScript frontend for querying Latin word prefixes.

---

###  Getting Started

#### Prerequisites

* Node.js (v18+ recommended)
* A running backend (see `../backend/README.md`)

#### Running Locally

1. Clone the repo
2. Serve the frontend - currently using npx http-server
3. Make sure the backend is running on `http://localhost:8080`

---

### ️ Configuration

The app uses a simple environment switch in [`config.js`](src/config.js) to control which backend API URL it uses:

```js
const ENV = "development"; // or "production"
```

* **Development** uses `http://localhost:8080/api`
* **Production** can be set to your deployed backend URL (e.g., `https://api.example.com/api`)

You can also auto-detect the environment using `location.hostname` if desired.

---

###  File Structure

```
.
├── index.html          # Main HTML file
├── main.js            # Entry point JS
├── config.js           # Config file for environment settings
├── styles.css          # Custom styles
└── images/             # icons
```

---

###  Deployment

When ready for production:

* Bundle/minify HTML, CSS, and JS (manually or with a tool like Vite/Webpack)
* Upload to a static host (Netlify, Vercel, S3, etc.)
* Update the production API URL in `config.js`



##  Backend Info (External)

This frontend depends on a Spring Boot backend available in a **separate repository**.

###  Repository

* **URL**: `https://github.com/annedyne/lexiconmeum`

###  Running the Backend

* Make sure Java 8+ is installed
* Clone and start the backend:

  ```bash
  git clone https://github.com/annedyne/lexiconmeum.git
  cd lexiconmeum
  ./mvnw spring-boot:run
  ```
* It should be available at `http://localhost:8080`

###  API Contract

* The frontend relies on these endpoints:
  - `GET /api/v1/search/prefix?prefix=<string>`
  Response: JSON array of matching words (e.g., `["amare", "amatus"]`)

  - `GET /api/v1/search/suffix?suffix=<string>`
   Response: JSON array of matching words (e.g., `["amaturus", "amonibus, "]`)

###  CORS

Ensure CORS is enabled in the backend to allow frontend requests from `http://localhost:PORT` during development.


##  TODO

* Add front-end unit tests
* Port to Vite and React


