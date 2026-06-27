# Reliability & Fault Tolerance — MCQ Questions (50)

Multi-select format: each question has **two or more** correct answers. Questions tagged **[Case Study]** include a business context block.

> **Answers and explanations:** see [answer-key/day-09-answers.md](./answer-key/day-09-answers.md)


---

### Q01 [Easy] [Case Study] — UptimeCorp Checkout Outage



**Context:** UptimeCorp's payment API slows to 30 seconds. Order service threads block waiting. The entire site returns 503 even though product catalog and cart APIs are healthy.

**Select all that apply.**

What reliability principle was violated?

- [ ] A. Fast APIs are automatically reliable APIs
- [ ] B. Blast radius was not limited — one dependency took down unrelated paths
- [ ] C. Slow dependency caused cascading failure — thread pool exhaustion
- [ ] D. Reliability means surviving partial failures, not zero failures ever

---

### Q02 [Easy] — Reliability vs Performance vs Scalability



**Select all that apply.**

Which distinctions are correct?

- [ ] A. Performance — speed of a single request under normal conditions
- [ ] B. A scalable system is automatically reliable under dependency failure
- [ ] C. Scalability — handling increased load/volume
- [ ] D. Reliability — correct behavior when components fail

---

### Q03 [Easy] [Case Study] — UptimeCorp SLA Math



**Context:** UptimeCorp promises customers 99.9% availability in the SLA. Engineering targets 99.95% internally.

**Select all that apply.**

Which metric relationships are correct?

- [ ] A. SLO (internal target) should be stricter than SLA (customer contract) — buffer before breach
- [ ] B. 99.9% ≈ 43.8 minutes downtime per month
- [ ] C. SLA, SLO, and SLI are interchangeable terms
- [ ] D. Each additional nine is roughly ten times harder to achieve

---

### Q04 [Easy] — RPO vs RTO



**Select all that apply.**

UptimeCorp defines disaster recovery targets after regional failure.

- [ ] A. RPO — maximum acceptable data loss measured in time
- [ ] B. RTO — maximum acceptable downtime before service restored
- [ ] C. RPO and RTO measure the same thing
- [ ] D. Daily backups only may imply RPO up to 24 hours

---

### Q05 [Easy] [Case Study] — UptimeCorp SPOF Audit



**Context:** UptimeCorp runs one load balancer, one PostgreSQL primary (no replica), one Redis node, and DNS with no secondary provider.

**Select all that apply.**

Which are single points of failure (SPOF)?

- [ ] A. Three stateless app servers behind one LB — app tier alone is not SPOF if any instance can serve
- [ ] B. Multi-AZ deployment with health-checked redundant instances eliminates all SPOF without multi-region
- [ ] C. Single database primary with no failover replica
- [ ] D. Single Redis instance with no replica/Sentinel

---

### Q06 [Easy] — Serial Dependency Availability



**Select all that apply.**

Checkout calls Auth (99.9%) → Inventory (99.9%) → Payment (99.9%) synchronously in series.

- [ ] A. Combined availability ≈ 0.999³ ≈ 99.7% — worse than each service alone
- [ ] B. Your SLA cannot exceed a dependency's SLA without fallback or caching
- [ ] C. Parallelize, cache, or add fallbacks to reduce serial dependency risk
- [ ] D. More sync dependencies in the critical path never affect end-to-end availability

---

### Q07 [Medium] [Case Study] — UptimeCorp Multi-AZ Deploy



**Context:** UptimeCorp runs three API instances across two availability zones behind an ALB with deep health checks (DB + Redis reachable).

**Select all that apply.**

Which HA practices apply?

- [ ] A. Multi-AZ survives datacenter-level failure within a region
- [ ] B. Deep health checks remove instances that cannot reach dependencies
- [ ] C. Shallow health check (process up) is sufficient for production traffic routing
- [ ] D. Stateless app servers with sessions in Redis — not in pod memory

---

### Q08 [Medium] — Active-Active vs Active-Passive



**Select all that apply.**

Which statements compare redundancy models?

- [ ] A. Active-active — all nodes serve traffic simultaneously
- [ ] B. Active-passive — standby idle until failover promotion
- [ ] C. Active-passive failover is always instant with zero promotion delay
- [ ] D. N+1 redundancy — one extra instance covers failure during rolling deploy

---

### Q09 [Medium] [Case Study] — UptimeCorp Hung Payment Call



**Context:** UptimeCorp order service calls payment API with no timeout. Payment hangs indefinitely. 200 threads block; new checkout requests queue until timeout at the gateway.

**Select all that apply.**

What should UptimeCorp implement first?

- [ ] A. Timeout is first-line defense against cascading failure
- [ ] B. Client timeout shorter than user-facing SLA — fail fast and free threads
- [ ] C. Inner dependency timeouts should be shorter than outer gateway timeout budget
- [ ] D. Default infinite timeout on internal calls is acceptable

---

### Q10 [Medium] — Timeout Budget



**Select all that apply.**

User-facing checkout SLA is 5 seconds total. Order service calls three dependencies.

- [ ] A. Sum of inner timeouts + retries must fit within user SLA
- [ ] B. Client timeout should be ≥ server processing limit to avoid client giving up while server still works
- [ ] C. Typical internal API timeout range: 1–3 seconds; DB: 500 ms–2 s; Redis: 100–500 ms
- [ ] D. One global 30-second timeout for all dependencies is best practice

---

### Q11 [Medium] [Case Study] — UptimeCorp Retry Storm



**Context:** Payment API returns 503 for 30 seconds. 5,000 clients retry simultaneously every second with no backoff. Payment receives 5× normal load and stays down longer.

**Select all that apply.**

What fixes apply?

- [ ] A. Coordinate retry budgets across layers — avoid 3×3×3 compounded attempts
- [ ] B. Retry all errors including invalid payload forever
- [ ] C. Retry only transient errors (503, timeout) — not 400/401
- [ ] D. Exponential backoff with jitter on retries

---

### Q12 [Medium] — Idempotent Retries



**Select all that apply.**

UptimeCorp retries `POST /transfer` on timeout.

- [ ] A. Requires Idempotency-Key or dedup store — otherwise retry may double-charge
- [ ] B. GET and idempotent PUT with key are safer to retry
- [ ] C. Retrying non-idempotent POST without protection is safe
- [ ] D. Async queue workers may allow more retries (5–10) than sync user path (2–3)

---

### Q13 [Medium] [Case Study] — UptimeCorp Circuit Opens



**Context:** Payment API fails 8 times in 10 seconds. UptimeCorp's circuit breaker opens — checkout returns immediate fallback error instead of waiting 30 s per request.

**Select all that apply.**

Which circuit breaker facts are correct?

- [ ] A. Per-dependency circuits — payment open should not trip unrelated recommendation circuit
- [ ] B. States: CLOSED → OPEN (fail fast) → HALF-OPEN (test) → CLOSED or OPEN
- [ ] C. Open circuit means the payment API is fixed
- [ ] D. Stops wasted calls to a failing dependency — protects caller resources

---

### Q14 [Medium] — Circuit Breaker vs Retries



**Select all that apply.**

How do retries and circuit breakers work together?

- [ ] A. Complementary — 2–3 retries on transient failure, then count toward open threshold
- [ ] B. Circuit breaker replaces retries entirely — use one or the other
- [ ] C. Retries help brief blips; circuit breaker stops sustained outage amplification
- [ ] D. Unlimited retries while circuit is closed can still saturate the caller during prolonged outage

---

### Q15 [Hard] [Case Study] — UptimeCorp Bulkhead Saves Browse



**Context:** Payment processing uses a dedicated thread pool (20 threads). Recommendations use a separate pool (30 threads). Payment slows but product browse and cart remain responsive.

**Select all that apply.**

What pattern is this?

- [ ] A. Bulkhead and circuit breaker solve identical problems
- [ ] B. When bulkhead is full: fail fast (503) or bounded queue — not unbounded block
- [ ] C. Bulkhead — isolate resource pools so one area cannot drain the entire system
- [ ] D. Bulkhead is proactive isolation; circuit breaker is reactive to failure rate

---

### Q16 [Hard] — Bulkhead Types



**Select all that apply.**

Which are bulkhead implementations?

- [ ] A. Separate thread pools per dependency or feature tier
- [ ] B. Separate DB connection pools for checkout vs reporting queries
- [ ] C. Message queue absorbing spike while workers drain at fixed rate
- [ ] D. Larger bulkhead always improves isolation without trade-off

---

### Q17 [Hard] [Case Study] — UptimeCorp Graceful Degradation



**Context:** Recommendations service is down. UptimeCorp product pages load without "You may also like" section. Checkout and cart work normally.

**Select all that apply.**

Which degradation principles apply?

- [ ] A. Cached or static fallback for recommendations is a valid strategy
- [ ] B. Feature tiers: core (checkout) vs optional (recommendations) — disable optional silently
- [ ] C. Return 500 for entire product page when optional service fails
- [ ] D. Circuit breaker is mechanism; graceful degradation is policy for what UX to show

---

### Q18 [Hard] — Load Shedding Priority



**Select all that apply.**

UptimeCorp must drop traffic under extreme overload.

- [ ] A. Shed lowest priority first: analytics beacons before anonymous browse before paying checkout
- [ ] B. Return 503 with Retry-After for shed requests
- [ ] C. All traffic types must be treated equally during overload
- [ ] D. Payment path is core — cannot fully degrade authorized checkout without explicit policy

---

### Q19 [Easy] [Case Study] — UptimeCorp Regional Failover Drill



**Context:** Primary region fails. Route 53 shifts traffic to secondary region. RTO target is 15 minutes; last quarter drill measured 22 minutes due to untested runbook steps.

**Select all that apply.**

What DR practices improve outcomes?

- [ ] A. Multi-region is free and default for all systems regardless of tier
- [ ] B. Automatic failover RTO often 30 s–2 min; manual avoids split-brain risk but slower
- [ ] C. Tested runbooks and quarterly restore/failover drills reduce MTTR
- [ ] D. Untested backup equals no backup — verify restores, not just snapshots

---

### Q20 [Easy] — Split-Brain Prevention



**Select all that apply.**

During DB failover, two nodes briefly believe they are primary and accept writes.

- [ ] A. Split-brain causes diverging writes — must be prevented with quorum, STONITH, or fencing
- [ ] B. Patroni, RDS Multi-AZ, and etcd quorum help coordinate safe failover
- [ ] C. Split-brain is harmless — databases merge conflicting writes automatically
- [ ] D. Manual failover trades speed for reduced split-brain risk in some architectures

---

### Q21 [Medium] [Case Study] — UptimeCorp Error Budget Burn



**Context:** UptimeCorp SLO is 99.95% availability (0.05% error budget ≈ 22 min/month). A bad deploy burns 12% of the monthly budget in one hour. Pager fires on fast burn rate.

**Select all that apply.**

Which SLO/error budget practices apply?

- [ ] A. SLI measures successful valid requests — typically exclude client 4xx from availability SLI
- [ ] B. One 500 error should always page on-call immediately
- [ ] C. Alert on error budget burn rate — not every single 500 error
- [ ] D. Budget exhausted → freeze risky features; focus stability

---

### Q22 [Medium] — SLI Selection



**Select all that apply.**

Which are valid SLIs for UptimeCorp checkout?

- [ ] A. Percentage of checkout attempts completing payment within 30 seconds
- [ ] B. Error rate (5xx + timeout) on checkout path
- [ ] C. Server process "up" ping alone — sufficient for user-perceived availability
- [ ] D. P99 latency of payment API

---

### Q23 [Medium] [Case Study] — UptimeCorp Canary Deploy



**Context:** UptimeCorp deploys new order service to 5% of traffic, monitors checkout SLI for 10 minutes, then rolls to 100%. SLI drops 0.3% during canary — pipeline auto-rolls back.

**Select all that apply.**

Which safe deploy practices apply?

- [ ] A. Canary limits blast radius of bad deploys — majority of traffic unaffected
- [ ] B. Automated rollback when SLI degrades during canary window
- [ ] C. Big-bang deploy to 100% without metrics is fastest and safest
- [ ] D. Feature flags can disable bad code paths without full redeploy

---

### Q24 [Medium] — Defense in Depth Stack



**Select all that apply.**

UptimeCorp layers reliability patterns on the payment path.

- [ ] A. Redundancy → timeouts → retries → circuit breaker → bulkhead → graceful degradation → failover
- [ ] B. One pattern alone (e.g., circuit breaker only) is sufficient defense
- [ ] C. Patterns work together — not in isolation
- [ ] D. Assume failure — design, test, and operate for components breaking

---

### Q25 [Hard] [Case Study] — UptimeCorp Chaos Experiment



**Context:** SRE kills one AZ instance during business hours. Hypothesis: "Checkout SLI stays above 99.9%." SLI drops to 98% — sessions were in pod memory.

**Select all that apply.**

What chaos engineering practices apply?

- [ ] A. Start with small blast radius in staging, then controlled production experiments
- [ ] B. Define steady-state metric (checkout SLI) and hypothesis before injecting failure
- [ ] C. Fix findings — move sessions to Redis; rerun experiment to validate
- [ ] D. Chaos in full production without limits on day one is standard first step

---

### Q26 [Hard] — Partial vs Total Failure



**Select all that apply.**

Which statements about failure modes are correct?

- [ ] A. Partial/slow failures are harder to detect than total outage — need latency/error-rate alerts
- [ ] B. Cascading failure can start from one slow dependency without multiple root causes
- [ ] C. Only total failures require design attention
- [ ] D. Timeouts and circuit breakers address slow partial failures

---

### Q27 [Easy] — MTBF and MTTR



**Select all that apply.**

Availability relates to MTBF and MTTR.

- [ ] A. Lowering MTTR raises availability without reducing failure frequency
- [ ] B. Higher MTBF alone guarantees high availability if MTTR is hours
- [ ] C. Availability ≈ MTBF / (MTBF + MTTR)
- [ ] D. Incident MTTR spans alert → fix → verified restoration

---

### Q28 [Medium] [Case Study] — UptimeCorp Read-Only Mode



**Context:** Primary DB fails over to replica with 45-second lag. UptimeCorp enables read-only mode: browse works, checkout disabled with clear banner.

**Select all that apply.**

What degradation strategy is this?

- [ ] A. Graceful degradation — partial function over total outage
- [ ] B. Core browse path alive; enhanced checkout paused until consistency restored
- [ ] C. Continue accepting payments against potentially stale inventory during failover
- [ ] D. Communicate clearly to users — better than silent wrong charges

---

### Q29 [Hard] — Designing for Failure Checklist



**Select all that apply.**

Which belong on UptimeCorp's reliability checklist?

- [ ] A. Idempotency on all write paths that retry (API, queue, failover)
- [ ] B. Eliminate SPOF with multi-instance, multi-AZ redundancy and health checks
- [ ] C. Most outages are external hardware — ignore deploy pipeline quality
- [ ] D. Blameless postmortems with owned action items after incidents

---

### Q30 [Hard] [Case Study] — UptimeCorp Game Day



**Context:** UptimeCorp simulates payment provider 503 for one hour. On-call follows runbook, enables cached fallback for order status, communicates via status page. MTTR improves 40% vs last real incident.

**Select all that apply.**

What practices does this exercise?

- [ ] A. Game day — scheduled incident simulation improves runbooks and MTTR
- [ ] B. Test degradations in staging by manually opening circuits before production need
- [ ] C. Game days replace need for metrics, SLOs, or automated rollback
- [ ] D. Problem→pattern: dependency down → circuit breaker + fallback + comms

---

### Q31 [Easy] [Case Study] — UptimeCorp DNS Outage



**Context:** UptimeCorp's DNS provider fails for 20 minutes. All application servers are healthy but users cannot resolve `shop.uptimecorp.com`.

**Select all that apply.**

What reliability lesson applies?

- [ ] A. Very low TTL eliminates all DNS failure impact with zero trade-offs
- [ ] B. Healthy application servers matter little if DNS resolution fails
- [ ] C. Secondary DNS provider or failover registrar reduces risk
- [ ] D. DNS is an easily overlooked single point of failure

---

### Q32 [Easy] — Kubernetes Probe Types



**Select all that apply.**

Which probe purposes are correct?

- [ ] A. Liveness — is the process alive; restart if dead
- [ ] B. Readiness — can this instance accept traffic; remove from load balancer if failing
- [ ] C. Startup — slow-init apps need extended probe before liveness kills the pod
- [ ] D. Liveness should fail the pod on any transient database blip across the dependency graph

---

### Q33 [Easy] [Case Study] — UptimeCorp Post-Outage Login Surge



**Context:** After a 30-minute outage, 500,000 users refresh simultaneously. Auth service is overwhelmed despite capacity for normal peak of 50,000 logins per minute.

**Select all that apply.**

What describes this failure mode and valid responses?

- [ ] A. Staged recovery or token-bucket limits on the login path may be required
- [ ] B. Recovery storm / thundering herd after incidents
- [ ] C. Steady-state peak capacity automatically handles post-outage recovery surges
- [ ] D. Rate limiting, jittered client retry, and edge queueing help absorb the surge

---

### Q34 [Easy] — Classifying Dependency Failures



**Select all that apply.**

How should UptimeCorp classify dependency failures for handling policy?

- [ ] A. Transient — retry with backoff may succeed (503, timeout)
- [ ] B. Permanent — bad input; retry will not help (400, invalid schema)
- [ ] C. Slow partial — may need timeout and circuit breaker before hard failure
- [ ] D. All failures should be retried identically with the same policy

---

### Q35 [Easy] [Case Study] — UptimeCorp Health Check Flapping



**Context:** UptimeCorp's ALB uses deep health checks including Redis reachability. A 2-second Redis blip marks all 6 instances unhealthy simultaneously — the site goes fully down.

**Select all that apply.**

What went wrong and what should change?

- [ ] A. Brief shared dependency blips should not drain the entire fleet without hysteresis or layered checks
- [ ] B. More aggressive dependency checks always improve end-user reliability
- [ ] C. Unhealthy threshold and check interval tuning reduces flapping
- [ ] D. When all backends fail health checks, the load balancer serves no traffic

---

### Q36 [Easy] — N+1 Redundant Capacity



**Select all that apply.**

Which capacity planning statements are correct?

- [ ] A. N+1 spare capacity covers one instance failure during normal load
- [ ] B. Headroom for deploys and traffic spikes is separate from failure redundancy
- [ ] C. Running at 100% utilization maximizes reliability and user experience
- [ ] D. Chaos drills and load tests validate redundancy assumptions

---

### Q37 [Medium] [Case Study] — UptimeCorp Hedged Requests



**Context:** UptimeCorp's search service calls two read replicas; the first response wins and the slower call is cancelled. P99 latency drops 40%.

**Select all that apply.**

What pattern is this and when is it appropriate?

- [ ] A. Hedging every request always doubles cost with no selective cap or benefit
- [ ] B. Apply selectively — risky for non-idempotent writes without careful design
- [ ] C. Hedged requests trade extra load for tail-latency reduction
- [ ] D. Useful when an occasional slow replica causes tail spikes

---

### Q38 [Medium] — Fallback vs Fail Fast



**Select all that apply.**

Which compare fallback and fail-fast strategies?

- [ ] A. Fallback returns a degraded response when a dependency fails
- [ ] B. Fail fast returns an error immediately and preserves caller resources
- [ ] C. Fallback and fail fast are identical strategies with the same UX
- [ ] D. Choice depends on feature criticality and acceptable user experience

---

### Q39 [Medium] [Case Study] — UptimeCorp API Rate Limiting



**Context:** Under a traffic spike resembling a DDoS, UptimeCorp enables per-API-key rate limits returning `429` with `Retry-After`. Core paying customers remain stable.

**Select all that apply.**

What reliability pattern applies?

- [ ] A. Accepting unlimited traffic is required for high availability
- [ ] B. Per-tenant limits protect the shared platform from one abusive client
- [ ] C. Rate limiting is overload protection — a form of load shedding
- [ ] D. `Retry-After` helps well-behaved clients back off

---

### Q40 [Medium] — Blue-Green vs Rolling Deploy



**Select all that apply.**

Which statements compare deploy strategies?

- [ ] A. Blue-green enables fast rollback by switching traffic between environments
- [ ] B. Rolling deploy replaces instances gradually — smaller blast radius per wave
- [ ] C. Blue-green often requires duplicate infrastructure during cutover
- [ ] D. Rolling deploys never need health checks, canaries, or automated rollback

---

### Q41 [Medium] [Case Study] — UptimeCorp Hidden Dependency Chain



**Context:** Post-incident review reveals Payment synchronously calls a legacy Fraud service nobody documented. Checkout failed when Fraud slowed.

**Select all that apply.**

What practices prevent surprise cascades?

- [ ] A. Documentation alone eliminates the need for timeouts and circuit breakers
- [ ] B. Distributed tracing reveals runtime dependencies missing from architecture diagrams
- [ ] C. Dependency maps and service catalogs improve blast-radius analysis
- [ ] D. Undocumented sync chains hide cascading failure risk

---

### Q42 [Medium] — Synthetic Monitoring



**Select all that apply.**

Which statements about synthetic monitoring are correct?

- [ ] A. External probes exercise checkout path on a schedule
- [ ] B. Run probes from multiple regions for geo-aware availability measurement
- [ ] C. Synthetic checks can detect failures before user reports — improving MTTD
- [ ] D. Synthetic traffic fully replaces real-user metrics and SLIs

---

### Q43 [Medium] [Case Study] — UptimeCorp Status Page Trust



**Context:** During a partial checkout outage, UptimeCorp's status page shows "All systems operational." Support tickets spike and customer trust erodes.

**Select all that apply.**

What should incident communication include?

- [ ] A. Accurate status communication is part of incident response
- [ ] B. Component-level status reduces support load and confusion
- [ ] C. Hiding partial outages improves long-term customer trust
- [ ] D. Automate status updates from SLI burn or synthetic checks where possible

---

### Q44 [Medium] — Blast Radius Reduction



**Select all that apply.**

Which techniques limit blast radius?

- [ ] A. Cell-based architecture confines failure to one cell or shard
- [ ] B. Feature flags disable bad code paths without full redeploy rollback
- [ ] C. Monoliths always have smaller blast radius than microservices
- [ ] D. Isolate experimental workloads from production critical paths

---

### Q45 [Hard] [Case Study] — UptimeCorp Compounded Retries



**Context:** API gateway retries 3×, order service retries 3×, and mobile client retries 3×. During a payment blip, Payment receives up to 27× effective load.

**Select all that apply.**

What fixes apply?

- [ ] A. Server idempotency is still required, but budgets reduce load during outages
- [ ] B. Retry budgets per layer prevent end-to-end amplification
- [ ] C. Document and cap retries end-to-end in architecture reviews
- [ ] D. Multi-layer retries always improve reliability with zero downside

---

### Q46 [Hard] — Cold, Warm, and Hot Standby



**Select all that apply.**

Which compare disaster recovery standby models?

- [ ] A. Cold standby — minimal running cost; longer RTO to provision and start
- [ ] B. Warm standby — partially running; faster RTO than cold
- [ ] C. Hot active-active standby has lowest RTO but highest cost and complexity
- [ ] D. Cold standby automatically guarantees zero RPO without backup design

---

### Q47 [Hard] [Case Study] — UptimeCorp Latency SLO Miss



**Context:** Error rate is 0.1% but checkout P99 latency SLO is breached for 2 hours. No pages fire because alerts only watch 5xx rate.

**Select all that apply.**

What monitoring gap exists?

- [ ] A. Tail latency degrades UX even when HTTP 5xx rate stays low
- [ ] B. Zero errors means all reliability and user-experience goals are met
- [ ] C. Multi-window burn alerts on latency percentiles are needed alongside availability
- [ ] D. Latency SLIs catch slow partial failures without elevated error rate

---

### Q48 [Hard] — Poison Input on Sync Path



**Select all that apply.**

A webhook handler crashes on one malformed payload in a loop. Which responses apply?

- [ ] A. Validate and reject bad input at the edge before crash-prone parsing
- [ ] B. Circuit breaker on downstream dependencies does not fix own crash-on-parse bugs
- [ ] C. Retry the same malformed payload forever until it succeeds
- [ ] D. Dead-letter or quarantine pattern applies to sync workers handling untrusted input

---

### Q49 [Hard] [Case Study] — UptimeCorp Active-Active Write Conflict



**Context:** Two regions accept writes during a network partition. The same user updates their profile in both regions — conflicting versions on merge.

**Select all that apply.**

What does active-active require?

- [ ] A. Last-write-wins may silently lose data — design consciously
- [ ] B. Conflict resolution strategy — last-write-wins, CRDT, or primary-writer per entity
- [ ] C. Choose active-passive or single write region when strong consistency is mandatory
- [ ] D. Cloud networks never partition — active-active has no merge conflicts

---

### Q50 [Hard] — Reliability Culture and Operations



**Select all that apply.**

Which belong in UptimeCorp's long-term reliability culture?

- [ ] A. Blameless postmortems focus on systems and process, not individual blame
- [ ] B. Error budgets align product velocity with measurable reliability trade-offs
- [ ] C. 100% uptime is a realistic engineering target for all tier-1 services
- [ ] D. Runbooks, game days, and chaos experiments convert design into operational skill
