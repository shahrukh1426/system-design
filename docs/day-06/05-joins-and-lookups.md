# Joins / Lookups

[← Indexes](./04-indexes.md) | [Day 6 Index](./README.md) | [Next: Query Execution →](./06-query-execution.md)

## Why Joins Exist

[Normalization](./03-normalization.md) splits data across tables. **Joins** put it back together for queries.

```sql
-- Get orders with user names
SELECT o.id, u.name, o.total
FROM orders o
JOIN users u ON o.user_id = u.id;
```

Without joins, you'd store everything in one table (denormalized). Joins are the cost of normalized design.

## Types of JOINs

### INNER JOIN

Returns rows where **both sides match**.

```sql
SELECT o.id, u.name
FROM orders o
INNER JOIN users u ON o.user_id = u.id;
```

```
orders: {1, user=Alice}, {2, user=Bob}, {3, user=NULL}
users:  {Alice}, {Bob}

Result: orders 1 and 2 only (order 3 has no matching user)
```

### LEFT (OUTER) JOIN

All rows from **left** table, plus matches from right. NULL if no match.

```sql
SELECT o.id, u.name
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;
```

```
Result: all 3 orders — order 3 has u.name = NULL
```

Use when you want "all orders, including those without valid user."

### RIGHT JOIN

Mirror of LEFT — all rows from right table. Rarely used (just flip table order and use LEFT).

### FULL OUTER JOIN

All rows from both sides. NULL where no match. Supported in PostgreSQL, not MySQL.

### CROSS JOIN

Cartesian product — every row paired with every row.

```sql
SELECT * FROM colors CROSS JOIN sizes;
-- 3 colors × 4 sizes = 12 rows
```

Use for generating combinations. Usually accidental — avoid without intent.

## JOIN Visual Summary

```
INNER:     only overlapping
LEFT:      all left + matching right
RIGHT:     all right + matching left
FULL:      everything from both

Table A    Table B
  ○          ○
  ●●●∩●●●    INNER
  ●●●●       LEFT (all A)
    ●●●●     RIGHT (all B)
  ●●●●●●●    FULL
```

## How Joins Execute

The database chooses a join strategy based on table sizes and indexes.

### Nested Loop Join

For each row in outer table, scan inner table for matches.

```
For each order:
  find user where user.id = order.user_id
```

Fast when inner table has an **index** on the join column. Slow otherwise.

### Hash Join

Build a hash table from smaller table, probe with larger table.

```
1. Hash all users by id
2. For each order, lookup user_id in hash → O(1)
```

Good for large tables without useful indexes.

### Merge Join

Both tables sorted on join key — merge like merge sort.

```
users sorted by id:  [1, 2, 5, 9]
orders sorted by user_id: [1, 1, 2, 5]
Walk both pointers in parallel
```

Good when both sides are already sorted (indexed).

## Lookups — Single Table Queries

Not every query joins. Simple lookups are the most common pattern.

```sql
-- Point lookup (best case — PK index)
SELECT * FROM users WHERE id = 5;

-- Range lookup
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';

-- Filter lookup
SELECT * FROM products WHERE category = 'electronics' AND active = true;
```

| Pattern | Index Needed |
|---------|--------------|
| `WHERE id = ?` | Primary key (automatic) |
| `WHERE email = ?` | Index on email |
| `WHERE user_id = ? AND status = ?` | Composite `(user_id, status)` |
| `WHERE created_at > ?` | Index on created_at |

## JOIN Performance Tips

### 1. Index Join Columns

```sql
-- orders.user_id and users.id must be indexed
JOIN users u ON o.user_id = u.id
```

### 2. Filter Early

```sql
-- Bad: join everything, then filter
SELECT o.id, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at > '2024-01-01';

-- Better: same query — optimizer usually pushes filter down
-- But explicit subquery can help complex cases:
SELECT o.id, u.name
FROM (SELECT * FROM orders WHERE created_at > '2024-01-01') o
JOIN users u ON o.user_id = u.id;
```

### 3. Select Only Needed Columns

```sql
-- Bad
SELECT * FROM orders o JOIN users u ON ...

-- Good
SELECT o.id, o.total, u.name FROM orders o JOIN users u ON ...
```

### 4. Avoid Joining Huge Tables When Possible

```
Millions of orders × millions of events → slow

Fix: pre-aggregate, materialized view, or denormalize for this query
```

## Alternatives to JOINs

### Multiple Queries (Application-Side Join)

```python
users = db.query("SELECT * FROM users WHERE id IN (?)", user_ids)
orders = db.query("SELECT * FROM orders WHERE user_id IN (?)", user_ids)
# merge in application code
```

Use when: cross-database, microservices (no shared DB), or caching layers.

### Denormalization

Store `user_name` on `orders` — no join needed for display.

### Materialized View

```sql
CREATE MATERIALIZED VIEW order_summary AS
SELECT o.id, u.name, o.total, o.created_at
FROM orders o JOIN users u ON o.user_id = u.id;

REFRESH MATERIALIZED VIEW order_summary;
```

Precomputed join — refresh periodically.

## EXISTS vs IN vs JOIN

```sql
-- Users who have placed an order
SELECT u.* FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

SELECT u.* FROM users u
WHERE u.id IN (SELECT user_id FROM orders);

SELECT DISTINCT u.* FROM users u
JOIN orders o ON o.user_id = u.id;
```

Often equivalent — optimizer picks best plan. `EXISTS` can short-circuit on first match.

## Subqueries

```sql
-- Correlated subquery (runs per outer row — can be slow)
SELECT u.name,
  (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

-- Often better as JOIN + GROUP BY
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;
```

## Summary

Joins combine normalized tables. Use **INNER** for matches only, **LEFT** to keep all rows from one side. Index join columns, filter early, and fetch only needed columns. For heavy repeated joins, consider materialized views or careful denormalization.

---

[Next: Query Execution →](./06-query-execution.md)
