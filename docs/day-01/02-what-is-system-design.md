# What Is System Design?

[← Why System Design](./01-why-system-design.md) | [Day 1 Index](./README.md) | [Next: Types →](./03-types-of-system-design.md)

## Definition

**System design** is the process of defining the architecture, components, modules, interfaces, and data flows for a system to satisfy specified requirements.

In plain terms: you decide **what pieces exist**, **how they talk to each other**, and **how the whole thing behaves** under normal and stressful conditions.

## What "System" Means Here

A *system* is not just one program. It's the full picture:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API /     │────▶│  Database   │
│  (Web/App)  │     │   Backend   │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │    Cache    │
                    │   / Queue   │
                    └─────────────┘
```

A system typically includes:

- **Clients** — web apps, mobile apps, CLI tools
- **Servers** — APIs, business logic, background workers
- **Storage** — databases, file systems, object stores
- **Infrastructure** — load balancers, CDNs, message brokers
- **External services** — payment gateways, email providers, third-party APIs

## Two Kinds of Requirements

Every design starts with requirements.

### Functional Requirements

*What* the system must do.

- Users can create an account
- Users can upload a photo
- Users can search by keyword

### Non-Functional Requirements (NFRs)

*How well* the system must do it. These often drive architecture more than features.

| NFR | Example |
|-----|---------|
| **Scalability** | Handle 10K → 10M users without rewrite |
| **Availability** | 99.9% uptime (~8.7 hours downtime/year) |
| **Latency** | API responses under 200ms at p95 |
| **Throughput** | 5,000 requests per second |
| **Consistency** | All users see the same data within 1 second |
| **Durability** | No data loss after a write is acknowledged |
| **Security** | Encrypt data at rest and in transit |

## Core Building Blocks

Most systems reuse the same primitives:

| Building Block | Purpose |
|----------------|---------|
| **Load Balancer** | Distributes traffic across servers |
| **API Gateway** | Single entry point, routing, auth, rate limiting |
| **Cache** | Stores frequently accessed data in fast memory |
| **Database** | Persistent structured storage (SQL or NoSQL) |
| **Message Queue** | Async communication between services |
| **CDN** | Serves static content from edge locations |
| **Object Storage** | Stores files, images, videos (S3, GCS) |

You don't need all of them in every system. The art is knowing **which ones you need and when**.

## The Design Process (High Level)

1. **Clarify requirements** — ask questions, define scope
2. **Estimate scale** — users, QPS, storage, bandwidth
3. **Propose high-level design** — boxes and arrows
4. **Deep dive** — database schema, APIs, key algorithms
5. **Identify bottlenecks** — what breaks first under load?
6. **Discuss trade-offs** — why this choice over alternatives

## System Design vs Other Disciplines

| Discipline | Focus |
|------------|-------|
| **System Design** | Architecture, scale, reliability, component interaction |
| **Software Design** | Classes, modules, patterns within one application |
| **Database Design** | Schema, indexes, normalization, query patterns |
| **DevOps / SRE** | Deployment, monitoring, incident response |
| **Security Design** | Threat modeling, auth, encryption, compliance |

They overlap. A senior engineer moves comfortably between all of them.

## Summary

System design is the blueprint for how software components work together to meet both functional and non-functional requirements. It covers clients, servers, storage, and infrastructure — and the process of making deliberate trade-offs among scale, speed, cost, and reliability.

---

[Next: Types of System Design →](./03-types-of-system-design.md)
