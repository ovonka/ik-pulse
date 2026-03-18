# Project Walkthrough

## Goal

IK Pulse was built to explore how a merchant-facing fintech operations platform might be structured in a clean, understandable way.

The project focuses on both:
- product usefulness
- system design reasoning

## Walkthrough Flow

### 1. Login
The user authenticates through the backend auth module.

### 2. Dashboard
The dashboard presents operational summary metrics and charted views of transaction state.

### 3. Transactions
Users can inspect recent transactions, filter by state, paginate through results, and retry failed transactions.

### 4. Settlements
Users can inspect settlement summaries and payout-like history separately from transaction records.

### 5. Support Access
Merchants can generate a support code for internal troubleshooting.

### 6. Internal Support Session
Internal users can consume a code and load merchant context safely.

### 7. Observability
The observability page surfaces operational metrics and system trends.

### 8. Simulator
The simulator provides backend-driven transaction activity to keep the platform operationally realistic.

## Engineering Themes Demonstrated

- modular monolith backend design
- role-based authorization
- ACID-friendly data modelling
- idempotency awareness
- support session lifecycle
- backend-driven summaries
- deployment and runtime concerns