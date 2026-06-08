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
```
