# Transactions

[← Query Execution](./06-query-execution.md) | [Day 6 Index](./README.md) | [Next: ORM →](./08-orm.md)

## What Is a Transaction?

A **transaction** is a group of database operations that execute as **one atomic unit** — either all succeed or all fail.

```sql
BEGIN;

  UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- debit
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- credit

COMMIT;   -- both apply
-- or
ROLLBACK; -- neither applies
```

Transfer $100: you never want debit without credit.

## ACID Properties

| Property | Meaning | Example |
|----------|---------|---------|
| **Atomicity** | All or nothing | Transfer: both updates or neither |
| **Consistency** | DB moves from valid state to valid state | Balance never negative (with constraint) |
| **Isolation** | Concurrent transactions don't interfere | Two transfers don't corrupt same row |
| **Durability** | Committed data survives crash | WAL ensures commit survives restart |

## Transaction Lifecycle

```
BEGIN → Active → COMMIT (success)
              → ROLLBACK (abort)

Autocommit mode (default in most clients):
  Each single statement = implicit transaction
```

```sql
-- Explicit transaction
BEGIN;
  INSERT INTO orders (user_id, total) VALUES (1, 99.99);
  INSERT INTO order_items (order_id, product_id) VALUES (last_id, 5);
COMMIT;
```

If `order_items` insert fails → `ROLLBACK` removes the order too.

## Isolation Levels

When two transactions run at the same time, how much do they see of each other?

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|------------|---------------------|--------------|
| **Read Uncommitted** | Possible | Possible | Possible |
| **Read Committed** | No | Possible | Possible |
| **Repeatable Read** | No | No | Possible* |
| **Serializable** | No | No | No |

*PostgreSQL Repeatable Read also prevents phantoms.

### Phenomena Explained

**Dirty read:** See another transaction's uncommitted data.

```
T1: UPDATE balance = 500 (not committed)
T2: READ balance → 500  (dirty — T1 may rollback)
```

**Non-repeatable read:** Same query twice, different results.

```
T1: SELECT balance → 1000
T2: UPDATE balance = 900, COMMIT
T1: SELECT balance → 900  (changed!)
```

**Phantom read:** Same range query, new rows appear.

```
T1: SELECT COUNT(*) WHERE status='ACTIVE' → 10
T2: INSERT new ACTIVE row, COMMIT
T1: SELECT COUNT(*) WHERE status='ACTIVE' → 11  (phantom)
```

### Default Levels

| Database | Default |
|----------|---------|
| PostgreSQL | Read Committed |
| MySQL InnoDB | Repeatable Read |
| SQL Server | Read Committed |

```sql
-- PostgreSQL
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

**Higher isolation** = more correctness, more locking, slower concurrency.

## Locks

Transactions acquire **locks** to enforce isolation.

| Lock Type | Granularity |
|-----------|-------------|
| **Row lock** | Single row |
| **Page lock** | Page of rows |
| **Table lock** | Entire table |

```
Transaction A: UPDATE accounts SET balance = ... WHERE id = 1
  → acquires row lock on id=1

Transaction B: UPDATE accounts SET balance = ... WHERE id = 1
  → waits for A to COMMIT or ROLLBACK
```

### Deadlock

```
T1: lock row A → wait for row B
T2: lock row B → wait for row A
→ deadlock → DB kills one transaction
```

```
ERROR: deadlock detected
```

**Prevention:** Lock rows in consistent order. Keep transactions short.

## MVCC (Multi-Version Concurrency Control)

PostgreSQL and InnoDB use **MVCC** — readers don't block writers, writers don't block readers.

```
Each row has multiple versions:
  Row id=1, version 1 (balance=1000)  ← visible to old transactions
  Row id=1, version 2 (balance=900)   ← visible after commit

SELECT sees snapshot at transaction start
UPDATE creates new version
Old versions cleaned by VACUUM (PostgreSQL)
```

Benefits:
- Readers never wait for writers (usually)
- Consistent snapshot per transaction

Cost:
- Extra storage for old versions
- VACUUM / purge needed

## When to Use Transactions

| Use Transaction | Skip Transaction |
|---------------|------------------|
| Multi-step financial operations | Single idempotent read |
| Order + order items insert | Cached config read |
| Transfer between accounts | Analytics append (sometimes) |
| Any "all or nothing" write group | Independent logging |

## Transaction Patterns in Applications

### Unit of Work

One business operation = one transaction.

```python
with db.transaction():
    order = create_order(user_id, items)
    deduct_inventory(items)
    charge_payment(user_id, order.total)
# commit on success, rollback on any exception
```

### Keep Transactions Short

```
Bad:  BEGIN → slow API call → UPDATE → COMMIT  (holds locks during API)
Good: API call first → BEGIN → UPDATE → COMMIT  (locks held milliseconds)
```

Long transactions block other writers and increase deadlock risk.

## Distributed Transactions

Single database: ACID is straightforward.

Multiple databases or services: **much harder**.

| Approach | Tool |
|----------|------|
| Two-phase commit (2PC) | Rare, blocking |
| Saga pattern | Compensating transactions per service |
| Outbox pattern | Write event to local DB, async publish |

In microservices, avoid distributed transactions — use [sagas](../day-05/08-microservices-and-workers.md).

## Common Mistakes

| Mistake | Consequence |
|---------|-------------|
| No transaction for related inserts | Partial data, orphans |
| Long-running transaction | Locks, deadlocks, timeouts |
| Wrong isolation level | Phantom reads in reports |
| Nested transactions without savepoints | Unexpected commit behavior |
| Assuming autocommit is off | Each statement commits separately |

## Summary

Transactions group operations into atomic ACID units. Choose **isolation level** based on concurrency vs correctness needs. Keep transactions **short**, lock rows in consistent order, and use MVCC-aware databases (PostgreSQL, InnoDB) for read/write concurrency. For cross-service writes, use sagas — not distributed 2PC.

---

[Next: ORM →](./08-orm.md)
