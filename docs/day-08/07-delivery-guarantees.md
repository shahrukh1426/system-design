# Delivery Guarantees

[← Message Design](./06-message-design.md) | [Day 8 Index](./README.md) | [Next: Ordering and Partitioning →](./08-ordering-and-partitioning.md)

## The Problem

Network failures, crashes, and retries mean messages may be **lost**, **duplicated**, or **processed twice**.

Delivery guarantees define what the system promises.

---

## Three Guarantees

| Guarantee | Meaning | Message fate |
|-----------|---------|--------------|
| **At-most-once** | Deliver zero or one time | May **lose** message, never duplicate |
| **At-least-once** | Deliver one or more times | Never lost (if ack rules followed), may **duplicate** |
| **Exactly-once** | Deliver and process exactly once | Ideal — hard in distributed systems |

---

## At-Most-Once

Fire and forget. No retry on failure.

```
Producer sends → broker receives → consumer processes
Consumer crashes mid-process → message gone (already acked or not persisted)
```

| Pros | Cons |
|------|------|
| Simplest | Message loss |
| Fastest | Unacceptable for payments, orders |

**Use for:** metrics, non-critical logs, lossy telemetry.

---

## At-Least-Once (Most Common)

Broker redelivers until consumer **acks**. Consumer may crash after processing but before ack → **duplicate delivery**.

```
1. Consumer receives msg
2. Consumer processes (charges card)
3. Consumer crashes before ack
4. Broker redelivers same msg
5. Consumer processes again → duplicate charge risk
```

**Fix:** idempotent consumer — detect duplicate `message_id`, skip if already processed.

| Pros | Cons |
|------|------|
| No message loss | Duplicates possible |
| Industry default | Must design idempotency |

**Use for:** email, inventory, most business workflows.

---

## Exactly-Once

Message processed **exactly one time** — no loss, no duplicate effect.

True end-to-end exactly-once is **very hard** across services and databases.

### Exactly-Once Semantics (Practical)

Usually means: **exactly-once processing effect** — achieved by combining:

```
At-least-once delivery
  + idempotent consumer
  + transactional offset commit (Kafka)
  + dedup store
  = effectively exactly-once business outcome
```

### Kafka Transactions (Idempotent Producer + Transactions)

```
Producer sends with idempotent flag → broker dedupes within session
Transactional produce + consume → offset commit atomic with output
```

Still requires consumer side care for external writes (DB, API).

### Outbox Pattern

```
BEGIN DB TRANSACTION
  UPDATE orders SET status = 'PAID'
  INSERT INTO outbox (event payload)
COMMIT

Separate process reads outbox → publishes to queue → marks sent
```

DB and event publish stay consistent — no "paid in DB but event never sent."

---

## Producer Acknowledgments

| Setting | Behavior |
|---------|----------|
| `acks=0` | Producer doesn't wait — at-most-once risk |
| `acks=1` | Leader ack — may lose if leader dies before replicate |
| `acks=all` | All replicas ack — strongest durability |

---

## Consumer Ack Timing

| Strategy | Risk |
|----------|------|
| **Ack before process** | Lose message if crash during process (at-most-once effect) |
| **Ack after process** | Duplicate if crash after process before ack (at-least-once) |
| **Ack after process + idempotency** | Safe at-least-once |

**Always ack after successful processing** + idempotency for at-least-once systems.

---

## Comparison Table

| Guarantee | Loss | Duplicate | Complexity | Typical use |
|-----------|------|-----------|------------|-------------|
| At-most-once | Yes | No | Low | Metrics |
| At-least-once | No | Yes | Medium | Most apps |
| Exactly-once | No | No | High | Kafka streams, billing |

---

## What to Say in System Design Interviews

```
"We use at-least-once delivery with idempotent consumers.
 Payment worker checks idempotency_key before charging.
 Offsets committed after DB write succeeds.
 For order state, we use the outbox pattern."
```

Honesty about at-least-once + idempotency beats claiming naive exactly-once.

---

## Summary

**At-most-once:** may lose messages. **At-least-once:** default — may duplicate, requires idempotent consumers. **Exactly-once:** ideal but implemented via at-least-once + dedup + transactions + outbox. Design for at-least-once unless data is truly loss-tolerant.

---

[Next: Ordering and Partitioning →](./08-ordering-and-partitioning.md)
