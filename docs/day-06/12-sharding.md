# Sharding

[← Replication](./11-replication.md) | [Day 6 Index](./README.md)

## What Is Sharding?

**Sharding** (horizontal partitioning) splits data across **multiple independent databases** so each shard holds a subset of the data.

```
One database (limit):
  ┌─────────────────────────┐
  │  500M rows, all writes  │
  │  single disk, CPU ceiling│
  └─────────────────────────┘

Sharded:
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Shard 0  │ │ Shard 1  │ │ Shard 2  │ │ Shard 3  │
  │ 125M rows│ │ 125M rows│ │ 125M rows│ │ 125M rows│
  └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

[Replication](./11-replication.md) copies the **same** data to many nodes (scale reads).  
Sharding splits **different** data across nodes (scale writes and storage).

## When to Shard

| Signal | Detail |
|--------|--------|
| Write throughput exceeds single primary | Inserts/updates bottleneck |
| Table exceeds single-machine storage | Terabytes on one node |
| Index no longer fits in memory | Performance cliff |
| Replication not enough | Writes still hit one primary |

**Don't shard early.** Path: optimize → cache → read replicas → vertical scale → **then** shard.

## Shard Key

The column (or hash) that determines which shard owns a row.

```sql
shard_id = hash(user_id) % 4

user_id 101 → hash % 4 → Shard 1
user_id 205 → hash % 4 → Shard 3
```

### Good Shard Keys

| Key | Why |
|-----|-----|
| `user_id` | Even distribution, queries often per-user |
| `tenant_id` | Natural isolation in multi-tenant SaaS |
| `order_id` (UUID) | Random, no hot spots |

### Bad Shard Keys

| Key | Problem |
|-----|---------|
| `country` | US = 80% of data on one shard |
| `created_date` | All today's data on one shard |
| `status` | Only 2 values → 2 shards used |

**Hot shard:** One shard gets disproportionate traffic — sharding didn't help.

## Sharding Architectures

### Application-Level Sharding

App code routes queries to the right shard.

```python
def get_shard(user_id):
    return shards[hash(user_id) % NUM_SHARDS]

def get_user(user_id):
    shard = get_shard(user_id)
    return shard.query("SELECT * FROM users WHERE id = ?", user_id)
```

```
┌──────────────┐
│  Application │
│  (router)    │
└──────┬───────┘
       │
   ┌───┼───┬───────┐
   ▼   ▼   ▼       ▼
 Shard0 Shard1 Shard2 Shard3
```

| Pros | Cons |
|------|------|
| Full control | Logic in every service |
| Any database | Hard to change shard count |
| | Cross-shard queries painful |

### Proxy-Based Sharding

Middleware router (Vitess, Citus, ProxySQL) sits between app and shards.

```
Application → Vitess / Citus Router → correct shard(s)
```

| Pros | Cons |
|------|------|
| App sees one logical database | Operational complexity |
| Vitess (YouTube), Citus (Postgres) | Vendor/tool specific |

### Database-Native

| System | Sharding Model |
|--------|----------------|
| **MongoDB** | Shard key per collection |
| **Cassandra** | Partition key |
| **DynamoDB** | Partition key + sort key |
| **CockroachDB** | Automatic range sharding |

Built-in — no app router, but design partition key carefully.

## Single-Shard vs Cross-Shard Queries

### Single-Shard (Easy)

All data for query on one shard.

```sql
-- user_id = 101 → all on Shard 1
SELECT * FROM orders WHERE user_id = 101;
```

Route by `user_id` → one shard → fast.

### Cross-Shard (Hard)

Query spans multiple shards.

```sql
-- No user_id filter → must query ALL shards
SELECT COUNT(*) FROM orders WHERE status = 'ACTIVE';
```

```
Router → Shard 0: COUNT = 1000
      → Shard 1: COUNT = 1500
      → Shard 2: COUNT = 800
      → Shard 3: COUNT = 1200
      → merge: 4500
```

4× queries, 4× latency, merge in application. Avoid in hot paths.

## Sharding Strategies

### Hash Sharding

```
shard = hash(key) % N
```

Even distribution. Resharding (changing N) requires moving most data.

### Range Sharding

```
user_id 1–1M      → Shard 0
user_id 1M–2M     → Shard 1
user_id 2M–3M     → Shard 2
```

Range queries efficient. Risk of hot spots on latest range.

### Directory / Lookup Sharding

Lookup table maps key → shard.

```
user_id 101 → Shard 2  (stored in routing table)
```

Flexible reassignment. Lookup table is single point of failure / bottleneck.

### Geographic Sharding

```
EU users   → EU shard cluster
US users   → US shard cluster
```

Data locality, compliance (GDPR). Cross-region queries expensive.

## Challenges

### Resharding

Growing from 4 to 8 shards means moving ~half the data.

```
Approaches:
  1. Dual-write during migration
  2. Consistent hashing (minimal movement when adding nodes)
  3. Vitess resharding tooling
  4. Create new cluster, migrate, cutover
```

Plan shard count headroom. Going from 4 → 8 is a **project**, not a config change.

### Referential Integrity

Foreign keys across shards don't work natively.

```
users on Shard 1, orders on Shard 2
  → no FK constraint between them
  → enforce in application or duplicate user snapshot on order shard
```

### Distributed Transactions

Transaction spanning two shards ≈ distributed 2PC — slow and fragile.

```
Prefer: design so related data lives on same shard
  orders + order_items keyed by user_id → same shard
```

### Unique Constraints Global

```
UNIQUE email across all users:
  email on Shard 1 only? → duplicate email on Shard 2 possible

Fix: global index service, or hash email into shard key
```

## Sharding vs Partitioning

| Sharding | Partitioning (single DB) |
|----------|--------------------------|
| Separate database servers | One server, split tables internally |
| Scale writes horizontally | Manage large tables on one machine |
| App/router complexity | Transparent to app (mostly) |

PostgreSQL declarative partitioning is **not** sharding — same server unless you attach partitions on different nodes (advanced).

## Real-World Examples

| Company | Approach |
|---------|----------|
| Instagram | Sharded PostgreSQL by user_id |
| Uber | Schemaless on MySQL shards |
| Discord | Cassandra for messages |
| Shopify | Vitess on MySQL |

## Sharding Checklist

- [ ] Exhausted replication and vertical scale first
- [ ] Shard key chosen for even distribution
- [ ] Related data co-located on same shard
- [ ] Cross-shard queries avoided in hot paths
- [ ] Resharding plan documented
- [ ] Global uniqueness strategy defined
- [ ] Monitoring per-shard (lag, size, QPS)

## Summary

Sharding splits data across multiple databases to scale writes and storage beyond one machine. Choose a **shard key** that distributes evenly and keeps related rows together. Application-level routing is common; tools like Vitess and Citus simplify operations. Avoid cross-shard queries and plan resharding before you need it — sharding is powerful but operationally heavy.

---

**Day 6 complete.** Paste Day 7 when ready.

[← Back to Day 6 Index](./README.md) | [Day 5: DB Scaling](../day-05/06-db-scaling.md)
