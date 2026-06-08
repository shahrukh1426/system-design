# Day 6 — Database Internals

Day 5 showed how to **scale** databases from the outside. Day 6 goes **inside** — how data is stored, queried, and managed at the engine level.

Understanding these internals helps you write faster queries, design better schemas, and debug production issues.

## Topics

| # | Topic | File |
|---|-------|------|
| 1 | [Storage Basics](./01-storage-basics.md) | Pages, rows, disk vs memory |
| 2 | [Keys](./02-keys.md) | Primary, foreign, composite, natural vs surrogate |
| 3 | [Normalization](./03-normalization.md) | 1NF–3NF, when to denormalize |
| 4 | [Indexes](./04-indexes.md) | B-tree, how indexes speed up reads |
| 5 | [Joins / Lookups](./05-joins-and-lookups.md) | JOIN types, lookup patterns |
| 6 | [Query Execution](./06-query-execution.md) | Parser, planner, optimizer |
| 7 | [Transactions](./07-transactions.md) | ACID, isolation levels, locks |
| 8 | [ORM](./08-orm.md) | Object-relational mapping, trade-offs |
| 9 | [N+1 Query Problems](./09-n-plus-one-query-problems.md) | Cause, detection, fixes |
| 10 | [Connection Pooling](./10-connection-pooling.md) | Why pools exist, sizing |
| 11 | [Replication](./11-replication.md) | How replicas sync, lag |
| 12 | [Sharding](./12-sharding.md) | Splitting data across nodes |

## Reading Order

Read 1 → 12 in sequence. Topics build from physical storage up to distributed architecture.

```
Storage → Keys → Normalization → Indexes → Joins
    → Query Execution → Transactions → ORM → N+1
        → Connection Pooling → Replication → Sharding
```

## Key Takeaways

- Data lives on **disk in pages** — indexes and caching exist to avoid reading everything.
- **Schema design** (keys, normalization) directly affects query performance.
- The **query planner** decides how your SQL runs — indexes change its decisions.
- **ORMs** speed development but can hide expensive queries (N+1).
- **Replication** scales reads; **sharding** scales writes — different problems.

## Related

- [Day 2: Data Design](../day-02/08-data-design.md)
- [Day 5: DB Scaling](../day-05/06-db-scaling.md)
- [Day 5: Caching](../day-05/05-caching.md)
