# Microservices & Workers

[← Queue](./07-queue.md) | [Day 5 Index](./README.md)

## What Are Microservices?

**Microservices** split an application into small, independently deployable services — each owning a specific business capability and its data.

```
Monolith:                          Microservices:
┌─────────────────────┐            ┌──────┐ ┌──────┐ ┌──────┐
│  Users + Orders +   │            │ User │ │Order │ │Payment│
│  Payments + Search  │            │ Svc  │ │ Svc  │ │ Svc  │
│  (one deploy)       │            └──┬───┘ └──┬───┘ └──┬───┘
└─────────────────────┘               │        │        │
                                      DB-A     DB-B     DB-C
```

Each service is a mini-application: own code, own database, own deployment cycle.

## What Are Workers?

**Workers** are background processes that consume tasks from a [queue](./07-queue.md) and do work outside the request path.

```
API Server (handles HTTP)          Worker (handles background jobs)
       │                                    │
       │ enqueue                            │ dequeue
       ▼                                    ▼
              [ Message Queue ]
```

Workers are not microservices by themselves — but microservice architectures rely heavily on workers for async processing.

## Why Microservices?

| Benefit | Detail |
|---------|--------|
| **Independent scaling** | Scale search service without scaling billing |
| **Team ownership** | Team A owns Order Service end-to-end |
| **Technology freedom** | Python for ML, Go for payments, Node for API |
| **Fault isolation** | Payment down ≠ entire site down |
| **Faster deploys** | Deploy one service, not whole monolith |
| **Clear boundaries** | Forces domain-driven design |

## Why Workers?

| Benefit | Detail |
|---------|--------|
| **Fast API responses** | Offload slow work |
| **Resilience** | Retry failed jobs without user waiting |
| **Burst handling** | Queue absorbs spikes |
| **Scheduled tasks** | Cron-style jobs (reports, cleanup) |

## Microservices Architecture

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     ▼
┌──────────────┐
│ API Gateway  │  Auth, routing, rate limiting
└──────┬───────┘
       │
   ┌───┼───┬───────────┬────────────┐
   ▼   ▼   ▼           ▼            ▼
┌─────┐┌─────┐┌──────────┐┌──────────┐┌──────────┐
│User ││Order││ Product  ││ Payment  ││Notification│
│Svc  ││Svc  ││ Service  ││ Service  ││ Service  │
└──┬──┘└──┬──┘└────┬─────┘└────┬─────┘└────┬─────┘
   │      │        │           │           │
   ▼      ▼        ▼           ▼           ▼
  DB-A   DB-B     DB-C       Stripe     SendGrid
                              API        API
```

### Service Communication

| Style | When | Example |
|-------|------|---------|
| **Sync (REST/gRPC)** | Need immediate response | Order Svc calls Payment Svc |
| **Async (queue/event)** | Fire-and-forget, eventual | Order Svc publishes `order_placed` |
| **Webhook** | External system pushes to you | Stripe payment confirmation |

Prefer **async** when possible — looser coupling, better resilience.

## Workers in a Microservices Stack

Each service can have its own workers:

```
Order Service:
  API  → handles POST /orders
  Worker → processes order fulfillment, sends confirmation

Image Service:
  API  → handles POST /upload (returns job ID)
  Worker → resizes, optimizes, stores to S3

Report Service:
  API  → handles POST /reports/generate
  Worker → queries DB, builds PDF, emails link
```

### Worker Architecture

```
┌─────────────────────────────────────────────┐
│                  Order Service               │
│                                              │
│  ┌──────────┐         ┌──────────────────┐  │
│  │ API      │──enqueue│  order_queue     │  │
│  │ (HTTP)   │         └────────┬─────────┘  │
│  └──────────┘                  │            │
│                                ▼            │
│                    ┌──────────────────┐     │
│                    │  Order Worker(s) │     │
│                    │  (background)  │     │
│                    └──────────────────┘     │
└─────────────────────────────────────────────┘
```

Scale workers independently:

```
Black Friday:  3 API servers + 20 order workers
Normal day:    2 API servers + 3 order workers
```

## Microservices vs Monolith

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| Deploy | One unit | Per service |
| Scale | Scale everything | Scale what needs it |
| Complexity | Lower | Higher (network, ops) |
| Team size | 1–10 engineers | 10+ engineers |
| Data | One database | Database per service |
| Debugging | Single process | Distributed tracing needed |
| Best for | MVP, early stage | Mature, large teams |

**Start monolith.** Extract microservices when you feel real pain — not before.

## Service Boundaries (How to Split)

Split by **business domain**, not technical layer.

```
Good boundaries:
  User Service     — accounts, auth, profiles
  Order Service    — order lifecycle
  Payment Service  — charges, refunds
  Catalog Service  — products, categories

Bad boundaries:
  Controller Service
  Database Service
  Validation Service
```

### Signs a Service Should Be Extracted

- Team steps on each other's code constantly
- One module needs very different scaling
- Different release cadence needed
- Technology mismatch (ML Python vs API Go)

## Challenges of Microservices

| Challenge | Mitigation |
|-----------|------------|
| **Distributed debugging** | Distributed tracing (Jaeger, OpenTelemetry) |
| **Network failures** | Retries, circuit breakers, timeouts |
| **Data consistency** | Saga pattern, eventual consistency |
| **Operational overhead** | Kubernetes, service mesh, CI/CD per service |
| **Testing complexity** | Contract tests, integration test environments |

### Saga Pattern (Distributed Transactions)

No single ACID transaction across services. Use a saga:

```
Place Order Saga:
  1. Order Svc: create order (PENDING)
  2. Payment Svc: charge card
     → success: Order Svc marks CONFIRMED
     → failure: Order Svc marks CANCELLED, compensate (refund if needed)
```

## Worker Types

| Type | Trigger | Example |
|------|---------|---------|
| **Queue worker** | Message arrives in queue | Process image upload |
| **Cron / scheduled** | Time-based | Nightly backup, weekly report |
| **Event consumer** | Pub/sub event | React to `user_signed_up` |
| **Stream processor** | Kafka consumer | Real-time analytics aggregation |

### Cron vs Queue Workers

```
Cron:     "Every night at 2 AM, generate sales report"
Queue:    "User uploaded file → process whenever worker is free"
Event:    "Order placed → notify inventory immediately"
```

## Putting It All Together

Real production stack from [Day 4](../day-04/01-visit-website-scenario.md), fully scaled:

```
User
  │
  ▼
DNS → CDN (static) ──────────────────────────┐
  │                                            │
  ▼                                            │
Load Balancer / Reverse Proxy                  │
  │                                            │
  ├──▶ Web App (monolith or API Gateway)       │
  │         │                                  │
  │         ├──▶ Redis (cache)                 │
  │         ├──▶ PostgreSQL (primary + replicas)
  │         │                                  │
  │         └──▶ Queue ──▶ Workers             │
  │              │         ├── email worker     │
  │              │         ├── image worker    │
  │              │         └── report worker   │
  │              │                             │
  │              └──▶ Microservices (optional) │
  │                    ├── Payment Svc        │
  │                    ├── Search Svc         │
  │                    └── Notification Svc   │
  │                                            │
  └──▶ Static assets from CDN ◀───────────────┘
```

## When to Adopt What

| Stage | Architecture |
|-------|--------------|
| MVP / startup | Monolith + Redis + single DB |
| Growing | Monolith + cache + read replicas + queue + workers |
| Scale | Extract hot services + CDN + DB sharding |
| Large org | Full microservices + event bus + worker fleets |

## Summary

**Microservices** split your app into independently deployable domain services — each with its own data and team. **Workers** handle background jobs from queues so APIs stay fast. Start with a monolith and workers; extract microservices when team size and scale demand it. Pair both with queues, caching, and observability from the other Day 5 topics.

---

**Day 5 complete.** Paste Day 6 when ready.

[← Back to Day 5 Index](./README.md) | [Day 4: Website Scenario](../day-04/01-visit-website-scenario.md)
