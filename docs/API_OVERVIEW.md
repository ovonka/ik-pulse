# API Overview

## Overview

The backend exposes a set of RESTful endpoints for merchant operations and internal support workflows.

These endpoints are consumed by the React frontend over HTTPS.

## Main Route Groups

### `/auth`
Handles:
- login
- current user retrieval

### `/dashboard`
Handles:
- summary metrics
- transaction overview
- aggregated values used on the dashboard

### `/transactions`
Handles:
- transaction retrieval
- filtering
- pagination
- retry actions

### `/settlements`
Handles:
- settlement summaries
- settlement history

### `/support-sessions`
Handles:
- current support session retrieval
- support code generation
- code consumption
- session revocation
- session resolution

### `/observability`
Handles:
- operational summaries
- trend and provider breakdowns
- recent event visibility

### `/simulator`
Handles:
- simulator-driven event generation
- future internal testing workflows

## API Design Notes

The API was designed so that:
- the backend owns business logic
- the frontend does not calculate core financial summaries
- responses are shaped for UI consumption but still remain domain-driven

## Error Handling

Errors are surfaced by the backend and mapped to frontend toasts and feedback states.

The goal is to keep the frontend simple while maintaining correct business validation on the server.