# System Design Documentation

A day-by-day guide to understanding and practicing system design — from fundamentals to real-world architectures.

## How to Use This Repo

Each day is published under `docs/day-XX/`. Every day folder contains focused topics you can read in order or jump to individually.

## Index

| Day | Topics | Folder |
|-----|--------|--------|
| 1 | Why System Design, What It Is, Types, When to Use, Starter Example | [docs/day-01](./docs/day-01/) |
| 2 | HLD, LLD, Capacity, Scalability, Reliability, Security, Data, API, Performance, Observability, Refactor | [docs/day-02](./docs/day-02/) |
| 3 | Design Task: Parking Lot | [docs/day-03](./docs/day-03/) |
| 4 | What Happens When You Visit a Website | [docs/day-04](./docs/day-04/) |
| 5 | Core Infrastructure Components (DNS, LB, CDN, Caching, DB Scaling, Queue, Workers) | [docs/day-05](./docs/day-05/) |
| 6 | Database Internals (Storage, Keys, Indexes, Transactions, ORM, Replication, Sharding) | [docs/day-06](./docs/day-06/) |
| 7 | Caching Deep Dive (Patterns, Invalidation, TTL, Redis, Cache Problems) | [docs/day-07](./docs/day-07/) |
| 8 | Message Queues Deep Dive (Models, Guarantees, Patterns, Kafka, SQS) | [docs/day-08](./docs/day-08/) |

## Structure

```
system-design/
├── README.md
└── docs/
    ├── day-01/
    │   ├── README.md
    │   ├── 01-why-system-design.md
    │   ├── 02-what-is-system-design.md
    │   ├── 03-types-of-system-design.md
    │   ├── 04-when-to-use-system-design.md
    │   └── 05-starter-example.md
    └── day-02/
        ├── README.md
        ├── 01-types-of-system-design.md
        ├── 02-hld.md
        ├── 03-lld.md
        ├── 04-capacity-design.md
        ├── 05-scalability-design.md
        ├── 06-reliability-design.md
        ├── 07-security-design.md
        ├── 08-data-design.md
        ├── 09-api-design.md
        ├── 10-performance-design.md
        ├── 11-observability-design.md
        └── 12-refactor-design.md
    ├── day-03/
    │   ├── README.md
    │   └── 01-parking-lot-design.md
    ├── day-04/
    │   ├── README.md
    │   └── 01-visit-website-scenario.md
    └── day-05/
        ├── README.md
        ├── 01-dns.md
        ├── 02-load-balancer.md
        ├── 03-reverse-proxy.md
        ├── 04-cdn.md
        ├── 05-caching.md
        ├── 06-db-scaling.md
        ├── 07-queue.md
        └── 08-microservices-and-workers.md
    └── day-06/
        ├── README.md
        ├── 01-storage-basics.md
        ├── 02-keys.md
        ├── 03-normalization.md
        ├── 04-indexes.md
        ├── 05-joins-and-lookups.md
        ├── 06-query-execution.md
        ├── 07-transactions.md
        ├── 08-orm.md
        ├── 09-n-plus-one-query-problems.md
        ├── 10-connection-pooling.md
        ├── 11-replication.md
        └── 12-sharding.md
    └── day-07/
        ├── README.md
        ├── 01-why-caching.md
        ├── 02-what-is-a-cache.md
        ├── 03-where-to-place-cache.md
        ├── 04-what-to-cache.md
        ├── 05-cache-aside-pattern.md
        ├── 06-write-through-cache.md
        ├── 07-write-back-cache.md
        ├── 08-cache-invalidation.md
        ├── 09-ttl.md
        ├── 10-distributed-cache.md
        ├── 11-cache-problems.md
        └── 12-other-patterns-and-best-practices.md
    └── day-08/
        ├── README.md
        ├── 01-why-queues.md
        ├── 02-what-is-a-message-queue.md
        ├── 03-sync-vs-async-communication.md
        ├── 04-queue-pubsub-and-streams.md
        ├── 05-core-components.md
        ├── 06-message-design.md
        ├── 07-delivery-guarantees.md
        ├── 08-ordering-and-partitioning.md
        ├── 09-consumers-and-scaling.md
        ├── 10-retry-dlq-and-idempotency.md
        ├── 11-queue-patterns.md
        └── 12-tools-operations-and-tradeoffs.md
```
