# Replication

[← Connection Pooling](./10-connection-pooling.md) | [Day 6 Index](./README.md) | [Next: Sharding →](./12-sharding.md)

## What Is Replication?

**Replication** copies data from one database server (primary) to one or more **replica** servers in near real time.

```
         ┌──────────────┐
Writes ─▶│   Primary    │
         │   (Leader)   │
         └──────┬───────┘
                │ replication stream
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│Replica1│ │Replica2│ │Replica3│  ← Reads
└────────┘ └────────┘ └────────┘
```

Primary handles writes. Replicas handle reads (and standby for failover).

## Why Replicate?

| Goal | How Replication Helps |
|------|----------------------|
| **Scale reads** | Distribute SELECT across replicas |
| **High availability** | Promote replica if primary fails |
| **Backups** | Backup from replica without load on primary |
| **Geo distribution** | Replica in another region, closer to users |
| **Reporting** | Heavy analytics on replica, not production primary |

See also [Day 5: DB Scaling](../day-05/06-db-scaling.md) for when to add replicas in your scaling roadmap.

## How Replication Works

### Physical (Binary) Replication

Copy exact disk blocks / WAL bytes. Byte-for-byte copy of data files.

```
Primary WAL stream → Replica applies same WAL entries
```

| Pros | Cons |
|------|------|
| Fast, low overhead | Same DB version, same platform |
| Exact copy | Can't replicate single table |

PostgreSQL streaming replication, MySQL replication (row or statement based).

### Logical Replication

Copy **data changes** (row inserts/updates/deletes) as logical events.

```
Primary: INSERT INTO users VALUES (5, 'Alice')
         → logical event → Replica applies same INSERT
```

| Pros | Cons |
|------|------|
| Selective (specific tables) | More overhead |
| Cross-version possible | Slightly more lag |
| Different indexes on replica | |

PostgreSQL logical replication, MySQL GTID replication.

## Replication Flow (PostgreSQL Example)

```
1. Client commits transaction on Primary
2. Change written to WAL (Write-Ahead Log)
3. WAL sender streams to Replica
4. Replica WAL receiver writes to local WAL
5. Replica replays WAL → data pages updated
6. Replica acknowledges position to Primary
```

```
Primary                          Replica
   │                                │
   │──── WAL record (INSERT) ──────▶│
   │                                │ apply to data
   │◀─── ACK (received up to LSN) ──│
```

**LSN (Log Sequence Number)** — position in WAL stream. Lag = how far replica is behind.

## Sync vs Async Replication

### Asynchronous (Default)

Primary commits **without waiting** for replica to confirm.

```
Client → COMMIT → Primary responds "OK"
                    (replica catches up later)
```

| Pros | Cons |
|------|------|
| Fast writes | Replica may be behind (lag) |
| Primary not blocked by slow replica | Failover may lose recent data |

### Synchronous

Primary waits for **at least one replica** to confirm before commit.

```
Client → COMMIT → Primary waits → Replica ACK → "OK" to client
```

| Pros | Cons |
|------|------|
| No data loss on failover | Slower writes |
| Stronger durability | Primary blocked if replica down |

```
synchronous_commit = on
synchronous_standby_names = 'replica1'
```

Use sync for financial data; async for most web apps.

## Replication Lag

Time between write on primary and visibility on replica.

```
Primary:  UPDATE products SET price = 19.99 at 10:00:00.000
Replica:  visible at 10:00:00.150
Lag: 150ms
```

### Causes of Lag

| Cause | Detail |
|-------|--------|
| Heavy write load | Replica can't apply WAL fast enough |
| Slow replica hardware | Weaker CPU/disk than primary |
| Large transactions | Big bulk update takes long to replay |
| Network latency | Cross-region replication |
| Replica also serving reads | CPU shared with apply process |

### Monitoring Lag

```sql
-- PostgreSQL
SELECT pg_last_wal_replay_lag;

-- MySQL
SHOW REPLICA STATUS;  -- Seconds_Behind_Source
```

Alert when lag exceeds threshold (e.g. > 5 seconds).

## Read-After-Write Problem

User updates data on primary, then reads from replica — sees **old value**.

```
1. User updates profile name → primary
2. User refreshes page → read from replica (lag 200ms)
3. Still shows old name
```

### Fixes

| Fix | Detail |
|-----|--------|
| **Read-your-writes** | Route user's reads to primary after their write |
| **Session stickiness** | Same connection to primary for session |
| **Lag-aware routing** | Don't use replica if lag > threshold |
| **Client tolerance** | UI shows "saving..." until confirmed |

## Failover

Primary dies → promote replica to new primary.

```
Automatic failover (Patroni, RDS Multi-AZ, Orchestrator):
  1. Detect primary down (health check)
  2. Elect replica with least lag
  3. Promote replica to primary
  4. Update DNS / connection string
  5. Other replicas follow new primary

Downtime: seconds to minutes
```

### Split-Brain Risk

Two nodes think they're primary → diverging writes.

```
Prevention: quorum, fencing (STONITH), managed failover tools
```

## Read Replica Routing

```
Application layer:
  writes → primary connection
  reads  → replica pool (round-robin)

ORM / driver support:
  Rails: connects_to role: :reading
  PostgreSQL: separate connection URLs
```

```python
# Conceptual
def get_user(user_id, force_primary=False):
    if force_primary:
        return primary.query(...)
    return replica_pool.query(...)
```

## Replication vs Backup

| Replication | Backup |
|-------------|--------|
| Continuous, near real-time | Point-in-time snapshot |
| Protects against primary failure | Protects against corruption, accidental DELETE |
| Not a substitute for backup | Not a substitute for replication |

**Use both.** Replica won't help if someone drops a table — you need backup.

## Summary

Replication streams changes from primary to replicas for read scaling and failover. Async replication is fast but has lag; sync is durable but slower. Watch replication lag, handle read-after-write for user-facing flows, and use managed failover for production. Replicas complement — not replace — backups.

---

[Next: Sharding →](./12-sharding.md)
