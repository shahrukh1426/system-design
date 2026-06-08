# DB Scaling

[← Caching](./05-caching.md) | [Day 5 Index](./README.md) | [Next: Queue →](./07-queue.md)

## What Is DB Scaling?

**Database scaling** is growing your data layer to handle more data, reads, writes, and connections without slowing down or crashing.

The database is often the **first bottleneck** in a growing system. App servers scale horizontally easily; databases are harder.

## Signs You Need to Scale

| Symptom | Likely Cause |
|---------|--------------|
| Queries getting slower over time | Table growth, missing indexes |
| CPU pegged on DB server | Too many queries, heavy joins |
| Connection errors | Connection pool exhausted |
| Writes blocking reads | Lock contention |
| Disk full | Data growth, no archival |
| Replication lag growing | Replicas can't keep up with writes |

## Scaling Strategies (In Order)

Apply these progressively — don't jump to sharding on day one.

```
1. Optimize queries + indexes     (cheapest)
2. Add caching (Redis)            (offload reads)
3. Read replicas                  (scale reads)
4. Vertical scaling (bigger DB)   (quick win)
5. Connection pooling             (more efficient connections)
6. Sharding / partitioning        (scale writes)
7. Switch DB type if needed       (last resort)
```

## 1. Query Optimization and Indexes

Before adding hardware, fix the queries.

```sql
-- Slow: full table scan
SELECT * FROM orders WHERE user_id = 12345;

-- Fast: index on user_id
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

| Technique | Impact |
|-----------|--------|
| Add indexes on `WHERE`, `JOIN`, `ORDER BY` columns | Huge read improvement |
| Avoid `SELECT *` | Less data transferred |
| Paginate large results | `LIMIT 20` not 1 million rows |
| Analyze slow query log | Find worst offenders |

## 2. Caching (Read Offload)

See [Caching](./05-caching.md). Redis in front of DB cuts read load dramatically.

```
90% cache hit rate → DB sees only 10% of read traffic
```

## 3. Read Replicas

One **primary** handles writes; multiple **replicas** handle reads.

```
         ┌──────────────┐
Writes ─▶│   Primary    │
         │   (Master)   │
         └──────┬───────┘
                │ replication
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│Replica1│ │Replica2│ │Replica3│  ← Reads
└────────┘ └────────┘ └────────┘
```

### How It Works

```
1. Write goes to Primary → committed
2. Primary streams changes to replicas (async or sync)
3. Reads go to any replica (slightly stale data possible)
```

| Pros | Cons |
|------|------|
| Scale reads horizontally | Replication lag (eventual consistency) |
| Failover possible | Writes still on one primary |
| Simple to set up | Replica sync overhead |

**Best when:** read:write ratio is 10:1 or higher.

### Replication Lag

```
Primary:  product price updated to $19.99
Replica:  still shows $29.99 for 100ms

User hits replica → sees old price briefly
```

Mitigate: read-your-writes (route user's reads to primary after their write).

## 4. Vertical Scaling (Scale Up)

Bigger machine — more CPU, RAM, faster SSD.

```
Before:  4 CPU, 16 GB RAM, 500 GB SSD
After:  32 CPU, 256 GB RAM, 2 TB NVMe
```

| Pros | Cons |
|------|------|
| No code changes | Ceiling (largest instance) |
| Simple | Single point of failure |
| Good quick fix | Expensive at high end |

Works until it doesn't. Plan horizontal scaling before you hit the ceiling.

## 5. Connection Pooling

Opening a DB connection is expensive. Pools reuse connections.

```
Without pool:
  1000 requests → 1000 new DB connections → DB overwhelmed

With pool (PgBouncer, HikariCP):
  1000 requests → 50 pooled connections reused → DB stable
```

```
App Server 1 ──┐
App Server 2 ──┼──▶ PgBouncer (pool: 100 connections) ──▶ PostgreSQL
App Server 3 ──┘
```

Rule of thumb: `pool size ≈ (CPU cores × 2) + spindle count`

## 6. Sharding (Partitioning)

Split data across **multiple databases** by a shard key.

```
user_id % 4 = 0  →  Shard 0 (users 0, 4, 8...)
user_id % 4 = 1  →  Shard 1 (users 1, 5, 9...)
user_id % 4 = 2  →  Shard 2
user_id % 4 = 3  →  Shard 3
```

```
         ┌─────────┐
         │ Router  │  (knows which shard has the data)
         └────┬────┘
              │
    ┌─────────┼─────────┬─────────┐
    ▼         ▼         ▼         ▼
 Shard 0   Shard 1   Shard 2   Shard 3
```

| Pros | Cons |
|------|------|
| Scale writes horizontally | Cross-shard queries are painful |
| Smaller indexes per shard | Rebalancing is complex |
| Fault isolation | Shard key choice is permanent-ish |

### Choosing a Shard Key

| Good Shard Key | Bad Shard Key |
|----------------|---------------|
| `user_id` (evenly distributed) | `country` (US has 80% of data) |
| `order_id` (UUID) | `created_date` (all today → one shard) |

**Avoid sharding until** vertical scaling + replicas + caching aren't enough.

## 7. Partitioning (Within One DB)

Split one large table into smaller pieces — lighter than full sharding.

```sql
-- PostgreSQL: partition by date
CREATE TABLE orders (
    id BIGINT,
    created_at DATE,
    ...
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

Queries with date filter only scan relevant partition.

## 8. Database per Service

In microservices, each service owns its database.

```
User Service    → users_db
Order Service   → orders_db
Product Service → products_db
```

| Pros | Cons |
|------|------|
| Independent scaling | No cross-service JOINs |
| Team ownership | Distributed transactions hard |
| Technology choice per service | More operational overhead |

## SQL vs NoSQL for Scale

| Need | Lean Toward |
|------|-------------|
| ACID transactions, complex queries | PostgreSQL, MySQL |
| Massive write throughput, flexible schema | Cassandra, DynamoDB |
| Key-value lookups at scale | Redis, DynamoDB |
| Full-text search | Elasticsearch |
| Time-series metrics | TimescaleDB, InfluxDB |

Many systems use **PostgreSQL + Redis + Elasticsearch** — right tool per access pattern.

## DB Scaling Roadmap

```
Stage 1: Single DB + indexes + query tuning
    ↓ read load grows
Stage 2: Redis cache + connection pooling
    ↓ still more reads
Stage 3: Read replicas
    ↓ write load grows
Stage 4: Vertical scale primary
    ↓ writes exceed single node
Stage 5: Sharding or migrate hot tables to NoSQL
    ↓ team/service growth
Stage 6: Database per service (microservices)
```

## Common Problems

| Problem | Fix |
|---------|-----|
| Replica lag | Sync replication for critical reads; monitor lag |
| Hot shard | Reshard with better key; salting |
| Connection exhaustion | Connection pooler |
| Slow migrations on large tables | Online schema change tools (pt-online-schema-change) |
| Single primary failure | Automated failover (Patroni, RDS Multi-AZ) |

## Summary

Scale databases in stages: optimize queries, add caching, add read replicas, then vertical scale, then shard. Connection pooling is cheap and effective early. Sharding solves write scaling but adds complexity — don't rush to it. Match storage technology to your access pattern.

---

[Next: Queue →](./07-queue.md)
