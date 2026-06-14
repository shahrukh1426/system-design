# Queue, Pub/Sub, and Streams

[← Sync vs Async](./03-sync-vs-async-communication.md) | [Day 8 Index](./README.md) | [Next: Core Components →](./05-core-components.md)

## Three Messaging Models

System designers must distinguish these — they're not interchangeable.

| Model | Pattern | Analogy |
|-------|---------|---------|
| **Message Queue** | One message → one consumer | Task inbox — one person handles each task |
| **Pub/Sub** | One message → many subscribers | Radio broadcast — many listeners |
| **Event Stream** | Ordered log — many consumers at own pace | DVR recording — replay, rewind, multiple viewers |

---

## 1. Message Queue (Point-to-Point)

Each message processed by **exactly one** consumer (in a consumer group).

```
Producer → [Queue: orders] → Worker 1 gets msg A
                          → Worker 2 gets msg B
                          → Worker 3 gets msg C
```

**Use cases:**
- Background jobs (resize image, send email)
- Task distribution across worker pool
- Work that must happen once

**Examples:** AWS SQS, RabbitMQ queues, Redis Lists, Celery

```
Scale: add more workers → faster drain
```

---

## 2. Publish-Subscribe (Pub/Sub)

Publisher sends to a **topic**. All subscribers receive a **copy**.

```
Producer → [Topic: order_created]
              ├──▶ Email Service
              ├──▶ Inventory Service
              └──▶ Analytics Service
```

Each service runs independently. One fails — others continue.

**Use cases:**
- Event notification
- Microservices reacting to domain events
- Fan-out to multiple systems

**Examples:** Google Pub/Sub, RabbitMQ exchanges, Redis Pub/Sub, SNS

```
Note: Redis Pub/Sub is fire-and-forget — no persistence if subscriber offline
      Use Redis Streams or a broker with persistence for durability
```

---

## 3. Event Stream (Log-Based)

Messages appended to an **immutable log**. Consumers track **offset** (position).

```
Producer → [Topic Log]
           offset 0: order_created {id:1}
           offset 1: order_created {id:2}
           offset 2: payment_captured {id:1}
           
Consumer A: read offset 0 → 1 → 2 ...
Consumer B: read offset 0 ... (slower, catching up)
Consumer C: replay from offset 0 (rebuild database)
```

**Use cases:**
- High throughput event pipelines
- Analytics, CDC (change data capture)
- Event sourcing, audit trail
- Replay and reprocessing

**Examples:** Apache Kafka, AWS Kinesis, Redis Streams, Pulsar

| Queue | Stream |
|-------|--------|
| Message deleted after consume | Messages retained (configurable) |
| No replay | Replay from any offset |
| One consumer per message | Many consumer groups read same log |

---

## Visual Comparison

```
POINT-TO-POINT:
  P → [Q] → C1
         → C2  (competing — only one gets each msg)

PUB/SUB:
  P → [Topic] → Sub1
             → Sub2  (both get every msg)

STREAM:
  P → [Log: m1, m2, m3, ...]
         → Group A (offset 3)
         → Group B (offset 1)
```

---

## Feature Matrix

| Feature | Queue | Pub/Sub | Stream |
|---------|-------|---------|--------|
| One consumer per message | Yes | No (each sub gets copy) | Per consumer group |
| Multiple subscribers | No | Yes | Yes (consumer groups) |
| Message retention | Until consumed | Varies | Configurable (days/forever) |
| Replay | No | Usually no | Yes |
| Ordering | FIFO option | Not guaranteed | Per partition |
| Throughput | High | High | Very high |
| Complexity | Low | Medium | High |

---

## Choosing a Model

| Requirement | Choose |
|-------------|--------|
| Job queue, one worker per task | **Queue** |
| Notify 5 services on event | **Pub/Sub** |
| Analytics pipeline, replay | **Stream** |
| Audit log, event sourcing | **Stream** |
| Simple async email | **Queue** |
| Kafka for everything | Only if you need stream features |

---

## Kafka: Stream with Queue-Like Groups

Kafka is a stream, but **consumer groups** make it behave like a queue within a group.

```
Topic: orders (3 partitions)

Consumer Group "email-workers":
  Worker 1 ← partition 0
  Worker 2 ← partition 1
  Worker 3 ← partition 2
  → each message to one worker in group

Consumer Group "analytics":
  Separate offset — reads same events independently
```

One technology, two patterns — depending on consumer group design.

---

## Summary

**Queue:** one consumer per message — jobs and tasks. **Pub/Sub:** broadcast to many subscribers — events and fan-out. **Stream:** durable ordered log — replay, analytics, high throughput. Pick based on fan-out, retention, and replay needs — not hype.

---

[Next: Core Components →](./05-core-components.md)
