# Caching Deep Dive — Answer Key & Explanations (50)

Answer key for [day-07-questions.md](../day-07-questions.md)


---

### Q01 [Easy] [Case Study] — RetailHub Product Page Load

**Answer:** A, B, D

**Explanation:** Read-heavy catalog benefits from Redis speed and hit-rate math. Cache is not source of truth (C).

---

### Q02 [Easy] — Cache vs Database

**Answer:** A, B, D

**Explanation:** Cache is ephemeral and refillable. ACID durability belongs to DB (C).

---

### Q03 [Easy] [Case Study] — RetailHub Static Assets

**Answer:** A, C, D

**Explanation:** Multi-layer caching from browser/CDN to origin. LBs do not replace edge/browser cache (B).

---

### Q04 [Easy] — What Not to Cache

**Answer:** A, B, D

**Explanation:** Authoritative money movement and OTP need DB truth. Catalog with TTL+invalidation is cacheable (C).

---

### Q05 [Easy] [Case Study] — RetailHub Session Store

**Answer:** B, C, D

**Explanation:** Shared Redis or JWT for stateless fleet. Per-pod memory breaks behind LB (A).

---

### Q06 [Easy] — Cache Key Design

**Answer:** A, C, D

**Explanation:** Namespaced shared keys maximize reuse. Unique per-request keys never hit (B).

---

### Q07 [Medium] [Case Study] — RetailHub Cache-Aside Read Path

**Answer:** A, B, C

**Explanation:** App-managed lazy load and explicit invalidation; graceful Redis bypass. Auto-sync on write is read-through/write-through, not cache-aside (D).

---

### Q08 [Medium] — Cache-Aside Write Path

**Answer:** A, D

**Explanation:** DB first, then delete cache. Delete-before-commit races with stale refill (B). TTL-only for prices is risky (C).

---

### Q09 [Medium] [Case Study] — RetailHub Profile Settings

**Answer:** B, C, D

**Explanation:** Write-through fits immediate post-write reads on low-write paths. Cold-key write-through wastes RAM (A).

---

### Q10 [Medium] — Write-Back Cache Risks

**Answer:** A, B, C

**Explanation:** Write-back is fast and eventual — not for payments/inventory without durable queue (D).

---

### Q11 [Medium] [Case Study] — RetailHub Admin Price Update

**Answer:** A, B, D

**Explanation:** Multi-layer invalidation required. Delete-before-commit can repopulate stale data (C).

---

### Q12 [Medium] — TTL Best Practices

**Answer:** A, B, D

**Explanation:** Jitter prevents synchronized expiry; long TTL + invalidation for stable data. Uniform TTL on all keys causes stampedes (C).

---

### Q13 [Medium] [Case Study] — RetailHub Black Friday Stampede

**Answer:** A, B, C

**Explanation:** Hot-key expiry stampede — not penetration (D). Lock, jitter, refresh-ahead help.

---

### Q14 [Medium] — Cache Penetration

**Answer:** A, B, D

**Explanation:** Null caching, Bloom filters, validation, rate limits. Jitter does not stop invalid-key scans (C).

---

### Q15 [Hard] [Case Study] — RetailHub Redis Restart

**Answer:** B, C, D

**Explanation:** Empty cache avalanche — warm-up, HA, circuit breaker. Restart absolutely spikes DB load (A).

---

### Q16 [Hard] — Distributed Cache Architecture

**Answer:** A, B, D

**Explanation:** Cluster scales; noeviction errors when full. L1 is not auto-shared across pods (C).

---

### Q17 [Hard] [Case Study] — RetailHub Hot Celebrity Product

**Answer:** B, C, D

**Explanation:** Local cache, CDN, key splitting address hot keys. Sharding alone does not split one logical key (A).

---

### Q18 [Hard] — Read-Through vs Cache-Aside

**Answer:** A, B, D

**Explanation:** Read-through delegates miss load to cache layer; app still writes DB on updates (C).

---

### Q19 [Easy] — Multi-Layer Cache Stack

**Answer:** A, C, D

**Explanation:** Browser, CDN, Redis layers stack. MySQL query cache removed in 8.0 (B).

---

### Q20 [Easy] [Case Study] — RetailHub Rate Limit Counter

**Answer:** A, B, D

**Explanation:** Ephemeral Redis counters shared fleet-wide. Not financial ledger (C).

---

### Q21 [Medium] — Write-Through vs Cache-Aside Writes

**Answer:** B, C, D

**Explanation:** Cache-aside deletes; write-through sets both. Cache-aside is default, not write-through (A).

---

### Q22 [Medium] [Case Study] — RetailHub Display Balance

**Answer:** A, B, D

**Explanation:** Display TTL OK if transfers read locked DB balance. Never cache authoritative transfer balance (C).

---

### Q23 [Medium] — HTTP Cache Headers

**Answer:** A, B, C, D

**Explanation:** All four are valid Cache-Control semantics for different cache layers and sensitivity.

---

### Q24 [Medium] [Case Study] — RetailHub Deploy Cold Start

**Answer:** A, C

**Explanation:** Preload before traffic — warming. Refresh-ahead is ongoing TTL-based (B). Warming does not replace invalidation (D).

---

### Q25 [Hard] — Refresh-Ahead Pattern

**Answer:** C, D

**Explanation:** Proactive refresh before expiry vs one-time warm-up. Some staleness possible during refresh (B). They differ (A).

---

### Q26 [Hard] — Consistency Spectrum

**Answer:** A, B, C

**Explanation:** Write-through strongest; cache-aside default; write-back weakest/fastest. TTL-only without invalidation is weak, not strongest (D).

---

### Q27 [Easy] — Monitoring Cache Health

**Answer:** A, B, C, D

**Explanation:** All are valid operational signals for cache misconfiguration or failure.

---

### Q28 [Medium] [Case Study] — RetailHub Big Product JSON

**Answer:** A, B, D

**Explanation:** Split/compress/reference — big keys hurt Redis single thread. Larger keys are not free wins (C).

---

### Q29 [Hard] [Case Study] — RetailHub Invalidation Race

**Answer:** A, B, C

**Explanation:** Delete after commit; read primary or version on miss. Delete-before-commit worsens races (D).

---

### Q30 [Hard] — Circuit Breaker During Cache Outage

**Answer:** A, B, D

**Explanation:** Breaker protects DB; stale CDN/L1 may help briefly. Unlimited retries amplify outage (C).

---

### Q31 [Easy] [Case Study] — RetailHub ETag Revalidation

**Answer:** A, B, D

**Explanation:** Conditional requests save bandwidth. ETags complement — not replace — write invalidation (C).

---

### Q32 [Easy] — Stale-While-Revalidate

**Answer:** A, B, D

**Explanation:** SWR trades brief staleness for speed. Not for authoritative financial reads (C).

---

### Q33 [Easy] [Case Study] — RetailHub Eviction Under Memory Pressure

**Answer:** A, B, C

**Explanation:** LRU evicts hot keys under pressure. Monitor and tune policy — not perfect hot-key preservation (D).

---

### Q34 [Easy] — Memcached vs Redis

**Answer:** A, B, D

**Explanation:** Feature trade-offs between cache engines. Neither auto-syncs with PostgreSQL (C).

---

### Q35 [Easy] [Case Study] — RetailHub Double Cache Populate

**Answer:** A, C, D

**Explanation:** Miss coalescing saves DB load. Duplicate SET with same value wastes work but need not corrupt (B).

---

### Q36 [Easy] — CDN Purge and Versioned Assets

**Answer:** A, B, D

**Explanation:** Purge plus fingerprinted URLs. Global purge is not always instant (C).

---

### Q37 [Medium] [Case Study] — RetailHub Mixed Personalization

**Answer:** A, B, D

**Explanation:** Split shared vs per-user caching. One key for full personalized page kills hit rate (C).

---

### Q38 [Medium] — Redis Persistence Trade-offs

**Answer:** A, B, D

**Explanation:** RDB/AOF durability trade-offs. Redis is not financial ledger (C).

---

### Q39 [Medium] [Case Study] — RetailHub Cross-Region Latency

**Answer:** B, C, D

**Explanation:** Geo placement matters. US-only cache cannot equalize EU latency (A).

---

### Q40 [Medium] — L1 Cache Coherency Across Pods

**Answer:** A, B, C

**Explanation:** L1 needs invalidation, pub/sub, or short TTL. No automatic cross-pod coherence (D).

---

### Q41 [Medium] [Case Study] — RetailHub Flash Sale Oversell

**Answer:** B, C, D

**Explanation:** Authorize stock from DB with atomic update. TTL alone does not prevent oversell (A).

---

### Q42 [Medium] — HTTP Vary Header

**Answer:** A, B, D

**Explanation:** Vary manages cache variants. Authenticated responses often still need `private` (C).

---

### Q43 [Medium] [Case Study] — RetailHub Marketing Banner SWR

**Answer:** B, C, D

**Explanation:** SWR OK for low-risk visuals; purge/version critical content. SWR allows staleness (A).

---

### Q44 [Medium] — Read-Through vs Cache-Aside Operations

**Answer:** A, B, D

**Explanation:** Pattern choice is ops and control trade-off. App still owns writes (C).

---

### Q45 [Hard] [Case Study] — RetailHub Simultaneous L1 Cold Start

**Answer:** A, B, C

**Explanation:** Stagger warm-up/canary; L2 singleflight helps. TTL jitter does not fix simultaneous deploy cold start (D).

---

### Q46 [Hard] — Redis Cluster Behavior

**Answer:** A, B, C

**Explanation:** Cluster slot redirects and hot-key limits. One logical key does not auto-split (D).

---

### Q47 [Hard] [Case Study] — RetailHub Session PII in Redis

**Answer:** A, B, D

**Explanation:** TLS, minimize PII, managed at-rest encryption. Caching does not remove compliance duties (C).

---

### Q48 [Hard] — Negative Caching Limits

**Answer:** A, B, D

**Explanation:** Short TTL on null cache; tune Bloom filters. Infinite TTL blocks new records (C).

---

### Q49 [Hard] [Case Study] — RetailHub Tenant Cache Isolation

**Answer:** A, B, C

**Explanation:** Tenant namespacing and isolation. Flat shared keyspace is unsafe (D).

---

### Q50 [Hard] — When Not to Add Cache

**Answer:** A, B, C

**Explanation:** Cache when read-heavy with staleness budget. Not universal for every endpoint (D).
