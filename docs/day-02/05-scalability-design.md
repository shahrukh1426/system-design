# Scalability Design

[← Capacity Design](./04-capacity-design.md) | [Day 2 Index](./README.md) | [Next: Reliability Design →](./06-reliability-design.md)

## What Is Scalability?

**Scalability** is the ability of a system to handle increased load by adding resources — without redesigning the architecture.

It answers: *When users grow 10x, what breaks first and how do we fix it?*

## Scalability vs Performance

| Scalability | Performance |
|-------------|-------------|
| Handles *more* load | Handles load *faster* |
| "Can we serve 10x users?" | "Can we respond in 50ms?" |
| Add machines, shard data | Optimize code, add cache |

A system can be fast for one user but fail at scale. Both matter.

## Vertical vs Horizontal Scaling

### Vertical Scaling (Scale Up)

Add more power to one machine — more CPU, RAM, faster disk.

```
Before:  4 CPU, 16 GB RAM
After:  32 CPU, 256 GB RAM
```

| Pros | Cons |
|------|------|
| Simple — no code changes | Hardware ceiling (largest instance) |
| No distributed complexity | Single point of failure |
| Good first step | Expensive at high end |

### Horizontal Scaling (Scale Out)

Add more machines and distribute load across them.

```
Before:  1 server
After:  10 servers behind a load balancer
```

| Pros | Cons |
|------|------|
| Theoretically unlimited | Requires stateless design |
| Fault tolerant (one dies, others continue) | Data consistency challenges |
| Cost-effective at scale | Operational complexity |

**Rule of thumb:** Scale vertically until it stops being cost-effective, then scale horizontally.

## The Scalability Toolkit

### 1. Load Balancing

Distribute requests across multiple servers.

```
Clients → Load Balancer → [Server 1, Server 2, Server 3]
```

Algorithms: round-robin, least connections, consistent hashing.

### 2. Caching

Store frequently accessed data in fast memory.

```
Request → Cache (hit?) → return
                ↓ miss
              Database
```

Layers: browser cache → CDN → application cache (Redis) → database query cache.

### 3. Database Read Replicas

One primary for writes, multiple replicas for reads.

```
Writes → Primary DB → replicate → [Replica 1, Replica 2]
Reads  → load balance across replicas
```

Effective when read:write ratio is high (10:1 or more).

### 4. Database Sharding

Split data across multiple databases by a shard key.

```
user_id % 4 = 0 → Shard 0
user_id % 4 = 1 → Shard 1
user_id % 4 = 2 → Shard 2
user_id % 4 = 3 → Shard 3
```

| Pros | Cons |
|------|------|
| Distributes write load | Cross-shard queries are hard |
| Smaller indexes per shard | Rebalancing is painful |
| Fault isolation per shard | Shard key choice is critical |

### 5. Async Processing

Move slow work off the request path.

```
API → validate → enqueue job → return 202 Accepted
                      ↓
               Worker processes async
```

Good for: emails, image processing, report generation, analytics.

### 6. CDN (Content Delivery Network)

Serve static content from edge locations close to users.

```
User in Tokyo → Tokyo edge server (cache hit)
User in London → London edge server (cache hit)
```

Reduces latency and origin server load.

### 7. Microservices

Split monolith so each service scales independently.

```
Traffic spike on search → scale Search Service only
Order Service stays at normal capacity
```

## Stateless vs Stateful Services

**Stateless** — any server can handle any request. Easy to scale horizontally.

```
Request + JWT token → any app server can validate and process
```

**Stateful** — server holds session data. Harder to scale.

```
Fix: move state to Redis/DB → servers become stateless
```

Always design app servers to be stateless when possible.

## Finding the Bottleneck

At 10x load, something breaks first. Common order:

```
1. App server CPU/memory     → add more servers
2. Database connections      → connection pooling, PgBouncer
3. Database read I/O         → read replicas, caching
4. Database write I/O        → sharding, async writes
5. Network bandwidth         → CDN, compression
6. Single hot partition      → better shard key, salting
```

Profile before optimizing. Don't shard on day one if caching solves the problem.

## Scalability Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Scaling before measuring | Wasted money | Benchmark, find real bottleneck |
| Stateful app servers | Can't distribute load | Externalize state |
| Single global database | Write ceiling | Replicas, sharding, or regional DBs |
| Synchronous everything | Cascading latency | Queue async work |
| No cache strategy | DB overwhelmed | Cache hot data at multiple layers |

## The Scalability Roadmap

A practical progression:

```
Stage 1: Single server (MVP)
    ↓ traffic grows
Stage 2: App server + separate DB + cache
    ↓ read load grows
Stage 3: Read replicas + CDN
    ↓ write load grows
Stage 4: Sharding or NoSQL for hot tables
    ↓ team and domain grow
Stage 5: Microservices per domain
    ↓ global users
Stage 6: Multi-region deployment
```

Don't jump to Stage 5 when you're at Stage 2.

## Summary

Scalability design ensures your system can grow by adding resources. Start with vertical scaling and caching, move to horizontal scaling and read replicas, then sharding and service decomposition as load demands. Always find the actual bottleneck before applying the next technique.

---

[Next: Reliability Design →](./06-reliability-design.md)
