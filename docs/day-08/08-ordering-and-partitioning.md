# Ordering and Partitioning

[← Delivery Guarantees](./07-delivery-guarantees.md) | [Day 8 Index](./README.md) | [Next: Consumers and Scaling →](./09-consumers-and-scaling.md)

## Does Order Matter?

Sometimes messages must be processed **in sequence**.

```
Order events for same order_id:
  1. OrderCreated
  2. PaymentCaptured
  3. OrderShipped

Processing Shipped before PaymentCaptured → invalid state
```

Other times order doesn't matter — welcome emails, analytics events.

---

## Global Ordering vs Partial Ordering

| Type | Scope | Cost |
|------|-------|------|
| **Global order** | All messages worldwide in sequence | Single partition — limits throughput |
| **Partial order** | Order within a key (e.g. order_id) | Multiple partitions — scalable |

**System design default:** partial ordering by business key — not global.

---

## FIFO Queues

**First In, First Out** — strict order of delivery.

```
AWS SQS FIFO: message group ID + deduplication ID
RabbitMQ: single consumer on queue (no scale) or consistent hash
Kafka: single partition (bottleneck) or partition by key
```

| Approach | Throughput |
|----------|------------|
| Single queue, single consumer | Low — one thread |
| FIFO with message groups | Medium — parallel across groups |
| Partition by key | High — order per key only |

---

## Partition Key Strategy

Route related messages to same partition for ordering.

```
partition_key = order_id

order_id=123:  Created → Paid → Shipped  (same partition, ordered)
order_id=456:  Created → Paid           (different partition, parallel)
```

```python
producer.send(
    topic="order.events",
    key=str(order_id).encode(),   # partition key
    value=event_json
)
```

**Choose key wisely:**
- `order_id` — order events ordered ✓
- `user_id` — user events ordered ✓
- `timestamp` — bad — hot partition on current second ✗
- `country` — bad — skew (US dominates) ✗

---

## Ordering vs Parallelism Trade-off

```
1 partition:
  ✓ strict global order for topic
  ✗ max throughput = one consumer

100 partitions:
  ✓ 100× parallel consumers
  ✗ order only within same partition key
```

Kafka max useful consumers in a group ≈ partition count.

---

## Out-of-Order Scenarios

Even with partitions, order can break:

| Cause | Fix |
|-------|-----|
| Retry delivers old message after new | Version number in message — ignore stale |
| Multiple producers same key | Sequence number — reject out-of-order |
| Consumer parallel threads | One thread per partition |
| Clock skew on timestamps | Don't rely on timestamp for order |

```json
{
  "order_id": 123,
  "sequence": 3,
  "event_type": "order.shipped"
}

if incoming.sequence <= last_processed.sequence:
    skip  # stale
```

---

## SQS FIFO Specifics

```
MessageGroupId:  order-123     → order preserved within group
MessageDeduplicationId: uuid   → 5-min dedup window

Different MessageGroupId → processed in parallel
Same MessageGroupId → strict FIFO
```

---

## When Ordering Is Required

| Domain | Ordering need |
|--------|-----------------|
| Bank account ledger | Strict per account |
| Order state machine | Strict per order_id |
| Chat messages | Strict per conversation |
| Analytics click stream | Often no order |
| Email notifications | No order |

Don't pay ordering cost where unnecessary.

---

## Summary

Global ordering kills throughput — use **partition keys** for partial ordering (per order, per user). FIFO queues and Kafka partitions enforce sequence within a key. Add **sequence numbers** to handle retries and stale messages. Only require order where business logic demands it.

---

[Next: Consumers and Scaling →](./09-consumers-and-scaling.md)
