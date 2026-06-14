# Day 8 — Message Queues (Deep Dive)

Message queues decouple services, absorb traffic spikes, and move slow work off the request path. This day covers everything a system designer needs: models, guarantees, patterns, tools, and failure modes.

See also: [Day 5: Queue](../day-05/07-queue.md) for a shorter overview.

## Topics

| # | Topic | File |
|---|-------|------|
| 1 | [Why Queues?](./01-why-queues.md) | Decoupling, async, scale |
| 2 | [What Is a Message Queue?](./02-what-is-a-message-queue.md) | Producer, consumer, broker |
| 3 | [Sync vs Async Communication](./03-sync-vs-async-communication.md) | Direct call vs queue |
| 4 | [Queue, Pub/Sub, and Streams](./04-queue-pubsub-and-streams.md) | Three messaging models |
| 5 | [Core Components](./05-core-components.md) | Broker, topic, partition, offset |
| 6 | [Message Design](./06-message-design.md) | Payload, schema, versioning |
| 7 | [Delivery Guarantees](./07-delivery-guarantees.md) | At-most-once, at-least-once, exactly-once |
| 8 | [Ordering and Partitioning](./08-ordering-and-partitioning.md) | FIFO, partition keys |
| 9 | [Consumers and Scaling](./09-consumers-and-scaling.md) | Worker pools, backpressure |
| 10 | [Retry, DLQ, and Idempotency](./10-retry-dlq-and-idempotency.md) | Failure handling |
| 11 | [Queue Patterns](./11-queue-patterns.md) | Task queue, outbox, saga, fan-out |
| 12 | [Tools, Operations, and Trade-offs](./12-tools-operations-and-tradeoffs.md) | SQS, Kafka, RabbitMQ, monitoring |

## Reading Order

Read 1 → 12 in sequence. Topics 4–7 define the model; 8–10 cover production behavior; 11–12 apply it in real systems.

## Key Takeaways

- Queues **decouple** producers from consumers in time and availability.
- Choose **queue vs pub/sub vs stream** based on one consumer, many subscribers, or replay needs.
- Most systems use **at-least-once delivery** — design **idempotent** consumers.
- **Ordering** costs throughput — partition only where order truly matters.
- **DLQ + retry + monitoring** are mandatory for production queues.

## Related

- [Day 5: Queue](../day-05/07-queue.md)
- [Day 5: Microservices & Workers](../day-05/08-microservices-and-workers.md)
- [Day 2: Reliability Design](../day-02/06-reliability-design.md)
- [Day 7: Cache Problems](../day-07/11-cache-problems.md) (similar failure thinking)
