# SIEM Dashboard Backend API

This repository contains the backend service for the **SIEM (Security Information and Event Management) Dashboard**. It integrates internal asset data stored in **PostgreSQL** with high-volume security alert logs stored in **Elasticsearch** to provide correlated security visibility, filtering, aggregation, and suspicious IP monitoring.

---

## 🚀 Key Features & Completed Tasks

### Core Tasks
1.  **Task 1 – Advanced Alert Filtering (`GET /api/alerts`):** Correlation of Elasticsearch alert logs with PostgreSQL asset data, allowing filtering by department owner and risk level with pagination.
2.  **Task 2 – Dashboard Aggregation (`GET /api/alerts/top-targeted`):** Identifies the Top 5 most frequently targeted internal IPs from Elasticsearch, enriched in-memory with PostgreSQL asset details.
3.  **Task 3 – Highlighted IP Monitoring:**
    *   **Part A & B (CRUD API):** Fully functional endpoints to Add, View, Update, and Delete highlighted suspicious IPs (`/api/highlighted-ips`).
    *   **Part C (Activity Monitoring):** Returns alert logs from Elasticsearch where the source IP matches any highlighted IP address in PostgreSQL (`/api/alerts/monitoring`).
4.  **Task 4 – Health Check (`GET /health`):** Verifies active connectivity to both PostgreSQL and Elasticsearch databases.

### Advanced Capabilities (Bonus Points)
*   **Interactive API Documentation (Swagger UI):** Fully-featured Swagger UI documentation served live at `/docs`.
*   **Flexible Rate Limiting:** Global rate limiting, heavy-query throttling, and write limits configured via `.env`.
*   **Strict Env Validation:** Automatic boot-up check utilizing **Zod** that prevents server startup with incomplete configuration.
*   **Structured Logging (Pino):** Uses Pino for structured JSON log output (with pino-pretty for development console formatting).
*   **Helmet Security Middleware:** Enhanced API security by automatically setting HTTP protection headers.
*   **Modular Database Seeding:** Custom seeding script supporting targeted runs (`npm run seed ips` or `npm run seed assets`).
*   **Detailed Query Logging:** Logs all executed TypeORM SQL statements and Elasticsearch query payloads.
*   **Docker Integration:** Ready-to-go environment with optimized configurations (`.dockerignore`, `.gitignore`).

---

## 🛠️ Technology Stack
*   **Runtime:** Node.js (v18+) with TypeScript
*   **Framework:** Express.js (with Helmet security headers)
*   **Databases:** PostgreSQL (Relational) & Elasticsearch (Log Engine)
*   **ORM:** TypeORM
*   **Validation:** Zod
*   **Logging:** Pino (with pino-pretty)
*   **Rate Limiting:** express-rate-limit
*   **Documentation:** Swagger UI Express & OpenAPI 3.0

---

## 📋 Quick Start Guide

### 1. Run the Database Environment (Docker)
Ensure Docker Desktop is running, then run:
```bash
docker-compose up -d
```
This starts PostgreSQL (port `5432`), Elasticsearch (port `9200`), and initializes the Elasticsearch `security-alerts` index with 24 dummy log records.

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
*(Optionally modify ports or rate limits inside the `.env` file).*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Migrations & Database Seeding
Create the database tables and seed them with test data:
```bash
# Run migrations (creates highlighted_ips table)
npm run migration:run

# Seed the database (optional - seeds assets & highlighted IPs)
npm run seed
```

### 5. Start the Server
```bash
# Start in development mode (with hot-reload)
npm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000).

*   **API Documentation UI:** Go to [http://localhost:3000/docs](http://localhost:3000/docs) in your browser.
*   **Detailed Setup & Verification:** Refer to [SETUP.md](./SETUP.md) for curl test commands, CRUD routes, and manual API verifications.

---

## 🧠 Assumptions, Trade-offs, Limitations, & Future Improvements

### 1. Assumptions
*   **Asset Count is Manageable:** We assume the number of assets stored in PostgreSQL is relatively small (e.g., hundreds or thousands of devices) compared to the volume of security alert logs in Elasticsearch (millions of records). Therefore, fetching and holding asset IPs in memory during query filtration is highly performant.
*   **Elasticsearch Index Performance:** We assume that Elasticsearch fields `src_ip` and `network_target_ip` are mapped correctly as type `ip`, which allows rapid range and term queries.
*   **Synchronous State for Dev Environment:** We assume that running migrations (`migration:run`) is done before starting the backend in both Docker-compose environments and local node contexts.

### 2. Architectural Trade-offs
*   **In-Memory Enrichment vs. Database Join:** Since Elasticsearch and PostgreSQL are separate datastores, we cannot join them via SQL. We retrieve aggregated top-targeted IPs from Elasticsearch first, query PostgreSQL once for these specific IPs using SQL `IN`, and merge the data using a JavaScript `Map` ($O(1)$ lookup complexity). This avoids N+1 queries.
*   **Strict Zod Schema Validation over Controllers:** We chose to enforce strict input validation directly at the controller entry point. If a client passes parameter values that do not strictly comply with our specifications (such as a malformed IP address), the request is rejected immediately. This increases API robustness but requires clients to strictly conform to the schemas.

### 3. Limitations
*   **No Real-time Sync:** Changes to company assets in PostgreSQL are not automatically synced with Elasticsearch. While this backend queries databases dynamically, any changes in Elasticsearch structure require manual indices update.
*   **Memory Overhead on Large Asset Lists:** If the postgres assets table grows to hundreds of thousands of entries, fetching all asset IPs to query Elasticsearch might hit payload limitations or consume substantial Node.js memory.

### 4. Future Improvements
*   **Caching Layer (Redis):** Implement a caching layer for PostgreSQL asset lookup. Since asset configurations change infrequently, caching these records will eliminate database round-trips for every search filter query.
*   **Database Indexes:** Add a database index on the `host_identifier_local` column in the `internal_infrastructure_assets` table to optimize SQL lookup times.
*   **Elasticsearch Alias & Reindexing:** Setup index aliases and templates in Elasticsearch to easily rotate indices (e.g., weekly or monthly indices) as log records grow into the hundreds of millions.

---

## 📂 Project Structure Map
Refer to [STRUCTURE.md](./STRUCTURE.md) for a detailed mapping of files, roles, and structural layout of the codebase.
