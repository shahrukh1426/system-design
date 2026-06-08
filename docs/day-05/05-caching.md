# Caching

[← CDN](./04-cdn.md) | [Day 5 Index](./README.md) | [Next: DB Scaling →](./06-db-scaling.md)

## What Is Caching?

**Caching** stores a copy of data in a fast storage layer so future requests skip the slow path of fetching or computing it again.

```
Without cache:  Request → Database (50ms) → Response
With cache:     Request → Redis (1ms) → Response
                (database not touched)
```

The goal is simple: **don't repeat expensive work**.

## Why It Exists

| Slow Path | Cache Benefit |
|-----------|---------------|
| Database query (10–100ms) | Memory read (~1ms) |
| External API call (100–500ms) | Local copy instant |
| Heavy computation (seconds) | Precomputed result |
| Disk read | RAM read 1000× faster |

Most web apps are **read-heavy**. Caching is often the highest-impact performance improvement.

## Cache Layers (Top to Bottom)

```
┌─────────────────────────────────────────┐
│  1. Browser Cache     (user's device)  │
├─────────────────────────────────────────┤
│  2. CDN / Edge Cache  (near user)        │
├─────────────────────────────────────────┤
│  3. Reverse Proxy     (Nginx cache)      │
├─────────────────────────────────────────┤
│  4. Application Cache (Redis, Memcached) │
├─────────────────────────────────────────┤
│  5. Database Cache    (query cache, buffer pool) │
├─────────────────────────────────────────┤
│  6. Source of Truth   (database, API)    │
└─────────────────────────────────────────┘
```

Each layer catches what the one above missed.

## Caching Patterns

### 1. Cache-Aside (Lazy Loading)

Most common pattern. Application manages the cache.

```
Read:
  1. Check cache for key
  2. HIT  → return cached data
  3. MISS → query database
  4. Store result in cache with TTL
  5. Return data

Write:
  1. Write to database
  2. Invalidate or update cache
```

```python
def get_product(product_id):
    cache_key = f"product:{product_id}"
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)

    product = db.query("SELECT * FROM products WHERE id = ?", product_id)
    redis.setex(cache_key, 3600, json.dumps(product))  # TTL 1 hour
    return product
```

### 2. Read-Through

Cache sits in front of DB. App only talks to cache; cache loads from DB on miss.

```
App → Cache → (miss) → DB
App ← Cache ← data
```

Simpler app code; cache library handles loading.

### 3. Write-Through

Write to cache and DB simultaneously.

```
Write → Cache → DB (sync)
```

Cache always fresh, but writes are slower.

### 4. Write-Behind (Write-Back)

Write to cache immediately; flush to DB asynchronously.

```
Write → Cache → (async) → DB
```

Fast writes; risk of data loss if cache dies before flush.

### 5. Refresh-Ahead

Cache expires soon → proactively refresh before miss.

```
TTL almost expired → background job refreshes cache
User never sees a cache miss
```

Good for predictable hot keys.

## What to Cache

| Cache This | Skip This |
|------------|-----------|
| Frequently read data | Rarely accessed data |
| Expensive queries | Cheap, fast queries |
| Stable data (product catalog) | Rapidly changing data (stock ticker) |
| Aggregated reports | User-specific sensitive data (unless encrypted) |
| Session data | Large blobs rarely reused |

### Pareto Principle

Often **20% of keys serve 80% of reads**. Cache that 20%.

```
Top products page  →  millions of reads  → cache aggressively
Obscure admin report →  2 reads/day        → don't cache
```

## Cache Keys

Design keys carefully — they're your namespace.

```
product:12345           # single product
products:page:1         # paginated list
user:789:cart           # user-specific
session:abc123          # session data
```

| Rule | Example |
|------|---------|
| Be specific | `user:123:profile` not just `user` |
| Include version if schema changes | `product:v2:12345` |
| Consistent naming | `service:entity:id` |

## TTL (Time to Live)

How long cached data lives before expiring.

| Data Type | Typical TTL |
|-----------|-------------|
| Static config | 24 hours |
| Product catalog | 1–6 hours |
| User session | 30 minutes |
| API rate limit counters | 1 minute |
| Real-time leaderboard | 10–30 seconds |

**Too long:** stale data shown to users.  
**Too short:** cache useless, DB still hammered.

## Cache Invalidation

> "There are only two hard things in computer science: cache invalidation and naming things."

| Strategy | How | When |
|----------|-----|------|
| **TTL expiry** | Auto-delete after N seconds | Data can be briefly stale |
| **Event-based** | On update, delete cache key | Need fresher data |
| **Version-based** | Key includes version number | Schema or bulk updates |

```
Product updated in DB:
  → DELETE cache key "product:12345"
  → Next read repopulates from DB
```

## Cache Problems

### Cache Stampede (Thundering Herd)

Popular key expires → 1000 requests all miss → 1000 DB queries at once.

```
Fixes:
  - Lock: only one request rebuilds cache, others wait
  - Probabilistic early expiry: stagger refresh times
  - Never expire hot keys — background refresh instead
```

### Stale Data

User sees old price after update.

```
Fix: invalidate on write, or short TTL for volatile data
```

### Cache Penetration

Requests for data that doesn't exist (invalid IDs) bypass cache every time.

```
Fix: cache empty results too (with short TTL)
     "product:99999" → null (cached 60s)
```

### Cache Avalanche

Cache dies entirely → all traffic hits DB → DB dies too.

```
Fix: circuit breaker, fallback, multiple cache nodes (Redis cluster)
```

## Redis vs Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| Data structures | Strings, lists, sets, hashes | Strings only |
| Persistence | Optional (RDB, AOF) | Pure memory |
| Pub/Sub | Yes | No |
| Clustering | Redis Cluster | Client-side sharding |
| Use case | Cache + sessions + queues | Simple pure cache |

**Redis** is the default choice for most new projects.

## Caching in the Request Path

From [Day 4's website scenario](../day-04/01-visit-website-scenario.md):

```
GET /products
  → Browser cache? miss
  → CDN? miss
  → App server
      → Redis cache "products:page:1"? HIT → return (5ms)
      → MISS → PostgreSQL query (50ms) → store in Redis → return
```

## When Not to Cache

- Financial transactions requiring real-time accuracy
- Strong consistency required on every read
- Data changes every request
- Dataset too large for memory

## Summary

Caching stores hot data in fast memory to avoid repeated slow work. Use cache-aside for most cases, set sensible TTLs, invalidate on writes, and guard against stampede and penetration. Stack caches at multiple layers — browser, CDN, Redis — each catching what the previous layer missed.

---

[Next: DB Scaling →](./06-db-scaling.md)
