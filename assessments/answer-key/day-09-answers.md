# Reliability & Fault Tolerance — Answer Key & Explanations (50)

Answer key for [day-09-questions.md](../day-09-questions.md)


---

### Q01 [Easy] [Case Study] — UptimeCorp Checkout Outage

**Answer:** B, C, D

**Explanation:** Cascading thread exhaustion and blast radius. Speed ≠ reliability (A).

---

### Q02 [Easy] — Reliability vs Performance vs Scalability

**Answer:** A, C, D

**Explanation:** Three distinct concerns. Scale does not imply fault tolerance (B).

---

### Q03 [Easy] [Case Study] — UptimeCorp SLA Math

**Answer:** A, B, D

**Explanation:** SLO stricter than SLA; nines math. SLI/SLO/SLA are distinct (C).

---

### Q04 [Easy] — RPO vs RTO

**Answer:** A, B, D

**Explanation:** RPO = data loss window; RTO = downtime window. Different metrics (C).

---

### Q05 [Easy] [Case Study] — UptimeCorp SPOF Audit

**Answer:** A, C, D

**Explanation:** Single DB/Redis are SPOF. Redundant stateless app instances reduce app-tier SPOF. Multi-AZ does not remove all SPOF such as regional disaster (B).

---

### Q06 [Easy] — Serial Dependency Availability

**Answer:** A, B, C

**Explanation:** Serial availability multiplies down. More dependencies matter (C false).

---

### Q07 [Medium] [Case Study] — UptimeCorp Multi-AZ Deploy

**Answer:** A, B, D

**Explanation:** Multi-AZ + deep checks + stateless sessions. Shallow checks insufficient (C).

---

### Q08 [Medium] — Active-Active vs Active-Passive

**Answer:** A, B, D

**Explanation:** Redundancy models and N+1. Passive promotion has delay (C).

---

### Q09 [Medium] [Case Study] — UptimeCorp Hung Payment Call

**Answer:** A, B, C

**Explanation:** Timeouts fail fast and prevent cascade. Infinite timeout unacceptable (D).

---

### Q10 [Medium] — Timeout Budget

**Answer:** A, B, C

**Explanation:** Budget inner calls to user SLA; client timeout should cover server processing time. One global timeout for all dependencies is poor practice (D).

---

### Q11 [Medium] [Case Study] — UptimeCorp Retry Storm

**Answer:** A, C, D

**Explanation:** Backoff+jitter, transient-only, layer coordination. Retry forever on 503 worsens outage (B).

---

### Q12 [Medium] — Idempotent Retries

**Answer:** A, B, D

**Explanation:** POST transfer needs idempotency key. Blind POST retry is unsafe (C).

---

### Q13 [Medium] [Case Study] — UptimeCorp Circuit Opens

**Answer:** A, B, D

**Explanation:** CB states and per-dependency isolation. Open ≠ fixed (C).

---

### Q14 [Medium] — Circuit Breaker vs Retries

**Answer:** A, C, D

**Explanation:** Complementary patterns. Not either/or (B).

---

### Q15 [Hard] [Case Study] — UptimeCorp Bulkhead Saves Browse

**Answer:** B, C, D

**Explanation:** Bulkhead vs breaker distinction. Different problems (A).

---

### Q16 [Hard] — Bulkhead Types

**Answer:** A, B, C

**Explanation:** Pools, connection separation, queue as bulkhead. Too-large bulkhead loses isolation (D).

---

### Q17 [Hard] [Case Study] — UptimeCorp Graceful Degradation

**Answer:** A, B, D

**Explanation:** Tiered features and fallbacks. Don't 500 whole page for optional block (C).

---

### Q18 [Hard] — Load Shedding Priority

**Answer:** A, B, D

**Explanation:** Priority shedding with Retry-After. Not equal treatment under overload (C).

---

### Q19 [Easy] [Case Study] — UptimeCorp Regional Failover Drill

**Answer:** B, C, D

**Explanation:** Drills and tested restores. Multi-region is costly, not universal default (A).

---

### Q20 [Easy] — Split-Brain Prevention

**Answer:** A, B, D

**Explanation:** Quorum/fencing; manual failover tradeoff. Split-brain is dangerous (C).

---

### Q21 [Medium] [Case Study] — UptimeCorp Error Budget Burn

**Answer:** A, C, D

**Explanation:** Burn-rate alerts and budget policy; exclude client 4xx from SLI typically. Single error paging is noisy (B).

---

### Q22 [Medium] — SLI Selection

**Answer:** A, B, D

**Explanation:** User-journey SLIs. Process-up ping insufficient alone (C).

---

### Q23 [Medium] [Case Study] — UptimeCorp Canary Deploy

**Answer:** A, B, D

**Explanation:** Canary + rollback + flags. Big-bang is high risk (C).

---

### Q24 [Medium] — Defense in Depth Stack

**Answer:** A, C, D

**Explanation:** Layered patterns together. One pattern insufficient (B).

---

### Q25 [Hard] [Case Study] — UptimeCorp Chaos Experiment

**Answer:** A, B, C

**Explanation:** Hypothesis-driven chaos with fixes. Not uncontrolled prod chaos day one (D).

---

### Q26 [Hard] — Partial vs Total Failure

**Answer:** A, B, D

**Explanation:** Slow partial failures cascade; need timeouts/breakers. Partial failures matter (C false).

---

### Q27 [Easy] — MTBF and MTTR

**Answer:** A, C, D

**Explanation:** MTTR reduction helps availability. MTBF alone insufficient with long MTTR (B).

---

### Q28 [Medium] [Case Study] — UptimeCorp Read-Only Mode

**Answer:** A, B, D

**Explanation:** Partial degradation during DB lag. Don't checkout on stale inventory (C).

---

### Q29 [Hard] — Designing for Failure Checklist

**Answer:** A, B, D

**Explanation:** Redundancy, idempotency, blameless postmortems. Many outages are self-inflicted deploys (D false).

---

### Q30 [Hard] [Case Study] — UptimeCorp Game Day

**Answer:** A, B, D

**Explanation:** Game days improve MTTR; complement metrics/SLOs (C false).

---

### Q31 [Easy] [Case Study] — UptimeCorp DNS Outage

**Answer:** B, C, D

**Explanation:** DNS is critical path. Secondary DNS helps. Low TTL has propagation/ops trade-offs (A).

---

### Q32 [Easy] — Kubernetes Probe Types

**Answer:** A, B, C

**Explanation:** Liveness, readiness, startup roles differ. Liveness should not kill on every DB blip (D).

---

### Q33 [Easy] [Case Study] — UptimeCorp Post-Outage Login Surge

**Answer:** A, B, D

**Explanation:** Recovery herd exceeds steady peak. Rate limit and jitter help (C).

---

### Q34 [Easy] — Classifying Dependency Failures

**Answer:** A, B, C

**Explanation:** Transient vs permanent vs slow need different policies. Not one retry policy for all (D).

---

### Q35 [Easy] [Case Study] — UptimeCorp Health Check Flapping

**Answer:** A, C, D

**Explanation:** Tune thresholds; all backends out = outage; hysteresis on shared deps. Aggressive checks can worsen flapping (B).

---

### Q36 [Easy] — N+1 Redundant Capacity

**Answer:** A, B, D

**Explanation:** N+1 and headroom differ. 100% utilization leaves no failure margin (C).

---

### Q37 [Medium] [Case Study] — UptimeCorp Hedged Requests

**Answer:** B, C, D

**Explanation:** Hedging cuts tail latency selectively. Can cap hedging — not blind 2× always (A).

---

### Q38 [Medium] — Fallback vs Fail Fast

**Answer:** A, B, D

**Explanation:** Different strategies for different tiers. Not identical UX (C).

---

### Q39 [Medium] [Case Study] — UptimeCorp API Rate Limiting

**Answer:** B, C, D

**Explanation:** Rate limits shed overload. Unlimited traffic is not HA (A).

---

### Q40 [Medium] — Blue-Green vs Rolling Deploy

**Answer:** A, B, C

**Explanation:** Blue-green fast rollback; rolling smaller waves; duplicate infra cost. Rolling still needs checks (D).

---

### Q41 [Medium] [Case Study] — UptimeCorp Hidden Dependency Chain

**Answer:** B, C, D

**Explanation:** Maps and tracing reveal hidden sync chains. Docs complement — not replace — timeouts (A).

---

### Q42 [Medium] — Synthetic Monitoring

**Answer:** A, B, C

**Explanation:** Synthetic improves MTTD. Complements — not replaces — real-user SLIs (D).

---

### Q43 [Medium] [Case Study] — UptimeCorp Status Page Trust

**Answer:** A, B, D

**Explanation:** Honest status is incident response. Hiding outages erodes trust (C).

---

### Q44 [Medium] — Blast Radius Reduction

**Answer:** A, B, D

**Explanation:** Cells, flags, isolation. Monolith blast radius varies — not always smaller (C).

---

### Q45 [Hard] [Case Study] — UptimeCorp Compounded Retries

**Answer:** A, B, C

**Explanation:** Retry budgets cap amplification. Multi-layer retry has cost (D).

---

### Q46 [Hard] — Cold, Warm, and Hot Standby

**Answer:** A, B, C

**Explanation:** Standby tiers trade cost vs RTO. RPO depends on replication/backups — not automatic (D).

---

### Q47 [Hard] [Case Study] — UptimeCorp Latency SLO Miss

**Answer:** A, C, D

**Explanation:** Latency SLIs catch slow degradation. Zero errors ≠ good UX (B).

---

### Q48 [Hard] — Poison Input on Sync Path

**Answer:** A, B, D

**Explanation:** Validate input; DLQ/quarantine bad payloads. Infinite retry on bad input fails (C).

---

### Q49 [Hard] [Case Study] — UptimeCorp Active-Active Write Conflict

**Answer:** A, B, C

**Explanation:** Active-active needs conflict resolution. Partitions happen; strong consistency may need single writer (D).

---

### Q50 [Hard] — Reliability Culture and Operations

**Answer:** A, B, D

**Explanation:** Blameless culture, error budgets, operational practice. 100% uptime is not realistic (C).
