# Performance Design

[← API Design](./09-api-design.md) | [Day 2 Index](./README.md) | [Next: Observability Design →](./11-observability-design.md)

## What Is Performance Design?

**Performance design** ensures your system meets latency and throughput targets under expected load. It's about making the system *fast enough* — not necessarily as fast as possible.

It answers: *How fast must it be, where are the bottlenecks, and how do we optimize?*

## Performance vs Scalability

| Performance | Scalability |
|-------------|-------------|
| Make each request faster | Handle more requests |
| Optimize code, cache, indexes | Add servers, shard data |
| "200ms response time" | "10,000 requests/second" |

A system can scale to many users but feel slow. Both dimensions matter.

## Key Metrics

| Metric | Definition | Typical Target |
|--------|------------|----------------|
| **Latency** | Time to complete one request | p50, p95, p99 |
| **Throughput** | Requests handled per second | QPS, TPS |
| **Response time** | End-to-end time for user | < 200ms for APIs |
| **Time to First Byte (TTFB)** | Time until first data arrives | < 100ms |
| **Error rate** | % of failed requests under load | < 0.1% |

### Why Percentiles, Not Averages

```
100 requests: 99 at 50ms, 1 at 5000ms
Average: 99.5ms  ← looks fine
p99: 5000ms      ← reveals the bad experience
```

Always measure **p50, p95, and p99**. The tail latency is what users complain about.

## The Performance Optimization Hierarchy

Optimize in this order — highest impact first:

```
1. Don't do the work       → cache, avoid unnecessary calls
2. Do less work            → pagination, field selection, compression
3. Do work asynchronously  → queues, background jobs
4. Do work in parallel     → concurrent requests, batch processing
5. Do work faster          → better algorithms, faster hardware
```

Most teams jump to #5. Start at #1.

## Caching Strategy

The single biggest performance lever.

### Cache Layers

```
Browser Cache → CDN → Application Cache (Redis) → Database
   (free)      (edge)    (fast memory)           (slow disk)
```

### Cache Patterns

| Pattern | How It Works | Use Case |
|---------|--------------|----------|
| **Cache-aside** | App checks cache, on miss reads DB and populates cache | General purpose |
| **Write-through** | Write to cache and DB simultaneously | Data that must always be fresh |
| **Write-behind** | Write to cache, async flush to DB | Write-heavy, latency-sensitive |
| **Read-through** | Cache sits in front of DB, app only talks to cache | Simpler app code |

### Cache Invalidation

> "There are only two hard things in computer science: cache invalidation and naming things."

| Strategy | When |
|----------|------|
| **TTL (time-to-live)** | Data can be stale for N seconds |
| **Event-based** | Invalidate on write/update event |
| **Version-based** | Cache key includes data version |

```
Cache key design:
  user:123:profile        → TTL 5 min
  product:456:details     → TTL 1 hour
  homepage:featured       → TTL 30 sec
```

## Database Performance

### Query Optimization

```sql
-- Slow: full table scan
SELECT * FROM orders WHERE status = 'ACTIVE';

-- Fast: uses index
SELECT id, total FROM orders WHERE status = 'ACTIVE' AND created_at > '2024-01-01';
-- INDEX: (status, created_at)
```

### Connection Pooling

```
Without pooling: open/close DB connection per request (expensive)
With pooling:    reuse connections from a pool (PgBouncer, HikariCP)

Pool size ≈ (core_count × 2) + effective_spindle_count
```

### Read vs Write Optimization

| Read-Heavy | Write-Heavy |
|------------|-------------|
| Read replicas | Sharding |
| Denormalized views | Batch writes |
| Aggressive caching | Write-behind cache |
| Materialized views | Append-only logs |

## Network Performance

| Technique | Impact |
|-----------|--------|
| **CDN** | Serve static assets from edge (images, JS, CSS) |
| **Compression** | gzip/brotli for text responses (60–80% smaller) |
| **HTTP/2** | Multiplexed connections, header compression |
| **Keep-alive** | Reuse TCP connections |
| **Payload reduction** | Return only needed fields (`?fields=id,name`) |

## Application-Level Optimizations

### Async and Parallel

```
Sequential (slow):
  fetch user    → 50ms
  fetch orders  → 50ms
  fetch cart    → 50ms
  Total: 150ms

Parallel (fast):
  fetch user, orders, cart concurrently
  Total: 50ms (limited by slowest)
```

### Batch Processing

```
Bad:  100 individual DB queries
Good: 1 batch query for 100 items

Bad:  100 API calls to external service
Good: 1 bulk API call
```

### Lazy Loading

Load data only when needed.

```
Page load:     fetch user profile only
Click "Orders": fetch order history (not before)
```

## Performance Budget

Define targets per endpoint type:

| Endpoint Type | p95 Target |
|---------------|------------|
| Read (cached) | < 50ms |
| Read (DB) | < 200ms |
| Write | < 500ms |
| Search | < 300ms |
| File upload | < 2s |
| Background job | < 30s |

Track in CI/CD — fail builds that exceed budget.

## Load Testing

Don't guess performance. Measure it.

| Tool | Use |
|------|-----|
| **k6** | Scriptable load tests |
| **Locust** | Python-based, distributed |
| **JMeter** | GUI-based, enterprise |
| **wrk** | Quick HTTP benchmarking |

```
Test scenarios:
  1. Baseline: expected load
  2. Peak: 3× expected load
  3. Stress: find breaking point
  4. Soak: sustained load for hours (memory leaks)
```

## Performance Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| Premature optimization | Profile first, optimize bottlenecks |
| No caching | Add cache at appropriate layer |
| N+1 queries | Batch or join queries |
| Synchronous external calls | Parallelize or async |
| Returning full objects | Field selection, pagination |
| No connection pooling | Use a pool manager |

## Summary

Performance design targets latency and throughput with measurable budgets. Start by avoiding unnecessary work (caching), then reduce work (pagination, compression), then parallelize, and only then optimize code. Measure with percentiles, profile before optimizing, and load test before launch.

---

[Next: Observability Design →](./11-observability-design.md)
