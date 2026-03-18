# Architecture

## Overview

IK Pulse uses a split frontend-backend architecture:

- **Frontend:** React + Vite application
- **Backend:** Node.js + Express API
- **Database:** PostgreSQL
- **Hosting:** Vercel for frontend, Render for backend

The backend is implemented as a **modular monolith**.

This means the API is deployed as a single service, but internally it is organised into separate domain modules with clear responsibilities.

## Why a Modular Monolith?

The backend was deliberately kept as a modular monolith instead of being split into microservices.

This decision was made because the project needed:

- strong separation between domains
- simple deployment
- easier debugging
- lower infrastructure complexity

At the current scale, microservices would introduce unnecessary operational overhead such as service-to-service communication, distributed tracing complexity, and orchestration concerns.

## Core Backend Domains

### Auth
Responsible for:
- login
- current user retrieval
- token-based identity

### Transactions
Responsible for:
- transaction retrieval
- filtering
- pagination
- retry workflows
- transaction state visibility

### Settlements
Responsible for:
- settlement summaries
- settlement history
- payout-like grouping

### Support Sessions
Responsible for:
- generating support codes
- consuming support codes
- maintaining active support context
- resolving support sessions

### Observability
Responsible for:
- aggregate operational metrics
- status trends
- provider breakdowns
- recent event visibility

### Simulator
Responsible for:
- generating realistic transaction activity
- feeding the platform with operational data for testing/demo purposes

## Frontend Structure

The frontend is page-driven and component-based.

Pages:
- DashboardPage
- TransactionsPage
- SettlementsPage
- SupportAccessPage
- InternalSupportSessionPage
- ObservabilityPage
- SimulatorPage

Reusable UI components are used for:
- metric cards
- charts
- tables
- banners
- filters
- pagination

## Data Flow

1. The user interacts with the browser UI.
2. The React frontend sends HTTPS requests to the backend.
3. The Express API validates input and applies business logic.
4. PostgreSQL acts as the source of truth.
5. The API returns structured JSON responses.
6. The frontend renders those responses as operational views.

## Architectural Principles Reflected

### Single Responsibility Principle
Each module and component has a focused responsibility.

### Separation of Concerns
Frontend renders and interacts.
Backend enforces rules and business logic.
Database stores the source of truth.

### Composition Over Inheritance
Both frontend and backend are built around composition rather than deep inheritance hierarchies.

## Design Trade-offs

### Why not microservices?
Too much operational complexity for current scope.

### Why PostgreSQL?
Relational and consistency-heavy domains suit PostgreSQL well.

### Why REST?
Simple, explicit resource access patterns fit the current system well.