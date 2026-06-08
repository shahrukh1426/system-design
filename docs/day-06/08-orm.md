# ORM

[← Transactions](./07-transactions.md) | [Day 6 Index](./README.md) | [Next: N+1 Query Problems →](./09-n-plus-one-query-problems.md)

## What Is an ORM?

An **ORM (Object-Relational Mapper)** maps database tables to objects in your programming language. You work with classes instead of SQL.

```python
# SQL
SELECT * FROM users WHERE id = 5;

# ORM (SQLAlchemy / Django / Hibernate)
user = session.query(User).filter(User.id == 5).first()
# or
user = User.objects.get(id=5)
```

```
Database Table          Python/Java Class
┌────────────────┐      ┌────────────────┐
│ users          │  ↔   │ class User:    │
│  id            │      │   id           │
│  email         │      │   email        │
│  name          │      │   name         │
└────────────────┘      └────────────────┘
```

## Why ORMs Exist

| Benefit | Detail |
|---------|--------|
| **Productivity** | Less boilerplate SQL |
| **Database agnostic** | Switch PostgreSQL ↔ MySQL (in theory) |
| **Type safety** | IDE autocomplete on models |
| **Migrations** | Schema changes as versioned code |
| **Security** | Parameterized queries by default |
| **Relationships** | `user.orders` instead of manual JOINs |

## Popular ORMs

| Language | ORM |
|----------|-----|
| Python | SQLAlchemy, Django ORM |
| Java | Hibernate, JPA |
| Node.js | Prisma, TypeORM, Sequelize |
| Ruby | ActiveRecord (Rails) |
| C# | Entity Framework |
| Go | GORM |

## How ORMs Work

```
Your Code → ORM → SQL Generator → Database
                ↑
         Connection Pool
```

### Define a Model

```python
class User(Base):
    __tablename__ = 'users'

    id    = Column(BigInteger, primary_key=True)
    email = Column(String(255), unique=True)
    name  = Column(String(100))
    orders = relationship('Order', back_populates='user')

class Order(Base):
    __tablename__ = 'orders'

    id      = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.id'))
    total   = Column(Numeric(10, 2))
    user    = relationship('User', back_populates='orders')
```

### CRUD Operations

```python
# Create
user = User(email='alice@example.com', name='Alice')
session.add(user)
session.commit()

# Read
user = session.query(User).filter(User.email == 'alice@example.com').first()

# Update
user.name = 'Alice Smith'
session.commit()

# Delete
session.delete(user)
session.commit()
```

ORM generates:

```sql
INSERT INTO users (email, name) VALUES ('alice@example.com', 'Alice');
SELECT * FROM users WHERE email = 'alice@example.com' LIMIT 1;
UPDATE users SET name = 'Alice Smith' WHERE id = 5;
DELETE FROM users WHERE id = 5;
```

## Migrations

ORMs track schema changes as migration files.

```python
# Alembic migration (SQLAlchemy)
def upgrade():
    op.create_table('users',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('email', sa.String(255), unique=True),
    )

def downgrade():
    op.drop_table('users')
```

```
alembic upgrade head   → apply migrations
alembic downgrade -1     → rollback one step
```

## The Good and the Bad

### Advantages

```
✓ Faster development for CRUD apps
✓ Consistent patterns across team
✓ Built-in connection pooling (often)
✓ Relationship navigation: user.orders
✓ Migration tooling
```

### Disadvantages

```
✗ Hides SQL — you may not see expensive queries
✗ Complex queries harder than raw SQL
✗ N+1 query problem (see next topic)
✗ Abstraction leaks at scale
✗ "Magic" behavior hard to debug
```

## ORM vs Raw SQL

| Use ORM | Use Raw SQL |
|---------|-------------|
| Simple CRUD | Complex analytics queries |
| Standard relationships | Fine-tuned performance critical path |
| Team prefers objects | Bulk operations (COPY, LOAD) |
| Rapid prototyping | Database-specific features (CTEs, window functions) |

**Pragmatic approach:** ORM for 90% of app code, raw SQL for hot paths and reports.

```python
# Hybrid: ORM for models, raw SQL for report
result = session.execute(text("""
    SELECT DATE(created_at), COUNT(*), SUM(total)
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY 1 DESC
    LIMIT 30
"""))
```

## Lazy vs Eager Loading

ORMs load related data **lazily** by default — a common source of [N+1 problems](./09-n-plus-one-query-problems.md).

```python
# Lazy (default): orders loaded when accessed
user = session.query(User).get(1)
for order in user.orders:    # triggers query per user
    print(order.total)

# Eager: load user + orders in one query
user = session.query(User).options(joinedload(User.orders)).get(1)
```

| Strategy | When |
|----------|------|
| **Lazy** | Relationship rarely accessed |
| **Eager (joinedload)** | Always need related data |
| **Select in load** | Collections, avoid huge JOIN |

## ORM Best Practices

```
1. Log SQL in development (echo=True, DEBUG SQL logging)
2. Use migrations — never hand-edit production schema
3. Index columns you filter and join on (ORM doesn't auto-index FKs in all frameworks)
4. Eager load when you know you need relations
5. Use pagination — .limit(20), not .all() on million rows
6. Avoid ORM in tight loops without batching
7. Profile with EXPLAIN — ORM SQL is still SQL
```

## Query Builder Alternative

Some teams use **query builders** instead of full ORMs — SQL-like but programmatic.

```python
# Knex.js (Node)
db('users').where('active', true).join('orders', ...)

# Still generates SQL, less "magic" than full ORM
```

Middle ground between raw SQL and heavy ORM abstraction.

## Summary

ORMs map tables to objects and speed up development. They handle CRUD, relationships, and migrations — but hide SQL that can become slow. Use ORMs for standard app logic, eager-load relationships deliberately, log generated SQL, and drop to raw SQL for complex or performance-critical queries.

---

[Next: N+1 Query Problems →](./09-n-plus-one-query-problems.md)
