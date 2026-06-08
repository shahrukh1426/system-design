# Data Design

[← Security Design](./07-security-design.md) | [Day 2 Index](./README.md) | [Next: API Design →](./09-api-design.md)

## What Is Data Design?

**Data design** defines how information is structured, stored, moved, and kept consistent across your system. It's often the hardest part to change later — so getting it right early pays off.

It answers: *What data do we store, where, and how does it flow?*

## The Data Design Process

```
1. Identify entities        → User, Order, Product
2. Define relationships     → User has many Orders
3. Choose storage type      → SQL, NoSQL, cache, object store
4. Design schema            → Tables, keys, indexes
5. Plan data flow           → How data moves between components
6. Choose consistency model → Strong vs eventual
```

## SQL vs NoSQL

### When to Use SQL (Relational)

- Structured data with clear relationships
- ACID transactions required (payments, inventory)
- Complex queries with joins
- Data integrity is critical

```
PostgreSQL, MySQL, CockroachDB
```

**Example:** E-commerce orders with line items, users, and payments.

### When to Use NoSQL

| Type | Best For | Examples |
|------|----------|----------|
| **Key-Value** | Session store, caching | Redis, DynamoDB |
| **Document** | Flexible schemas, content | MongoDB, CouchDB |
| **Wide-Column** | Time-series, high write volume | Cassandra, HBase |
| **Graph** | Social networks, recommendations | Neo4j, Neptune |

**Example:** User activity feed with variable post formats → Document DB.

### Decision Framework

| Requirement | Lean Toward |
|-------------|-------------|
| Complex joins, transactions | SQL |
| Schema changes frequently | Document NoSQL |
| Massive write throughput | Wide-column NoSQL |
| Sub-millisecond reads | Key-value (Redis) |
| Relationship-heavy queries | Graph DB |
| Simple key lookups at scale | Key-value (DynamoDB) |

Many production systems use **both** — PostgreSQL for core data, Redis for cache, Elasticsearch for search.

## Schema Design Principles

### Normalization vs Denormalization

**Normalized** (less redundancy, more joins):

```
users: id, name, email
orders: id, user_id, total
order_items: id, order_id, product_id, quantity
```

**Denormalized** (faster reads, more redundancy):

```
orders: id, user_id, user_name, user_email, total, items (JSON array)
```

| Approach | When |
|----------|------|
| Normalized | Write-heavy, data integrity critical |
| Denormalized | Read-heavy, latency-sensitive queries |

Start normalized. Denormalize when you measure read bottlenecks.

### Indexing Strategy

Indexes speed up reads but slow down writes.

```sql
-- Query: find orders by user
SELECT * FROM orders WHERE user_id = ?;
-- Needs: INDEX on user_id

-- Query: find active orders by date
SELECT * FROM orders WHERE status = 'ACTIVE' AND created_at > ?;
-- Needs: COMPOSITE INDEX on (status, created_at)
```

**Rules:**
- Index columns used in `WHERE`, `JOIN`, `ORDER BY`
- Avoid over-indexing (each index adds write cost)
- Use composite indexes for multi-column queries
- Monitor slow query logs

## Data Consistency Models

| Model | Behavior | Use Case |
|-------|----------|----------|
| **Strong consistency** | Every read returns latest write | Bank balances, inventory |
| **Eventual consistency** | Reads may be stale briefly | Social feeds, analytics |
| **Read-your-writes** | User sees their own updates immediately | User profile edits |
| **Causal consistency** | Related events seen in order | Comment threads |

### CAP in Practice

```
Payment system     → CP (consistency over availability)
Social media feed  → AP (availability over consistency)
Product catalog    → AP with cache invalidation
```

## Data Flow Patterns

### 1. ETL (Extract, Transform, Load)

Move data from operational DB to analytics warehouse.

```
App DB → ETL Pipeline (nightly) → Data Warehouse → BI Dashboard
```

### 2. CDC (Change Data Capture)

Stream database changes in real time.

```
PostgreSQL → Debezium → Kafka → [Search Index, Cache, Analytics]
```

### 3. Event Sourcing

Store state as a sequence of events, not just current state.

```
AccountCreated → MoneyDeposited → MoneyWithdrawn → ...
Current balance = replay all events
```

Good for audit trails and financial systems. Adds complexity.

### 4. CQRS (Command Query Responsibility Segregation)

Separate models for reads and writes.

```
Write → Command Handler → Write DB (normalized)
Read  → Query Handler  → Read DB (denormalized, optimized)
         ↑ sync via events
```

## Data Lifecycle

| Phase | Considerations |
|-------|----------------|
| **Creation** | Validation, defaults, timestamps |
| **Storage** | Retention policy, encryption, backups |
| **Access** | Auth checks, audit logging |
| **Archival** | Move old data to cold storage |
| **Deletion** | GDPR right to erasure, soft delete vs hard delete |

### Soft Delete vs Hard Delete

```sql
-- Soft delete: mark as deleted, keep data
UPDATE users SET deleted_at = NOW() WHERE id = ?;

-- Hard delete: permanently remove
DELETE FROM users WHERE id = ?;
```

Soft delete supports recovery and audit. Hard delete required for compliance (GDPR).

## Data Design Checklist

- [ ] Entities and relationships identified
- [ ] SQL vs NoSQL choice justified
- [ ] Schema designed with appropriate indexes
- [ ] Consistency model defined per data type
- [ ] Data retention and archival policy set
- [ ] Backup and restore strategy defined
- [ ] PII identified and protected
- [ ] Migration strategy for schema changes

## Summary

Data design shapes how information is stored, queried, and moved. Choose storage based on access patterns, normalize first and denormalize when measured, index for your queries, and pick consistency models that match business requirements. Data is the hardest thing to change — invest time here.

---

[Next: API Design →](./09-api-design.md)
