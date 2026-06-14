# Why Queues?

[← Day 8 Index](./README.md) | [Next: What Is a Message Queue →](./02-what-is-a-message-queue.md)

## The Problem

In a synchronous system, every step happens in the same request:

```
User clicks "Place Order"
  → save order (50 ms)
  → charge payment (200 ms)
  → update inventory (100 ms)
  → send email (3000 ms)
  → update analytics (150 ms)

Total: ~3.5 seconds before user sees response
```

One slow step blocks everything. One failing downstream service fails the whole request.

## What Queues Solve

A **message queue** sits between the producer (who sends work) and the consumer (who does work). The producer drops a message and moves on.

```
User clicks "Place Order"
  → save order (50 ms)
  → publish "order_created" to queue (2 ms)
  → return 201 OK (~52 ms)

Background workers (async):
  → charge payment
  → update inventory
  → send email
  → update analytics
```

---

## Core Benefits

### 1. Decoupling

Producer doesn't need to know which services exist or whether they're online.

```
Order Service → [queue] → Email Service (optional, can be added later)
                       → Analytics Service
                       → Fraud Service (new — no Order Service code change)
```

Services evolve independently. Add a consumer without changing the producer.

### 2. Async Processing

Move slow or non-critical work off the hot path.

| Task | Sync | Async via Queue |
|------|------|-----------------|
| Send welcome email | User waits 3 s | User gets instant response |
| Generate PDF report | Blocks API | Worker generates in background |
| Resize uploaded image | Timeout risk | Worker processes when ready |

### 3. Absorb Traffic Spikes

Queues buffer bursts. Workers drain at a steady rate.

```
Black Friday: 10,000 orders/sec arrive
Workers:       process 500/sec sustainably
Queue:         holds excess — no crash, delayed processing

Without queue: DB and payment API overwhelmed → outage
```

### 4. Reliability and Retry

Failed work can be retried without the user resubmitting.

```
Email API timeout → message stays in queue → retry in 30 s → succeeds
```

### 5. Durability

Messages persisted to disk survive broker restarts (when configured).

```
API publishes message → broker writes to disk → ack to API
Broker crashes → restarts → message still there → worker processes
```

---

## When Queues Matter in System Design

| Scenario | Queue Role |
|----------|------------|
| E-commerce order flow | Order created → inventory, payment, email |
| Video upload | Accept file → transcode job in queue |
| Notification systems | Push, SMS, email fan-out |
| Log and metrics pipeline | App → queue → aggregation |
| Microservices | Replace sync chains with events |
| Rate limiting downstream | Smooth calls to fragile third-party APIs |

---

## Queues vs Other Tools

| Tool | Purpose |
|------|---------|
| **Queue** | Decouple work in time; async processing |
| **Cache** | Speed up repeated reads |
| **Load balancer** | Spread concurrent requests across servers |
| **DB** | Source of truth, durable state |

Queues don't replace databases. They carry **commands** or **events** — the database still holds authoritative state.

---

## Cost of Using Queues

| Cost | Detail |
|------|--------|
| **Complexity** | More moving parts — broker, workers, monitoring |
| **Eventual consistency** | User sees "order placed" before email sent |
| **Duplicate messages** | Retries require idempotent consumers |
| **Debugging** | Harder than tracing a single HTTP call |
| **Operational overhead** | Lag, DLQ, broker HA |

Use queues when benefits outweigh these costs.

---

## Summary

Queues decouple producers from consumers, enable async processing, absorb spikes, and support retries. They trade immediate consistency for scalability and resilience. Any read-heavy or multi-step workflow with slow side effects is a queue candidate.

---

[Next: What Is a Message Queue →](./02-what-is-a-message-queue.md)
