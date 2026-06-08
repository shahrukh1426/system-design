# Starter Example: URL Shortener

[← When to Use System Design](./04-when-to-use-system-design.md) | [Day 1 Index](./README.md)

## Why This Example?

A URL shortener (like `bit.ly` or `tinyurl.com`) is the classic intro problem. It's small enough to grasp in one sitting, but rich enough to touch every core concept: APIs, storage, hashing, caching, and scale.

We'll walk through the full design process at a beginner-friendly depth.

## Step 1 — Clarify Requirements

### Functional Requirements

1. Given a long URL, generate a **short URL**
2. Given a short URL, **redirect** to the original long URL
3. Short URLs can have an **optional expiration** time
4. Users can **delete** their short URLs (optional for v1)

### Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Availability | 99.9% |
| Redirect latency | &lt; 100ms |
| Short URL length | As short as possible (e.g. 7 characters) |
| Scale | 100M URLs created, 1B redirects/month |

### Out of Scope (for now)

- User accounts and analytics dashboard
- Custom aliases (e.g. `short.ly/my-brand`)
- Abuse detection and spam filtering

## Step 2 — Back-of-the-Envelope Estimates

### Traffic

- **Writes:** 100M URLs / 30 days ≈ **40 URLs/second**
- **Reads:** 1B redirects / 30 days ≈ **400 reads/second**
- Read-to-write ratio ≈ **10:1** → optimize reads heavily

### Storage

- Average long URL ≈ 500 bytes
- Short code + metadata ≈ 100 bytes
- 100M URLs × 600 bytes ≈ **60 GB** (fits comfortably on one modern database)

### Bandwidth

- Redirect response is tiny (HTTP 301/302) — negligible compared to storage

**Insight:** This is a **read-heavy** system. Caching will matter more than write optimization.

## Step 3 — High-Level Design

```
┌────────┐         ┌──────────────┐         ┌─────────────┐
│ Client │────────▶│  API Server  │────────▶│   Database  │
│        │         │              │         │             │
└────────┘         └──────┬───────┘         └─────────────┘
                          │
                   ┌──────▼───────┐
                   │    Cache     │
                   │   (Redis)    │
                   └──────────────┘
```

### Two Core APIs

**Create short URL**

```
POST /api/v1/urls
Body: { "long_url": "https://example.com/very/long/path" }

Response: { "short_url": "https://short.ly/abc1234" }
```

**Redirect**

```
GET /abc1234
→ 301 Redirect to https://example.com/very/long/path
```

## Step 4 — Short Code Generation

How do we produce `abc1234`?

### Option A: Hash-Based

```
hash(long_url) → take first 7 chars → "abc1234"
```

- **Pro:** Deterministic — same URL always gets same short code
- **Con:** Hash collisions need handling (append salt, retry)

### Option B: Counter-Based (Base62)

```
auto_increment_id → encode to Base62 → "abc1234"
```

- **Pro:** No collisions, predictable length
- **Con:** Reveals total URL count; single counter can be a bottleneck at extreme scale

### Option C: Random String

```
generate random 7-char alphanumeric → check DB for uniqueness
```

- **Pro:** Simple, no collision risk at small scale
- **Con:** Must check uniqueness on every insert

**Choice for this example:** Counter-based (Base62) — simple, no collisions, easy to explain. At 100M URLs, a single counter is fine.

### Base62 Encoding

Characters: `a-z`, `A-Z`, `0-9` (62 total)

| ID | Base62 |
|----|--------|
| 1 | `b` |
| 62 | `10` |
| 1,000,000 | `4c92` |
| 62^7 ≈ 3.5 trillion | 7 chars covers plenty of headroom |

## Step 5 — Database Schema

```sql
CREATE TABLE urls (
    id          BIGSERIAL PRIMARY KEY,
    short_code  VARCHAR(7) UNIQUE NOT NULL,
    long_url    TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    expires_at  TIMESTAMP NULL,
    is_active   BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_short_code ON urls(short_code);
```

**Why index on `short_code`?** Redirect lookups query by short code — this must be fast.

## Step 6 — Deep Dive: The Redirect Path

Redirects are the hot path (400 req/s). Optimize them.

```
1. Client requests GET /abc1234
2. Check Redis cache for "abc1234"
   → HIT:  return 301 redirect immediately
   → MISS: query database
3. Store result in cache (TTL: 24 hours)
4. Return 301 redirect
```

### Why 301 (Permanent) vs 302 (Temporary)?

- **301:** Browsers cache the redirect — less load on your servers
- **302:** Every click hits your server — useful if destination might change

For a URL shortener, **301** is the standard choice.

### Cache Sizing

- 400 req/s × 86,400 sec ≈ 35M requests/day
- Cache the most popular 20% of URLs (Pareto principle) → covers ~80% of traffic
- 20M URLs × ~500 bytes ≈ **10 GB RAM** — fits in a modest Redis instance

## Step 7 — Scaling Beyond the Starter

What changes at 10x or 100x scale?

| Challenge | Solution |
|-----------|----------|
| Single API server | Load balancer + multiple app servers |
| Database read load | Read replicas |
| Database write bottleneck | Shard by `short_code` hash range |
| Counter single point of failure | Distributed ID generator (Snowflake, UUID) |
| Global latency | CDN or geo-distributed caches |
| Hot short URLs | Local in-memory cache on app servers |

You don't need these on day one. Design so you **can add them** without rewriting everything.

## Step 8 — Trade-offs Summary

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Short code strategy | Base62 counter | Hash | No collisions, simple |
| Redirect type | 301 Permanent | 302 Temporary | Browsers cache, less load |
| Cache | Redis | None | 10:1 read ratio demands it |
| Database | PostgreSQL | NoSQL | Structured data, ACID, 60 GB is small |
| Architecture | Monolith + cache | Microservices | Team size and scale don't justify split yet |

## What You Just Practiced

Even in this starter example, you applied the full system design loop:

1. ✅ Clarified functional and non-functional requirements
2. ✅ Estimated scale (traffic, storage, bandwidth)
3. ✅ Drew a high-level architecture
4. ✅ Chose algorithms (Base62 encoding)
5. ✅ Designed the data model
6. ✅ Optimized the hot path (redirect + cache)
7. ✅ Discussed trade-offs and future scaling

That's the same process you'll use for chat systems, news feeds, ride-sharing apps, and everything else in this series.

## Summary

A URL shortener teaches the complete design workflow in miniature: requirements, estimates, architecture, APIs, storage, caching, and trade-offs. Start simple (monolith + PostgreSQL + Redis), then evolve as scale demands.

---

**Day 1 complete.** When you're ready, paste Day 2 topics and we'll continue building the series.

[← Back to Day 1 Index](./README.md)
