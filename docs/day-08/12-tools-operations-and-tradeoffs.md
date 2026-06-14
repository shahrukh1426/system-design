# Tools, Operations, and Trade-offs

[← Queue Patterns](./11-queue-patterns.md) | [Day 8 Index](./README.md)

## Tool Comparison

| Tool | Model | Best For | Managed Option |
|------|-------|----------|----------------|
| **AWS SQS** | Queue | Simple task queues, AWS apps | Fully managed |
| **AWS SNS** | Pub/Sub | Fan-out to many queues/Lambda | Fully managed |
| **RabbitMQ** | Queue + exchanges | Flexible routing, classic MQ | Amazon MQ, CloudAMQP |
| **Apache Kafka** | Stream | High throughput, replay, event platform | MSK, Confluent Cloud |
| **Google Pub/Sub** | Pub/Sub | GCP microservices | Fully managed |
| **Redis Streams** | Stream (light) | Existing Redis, moderate throughput | ElastiCache |
| **NATS / JetStream** | Pub/Sub + stream | Low latency, cloud-native | NATS cloud |
| **Celery** | Task framework | Python background jobs | Self-hosted workers |

---

## AWS SQS

```
Standard queue:  high throughput, at-least-once, best-effort order
FIFO queue:      strict order per group, exactly-once processing (dedup)
```

| Pros | Cons |
|------|------|
| No ops, multi-AZ | 256 KB message limit |
| DLQ built-in | No replay (consumed = gone) |
| Scales automatically | Visibility timeout tuning needed |

**Pair with SNS** for fan-out: `SNS → SQS → Lambda/EC2 workers`

---

## RabbitMQ

```
Producer → Exchange → (bindings) → Queue → Consumer
```

| Pros | Cons |
|------|------|
| Flexible routing (direct, fanout, topic) | Operate cluster yourself |
| Mature, well documented | Not a replay log |
| Good for task queues | Throughput lower than Kafka |

**Use when:** complex routing, moderate volume, AMQP ecosystem.

---

## Apache Kafka

```
Producer → Topic (partitions) → Consumer groups
Retention: days to forever
```

| Pros | Cons |
|------|------|
| Massive throughput | Operational complexity |
| Replay from any offset | Overkill for simple job queue |
| Stream processing (Kafka Streams, Flink) | Partition planning required |
| Ecosystem (Schema Registry, Connect) | |

**Use when:** event platform, analytics, CDC, multiple consumers at scale, replay.

**Avoid when:** simple email queue — SQS is simpler.

---

## Redis (Lists / Streams)

```
Lists:  LPUSH + BRPOP — simple task queue
Streams: XADD + XREADGROUP — consumer groups, ack
Pub/Sub: fire-and-forget — no persistence
```

| Pros | Cons |
|------|------|
| Already have Redis for cache | Memory-bound |
| Very fast | Not ideal primary broker at huge scale |
| Streams add consumer groups | Durability depends on AOF/RDB config |

**Use when:** small-medium workloads, dual-use with cache.

---

## When to Use a Queue

| Scenario | Use Queue |
|----------|-----------|
| Send email/SMS after user action | Yes |
| Process upload (transcode, thumbnail) | Yes |
| Decouple microservices | Yes |
| Absorb traffic spike | Yes |
| Nightly batch report | Yes |
| User needs immediate read response | No — sync + cache |
| Strong consistency in same request | No — sync transaction |
| Real-time chat (sub-100 ms) | WebSocket, not queue |

---

## When NOT to Use a Queue

| Situation | Why |
|-----------|-----|
| Simple CRUD with fast DB | Unnecessary complexity |
| User waiting for result | Sync API |
| Guaranteed immediate delivery required | Queue adds latency |
| Tiny app, low traffic | Direct call is fine |
| Ordering + exactly-once + simple ops | Hard — may need sync |

---

## Operational Metrics

| Metric | Meaning | Alert |
|--------|---------|-------|
| **Queue depth** | Messages waiting | Sustained growth |
| **Consumer lag** | Offset behind latest (Kafka) | Lag > threshold |
| **Age of oldest message** | Stuck messages | > SLA (e.g. 1 hour) |
| **Process rate** | msgs/sec consumed | Drop vs publish rate |
| **Error rate** | Failed processing | Spike |
| **DLQ depth** | Poison messages | Any message > 0 |
| **Publish rate** | msgs/sec in | Baseline for capacity |

```
Healthy:  publish rate ≈ consume rate, depth stable near zero
Unhealthy: depth ↗️ continuously, lag ↗️, DLQ ↗️
```

---

## Common Production Problems

| Problem | Symptom | Fix |
|---------|---------|-----|
| **Consumer lag** | Events hours behind | Scale consumers, optimize handler |
| **Queue backlog** | Depth in millions | Scale workers, throttle producer |
| **Poison message** | One msg retries forever | DLQ + max receive count |
| **Duplicate processing** | Double charge | Idempotency keys |
| **Lost messages** | Work never done | Enable persistence, ack after process |
| **Hot partition** | One Kafka partition overloaded | Better partition key |
| **Broker outage** | Publish fails | HA cluster, multi-AZ, retry producer |

---

## Queue vs Kafka Decision Tree

```
Need message replay?
  YES → Kafka (or Kinesis, Pulsar)
  NO  ↓

Need fan-out to many services with routing?
  YES → SNS, RabbitMQ exchange, Kafka
  NO  ↓

Simple job queue, AWS stack?
  YES → SQS + Lambda/ECS
  NO  ↓

Already running Redis, moderate load?
  YES → Redis Streams
  NO  → RabbitMQ or managed Kafka
```

---

## Security

| Concern | Practice |
|---------|----------|
| Auth | IAM roles (SQS), SASL (Kafka), TLS |
| Encryption | In transit (TLS) + at rest (KMS) |
| Least privilege | Producer can't consume, consumer can't publish |
| PII in messages | Minimize, encrypt sensitive fields |

---

## Quick Reference

| Question | Answer |
|----------|--------|
| Default delivery? | At-least-once |
| Prevent duplicate effect? | Idempotent consumer |
| Failed messages? | Retry + DLQ |
| Scale processing? | Add consumers |
| Order per entity? | Partition key / FIFO group |
| DB + event atomic? | Outbox pattern |
| Simple AWS jobs? | SQS |
| Event platform? | Kafka |

---

## Summary

**SQS** for simple managed queues. **RabbitMQ** for flexible routing. **Kafka** for streams, replay, and scale. **Redis** for light workloads alongside cache. Monitor depth, lag, and DLQ. Design for at-least-once, idempotent consumers, and clear retry/DLQ policies.

---

[← Queue Patterns](./11-queue-patterns.md) | [Day 8 Index](./README.md)
