# Queue

[← DB Scaling](./06-db-scaling.md) | [Day 5 Index](./README.md) | [Next: Microservices & Workers →](./08-microservices-and-workers.md)

## What Is a Queue?

A **message queue** is a buffer that holds tasks or messages between producers (who send) and consumers (who process). The producer doesn't wait for the consumer to finish.

```
Without queue:
  API → send email (3 seconds) → respond to user
  User waits 3 seconds

With queue:
  API → drop message in queue → respond immediately (50ms)
  Worker → picks up message → sends email in background
```

Queues decouple **"accept the request"** from **"do the work"**.

## Why It Exists

| Problem | Queue Solution |
|---------|----------------|
| Slow task blocks API response | Offload to background worker |
| Spike in traffic overwhelms backend | Queue absorbs burst, workers process steadily |
| Service A needs to notify service B | A publishes message; B consumes when ready |
| Task must retry on failure | Requeue with backoff |
| Work must survive server restart | Messages persisted to disk |

## Core Concepts

| Term | Meaning |
|------|---------|
| **Producer** | Sends message to queue |
| **Consumer / Worker** | Reads and processes message |
| **Message** | Unit of work (JSON payload, event) |
| **Broker** | Queue server (RabbitMQ, Kafka, SQS) |
| **Topic** | Category of messages (Kafka) |
| **Dead Letter Queue (DLQ)** | Holds messages that failed too many times |

## How It Works

```
┌──────────┐     ┌─────────────┐     ┌──────────┐
│ Producer │────▶│    Queue    │────▶│ Consumer │
│ (API)    │     │  (Broker)   │     │ (Worker) │
└──────────┘     └─────────────┘     └──────────┘
                       │
                  persisted
                  (survives crash)
```

### Example Flow: Order Confirmation Email

```
1. User places order
2. API saves order to DB
3. API publishes: { "event": "order_created", "order_id": 123, "email": "alice@..." }
4. API returns 201 to user immediately
5. Email worker picks up message
6. Worker sends email via SendGrid
7. Worker acknowledges message (removed from queue)
```

User got instant response. Email arrives seconds later.

## Queue vs Direct API Call

| Direct Call | Queue |
|-------------|-------|
| Synchronous — caller waits | Asynchronous — caller moves on |
| Consumer must be up | Messages wait in queue |
| Failure = immediate error to caller | Failure = retry later |
| Tight coupling | Loose coupling |

## Types of Message Systems

### 1. Message Queue (Point-to-Point)

One consumer processes each message.

```
Producer → [Queue] → Worker 1 (gets message)
                   → Worker 2 (gets next message)
```

Use: task processing, job queues.

Examples: **AWS SQS**, **RabbitMQ** (queue mode), **Redis** (Lists / Streams).

### 2. Pub/Sub (Publish-Subscribe)

One message → many subscribers receive a copy.

```
Producer → [Topic: order_created]
              ├──▶ Email Service
              ├──▶ Inventory Service
              └──▶ Analytics Service
```

Use: event notification, multiple services reacting to same event.

Examples: **Kafka**, **RabbitMQ** (exchange), **Google Pub/Sub**, **Redis Pub/Sub**.

### 3. Stream (Log-Based)

Messages stored as an ordered log. Consumers read at their own pace.

```
Producer → [Kafka Topic] → Consumer A (offset 100)
                        → Consumer B (offset 85, catching up)
                        → Consumer C (replay from offset 0)
```

Use: event sourcing, analytics pipelines, high throughput.

Examples: **Apache Kafka**, **AWS Kinesis**, **Redis Streams**.

## Comparison

| Feature | SQS | RabbitMQ | Kafka |
|---------|-----|----------|-------|
| Model | Queue | Queue + Pub/Sub | Stream/log |
| Throughput | High | Medium | Very high |
| Ordering | FIFO option | Per queue | Per partition |
| Retention | 14 days max | Until consumed | Configurable (forever) |
| Replay | No | No | Yes |
| Complexity | Low (managed) | Medium | High |

## Common Patterns

### Task Queue

```
API enqueues: { "task": "resize_image", "url": "...", "sizes": [100, 400] }
Worker processes → uploads resized images → ack
```

### Event-Driven Architecture

```
Order Service publishes "order_placed"
  → Inventory Service decrements stock
  → Notification Service sends email
  → Analytics Service records event
```

### Retry with Backoff

```
Attempt 1 → fail → requeue, wait 5s
Attempt 2 → fail → requeue, wait 30s
Attempt 3 → fail → move to Dead Letter Queue
Alert on-call: message in DLQ
```

### Rate Limiting via Queue

```
1000 signup requests/sec arrive
Queue holds them
Workers process at steady 100/sec
Downstream (DB, email API) not overwhelmed
```

## Message Design

```json
{
  "id": "msg-uuid-123",
  "type": "order_created",
  "timestamp": "2024-03-15T10:30:00Z",
  "payload": {
    "order_id": 456,
    "user_id": 789,
    "email": "alice@example.com"
  },
  "retry_count": 0
}
```

| Rule | Why |
|------|-----|
| Include unique message ID | Idempotency — detect duplicates |
| Include event type | Consumer knows how to route |
| Keep payload small | Large files → store in S3, pass URL |
| Version your schema | `type: "order_created_v2"` |

## Idempotency

Consumers may process the same message twice (retry, crash after process but before ack).

```
Bad:  process payment twice → double charge
Good: check idempotency key → already processed → skip
```

```
if already_processed(message.id):
    return ack
process(message)
mark_processed(message.id)
ack
```

## When to Use a Queue

| Scenario | Use Queue? |
|----------|------------|
| Send email after signup | Yes |
| Resize uploaded image | Yes |
| Process payment | Careful — need idempotency + DLQ |
| Read product list | No — synchronous, cache instead |
| Real-time chat message | Maybe — or WebSocket |
| Nightly report generation | Yes |

## Queue in the Full Stack

From [Day 4](../day-04/01-visit-website-scenario.md) — after order placement:

```
User → API (save order, enqueue event) → 201 OK
                    │
                    ▼
              [Message Queue]
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Email       Inventory   Analytics
    Worker      Worker      Worker
```

## Common Problems

| Problem | Fix |
|---------|-----|
| Messages piling up | Scale workers horizontally |
| Duplicate processing | Idempotency keys |
| Poison message (always fails) | DLQ + alert |
| Message order matters | Single partition / FIFO queue |
| Queue broker down | Clustered broker, persistence |

## Summary

A queue decouples producers from consumers — APIs respond fast while workers process tasks in the background. Use point-to-point queues for jobs, pub/sub for events, and Kafka-style streams for high throughput and replay. Always design consumers to be idempotent and route failures to a dead letter queue.

---

[Next: Microservices & Workers →](./08-microservices-and-workers.md)
