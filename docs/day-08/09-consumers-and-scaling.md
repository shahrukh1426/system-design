# Consumers and Scaling

[← Ordering and Partitioning](./08-ordering-and-partitioning.md) | [Day 8 Index](./README.md) | [Next: Retry, DLQ, Idempotency →](./10-retry-dlq-and-idempotency.md)

## Consumer Role

A **consumer** (worker) pulls messages from the broker, executes business logic, and acknowledges completion.

```
poll → deserialize → validate → process → ack/fail
```

Consumers are typically **stateless** — scale by adding instances.

---

## Competing Consumers

Multiple workers share one queue — each message to one worker.

```
                    ┌─────────────┐
                    │    Queue    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
      Worker 1         Worker 2         Worker 3
```

```
Queue depth: 10,000 messages
Workers: 3 → ~3,333 each
Add 7 workers → 10 total → ~5× faster drain
```

**Scale horizontally** until queue depth stabilizes or downstream bottleneck hit.

---

## Consumer Groups (Kafka)

Consumers in same **group** divide partitions. Different **groups** read independently.

```
Topic: events (6 partitions)

Group "email":
  6 consumers → 1 partition each → full parallelism

Group "analytics":
  3 consumers → 2 partitions each → still processes all events

Group "email" + Group "analytics" = both get all events, different purpose
```

**Rule:** max parallel consumers in group = partition count (extra consumers idle).

---

## Scaling Workers

| Signal | Action |
|--------|--------|
| Queue depth growing | Add workers |
| Queue depth near zero | Remove workers (cost save) |
| Consumer CPU high | Scale out or optimize handler |
| Downstream DB slow | Fix bottleneck before adding workers |

### Auto-Scaling

```
CloudWatch / K8s HPA:
  metric: queue depth OR consumer lag
  scale up:   depth > 1000 for 5 min
  scale down: depth < 100 for 10 min
```

---

## Backpressure

When consumers can't keep up, pressure flows backward.

```
Slow consumer → messages pile up → queue full → producer blocked or drops
```

### Handling Backpressure

| Strategy | Detail |
|----------|--------|
| **Scale consumers** | More workers |
| **Throttle producers** | Rate limit publishes |
| **Drop low priority** | Sample analytics under load |
| **Block producer** | Kafka `max.block.ms` — producer waits |
| **Dead letter overflow** | Move old messages to cold storage |

Without backpressure, broker runs out of memory or producers fail silently.

---

## Prefetch and Batch Size

Consumers fetch multiple messages at once.

```
RabbitMQ prefetch=10  → 10 unacked messages per consumer
Kafka max.poll.records=500
```

| High prefetch | Low prefetch |
|---------------|--------------|
| Better throughput | Fairer distribution |
| One slow msg blocks slot | Slower consumer gets fewer msgs |

Tune for even worker utilization.

---

## Poison Message Handling

Message that **always fails** (bad JSON, invalid ID) blocks retry loop.

```
Process → fail → retry → fail → retry → infinite loop
```

**Fix:** max retry count → move to **DLQ** → alert team. See [10-retry-dlq-and-idempotency.md](./10-retry-dlq-and-idempotency.md).

---

## Consumer Design Checklist

- [ ] Idempotent handler
- [ ] Ack only after successful process
- [ ] Timeout on external calls
- [ ] Structured logging with message_id
- [ ] Graceful shutdown — finish in-flight, then stop poll
- [ ] Health check endpoint for orchestrator
- [ ] Metrics: process rate, error rate, lag

---

## Graceful Shutdown

```
1. Stop accepting new polls (SIGTERM)
2. Finish processing in-flight messages
3. Ack completed work
4. Commit offsets
5. Exit

K8s terminationGracePeriodSeconds must exceed max process time
```

Without graceful shutdown — messages reappear after visibility timeout (duplicate processing).

---

## Summary

Scale consumers horizontally to drain queue depth. Kafka consumer groups map partitions to workers. Implement **backpressure** when producers outpace consumers. Tune prefetch, handle poison messages via DLQ, and shut down gracefully to avoid duplicate work.

---

[Next: Retry, DLQ, and Idempotency →](./10-retry-dlq-and-idempotency.md)
