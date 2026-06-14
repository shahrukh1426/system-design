# Retry, DLQ, and Idempotency

[← Consumers and Scaling](./09-consumers-and-scaling.md) | [Day 8 Index](./README.md) | [Next: Queue Patterns →](./11-queue-patterns.md)

## Failures Are Normal

Transient failures — network blip, DB timeout, rate limit — should **retry**.  
Permanent failures — bad data, bug — should **stop retrying** and **alert**.

---

## Retry Strategy

```
Attempt 1 → fail (503 from email API)
Wait 5 s
Attempt 2 → fail
Wait 30 s
Attempt 3 → fail
Wait 2 min
Attempt 4 → fail → move to DLQ
```

### Exponential Backoff

```
delay = min(base * 2^attempt, max_delay) + jitter

attempt 0: 1 s
attempt 1: 2 s
attempt 2: 4 s
attempt 3: 8 s
...
cap at 5 min
```

**Jitter** randomizes delay — prevents all retries hitting API simultaneously (thundering herd).

### Retryable vs Non-Retryable Errors

| Retry | Don't Retry |
|-------|-------------|
| 503 Service Unavailable | 400 Bad Request |
| Timeout | Invalid JSON schema |
| Connection reset | Order not found (permanent) |
| 429 Rate limit (with backoff) | Authorization failure |

Non-retryable → DLQ immediately — save resources.

---

## Dead Letter Queue (DLQ)

Queue for messages that **failed max retries** or are **poison**.

```
Main Queue ──fail 5×──▶ Dead Letter Queue
                              │
                         alert on-call
                         manual inspect / fix / replay
```

| Purpose | Detail |
|---------|--------|
| Isolate poison messages | Don't block main queue |
| Debug | Inspect payload, stack trace |
| Replay | Fix bug → reprocess DLQ messages |
| Audit | Track failure patterns |

### SQS DLQ Setup

```
Main queue → redrive policy → maxReceiveCount: 5 → DLQ
CloudWatch alarm on DLQ depth > 0
```

### Kafka DLQ

No built-in DLQ — consumer catches exception → publish to `topic.dlq` manually.

---

## Idempotency

At-least-once delivery means **same message processed twice** must not double-charge, double-email, or double-decrement stock.

### Idempotency Key Pattern

```python
def handle_payment(message):
    key = message["payload"]["idempotency_key"]

    if db.exists("processed_keys", key):
        return ack  # already done

    charge_card(message)
    db.insert("processed_keys", key)
    ack
```

Store processed keys in DB with TTL or forever for financial ops.

### Natural Idempotency

Some operations are idempotent by nature:

```
SET status = 'SHIPPED' WHERE id = 123   → run twice, same result
DELETE WHERE id = 123                   → second delete no-op
```

Prefer idempotent SQL over fragile "check then act."

### Idempotent API Calls

Pass idempotency key to external APIs (Stripe, etc.):

```
POST /charges
Idempotency-Key: order-456-payment
→ Stripe returns same charge if retried
```

---

## Dedup at Broker Level

| Mechanism | Scope |
|-----------|-------|
| SQS FIFO deduplication ID | 5-minute window |
| Kafka idempotent producer | Per producer session |
| Message ID in dedup table | Application-level |

Broker dedup reduces duplicates — **does not replace** consumer idempotency.

---

## Processing Flow with All Three

```
Receive message
  │
  ├─ already processed (idempotency check)? → ack, skip
  │
  ├─ process
  │     ├─ success → mark processed → ack
  │     ├─ retryable error → nack / visibility timeout → retry with backoff
  │     └─ non-retryable OR max retries → DLQ → alert
```

---

## DLQ Replay

After fixing bug or downstream outage:

```
1. Inspect DLQ messages
2. Fix root cause
3. Replay: move messages back to main queue (or republish)
4. Monitor for re-failure
```

Automate replay tooling — manual CLI doesn't scale.

---

## Summary

**Retry** with exponential backoff and jitter for transient failures. **DLQ** isolates poison messages — always alert on DLQ depth. **Idempotency** makes at-least-once safe — store processed keys, use natural idempotent operations, pass keys to external APIs.

---

[Next: Queue Patterns →](./11-queue-patterns.md)
