# High-Level Design (HLD)

[← Types of System Design](./01-types-of-system-design.md) | [Day 2 Index](./README.md) | [Next: LLD →](./03-lld.md)

## What Is HLD?

**High-Level Design** defines the major components of a system, their responsibilities, and how they communicate — without diving into implementation details.

HLD answers: *What are the big pieces, and how do they fit together?*

## What HLD Includes

| Element | Description | Example |
|---------|-------------|---------|
| **Components** | Major services or modules | User Service, Payment Service |
| **Responsibilities** | What each component owns | "Order Service manages order lifecycle" |
| **Communication** | Sync vs async, protocols | REST, gRPC, message queue |
| **Data flow** | How information moves | Client → API Gateway → Service → DB |
| **External dependencies** | Third-party systems | Stripe, SendGrid, AWS S3 |
| **Deployment view** | Where things run | Cloud region, availability zones |

## What HLD Excludes

- Class names and method signatures (that's LLD)
- Specific database indexes
- Exact instance counts and machine sizes (that's Capacity Design)
- Detailed error handling logic

## HLD Diagram Example: E-Commerce Platform

```
┌──────────┐
│  Client  │ (Web / Mobile)
└────┬─────┘
     │ HTTPS
     ▼
┌──────────────┐
│ API Gateway  │  Auth, rate limiting, routing
└──────┬───────┘
       │
   ┌───┼───┬───────────┬────────────┐
   ▼   ▼   ▼           ▼            ▼
┌─────┐┌─────┐┌──────────┐┌──────────┐┌──────────┐
│User ││Catalog││  Cart   ││  Order   ││ Payment  │
│Svc  ││ Svc  ││  Svc    ││  Svc     ││  Svc     │
└──┬──┘└──┬──┘└────┬─────┘└────┬─────┘└────┬─────┘
   │      │        │           │           │
   ▼      ▼        ▼           ▼           ▼
  DB-A   DB-B    Redis       DB-C      Stripe API
```

## The HLD Process

### 1. Identify Actors

Who interacts with the system?

- End users (web, mobile)
- Admin users
- Other systems (webhooks, partner APIs)
- Background jobs (cron, event consumers)

### 2. Define Core Services

Group functionality by **bounded context** — a domain area with clear ownership.

**Good boundaries:**
- User Service — accounts, profiles, authentication
- Order Service — order creation, status, history

**Bad boundaries:**
- "Backend Service" — too vague
- Splitting by technical layer (Controller Service, Repository Service) — not a domain boundary

### 3. Draw Data Flows

For each major user journey, trace the path:

```
Place Order:
Client → API Gateway → Cart Svc (validate) → Order Svc (create)
       → Payment Svc (charge) → Notification Svc (email)
       → Order Svc (confirm)
```

### 4. Mark Sync vs Async

| Pattern | Use When |
|---------|----------|
| **Synchronous (REST/gRPC)** | Caller needs immediate response |
| **Asynchronous (queue/event)** | Work can happen later; caller doesn't wait |
| **Webhook** | External system pushes updates to you |

### 5. Note Key Decisions

Document *why*, not just *what*:

- "Order and Payment are separate services so payment provider changes don't affect order logic."
- "Notification is async — email delay is acceptable after order confirmation."

## HLD vs Architecture Styles

HLD is the **document/artifact**. Architecture style is the **pattern** you choose within it.

| Style | HLD Looks Like |
|-------|----------------|
| Monolith | One box with internal modules |
| Microservices | Many boxes, each a deployable unit |
| Serverless | API Gateway → Functions → Managed storage |
| Event-driven | Event bus at the center, services as consumers |

## Common HLD Mistakes

| Mistake | Fix |
|---------|-----|
| Too many boxes too early | Start with 3–5 components; split when needed |
| No clear ownership per service | Each box should own its data and logic |
| Ignoring external dependencies | Show third-party APIs explicitly |
| Mixing HLD and LLD in one diagram | Keep high-level; detail goes in LLD |
| No data flow for key journeys | Always trace the top 2–3 user flows |

## HLD Deliverables

A solid HLD document typically contains:

1. **Context diagram** — system boundary and external actors
2. **Component diagram** — services and connections
3. **Sequence diagrams** — for 2–3 critical flows
4. **Technology choices** — with brief rationale
5. **Open questions** — decisions deferred to LLD or later

## Summary

HLD is the map of your system: major components, their responsibilities, and how they communicate. It stays at the "boxes and arrows" level and sets the foundation for every other design discipline in Day 2.

---

[Next: LLD →](./03-lld.md)
