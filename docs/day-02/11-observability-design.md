# Observability Design

[← Performance Design](./10-performance-design.md) | [Day 2 Index](./README.md) | [Next: Refactor Design →](./12-refactor-design.md)

## What Is Observability?

**Observability** is the ability to understand the internal state of a system from its external outputs. When something breaks at 3 AM, observability tells you *what* broke, *where*, and *why*.

It answers: *How do we know what the system is doing right now?*

## Monitoring vs Observability

| Monitoring | Observability |
|------------|---------------|
| "Is the system up?" | "Why is it slow?" |
| Predefined dashboards and alerts | Explore unknown unknowns |
| Known failure modes | Debug novel problems |
| Reactive | Investigative |

You need both. Monitoring catches known issues; observability helps debug unexpected ones.

## The Three Pillars

### 1. Logs

Discrete events with context. What happened, when, and where.

```json
{
  "timestamp": "2024-03-15T10:30:00Z",
  "level": "ERROR",
  "service": "order-service",
  "request_id": "req-abc-123",
  "user_id": "user-456",
  "message": "Payment failed",
  "error": "Stripe timeout after 30s",
  "duration_ms": 30012
}
```

**Log levels:** DEBUG → INFO → WARN → ERROR → FATAL

**Best practices:**
- Structured JSON (not plain text) — searchable and parseable
- Include `request_id` in every log for tracing a single request
- Never log passwords, tokens, or PII
- Centralize logs (ELK stack, Loki, CloudWatch)

### 2. Metrics

Numerical measurements over time. Aggregated, efficient, alertable.

| Type | Description | Example |
|------|-------------|---------|
| **Counter** | Monotonically increasing | Total requests, errors |
| **Gauge** | Value at a point in time | Active connections, queue depth |
| **Histogram** | Distribution of values | Request latency buckets |

**Key metrics to track:**

```
RED Method (for services):
  Rate      → requests per second
  Errors    → error count per second
  Duration  → latency distribution

USE Method (for resources):
  Utilization → % CPU, memory, disk used
  Saturation  → queue depth, wait time
  Errors      → error count
```

**Example dashboard metrics:**

```
order-service:
  http_requests_total{method="POST", status="201"}     → counter
  http_request_duration_seconds{quantile="0.99"}       → histogram
  db_connection_pool_active                             → gauge
  payment_failures_total                                → counter
```

Tools: Prometheus + Grafana, Datadog, CloudWatch.

### 3. Traces

Follow a single request across multiple services.

```
Trace: req-abc-123 (total: 245ms)
├── API Gateway          12ms
├── Order Service        180ms
│   ├── Validate cart    5ms
│   ├── DB: insert order 45ms
│   └── Payment Service  120ms
│       └── Stripe API   115ms
└── Response             3ms
```

Traces reveal where time is spent in distributed systems.

Tools: Jaeger, Zipkin, AWS X-Ray, OpenTelemetry.

## Alerting Design

Alerts should be **actionable** — if it pages someone, they should be able to do something.

### Alert Severity

| Level | Response | Example |
|-------|----------|---------|
| **P1 — Critical** | Page on-call immediately | Service down, data loss |
| **P2 — High** | Page during business hours | Error rate > 5%, latency p99 > 2s |
| **P3 — Medium** | Ticket, review next day | Disk > 80%, certificate expiring in 14 days |
| **P4 — Low** | Informational | Deployment completed, scaling event |

### Good vs Bad Alerts

| Bad Alert | Good Alert |
|-----------|------------|
| "CPU > 50%" (too sensitive) | "CPU > 85% for 10 minutes" |
| "Any error occurred" | "Error rate > 1% for 5 minutes" |
| "Disk usage changed" | "Disk > 90% — add capacity within 48h" |

### Alert Fatigue

Too many alerts → engineers ignore them all.

- Alert on **symptoms** (user-facing impact), not causes
- Every alert needs a **runbook** link
- Review and prune alerts quarterly
- Use alert aggregation (don't page for every instance)

## SLIs, SLOs, and SLAs

| Term | Definition | Example |
|------|------------|---------|
| **SLI** | Service Level Indicator — what you measure | API latency p99 |
| **SLO** | Service Level Objective — internal target | p99 < 300ms |
| **SLA** | Service Level Agreement — contract with users | 99.9% uptime or refund |

```
SLI:  % of requests completing in < 300ms
SLO:  99% of requests meet that target (measured monthly)
SLA:  99.9% uptime guaranteed to customers
```

**Error budget:** If SLO is 99.9%, you can "spend" 0.1% on failures (deployments, experiments).

```
Error budget remaining: 43 minutes this month
→ Safe to deploy risky changes
→ Budget exhausted? Freeze deploys, focus on reliability
```

## Observability Architecture

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Service A  │  │  Service B  │  │  Service C  │
│  (logs,     │  │  (logs,     │  │  (logs,     │
│   metrics,  │  │   metrics,  │  │   metrics,  │
│   traces)   │  │   traces)   │  │   traces)   │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
              ┌──────────────────┐
              │  OpenTelemetry   │  (collection agent)
              │  Collector       │
              └────────┬─────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌─────────┐ ┌─────────┐
    │  Logs    │ │ Metrics │ │ Traces  │
    │ (Loki/   │ │ (Prom/  │ │ (Jaeger/│
    │  ELK)    │ │ Grafana)│ │  X-Ray) │
    └──────────┘ └─────────┘ └─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │    Dashboards    │
              │    + Alerts      │
              └──────────────────┘
```

## Instrument from Day One

Don't bolt on observability after launch.

| Phase | What to Add |
|-------|-------------|
| **Development** | Structured logging, health endpoints |
| **Pre-launch** | Metrics (RED), basic dashboards, critical alerts |
| **Production** | Distributed tracing, SLOs, runbooks |
| **Mature** | Error budgets, anomaly detection, capacity forecasting |

## Observability Checklist

- [ ] Structured JSON logging with request IDs
- [ ] RED metrics on every service
- [ ] Distributed tracing across service boundaries
- [ ] Dashboards for each service and overall system health
- [ ] Alerts on symptoms (latency, error rate), not causes
- [ ] Runbooks linked to every P1/P2 alert
- [ ] SLOs defined with error budgets
- [ ] Log retention policy (30–90 days typical)
- [ ] No secrets or PII in logs

## Summary

Observability design gives you visibility into system behavior through logs, metrics, and traces. Define SLIs and SLOs, alert on user-facing symptoms, and instrument from the start. When production breaks, good observability is the difference between a 5-minute fix and a 5-hour outage.

---

[Next: Refactor Design →](./12-refactor-design.md)
