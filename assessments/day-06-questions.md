# Database Internals — MCQ Questions (50)

Multi-select format: each question has **two or more** correct answers. Questions tagged **[Case Study]** include a business context block.

> **Answers and explanations:** see [answer-key/day-06-answers.md](./answer-key/day-06-answers.md)

---

### Q01 [Easy] [Case Study] — LedgerFlow Dashboard Timeouts

**Context:** LedgerFlow's finance dashboard runs `SELECT * FROM transactions WHERE account_id = ?` on a 500M-row table. Buffer pool hit ratio is 72%. P95 latency is 8 seconds.

**Select all that apply.**

What explains the slow reads and what should the team investigate?

- [ ] A. The database reads data in fixed-size pages (often ~8 KB), not single rows in isolation
- [ ] B. Low buffer pool hit ratio means more disk I/O on cache misses
- [ ] C. `SELECT *` pulls wide rows, fitting fewer rows per page and increasing I/O
- [ ] D. Adding more application servers alone eliminates page-read I/O

---

### Q02 [Easy] — Primary Keys and Unique Constraints

**Select all that apply.**

You are designing a `users` table for a public API. Which practices are sound?

- [ ] A. Use a surrogate key (BIGINT or UUID) as the primary key
- [ ] B. Enforce uniqueness on natural identifiers like email with a UNIQUE constraint
- [ ] C. Expose sequential auto-increment IDs in public URLs without concern
- [ ] D. A PRIMARY KEY column must be NOT NULL and unique per table

---

### Q03 [Easy] [Case Study] — LedgerFlow Order Line Items

**Context:** LedgerFlow stores `product_name` and `unit_price` on each order line at checkout time, even though a normalized `products` table exists.

**Select all that apply.**

Why is denormalizing these fields on the order line acceptable?

- [ ] A. It preserves a historical snapshot if catalog prices change later
- [ ] B. It avoids an update anomaly where changing a product name must update every past order row in a fully normalized design
- [ ] C. Denormalization is always wrong in OLTP systems
- [ ] D. Intentional denormalization for read performance or audit history is a valid trade-off

---

### Q04 [Easy] — When B-Tree Indexes Help

**Select all that apply.**

Which statements about B-tree indexes are correct?

- [ ] A. Indexes turn full table scans into roughly O(log n) lookups for selective queries
- [ ] B. Every INSERT/UPDATE must update all indexes on the table, slowing writes
- [ ] C. Indexing every column is a best practice for all workloads
- [ ] D. A composite index on `(user_id, created_at)` can speed `WHERE user_id = ? ORDER BY created_at`

---

### Q05 [Easy] [Case Study] — LedgerFlow Join Storm

**Context:** LedgerFlow's `/accounts/{id}/transactions` endpoint JOINs `transactions` to `accounts` on `account_id`. The FK exists but has no index on `transactions.account_id`. At 2M accounts this endpoint times out.

**Select all that apply.**

What fixes or explains this problem?

- [ ] A. Foreign key columns used in JOINs should be indexed
- [ ] B. Missing index on the join column can force nested-loop or hash joins over huge scans
- [ ] C. Foreign keys are automatically indexed in all databases without manual action
- [ ] D. Adding an index on `transactions(account_id)` is a standard fix

---

### Q06 [Easy] — JOIN Types in Reporting

**Select all that apply.**

You need a report of all customers and their order counts, including customers with zero orders.

- [ ] A. Use LEFT JOIN from customers to orders and aggregate
- [ ] B. INNER JOIN excludes customers who never placed an order
- [ ] C. CROSS JOIN is the appropriate default for this report
- [ ] D. Nested loop joins are efficient when the inner table has an index on the join column

---

### Q07 [Medium] [Case Study] — LedgerFlow Monthly Report Seq Scan

**Context:** After a bulk data load, LedgerFlow's monthly revenue query suddenly uses a sequential scan. `EXPLAIN ANALYZE` shows high `shared read` (disk) and estimated rows are far off from actual rows.

**Select all that apply.**

What likely happened and what should ops do?

- [ ] A. Stale table statistics can cause the planner to pick a suboptimal plan
- [ ] B. Running ANALYZE (or equivalent) refreshes statistics used by the optimizer
- [ ] C. The database always executes SQL literally without rewriting or cost-based planning
- [ ] D. High `shared read` in EXPLAIN suggests buffer pool misses / disk reads

---

### Q08 [Medium] — Prepared Statements and Plan Cache

**Select all that apply.**

Your API runs the same parameterized query millions of times per day. Which benefits apply?

- [ ] A. Parse and plan work can be reused via prepared statements
- [ ] B. Parameterized queries help prevent SQL injection
- [ ] C. Prepared statements guarantee the same execution plan forever regardless of data distribution changes
- [ ] D. ORMs often use prepared statements by default for repeated queries

---

### Q09 [Medium] [Case Study] — LedgerFlow Fund Transfer

**Context:** LedgerFlow transfers $500 between accounts with `UPDATE accounts SET balance = balance - 500 WHERE id = A` and `UPDATE accounts SET balance = balance + 500 WHERE id = B`. A crash occurred after the first UPDATE.

**Select all that apply.**

How should this be implemented safely?

- [ ] A. Wrap both updates in a single transaction so both commit or both roll back
- [ ] B. ACID atomicity ensures partial updates are not left committed on failure
- [ ] C. Run each UPDATE in autocommit mode without a transaction boundary
- [ ] D. Keep transactions short — do not hold locks open during external API calls inside the transaction

---

### Q10 [Medium] — Isolation Levels and Phenomena

**Select all that apply.**

At **Read Committed** isolation, which phenomena can still occur?

- [ ] A. Non-repeatable read — the same row read twice in one transaction can return different values
- [ ] B. Phantom read — a repeated range query can return new rows inserted by another transaction
- [ ] C. Dirty read — reading uncommitted data from another transaction
- [ ] D. Serializable isolation is the default in most production databases

---

### Q11 [Medium] [Case Study] — LedgerFlow Orders Page N+1

**Context:** LedgerFlow's `/orders` API returns 100 orders. DevTools shows 1 query for orders plus 100 identical `SELECT * FROM customers WHERE id = ?` queries. P95 latency is 2.1 seconds.

**Select all that apply.**

What describes this bug and valid fixes?

- [ ] A. This is an N+1 query pattern: 1 + N round trips
- [ ] B. Eager loading (e.g., joinedload or prefetch_related) can collapse this to one or two queries
- [ ] C. Each 2 ms query is fine because 101 × 2 ms is only 202 ms total
- [ ] D. Lazy loading customer data inside a loop over orders commonly causes N+1

---

### Q12 [Medium] — ORM Loading Strategies

**Select all that apply.**

You load 50 blog posts each with 200 comments. Which loading strategies are appropriate?

- [ ] A. `joinedload` / JOIN for always-needed small relations
- [ ] B. `selectinload` / prefetch with IN query to avoid one massive JOIN result set
- [ ] C. Default lazy load inside a template loop over posts and comments
- [ ] D. Raw SQL or hybrid queries for complex analytics with window functions

---

### Q13 [Medium] [Case Study] — LedgerFlow Connection Pool Exhaustion

**Context:** LedgerFlow runs 12 API pods each with a pool of 50 connections. PostgreSQL `max_connections` is 100. During peak, logs show `timeout waiting for connection from pool` — not slow queries.

**Select all that apply.**

What explains this and what should change?

- [ ] A. Total demand (instances × pool size) exceeds database max_connections
- [ ] B. Connection pool exhaustion is distinct from slow SQL — requests wait for a free connection
- [ ] C. Bigger per-instance pools always improve throughput without limit
- [ ] D. An external pooler (PgBouncer, RDS Proxy) can multiplex many clients onto fewer DB connections

---

### Q14 [Medium] — PgBouncer and Pool Modes

**Select all that apply.**

Which statements about connection pooling are correct?

- [ ] A. Opening a new DB connection costs TCP, TLS, auth, and significant memory on the server
- [ ] B. PgBouncer transaction pooling returns connections after each transaction — most efficient for stateless apps
- [ ] C. A connection pool is the same as a Redis cache — both avoid database queries
- [ ] D. `pool_pre_ping` can detect stale connections before handing them to the application

---

### Q15 [Hard] [Case Study] — LedgerFlow Profile After Update

**Context:** LedgerFlow writes profile updates to the primary PostgreSQL instance. The read API uses a replica with 300 ms replication lag. Users report seeing their old name immediately after saving.

**Select all that apply.**

What explains this and what are valid mitigations?

- [ ] A. Read-after-write problem: async replication serves stale reads on the replica
- [ ] B. Route read-your-writes traffic to the primary or a lag-aware replica after updates
- [ ] C. Async replication guarantees zero data loss on primary failure
- [ ] D. Session stickiness to primary for recently updated resources is a common fix

---

### Q16 [Hard] — Replication Models

**Select all that apply.**

Which statements compare async and sync replication?

- [ ] A. Async replication: primary does not wait for replica ACK — faster writes, possible lag
- [ ] B. Sync replication: primary waits for replica confirmation — slower writes, lower RPO on failover
- [ ] C. Replicas replace backups — accidental DROP TABLE on primary is undone by replication
- [ ] D. Physical replication ships WAL bytes; logical replication can replicate selected tables/events

---

### Q17 [Hard] [Case Study] — LedgerFlow Shard Key Selection

**Context:** LedgerFlow plans to shard orders across 8 PostgreSQL clusters. The team proposes sharding by `created_date` (month) because reports are date-range heavy.

**Select all that apply.**

What are risks and better practices?

- [ ] A. Range sharding by date creates hot shards on the current month
- [ ] B. Shard key should distribute writes evenly — often `user_id` or `tenant_id`
- [ ] C. Sharding by country is usually even for global traffic
- [ ] D. Co-locate related rows (orders + line items) on the same shard via a shared shard key

---

### Q18 [Hard] — Sharding vs Replication

**Select all that apply.**

When does sharding become necessary compared to read replicas?

- [ ] A. Replication scales reads on the same dataset; sharding splits data for write and storage scale
- [ ] B. Cross-shard JOINs and global UNIQUE constraints are hard — avoid hot-path cross-shard queries
- [ ] C. PostgreSQL declarative partitioning on one server is the same as multi-node sharding
- [ ] D. Resharding (e.g., 4 → 8 shards) is a major migration — plan before premature sharding

---

### Q19 [Hard] [Case Study] — LedgerFlow Checkout Deadlock

**Context:** Two LedgerFlow checkout transactions lock rows in opposite order: Txn A locks account 1 then 2; Txn B locks account 2 then 1. PostgreSQL logs `deadlock detected`.

**Select all that apply.**

How should LedgerFlow prevent or handle this?

- [ ] A. Lock rows in a consistent order (e.g., always lower account_id first)
- [ ] B. Keep transactions short — avoid external calls inside transaction boundaries
- [ ] C. The database will kill one transaction automatically on deadlock
- [ ] D. Use distributed two-phase commit across microservices for every checkout step

---

### Q20 [Hard] — Distributed Transactions Across Services

**Select all that apply.**

LedgerFlow's order flow spans Order, Payment, and Inventory services. Which approaches are production-standard?

- [ ] A. Saga pattern with compensating events instead of 2PC across services
- [ ] B. Transactional outbox: write business row + outbox row in one DB transaction, then publish
- [ ] C. Two-phase commit across three microservice databases is the default industry pattern
- [ ] D. Each service owns its database; cross-service consistency is eventual

---

### Q21 [Easy] — WAL and Crash Recovery

**Select all that apply.**

Which statements about write-ahead logging (WAL) are correct?

- [ ] A. WAL writes are sequential — durability is recorded before random data page flushes
- [ ] B. After a crash, the database replays WAL to recover committed work
- [ ] C. WAL eliminates the need for backups entirely
- [ ] D. Durability (the D in ACID) depends on WAL reaching persistent storage

---

### Q22 [Easy] [Case Study] — LedgerFlow Analytics Load

**Context:** LedgerFlow runs heavy JOIN analytics on the production OLTP database nightly. Reports take 45 minutes and slow checkout during the window.

**Select all that apply.**

What architectural responses are appropriate?

- [ ] A. Replicate to a read replica or warehouse and run analytics there
- [ ] B. Denormalize into a star schema in an OLAP store for dashboard queries
- [ ] C. Run all analytics JOINs on the primary because normalization guarantees speed
- [ ] D. Materialized views or ETL pipelines offload read-heavy reporting from OLTP

---

### Q23 [Medium] — Composite Index Prefix Rule

**Select all that apply.**

You have composite index `(status, created_at, user_id)`. Which queries can use this index efficiently?

- [ ] A. `WHERE status = 'ACTIVE'`
- [ ] B. `WHERE status = 'ACTIVE' AND created_at > '2025-01-01'`
- [ ] C. `WHERE user_id = 42` alone (no status predicate)
- [ ] D. `WHERE status = 'ACTIVE' ORDER BY created_at`

---

### Q24 [Medium] — Covering and Partial Indexes

**Select all that apply.**

Which index techniques reduce heap fetches or index size?

- [ ] A. Covering index includes all columns needed by the query — index-only scan possible
- [ ] B. Partial index on `WHERE status = 'ACTIVE'` is smaller and faster for filtered queries
- [ ] C. Expression index on `LOWER(email)` when queries use `LOWER(email) = ?`
- [ ] D. Low-cardinality boolean columns alone always make excellent standalone indexes

---

### Q25 [Hard] — PostgreSQL vs InnoDB Storage Layout

**Select all that apply.**

Which storage layout facts are correct?

- [ ] A. InnoDB clustered index stores rows sorted by primary key on disk
- [ ] B. PostgreSQL uses heap storage with separate indexes — not clustered PK storage like InnoDB
- [ ] C. Random UUID v4 primary keys can hurt insert locality compared to time-ordered UUID v7 or BIGINT
- [ ] D. Buffer pool and application Redis cache are the same layer

---

### Q26 [Easy] — Surrogate Keys in Production

**Select all that apply.**

Why do teams prefer surrogate primary keys over natural keys (email, SKU)?

- [ ] A. Natural identifiers can change — surrogate keys should remain stable
- [ ] B. Surrogate keys simplify FK references across tables
- [ ] C. Natural keys are always smaller on disk than BIGINT
- [ ] D. You can still enforce natural uniqueness with UNIQUE constraints

---

### Q27 [Medium] [Case Study] — LedgerFlow Regulatory Report

**Context:** LedgerFlow must produce a quarterly report with window functions, CTEs, and 12-table JOINs. The ORM generates 400-line SQL that times out.

**Select all that apply.**

What is the pragmatic approach?

- [ ] A. Use raw SQL or a query builder for this analytics path
- [ ] B. Keep ORM for CRUD; escape hatch for complex reporting is common
- [ ] C. Force the ORM to load entities and join in application memory for all rows
- [ ] D. Verify the final SQL with EXPLAIN and appropriate indexes on the replica

---

### Q28 [Hard] — Cross-Shard Constraints

LedgerFlow shards by `user_id`. Email must be globally unique across shards.

**Select all that apply.**

Which challenges apply?

- [ ] A. Per-shard UNIQUE on email does not prevent duplicate emails on different shards
- [ ] B. Global uniqueness requires a global index service, email in shard key, or lookup table
- [ ] C. Foreign keys work natively across shards without application logic
- [ ] D. Cross-shard transactions for checkout are expensive — design to avoid them on hot paths

---

### Q29 [Medium] — Normalization Trade-offs

**Select all that apply.**

When is denormalization justified in OLTP?

- [ ] A. Evidence from slow query logs and measured read patterns — not premature optimization
- [ ] B. Historical snapshots on immutable records (order line price at purchase time)
- [ ] C. Always normalize to 5NF before considering any denormalization
- [ ] D. Read-heavy dashboards may use replicas or warehouses instead of denormalizing core OLTP tables

---

### Q30 [Hard] [Case Study] — LedgerFlow Resharding Project

**Context:** LedgerFlow grew from 4 to 8 shards. The team must migrate without multi-hour write downtime. Consistent hashing is under evaluation.

**Select all that apply.**

Which statements about resharding are correct?

- [ ] A. Resharding is a major project — dual-write, rebalancing, or tooling (Vitess, etc.) is required
- [ ] B. Consistent hashing minimizes data movement when adding nodes compared to naive hash mod N
- [ ] C. Resharding is a one-click operation in all sharded databases with zero planning
- [ ] D. Shard early before optimizing queries, caching, and read replicas — always shard first

---

### Q31 [Easy] [Case Study] — LedgerFlow Deep Page Pagination

**Context:** LedgerFlow's `/transactions?page=5000` uses `LIMIT 50 OFFSET 250000`. Page 1 returns in 40 ms; page 5000 takes 4.2 seconds.

**Select all that apply.**

What explains the slowdown and which fixes are sound?

- [ ] A. `OFFSET` forces the database to scan and discard skipped rows — cost grows with page depth
- [ ] B. Keyset pagination on `(created_at, id)` avoids large offsets for "next page" flows
- [ ] C. Wrapping the same query in a larger connection pool eliminates OFFSET scan cost
- [ ] D. Caching only page 5000 in Redis fixes the root SQL cost for every deep-page request pattern

---

### Q32 [Easy] — Foreign Key Cascades

**Select all that apply.**

You model `orders` with child `order_items` using foreign keys. Which practices are sound?

- [ ] A. `ON DELETE CASCADE` on line items when a parent order is removed can be appropriate
- [ ] B. Foreign key constraints enforce referential integrity at the database layer
- [ ] C. Application-only checks should replace foreign keys in all production systems
- [ ] D. Child rows cannot reference a missing parent when the FK is enforced

---

### Q33 [Easy] [Case Study] — LedgerFlow Hot Wallet Row

**Context:** LedgerFlow runs 200 concurrent `UPDATE accounts SET balance = balance - X WHERE id = 1` against a single promo wallet. P99 latency spikes to 8 seconds even though each isolated query is under 2 ms.

**Select all that apply.**

What explains contention and which responses are valid?

- [ ] A. Row-level locks serialize concurrent updates to the same row
- [ ] B. Hot-row write contention is distinct from a missing-index problem
- [ ] C. Adding read replicas removes write lock contention on the primary
- [ ] D. Sharding by `account_id`, per-wallet queues, or batching debits can spread hot-row load

---

### Q34 [Easy] — MVCC and Vacuum

**Select all that apply.**

Which statements about MVCC (multi-version concurrency control) are correct?

- [ ] A. Readers typically do not block writers and writers do not block readers
- [ ] B. `UPDATE` creates a new row version; old versions remain until vacuum reclaims them
- [ ] C. MVCC eliminates the need for any locks in the database
- [ ] D. Long-running transactions can delay vacuum and contribute to table bloat

---

### Q35 [Easy] [Case Study] — LedgerFlow Autovacuum Lag

**Context:** LedgerFlow's `transactions` table shows 45% dead tuples. Autovacuum has not run in 18 hours. A previously fast dashboard query is suddenly 10× slower.

**Select all that apply.**

What likely happened and what should ops monitor?

- [ ] A. Dead tuples bloat the table and increase I/O per live row
- [ ] B. Long `idle in transaction` sessions can block vacuum from reclaiming space
- [ ] C. `DELETE` without vacuum instantly shrinks the on-disk file size in all databases
- [ ] D. Track `n_dead_tup`, autovacuum lag, and sessions stuck `idle in transaction`

---

### Q36 [Easy] — Narrow SELECT Projections

**Select all that apply.**

Which practices reduce database load for list endpoints?

- [ ] A. Select only columns the API returns — avoid `SELECT *` on wide tables
- [ ] B. Narrower projections fit more rows per page and improve buffer pool efficiency
- [ ] C. `SELECT *` is always faster because it needs less application mapping code
- [ ] D. DTO or projection queries decouple API response fields from full table width

---

### Q37 [Medium] [Case Study] — LedgerFlow Payment Idempotency

**Context:** LedgerFlow's payment webhook may retry up to 5 times. Without idempotency handling, duplicate `INSERT INTO payments` rows appear for one charge.

**Select all that apply.**

How should duplicate webhook delivery be handled?

- [ ] A. `UNIQUE` constraint on `idempotency_key` prevents duplicate business writes
- [ ] B. `INSERT ... ON CONFLICT DO NOTHING` (or equivalent) supports idempotent recording
- [ ] C. Network-layer exactly-once delivery eliminates the need for application idempotency
- [ ] D. Check idempotency before side effects, ideally inside the same database transaction

---

### Q38 [Medium] — Optimistic vs Pessimistic Locking

**Select all that apply.**

Inventory must not oversell 10 units when 50 checkouts run concurrently. Which approaches are valid?

- [ ] A. `SELECT ... FOR UPDATE` on the inventory row is pessimistic locking
- [ ] B. Optimistic locking with a `version` column retries on conflict
- [ ] C. Read Committed isolation alone prevents lost updates without explicit locking or atomic `UPDATE`
- [ ] D. `UPDATE inventory SET qty = qty - 1 WHERE id = ? AND qty > 0` is atomic at the row level

---

### Q39 [Medium] [Case Study] — LedgerFlow Idle in Transaction

**Context:** LedgerFlow opens a transaction, loads an order, calls an external fraud API for 30 seconds, then commits. During traffic, 48 of 50 pool connections show `idle in transaction`.

**Select all that apply.**

What is wrong and what should change?

- [ ] A. Holding transactions open during external I/O exhausts connections and can hold locks
- [ ] B. Do non-database work outside the transaction; keep transaction scope minimal
- [ ] C. `idle in transaction` is harmless because the session uses no CPU
- [ ] D. Use `statement_timeout` and alert on `state = 'idle in transaction'` in metrics

---

### Q40 [Medium] — Declarative Partitioning

**Select all that apply.**

LedgerFlow archives transactions by month on one PostgreSQL cluster using declarative partitioning.

- [ ] A. Partition pruning can skip irrelevant partitions for date-range queries
- [ ] B. Single-server partitioning is not the same as multi-node horizontal sharding
- [ ] C. Declarative partitioning automatically spreads writes across different physical servers
- [ ] D. Partition key choice should align with common query filters (e.g., `created_at`)

---

### Q41 [Medium] [Case Study] — LedgerFlow Correlated Subquery

**Context:** A LedgerFlow report runs `SELECT * FROM accounts a WHERE balance > (SELECT AVG(balance) FROM accounts WHERE region = a.region)`. Runtime is 12 minutes on 2M rows.

**Select all that apply.**

What explains the cost and what are valid improvements?

- [ ] A. Correlated subqueries can execute the inner query once per outer row
- [ ] B. Rewriting with window functions or a JOIN to pre-aggregated regional averages can help
- [ ] C. Correlated subqueries are always faster than equivalent JOINs at scale
- [ ] D. `EXPLAIN ANALYZE` helps confirm per-row nested execution

---

### Q42 [Medium] — Index Selectivity and Seq Scans

**Select all that apply.**

When might the optimizer correctly choose a sequential scan over an index?

- [ ] A. When a large fraction of the table matches the predicate (low selectivity)
- [ ] B. When the table is small enough that reading the whole heap is cheaper than index plus random lookups
- [ ] C. Sequential scans are always a planner bug — indexes should always be preferred
- [ ] D. Stale statistics can cause wrong plans — distinguish bad stats from a valid seq scan choice

---

### Q43 [Medium] [Case Study] — LedgerFlow Peak-Hour DDL

**Context:** LedgerFlow runs `ALTER TABLE transactions ADD COLUMN status VARCHAR(20) DEFAULT 'PENDING'` on 400M rows during peak traffic. Writes block for 6 minutes.

**Select all that apply.**

What explains the outage risk and what are safer practices?

- [ ] A. Some DDL operations take strong locks or rewrite tables depending on engine and version
- [ ] B. Multi-phase migrations (add nullable column, backfill, then enforce) reduce peak blocking
- [ ] C. Every `ADD COLUMN` with a default is instant metadata-only on all row counts and engines
- [ ] D. Heavy DDL belongs in maintenance windows or managed online schema-change workflows

---

### Q44 [Medium] — Savepoints

**Select all that apply.**

Which statements about `SAVEPOINT` are correct?

- [ ] A. `SAVEPOINT` allows rolling back part of a transaction while keeping earlier work in the same transaction
- [ ] B. Savepoints do not replace proper transaction boundaries around external HTTP calls
- [ ] C. `RELEASE SAVEPOINT` auto-commits the entire transaction — `COMMIT` is unnecessary afterward
- [ ] D. Heavy savepoint use in application code often signals unclear error-handling design

---

### Q45 [Hard] [Case Study] — LedgerFlow Budget Write Skew

**Context:** Two LedgerFlow analysts run concurrent jobs that read and update separate budget rows. Interleaved reads produce totals that do not match any serial execution order.

**Select all that apply.**

What describes this and what are valid mitigations?

- [ ] A. This is a serializability anomaly — the outcome is not equivalent to any serial order
- [ ] B. Serializable isolation or explicit locking on the invariant rows can prevent it
- [ ] C. Read Committed always prevents write skew on multi-row invariants
- [ ] D. Document which invariants require Serializable isolation vs optimistic concurrency

---

### Q46 [Hard] — BRIN and Time-Series Data

**Select all that apply.**

LedgerFlow stores 2B time-ordered events in PostgreSQL. Which index strategies are appropriate?

- [ ] A. BRIN on `created_at` can be compact for naturally ordered, append-mostly data
- [ ] B. B-tree on timestamp alone is valid but often much larger than BRIN for range scans on ordered data
- [ ] C. BRIN removes the need for table statistics and `ANALYZE`
- [ ] D. Time partitioning plus BRIN or partition pruning is a common time-series pattern

---

### Q47 [Hard] [Case Study] — LedgerFlow Failover Data Loss

**Context:** LedgerFlow's primary fails. Ops promotes a replica. Twelve seconds of commits that succeeded on the primary are missing on the promoted replica.

**Select all that apply.**

What explains the gap and what belongs in the runbook?

- [ ] A. Async replication allowed lag; the promoted replica may trail the last primary commits
- [ ] B. RPO depends on replication mode and failover process — not zero for async setups
- [ ] C. Promoting a replica always preserves 100% of primary commits automatically
- [ ] D. Define failover criteria, lag checks, and split-brain prevention in the runbook

---

### Q48 [Hard] — GIN Indexes and JSONB

**Select all that apply.**

LedgerFlow queries `metadata @> '{"tier": "gold"}'` on a JSONB column millions of times per day.

- [ ] A. GIN index on JSONB supports containment operators like `@>`
- [ ] B. GIN on the full JSONB document differs from a btree on one extracted scalar field
- [ ] C. JSONB GIN indexes accelerate every JSON access pattern, including unindexed keys
- [ ] D. Expression btree on `(metadata->>'tier')` may suffice for equality on that one field only

---

### Q49 [Hard] [Case Study] — LedgerFlow Modulo Resharding

**Context:** LedgerFlow sharded with `shard = user_id % 4`. Growing to 8 shards requires rehashing most keys. The team evaluates consistent hashing.

**Select all that apply.**

Which statements about resharding are correct?

- [ ] A. Naive mod-N resharding moves most keys when N changes
- [ ] B. Consistent hashing limits key movement when adding shards compared to naive mod-N
- [ ] C. Mod-4 to mod-8 migration is always zero-downtime with no dual-write phase
- [ ] D. Avoid coupling application config deeply to a fixed physical shard count without a migration plan

---

### Q50 [Hard] — Join Algorithms

**Select all that apply.**

Which statements about how the planner picks join algorithms are correct?

- [ ] A. Nested loop with an index seek on the inner table is efficient for a small outer side and selective joins
- [ ] B. Hash join often wins for large equi-joins without helpful indexes on both sides
- [ ] C. The planner always prefers nested loop because it is the default for all join sizes
- [ ] D. Merge join can be efficient when both inputs are sorted on the join keys

---
