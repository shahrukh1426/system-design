# Database Internals — Answer Key & Explanations (50)

Answer key for [day-06-questions.md](../day-06-questions.md)


---

### Q01 [Easy] [Case Study] — LedgerFlow Dashboard Timeouts

**Answer:** A, C, D

**Explanation:** Page-oriented storage and cache misses drive I/O; wide rows worsen it. More app servers do not fix database page reads (B).

---

### Q02 [Easy] — Primary Keys and Unique Constraints

**Answer:** B, C, D

**Explanation:** Surrogate PK + UNIQUE on natural keys is standard. Sequential public IDs enable enumeration attacks (A).

---

### Q03 [Easy] [Case Study] — LedgerFlow Order Line Items

**Answer:** A, B, C

**Explanation:** Order lines need immutable purchase-time snapshots — intentional denormalization, not “always wrong” (D).

---

### Q04 [Easy] — When B-Tree Indexes Help

**Answer:** A, B, D

**Explanation:** Indexes speed selective reads but slow writes. Index-every-column causes write amplification (C).

---

### Q05 [Easy] [Case Study] — LedgerFlow Join Storm

**Answer:** A, C, D

**Explanation:** FK columns in JOINs need indexes; missing index causes expensive scans. FKs are not always auto-indexed (B).

---

### Q06 [Easy] — JOIN Types in Reporting

**Answer:** B, C, D

**Explanation:** LEFT JOIN keeps customers with zero orders; INNER JOIN drops them. CROSS JOIN is accidental-by-default (A).

---

### Q07 [Medium] [Case Study] — LedgerFlow Monthly Report Seq Scan

**Answer:** A, B, C

**Explanation:** Stale stats mislead the planner; ANALYZE refreshes them. Databases rewrite and optimize SQL (C is false).

---

### Q08 [Medium] — Prepared Statements and Plan Cache

**Answer:** A, B, D

**Explanation:** Prepared statements reuse parse/plan work and block injection. Plans can change when statistics shift (C).

---

### Q09 [Medium] [Case Study] — LedgerFlow Fund Transfer

**Answer:** A, C, D

**Explanation:** Both updates must be one atomic transaction. Autocommit partial updates risk inconsistent balances (B).

---

### Q10 [Medium] — Isolation Levels and Phenomena

**Answer:** A, D

**Explanation:** Read Committed allows non-repeatable and phantom reads. Dirty reads are prevented; Serializable is not the default (C, D).

---

### Q11 [Medium] [Case Study] — LedgerFlow Orders Page N+1

**Answer:** A, B, C

**Explanation:** 101 round trips multiply latency — not 202 ms wall clock under load. Eager loading fixes the pattern (D).

---

### Q12 [Medium] — ORM Loading Strategies

**Answer:** B, C, D

**Explanation:** Large collections favor selectinload; lazy loops cause N+1 (A).

---

### Q13 [Medium] [Case Study] — LedgerFlow Connection Pool Exhaustion

**Answer:** B, C, D

**Explanation:** 12×50=600 > max_connections=100. Bigger pools without fleet math worsen contention (A).

---

### Q14 [Medium] — PgBouncer and Pool Modes

**Answer:** A, B, D

**Explanation:** Pools reuse connections; transaction mode is efficient for stateless apps. Redis caches query results — different problem (C).

---

### Q15 [Hard] [Case Study] — LedgerFlow Profile After Update

**Answer:** A, B, C

**Explanation:** Async replica lag causes stale reads; route writes or recent reads to primary. Async does not guarantee zero loss on failover (D).

---

### Q16 [Hard] — Replication Models

**Answer:** A, C, D

**Explanation:** Async vs sync trades write speed for RPO. Replicas do not undo operator errors like DROP TABLE (B).

---

### Q17 [Hard] [Case Study] — LedgerFlow Shard Key Selection

**Answer:** B, C, D

**Explanation:** Date/month range sharding hot-spots current data. Country sharding skews traffic (A).

---

### Q18 [Hard] — Sharding vs Replication

**Answer:** A, B, D

**Explanation:** Replication = same data, read scale; sharding = split writes/storage. Single-server partitioning ≠ multi-node sharding (C).

---

### Q19 [Hard] [Case Study] — LedgerFlow Checkout Deadlock

**Answer:** A, C, D

**Explanation:** Consistent lock order and short transactions prevent deadlocks; DB kills one waiter. 2PC across services is not the checkout fix (B).

---

### Q20 [Hard] — Distributed Transactions Across Services

**Answer:** A, C, D

**Explanation:** Sagas and outbox are standard; 2PC across microservices is rare (B).

---

### Q21 [Easy] — WAL and Crash Recovery

**Answer:** A, B, D

**Explanation:** WAL enables crash recovery and durability. Backups still required for operator errors (C).

---

### Q22 [Easy] [Case Study] — LedgerFlow Analytics Load

**Answer:** B, C, D

**Explanation:** OLTP primary is wrong place for heavy analytics; replicas, warehouses, and materialized views offload reads (A).

---

### Q23 [Medium] — Composite Index Prefix Rule

**Answer:** A, B, C

**Explanation:** Leftmost prefix rule: status-led queries use the index; user_id alone skips leading columns (D).

---

### Q24 [Medium] — Covering and Partial Indexes

**Answer:** A, B, C

**Explanation:** Covering, partial, and expression indexes are production tools. Low-cardinality booleans alone are poor standalone indexes (D).

---

### Q25 [Hard] — PostgreSQL vs InnoDB Storage Layout

**Answer:** A, B, D

**Explanation:** InnoDB clusters by PK; PostgreSQL uses heap. Buffer pool is internal to DB — not app Redis (C).

---

### Q26 [Easy] — Surrogate Keys in Production

**Answer:** A, C, D

**Explanation:** Stable surrogates + UNIQUE natural keys. Natural keys are not always smaller (emails vs BIGINT) (B).

---

### Q27 [Medium] [Case Study] — LedgerFlow Regulatory Report

**Answer:** A, B, C

**Explanation:** Complex reports use raw SQL on replicas with EXPLAIN. In-memory app joins on millions of rows fail (D).

---

### Q28 [Hard] — Cross-Shard Constraints

**Answer:** A, B, D

**Explanation:** Global UNIQUE and FK across shards need application-level design. Native cross-shard FKs do not exist (C).

---

### Q29 [Medium] — Normalization Trade-offs

**Answer:** A, C, D

**Explanation:** Denormalize with evidence or for snapshots; 5NF is not a practical mandatory target (B).

---

### Q30 [Hard] [Case Study] — LedgerFlow Resharding Project

**Answer:** A, D

**Explanation:** Resharding is hard; consistent hashing helps. It is not zero-planning nor “shard first” (C, D).

---

### Q31 [Easy] [Case Study] — LedgerFlow Deep Page Pagination

**Answer:** A, B

**Explanation:** Deep `OFFSET` scans and discards rows; keyset pagination avoids that. Bigger pools and page-only caching do not fix OFFSET cost (C, D).

---

### Q32 [Easy] — Foreign Key Cascades

**Answer:** B, C, D

**Explanation:** FKs enforce integrity at the DB layer; cascade can be appropriate. Application-only checks are not a universal replacement (A).

---

### Q33 [Easy] [Case Study] — LedgerFlow Hot Wallet Row

**Answer:** B, C, D

**Explanation:** Same-row updates serialize on locks. Replicas scale reads, not primary writes (A).

---

### Q34 [Easy] — MVCC and Vacuum

**Answer:** A, B, D

**Explanation:** MVCC reduces reader/writer blocking but still uses locks for writes; old versions need vacuum (C).

---

### Q35 [Easy] [Case Study] — LedgerFlow Autovacuum Lag

**Answer:** A, B, C

**Explanation:** Dead tuples and blocked vacuum hurt performance. `DELETE` alone does not always shrink files immediately (D).

---

### Q36 [Easy] — Narrow SELECT Projections

**Answer:** A, C, D

**Explanation:** Narrow projections reduce I/O and improve page density. Less app code does not make `SELECT *` faster (B).

---

### Q37 [Medium] [Case Study] — LedgerFlow Payment Idempotency

**Answer:** A, B, D

**Explanation:** Idempotency keys with UNIQUE and upsert patterns prevent duplicates. Webhooks are at-least-once — app must handle retries (C).

---

### Q38 [Medium] — Optimistic vs Pessimistic Locking

**Answer:** B, C, D

**Explanation:** Pessimistic locks, optimistic versioning, and conditional atomic UPDATE all prevent oversell. Read Committed alone does not (A).

---

### Q39 [Medium] [Case Study] — LedgerFlow Idle in Transaction

**Answer:** A, B, C

**Explanation:** Long open transactions exhaust pools and hold resources. `idle in transaction` is dangerous under load (D).

---

### Q40 [Medium] — Declarative Partitioning

**Answer:** A, C, D

**Explanation:** Pruning helps range queries on one server. Partitioning ≠ multi-node sharding and does not auto-distribute across machines (B).

---

### Q41 [Medium] [Case Study] — LedgerFlow Correlated Subquery

**Answer:** A, B, D

**Explanation:** Correlated subqueries can run per outer row; rewrite and EXPLAIN confirm. They are not universally faster than JOINs (C).

---

### Q42 [Medium] — Index Selectivity and Seq Scans

**Answer:** B, C, D

**Explanation:** Low selectivity and tiny tables can favor seq scans. Distinguish valid plans from stale-stats mistakes (A).

---

### Q43 [Medium] [Case Study] — LedgerFlow Peak-Hour DDL

**Answer:** A, B, C

**Explanation:** Large-table DDL can lock or rewrite. Phased and online migrations reduce peak risk — not all ADD COLUMN is instant (D).

---

### Q44 [Medium] — Savepoints

**Answer:** A, B, D

**Explanation:** Savepoints enable partial rollback within a transaction. They do not auto-commit the transaction (C).

---

### Q45 [Hard] [Case Study] — LedgerFlow Budget Write Skew

**Answer:** A, C, D

**Explanation:** Non-serializable interleaving causes write skew. Serializable or explicit locking fixes it; Read Committed does not always (B).

---

### Q46 [Hard] — BRIN and Time-Series Data

**Answer:** A, C, D

**Explanation:** BRIN suits ordered append-heavy time data; combine with partitioning. Statistics still matter (B).

---

### Q47 [Hard] [Case Study] — LedgerFlow Failover Data Loss

**Answer:** A, B, C

**Explanation:** Async failover can lose recent commits — RPO is not zero. Promotion is not automatic 100% preservation (D).

---

### Q48 [Hard] — GIN Indexes and JSONB

**Answer:** B, C, D

**Explanation:** GIN supports containment; scalar btree suits single-field equality. GIN does not speed every JSON path (A).

---

### Q49 [Hard] [Case Study] — LedgerFlow Modulo Resharding

**Answer:** B, C, D

**Explanation:** Mod-N resharding is painful; consistent hashing reduces movement. Migration still needs planning — not zero-downtime by default (A).

---

### Q50 [Hard] — Join Algorithms

**Answer:** A, C, D

**Explanation:** Planner picks nested loop, hash, or merge based on size, indexes, and sort order — not always nested loop (B).
