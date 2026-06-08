# Types of System Design

[← Day 2 Index](./README.md) | [Next: HLD →](./02-hld.md)

## Two Ways to Think About "Types"

In [Day 1](../day-01/03-types-of-system-design.md), we covered **architectural styles** — monolith, microservices, serverless, event-driven.

Day 2 covers **design disciplines** — the specialized lenses you apply when building or evolving a system. Think of them as different *questions* you must answer:

| Discipline | Core Question |
|------------|---------------|
| **HLD** | What are the major components and how do they connect? |
| **LLD** | How does each component work internally? |
| **Capacity** | How much infrastructure do we need? |
| **Scalability** | How do we grow when load increases? |
| **Reliability** | What happens when things fail? |
| **Security** | How do we protect data and access? |
| **Data** | How is information stored, moved, and kept consistent? |
| **API** | How do components expose and consume capabilities? |
| **Performance** | How fast must it be, and where are the bottlenecks? |
| **Observability** | How do we know what the system is doing? |
| **Refactor** | How do we improve what already exists safely? |

## How They Fit Together

```
                    ┌─────────────────────┐
                    │   Requirements      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │   HLD    │    │ Capacity │    │ Security │
        │ (shape)  │    │ (sizing) │    │ (threats)│
        └────┬─────┘    └──────────┘    └──────────┘
             │
    ┌────────┼────────┬──────────┬──────────┐
    ▼        ▼        ▼          ▼          ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐
│ LLD  │ │ Data │ │ API  │ │Performance│ │Observab. │
└──────┘ └──────┘ └──────┘ └──────────┘ └──────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌──────────┐
│ Scale  │ │Reliab. │ │ Refactor │
└────────┘ └────────┘ └──────────┘
```

No single discipline stands alone. A database choice (Data Design) affects scalability, performance, and reliability. An API contract (API Design) affects security and observability.

## Structural vs Non-Functional

### Structural Design

Defines the *shape* of the system.

| Type | Scope | Output |
|------|-------|--------|
| **HLD** | Whole system | Architecture diagrams, service map |
| **LLD** | Single component | Class diagrams, schemas, sequence diagrams |
| **API Design** | Boundaries between components | Endpoints, contracts, protocols |
| **Data Design** | Information layer | ER diagrams, data pipelines |

### Non-Functional Design

Defines *how well* the system behaves.

| Type | Focus | Key Metrics |
|------|-------|-------------|
| **Capacity** | Right-sizing resources | QPS, storage, bandwidth, cost |
| **Scalability** | Growth path | Horizontal vs vertical scaling |
| **Reliability** | Failure handling | Uptime %, MTTR, RPO/RTO |
| **Performance** | Speed and efficiency | Latency p50/p99, throughput |
| **Security** | Protection | Auth model, encryption, compliance |
| **Observability** | Visibility | Logs, metrics, traces, SLOs |

### Evolutionary Design

| Type | Focus | When |
|------|-------|------|
| **Refactor Design** | Safe improvement of existing systems | Tech debt, scale limits, team growth |

## When Each Discipline Matters Most

| Stage | Primary Disciplines |
|-------|---------------------|
| **Greenfield (new product)** | HLD, Data, API, Capacity |
| **Pre-launch** | Security, Performance, Reliability, Observability |
| **Growth phase** | Scalability, Capacity, Performance |
| **Mature system** | Observability, Refactor, Reliability |
| **Incident response** | Observability, Reliability |
| **Compliance audit** | Security, Data |

## The Design Review Checklist

Use this when reviewing any system design document:

- [ ] **HLD** — Can I draw the system in 5 boxes or fewer?
- [ ] **LLD** — Is the critical path (hottest code) designed in detail?
- [ ] **Capacity** — Are back-of-envelope numbers included?
- [ ] **Scalability** — What's the first bottleneck at 10x load?
- [ ] **Reliability** — Single points of failure identified?
- [ ] **Security** — Auth, encryption, and threat model addressed?
- [ ] **Data** — Schema, consistency model, and retention defined?
- [ ] **API** — Contracts versioned and documented?
- [ ] **Performance** — Latency targets and caching strategy stated?
- [ ] **Observability** — Metrics, logs, and alerts planned?
- [ ] **Refactor** — Migration path if changing existing systems?

## Summary

System design splits into structural disciplines (HLD, LLD, API, Data) and non-functional disciplines (Capacity, Scalability, Reliability, Security, Performance, Observability), plus evolutionary discipline (Refactor). Real projects weave all of them together — the rest of Day 2 goes deep on each one.

---

[Next: HLD →](./02-hld.md)
