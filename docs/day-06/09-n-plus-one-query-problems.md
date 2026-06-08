# N+1 Query Problems

[← ORM](./08-orm.md) | [Day 6 Index](./README.md) | [Next: Connection Pooling →](./10-connection-pooling.md)

## What Is the N+1 Problem?

The **N+1 query problem** runs **1 query** to fetch a list, then **N additional queries** — one per item — to fetch related data.

```
1 query:  get 100 users
100 queries: get orders for each user
─────────
101 queries total  (1 + N)
```

Should be **1 or 2 queries** with a JOIN or batch load.

## Classic Example

### The Code

```python
# 1 query: fetch all users
users = User.objects.all()   # SELECT * FROM users

for user in users:
    # N queries: one per user
    print(user.orders.count())  # SELECT COUNT(*) FROM orders WHERE user_id = ?
```

100 users → **101 database round trips**.

### What the Database Sees

```sql
SELECT * FROM users;

SELECT COUNT(*) FROM orders WHERE user_id = 1;
SELECT COUNT(*) FROM orders WHERE user_id = 2;
SELECT COUNT(*) FROM orders WHERE user_id = 3;
-- ... 97 more times
```

Each round trip adds latency (even if each query is fast).

```
101 queries × 2ms each = 202ms
vs
1 JOIN query = 5ms
```

## Why It Happens

| Cause | Detail |
|-------|--------|
| **Lazy loading** | ORM loads relations on first access |
| **Loop + relation** | `for item in items: item.related` |
| **Template rendering** | Jinja/React server renders `user.orders` per row |
| **GraphQL resolvers** | One resolver per parent object without DataLoader |
| **Microservices** | One HTTP call per entity instead of batch |

ORMs default to lazy loading — the N+1 problem is the most common ORM performance bug.

## How to Detect

### 1. Enable SQL Logging

```python
# Django
LOGGING = { 'django.db.backends': { 'level': 'DEBUG' } }

# SQLAlchemy
engine = create_engine(url, echo=True)
```

Watch for repeated identical queries with different IDs.

### 2. APM Tools

Datadog, New Relic, Django Debug Toolbar — show query count per request.

```
GET /users  →  847 queries  ← red flag
GET /users  →  3 queries    ← healthy
```

### 3. Pattern Recognition

Same query shape, only parameter changes:

```sql
SELECT * FROM orders WHERE user_id = $1   -- repeated N times
```

## Fixes

### Fix 1: JOIN / Eager Load (joinedload)

```python
# SQLAlchemy
users = session.query(User).options(joinedload(User.orders)).all()

# Django
users = User.objects.prefetch_related('orders').all()
```

One query with JOIN (or two with `prefetch_related`):

```sql
SELECT users.*, orders.*
FROM users
LEFT JOIN orders ON orders.user_id = users.id;
```

### Fix 2: Subquery / IN Batch

```python
users = session.query(User).all()
user_ids = [u.id for u in users]

orders = session.query(Order).filter(Order.user_id.in_(user_ids)).all()
# group orders by user_id in Python
```

```sql
SELECT * FROM users;
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 100);
```

**2 queries** instead of 101.

### Fix 3: Aggregation in SQL

Don't fetch relations in a loop — aggregate in one query.

```python
# Bad
for user in users:
    count = user.orders.count()

# Good
results = session.query(
    User.id, func.count(Order.id)
).outerjoin(Order).group_by(User.id).all()
```

```sql
SELECT u.id, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;
```

**1 query.**

### Fix 4: DataLoader (GraphQL)

Batch and cache loads within one request.

```javascript
const userLoader = new DataLoader(async (userIds) => {
  const orders = await db.orders.whereIn('user_id', userIds);
  return userIds.map(id => orders.filter(o => o.user_id === id));
});

// Multiple resolvers call loader — batched into one query
```

### Fix 5: Denormalize / Cache Counts

For display-only counts updated infrequently:

```sql
ALTER TABLE users ADD COLUMN order_count INT DEFAULT 0;

-- update on order insert/delete via trigger or app logic
```

Trade consistency for read speed — acceptable for dashboards.

## N+1 in Templates

```html
<!-- Django template — N+1 if not prefetched -->
{% for user in users %}
  <p>{{ user.name }}: {{ user.orders.count }} orders</p>
{% endfor %}
```

Fix in the **view**, not the template:

```python
def user_list(request):
    users = User.objects.prefetch_related('orders')
    return render(request, 'users.html', {'users': users})
```

## N+1 Across Services

```
API Gateway needs user name for 50 orders

Bad:
  for order in orders:
    user = http.get(f'/users/{order.user_id}')   # 50 HTTP calls

Good:
  user_ids = [o.user_id for o in orders]
  users = http.post('/users/batch', json=user_ids)  # 1 call
```

Same pattern — batch at the boundary.

## Decision Guide

| Situation | Fix |
|-----------|-----|
| Always need relation in loop | `joinedload` / `prefetch_related` |
| Large collection, avoid huge JOIN | `selectinload` / `prefetch_related` |
| Only need counts | `GROUP BY` aggregation |
| GraphQL API | DataLoader |
| Microservices | Batch API endpoint |
| Read-heavy count display | Denormalized counter |

## Prevention Checklist

- [ ] SQL logging enabled in dev/staging
- [ ] Query count per request monitored
- [ ] No ORM relation access inside loops without eager load
- [ ] GraphQL uses DataLoader
- [ ] Code review watches for `.orders`, `.items` in loops
- [ ] Load tests catch query explosion under realistic data

## Summary

N+1 means 1 query for a list plus N queries for each item's relations. It's caused by lazy loading in loops. Fix with eager loading, batch `IN` queries, SQL aggregation, or DataLoaders. Always check query count per request — if it's proportional to result size, you likely have N+1.

---

[Next: Connection Pooling →](./10-connection-pooling.md)
