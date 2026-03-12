# IK Pulse

**Payment Operations & Observability Platform**

IK Pulse is a full-stack payment operations and observability platform that simulates how modern fintech systems monitor, manage, and troubleshoot payment activity. The platform provides merchant dashboards, transaction management, settlement tracking, internal support tooling, and operational observability of payment provider behaviour.

> The goal of the project is to demonstrate **production-inspired architecture patterns used in payment infrastructure**, including modular backend design, operational dashboards, CI/CD workflows, containerization, and realistic transaction simulation.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [Frontend Stack](#frontend-stack)
- [Backend Stack](#backend-stack)
- [Authentication](#authentication)
- [Health Endpoint](#health-endpoint)
- [CI/CD](#continuous-integration)
- [Containerization](#containerization)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Database Seeding](#database-seeding)
- [Testing](#testing)
- [Design Trade-offs](#design-trade-offs)
- [Future Improvements](#future-improvements)
- [Running Locally](#running-locally)
- [Author](#author)

---

## Overview

IK Pulse simulates a payment processing environment where merchants send transactions through external payment providers. The platform allows merchants and internal operators to monitor activity, investigate failures, retry transactions, and observe payment system behaviour.

The system provides tooling for:

- Merchant transaction monitoring
- Payment retry workflows
- Settlement tracking
- Internal support debugging
- Observability dashboards
- Transaction activity simulation

The platform mirrors operational tooling used by payment companies such as Stripe, Adyen, and Checkout.com.

---

## Core Features

### Merchant Dashboard

The dashboard provides a high-level operational view of merchant payment activity. Key metrics include total sales, successful transactions, failed transactions, pending transactions, and settlement summaries.

Charts visualize transaction status trends and allow merchants to understand performance patterns over time. The dashboard aggregates data from both the **transactions** and **settlements** services.

---

### Transactions Management

The transactions module allows merchants to view and interact with their payment history.

| Capability | Description |
|---|---|
| Paginated history | Browse full transaction records across pages |
| Status filtering | Filter by `success`, `failed`, or `pending` |
| Retry functionality | Re-attempt failed transactions with simulated outcomes |
| Provider reference tracking | Trace transactions back to their external provider |
| Source identification | Identify the originating transaction source |

Retrying a failed transaction simulates real payment behaviour where a retry may succeed or fail depending on simulated provider outcomes.

---

### Settlements

The settlements module simulates how successful transactions are batched and settled to merchant accounts.

The settlements page provides:

- Upcoming settlement estimates
- Settlement history
- Settlement batch totals
- Settlement status tracking

This mimics the settlement cycle used in payment systems where successful transactions are grouped into settlement batches before funds are transferred.

---

### Internal Support Sessions

Internal users (Admin, Support, QA) can initiate support sessions to debug merchant issues. Support sessions allow internal operators to temporarily view the system through a merchant's context — similar to operational tooling used by payment companies when assisting merchants.

When a support session is active:

- A **debug banner** appears in the UI
- All API requests execute in the merchant's context
- Internal users see the same operational data as the merchant

This enables faster troubleshooting of merchant-reported problems.

---

### Observability

The observability module provides insight into system behaviour and transaction health.

Operational metrics include:

- Transaction throughput
- Success vs failure ratios
- Provider breakdown statistics
- Failure reason aggregation
- Recent transaction events

These insights help identify provider issues, system anomalies, and failure trends.

---

### Transaction Simulator

The backend includes a **live transaction simulator** that continuously generates realistic transaction activity.

The simulator automatically:

- Creates transactions for merchants
- Assigns randomized transaction outcomes
- Simulates provider failures
- Generates settlement candidates
- Updates dashboard and observability metrics

> **Note:** A frontend simulator control interface exists but has not yet been wired to the backend simulator engine. This was intentionally deferred to focus on core payment lifecycle flows.

---

## System Architecture

IK Pulse follows a modular full-stack architecture:

```
Client (React + Vite)
        │
        │  REST API
        ▼
Backend (Node.js + Express)
        │
        ▼
  PostgreSQL Database
```

The frontend communicates with the backend through REST APIs. The backend processes payment logic, persists state in PostgreSQL, and powers operational dashboards.

---

## Frontend Stack

| Technology | Role |
|---|---|
| React | UI framework |
| Vite | Build tooling |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| Zustand | State management |
| Recharts | Data visualization |
| Vitest | Testing |

The frontend is responsible for rendering merchant dashboards, transaction tables, settlement views, observability charts, and internal support tooling.

---

## Backend Stack

| Technology | Role |
|---|---|
| Node.js | Runtime |
| Express | HTTP framework |
| TypeScript | Type safety |
| PostgreSQL | Persistent storage |
| Zod | Schema validation |
| JWT | Authentication |

The backend is organized into feature modules:

```
modules/
├── auth/
├── transactions/
├── settlements/
├── dashboard/
├── observability/
├── support-sessions/
└── simulator/
```

Each module encapsulates its routes, validation, service logic, and data access. This **modular monolith** architecture allows the system to scale while keeping development complexity manageable.

---

## Authentication

Authentication is implemented using JSON Web Tokens (JWT).

```
POST /auth/login
```

The server returns a signed JWT token used for all authenticated API requests. Authentication is configured through environment variables:

```
JWT_SECRET
JWT_EXPIRES_IN
```

---

## Health Endpoint

The backend exposes a health endpoint for infrastructure monitoring:

```
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

This endpoint can be used by monitoring systems, load balancers, or uptime checks to verify service availability.

---

## Continuous Integration

The project includes GitHub Actions pipelines that automatically validate code changes on every push.

**Client pipeline**
- Installs dependencies
- Runs the frontend test suite
- Verifies the Vite production build succeeds

**Server pipeline**
- Installs backend dependencies
- Verifies the TypeScript server compiles successfully

These pipelines ensure that broken builds cannot be merged into the main branch.

---

## Containerization

The backend service is containerized using Docker with a **multi-stage build** to compile TypeScript and produce a lightweight production image.

Containerization provides:

- Consistent runtime environments
- Reliable CI builds
- Deployment portability
- Simplified infrastructure management

The container can be deployed to any container platform including Render, Railway, Fly.io, AWS ECS, or Kubernetes.

---

## Deployment

The frontend and backend are deployed separately, mirroring common production deployment patterns used by SaaS platforms.

| Layer | Platform |
|---|---|
| Frontend | Vercel (optimized static hosting + global CDN) |
| Backend | Render / Railway (containerized Node service) |

---

## Environment Variables

**Backend**

```
PORT
NODE_ENV
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
CLIENT_URL
```

**Frontend**

```
VITE_API_BASE_URL
```

Environment variables are provided through hosting platform configuration and are not committed to the repository.

---

## Database

The platform uses **PostgreSQL** for persistent storage.

Core entities:

```
merchants
users
branches
transaction_sources
transactions
settlements
support_sessions
```

Transaction records drive settlement calculations and dashboard metrics.

---

## Database Seeding

Seed scripts are provided to generate realistic demo data:

```bash
npm run seed:users
npm run seed:interview
npm run seed:ops
```

These scripts populate merchants, users, transaction sources, and historical transaction activity to simulate a live environment.

---

## Testing

Frontend tests are implemented using **Vitest** and **Testing Library**.

Test coverage includes:

- Dashboard components
- Transaction tables
- Routing behaviour
- Simulator UI components
- Support session banners

Tests run automatically as part of the CI pipeline.

---

## Design Trade-offs

Several deliberate trade-offs were made during development to balance realism with development speed.

| Decision | Trade-off |
|---|---|
| Simulator runs automatically in the backend | Simpler architecture, but limits manual frontend simulation control |
| Dashboard uses polling instead of WebSockets | Simpler infrastructure, but not truly real-time |
| Modular monolith instead of microservices | Reduces operational complexity while maintaining clear module boundaries |
| Simulator generates transaction activity only | Does not simulate full provider webhooks or async settlement reconciliation |

---

## Future Improvements

Potential enhancements planned for future iterations:

- WebSocket real-time updates
- Provider webhook simulation
- Distributed tracing
- BetterStack observability integration
- Kubernetes deployment
- Retry queue processing
- Circuit breaker patterns
- Full simulator control via frontend

---

## Running Locally

**Start the backend:**

```bash
cd server
npm install
npm run dev
```

**Start the frontend:**

```bash
cd client
npm install
npm run dev
```

The frontend communicates with the backend via the configured `VITE_API_BASE_URL`.

---

## Author

**Nkanyiso Ntshangase**  
Software Engineer · Fullstack Developer · AWS Certified
