# Core Components

[← Queue, Pub/Sub, Streams](./04-queue-pubsub-and-streams.md) | [Day 8 Index](./README.md) | [Next: Message Design →](./06-message-design.md)

## Architecture Overview

```
┌────────────┐                    ┌─────────────────────────────────┐
│  Producer  │ ─── publish ──────▶│           Broker                  │
└────────────┘                    │  ┌─────────┐  ┌─────────────┐  │
                                  │  │ Topic   │  │ Partitions  │  │
┌────────────┐                    │  └─────────┘  └─────────────┘  │
│  Consumer  │ ◀── consume ───────│  ┌─────────┐  ┌─────────────┐  │
└────────────┘                    │  │ Offsets │  │ Replication │  │
                                  │  └─────────┘  └─────────────┘  │
                                  └─────────────────────────────────┘
```

---

## Broker

The **message broker** is the server that receives, stores, and delivers messages.

| Responsibility | Detail |
|----------------|--------|
| Accept publishes | From producers |
| Persist messages | Memory + disk (durability config) |
| Route | To correct queue, topic, partition |
| Deliver | To consumers (push or pull) |
| Ack handling | Delete or commit offset |
| Retention | TTL, size limits, compaction |

**Examples:** Apache Kafka, RabbitMQ, AWS SQS/SNS, Google Pub/Sub, Redis, NATS, ActiveMQ

---

## Topic

A **topic** is a named channel or category of messages.

```
Topics:
  order.created
  user.signup
  payment.captured
  email.send
```

In Kafka and Pub/Sub, producers publish **to a topic**.  
In RabbitMQ, similar concept via **exchanges** routing to **queues**.

---

## Partition (Shard)

Large topics split into **partitions** for parallelism.

```
Topic: order.created (3 partitions)

Partition 0: [msg1, msg4, msg7, ...]
Partition 1: [msg2, msg5, msg8, ...]
Partition 2: [msg3, msg6, msg9, ...]
```

| Benefit | Detail |
|---------|--------|
| Parallel writes | Multiple brokers handle partitions |
| Parallel reads | One consumer per partition in group |
| Scale throughput | Add partitions (with planning) |

**Partition key:** messages with same key go to same partition → ordering within key.

```
partition = hash(order_id) % num_partitions
All events for order_id=123 → same partition → ordered
```

---

## Offset (Streams)

An **offset** is a position in the log — which message the consumer has read.

```
Log:     [0] [1] [2] [3] [4] [5]
Consumer offset: 3  → next read returns message at index 4
```

Consumer commits offset after processing. On restart, resume from last committed offset.

```
Process msg 4 → commit offset 4
Crash before commit → replay msg 4 (at-least-once)
```

---

## Consumer Group

A set of consumers that **cooperate** to consume a topic — each message to one member.

```
Topic (4 partitions) + Consumer Group "workers" (4 consumers):

  P0 → Consumer A
  P1 → Consumer B
  P2 → Consumer C
  P3 → Consumer D

Add 5th consumer → one idle (max consumers = partition count for full parallelism)
```

Different consumer groups read independently — analytics and email both consume `order.created`.

---

## Exchange and Binding (RabbitMQ)

RabbitMQ adds routing layer between producer and queue.

```
Producer → Exchange → (binding rules) → Queue(s) → Consumer

Exchange types:
  direct   → route by routing key (exact match)
  fanout   → broadcast to all bound queues
  topic    → pattern match (order.*)
  headers  → match message headers
```

---

## Visibility Timeout (SQS)

After delivery, message **hidden** for N seconds. If not deleted (acked), reappears for retry.

```
Deliver msg → invisible 30 s
  → consumer processes + deletes → gone
  → consumer crashes → after 30 s → visible again → retry
```

---

## Message Metadata (Broker-Managed)

| Field | Purpose |
|-------|---------|
| Message ID | Unique identifier |
| Timestamp | When published |
| Headers / attributes | Routing, filtering, trace IDs |
| Delivery count | Retry attempts |
| Correlation ID | Link request-reply |
| Dead letter reason | Why moved to DLQ |

---

## High Availability

Production brokers replicate data across nodes.

```
Kafka:  replication factor 3 — each partition on 3 brokers
RabbitMQ: mirrored queues — queue state on multiple nodes
SQS: managed multi-AZ — AWS handles HA
```

Plan for broker failure — consumers reconnect, unacked messages redelivered.

---

## Summary

The broker stores and routes messages. **Topics** categorize, **partitions** scale throughput, **offsets** track stream progress, **consumer groups** distribute work. Know your broker's routing model — exchange/queue (RabbitMQ) vs topic/partition (Kafka) vs simple queue (SQS).

---

[Next: Message Design →](./06-message-design.md)
