# Types of System Design

[← What Is System Design](./02-what-is-system-design.md) | [Day 1 Index](./README.md) | [Next: When to Use →](./04-when-to-use-system-design.md)

## Overview

"System design" isn't one single thing. Depending on scope and lifecycle stage, you'll work at different levels and with different architectural styles.

## By Level of Abstraction

### 1. High-Level Design (HLD)

The **big picture** — major components and how they connect.

- Which services exist?
- How does data flow between them?
- What external systems are involved?

**Example:** A food delivery app has User Service, Order Service, Payment Service, Notification Service, and a shared message queue.

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│   User   │   │  Order   │   │ Payment  │
│ Service  │   │ Service  │   │ Service  │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┼──────────────┘
                    ▼
            ┌──────────────┐
            │ Message Queue│
            └──────────────┘
```

**When:** Early planning, stakeholder alignment, architecture reviews.

### 2. Low-Level Design (LLD)

The **details inside** a single component.

- Class diagrams and interfaces
- Database table schemas
- API request/response formats
- Algorithm choices

**Example:** Inside Order Service — `OrderRepository`, `OrderController`, state machine for order status (`PLACED → CONFIRMED → DELIVERED`).

**When:** Implementation phase, code reviews, detailed technical specs.

### 3. Detailed Design

Sits between HLD and LLD. Covers:

- Specific technology choices (PostgreSQL vs MongoDB)
- Deployment topology (3 AZs, 2 replicas each)
- Capacity estimates (storage, QPS per service)

## By Architectural Style

### Monolithic Architecture

All functionality lives in **one deployable unit**.

```
┌─────────────────────────────────┐
│           Monolith              │
│  ┌─────┐ ┌─────┐ ┌──────────┐  │
│  │Auth │ │Users│ │  Orders  │  │
│  └─────┘ └─────┘ └──────────┘  │
│         Shared Database         │
└─────────────────────────────────┘
```

| Pros | Cons |
|------|------|
| Simple to develop and deploy | Hard to scale individual parts |
| Easy debugging (one codebase) | Large codebase becomes unwieldy |
| No network overhead between modules | One bug can take down everything |

**Best for:** Startups, MVPs, small teams, early-stage products.

### Microservices Architecture

Application split into **independently deployable services**, each owning a bounded context.

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│  Auth  │  │  User  │  │ Order  │  │Payment │
│Service │  │Service │  │Service │  │Service │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │
    ▼           ▼           ▼           ▼
  DB-A        DB-B        DB-C        DB-D
```

| Pros | Cons |
|------|------|
| Scale services independently | Operational complexity |
| Teams own services end-to-end | Network latency between services |
| Fault isolation | Distributed debugging is harder |
| Technology flexibility per service | Needs mature DevOps practices |

**Best for:** Large teams, high scale, domains with clearly separated concerns.

### Serverless Architecture

You write functions; the cloud provider manages servers, scaling, and patching.

```
Client → API Gateway → Lambda Functions → DynamoDB / S3
```

| Pros | Cons |
|------|------|
| No server management | Cold start latency |
| Pay per invocation | Vendor lock-in |
| Auto-scales to zero | Harder for long-running workloads |

**Best for:** Event-driven workloads, sporadic traffic, rapid prototyping.

### Event-Driven Architecture

Components communicate through **events** rather than direct calls.

```
Order Placed ──▶ [Event Bus] ──▶ Inventory Service
                              ──▶ Notification Service
                              ──▶ Analytics Service
```

| Pros | Cons |
|------|------|
| Loose coupling | Eventual consistency |
| Easy to add new consumers | Harder to trace request flows |
| Natural fit for async work | Ordering and idempotency challenges |

**Best for:** Pipelines, notifications, audit logs, real-time analytics.

## By Deployment Model

| Model | Description | Example |
|-------|-------------|---------|
| **On-Premises** | You own the hardware | Legacy enterprise systems |
| **Cloud** | Rent compute/storage from a provider | AWS, GCP, Azure |
| **Hybrid** | Mix of on-prem and cloud | Regulated industries migrating gradually |
| **Multi-Cloud** | Services spread across providers | Avoiding single-vendor dependency |

## By Data Architecture

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Single Database** | One DB for everything | Small apps, early stage |
| **Database per Service** | Each microservice has its own DB | Microservices at scale |
| **CQRS** | Separate read and write models | Read-heavy systems with complex writes |
| **Event Sourcing** | Store state as a sequence of events | Audit trails, financial systems |

## How They Relate

In practice, you'll mix types:

- A **microservices** system deployed on **cloud**
- Using **event-driven** communication between services
- With **HLD** for the overall map and **LLD** for each service

There's no single "correct" type — only what fits your requirements, team, and constraints.

## Summary

System design operates at multiple levels (high-level, low-level, detailed) and across multiple styles (monolith, microservices, serverless, event-driven). Choose based on team size, scale needs, operational maturity, and how clearly you can split domain boundaries.

---

[Next: When to Use System Design →](./04-when-to-use-system-design.md)
