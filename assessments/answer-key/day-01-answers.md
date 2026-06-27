# System Design Foundations & URL Shortener — Answer Key & Explanations (18)

Answer key for [day-01-questions.md](../day-01-questions.md)


---

### Q01 [Easy] — Justifying Architecture Work to Leadership

**Answer:** B, C, D

**Explanation:** Deliberate architecture supports scale, reliability, cost control, and team parallelism. Vendor trivia (A) is not a design outcome — the goal is transferable thinking about trade-offs.

---

### Q02 [Easy] [Case Study] — Peak-Hour Slowdown at TaskFlow

**Answer:** A, C, D

**Explanation:** Peak load without caching/LB and DB without replicas/pooling match classic scaling failures. An oversized monolith slows feature delivery — it does not make features ship faster (C reverses the symptom).

---

### Q03 [Easy] — Scoping NFRs for a Photo Upload Feature

**Answer:** A, D

**Explanation:** B (latency) and C (availability) describe *how well* the system performs. A and D describe *what* users can do — functional requirements.

---

### Q04 [Easy] — Picking Infrastructure Primitives

**Answer:** B, C, D

**Explanation:** Load balancers, queues, and CDNs are common infrastructure primitives alongside caches, databases, and API gateways. A compiler toolchain is a dev tool, not a runtime building block (A).

---

### Q05 [Easy] — Running a Design Review Session

**Answer:** B, C, D

**Explanation:** Requirements, back-of-envelope estimates, and bottleneck analysis are core design steps. Unit tests come during implementation, not in an architecture review (A).

---

### Q06 [Easy] — Evaluating Architecture Styles for an MVP

**Answer:** A, B, C, D

**Explanation:** All four are valid architectural patterns with different trade-offs. Early teams often start monolithic or serverless, but all styles can be evaluated against requirements and team maturity.

---

### Q07 [Medium] [Case Study] — PayRight's Monolith at 18 Months

**Answer:** A, B, C

**Explanation:** Monoliths simplify early ops; microservices help independent scale and deploy at the cost of complexity. Modules inside a monolith avoid inter-service network calls, but C incorrectly claims "all" network overhead is eliminated forever.

---

### Q08 [Medium] — Choosing Event-Driven vs Serverless for Webhooks

**Answer:** A, C, D

**Explanation:** Serverless cold starts, eventual consistency, and event ordering/idempotency are documented risks. Event-driven systems still communicate over the network (C is false).

---

### Q09 [Medium] [Case Study] — Global Launch for StreamBox

**Answer:** B, C, D

**Explanation:** New markets, SLA pressure, and major growth all warrant serious design. A cosmetic label fix is easily reversible and low impact (A).

---

### Q10 [Medium] — When a Quick Fix Is Enough

**Answer:** A, B, C

**Explanation:** Small UI tweaks, tiny internal tools, and throwaway prototypes can move fast. Monolith decomposition is hard to reverse and affects core flows — it needs real design (D).

---

### Q11 [Medium] — Architecture Decision Gate

**Answer:** A, B, D

**Explanation:** Irreversible changes, major growth, and multi-team coordination all raise the cost of getting architecture wrong. Low-impact reversible changes can iterate quickly (C).

---

### Q12 [Medium] [Case Study] — LinkShare Capacity Planning

**Answer:** A, B, C

**Explanation:** Monthly totals convert to ~40 writes/s and ~400 reads/s with a 10:1 read ratio. Storage is ~60 GB (100M × 600 bytes), not 600 GB (D overcounts by 10×).

---

### Q13 [Hard] — Short Code Strategy for LinkShare

**Answer:** A, B, D

**Explanation:** Hash collisions must be handled; Base62 counters are collision-free at this scale; Base62 uses 62 symbols. Random codes must verify uniqueness against the database on every insert (C).

---

### Q14 [Hard] [Case Study] — LinkShare Redirect Latency Spike

**Answer:** A, B, C

**Explanation:** 301 reduces repeat load; Redis cache-aside and a `short_code` index optimize the dominant read path. 302 forces every click through your servers — valid for mutable destinations but wrong as the default latency fix (D).

---

### Q15 [Hard] [Case Study] — LinkShare Architecture Review

**Answer:** A, B, C

**Explanation:** Monolith + PostgreSQL + Redis matches team size and read-heavy profile. 100M URLs with a small team does not mandate immediate microservices (D).

---

### Q16 [Hard] [Case Study] — LinkShare at 10× Traffic

**Answer:** A, B, C

**Explanation:** Horizontal app scaling, sharding, and distributed IDs address growth bottlenecks. Removing cache on a read-heavy system would increase database load (D).

---

### Q17 [Hard] — Design Doc Depth for a New Service

**Answer:** A, B, D

**Explanation:** HLD stays at boxes-and-arrows; detailed design adds sizing and tech choices; LLD goes inside one service. Index definitions belong in LLD, not HLD (C).

---

### Q18 [Hard] — Data Model Strategy for a Growing Platform

**Answer:** A, B, C, D

**Explanation:** Teams often start with one database, then adopt per-service databases, CQRS, or event sourcing as scale and domain complexity grow. Each pattern fits different access and audit needs.
