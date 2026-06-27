# Design Disciplines — Answer Key & Explanations (28)

Answer key for [day-02-questions.md](../day-02-questions.md)


---

### Q01 [Easy] — Architecture Review Lenses

**Answer:** B, C, D

**Explanation:** Capacity, observability, and refactor are core design disciplines alongside HLD, security, scalability, and others. Compiler design is unrelated to system architecture reviews (A).

---

### Q02 [Easy] — Classifying Non-Functional Concerns

**Answer:** A, B, C

**Explanation:** Scalability, security, and performance are non-functional disciplines. HLD defines structural shape — components and connections (D).

---

### Q03 [Easy] — What Belongs in an HLD Doc

**Answer:** A, B, C

**Explanation:** HLD covers components, flows, and external systems. Index definitions are LLD or data-design detail (D).

---

### Q04 [Easy] — What Belongs in an LLD Doc

**Answer:** A, B, C

**Explanation:** LLD specifies internal structure, schemas, state machines, and sequence flows. Instance counts belong in capacity design (D).

---

### Q05 [Easy] — Sizing a New API

**Answer:** B, C, D

**Explanation:** Capacity planning produces traffic, storage, and bandwidth estimates. Domain boundaries are HLD decisions (A).

---

### Q06 [Easy] — Horizontal vs Vertical Scaling

**Answer:** A, B, D

**Explanation:** Horizontal scaling adds redundancy and scale headroom. It usually requires stateless apps or sharding — not zero code changes (C describes vertical scaling's simplicity).

---

### Q07 [Easy] — Reliability Metrics in an SLA Discussion

**Answer:** A, C, D

**Explanation:** RPO, RTO, and MTTR are recovery and reliability metrics. QPS is a throughput/capacity metric (B).

---

### Q08 [Easy] — Security Design Basics

**Answer:** A, B, C

**Explanation:** Auth, authorization, and encryption are core security pillars. Third-party services (Stripe, email) are managed with secure integration — not eliminated (D).

---

### Q09 [Easy] — Picking a Database Type

**Answer:** A, B, D

**Explanation:** ACID inventory with joins fits relational SQL. Wide-column NoSQL suits massive write throughput with flexible schema — not primary inventory ledgers (C).

---

### Q10 [Medium] [Case Study] — Greenfield Launch Checklist

**Answer:** A, C, D

**Explanation:** Pre-launch needs sizing, security, and observability. Refactoring a monolith that hasn't shipped yet is premature (B).

---

### Q11 [Medium] — Sync vs Async in an Order Flow

**Answer:** A, B, C

**Explanation:** Payment needs an immediate response; email can be async; webhooks handle async provider events. Blocking checkout on SMTP hurts latency (D).

---

### Q12 [Medium] — LLD Review for Order Service

**Answer:** A, B, C

**Explanation:** Service layer, repository pattern, and idempotency are LLD best practices. A god class is an anti-pattern (D).

---

### Q13 [Medium] [Case Study] — ReadStorm API Connection Exhaustion

**Answer:** A, B, D

**Explanation:** Replicas, pooling, and caching address read load and connections. Sharding before measuring the real bottleneck adds unnecessary complexity (C).

---

### Q14 [Medium] — Growth Roadmap for a Successful MVP

**Answer:** A, B, D

**Explanation:** Typical progression: split DB + cache → replicas + CDN → sharding/services → multi-region. Multi-region is a late stage, not the first step (C).

---

### Q15 [Medium] [Case Study] — Payment Provider Outage at Checkout

**Answer:** B, C, D

**Explanation:** Circuit breakers, backoff, and degradation stop cascading failure. Removing timeouts lets threads hang indefinitely (A).

---

### Q16 [Medium] [Case Study] — STRIDE Review of a User API

**Answer:** A, B, D

**Explanation:** IDOR leaks map to information disclosure; weak JWTs to spoofing; missing audit trails to repudiation. Parameterized queries address tampering/SQL injection but the described bug is authorization (C is a valid mitigation class but doesn't match the IDOR symptom as directly as A).

---

### Q17 [Medium] [Case Study] — Feed vs Ledger Consistency

**Answer:** A, C, D

**Explanation:** Payments need strong consistency; feeds tolerate staleness. Eventual consistency is not acceptable for bank balances (B).

---

### Q18 [Medium] — Public REST API Standards

**Answer:** A, C, D

**Explanation:** Nouns, pagination, and idempotency keys are REST best practices. Verb URLs are discouraged (B).

---

### Q19 [Medium] — Performance Tuning Priority

**Answer:** A, B, D

**Explanation:** Avoid work (cache), do less work (pagination), then async — before hardware or micro-optimizations. Skipping profiling jumps to low-impact fixes (C).

---

### Q20 [Hard] — Cache Pattern Selection

**Answer:** A, B, C, D

**Explanation:** Cache-aside is general-purpose; write-through keeps cache and DB synchronized; write-behind optimizes write latency; read-through simplifies app code. All pattern descriptions are valid.

---

### Q21 [Hard] [Case Study] — On-Call Alert Noise at 3 AM

**Answer:** A, C, D

**Explanation:** Structured logs, RED metrics, and tracing enable debugging. Alerting on 55% CPU causes fatigue — alert on user-facing symptoms like error rate and latency (B).

---

### Q22 [Hard] — SLO Error Budget Before a Risky Release

**Answer:** A, C, D

**Explanation:** SLI/SLO/SLA hierarchy and error budgets guide release risk. Exhausted budget means focus on reliability — not ignoring it (B).

---

### Q23 [Hard] [Case Study] — Extracting Payment from a Monolith

**Answer:** A, B, C

**Explanation:** Strangler fig, feature flags, and dual-write enable safe incremental migration. Big-bang rewrites miss edge cases and risk long outages (D).

---

### Q24 [Hard] — SLA Negotiation: The Nines

**Answer:** A, B, C

**Explanation:** 99.9% maps to ~8.76 hours/year and ~43.8 minutes/month; each nine is an order of magnitude harder. Design for the nines the business requires — not the maximum possible (D).

---

### Q25 [Hard] — Scalability Anti-Patterns in Production

**Answer:** A, B, C, D

**Explanation:** In-memory sessions block horizontal scale; sharding without profiling mistargets the bottleneck; missing cache leaves read pressure on DB. All four anti-patterns apply.

---

### Q26 [Hard] — Data Pipeline Architecture Choices

**Answer:** A, B, C, D

**Explanation:** ETL suits batch analytics; CDC suits real-time sync; event sourcing suits audit; CQRS suits read-heavy reporting. All are valid patterns for different needs.

---

### Q27 [Hard] — Capacity vs Scalability Planning

**Answer:** A, C, D

**Explanation:** Capacity is right-sizing today; scalability is the growth roadmap. Both are needed together (D is false).

---

### Q28 [Hard] [Case Study] — Input Validation Gaps on a Public Form

**Answer:** A, B, C

**Explanation:** Parameterized queries, output encoding, and CSRF tokens address the listed vulnerabilities. Passing user input to shells enables command injection (D).
