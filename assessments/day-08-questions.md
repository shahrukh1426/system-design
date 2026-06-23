# Message Queues Deep Dive — MCQ Questions (50)

Multi-select format: each question has **two or more** correct answers. Questions tagged **[Case Study]** include a business context block.

> **Answers and explanations:** see [answer-key/day-08-answers.md](./answer-key/day-08-answers.md)

---

### Q01 [Easy] [Case Study] — EventPipe Upload Acceptance

**Context:** EventPipe accepts 4K video uploads. Synchronous transcoding takes 8 minutes. Users timeout at 30 seconds. The API returns 504 errors.

**Select all that apply.**

Why should transcoding move to a queue?

- [ ] A. Decouple the HTTP response from slow background work — return quickly after enqueue
- [ ] B. Absorb upload spikes without blocking the request thread for minutes
- [ ] C. Queues replace PostgreSQL as the system of record for video metadata
- [ ] D. Failed transcode jobs can retry without the user re-uploading the file

---

### Q02 [Easy] — Message Queue Components

**Select all that apply.**

Which describe producer–broker–consumer architecture?

- [ ] A. Producer sends messages; broker buffers and persists; consumer pulls or receives push delivery
- [ ] B. Consumer acknowledges after processing — unacked messages may become visible again (visibility timeout)
- [ ] C. A message queue is the authoritative ledger for financial balances
- [ ] D. Pull-based consumption helps apply backpressure when consumers are slow

---

### Q03 [Easy] [Case Study] — EventPipe Checkout Hybrid

**Context:** EventPipe charges a credit card synchronously (~800 ms) but sends receipt email, updates analytics, and notifies webhooks asynchronously via SQS.

**Select all that apply.**

Which design rule does this follow?

- [ ] A. Sync for decisions the user must see in the HTTP response; async for reactions and side effects
- [ ] B. Hybrid architecture — not all-or-nothing async
- [ ] C. Every step including payment authorization should be fire-and-forget async
- [ ] D. Async side effects can retry independently when downstream email API is down

---

### Q04 [Easy] — Queue vs Pub/Sub vs Stream

**Select all that apply.**

Match the messaging model to the use case.

- [ ] A. Task queue — one job processed by exactly one worker in a consumer group (SQS, Celery)
- [ ] B. Pub/Sub — one event copied to all subscribers (SNS fan-out, RabbitMQ fanout exchange)
- [ ] C. Stream — immutable log with offsets; consumers replay from a position (Kafka)
- [ ] D. Redis Pub/Sub persists messages for offline subscribers automatically

---

### Q05 [Easy] [Case Study] — EventPipe Order Notifications

**Context:** EventPipe publishes `OrderCreated` once. Inventory, Billing, Email, and Analytics services each need a copy. One SQS queue would load-balance among them — each order handled by only one service.

**Select all that apply.**

Which model fits?

- [ ] A. Pub/Sub or SNS → multiple SQS queues — each subscriber gets every message
- [ ] B. Single task queue — wrong model when every downstream service must react
- [ ] C. Kafka topic with separate consumer groups per service
- [ ] D. Point-to-point queue delivers one copy split across competing consumers only

---

### Q06 [Easy] — Broker Core Components

**Select all that apply.**

Which Kafka/SQS concepts are correct?

- [ ] A. Topic categorizes messages; partition enables parallel throughput
- [ ] B. Consumer group members compete for partitions — max useful parallelism ≈ partition count
- [ ] C. Adding consumers beyond partition count increases throughput without limit
- [ ] D. Offset tracks position in a stream partition

---

### Q07 [Medium] [Case Study] — EventPipe Message Payload Size

**Context:** EventPipe embeds full 200 MB video files in Kafka messages. Broker rejects messages and consumers OOM.

**Select all that apply.**

What is sound message design?

- [ ] A. Store blob in S3; message carries `video_id` and `s3_key` reference only
- [ ] B. Keep payloads small (SQS max 256 KB); large assets referenced by URL/key
- [ ] C. Embed full database rows in every message for convenience
- [ ] D. Include `message_id`, `event_type`, `schema_version`, and `correlation_id` in envelope

---

### Q08 [Medium] — Commands vs Events

**Select all that apply.**

In microservices, why prefer domain events over command messages?

- [ ] A. Events (`OrderCreated`) decouple publisher from subscriber implementations
- [ ] B. Commands (`InventoryService.decrement`) create tight coupling to callee API
- [ ] C. Commands are always better for decoupling than events
- [ ] D. Subscribers choose whether to react to events — publisher does not orchestrate all steps

---

### Q09 [Medium] [Case Study] — EventPipe Duplicate Charge

**Context:** EventPipe payment worker uses at-least-once SQS delivery. A worker processes a charge, crashes before ack. Message redelivers and charges the customer twice.

**Select all that apply.**

How should EventPipe prevent duplicate financial effects?

- [ ] A. Idempotent consumer — check `idempotency_key` before charging
- [ ] B. Ack only after successful processing plus idempotency guard
- [ ] C. At-least-once delivery never produces duplicates without any application logic
- [ ] D. Practical exactly-once effect = at-least-once + idempotent handler + dedup store

---

### Q10 [Medium] — Delivery Guarantees

**Select all that apply.**

Which statements about delivery semantics are correct?

- [ ] A. At-most-once: may lose messages, no duplicates — ack before process risks loss on crash
- [ ] B. At-least-once: industry default — may duplicate without idempotency
- [ ] C. End-to-end exactly-once across services is trivial with broker settings alone
- [ ] D. Telemetry/metrics may tolerate at-most-once; payments need at-least-once + idempotency

---

### Q11 [Medium] [Case Study] — EventPipe Order State Machine

**Context:** Order events must apply in sequence: `Created → Paid → Shipped` per `order_id`. Events for different orders can process in parallel.

**Select all that apply.**

How should EventPipe partition?

- [ ] A. Partition key = `order_id` — same order routes to same partition for ordering
- [ ] B. Partition key = current timestamp — maximizes even distribution for order sequence
- [ ] C. Global ordering across all orders requires a single partition — limits throughput
- [ ] D. Use sequence numbers — skip events where `incoming.sequence <= last_processed`

---

### Q12 [Medium] — Bad Partition Keys

**Select all that apply.**

Which partition keys risk hot partitions or wrong ordering guarantees?

- [ ] A. `timestamp` or `created_second` — spikes on current second
- [ ] B. `country_code` alone — skewed traffic (e.g., US dominates)
- [ ] C. `order_id` or `user_id` — generally even hash distribution
- [ ] D. Random UUID per message when strict per-entity order is required

---

### Q13 [Medium] [Case Study] — EventPipe Consumer Lag

**Context:** EventPipe Kafka topic has 6 partitions. Email consumer group runs 8 pods. Two pods sit idle. Queue depth grows during a marketing blast.

**Select all that apply.**

What explains this and valid responses?

- [ ] A. Max parallel consumers in a group ≈ partition count — extras idle
- [ ] B. Scale consumers up to partition count or increase partitions (with rebalance cost)
- [ ] C. More consumers always help if downstream email API is the bottleneck
- [ ] D. Auto-scale on consumer lag or queue depth is a standard ops pattern

---

### Q14 [Medium] — Backpressure and Graceful Shutdown

**Select all that apply.**

Which practices protect queue consumers?

- [ ] A. Graceful shutdown: finish in-flight work, ack, commit offsets before exit
- [ ] B. K8s `terminationGracePeriodSeconds` must exceed max message processing time
- [ ] C. Instant pod kill without drain — messages reappear after visibility timeout → duplicates
- [ ] D. Unlimited prefetch always maximizes throughput without blocking slow messages

---

### Q15 [Hard] [Case Study] — EventPipe Poison Message

**Context:** One malformed JSON message fails parsing on every retry. It blocks the single-threaded consumer loop for 6 hours until ops intervenes.

**Select all that apply.**

What should EventPipe implement?

- [ ] A. Max retry count with exponential backoff + jitter, then route to DLQ
- [ ] B. Non-retryable errors (400, invalid schema) go to DLQ immediately
- [ ] C. Retry forever on all errors including bad payload
- [ ] D. Alert when DLQ depth > 0; inspect, fix, replay after correction

---

### Q16 [Hard] — Retry vs Non-Retryable Errors

**Select all that apply.**

Which errors should trigger retry with backoff?

- [ ] A. HTTP 503, connection timeout, transient 429 with Retry-After
- [ ] B. HTTP 400 bad request, invalid JSON payload, authentication failure
- [ ] C. Exponential backoff: `min(base * 2^attempt, max_delay) + jitter`
- [ ] D. Retry storms occur when many clients retry simultaneously without jitter

---

### Q17 [Hard] [Case Study] — EventPipe Outbox Pattern

**Context:** EventPipe saves an order to PostgreSQL but crashes before publishing `OrderCreated` to Kafka. Downstream inventory never decrements.

**Select all that apply.**

How does the transactional outbox fix this?

- [ ] A. INSERT order + INSERT outbox row in the same DB transaction
- [ ] B. Poller reads unsent outbox rows, publishes to broker, marks sent
- [ ] C. Requires two-phase commit between PostgreSQL and Kafka
- [ ] D. Atomic DB write guarantees event will eventually publish without dual-write race

---

### Q18 [Hard] — Saga Pattern

EventPipe order saga: ReserveInventory → ChargePayment → ConfirmShipment. Payment fails after inventory reserved.

**Select all that apply.**

Which saga behavior is correct?

- [ ] A. Publish compensating events: `ReleaseInventory`, `CancelOrder`
- [ ] B. Saga is not a single distributed ACID transaction across services
- [ ] C. Roll back with one global 2PC transaction across three microservice databases
- [ ] D. Each step is a local transaction; failure triggers compensation via events

---

### Q19 [Easy] — Sync vs Async Trade-offs

**Select all that apply.**

When is synchronous HTTP appropriate vs a queue?

- [ ] A. User needs payment result in the checkout HTTP response → sync
- [ ] B. Video transcode, analytics, email — async queue
- [ ] C. Async provides strong immediate consistency for the critical path
- [ ] D. Callee down: sync fails/timeouts; async messages buffer until consumer recovers

---

### Q20 [Easy] [Case Study] — EventPipe Black Friday Spike

**Context:** EventPipe ingests 12,000 webhook events/sec. Workers process 800/sec sustainably. API returns 200 immediately after enqueue.

**Select all that apply.**

What queue benefit applies?

- [ ] A. Spike absorption — broker buffers excess until workers catch up
- [ ] B. Decouples producer throughput from consumer capacity in time
- [ ] C. Queue eliminates need for any workers — messages process themselves
- [ ] D. Without queue, producers would block or drop work when workers saturate

---

### Q21 [Medium] — SQS Standard vs FIFO

**Select all that apply.**

Which SQS characteristics are correct?

- [ ] A. Standard queue: at-least-once, best-effort ordering, high throughput
- [ ] B. FIFO queue: strict order per MessageGroupId; built-in deduplication window (~5 min)
- [ ] C. FIFO guarantees global ordering across all messages in the account
- [ ] D. Standard queue: consumed message gone — no replay from broker

---

### Q22 [Medium] [Case Study] — EventPipe Fan-Out Architecture

**Context:** EventPipe uses SNS → three SQS queues (email, SMS, push). Email queue backs up; SMS and push remain healthy.

**Select all that apply.**

Why is this fan-out pattern valuable?

- [ ] A. Each downstream channel has independent retry, DLQ, and scaling
- [ ] B. One slow consumer does not block other channels
- [ ] C. Single shared queue would require one worker pool for all notification types
- [ ] D. SNS delivers the same event copy to each subscribed queue

---

### Q23 [Medium] — Kafka vs SQS Tool Selection

**Select all that apply.**

When choose Kafka over SQS for EventPipe?

- [ ] A. Need event replay, stream processing, or high-throughput log retention
- [ ] B. Simple fire-and-forget job queue with minimal ops — SQS often sufficient
- [ ] C. Kafka is always the right choice for a 50-email/day cron job
- [ ] D. Kafka consumer groups + partitions enable parallel stream processing at scale

---

### Q24 [Medium] — Monitoring Queue Health

**Select all that apply.**

Which metrics indicate queue problems?

- [ ] A. Queue depth / consumer lag growing while publish rate exceeds consume rate
- [ ] B. Oldest message age increasing — messages waiting too long
- [ ] C. DLQ depth > 0 — poison or repeated failures
- [ ] D. Depth near zero and publish ≈ consume rate — healthy steady state

---

### Q25 [Hard] [Case Study] — EventPipe Exactly-Once Claim

**Context:** A vendor claims their broker provides "exactly-once delivery" with no consumer changes. EventPipe processes payments.

**Select all that apply.**

What should EventPipe engineers respond?

- [ ] A. Interview/production answer: at-least-once delivery with idempotent consumers
- [ ] B. Broker dedup does not eliminate need for application idempotency on side effects
- [ ] C. Accept vendor claim and remove idempotency keys to simplify code
- [ ] D. Exactly-once end-to-end across DB + broker + external APIs is very hard in practice

---

### Q26 [Hard] — Idempotency Implementation

**Select all that apply.**

Which are valid idempotency techniques?

- [ ] A. Processed-keys table: skip if `message_id` already handled
- [ ] B. Natural idempotent SQL: `UPDATE status = 'SHIPPED' WHERE id = ?` — same result if run twice
- [ ] C. External API idempotency header (e.g., Stripe Idempotency-Key)
- [ ] D. Ack before process guarantees at-least-once without duplicates

---

### Q27 [Easy] — Why Not a Database Table as Queue

**Select all that apply.**

Why avoid `SELECT ... FOR UPDATE` on a jobs table at high scale?

- [ ] A. DIY polling, visibility, retry, and DLQ semantics are complex and slow at volume
- [ ] B. Dedicated brokers (SQS, Kafka, RabbitMQ) optimize for messaging throughput and ops
- [ ] C. DB table as queue is always faster than Kafka for 100K msg/sec
- [ ] D. Row locking under high concurrency becomes a database bottleneck

---

### Q28 [Medium] [Case Study] — EventPipe CDC Pipeline

**Context:** EventPipe search index must update when PostgreSQL rows change. Debezium captures WAL → Kafka → search indexer consumer.

**Select all that apply.**

What pattern is this?

- [ ] A. Change Data Capture (CDC) — database changes streamed as events
- [ ] B. Decouples search indexing from application write path
- [ ] C. Application must call search API synchronously on every INSERT
- [ ] D. Stream replay can rebuild search index from Kafka offsets after failure

---

### Q29 [Hard] — Redis Pub/Sub vs Redis Streams

**Select all that apply.**

Which statements are correct?

- [ ] A. Redis Pub/Sub: fire-and-forget — offline subscriber misses messages
- [ ] B. Redis Streams: persisted log with consumer groups — closer to lightweight Kafka
- [ ] C. Redis Pub/Sub is a durable primary broker for payment events
- [ ] D. Use persistent broker or Redis Streams when durability matters

---

### Q30 [Hard] [Case Study] — EventPipe Delayed Reminder

**Context:** EventPipe sends "complete your profile" email 15 minutes after signup. Workers should not process the job immediately.

**Select all that apply.**

Which delivery options apply?

- [ ] A. SQS DelaySeconds (up to 15 minutes) or visibility timeout scheduling
- [ ] B. RabbitMQ message TTL + dead-letter exchange for delayed delivery patterns
- [ ] C. Real-time sub-100 ms chat must use the same queue with DelaySeconds
- [ ] D. Delay queue separates immediate tasks from scheduled follow-ups

---

### Q31 [Easy] [Case Study] — EventPipe Schema Breaking Change

**Context:** EventPipe producers add a required JSON field. Old consumers crash on deserialize during a rolling deploy.

**Select all that apply.**

How should EventPipe evolve message schemas safely?

- [ ] A. Include `schema_version` in the message envelope
- [ ] B. Prefer backward-compatible evolution — add optional fields before making them required
- [ ] C. Remove required fields from producers before any consumer is updated
- [ ] D. Use schema registry or contract tests between producer and consumer teams

---

### Q32 [Easy] — Priority and Multiple Queues

**Select all that apply.**

EventPipe must process urgent fraud alerts before bulk analytics jobs.

- [ ] A. Separate queues for high- vs low-priority work with dedicated worker pools
- [ ] B. Priority design prevents low-priority backlog from starving urgent jobs when pools are isolated
- [ ] C. One shared FIFO queue automatically prioritizes urgent messages without configuration
- [ ] D. SQS has no native priority — multiple queues or routing patterns are common

---

### Q33 [Easy] [Case Study] — EventPipe Webhook Replay Request

**Context:** A partner missed 3 hours of webhooks during an outage and requests redelivery of those events.

**Select all that apply.**

What enables replay and what are limitations?

- [ ] A. Kafka retained log allows replay from offset or timestamp within retention
- [ ] B. SQS Standard removes messages after consume — broker replay of consumed messages is not available
- [ ] C. Retention policy determines how far back historical replay is possible
- [ ] D. Design durable event logs when business partners require historical redelivery

---

### Q34 [Easy] — Message Ordering Trade-offs

**Select all that apply.**

Which statements about ordering guarantees are correct?

- [ ] A. Strict global ordering limits throughput to a single partition consumer
- [ ] B. Per-entity ordering via partition key is a common compromise
- [ ] C. Ordering guarantees are free — no throughput or design trade-off
- [ ] D. Out-of-order retries require idempotent handlers or sequence/state guards

---

### Q35 [Easy] [Case Study] — EventPipe Visibility Timeout Too Short

**Context:** EventPipe's consumer fetches 100 messages and processes the batch for 60 seconds. SQS visibility timeout is 30 seconds — messages become visible again mid-processing.

**Select all that apply.**

What went wrong and what should change?

- [ ] A. Visibility timeout must exceed max processing time with safety buffer
- [ ] B. Extend visibility heartbeat during long-running processing
- [ ] C. Shorter visibility timeout always improves throughput without duplicate risk
- [ ] D. Reduce batch size or process serially when timeout cannot be raised safely

---

### Q36 [Easy] — RabbitMQ Exchange Routing

**Select all that apply.**

Which RabbitMQ exchange behaviors are correct?

- [ ] A. Direct exchange routes by exact routing key match
- [ ] B. Topic exchange supports pattern-based routing keys
- [ ] C. Fanout exchange delivers a copy to every bound queue
- [ ] D. All RabbitMQ queues behave identically to Kafka topic partitions

---

### Q37 [Medium] [Case Study] — EventPipe Shared Queue Mistake

**Context:** Email and inventory workers accidentally share one SQS task queue. Inventory workers consume half the messages meant for email.

**Select all that apply.**

What model error occurred?

- [ ] A. Task queues load-balance — each message goes to exactly one competing consumer
- [ ] B. Separate downstream services need separate queues or explicit routing
- [ ] C. Adding more service types to one task queue fan-outs each message to all services
- [ ] D. Pub/sub or SNS fan-out is appropriate when every subscriber must receive every event

---

### Q38 [Medium] — Saga Choreography vs Orchestration

**Select all that apply.**

EventPipe's order flow can be implemented as a saga. Which comparisons are correct?

- [ ] A. Choreography: services react to events without a central coordinator
- [ ] B. Orchestration: a saga coordinator directs step order and compensation
- [ ] C. Choreography eliminates the need for idempotent consumers
- [ ] D. EventPipe can implement sagas with either style depending on complexity

---

### Q39 [Medium] [Case Study] — EventPipe Rebalance Storm

**Context:** EventPipe deploys 10 new Kafka consumers at once. Cooperative rebalance pauses processing for 45 seconds and lag spikes.

**Select all that apply.**

What explains this and what reduces impact?

- [ ] A. Consumer group rebalance reassigns partitions — processing pauses during transition
- [ ] B. Frequent scale churn causes rebalance storms — limit rapid consumer add/remove
- [ ] C. Adding consumers never causes rebalance overhead or partition movement
- [ ] D. Sticky assignment and incremental cooperative rebalance reduce partition churn

---

### Q40 [Medium] — Dead Letter Queue Operations

**Select all that apply.**

Which DLQ operational practices are correct?

- [ ] A. DLQ depth > 0 should trigger alerts and triage workflow
- [ ] B. Replay to main queue after fix requires idempotent consumers
- [ ] C. DLQ is append-only — messages can never be reprocessed
- [ ] D. Store failure reason and original envelope metadata for debugging

---

### Q41 [Medium] [Case Study] — EventPipe Out-of-Order Events

**Context:** `OrderPaid` arrives before `OrderCreated` due to retry reordering. Inventory worker deducts stock for a nonexistent order.

**Select all that apply.**

How should EventPipe handle this?

- [ ] A. Validate state transitions — reject or defer out-of-order events
- [ ] B. Track last processed sequence or enforce an order state machine
- [ ] C. At-least-once delivery guarantees perfect causal ordering without application logic
- [ ] D. Idempotent create plus state machine guards handle retries and ordering gaps

---

### Q42 [Medium] — Task Queue Worker Semantics

**Select all that apply.**

Which statements about broker-backed task queues (e.g., Celery, SQS workers) are correct?

- [ ] A. Ack-after-success enables retry when processing fails before acknowledgment
- [ ] B. Result backend is optional for fire-and-forget background jobs
- [ ] C. Task queues replace the need for database transactions on the critical path
- [ ] D. Visibility timeout semantics are analogous to lease time before redelivery

---

### Q43 [Medium] [Case Study] — EventPipe Publish-Before-Commit

**Context:** EventPipe publishes `OrderCreated` to Kafka, then crashes before the PostgreSQL transaction commits. Downstream inventory decrements for an order that does not exist.

**Select all that apply.**

What design flaw is this and how to fix it?

- [ ] A. Dual-write without coordination risks inconsistency between DB and broker
- [ ] B. Transactional outbox aligns committed business state with eventual publish
- [ ] C. Publish-first is safer than outbox for financial order workflows
- [ ] D. Downstream should only react after business state is durably committed — outbox or inbox pattern

---

### Q44 [Medium] — Message Payload Compression

**Select all that apply.**

EventPipe sends large JSON event envelopes. Which statements are correct?

- [ ] A. Compression reduces bandwidth and helps fit broker message size limits
- [ ] B. Compression trades CPU on producer/consumer for network savings
- [ ] C. Compression eliminates the need for reference-based message design for blobs
- [ ] D. Kafka supports compression codecs (e.g., snappy, lz4, gzip)

---

### Q45 [Hard] [Case Study] — EventPipe Inbox Pattern

**Context:** External partner webhooks may redeliver the same `event_id`. EventPipe must apply each external event exactly once to local state.

**Select all that apply.**

How does the inbox pattern help?

- [ ] A. Inbox table stores incoming `event_id` with a `UNIQUE` constraint
- [ ] B. Process inbox row in the same database transaction as the business update
- [ ] C. Inbox pattern applies only to outbound events — not inbound integrations
- [ ] D. Inbox complements outbox for exactly-once effect across integration boundaries

---

### Q46 [Hard] — Kafka Log Compaction

**Select all that apply.**

Which statements about Kafka log-compacted topics are correct?

- [ ] A. Compaction retains the latest value per key — useful for changelog/state topics
- [ ] B. Compaction is a poor fit for unlimited append-only audit logs without key semantics
- [ ] C. Compaction deletes every historical version immediately on produce
- [ ] D. Config and state-sync topics often use compaction

---

### Q47 [Hard] [Case Study] — EventPipe Cross-Region Consumer Lag

**Context:** EventPipe publishes from `us-east`. `eu-west` consumers lag 3 minutes during a backbone degradation. EU search index falls behind.

**Select all that apply.**

What explains this and what should ops plan for?

- [ ] A. Multi-region streaming introduces eventual consistency and lag complexity
- [ ] B. Consumers must tolerate lag or use regional topics with local producers
- [ ] C. Cross-region replication guarantees synchronous zero-lag delivery
- [ ] D. Monitor inter-region lag and define failover or catch-up consumer strategy

---

### Q48 [Hard] — FIFO Queue Semantics

**Select all that apply.**

Which statements about FIFO queues (e.g., SQS FIFO) are correct?

- [ ] A. `MessageGroupId` scopes strict ordering within a group
- [ ] B. Different message groups can process in parallel
- [ ] C. One FIFO queue enforces global strict order for all messages in the account
- [ ] D. Deduplication ID prevents duplicate sends within the deduplication window

---

### Q49 [Hard] [Case Study] — EventPipe Kafka Rolling Upgrade

**Context:** EventPipe rolls a Kafka broker restart during business hours. Producers and consumers see transient `LEADER_NOT_AVAILABLE` errors for 90 seconds.

**Select all that apply.**

What practices reduce outage risk?

- [ ] A. Replication factor ≥ 2 with appropriate `min.insync.replicas` protects availability
- [ ] B. Clients must retry transient broker leadership errors
- [ ] C. Single-broker Kafka is production-safe for payment-critical EventPipe workloads
- [ ] D. Plan upgrades with lag monitoring and validated client retry behavior

---

### Q50 [Hard] — When Queues Add Harm

**Select all that apply.**

When is introducing a message queue a poor design choice?

- [ ] A. Simple CRUD with read-your-writes and low latency may not benefit from async indirection
- [ ] B. Queues add operational complexity — DLQ, monitoring, ordering, replay policies
- [ ] C. User-facing decisions shown in the HTTP response should not be fire-and-forget without UX design
- [ ] D. Every synchronous microservice call should always be replaced with a queue

