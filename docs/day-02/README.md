# Day 2 — Types of System Design

Day 1 introduced system design as a whole. Day 2 breaks it into the **disciplines** you'll apply in practice — from high-level architecture down to refactoring existing systems.

> **Note:** Day 1 covered architectural *styles* (monolith, microservices, etc.). Day 2 covers design *specialties* — the focused lenses you use at each stage.

## Topics

| # | Topic | File |
|---|-------|------|
| 1 | [Types of System Design](./01-types-of-system-design.md) | Map of all design disciplines |
| 2 | [HLD](./02-hld.md) | High-Level Design |
| 3 | [LLD](./03-lld.md) | Low-Level Design |
| 4 | [Capacity Design](./04-capacity-design.md) | Sizing infrastructure for load |
| 5 | [Scalability Design](./05-scalability-design.md) | Growing with demand |
| 6 | [Reliability Design](./06-reliability-design.md) | Uptime, fault tolerance, recovery |
| 7 | [Security Design](./07-security-design.md) | Threats, auth, data protection |
| 8 | [Data Design](./08-data-design.md) | Schema, storage, data flow |
| 9 | [API Design](./09-api-design.md) | Contracts, versioning, protocols |
| 10 | [Performance Design](./10-performance-design.md) | Latency, throughput, optimization |
| 11 | [Observability Design](./11-observability-design.md) | Logs, metrics, traces, alerts |
| 12 | [Refactor Design](./12-refactor-design.md) | Evolving systems without breaking them |

## Reading Order

Read 1 → 12 in sequence. Topics 2–3 (HLD/LLD) set the structural frame; topics 4–11 are the specialty lenses; topic 12 covers how to improve what already exists.

## Key Takeaways

- System design is not one activity — it's a set of **focused disciplines** applied at different stages.
- **HLD** answers *what components exist*; **LLD** answers *how each component works internally*.
- Non-functional concerns (capacity, scale, reliability, security, performance) drive most architectural decisions.
- **Observability** and **refactor design** are often overlooked early but critical for long-lived systems.

## Related

- [Day 1: Introduction](../day-01/README.md)
- [Day 1: Architectural Styles](../day-01/03-types-of-system-design.md)
