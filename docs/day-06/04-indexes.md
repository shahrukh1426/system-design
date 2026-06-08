# Indexes

[← Normalization](./03-normalization.md) | [Day 6 Index](./README.md) | [Next: Joins / Lookups →](./05-joins-and-lookups.md)

## What Is an Index?

An **index** is a separate data structure that lets the database find rows **without scanning the entire table**.

```
Without index:
  SELECT * FROM users WHERE email = 'alice@example.com'
  → scan every page, every row (full table scan)

With index on email:
  → look up 'alice@example.com' in index → jump to exact row
```

Like a book index — you don't read every page to find a topic.

## How Indexes Work (B-Tree)

Most relational databases use a **B-tree** (balanced tree) index.

```
                    [M]
                   /   \
              [D,H]     [R,Z]
             /  |  \    /  |  \
           [A][F][K]  [P][V][X]

Lookup 'K':
  Start at root → go right → go left → found in 3 steps
  O(log n) instead of O(n)
```

| Rows | Full Scan | Index Lookup |
|------|-----------|--------------|
| 1 million | ~1 million row checks | ~20 tree hops |
| 1 billion | ~1 billion row checks | ~30 tree hops |

## Types of Indexes

### Primary Index

Created automatically on primary key. Often clustered (row data stored in index order).

### Secondary Index

On non-PK columns you query frequently.

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### Composite (Multi-Column) Index

Index on multiple columns together. **Column order matters.**

```sql
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Uses index efficiently:
WHERE user_id = 5 AND status = 'ACTIVE'
WHERE user_id = 5

-- Does NOT use index efficiently:
WHERE status = 'ACTIVE'   -- leading column user_id missing
```

**Leftmost prefix rule:** index `(A, B, C)` supports queries on `A`, `(A,B)`, `(A,B,C)` — not `B` alone or `C` alone.

### Unique Index

Enforces uniqueness (same as UNIQUE constraint).

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

### Partial Index

Index only rows matching a condition — smaller, faster.

```sql
-- Only index active orders (most queries filter on active)
CREATE INDEX idx_active_orders ON orders(created_at)
    WHERE status = 'ACTIVE';
```

### Covering Index

Index contains **all columns** the query needs — no table lookup required.

```sql
-- Query only needs user_id and status
CREATE INDEX idx_covering ON orders(user_id, status);

SELECT user_id, status FROM orders WHERE user_id = 5;
-- "Index only scan" — never touches table heap
```

## Index Trade-offs

| Benefit | Cost |
|---------|------|
| Faster reads | Slower writes (index must update too) |
| Faster WHERE, JOIN, ORDER BY | Extra disk space |
| Enforces uniqueness | More indexes = more write overhead |

```
INSERT one row into table with 5 indexes:
  → 1 heap write + 5 index updates
```

**Rule:** Index columns you **read** often. Avoid indexing columns you **write** constantly without reading.

## What to Index

| Index This | Skip This |
|------------|-----------|
| Foreign keys | Low-cardinality columns alone (boolean, gender) |
| WHERE clause columns | Rarely filtered columns |
| JOIN columns | Small tables (full scan is fine) |
| ORDER BY columns | Columns that change on every write |

### Low Cardinality Warning

```sql
-- Bad standalone index:
CREATE INDEX idx_users_gender ON users(gender);  -- only 2–3 values

-- Better as part of composite:
CREATE INDEX idx_users_gender_city ON users(gender, city);
```

## Reading Query Plans

Use `EXPLAIN` to see if your index is used.

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 12345;
```

```
Seq Scan on orders    ← BAD: full table scan
  Filter: user_id = 12345

Index Scan using idx_orders_user_id on orders  ← GOOD
  Index Cond: user_id = 12345
```

| Plan Node | Meaning |
|-----------|---------|
| **Seq Scan** | Full table scan — slow on large tables |
| **Index Scan** | Uses index, fetches rows from table |
| **Index Only Scan** | Covering index — no table access |
| **Bitmap Index Scan** | Multiple index lookups combined |

## Common Index Mistakes

| Mistake | Fix |
|---------|-----|
| No index on FK columns | `CREATE INDEX ON orders(user_id)` |
| Wrong composite column order | Most selective column first (usually) |
| Too many indexes | Audit unused indexes, drop them |
| Index on function without expression index | `CREATE INDEX ON users(LOWER(email))` |
| Assuming OR uses index | `(a = 1 OR b = 2)` often causes seq scan |

## Index Maintenance

Indexes fragment over time with inserts/deletes.

```sql
-- PostgreSQL
REINDEX INDEX idx_orders_user_id;
VACUUM ANALYZE orders;

-- MySQL
OPTIMIZE TABLE orders;
```

Monitor index usage — drop indexes that are never scanned.

```sql
-- PostgreSQL: find unused indexes
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

## Summary

Indexes are B-tree structures that turn full table scans into fast lookups. Index foreign keys, WHERE columns, and JOIN keys. Use composite indexes with correct column order. Every index speeds reads but costs writes — index deliberately and verify with `EXPLAIN`.

---

[Next: Joins / Lookups →](./05-joins-and-lookups.md)
