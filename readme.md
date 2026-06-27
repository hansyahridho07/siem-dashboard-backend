# Setup and Running Guide

This document describes how to setup, configure, migrate, and verify the SIEM Dashboard Backend API using TypeORM.

---

## Prerequisites

Make sure you have the following installed:
*   [Node.js](https://nodejs.org/) (version 18+)
*   [Docker](https://www.docker.com/) and Docker Compose

---

## Step 1 – Running the Docker Environment

Start the PostgreSQL database and Elasticsearch instance by running:

```bash
docker-compose up -d
```

Ensure Docker Desktop is running before executing this command. This command starts:
1.  **PostgreSQL** on port `5432` with database `siem_db`
2.  **Elasticsearch** on port `9200`
3.  **Data Initializer** container which seeds Elasticsearch index `security-alerts` with 24 dummy records.

---

## Step 2 – Installing Backend Dependencies

Install the Node.js packages by running:

```bash
npm install
```

---

## Step 3 – Database Migrations (TypeORM)

We use TypeORM CLI migrations to manage database schemas. Auto-migration (`synchronize`) is disabled during dev server startups for safety.

To apply migrations and create the `highlighted_ips` table, run:

```bash
npm run migration:run
```

### Optional – Database Seeding

You can populate PostgreSQL with initial mock data using the seed command:

*   **Seed all tables (Assets & Highlighted IPs):**
    ```bash
    npm run seed
    ```
*   **Seed only Highlighted IPs:**
    ```bash
    npm run seed ips
    ```
*   **Seed only Assets:**
    ```bash
    npm run seed assets
    ```

### Additional Migration Commands (CLI)

*   **Generate a new migration schema (when entities change):**
    ```bash
    npm run migration:generate -- src/database/migrations/<MigrationName>
    ```
*   **Revert the last executed migration:**
    ```bash
    npm run migration:revert
    ```

---

## Step 4 – Running the Server

Start the backend server in development mode (runs with auto-reload via `ts-node-dev` on port `3000`):

```bash
npm run dev
```

The console should display:
```text
PostgreSQL Database connected successfully via TypeORM.
========================================
  SIEM Backend Service is running!      
  Port: http://localhost:3000          
  Environment: development
========================================
```

To run in production mode:
```bash
npm run build
npm start
```

---

## Step 5 – Manual API Verification

You can verify the endpoints using `curl` or any API client (e.g. Postman, Insomnia).

### 1. Health Check (Task 4)
Verify connectivity to both PostgreSQL and Elasticsearch:
```bash
curl http://localhost:3000/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "services": {
    "postgres": "up",
    "elasticsearch": "up"
  }
}
```

### 2. Advanced Alert Filtering (Task 1)
Retrieve alert logs filtered by department owner (e.g. `Finance`) and paginated:
```bash
curl "http://localhost:3000/api/alerts?department=Finance&page=1&limit=5"
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully fetched alert logs",
  "meta": {
    "total_data": 12,
    "page": 1,
    "limit": 5
  },
  "data": [ ... ]
}
```

### 3. Dashboard Aggregation & Enrichment (Task 2)
Retrieve Top 5 targeted internal IPs enriched with asset data:
```bash
curl http://localhost:3000/api/alerts/top-targeted
```

### 4. Highlighted IP CRUD (Task 3 – Part B)

*   **Add Highlighted IP:**
    ```bash
    curl -X POST http://localhost:3000/api/highlighted-ips \
      -H "Content-Type: application/json" \
      -d '{"ip_address": "185.220.101.5", "reason": "Tor exit node suspicious activity"}'
    ```

*   **View Highlighted IP list:**
    ```bash
    curl http://localhost:3000/api/highlighted-ips
    ```

*   **Update Highlighted IP:**
    Replace `:id` with the ID returned when creating the IP (e.g. `1`):
    ```bash
    curl -X PUT http://localhost:3000/api/highlighted-ips/1 \
      -H "Content-Type: application/json" \
      -d '{"ip_address": "185.220.101.5", "reason": "Confirmed scanner brute forcing SSH"}'
    ```

*   **Delete Highlighted IP:**
    ```bash
    curl -X DELETE http://localhost:3000/api/highlighted-ips/1
    ```

### 5. Highlighted IP Activity Monitoring (Task 3 – Part C)
Get alert logs where the source IP matches any highlighted IP address:
```bash
curl http://localhost:3000/api/alerts/monitoring
```

---

## Additional Systems & Customizations

### 1. Environment Variable Validation
The application uses strict schema validation via **Zod** at startup to verify all required `.env` values. 
* If any environment variables are missing or have incorrect types (e.g. invalid Elasticsearch URL), the system will **print a detailed error report** and **force-close/exit the application immediately** (including killing watcher processes like `ts-node-dev`).
* See `.env.example` for all configurable environment variables.

### 2. Rate Limiting System
To protect APIs from abuse and overload, the server implements IP-based rate limiting via `express-rate-limit`:
1.  **Global Rate Limiter:** Applied across all endpoints. Defaults to a maximum of **100 requests per 1 minute**.
2.  **Heavy Query Limiter:** Applied to heavy aggregation and search APIs (Task 1 & 2). Defaults to **30 requests per 1 minute**.
3.  **Write Operations Limiter:** Applied to database CRUD endpoints (Task 3). Defaults to **15 requests per 1 minute**.

#### Customization via `.env`
You can customize the window and request threshold thresholds by setting these variables:
```env
# Disable rate limits entirely (useful for Dev/Stress Testing)
DISABLE_RATE_LIMIT=false

# Global Limits
RATE_LIMIT_GLOBAL_WINDOW_MS=60000
RATE_LIMIT_GLOBAL_MAX=100

# Heavy Search/Agg Limits
RATE_LIMIT_HEAVY_WINDOW_MS=60000
RATE_LIMIT_HEAVY_MAX=30

# Write CRUD Limits
RATE_LIMIT_WRITE_WINDOW_MS=60000
RATE_LIMIT_WRITE_MAX=15
```

### 3. Stress & Performance Testing
To execute load tests against the API endpoints:

1.  Disable the rate limits in `.env`:
    ```env
    DISABLE_RATE_LIMIT=true
    ```
2.  Run the backend server:
    ```bash
    npm run dev
    ```
3.  Execute performance testing using `autocannon` (Node.js benchmarking tool):
    ```bash
    # Test Health Check endpoint (100 concurrent connections, 10s duration)
    npx autocannon -c 100 -d 10 http://localhost:3000/health
    
    # Test Alert Filtering search endpoint
    npx autocannon -c 100 -d 10 "http://localhost:3000/api/alerts?department=Finance&page=1&limit=5"
    ```

### 4. Interactive API Documentation (Swagger UI)
The API Contract is published as an interactive Swagger UI:
*   **Documentation URL:** [http://localhost:3000/docs](http://localhost:3000/docs)
*   **Definition File:** [docs/swagger.json](file:///c:/Users/ASUS/Downloads/Technical%20Test%20Backend/docs/swagger.json)

Once the backend service is running, navigate to the Documentation URL in your web browser to test and view all endpoint request bodies, query parameters, rate limit headers, and expected response payloads.


