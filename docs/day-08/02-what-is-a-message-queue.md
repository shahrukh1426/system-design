# What Is a Message Queue?

[← Why Queues](./01-why-queues.md) | [Day 8 Index](./README.md) | [Next: Sync vs Async →](./03-sync-vs-async-communication.md)

## Definition

A **message queue** is middleware that stores messages from **producers** until **consumers** are ready to process them.

```
Producer  →  [Message Queue / Broker]  →  Consumer
  (send)         (buffer + persist)         (receive + process)
```

The queue is a **buffer** — it decouples when work is created from when work is done.

---

## Key Terminology

| Term | Definition |
|------|------------|
| **Producer / Publisher** | Sends messages to the queue or topic |
| **Consumer / Subscriber / Worker** | Receives and processes messages |
| **Message** | Unit of data — payload + metadata |
| **Broker** | Server that stores and routes messages (Kafka, RabbitMQ, SQS) |
| **Queue** | Destination where messages wait for one consumer |
| **Topic** | Category or channel (especially in pub/sub and Kafka) |
| **Acknowledgment (ack)** | Consumer confirms successful processing — message removed |
| **Visibility timeout** | Time message is hidden after delivery (SQS) — for retry if no ack |

---

## Anatomy of the Flow

```
1. Producer serializes message (JSON, Avro, Protobuf)
2. Producer sends to broker
3. Broker persists message (optional but common)
4. Broker acks producer
5. Consumer polls or is pushed message
6. Consumer processes business logic
7. Consumer acks → broker deletes or commits offset
```

```
┌──────────┐     publish      ┌─────────────┐     consume     ┌──────────┐
│ Producer │ ───────────────▶ │   Broker    │ ──────────────▶ │ Consumer │
│  (API)   │                  │  (Redis,    │                 │ (Worker) │
└──────────┘                  │   Kafka)    │                 └──────────┘
                              └─────────────┘
                                    │
                               disk / memory
```

---

## Queue vs Database Table as "Queue"

| | Message Queue | DB Table as Queue |
|---|---------------|-------------------|
| Purpose | Move work between services | General storage |
| Consumption | Pop / ack / offset | SELECT + UPDATE status |
| Retention | Hours to days (typical) | Until deleted |
| Throughput | Optimized for high ingest | Lower for queue pattern |
| Delivery semantics | Built-in retry, DLQ | You build it yourself |

Don't use a DB table as a queue at scale unless traffic is tiny. Use SQS, RabbitMQ, Kafka, or Redis Streams.

---

## Push vs Pull Consumption

### Pull (Poll)

Consumer asks broker for messages.

```
while True:
    messages = broker.poll(timeout=1s)
    for msg in messages:
        process(msg)
        broker.ack(msg)
```

Used by: SQS, Kafka consumers, most workers.

### Push

Broker delivers to consumer (callback, webhook, subscription).

```
broker.on_message(lambda msg: process(msg))
```

Used by: RabbitMQ (push to consumer), WebSocket, some managed services.

Pull gives consumers control over pace (backpressure). Push can overwhelm slow consumers without flow control.

---

## Message Lifecycle

```
CREATED → QUEUED → IN_FLIGHT → PROCESSED (deleted)
                      │
                      └── fail / timeout → QUEUED (retry) or DLQ
```

| State | Meaning |
|-------|---------|
| **Queued** | Waiting for consumer |
| **In flight** | Delivered, awaiting ack |
| **Processed** | Acked, removed from queue |
| **Dead letter** | Failed max retries, moved to DLQ |

---

## Is a Queue a Database?

No. A queue is **transient work storage**, not the system of record.

```
Order in PostgreSQL  →  source of truth (forever)
"order_created" msg  →  notification to process side effects (temporary)
```

If the queue loses a message (misconfiguration), you recover from DB state or replay events — not the other way around.

---

## Summary

A message queue buffers messages between producers and consumers. Know the roles — producer, broker, consumer, ack — and the lifecycle from publish to process or dead letter. Queues move work; databases store truth.

---

[Next: Sync vs Async Communication →](./03-sync-vs-async-communication.md)
