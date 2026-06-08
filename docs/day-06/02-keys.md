# Keys

[← Storage Basics](./01-storage-basics.md) | [Day 6 Index](./README.md) | [Next: Normalization →](./03-normalization.md)

## What Are Keys?

**Keys** identify rows and define relationships between tables. They're the foundation of relational schema design.

```
users table:     id (key) → uniquely identifies each user
orders table:  user_id (key) → links order to a user
```

## Types of Keys

### Primary Key (PK)

Uniquely identifies each row in a table. **One per table.**

```sql
CREATE TABLE users (
    id         BIGINT PRIMARY KEY,
    email      VARCHAR(255),
    name       VARCHAR(100)
);
```

| Rule | Detail |
|------|--------|
| Must be unique | No two rows share same PK |
| Must not be NULL | Every row has a value |
| Never changes | PK is stable for the row's lifetime |
| Indexed automatically | Database creates index on PK |

### Foreign Key (FK)

Links a column to a primary key in another table. Enforces **referential integrity**.

```sql
CREATE TABLE orders (
    id         BIGINT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    total      DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

```
users:  id=1 (Alice), id=2 (Bob)
orders: user_id=1 → belongs to Alice
        user_id=99 → REJECTED (no user with id=99)
```

FK prevents orphan records — you can't delete a user who still has orders (unless you cascade).

### Unique Key

Ensures column values are unique but allows NULL (unlike PK).

```sql
CREATE TABLE users (
    id         BIGINT PRIMARY KEY,
    email      VARCHAR(255) UNIQUE,   -- no duplicate emails
    phone      VARCHAR(20) UNIQUE
);
```

A table can have **multiple** unique keys but only **one** primary key.

### Composite Key

A key made of **multiple columns** together.

```sql
CREATE TABLE order_items (
    order_id    BIGINT,
    product_id  BIGINT,
    quantity    INT,
    PRIMARY KEY (order_id, product_id)   -- composite PK
);
```

Uniqueness applies to the **combination** — same product can appear in different orders.

### Candidate Key

Any column (or set) that could serve as primary key.

```
users table:
  id     → candidate key (unique, not null)
  email  → candidate key (unique, not null)
  ssn    → candidate key (unique, not null)

Pick one as PK; others become UNIQUE constraints.
```

## Natural Key vs Surrogate Key

### Natural Key

Uses a real-world identifier that has business meaning.

```
Country table:  code = 'US', 'IN', 'GB'  (ISO country code)
User table:     email = 'alice@example.com'
Product table:  sku = 'WIDGET-001'
```

| Pros | Cons |
|------|------|
| Meaningful | Can change (user changes email) |
| No extra column | May be long (composite natural keys) |
| Enforces business rule | Privacy concerns (SSN as key) |

### Surrogate Key

Artificial identifier with no business meaning — usually auto-generated.

```
id = 1, 2, 3, 4...
UUID = '550e8400-e29b-41d4-a716-446655440000'
```

| Pros | Cons |
|------|------|
| Never changes | Extra column, no business meaning |
| Compact (integer) | Joins use meaningless ID |
| Simple FK references | |

**Best practice:** Use **surrogate key** (BIGINT or UUID) as PK in most application tables. Put natural identifiers (email, SKU) as UNIQUE constraints.

```sql
CREATE TABLE users (
    id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- surrogate
    email    VARCHAR(255) NOT NULL UNIQUE,                      -- natural
    name     VARCHAR(100)
);
```

## UUID vs Auto-Increment

| Auto-Increment (BIGINT) | UUID |
|-------------------------|------|
| 8 bytes, sequential | 16 bytes, random |
| Fast inserts (append to end of index) | Slower inserts (random index pages) |
| Exposes row count | Opaque |
| Single DB only | Safe across distributed systems |
| Simple | Good for microservices, public APIs |

```
Auto-increment:  id = 1, 2, 3, 4...     (ordered, compact)
UUID v4:         id = random 128-bit      (distributed-safe)
UUID v7:         id = time-ordered UUID   (best of both — newer standard)
```

## Foreign Key Actions

What happens when parent row is deleted or updated?

```sql
FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE    -- delete orders when user deleted
    ON DELETE SET NULL   -- set user_id to NULL
    ON DELETE RESTRICT   -- block delete if orders exist (default)
    ON UPDATE CASCADE    -- update FK if parent PK changes
```

| Action | Use When |
|--------|----------|
| **RESTRICT** | Protect child data (most common) |
| **CASCADE** | Child is owned by parent (order_items with order) |
| **SET NULL** | Optional relationship (comment author deleted) |

## Keys and Indexes

Primary keys and unique constraints **automatically create indexes**.

```
PRIMARY KEY on users(id)  → B-tree index on id
UNIQUE on users(email)    → B-tree index on email
FOREIGN KEY on orders(user_id) → index recommended (not always auto)
```

Always index foreign key columns — joins and cascades use them.

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

## Key Design Checklist

- [ ] Every table has a primary key
- [ ] PK is surrogate (BIGINT/UUID) unless strong natural key exists
- [ ] Natural identifiers have UNIQUE constraint
- [ ] Foreign keys enforce relationships
- [ ] FK columns are indexed
- [ ] ON DELETE/UPDATE behavior is explicit
- [ ] PK never exposed as guessable sequence in public APIs (use UUID)

## Summary

Keys identify rows and link tables. Use **surrogate primary keys** for stability, **unique constraints** for natural identifiers, and **foreign keys** for relationships. Index every foreign key column — joins and lookups depend on them.

---

[Next: Normalization →](./03-normalization.md)
