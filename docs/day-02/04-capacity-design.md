# Capacity Design

[← LLD](./03-lld.md) | [Day 2 Index](./README.md) | [Next: Scalability Design →](./05-scalability-design.md)

## What Is Capacity Design?

**Capacity design** is the practice of estimating how much infrastructure your system needs — servers, storage, bandwidth, database connections — to handle expected load without over- or under-provisioning.

It answers: *How big does this need to be, and what will it cost?*

## Why It Matters

| Under-provisioned | Over-provisioned |
|-------------------|------------------|
| Outages at peak traffic | Wasted money |
| Slow responses, timeouts | Idle resources |
| Emergency firefighting | Budget pressure without user benefit |

Good capacity design finds the **right size** with headroom for spikes.

## The Estimation Process

### Step 1 — Gather Inputs

| Input | Example |
|-------|---------|
| Daily active users (DAU) | 1 million |
| Peak-to-average ratio | 3x (peak = 3× average) |
| Requests per user per day | 50 |
| Data per record | 2 KB |
| Retention period | 5 years |

### Step 2 — Calculate Traffic (QPS)

```
Total requests/day = DAU × requests per user
                   = 1,000,000 × 50 = 50,000,000

Average QPS = 50,000,000 / 86,400 ≈ 580 req/s

Peak QPS = 580 × 3 ≈ 1,740 req/s
```

Always design for **peak**, not average.

### Step 3 — Calculate Storage

```
Records/year = new users/year × records per user
             = 5,000,000 × 100 = 500,000,000

Storage/year = 500,000,000 × 2 KB = 1 TB

5-year total ≈ 5 TB (+ indexes, replicas ≈ 15 TB)
```

Add overhead for:
- Indexes (often 20–50% of data size)
- Replicas (multiply by replica count)
- Backups

### Step 4 — Calculate Bandwidth

```
Peak bandwidth = peak QPS × average response size
               = 1,740 × 10 KB ≈ 17 MB/s ≈ 136 Mbps
```

Include upload traffic separately if significant (video, images).

### Step 5 — Map to Infrastructure

| Resource | Estimate Method |
|----------|-----------------|
| **App servers** | Peak QPS ÷ capacity per server (benchmark first) |
| **Database** | Storage size + IOPS requirements |
| **Cache** | Size of hot data set (often 20% of data = 80% of reads) |
| **Bandwidth** | Peak ingress + egress |
| **Message queue** | Peak publish rate × message size |

## Useful Numbers to Memorize

| Operation | Approximate Latency |
|-----------|---------------------|
| L1 cache reference | 0.5 ns |
| RAM reference | 100 ns |
| SSD random read | 150 μs |
| Network round trip (same datacenter) | 0.5 ms |
| Disk seek | 10 ms |
| Network round trip (cross-continent) | 150 ms |

| Unit | Value |
|------|-------|
| 1 million seconds | ~11.5 days |
| 1 billion requests/month | ~400 req/s average |
| 1 TB | ~1 million MB |

These help you sanity-check estimates quickly.

## Capacity Planning Example

**System:** Image upload service  
**Assumptions:** 10M users, 1 upload/user/day, 2 MB average image

```
Uploads/day     = 10,000,000
Peak upload/s   = (10M / 86400) × 3 ≈ 350 uploads/s

Storage/year    = 10M × 365 × 2 MB ≈ 7.3 PB
Bandwidth peak  = 350 × 2 MB ≈ 700 MB/s
```

**Infrastructure choices:**
- Object storage (S3) for images — not a relational DB
- CDN for serving — reduces origin bandwidth
- Async upload processing — decouple write from thumbnail generation

## Headroom and Safety Margins

Never size exactly to peak. Add margin for:

| Factor | Typical Margin |
|--------|----------------|
| Traffic spikes (viral event) | 2–3× peak |
| Growth before next review | 50–100% |
| Failure scenario (one AZ down) | Remaining AZs absorb full load |
| Deployment overhead (rolling updates) | 20% fewer active instances during deploy |

## Capacity vs Scalability

| Capacity Design | Scalability Design |
|-----------------|-------------------|
| How much do I need *now*? | How do I grow *later*? |
| Sizing servers and storage | Adding replicas, sharding, caching |
| Cost optimization | Architecture elasticity |

They work together: capacity design sizes the starting point; scalability design plans the growth path.

## Monitoring Capacity Over Time

Set thresholds and review regularly:

| Metric | Warning | Critical |
|--------|---------|----------|
| CPU utilization | > 70% sustained | > 85% |
| Memory usage | > 75% | > 90% |
| Disk usage | > 70% | > 85% |
| DB connections | > 80% of pool | > 95% |
| Network bandwidth | > 70% of capacity | > 85% |

Review capacity quarterly or when traffic grows 50%+.

## Summary

Capacity design uses back-of-envelope math to size infrastructure for peak load, storage, and bandwidth. Estimate early, add headroom for spikes and growth, and revisit as traffic changes. It pairs directly with scalability design — size correctly today, plan to grow tomorrow.

---

[Next: Scalability Design →](./05-scalability-design.md)
