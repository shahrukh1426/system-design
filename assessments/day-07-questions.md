# Caching Deep Dive — MCQ Questions (50)

Multi-select format: each question has **two or more** correct answers. Questions tagged **[Case Study]** include a business context block.

> **Answers and explanations:** see [answer-key/day-07-answers.md](./answer-key/day-07-answers.md)

---

### Q01 [Easy] [Case Study] — RetailHub Product Page Load

**Context:** RetailHub serves 50,000 product page reads per second. Each uncached read hits PostgreSQL (~15 ms). P95 user-facing latency target is under 50 ms.

**Select all that apply.**

Why is application-level caching appropriate here?

- [ ] A. Product catalog data is read far more often than it is updated
- [ ] B. RAM access (~microseconds to low milliseconds for Redis) is orders of magnitude faster than a DB round trip
- [ ] C. Caching replaces PostgreSQL as the source of truth for orders and payments
- [ ] D. A 95% cache hit rate reduces DB read load to roughly 5% of request volume

---

### Q02 [Easy] — Cache vs Database

**Select all that apply.**

Which distinguish a cache from a database?

- [ ] A. Cache is a temporary copy optimized for speed — not the authoritative store
- [ ] B. Cache entries may be evicted; data loss on Redis restart is acceptable if refillable from DB
- [ ] C. Cache guarantees durable ACID transactions like PostgreSQL
- [ ] D. A cache miss is normal — the system refills from the source of truth

---

### Q03 [Easy] [Case Study] — RetailHub Static Assets

**Context:** RetailHub's `app.js` (2 MB) is served from origin on every visit. CDN hit ratio is 0%. Browser cache headers are missing.

**Select all that apply.**

Which layers should catch static asset traffic?

- [ ] A. Answer as close to the user as possible — browser and CDN before origin
- [ ] B. Browser cache with long `Cache-Control: max-age` for versioned static files
- [ ] C. CDN edge cache closer to users than the origin datacenter
- [ ] D. Load balancer internal pass-through replaces browser and CDN caching

---

### Q04 [Easy] — What Not to Cache

**Select all that apply.**

Which data should NOT be served from cache for the authoritative write path?

- [ ] A. Live bank balance used to authorize a $500 transfer
- [ ] B. One-time OTP codes
- [ ] C. Product catalog metadata updated hourly by admins (with TTL + invalidation)
- [ ] D. Real-time flash-sale inventory where stale stock causes overselling

---

### Q05 [Easy] [Case Study] — RetailHub Session Store

**Context:** RetailHub runs 40 stateless API pods behind a load balancer. Sessions were stored in pod memory — users lose login when routed to another pod.

**Select all that apply.**

What fixes session stickiness across instances?

- [ ] A. Centralized Redis for shared session storage
- [ ] B. JWT in client cookie (stateless auth) instead of server memory
- [ ] C. In-process cache on each pod without shared invalidation
- [ ] D. Same Redis key namespace across all app servers (`session:{id}`)

---

### Q06 [Easy] — Cache Key Design

**Select all that apply.**

Which cache key practices improve hit rate and operability?

- [ ] A. Namespace keys: `{service}:{entity}:{id}:{variant}`
- [ ] B. Shared keys for shared data (`product:12345`) serve all users with one entry
- [ ] C. Per-user keys for fully personalized feeds (`feed:user:789`) usually have poor reuse
- [ ] D. Unbounded unique keys for every request maximize hit rate

---

### Q07 [Medium] [Case Study] — RetailHub Cache-Aside Read Path

**Context:** RetailHub uses cache-aside for product pages: check Redis → on miss query PostgreSQL → populate Redis → return. Hit rate is 94%.

**Select all that apply.**

Which statements about this pattern are correct?

- [ ] A. On cache miss the application loads DB and writes the cache entry
- [ ] B. The cache does not automatically sync when the DB is updated — app must invalidate on write
- [ ] C. If Redis is down, the app can bypass cache and read DB (degraded but functional)
- [ ] D. Cache-aside means the cache library auto-updates on every DB write without app code

---

### Q08 [Medium] — Cache-Aside Write Path

**Select all that apply.**

An admin updates a product price in PostgreSQL. RetailHub uses cache-aside. What should happen?

- [ ] A. Update DB first, then delete (invalidate) the cache key — not update cache with stale partial data
- [ ] B. Delete cache before DB commit to guarantee freshness
- [ ] C. Do nothing and rely on a 24-hour TTL only — acceptable for price changes
- [ ] D. On create, no cache entry exists until first read populates it (lazy load)

---

### Q09 [Medium] [Case Study] — RetailHub Profile Settings

**Context:** Users edit profile settings and immediately reload the page. Stale names appear for up to 5 minutes when only TTL is used without invalidation.

**Select all that apply.**

When is write-through caching a better fit than cache-aside?

- [ ] A. Post-write reads must see fresh data immediately with simple read path
- [ ] B. Write volume is low and keys are hot after update
- [ ] C. Every write to cold keys that are never read — write-through is most efficient
- [ ] D. Write-through synchronously updates cache and DB on each write

---

### Q10 [Medium] — Write-Back Cache Risks

**Select all that apply.**

RetailHub considers write-back for like counters on product pages. Which are valid?

- [ ] A. Writes go to cache first; DB flush is asynchronous — fastest write path
- [ ] B. Suitable for non-critical counters where brief loss on crash is acceptable with durable queue/WAL
- [ ] C. Write-back is ideal for payment authorization and inventory deduction without durable flush
- [ ] D. Write-back provides the weakest consistency of the three main write patterns

---

### Q11 [Medium] [Case Study] — RetailHub Admin Price Update

**Context:** Admin changes product price from $29.99 to $19.99. Redis key is deleted after DB commit. CDN still shows $29.99 for 10 minutes. Users complain checkout charges $19.99 but listing shows old price.

**Select all that apply.**

What does this incident reveal about invalidation?

- [ ] A. Invalidating Redis alone is insufficient — CDN and browser may still serve stale content
- [ ] B. TTL alone leaves a stale window; production uses TTL plus explicit invalidation on write
- [ ] C. Delete cache before DB commit prevents all races
- [ ] D. Version bump keys (`product:v2:123`) let old keys expire without hunting every variant

---

### Q12 [Medium] — TTL Best Practices

**Select all that apply.**

Which TTL practices reduce stampedes and stale data risk?

- [ ] A. Add jitter to TTLs so keys do not all expire at the same instant
- [ ] B. Long TTL on stable catalog data paired with delete-on-write invalidation
- [ ] C. Identical TTL on all 1 million keys is safest for hit rate
- [ ] D. Short TTL (10–30 s) for volatile scores; OTP should not be cached at all

---

### Q13 [Medium] [Case Study] — RetailHub Black Friday Stampede

**Context:** RetailHub's `#1 deal` product key expires at midnight. At expiry, 80,000 concurrent requests miss Redis simultaneously. PostgreSQL CPU hits 100% for 90 seconds.

**Select all that apply.**

What describes this failure and valid fixes?

- [ ] A. Cache stampede (thundering herd) — hot key expiry triggers mass DB load
- [ ] B. TTL jitter, singleflight/lock on miss, or refresh-ahead before expiry reduce stampede
- [ ] C. This is cache penetration — attackers querying non-existent keys
- [ ] D. Probabilistic early refresh or stale-while-revalidate can smooth hot-key expiry

---

### Q14 [Medium] — Cache Penetration

An attacker scans `/product/-1` through `/product/-999999`. Every ID misses cache and hits DB.

**Select all that apply.**

Which mitigations apply?

- [ ] A. Cache null/negative results with short TTL for known-missing keys
- [ ] B. Bloom filter in front of cache to skip DB for definitely-absent keys
- [ ] C. TTL jitter alone fixes penetration from invalid key scans
- [ ] D. Input validation and rate limiting at the API edge

---

### Q15 [Hard] [Case Study] — RetailHub Redis Restart

**Context:** RetailHub deploys Redis with no persistence. After restart the cache is empty. DB QPS jumps 20× and checkout errors spike for 3 minutes.

**Select all that apply.**

What failure mode is this and how to prevent it?

- [ ] A. Cache avalanche — entire cache layer empty causes DB overload
- [ ] B. Cache warming before enabling traffic and HA Redis (replicas, Sentinel) reduce blast radius
- [ ] C. Circuit breaker on DB path and graceful degradation during warm-up
- [ ] D. Redis restart never affects DB load if cache-aside is used correctly

---

### Q16 [Hard] — Distributed Cache Architecture

**Select all that apply.**

RetailHub scales Redis beyond one node's RAM. Which statements are correct?

- [ ] A. Redis Cluster shards keys horizontally across nodes
- [ ] B. `noeviction` policy returns errors when memory is full — dangerous default in production
- [ ] C. Local in-process L1 cache shared automatically across all pods without TTL coordination
- [ ] D. Two-level cache (L1 in-process + L2 Redis): invalidate both or keep L1 TTL very short

---

### Q17 [Hard] [Case Study] — RetailHub Hot Celebrity Product

**Context:** A celebrity tweet drives 120,000 req/s to one product ID. Single Redis node CPU saturates on that key.

**Select all that apply.**

Which techniques address hot-key saturation?

- [ ] A. Local in-process cache for the hot key on each app server
- [ ] B. Read replicas for Redis or key splitting / random suffix read aggregation
- [ ] C. CDN cache for public product page HTML/JSON at the edge
- [ ] D. Adding more Redis shards without changing key design always splits one hot key automatically

---

### Q18 [Hard] — Read-Through vs Cache-Aside

**Select all that apply.**

Which compare read-through and cache-aside?

- [ ] A. Read-through: cache library loads DB on miss; app calls `cache.get()` only
- [ ] B. Cache-aside: application explicitly checks cache, loads DB on miss, populates cache
- [ ] C. Read-through means the application never writes to the database
- [ ] D. CDN origin fetch on miss is analogous to read-through behavior

---

### Q19 [Easy] — Multi-Layer Cache Stack

**Select all that apply.**

For `GET /api/public/categories`, which layers may participate?

- [ ] A. Browser cache (if Cache-Control allows)
- [ ] B. CDN edge cache for cacheable public JSON
- [ ] C. Redis application cache for category tree
- [ ] D. MySQL 8.0 built-in query cache replaces Redis

---

### Q20 [Easy] [Case Study] — RetailHub Rate Limit Counter

**Context:** RetailHub tracks API rate limits per API key in Redis with 60-second TTL counters. Keys are `ratelimit:{key}:{minute}`.

**Select all that apply.**

Why is Redis appropriate here?

- [ ] A. Fast increments and TTL expiry suit ephemeral counters
- [ ] B. Shared across all API pods for consistent limits
- [ ] C. Rate limit state must be the permanent financial ledger of record
- [ ] D. Loss on Redis failover may briefly allow extra requests — usually acceptable for rate limits

---

### Q21 [Medium] — Write-Through vs Cache-Aside Writes

**Select all that apply.**

Compare write paths for a low-write, high-read product catalog.

- [ ] A. Cache-aside write: DB update + DELETE cache key — fewer writes to cache for cold keys
- [ ] B. Write-through write: DB update + SET cache key — every write updates cache synchronously
- [ ] C. Write-through adds write latency but simplifies post-update read consistency
- [ ] D. Write-through is the default pattern for all workloads worldwide

---

### Q22 [Medium] [Case Study] — RetailHub Display Balance

**Context:** RetailHub shows approximate account balance on the dashboard with 30-second Redis TTL. Actual transfers always read balance from PostgreSQL with row lock.

**Select all that apply.**

When is display-only caching acceptable?

- [ ] A. Stale display within TTL does not authorize financial actions
- [ ] B. Authoritative debit/credit always reads current DB state with lock
- [ ] C. Cache the balance used to authorize transfers for speed
- [ ] D. Short TTL + clear UX that balance is approximate can be acceptable for display

---

### Q23 [Medium] — HTTP Cache Headers

**Select all that apply.**

Which Cache-Control directives are correct?

- [ ] A. `public, max-age=31536000` for fingerprinted static assets
- [ ] B. `private` — browser only, not shared CDN cache
- [ ] C. `s-maxage=300` overrides shared cache TTL for CDN while browser may revalidate sooner
- [ ] D. `no-store` for sensitive responses that must not persist in any cache

---

### Q24 [Medium] [Case Study] — RetailHub Deploy Cold Start

**Context:** After each deploy Redis is empty. SRE wants to preload top 5,000 product keys before shifting traffic.

**Select all that apply.**

What practice is this and why?

- [ ] A. Cache warming — reduces cold-start miss storm and avalanche risk
- [ ] B. Refresh-ahead — proactively reload keys before TTL expiry on hot paths
- [ ] C. Warm from DB or backup snapshot before enabling load balancer traffic
- [ ] D. Warming guarantees 100% hit rate forever without ongoing invalidation

---

### Q25 [Hard] — Refresh-Ahead Pattern

RetailHub's homepage hero product uses 60-minute TTL. At 54 minutes a background job refreshes the key.

**Select all that apply.**

Which statements are correct?

- [ ] A. Refresh-ahead prevents expiry-time stampede on hot keys
- [ ] B. Refresh-ahead is ongoing proactive refresh; cache warming is typically one-time at startup/deploy
- [ ] C. Refresh-ahead and cache warming are identical operations
- [ ] D. Users never see stale data during refresh-ahead — always zero staleness

---

### Q26 [Hard] — Consistency Spectrum

**Select all that apply.**

Which statements about cache write patterns are correct?

- [ ] A. Write-through synchronously updates cache and DB — strongest typical app-level consistency
- [ ] B. Cache-aside with delete-on-write plus TTL is the common production default
- [ ] C. TTL-only without invalidation on write is the strongest consistency approach
- [ ] D. Write-back flushes to DB asynchronously — weakest consistency, highest write speed

---

### Q27 [Easy] — Monitoring Cache Health

**Select all that apply.**

Which signals indicate a broken cache layer?

- [ ] A. Hit rate drops >10% while traffic is unchanged
- [ ] B. DB QPS rises sharply while hit rate falls
- [ ] C. Redis memory above ~85% of maxmemory — eviction or errors imminent
- [ ] D. Hit rate of 50% on intentionally cached hot endpoints suggests misconfiguration

---

### Q28 [Medium] [Case Study] — RetailHub Big Product JSON

**Context:** One Redis key stores 8 MB JSON for a product with 10,000 SKUs. Redis latency spikes block other commands on the single-threaded primary.

**Select all that apply.**

What fixes apply?

- [ ] A. Split large values into smaller keys or store reference + lazy load chunks
- [ ] B. Compress values or avoid caching huge blobs — store S3 URL reference instead
- [ ] C. Bigger single keys always improve hit rate without operational cost
- [ ] D. Big key problem — blocks Redis single-threaded event loop on large payloads

---

### Q29 [Hard] [Case Study] — RetailHub Invalidation Race

**Context:** Thread A commits price update and deletes cache. Thread B misses cache, reads stale value from read replica with 200 ms lag, writes old price back to Redis.

**Select all that apply.**

How to reduce stale repopulation races?

- [ ] A. Delete cache after DB commit on primary, not before
- [ ] B. Read from primary on cache miss for recently updated keys, or use version in cache value
- [ ] C. Delete cache before DB commit — always safe
- [ ] D. Event-based invalidation across services still has small eventual lag to design for

---

### Q30 [Hard] — Circuit Breaker During Cache Outage

Redis fails during Black Friday. RetailHub's DB cannot absorb full read load.

**Select all that apply.**

Which degradation strategies apply?

- [ ] A. Circuit breaker stops hammering DB when error rate exceeds threshold
- [ ] B. Return 503 or serve stale cached copy at CDN/browser if acceptable
- [ ] C. Unlimited retries to DB without backoff — always recovers fastest
- [ ] D. Multi-layer L1 in-process cache extends partial availability briefly

---

### Q31 [Easy] [Case Study] — RetailHub ETag Revalidation

**Context:** RetailHub's category API returns 500 KB JSON. Clients re-fetch the full body on every visit even though categories change rarely.

**Select all that apply.**

Which caching techniques reduce bandwidth and origin load?

- [ ] A. `ETag` / `If-None-Match` enables `304 Not Modified` when content is unchanged
- [ ] B. Conditional requests reduce origin work when the representation has not changed
- [ ] C. ETags eliminate the need for any write-path invalidation on admin updates
- [ ] D. Strong ETags support validators at CDN and browser layers

---

### Q32 [Easy] — Stale-While-Revalidate

**Select all that apply.**

Which statements about stale-while-revalidate (SWR) are correct?

- [ ] A. SWR can serve stale content while refreshing in the background
- [ ] B. SWR improves perceived latency during revalidation windows
- [ ] C. SWR guarantees zero staleness for financial authorization decisions
- [ ] D. SWR appears in HTTP `Cache-Control` extensions and CDN configurations

---

### Q33 [Easy] [Case Study] — RetailHub Eviction Under Memory Pressure

**Context:** Redis hits `maxmemory` with `allkeys-lru`. Hit rate drops from 92% to 61% as popular product keys are evicted alongside cold keys.

**Select all that apply.**

What explains this and what should ops do?

- [ ] A. Memory pressure triggers eviction — hot keys can be evicted under `allkeys-lru`
- [ ] B. Monitor memory usage, eviction rate, and choose an appropriate `maxmemory-policy`
- [ ] C. `allkeys-lru` perfectly preserves every hot key regardless of memory pressure
- [ ] D. Separate tiers, reserved memory, or key design may be needed for hot data

---

### Q34 [Easy] — Memcached vs Redis

**Select all that apply.**

When choosing a distributed cache technology, which comparisons are correct?

- [ ] A. Redis offers richer data structures and optional persistence features
- [ ] B. Memcached is a simpler multi-threaded cache for pure key-value TTL workloads
- [ ] C. Memcached automatically stays strongly consistent with PostgreSQL on every read
- [ ] D. Both can serve as L2 application cache — choice depends on required features

---

### Q35 [Easy] [Case Study] — RetailHub Double Cache Populate

**Context:** Two threads miss the same product key simultaneously. Both query PostgreSQL and both `SET` Redis with the same value.

**Select all that apply.**

What describes this race and valid mitigations?

- [ ] A. Singleflight / miss coalescing prevents duplicate DB loads for the same key
- [ ] B. The race may not corrupt data but still wastes DB capacity under load
- [ ] C. Double populate always corrupts cache values with conflicting data
- [ ] D. Lock-based miss coalescing is a standard stampede mitigation technique

---

### Q36 [Easy] — CDN Purge and Versioned Assets

**Select all that apply.**

Which practices keep CDN content fresh after deploys?

- [ ] A. Purge API invalidates edge copies when content changes
- [ ] B. Fingerprinted asset URLs (`app.a1b2c3.js`) reduce need for broad purges
- [ ] C. CDN purge is always instantaneous globally with zero propagation delay
- [ ] D. Multi-layer caching requires invalidating every layer that may serve stale content

---

### Q37 [Medium] [Case Study] — RetailHub Mixed Personalization

**Context:** RetailHub's homepage combines a public hero banner (shared) with per-user recommendations. One cache key for the full HTML minimizes code complexity.

**Select all that apply.**

What is sound cache design here?

- [ ] A. Cache public fragments at CDN/Redis with shared keys
- [ ] B. Per-user sections need short TTL, separate API calls, or edge-side composition
- [ ] C. One shared cache key for the full personalized page maximizes hit rate
- [ ] D. Split cacheable vs non-cacheable fragments — not all-or-nothing page caching

---

### Q38 [Medium] — Redis Persistence Trade-offs

**Select all that apply.**

Which statements about Redis persistence are correct?

- [ ] A. RDB snapshots are point-in-time — data since last snapshot may be lost on crash
- [ ] B. AOF `fsync` policy trades durability for write throughput
- [ ] C. Redis persistence makes it a full replacement for PostgreSQL as financial ledger
- [ ] D. Pure cache workloads often tolerate empty restart with warm-up rather than heavy persistence

---

### Q39 [Medium] [Case Study] — RetailHub Cross-Region Latency

**Context:** EU users hit RetailHub's US-origin product API. P95 latency is 280 ms despite Redis at the US origin. US users see 35 ms.

**Select all that apply.**

What architectural responses apply?

- [ ] A. Regional Redis or CDN edge caching closer to users reduces round-trip time
- [ ] B. Cross-region cache replication adds complexity — geographic placement matters
- [ ] C. A single US Redis cluster gives identical latency to EU and US users
- [ ] D. Geo-routed endpoints or multi-region deployment may be required at scale

---

### Q40 [Medium] — L1 Cache Coherency Across Pods

**Select all that apply.**

RetailHub uses in-process L1 cache in front of Redis L2. Which statements are correct?

- [ ] A. Uncoordinated L1 across pods can serve stale data after a write on another pod
- [ ] B. Pub/sub invalidation channel can clear L1 entries on writes
- [ ] C. Very short L1 TTL reduces the stale window without explicit invalidation
- [ ] D. L1 caches are automatically coherent across JVMs/processes without design

---

### Q41 [Medium] [Case Study] — RetailHub Flash Sale Oversell

**Context:** Redis shows 5 units in stock. PostgreSQL already sold out during a race. Checkout authorized from stale cache.

**Select all that apply.**

What went wrong and what is correct design?

- [ ] A. Authoritative inventory deduction must read/write DB with lock or atomic conditional `UPDATE`
- [ ] B. Cache-aside stock counts used to authorize purchases are dangerous on hot inventory
- [ ] C. Short TTL alone guarantees no oversell during flash sales
- [ ] D. Display stock may be approximate; the purchase path must use DB truth

---

### Q42 [Medium] — HTTP Vary Header

**Select all that apply.**

Which statements about the `Vary` response header are correct?

- [ ] A. `Vary: Accept-Encoding` helps caches store gzip vs brotli variants separately
- [ ] B. `Vary: Authorization` matters when responses differ by authenticated user
- [ ] C. `Vary` alone eliminates the need for `private` cache on authenticated responses
- [ ] D. Misconfigured `Vary` can fragment cache keys and lower hit rate

---

### Q43 [Medium] [Case Study] — RetailHub Marketing Banner SWR

**Context:** Marketing updates a banner image. CDN uses `stale-while-revalidate` for one hour. Some users see the old banner briefly while a background fetch updates the edge.

**Select all that apply.**

When is this trade-off acceptable?

- [ ] A. Acceptable for non-critical marketing visuals with known staleness window
- [ ] B. Price, legal, or checkout-critical text should not rely on long SWR without purge
- [ ] C. SWR guarantees users never see any stale marketing content
- [ ] D. Pair SWR with purge or versioned URLs for important updates

---

### Q44 [Medium] — Read-Through vs Cache-Aside Operations

**Select all that apply.**

Which compare operational ownership of read-through vs cache-aside?

- [ ] A. Read-through delegates miss handling to the cache client/library
- [ ] B. Cache-aside gives the application explicit control over invalidation and miss path
- [ ] C. Read-through removes all application responsibility for cache and database writes
- [ ] D. Team familiarity and framework support influence which pattern to adopt

---

### Q45 [Hard] [Case Study] — RetailHub Simultaneous L1 Cold Start

**Context:** Deploy clears L1 on all 80 API pods at once. Each pod cold-misses the top 100 keys — 8,000 concurrent PostgreSQL queries in 2 seconds.

**Select all that apply.**

What mitigations apply?

- [ ] A. Coordinate cache warm-up or staggered traffic shift after deploy
- [ ] B. TTL jitter on L1 prevents simultaneous cold start after every deploy
- [ ] C. Singleflight at L2 Redis reduces duplicate DB load for shared hot keys
- [ ] D. Canary deploy limits the fraction of pods going cold at once

---

### Q46 [Hard] — Redis Cluster Behavior

**Select all that apply.**

Which statements about Redis Cluster are correct?

- [ ] A. Cluster moves hash slots on failover — clients must handle `MOVED`/`ASK` redirects
- [ ] B. Cross-slot multi-key transactions are limited compared to single-node Redis
- [ ] C. Cluster automatically splits one logical hot key across nodes without key redesign
- [ ] D. Hot-key problems remain a design concern even with horizontal sharding

---

### Q47 [Hard] [Case Study] — RetailHub Session PII in Redis

**Context:** Redis stores session blobs containing PII. Compliance requires encryption in transit and minimal sensitive data retention.

**Select all that apply.**

Which practices apply?

- [ ] A. TLS to Redis addresses encryption in transit
- [ ] B. Store minimal fields in session cache — reduce exposure surface
- [ ] C. Caching PII eliminates GDPR data-location and retention obligations
- [ ] D. At-rest encryption depends on managed Redis/cloud disk encryption configuration

---

### Q48 [Hard] — Negative Caching Limits

**Select all that apply.**

Which statements about negative (null) caching are correct?

- [ ] A. Caching known-missing keys with short TTL stops repeated DB hits from scans
- [ ] B. Short TTL limits harm if the entity is created soon after a cache-miss scan
- [ ] C. Negative cache with infinite TTL always eventually shows newly created records
- [ ] D. Bloom filter false positives may rarely skip DB for existent keys — tune size and hash count

---

### Q49 [Hard] [Case Study] — RetailHub Tenant Cache Isolation

**Context:** RetailHub SaaS runs multi-tenant on one Redis cluster. A bad admin script deletes keys matching `product:*` and wipes another tenant's catalog.

**Select all that apply.**

How should multi-tenant cache isolation work?

- [ ] A. Namespace keys per tenant: `{tenant_id}:product:{id}`
- [ ] B. ACLs or separate Redis instances/clusters for large or regulated tenants
- [ ] C. Shared flat keyspace without tenant prefix is safest at scale
- [ ] D. Test invalidation scripts against tenant prefix boundaries in staging

---

### Q50 [Hard] — When Not to Add Cache

**Select all that apply.**

When is adding a cache layer a poor investment?

- [ ] A. Data changes constantly and is rarely re-read — cache adds little value
- [ ] B. Every read requires strong consistency with zero staleness budget
- [ ] C. Working set already fits in DB buffer pool with acceptable latency — cache may be premature
- [ ] D. Every API endpoint benefits from Redis regardless of access pattern

---
