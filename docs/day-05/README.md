# Day 5 — Core Infrastructure Components

Day 4 showed these pieces in a single user journey. Day 5 goes **deep on each one** — what it is, why it exists, how it works, and when to use it.

These are the building blocks behind almost every production web system.

## Topics

| # | Component | File |
|---|-----------|------|
| 1 | [DNS](./01-dns.md) | Domain names → IP addresses |
| 2 | [Load Balancer](./02-load-balancer.md) | Distribute traffic across servers |
| 3 | [Reverse Proxy](./03-reverse-proxy.md) | Front door for backend servers |
| 4 | [CDN](./04-cdn.md) | Serve content from the edge |
| 5 | [Caching](./05-caching.md) | Store hot data for fast reads |
| 6 | [DB Scaling](./06-db-scaling.md) | Grow databases under load |
| 7 | [Queue](./07-queue.md) | Async work and decoupling |
| 8 | [Microservices & Workers](./08-microservices-and-workers.md) | Split services, background jobs |

## How They Connect

```
User
  │
  ▼
DNS ──▶ Load Balancer / Reverse Proxy ──▶ Web / API Servers
              │                                    │
              ▼                                    ├──▶ Cache
            CDN (static assets)                    ├──▶ Queue ──▶ Workers
                                                   └──▶ DB (scaled)
```

## Reading Order

Read 1 → 8 in sequence. Each file stands alone, but the order follows the request path from outside in.

## Key Takeaways

- **DNS** is the internet's phone book — everything starts here.
- **Load balancers** and **reverse proxies** often overlap; know when you need each.
- **CDN** and **caching** both speed up reads — different layers, same goal.
- **DB scaling**, **queues**, and **workers** handle growth and async work behind the API.

## Related

- [Day 4: Website Visit Scenario](../day-04/01-visit-website-scenario.md)
- [Day 2: Scalability Design](../day-02/05-scalability-design.md)
- [Day 2: Performance Design](../day-02/10-performance-design.md)
