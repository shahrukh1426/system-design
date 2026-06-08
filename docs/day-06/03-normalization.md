# Normalization

[← Keys](./02-keys.md) | [Day 6 Index](./README.md) | [Next: Indexes →](./04-indexes.md)

## What Is Normalization?

**Normalization** organizes data into tables to **reduce redundancy** and **avoid update anomalies**. Each fact is stored in exactly one place.

```
Denormalized (bad):
  orders: order_id, user_name, user_email, product_name, product_price
  → user email stored on every order row
  → change email → update thousands of rows

Normalized (good):
  users:    id, name, email
  products: id, name, price
  orders:   id, user_id, product_id, quantity
  → email lives in one row
```

## Why Normalize?

| Problem | Normalized Fix |
|---------|----------------|
| **Update anomaly** | Change email in one place, not every order |
| **Insert anomaly** | Add product without creating fake order |
| **Delete anomaly** | Delete last order doesn't delete product info |
| **Data inconsistency** | Same user email differs across rows |
| **Wasted storage** | Repeated strings on every row |

## Normal Forms

### First Normal Form (1NF)

- Each column holds **atomic** (indivisible) values
- No repeating groups or arrays in a single column

```
Violates 1NF:
  user_id | phones
  1       | "555-1234, 555-5678"     ← multiple values in one cell

1NF:
  user_id | phone
  1       | 555-1234
  1       | 555-5678
```

Or use a separate `user_phones` table.

### Second Normal Form (2NF)

- Must be in 1NF
- Every non-key column depends on the **whole** primary key (not just part of it)

Relevant for **composite primary keys**.

```
Violates 2NF (composite PK: order_id + product_id):
  order_id | product_id | product_name | quantity
  1        | 101        | Widget       | 2
  1        | 102        | Gadget       | 1

  product_name depends only on product_id — not the full PK

2NF:
  order_items: order_id, product_id, quantity
  products:    product_id, product_name
```

### Third Normal Form (3NF)

- Must be in 2NF
- No non-key column depends on **another non-key column** (no transitive dependency)

```
Violates 3NF:
  orders: order_id, user_id, user_city, user_country
  user_city depends on user_id, not order_id directly

3NF:
  users:  user_id, city, country
  orders: order_id, user_id
```

### Beyond 3NF

| Form | Rarely discussed in practice |
|------|---------------------------|
| BCNF | Stricter 3NF |
| 4NF | Multi-valued dependencies |
| 5NF | Join dependencies |

For system design interviews and real apps, **3NF is the target**.

## Normalization Example

### Before (Denormalized)

```
┌────────────────────────────────────────────────────────────┐
│ orders_denormalized                                        │
├──────────┬───────────┬────────────┬─────────────┬────────┤
│ order_id │ user_name │ user_email │ product_name│ total  │
├──────────┼───────────┼────────────┼─────────────┼────────┤
│ 1        │ Alice     │ alice@...  │ Widget      │ 29.99  │
│ 2        │ Alice     │ alice@...  │ Gadget      │ 49.99  │
│ 3        │ Bob       │ bob@...    │ Widget      │ 29.99  │
└──────────┴───────────┴────────────┴─────────────┴────────┘
```

Alice's email appears twice. Widget name appears twice.

### After (3NF)

```sql
CREATE TABLE users (
    id    BIGINT PRIMARY KEY,
    name  VARCHAR(100),
    email VARCHAR(255) UNIQUE
);

CREATE TABLE products (
    id    BIGINT PRIMARY KEY,
    name  VARCHAR(100),
    price DECIMAL(10,2)
);

CREATE TABLE orders (
    id         BIGINT PRIMARY KEY,
    user_id    BIGINT REFERENCES users(id),
    created_at TIMESTAMP
);

CREATE TABLE order_items (
    order_id    BIGINT REFERENCES orders(id),
    product_id  BIGINT REFERENCES products(id),
    quantity    INT,
    PRIMARY KEY (order_id, product_id)
);
```

Each fact stored once. Updates are local.

## The Trade-off: Normalization vs Denormalization

Normalization optimizes **writes and consistency**.  
Denormalization optimizes **read performance**.

| Normalized | Denormalized |
|------------|--------------|
| No redundant data | Duplicate data for faster reads |
| JOINs required for reports | Single table scan |
| Consistent updates | Risk of stale copies |
| Best for OLTP (transactions) | Best for OLAP (analytics) |

### When to Denormalize

Deliberately duplicate data when:

- Read performance is critical and JOINs are too slow
- Data is read often but rarely changes (product name on order snapshot)
- Building read models for analytics (data warehouse)
- Caching layer isn't enough

```sql
-- Denormalized on purpose: historical order snapshot
CREATE TABLE order_items (
    order_id      BIGINT,
    product_id    BIGINT,
    product_name  VARCHAR(100),   -- copied at order time
    unit_price    DECIMAL(10,2),  -- price at time of purchase
    quantity      INT
);
```

Product name on the order is intentional — if product is renamed later, the order still shows what the customer bought.

## OLTP vs OLAP

| OLTP (Online Transaction Processing) | OLAP (Online Analytical Processing) |
|--------------------------------------|-------------------------------------|
| Many small writes/reads | Few large read queries |
| Normalized schema | Denormalized (star schema) |
| App database | Data warehouse |
| "Process this order" | "Sales by region last quarter" |

```
App DB (3NF)  ──ETL──▶  Warehouse (denormalized)  ──▶  BI dashboards
```

## Practical Guidelines

```
1. Start normalized (3NF) for application tables
2. Denormalize only with evidence (slow query logs, profiling)
3. Snapshot historical data (prices, names) on transactional records
4. Use read replicas or materialized views before denormalizing live tables
5. Document every denormalization — explain why and how it's kept consistent
```

## Summary

Normalization splits data into related tables to eliminate redundancy and update anomalies. Aim for **3NF** in OLTP systems. Denormalize deliberately when reads suffer — especially for historical snapshots and analytics — never by accident.

---

[Next: Indexes →](./04-indexes.md)
