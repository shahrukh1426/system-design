# Low-Level Design (LLD)

[← HLD](./02-hld.md) | [Day 2 Index](./README.md) | [Next: Capacity Design →](./04-capacity-design.md)

## What Is LLD?

**Low-Level Design** zooms into a single component from HLD and specifies *how it works internally* — classes, modules, database schemas, algorithms, and interaction sequences.

HLD tells you there's an Order Service. LLD tells you how `OrderService.createOrder()` works step by step.

## HLD vs LLD

| Aspect | HLD | LLD |
|--------|-----|-----|
| Scope | Entire system | One component |
| Audience | Architects, leads, stakeholders | Implementing engineers |
| Detail | Services and connections | Classes, tables, APIs |
| Diagrams | Component, context | Class, sequence, ER |
| When | Before implementation starts | During implementation planning |

## What LLD Includes

| Element | Description |
|---------|-------------|
| **Class / module structure** | Responsibilities, dependencies |
| **Database schema** | Tables, columns, indexes, constraints |
| **API contracts** | Request/response shapes, error codes |
| **Algorithms** | Core logic (e.g. rate limiting, ranking) |
| **State machines** | Valid state transitions |
| **Sequence diagrams** | Step-by-step method calls |
| **Concurrency model** | Threading, locking, idempotency |

## LLD Example: Order Service

### Class Structure

```
┌─────────────────────┐
│  OrderController    │  HTTP layer
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   OrderService      │  Business logic
└──────────┬──────────┘
           │
┌──────────▼──────────┐     ┌──────────────────┐
│  OrderRepository    │────▶│  orders (table)  │
└─────────────────────┘     └──────────────────┘
```

### Database Schema

```sql
CREATE TABLE orders (
    id           UUID PRIMARY KEY,
    user_id      UUID NOT NULL,
    status       VARCHAR(20) NOT NULL,  -- PLACED, PAID, SHIPPED, DELIVERED
    total_amount DECIMAL(10,2) NOT NULL,
    created_at   TIMESTAMP NOT NULL,
    updated_at   TIMESTAMP NOT NULL
);

CREATE TABLE order_items (
    id         UUID PRIMARY KEY,
    order_id   UUID REFERENCES orders(id),
    product_id UUID NOT NULL,
    quantity   INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### Order State Machine

```
   PLACED ──▶ PAID ──▶ SHIPPED ──▶ DELIVERED
     │          │
     ▼          ▼
 CANCELLED   REFUNDED
```

Invalid transitions (e.g. `DELIVERED → PLACED`) must be rejected at the service layer.

### Sequence: Create Order

```
Client → OrderController.create()
       → OrderService.validateCart()
       → OrderService.calculateTotal()
       → OrderRepository.insert()     [DB transaction]
       → PaymentClient.charge()       [external call]
       → OrderService.updateStatus(PAID)
       → EventPublisher.publish(OrderCreated)
       → OrderController.return 201
```

## Key LLD Patterns

### Repository Pattern

Isolates data access from business logic. Makes testing and storage swaps easier.

```
OrderService → OrderRepository → Database
              (interface)        (implementation)
```

### Service Layer

Business rules live here — not in controllers or repositories.

- Controller: parse request, call service, format response
- Service: validate, orchestrate, enforce rules
- Repository: CRUD operations only

### Idempotency

For operations that can be retried (payments, order creation):

```
POST /orders
Header: Idempotency-Key: uuid-1234

→ If key seen before: return cached response
→ If new: process and store result against key
```

### Error Handling Strategy

| Error Type | HTTP Code | Action |
|------------|-----------|--------|
| Validation failure | 400 | Return field errors |
| Not found | 404 | Log, return message |
| Conflict (duplicate) | 409 | Return existing resource |
| External service down | 503 | Retry with backoff |
| Internal bug | 500 | Log stack trace, alert on-call |

## When to Go Deep in LLD

Not every component needs equal detail. Prioritize:

1. **Hot paths** — code that runs on every request
2. **Complex logic** — state machines, pricing rules, matching algorithms
3. **Failure-prone areas** — payment, auth, data migration
4. **Shared libraries** — used by many teams

Simple CRUD endpoints can follow team conventions without a full LLD doc.

## Common LLD Mistakes

| Mistake | Fix |
|---------|-----|
| God class doing everything | Split by responsibility |
| Business logic in controllers | Move to service layer |
| No indexes on query columns | Design indexes with schema |
| Ignoring concurrency | Define locking and idempotency early |
| Over-engineering with patterns | Use patterns that solve real problems |

## LLD Deliverables

1. Class or module diagram
2. Database schema with indexes
3. API spec (OpenAPI / protobuf)
4. Sequence diagrams for critical flows
5. State transition diagrams where applicable
6. Notes on edge cases and error handling

## Summary

LLD is the blueprint inside the blueprint. While HLD shows the system at a glance, LLD gives engineers enough detail to build correctly — schemas, classes, state machines, and interaction flows for each component.

---

[Next: Capacity Design →](./04-capacity-design.md)
