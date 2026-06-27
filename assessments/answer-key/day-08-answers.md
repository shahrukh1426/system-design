# Message Queues Deep Dive — Answer Key & Explanations (50)

Answer key for [day-08-questions.md](../day-08-questions.md)


---

### Q01 [Easy] [Case Study] — EventPipe Upload Acceptance

**Answer:** B, C, D

**Explanation:** Queue offloads slow work and enables retry. DB remains source of truth for metadata (A).

---

### Q02 [Easy] — Message Queue Components

**Answer:** A, B, D

**Explanation:** Standard broker flow with ack and pull backpressure. Queues are not financial ledger (C).

---

### Q03 [Easy] [Case Study] — EventPipe Checkout Hybrid

**Answer:** B, C, D

**Explanation:** Sync payment decision; async side effects with retry. Payment must not be fire-and-forget (A).

---

### Q04 [Easy] — Queue vs Pub/Sub vs Stream

**Answer:** A, B, C

**Explanation:** Three models as described. Redis Pub/Sub is not durable for offline subs (D).

---

### Q05 [Easy] [Case Study] — EventPipe Order Notifications

**Answer:** A, B, C, D

**Explanation:** Fan-out needs pub/sub or per-service groups; single task queue load-balances one consumer per message — all statements correctly contrast models.

---

### Q06 [Easy] — Broker Core Components

**Answer:** A, B, C

**Explanation:** Partitions cap group parallelism. Extra consumers beyond partitions idle (D).

---

### Q07 [Medium] [Case Study] — EventPipe Message Payload Size

**Answer:** A, B, D

**Explanation:** Reference blobs in object storage; small envelope fields. Full row/blob embed is anti-pattern (C).

---

### Q08 [Medium] — Commands vs Events

**Answer:** A, B, D

**Explanation:** Events decouple; commands couple. Commands are not better for decoupling (C).

---

### Q09 [Medium] [Case Study] — EventPipe Duplicate Charge

**Answer:** A, B, C

**Explanation:** At-least-once duplicates without idempotency (D). Ack after idempotent process.

---

### Q10 [Medium] — Delivery Guarantees

**Answer:** A, B, D

**Explanation:** At-most vs at-least trade-offs. Exactly-once end-to-end is not trivial (C).

---

### Q11 [Medium] [Case Study] — EventPipe Order State Machine

**Answer:** A, B, D

**Explanation:** order_id partition key; timestamp is bad key (C). Sequence guards out-of-order retries.

---

### Q12 [Medium] — Bad Partition Keys

**Answer:** A, B, D

**Explanation:** Timestamp and country skew. order_id/user_id are good (C).

---

### Q13 [Medium] [Case Study] — EventPipe Consumer Lag

**Answer:** A, B, C

**Explanation:** Partition limit explains idle pods. Scaling past downstream API bottleneck does not help (D).

---

### Q14 [Medium] — Backpressure and Graceful Shutdown

**Answer:** A, B, C

**Explanation:** Graceful drain prevents duplicate redelivery. High prefetch can block on one slow msg (D).

---

### Q15 [Hard] [Case Study] — EventPipe Poison Message

**Answer:** A, C, D

**Explanation:** DLQ + non-retryable classification + alerts. Infinite retry on bad JSON is harmful (B).

---

### Q16 [Hard] — Retry vs Non-Retryable Errors

**Answer:** A, C, D

**Explanation:** Retry transients with backoff+jitter. 400/auth failures go to DLQ (B).

---

### Q17 [Hard] [Case Study] — EventPipe Outbox Pattern

**Answer:** A, B, D

**Explanation:** Same-txn outbox + poller — no 2PC to Kafka (C).

---

### Q18 [Hard] — Saga Pattern

**Answer:** A, B, D

**Explanation:** Compensating events; local txns only. Global 2PC across services is not standard (C).

---

### Q19 [Easy] — Sync vs Async Trade-offs

**Answer:** B, C, D

**Explanation:** Sync for user-visible decisions; async buffers failures. Async is eventual, not strong immediate consistency (A).

---

### Q20 [Easy] [Case Study] — EventPipe Black Friday Spike

**Answer:** A, B, D

**Explanation:** Buffer decouples rates. Workers still required (C).

---

### Q21 [Medium] — SQS Standard vs FIFO

**Answer:** B, C, D

**Explanation:** FIFO orders per MessageGroupId, not globally (A).

---

### Q22 [Medium] [Case Study] — EventPipe Fan-Out Architecture

**Answer:** A, B, C, D

**Explanation:** SNS→SQS fan-out gives isolated scaling and DLQ per channel — all statements valid.

---

### Q23 [Medium] — Kafka vs SQS Tool Selection

**Answer:** A, B, D

**Explanation:** Kafka for replay/streams; SQS for simple jobs. Kafka overkill for tiny email cron (C).

---

### Q24 [Medium] — Monitoring Queue Health

**Answer:** A, B, C, D

**Explanation:** All four are standard queue health signals.

---

### Q25 [Hard] [Case Study] — EventPipe Exactly-Once Claim

**Answer:** B, C, D

**Explanation:** Idempotent consumers remain mandatory. Never drop idempotency on vendor claims (A).

---

### Q26 [Hard] — Idempotency Implementation

**Answer:** A, C, D

**Explanation:** Dedup table, natural idempotent updates, API keys. Ack-before-process risks loss (B).

---

### Q27 [Easy] — Why Not a Database Table as Queue

**Answer:** A, B, D

**Explanation:** DIY queue hits lock/contention limits. Brokers scale messaging; table is not faster at 100K/sec (C).

---

### Q28 [Medium] [Case Study] — EventPipe CDC Pipeline

**Answer:** A, B, D

**Explanation:** Debezium CDC decouples indexing; sync search on every write is optional not required (C).

---

### Q29 [Hard] — Redis Pub/Sub vs Redis Streams

**Answer:** A, B, C

**Explanation:** Pub/Sub ephemeral; Streams persisted. Not durable primary for payments (D).

---

### Q30 [Hard] [Case Study] — EventPipe Delayed Reminder

**Answer:** A, B, D

**Explanation:** Delay queues for scheduled work. Real-time chat uses WebSocket, not delayed queue (C).

---

### Q31 [Easy] [Case Study] — EventPipe Schema Breaking Change

**Answer:** A, C, D

**Explanation:** Version and evolve compatibly. Remove fields only after consumers updated (B).

---

### Q32 [Easy] — Priority and Multiple Queues

**Answer:** A, B, D

**Explanation:** Separate queues/pools for priority. Single FIFO does not auto-prioritize (C).

---

### Q33 [Easy] [Case Study] — EventPipe Webhook Replay Request

**Answer:** A, B, C, D

**Explanation:** Kafka replay within retention; SQS consumed messages gone; design logs when replay is required.

---

### Q34 [Easy] — Message Ordering Trade-offs

**Answer:** A, B, D

**Explanation:** Global order limits throughput. Ordering has cost; handle out-of-order retries (C).

---

### Q35 [Easy] [Case Study] — EventPipe Visibility Timeout Too Short

**Answer:** A, C, D

**Explanation:** Timeout must cover processing; heartbeat extends lease. Short timeout causes duplicates (B).

---

### Q36 [Easy] — RabbitMQ Exchange Routing

**Answer:** A, B, C

**Explanation:** Direct, topic, fanout models. RabbitMQ ≠ Kafka partitions (D).

---

### Q37 [Medium] [Case Study] — EventPipe Shared Queue Mistake

**Answer:** A, B, D

**Explanation:** Task queue competes — one consumer per message. Fan-out needs pub/sub (C).

---

### Q38 [Medium] — Saga Choreography vs Orchestration

**Answer:** A, B, D

**Explanation:** Two saga styles; both need idempotency (C).

---

### Q39 [Medium] [Case Study] — EventPipe Rebalance Storm

**Answer:** B, C, D

**Explanation:** Rebalance pauses consumption; limit churn; sticky/cooperative rebalance (A).

---

### Q40 [Medium] — Dead Letter Queue Operations

**Answer:** A, B, D

**Explanation:** Alert, idempotent replay, rich metadata. DLQ messages can be reprocessed (C).

---

### Q41 [Medium] [Case Study] — EventPipe Out-of-Order Events

**Answer:** B, C, D

**Explanation:** State machine and sequence guards. At-least-once ≠ perfect order (A).

---

### Q42 [Medium] — Task Queue Worker Semantics

**Answer:** A, B, C

**Explanation:** Ack-after-success, optional result backend, visibility lease. DB transactions still required (D).

---

### Q43 [Medium] [Case Study] — EventPipe Publish-Before-Commit

**Answer:** A, B, D

**Explanation:** Dual-write race; outbox fixes ordering vs commit. Publish-first is unsafe (C).

---

### Q44 [Medium] — Message Payload Compression

**Answer:** A, B, D

**Explanation:** Compression saves bandwidth/CPU trade-off. Large blobs still belong in object storage (C).

---

### Q45 [Hard] [Case Study] — EventPipe Inbox Pattern

**Answer:** A, B, C

**Explanation:** Inbound dedup table in same txn. Inbox is for inbound integrations (D).

---

### Q46 [Hard] — Kafka Log Compaction

**Answer:** A, B, C

**Explanation:** Compacted topics for keyed state. Not instant delete-all-history (D).

---

### Q47 [Hard] [Case Study] — EventPipe Cross-Region Consumer Lag

**Answer:** A, B, D

**Explanation:** Cross-region is eventual; plan lag tolerance. Not synchronous zero-lag (C).

---

### Q48 [Hard] — FIFO Queue Semantics

**Answer:** A, B, D

**Explanation:** Order per MessageGroupId; parallel groups. Not global account order (C).

---

### Q49 [Hard] [Case Study] — EventPipe Kafka Rolling Upgrade

**Answer:** A, B, C

**Explanation:** Replication and client retries for leader elections. Single broker is not production-safe (D).

---

### Q50 [Hard] — When Queues Add Harm

**Answer:** A, B, C

**Explanation:** Queues add ops cost; sync paths need UX for user-visible decisions. Not every call should be queued (D).
