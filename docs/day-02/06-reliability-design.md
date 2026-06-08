# Reliability Design

[← Scalability Design](./05-scalability-design.md) | [Day 2 Index](./README.md) | [Next: Security Design →](./07-security-design.md)

## What Is Reliability?

**Reliability** is the probability that a system performs correctly for a given period under expected conditions. In practice: *does it stay up, and when it fails, does it recover gracefully?*

## Key Metrics

| Metric | Definition | Example |
|--------|------------|---------|
| **Availability** | % of time system is operational | 99.9% = "three nines" |
| **MTBF** | Mean Time Between Failures | 720 hours |
| **MTTR** | Mean Time To Recover | 15 minutes |
| **RPO** | Recovery Point Objective — max data loss | 5 minutes of data |
| **RTO** | Recovery Time Objective — max downtime | 30 minutes |

### The Nines

| Availability | Downtime/Year | Downtime/Month |
|--------------|---------------|----------------|
| 99% (two nines) | 3.65 days | 7.2 hours |
| 99.9% (three nines) | 8.76 hours | 43.8 minutes |
| 99.99% (four nines) | 52.6 minutes | 4.4 minutes |
| 99.999% (five nines) | 5.26 minutes | 26 seconds |

Each nine is roughly **10× harder** than the last. Design for the nines your business actually needs — not the maximum possible.

## Failure Modes to Plan For

| Failure | Example | Mitigation |
|---------|---------|------------|
| **Hardware** | Disk crash, server dies | Redundancy, auto-replace |
| **Software bug** | Null pointer, memory leak | Testing, canary deploys, rollbacks |
| **Network** | Partition, DNS failure | Retries, multi-AZ, circuit breakers |
| **Dependency** | Payment API down | Fallbacks, timeouts, graceful degradation |
| **Human error** | Bad deploy, wrong config | CI/CD gates, infra as code |
| **Overload** | Traffic spike | Rate limiting, auto-scaling, queues |
| **Data corruption** | Bad migration | Backups, checksums, validation |

Assume **everything will fail eventually**. Design for it.

## Core Reliability Patterns

### 1. Redundancy

No single point of failure (SPOF).

```
Before (SPOF):          After (redundant):
┌──────────┐            ┌──────────┐  ┌──────────┐
│ 1 Server │            │ Server A │  │ Server B │
│  1 DB    │            │  DB Pri  │  │ DB Repl  │
└──────────┘            └──────────┘  └──────────┘
```

Run at least **2 instances** of everything critical, across **multiple availability zones**.

### 2. Health Checks

Load balancer pings servers; unhealthy ones stop receiving traffic.

```
GET /health → 200 OK (receiving traffic)
GET /health → 503     (removed from pool)
```

Check dependencies too — a server that can't reach its DB shouldn't receive requests.

### 3. Retries with Backoff

Transient failures often succeed on retry.

```
Attempt 1 → fail → wait 100ms
Attempt 2 → fail → wait 200ms
Attempt 3 → fail → wait 400ms
Attempt 4 → give up, return error
```

Use **exponential backoff + jitter** to avoid thundering herd.

### 4. Circuit Breaker

Stop calling a failing service to prevent cascading failure.

```
States:
  CLOSED  → normal, requests flow through
  OPEN    → too many failures, reject immediately
  HALF-OPEN → test one request, if OK → CLOSED
```

```
Order Svc → Payment Svc (failing)
         → Circuit OPEN
         → Return "payment temporarily unavailable"
         → Order stays in PENDING, retry later
```

### 5. Timeouts

Never wait forever for a response.

| Call Type | Typical Timeout |
|-----------|-----------------|
| Internal service | 1–5 seconds |
| Database query | 500ms–2 seconds |
| External API | 5–30 seconds |

Set timeouts **shorter** at the edge, longer deeper in the stack.

### 6. Graceful Degradation

When a non-critical feature fails, core functionality continues.

| Feature | Degraded Behavior |
|---------|-------------------|
| Recommendations engine down | Show popular items instead |
| Search index stale | Fall back to database query |
| Analytics pipeline lagging | Core app unaffected |

### 7. Idempotency

Safe to retry operations without duplicate side effects.

```
POST /payments (Idempotency-Key: abc)
→ Charge once, even if retried 3 times
```

Critical for payments, order creation, and any write that external systems can retry.

### 8. Backups and Disaster Recovery

| Strategy | RPO | RTO | Cost |
|----------|-----|-----|------|
| Daily backups | 24 hours | Hours | Low |
| Continuous replication | Minutes | Minutes | Medium |
| Multi-region active-active | Near zero | Near zero | High |

**Test restores regularly.** An untested backup is not a backup.

## CAP Theorem (Brief)

In a network partition, distributed systems trade off:

- **Consistency** — all nodes see the same data
- **Availability** — every request gets a response
- **Partition tolerance** — system works despite network splits

You can only guarantee **two of three**. Most web systems choose **AP** (availability + partition tolerance) with eventual consistency.

## Reliability Checklist

- [ ] No single points of failure in critical path
- [ ] Deployed across multiple availability zones
- [ ] Health checks on all services
- [ ] Timeouts on all external calls
- [ ] Retries with exponential backoff
- [ ] Circuit breakers on fragile dependencies
- [ ] Idempotent write operations
- [ ] Automated backups with tested restore
- [ ] Rollback plan for deployments
- [ ] Runbooks for common failure scenarios

## Summary

Reliability design plans for failure before it happens: redundancy, health checks, retries, circuit breakers, timeouts, graceful degradation, and disaster recovery. Define your availability target in nines, then invest engineering effort proportional to that goal.

---

[Next: Security Design →](./07-security-design.md)
