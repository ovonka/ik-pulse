# Data Model

## Overview

IK Pulse uses PostgreSQL as the system of record.

The data model is relational because the core domains are strongly related and consistency matters.

## Main Entities

### Users
Represents:
- merchants
- admins
- support users
- QA users

### Merchants
Represents the merchant business identity.

### Branches
Represents merchant-specific branch locations.

### Transaction Sources
Represents where transactional activity originates, such as online or physical sources.

### Transactions
Represents transaction attempts and outcomes.

Important fields include:
- provider
- provider transaction reference
- idempotency key
- amount
- currency
- status
- payment method
- failure reason
- attempt number

### Settlements
Represents grouped payout-like data for merchants.

Important fields include:
- gross amount
- net amount
- fees
- status
- scheduled date
- actual settlement date

### Support Sessions
Represents time-scoped troubleshooting access between merchants and internal users.

## Why PostgreSQL?

PostgreSQL was chosen because:

- the data is relational
- consistency matters
- transactional correctness is important
- querying and aggregation are central to the product

## ACID vs BASE

This system leans strongly toward **ACID** characteristics because it models financially sensitive state where correctness is more important than eventual consistency.