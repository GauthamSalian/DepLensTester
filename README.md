# DepLensTester: Node.js Backend Benchmark Repository

A benchmark Node.js backend project designed specifically for testing **DepLens** (Software Composition Analysis, CVE detection, and AST/reachability static analysis).

## Overview

This repository provides a realistic backend application with **30 production dependencies** (plus 4 development tools). It intentionally includes a curated set of dependencies with well-known direct and transitive (sub-dependency) CVEs, paired with **active code syntax usages** across routes, middleware, and services.

---

## Dependency & Vulnerability Matrix

### 1. Direct Vulnerable Dependencies

| Package | Pinned Version | Known CVEs / Advisory | Vulnerability Description | Direct Syntax Usage in Code |
| :--- | :--- | :--- | :--- | :--- |
| **`lodash`** | `4.17.19` | [CVE-2020-8203](https://nvd.nist.gov/vuln/detail/CVE-2020-8203), [CVE-2021-23337](https://nvd.nist.gov/vuln/detail/CVE-2021-23337) | Prototype Pollution via `zipObjectDeep` / `merge` and command injection in `template` | `src/services/user.service.js` (`_.merge`, `_.cloneDeep`, `_.get`, `_.template`, `_.pick`, `_.omit`) |
| **`jsonwebtoken`** | `8.5.1` | [CVE-2022-23529](https://nvd.nist.gov/vuln/detail/CVE-2022-23529), [CVE-2022-23540](https://nvd.nist.gov/vuln/detail/CVE-2022-23540) | Insecure Key Retrieval & Verification bypass / DoS | `src/middleware/auth.middleware.js` (`jwt.sign`, `jwt.verify`, `jwt.decode`) |
| **`axios`** | `0.21.1` | [CVE-2020-28168](https://nvd.nist.gov/vuln/detail/CVE-2020-28168), [CVE-2021-3749](https://nvd.nist.gov/vuln/detail/CVE-2021-3749) | SSRF via follow-redirects / ReDoS | `src/services/external.service.js` (`axios.create`, `axios.get`) |
| **`validator`** | `13.5.2` | [CVE-2021-3765](https://nvd.nist.gov/vuln/detail/CVE-2021-3765) | Regular Expression Denial of Service (ReDoS) in `isEmail` / `isURL` | `src/middleware/validation.middleware.js` (`validator.isEmail`, `validator.isURL`, `validator.escape`, `validator.trim`) |
| **`moment`** | `2.29.1` | [CVE-2022-24785](https://nvd.nist.gov/vuln/detail/CVE-2022-24785) | Path traversal in user-supplied locales / ReDoS | `src/services/report.service.js` (`moment()`, `moment.duration()`, `moment.locale()`) |
| **`node-fetch`** | `2.6.1` | [CVE-2022-0235](https://nvd.nist.gov/vuln/detail/CVE-2022-0235) | Sensitive cookie/authorization header exposure on redirect | `src/services/external.service.js` (`fetch(url, options)`) |
| **`minimist`** | `1.2.5` | [CVE-2021-44906](https://nvd.nist.gov/vuln/detail/CVE-2021-44906) | Prototype Pollution via argument parsing | `src/utils/cli.util.js` (`minimist(process.argv)`) |

---

### 2. Transitive (Sub-Dependency) Vulnerabilities

| Top-Level Package | Vulnerable Sub-Dependency | Sub-Dependency CVE | Issue Description |
| :--- | :--- | :--- | :--- |
| **`express@4.17.1`** | `body-parser@1.19.0`, `qs@6.7.0`, `path-to-regexp@0.1.7`, `send@0.17.1`, `cookie@0.4.0` | [CVE-2024-43796](https://nvd.nist.gov/vuln/detail/CVE-2024-43796), [CVE-2024-45296](https://nvd.nist.gov/vuln/detail/CVE-2024-45296), [CVE-2024-29041](https://nvd.nist.gov/vuln/detail/CVE-2024-29041) | Prototype pollution in `qs`, ReDoS in `path-to-regexp`, XSS in `send` |
| **`multer@1.4.4`** | `busboy@0.2.14`, `dicer@0.2.5` | [CVE-2022-24434](https://nvd.nist.gov/vuln/detail/CVE-2022-24434) | Denial of Service (DoS) via unhandled boundary crash in `dicer` |

---

### 3. Clean Supporting Dependencies (Non-Vulnerable)

| Package | Version | Purpose & Active Usage Location |
| :--- | :--- | :--- |
| **`cors`** | `2.8.5` | Cross-Origin Resource Sharing (`src/app.js`) |
| **`helmet`** | `7.1.0` | HTTP security headers (`src/app.js`) |
| **`dotenv`** | `16.4.5` | Environment variable loader (`src/server.js`) |
| **`morgan`** | `1.10.0` | HTTP request logging stream (`src/app.js`) |
| **`compression`** | `1.7.4` | Gzip response compression (`src/app.js`) |
| **`cookie-parser`** | `1.4.6` | Cookie header parsing (`src/app.js`) |
| **`bcryptjs`** | `2.4.3` | Password hashing & comparison (`src/middleware/auth.middleware.js`) |
| **`uuid`** | `9.0.1` | UUID v4 generator for entities (`src/services/user.service.js`) |
| **`zod`** | `3.22.4` | Schema declaration and validation (`src/middleware/validation.middleware.js`) |
| **`winston`** | `3.11.0` | Formatted multi-transport application logger (`src/config/logger.js`) |
| **`chalk`** | `4.1.2` | Terminal color styling for logger levels (`src/config/logger.js`) |
| **`prom-client`** | `15.1.0` | Prometheus metrics and latency histogram (`src/config/metrics.js`, `src/app.js`) |
| **`ioredis`** | `5.3.2` | Redis caching client with retry strategies (`src/config/redis.js`) |
| **`pg`** | `8.11.3` | PostgreSQL connection pool and query runner (`src/config/db.js`) |
| **`dayjs`** | `1.11.10` | Date manipulation and expiration offsets (`src/services/report.service.js`) |
| **`slugify`** | `1.6.6` | URL slug generation (`src/services/report.service.js`) |
| **`glob`** | `10.3.10` | Filesystem pattern scanning (`src/services/report.service.js`) |
| **`mime-types`** | `2.1.35` | Content-type and extension detection (`src/middleware/upload.middleware.js`, `src/routes/files.routes.js`) |
| **`nodemailer`** | `6.9.9` | SMTP email transport and dispatch (`src/services/mail.service.js`) |
| **`p-limit`** | `3.1.0` | Concurrency rate limiter for async tasks (`src/services/external.service.js`) |
| **`superagent`** | `6.1.0` | Health check HTTP client (`src/services/external.service.js`) |

#### Dev Dependencies
- **`jest`** (`29.7.0`): Test runner
- **`supertest`** (`6.3.4`): HTTP integration testing
- **`nodemon`** (`3.1.0`): Dev live-reloading
- **`rimraf`** (`5.0.5`): Filesystem cleanup (`src/utils/clean.util.js`)

---

## Project Structure

```text
DepLensTester/
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── app.js                          # Express app configuration & middleware pipeline
│   ├── server.js                       # Server entrypoint with CLI & graceful shutdown
│   ├── config/
│   │   ├── db.js                       # PostgreSQL pool config (pg)
│   │   ├── logger.js                   # Logger setup (winston, chalk)
│   │   ├── metrics.js                  # Prometheus metrics registry (prom-client)
│   │   └── redis.js                    # Redis client initialization (ioredis)
│   ├── middleware/
│   │   ├── auth.middleware.js          # JWT & bcrypt verification (jsonwebtoken, bcryptjs)
│   │   ├── upload.middleware.js        # File upload filter (multer, mime-types)
│   │   └── validation.middleware.js    # Data validation (validator, zod)
│   ├── routes/
│   │   ├── auth.routes.js              # /api/auth endpoints
│   │   ├── user.routes.js              # /api/users endpoints
│   │   ├── external.routes.js          # /api/external API proxies
│   │   ├── files.routes.js             # /api/files upload & metadata
│   │   └── report.routes.js            # /api/reports summary & metrics
│   ├── services/
│   │   ├── user.service.js             # User operations (lodash, uuid, bcryptjs)
│   │   ├── external.service.js         # HTTP fetching (axios, node-fetch, superagent, p-limit)
│   │   ├── report.service.js           # Reporting engine (moment, dayjs, slugify, glob)
│   │   └── mail.service.js             # Email dispatch (nodemailer)
│   └── utils/
│       ├── cli.util.js                 # CLI argument parser (minimist)
│       └── clean.util.js               # Directory cleaning utility (rimraf)
└── tests/
    └── app.test.js                     # Test suite (jest, supertest)
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Test Suite
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev
# or
npm start
```

### 4. Run Maintenance Cleanup
```bash
npm run clean
```

### 5. Inspect NPM Audit Report
```bash
npm audit
```
