# Query Execution

[← Joins / Lookups](./05-joins-and-lookups.md) | [Day 6 Index](./README.md) | [Next: Transactions →](./07-transactions.md)

## What Happens When You Run a Query?

```sql
SELECT u.name, o.total
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'ACTIVE'
ORDER BY o.created_at DESC
LIMIT 20;
```

You write SQL. The database doesn't run it literally — it **parses**, **plans**, **optimizes**, and **executes**.

```
SQL text → Parser → Query Tree → Optimizer → Execution Plan → Results
```

## Step 1 — Parsing

The parser checks syntax and builds a **parse tree**.

```
Invalid:  SELCT * FORM users     → syntax error
Valid:    SELECT * FROM users   → parse tree
```

```
SelectStmt
  ├── targetList: [name, total]
  ├── fromClause: [orders JOIN users]
  ├── whereClause: status = 'ACTIVE'
  ├── orderBy: created_at DESC
  └── limit: 20
```

## Step 2 — Query Rewriting

The engine applies rules and views.

```
-- View definition expanded into query
CREATE VIEW active_orders AS
  SELECT * FROM orders WHERE status = 'ACTIVE';

SELECT * FROM active_orders;
→ rewritten to: SELECT * FROM orders WHERE status = 'ACTIVE'
```

## Step 3 — Optimization (The Planner)

The **query optimizer** picks the cheapest way to execute the query. It considers:

- Available [indexes](./04-indexes.md)
- Table statistics (row counts, value distribution)
- Join order and join algorithms
- Cost of sequential scan vs index scan

```
Planner asks:
  "Scan orders or use idx_orders_status?"
  "Join users first or orders first?"
  "Hash join or nested loop?"
```

### Statistics

The planner uses **table statistics** (maintained by `ANALYZE` / auto-analyze).

```
orders table stats:
  rows: 5,000,000
  status='ACTIVE': 12% of rows
  user_id distinct: 200,000

→ Planner knows: index on status may be selective enough
```

Stale statistics → bad plans. Run `ANALYZE` after large data changes.

### Cost Model

Each operation has an estimated **cost** (abstract units, not milliseconds).

```
Seq Scan on orders:     cost = 100,000
Index Scan on status:   cost = 500      ← planner picks this
```

## Step 4 — Execution Plan

The chosen plan is a tree of **operators**.

```
Limit
  └── Sort (created_at DESC)
        └── Hash Join
              ├── Seq Scan on orders (filter: status='ACTIVE')
              └── Hash
                    └── Seq Scan on users
```

Each node is an operator: Scan, Join, Sort, Filter, Aggregate.

### Reading EXPLAIN Output

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.name, o.total
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'ACTIVE'
LIMIT 20;
```

```
Limit  (cost=... rows=20)
  -> Nested Loop
        -> Index Scan on orders using idx_status
              Filter: status = 'ACTIVE'
        -> Index Scan on users using users_pkey
              Index Cond: id = o.user_id
```

| Field | Meaning |
|-------|---------|
| `cost=0.00..100.00` | Estimated startup..total cost |
| `rows=20` | Estimated rows returned |
| `actual time=0.05..2.3` | Real milliseconds (with ANALYZE) |
| `Buffers: shared hit=45` | Pages read from cache |
| `Buffers: shared read=3` | Pages read from disk |

**`shared hit`** = RAM. **`shared read`** = disk. High `read` = cache miss, slow.

## Common Plan Operators

| Operator | What It Does |
|----------|--------------|
| **Seq Scan** | Read every row in table |
| **Index Scan** | Use index to find rows, fetch from table |
| **Index Only Scan** | Answer from index alone (covering index) |
| **Bitmap Heap Scan** | Index finds row locations, then fetch pages |
| **Nested Loop** | For each outer row, find inner matches |
| **Hash Join** | Build hash table, probe |
| **Merge Join** | Merge two sorted inputs |
| **Sort** | Sort rows (expensive for large sets) |
| **Aggregate** | GROUP BY, COUNT, SUM |
| **Filter** | Apply WHERE condition |

## What Makes Queries Slow

| Cause | Symptom in EXPLAIN | Fix |
|-------|-------------------|-----|
| Missing index | Seq Scan on large table | Add index |
| Stale statistics | Wrong row estimates | ANALYZE |
| Sort on huge result | Sort with high cost | Index on ORDER BY columns |
| Function on indexed column | Seq Scan | Expression index |
| SELECT * | More buffers read | Select specific columns |
| N+1 queries | Many small queries | Batch / JOIN (see 09) |

## Prepared Statements

Parse and plan once, execute many times with different parameters.

```sql
PREPARE get_order (bigint) AS
  SELECT * FROM orders WHERE id = $1;

EXECUTE get_order(12345);
EXECUTE get_order(67890);
```

Benefits: skip re-parsing, plan cache reuse, protection against SQL injection.

ORMs use prepared statements by default (with parameter binding).

## Query Caching Layers

```
1. Plan cache     — reuse execution plan
2. Buffer pool    — data pages in RAM (storage basics)
3. Application cache (Redis) — skip DB entirely
```

## Optimizer Hints (Use Sparingly)

Most databases let you influence the planner — but prefer fixing statistics and indexes first.

```sql
-- PostgreSQL: disable seq scan (force index attempt)
SET enable_seqscan = off;  -- session only, debug use

-- MySQL
SELECT /*+ INDEX(orders idx_status) */ * FROM orders WHERE status = 'ACTIVE';
```

Hints are fragile — they break when data grows or schema changes.

## Debugging Slow Queries

```
1. EXPLAIN ANALYZE the query
2. Check for Seq Scan on large tables
3. Check buffers: shared read (disk hits)
4. Verify indexes exist on WHERE/JOIN columns
5. Run ANALYZE on table
6. Check pg_stat_statements / slow query log
7. Simplify query or denormalize if needed
```

## Summary

Query execution flows through parse → optimize → execute. The **optimizer** picks the cheapest plan using statistics and indexes. Use `EXPLAIN ANALYZE` to see the real plan and spot Seq Scans, disk reads, and expensive sorts. Good indexes and fresh statistics are the best levers.

---

[Next: Transactions →](./07-transactions.md)
