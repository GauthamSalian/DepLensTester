# DepLensTester: Node.js Backend Benchmark Repository

A benchmark Node.js backend project designed specifically for testing **DepLens** (Software Composition Analysis, CVE detection, dependency graph visualization, and AST/reachability static analysis).

## Graph Size & Structure

The repository is calibrated for dependency graph visualization and SCA benchmarking:
- **Total Dependency Graph Nodes**: **~109 unique packages** (120 package entries in `package-lock.json`, reduced from 560+).
- **Direct Dependencies**: 24 top-level dependencies.
- **Vulnerable Packages**: Curated mix of **direct** (top-level) and **transitive** (sub-dependency) CVEs.
- **Active Syntax Usage**: Every direct dependency is actively imported and invoked across backend services, routes, middleware, and utilities.

---

## Vulnerability & Dependency Matrix

### 1. Direct Vulnerabilities (Top-Level Dependencies)

| Package | Pinned Version | Known CVEs / Advisory | Issue Category | Active Syntax Usage Location |
| :--- | :--- | :--- | :--- | :--- |
| **`lodash`** | `4.17.19` | [CVE-2020-8203](https://nvd.nist.gov/vuln/detail/CVE-2020-8203), [CVE-2021-23337](https://nvd.nist.gov/vuln/detail/CVE-2021-23337) | Prototype Pollution & Command Injection in `_.template` | `src/services/user.service.js` (`_.merge`, `_.cloneDeep`, `_.get`, `_.template`, `_.pick`, `_.omit`) |
| **`jsonwebtoken`** | `8.5.1` | [CVE-2022-23529](https://nvd.nist.gov/vuln/detail/CVE-2022-23529), [CVE-2022-23540](https://nvd.nist.gov/vuln/detail/CVE-2022-23540) | Insecure Key Retrieval & Verification Bypass | `src/middleware/auth.middleware.js` (`jwt.sign`, `jwt.verify`, `jwt.decode`) |
| **`axios`** | `0.21.1` | [CVE-2020-28168](https://nvd.nist.gov/vuln/detail/CVE-2020-28168), [CVE-2021-3749](https://nvd.nist.gov/vuln/detail/CVE-2021-3749) | SSRF & Regular Expression Denial of Service (ReDoS) | `src/services/external.service.js` (`axios.create`, `axios.get`) |
| **`validator`** | `13.5.2` | [CVE-2021-3765](https://nvd.nist.gov/vuln/detail/CVE-2021-3765) | ReDoS in `isEmail` / `isURL` regex parsing | `src/middleware/validation.middleware.js` (`validator.isEmail`, `validator.isURL`, `validator.escape`, `validator.trim`) |
| **`moment`** | `2.29.1` | [CVE-2022-24785](https://nvd.nist.gov/vuln/detail/CVE-2022-24785) | Directory Traversal via `moment.locale` / ReDoS | `src/services/report.service.js` (`moment()`, `moment.duration()`, `moment.utc()`) |
| **`node-fetch`** | `2.6.1` | [CVE-2022-0235](https://nvd.nist.gov/vuln/detail/CVE-2022-0235) | Sensitive Authorization/Cookie Header Leakage on cross-domain redirect | `src/services/external.service.js` (`fetch(url, options)`) |
| **`minimist`** | `1.2.5` | [CVE-2021-44906](https://nvd.nist.gov/vuln/detail/CVE-2021-44906) | Prototype Pollution in CLI argument parsing | `src/utils/cli.util.js` (`minimist(process.argv)`) |
| **`nodemailer`** | `6.9.9` | [CVE-2024-4068](https://nvd.nist.gov/vuln/detail/CVE-2024-4068) | Command Injection & interpretation conflict | `src/services/mail.service.js` (`nodemailer.createTransport`, `transporter.sendMail`) |

---

### 2. Transitive Vulnerabilities (Sub-Dependencies)

| Top-Level Dependency | Vulnerable Sub-Dependency | Sub-Dependency Advisory / CVE | Issue Category |
| :--- | :--- | :--- | :--- |
| **`express@4.17.1`** | `body-parser@1.19.0`, `qs@6.7.0`, `path-to-regexp@0.1.7`, `send@0.17.1`, `cookie@0.4.0` | [CVE-2024-43796](https://nvd.nist.gov/vuln/detail/CVE-2024-43796), [CVE-2024-45296](https://nvd.nist.gov/vuln/detail/CVE-2024-45296), [CVE-2024-29041](https://nvd.nist.gov/vuln/detail/CVE-2024-29041) | Prototype pollution in `qs`, ReDoS in `path-to-regexp`, XSS in `send` |
| **`multer@1.4.4`** | `busboy@0.2.14`, `dicer@0.2.5` | [CVE-2022-24434](https://nvd.nist.gov/vuln/detail/CVE-2022-24434) | Denial of Service (DoS) crash in multipart parser |

---

### 3. Non-Vulnerable Supporting Dependencies

| Package | Version | Purpose & Usage Location |
| :--- | :--- | :--- |
| **`bcryptjs`** | `2.4.3` | Password hashing & comparison (`src/middleware/auth.middleware.js`) |
| **`chalk`** | `4.1.2` | Console log formatting (`src/config/logger.js`) |
| **`cors`** | `2.8.5` | Cross-Origin headers middleware (`src/app.js`) |
| **`dayjs`** | `1.11.10` | Date arithmetic and expiration dates (`src/services/report.service.js`) |
| **`dotenv`** | `16.4.5` | Environment configuration (`src/server.js`) |
| **`helmet`** | `7.1.0` | HTTP security headers (`src/app.js`) |
| **`mime-types`** | `2.1.35` | MIME detection & validation (`src/middleware/upload.middleware.js`, `src/routes/files.routes.js`) |
| **`p-limit`** | `3.1.0` | Async concurrency control (`src/services/external.service.js`) |
| **`slugify`** | `1.6.6` | URL slug generation (`src/services/report.service.js`) |
| **`uuid`** | `9.0.1` | Unique ID generation (`src/services/user.service.js`) |
| **`zod`** | `3.22.4` | Input validation schemas (`src/middleware/validation.middleware.js`) |
| **`compression`**| `1.7.4` | Gzip compression middleware (`src/app.js`) |
| **`cookie-parser`** | `1.4.6`| Cookie parsing middleware (`src/app.js`) |
| **`morgan`** | `1.10.0` | HTTP request logging stream (`src/app.js`) |

---

## Project Structure

```text
DepLensTester/
├── package.json                    # 24 direct dependencies (~109 total packages)
├── package-lock.json               # Locked dependency tree
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── README.md                       # Architecture & vulnerability guide
├── src/
│   ├── app.js                      # Express configuration (helmet, cors, morgan, compression)
│   ├── server.js                   # Server entrypoint with CLI & graceful shutdown
│   ├── config/
│   │   ├── db.js                   # Database query helper
│   │   ├── logger.js               # Structured logger (chalk)
│   │   ├── metrics.js              # Prometheus metrics collector (/metrics)
│   │   └── redis.js                # Cache client emulator
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT & bcrypt authentication (jsonwebtoken, bcryptjs)
│   │   ├── upload.middleware.js    # File uploads (multer, mime-types)
│   │   └── validation.middleware.js# Schema validation (validator, zod)
│   ├── routes/
│   │   ├── auth.routes.js          # Authentication endpoints
│   │   ├── user.routes.js          # User profile endpoints
│   │   ├── external.routes.js      # External API endpoints (axios, node-fetch)
│   │   ├── files.routes.js         # File management endpoints (multer)
│   │   └── report.routes.js        # Report endpoints (moment, dayjs, slugify)
│   ├── services/
│   │   ├── user.service.js         # User service (lodash, uuid, bcryptjs)
│   │   ├── external.service.js     # External client (axios, node-fetch, p-limit)
│   │   ├── report.service.js       # Reporting engine (moment, dayjs, slugify)
│   │   └── mail.service.js         # Email dispatch (nodemailer)
│   └── utils/
│       ├── cli.util.js             # CLI argument parser (minimist)
│       └── clean.util.js           # Directory cleanup utility
└── tests/
    └── app.test.js                 # Native test suite (node:test, node:assert)
```

---

## Commands

```bash
# Install dependencies (~109 total packages)
npm install

# Run native test suite (zero dev-dependencies)
npm test

# Start the application
npm start

# Run maintenance cleanup
npm run clean

# Run security audit
npm audit
```
