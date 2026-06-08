# Connection Pooling

[← N+1 Query Problems](./09-n-plus-one-query-problems.md) | [Day 6 Index](./README.md) | [Next: Replication →](./11-replication.md)

## What Is Connection Pooling?

A **connection pool** maintains a set of reusable database connections. Instead of opening a new connection per request, the app **borrows** from the pool and **returns** it when done.

```
Without pool:
  Request 1 → open connection (50ms) → query → close
  Request 2 → open connection (50ms) → query → close
  Request 3 → open connection (50ms) → query → close

With pool:
  Startup → open 20 connections (once)
  Request 1 → borrow conn #3 → query → return to pool
  Request 2 → borrow conn #7 → query → return to pool
  Request 3 → borrow conn #3 → query → return to pool
```

Opening a connection is **expensive** — TCP handshake, TLS, authentication, memory on DB server.

## Why Connections Are Costly

| Step | Cost |
|------|------|
| TCP + TLS to database | 5–50ms |
| Authentication | 1–10ms |
| Memory per connection (PostgreSQL) | ~5–10 MB |
| Process/thread on DB side | Limited OS resources |

```
PostgreSQL default: max_connections = 100
10 app servers × 50 connections each = 500 demanded → rejected
```

Databases limit max connections. Pools control usage.

## How a Pool Works

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│ App Server  │────▶│ Connection Pool │────▶│  PostgreSQL  │
│ (100 threads)│     │ (20 connections)│     │ (max 100)   │
└─────────────┘     └─────────────────┘     └──────────────┘
```

```
Pool state:
  Active:  8 connections in use
  Idle:   12 connections ready
  Max:    20 connections

Request arrives:
  1. Borrow idle connection (or wait if all busy)
  2. Execute query
  3. Return connection to pool (NOT closed)
```

### Pool Exhaustion

```
All 20 connections busy → request 21 waits (or times out)

ERROR: timeout waiting for connection from pool
```

Symptoms: slow responses, timeouts under load — not necessarily slow queries.

## Pool Sizing

There's no universal formula. Starting points:

```
connections = (core_count × 2) + effective_spindle_count
-- classic rule for dedicated DB server

Practical for web apps:
  pool_size per app instance = 10–30
  total to DB = instances × pool_size
  must be < database max_connections
```

| Factor | Guidance |
|--------|------------|
| App server instances | More instances → smaller pool each |
| DB max_connections | Leave headroom for admin, replicas |
| Request duration | Long queries → need more connections |
| Workers + web combined | Count all processes sharing pool |

```
Example:
  4 app servers × 20 pool = 80 connections
  2 worker processes × 10 pool = 20 connections
  Total = 100 → matches PostgreSQL default max
```

## Pool Layers

### Application-Level Pool

Built into ORM or driver.

```python
# SQLAlchemy
engine = create_engine(
    'postgresql://...',
    pool_size=20,
    max_overflow=10,      # extra connections under burst
    pool_timeout=30,      # wait seconds for connection
    pool_recycle=3600,    # recycle connections after 1 hour
)
```

```javascript
// Prisma — connection limit in DATABASE_URL
DATABASE_URL="postgresql://...?connection_limit=20"
```

### External Pooler (PgBouncer, RDS Proxy)

Sits between many app servers and the database.

```
App 1 (50 conns) ──┐
App 2 (50 conns) ──┼──▶ PgBouncer (pools to 30 real) ──▶ PostgreSQL
App 3 (50 conns) ──┘
```

| Mode | Behavior |
|------|----------|
| **Transaction pooling** | Connection returned after each transaction (most efficient) |
| **Session pooling** | Connection held for client session |
| **Statement pooling** | Returned after each statement (breaks some features) |

PgBouncer lets **thousands of client connections** multiplex onto **dozens of real DB connections**.

## Connection Lifecycle Issues

### Leaked Connections

Borrowed but never returned — pool drains over time.

```python
# Bad: exception before return
conn = pool.get_connection()
do_something_that_raises()
conn.close()   # never reached

# Good: context manager
with pool.connection() as conn:
    conn.execute(query)
# always returned
```

### Stale Connections

Database or firewall drops idle connections.

```
Fix: pool_recycle=3600  (recreate connection every hour)
     pool_pre_ping=True  (test connection before use)
```

### Long-Running Queries Holding Connections

```
One report query runs 5 minutes → holds connection entire time

Fix: separate read replica for reports
     or smaller pool reserved for OLTP
```

## Monitoring

| Metric | Healthy | Problem |
|--------|---------|---------|
| Pool active connections | Steady under load | Pegged at max constantly |
| Wait time for connection | < 10ms | Growing timeouts |
| DB total connections | < 80% of max | Near max_connections |
| Idle connections | Some available | Zero idle under normal load |

```sql
-- PostgreSQL: current connections
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
```

## Connection Pooling vs Caching

| Connection Pool | Data Cache (Redis) |
|-----------------|-------------------|
| Reuses DB connections | Avoids DB queries entirely |
| Infrastructure concern | Application concern |
| Solves connection overhead | Solves read latency |

Use both — they solve different problems.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| pool_size = 100 per instance | Size per instance, sum across fleet |
| No pooler with many microservices | PgBouncer or RDS Proxy |
| Not using pool in workers | Workers need pools too |
| pool_recycle not set | Connections die silently |
| One global pool for sync + async | Separate pools or careful sizing |

## Summary

Connection pooling reuses database connections to avoid expensive open/close per request. Size pools per app instance so total connections stay under database limits. Use PgBouncer or RDS Proxy when many services connect to one database. Monitor pool exhaustion — it's a common cause of timeouts under load.

---

[Next: Replication →](./11-replication.md)
