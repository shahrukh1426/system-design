# Infrastructure Components — Answer Key & Explanations (30)

Answer key for [day-05-questions.md](../day-05-questions.md)


---

### Q01 [Easy] [Case Study] — DNS Cutover for a Replatform

**Answer:** A, C, D

**Explanation:** DNS is the naming layer for migrations and can return multiple IPs. It does not replace LBs that actively health-check backends (B).

---

### Q02 [Easy] — DNS Record Types for Dual-Stack Hosting

**Answer:** A, B, C, D

**Explanation:** A and AAAA handle dual-stack web traffic; CNAME aliases hosts; MX routes email. All are standard record types operators configure in production DNS.

---

### Q03 [Easy] [Case Study] — Black Friday at RetailHub

**Answer:** A, C, D

**Explanation:** LBs distribute, health-check, and enable rolling maintenance. You still need multiple backends for redundancy and capacity (B).

---

### Q04 [Easy] — Choosing L4 vs L7 for an API Gateway

**Answer:** A, B, C

**Explanation:** Path-based routing and TLS termination require L7 awareness. L4 only sees IP/port (D).

---

### Q05 [Easy] [Case Study] — Nginx as the Public Face of ShopCore

**Answer:** A, C, D

**Explanation:** Reverse proxies terminate TLS, route, and offload static files. Business logic stays in app servers (B).

---

### Q06 [Easy] [Case Study] — Global Shoppers for StaticHub

**Answer:** A, C, D

**Explanation:** CDNs optimize static, cacheable content geographically. Personalized financial data should not be cached at CDN edges (B).

---

### Q07 [Easy] — Cache Layers in a Typical Web Stack

**Answer:** A, B, C, D

**Explanation:** Caches stack from browser → CDN → reverse proxy → app cache → DB buffer pool → durable store. Each layer catches what the one above missed.

---

### Q08 [Easy] — Database Showing Early Strain

**Answer:** A, B, C

**Explanation:** Tune, cache, and replicate before sharding. Sharding is a late-stage step when earlier measures are exhausted (D).

---

### Q09 [Easy] — When a Queue Beats a Synchronous Call

**Answer:** A, B, D

**Explanation:** Queues decouple producers from consumers with persistence and DLQs. Callers return without waiting for background work (C).

---

### Q10 [Easy] — Microservices for a 200-Engineer Org

**Answer:** A, B, D

**Explanation:** Independent scale, ownership, and isolation are microservice benefits. Operational complexity increases compared to a monolith (C).

---

### Q11 [Medium] [Case Study] — TTL Trap During Failover

**Answer:** A, B, D

**Explanation:** TTL controls cache lifetime; high TTL delays propagation during cutovers. Lower TTL **before** migration reduces stale answers (D is wrong during emergencies).

---

### Q12 [Medium] — Picking a Load Balancing Algorithm

**Answer:** A, B, C, D

**Explanation:** All four pairings match common algorithm selection guidance for homogeneous pools, persistent connections, stickiness, and heterogeneous capacity.

---

### Q13 [Medium] — Nginx as Reverse Proxy and Load Balancer

**Answer:** A, C, D

**Explanation:** Nginx commonly combines both roles. They overlap heavily in production edge tiers (B).

---

### Q14 [Medium] — CDN vs Redis for Product Pages

**Answer:** A, B, D

**Explanation:** CDN and Redis operate at different layers for different content types. Production systems commonly use both (C).

---

### Q15 [Medium] — Cache Pattern for Write-Heavy Counters

**Answer:** A, B, C, D

**Explanation:** All four patterns are standard choices with different consistency and latency trade-offs.

---

### Q16 [Medium] [Case Study] — Stale Prices on Read Replicas

**Answer:** A, B, C

**Explanation:** Replicas scale reads with eventual lag. Read-your-writes fixes post-checkout consistency. Writes still go to one primary (D).

---

### Q17 [Medium] — Queue vs Pub/Sub vs Stream

**Answer:** A, C, D

**Explanation:** Queues suit task workers; pub/sub fan-out suits events; streams suit replay and high throughput. They serve different purposes (B).

---

### Q18 [Medium] — Should This Work Go on a Queue?

**Answer:** A, B, D

**Explanation:** Email, image processing, and batch reports are classic async jobs. Product list reads should be synchronous with caching (C).

---

### Q19 [Medium] — Worker Types in a Production Stack

**Answer:** A, B, C, D

**Explanation:** All four worker patterns handle async, scheduled, event-driven, and streaming workloads respectively.

---

### Q20 [Medium] [Case Study] — DNS Round-Robin vs ALB

**Answer:** A, B, C, D

**Explanation:** Combining DNS to a stable LB endpoint with backend health checks fixes passive DNS round-robin limitations during failures.

---

### Q21 [Hard] [Case Study] — Sticky Sessions During Server Loss

**Answer:** A, C, D

**Explanation:** Stickiness helps legacy in-memory sessions but worsens imbalance on failure. Shared session stores or stateless tokens are preferred. Stickiness is not universal (B).

---

### Q22 [Hard] [Case Study] — Stale JavaScript After Deploy

**Answer:** A, B, C, D

**Explanation:** Immutable versioned filenames plus long TTL is safe; mutable filenames need purge or short TTL. Personalized APIs must not be cached at CDN (A).

---

### Q23 [Hard] [Case Study] — Cache Stampede on Viral Product

**Answer:** A, B, C, D

**Explanation:** Stampede, penetration, staleness, and total cache loss are distinct failure modes with different mitigations — all relevant in large-scale caching design.

---

### Q24 [Hard] [Case Study] — Premature Sharding Proposal

**Answer:** A, B, C, D

**Explanation:** Sharding is powerful but costly; skewed keys and premature sharding add complexity without fixing the actual bottleneck here.

---

### Q25 [Hard] [Case Study] — Poison Messages in Order Email Queue

**Answer:** A, C, D

**Explanation:** Idempotency, safe retries, and DLQs isolate poison messages. Infinite retry blocks the queue (B).

---

### Q26 [Hard] [Case Study] — Splitting Payment from ShopMonolith

**Answer:** A, C, D

**Explanation:** Domain boundaries and incremental extraction reduce risk. Big-bang splits fail on edge cases and coordination (B).

---

### Q27 [Hard] [Case Study] — Place Order Saga Failure

**Answer:** A, B, C, D

**Explanation:** Sagas coordinate multi-service workflows with forward steps and compensating actions when a step fails — no single cross-service ACID transaction.

---

### Q28 [Hard] — Production Stack Data Flow

**Answer:** A, B, C

**Explanation:** User traffic flows through DNS and edge tiers to apps, caches, queues, and workers; CDNs handle static assets. Databases are never browser-facing (D).

---

### Q29 [Hard] — Redis vs Memcached for Session Store

**Answer:** A, B, D

**Explanation:** Redis's structures and optional durability suit sessions and varied cache patterns. Memcached is a simpler pure cache without pub/sub (C).

---

### Q30 [Hard] [Case Study] — Architecture Evolution at GrowthCo

**Answer:** A, B, C, D

**Explanation:** Teams typically evolve monolith → cache/replicas/queue → targeted extraction/sharding → broader service split as org and load demand — not jumping to the final stage on day one.
