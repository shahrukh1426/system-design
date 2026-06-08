# Storage Basics

[← Day 6 Index](./README.md) | [Next: Keys →](./02-keys.md)

## Where Data Actually Lives

A database feels instant, but data is stored on **disk** (SSD or HDD). Reading from disk is thousands of times slower than reading from RAM.

| Storage | Approximate Latency |
|---------|---------------------|
| L1 CPU cache | ~1 ns |
| RAM | ~100 ns |
| SSD random read | ~150 μs |
| HDD seek | ~10 ms |

The database engine's job is to **minimize disk reads** and make access feel fast.

## Pages — The Unit of I/O

Databases don't read individual rows from disk. They read **pages** (also called blocks).

```
Default page size: 8 KB (PostgreSQL, MySQL InnoDB)

One page holds many rows:
┌─────────────────────────────────┐
│ Page 42 (8 KB)                  │
│  Row 1: Alice, alice@email.com  │
│  Row 2: Bob, bob@email.com      │
│  Row 3: Carol, carol@email.com  │
│  ...                            │
└─────────────────────────────────┘
```

Even if you need **one row**, the engine often loads the **entire page** into memory.

### Why Pages Matter

| Fact | Implication |
|------|-------------|
| Disk I/O is expensive | Read as few pages as possible |
| Pages are fixed size | Small rows = more rows per page = more efficient |
| Sequential reads are faster | Scanning adjacent pages beats random jumps |

## Memory vs Disk

### Buffer Pool / Shared Buffers

The database keeps frequently used pages in **RAM** (buffer pool).

```
Query: SELECT * FROM users WHERE id = 5

1. Check buffer pool — is Page containing id=5 in RAM?
   HIT  → return from memory (fast)
   MISS → read page from disk into buffer pool (slow), then return
```

This is the database's internal cache — separate from application-level Redis.

```
┌──────────────┐
│  Your Query  │
└──────┬───────┘
       ▼
┌──────────────┐  hit?   ┌─────────────┐
│ Buffer Pool  │────────▶│ Return data │
│   (RAM)      │         └─────────────┘
└──────┬───────┘
       │ miss
       ▼
┌──────────────┐
│  Disk (SSD)  │
└──────────────┘
```

### Cache Eviction

Buffer pool has limited size. When full, least-recently-used pages are evicted back to disk-only.

Larger buffer pool → more data stays hot in RAM → fewer disk reads.

## How Rows Are Stored

### Heap / Clustered Storage

Most tables store rows in insertion order (heap). Rows aren't sorted by default.

```
Table: users (heap)
Page 1: [row 5, row 2, row 8]
Page 2: [row 1, row 9, row 3]
```

Finding `id = 5` without an index → scan every page (full table scan).

### Clustered Index (SQL Server, MySQL InnoDB)

The table **is** the index — rows stored sorted by primary key.

```
Primary key index (clustered):
Page 1: [id=1, id=2, id=3]
Page 2: [id=4, id=5, id=6]

id=5 lookup → binary search on index → direct page read
```

PostgreSQL uses heap storage + separate indexes (index points to row location).

## Write Path

Writing is more complex than reading.

```
INSERT INTO users (name) VALUES ('Alice');

1. Find a page with free space (or allocate new page)
2. Write row to page in buffer pool
3. Write to WAL (Write-Ahead Log) — durability
4. Eventually flush dirty page to disk (checkpoint)
```

### Write-Ahead Log (WAL)

Changes are logged **before** being written to data pages. If the server crashes, WAL replays uncommitted changes on restart.

```
Write flow:
  1. Log change to WAL (sequential write — fast on SSD)
  2. Update page in buffer pool
  3. Later: flush page to disk

Crash recovery:
  Replay WAL → restore consistent state
```

WAL is why sequential writes are fast even though data pages are random.

## Tablespaces and Files

```
PostgreSQL:
  /data/base/16384/16385    ← one file per table/index (simplified)

MySQL InnoDB:
  ibdata1                   ← system tablespace
  users.ibd                 ← per-table file
```

Data files grow as you insert. Monitoring disk usage is essential.

## Storage Engine Comparison

| Engine | Storage Model | Notes |
|--------|---------------|-------|
| **InnoDB** (MySQL) | Clustered PK, WAL | Default, ACID, row-level locks |
| **PostgreSQL** | Heap + indexes, WAL | MVCC, rich feature set |
| **MyISAM** (MySQL, legacy) | Heap, table locks | No transactions — avoid |
| **SQLite** | Single file | Embedded, great for local/dev |

## What Affects Storage Performance

| Factor | Impact |
|--------|--------|
| Row size | Wide rows → fewer per page → more I/O |
| Table size | Bigger tables → more pages → slower scans |
| Random vs sequential access | Sequential 10–100× faster on HDD |
| SSD vs HDD | SSD eliminates seek penalty |
| Buffer pool size | Too small → constant disk reads |

## Practical Takeaways

```
1. Avoid SELECT * — fetch only columns you need (smaller pages in memory)
2. Indexes reduce pages scanned (covered in 04-indexes.md)
3. Keep hot data small — archive old rows to cold storage
4. Monitor buffer pool hit ratio (should be > 99% in production)
5. VARCHAR vs TEXT — similar storage; design for row width
```

## Summary

Databases store data in fixed-size **pages** on disk and cache hot pages in a **buffer pool** in RAM. Reads and writes go through this layer — indexes and query design exist largely to minimize page reads. Understanding pages explains why full table scans are slow and why indexes matter.

---

[Next: Keys →](./02-keys.md)
