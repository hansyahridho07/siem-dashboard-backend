# Project Structure & Architecture Map

This document serves as a high-density, token-efficient architectural context map for future AI sessions. It provides an immediate overview of the repository structure, code design patterns, and database contracts.

---

## 1. Directory Tree & Roles

```text
├── docs/
│   └── swagger.json        # Swagger OpenAPI 3.0 API Contract specification.
├── src/
│   ├── config/
│   │   ├── db.ts               # TypeORM DataSource configuration & initialization.
│   │   ├── elasticsearch.ts    # Client setup for Elasticsearch connection.
│   │   └── env.ts              # Zod environment variable parsing, validation, and strong typing.
│   ├── dto/                    # Data Transfer Objects layer.
│   │   ├── request/            # Request DTOs (Zod validation schemas and static types).
│   │   │   ├── alert-query.request.dto.ts
│   │   │   └── highlighted-ip.request.dto.ts
│   │   └── response/           # Response DTOs (TypeScript contracts for JSON payloads).
│   │       ├── alert.response.dto.ts
│   │       ├── top-targeted.response.dto.ts
│   │       ├── highlighted-ip.response.dto.ts
│   │       └── health.response.dto.ts
│   ├── entities/               # TypeORM Entity classes representing table structures.
│   │   ├── asset.entity.ts     # Map for internal_infrastructure_assets.
│   │   ├── alert.entity.ts     # TypeScript interface representing an ES alert log.
│   │   └── ip.entity.ts        # Map for highlighted_ips (managed by TypeORM migrations).
│   ├── repositories/           # Isolated data-access logic doing direct SQL or ES queries.
│   │   ├── asset.repository.ts # Queries postgres asset using TypeORM Repository.
│   │   ├── alert.repository.ts # Performs ES queries, sorting, pagination, and aggregations (with logs).
│   │   └── ip.repository.ts    # Performs CRUD operations on highlighted_ips via TypeORM.
│   ├── mappers/                # Maps raw Entities/Queries to cleaner API response structures.
│   │   ├── alert.mapper.ts     # Maps alert documents & merges asset rows.
│   │   └── ip.mapper.ts        # Maps highlighted IP rows to Response DTOs.
│   ├── services/               # Orchestrates business logic, queries repositories, applies mappers.
│   │   ├── alert.service.ts    # Logic for Task 1 (Filter Alerts) and Task 2 (Top Assets).
│   │   ├── ip.service.ts       # CRUD and Alert monitoring logic for Task 3.
│   │   └── health.service.ts   # Ping queries for PostgreSQL (TypeORM) and Elasticsearch.
│   ├── controllers/            # Receives Express requests, validates payloads, calls services.
│   │   ├── alert.controller.ts # Task 1 & 2 handlers (Zod query validations).
│   │   ├── ip.controller.ts    # Task 3 CRUD & Monitoring handlers (Zod body validations).
│   │   └── health.controller.ts# Task 4 health check handler.
│   ├── routes/                 # Connects express endpoints to controller methods.
│   │   ├── alert.routes.ts     # Alerts endpoints.
│   │   ├── ip.routes.ts        # IP CRUD and monitoring endpoints (rate-limited).
│   │   └── health.routes.ts    # Health status endpoint.
│   ├── middlewares/
│   │   └── rate-limiter.ts     # Configurable global, heavy-query, and write rate limiters.
│   ├── database/
│   │   ├── migrations/         # TypeORM migration scripts directory.
│   │   ├── seeds/              # Table-specific seeder files.
│   │   │   ├── ip.seeder.ts    # Seeder for highlighted_ips.
│   │   │   └── asset.seeder.ts # Seeder for internal_infrastructure_assets.
│   │   └── seed.ts             # CLI Seeder runner tool supporting targeted runs.
│   ├── app.ts                  # Registers Express middleware, swagger docs, rate limits, routes.
│   └── server.ts               # Standard Express server listener, initializes DataSource on start.
├── .gitignore              # Specifies patterns for files to ignore in Git.
├── .dockerignore           # Excludes local files from the Docker build context.
```

---

## 2. Architecture & Data Flow Pattern

Data and operations flow unidirectionally through layers:
$$\text{HTTP Request} \rightarrow \text{Route} \rightarrow \text{Controller} \rightarrow \text{Service} \rightarrow \text{Repository} \rightarrow \text{Entity/Database} \rightarrow \text{Mapper} \rightarrow \text{HTTP Response}$$

*   **Controllers**: Act as simple HTTP entrypoints, bind context, call services, and use decorated wrapper handlers.
*   **Services**: Handle Zod parsing (from `dto/request`), run core business/transaction logic, consult repositories, and transform return types via mappers into response DTOs (`dto/response`).
*   **Repositories**: Contain data source-specific queries (TypeORM queries for PostgreSQL, ES queries for Elasticsearch).
*   **Mappers**: Translate entity structures into strict output contract interfaces defined under `dto/response`.

---

## 3. Database & Index Schemas

### PostgreSQL: Company Assets Table
*   **Table Name**: `internal_infrastructure_assets` (Already created in seed)
*   **Entity class**: `AssetEntity`

### PostgreSQL: Highlighted IPs Table (CRUD)
*   **Table Name**: `highlighted_ips` (Managed by TypeORM Migrations)
*   **Entity class**: `HighlightedIpEntity`
*   **Fields**:
    *   `id`: `SERIAL` (PK)
    *   `ip_address`: `VARCHAR(45) UNIQUE NOT NULL` (Supports IPv4/IPv6)
    *   `reason`: `TEXT`
    *   `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
    *   `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### Elasticsearch: Security Alerts Index
*   **Index Name**: `security-alerts`

---

## 4. Migration Commands

We use TypeORM CLI for database migrations with `synchronize: false` in dev environments.

*   **Generate new migration**:
    ```bash
    npm run migration:generate -- src/database/migrations/<MigrationName>
    ```
*   **Run migrations**:
    ```bash
    npm run migration:run
    ```
*   **Revert migrations**:
    ```bash
    npm run migration:revert
    ```
