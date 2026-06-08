# Load Balancer

[← DNS](./01-dns.md) | [Day 5 Index](./README.md) | [Next: Reverse Proxy →](./03-reverse-proxy.md)

## What Is a Load Balancer?

A **load balancer** distributes incoming traffic across multiple backend servers so no single server is overwhelmed.

```
                    ┌─────────────────┐
1000 requests/s ───▶│ Load Balancer   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Server 1 │  │ Server 2 │  │ Server 3 │
        │ 333 r/s  │  │ 333 r/s  │  │ 334 r/s  │
        └──────────┘  └──────────┘  └──────────┘
```

One public IP faces the internet. Behind it, many servers share the work.

## Why It Exists

| Problem | Load Balancer Fix |
|---------|-------------------|
| One server can't handle all traffic | Spread across many |
| Single server dies → total outage | Route around unhealthy servers |
| Deploying new code | Drain one server, update, rejoin pool |
| Uneven load | Send traffic to least busy server |

## Types of Load Balancers

### Layer 4 (Transport Layer)

Routes based on **IP and port** — doesn't inspect HTTP content.

```
Client → LB (sees: TCP to port 443) → pick server → forward
```

| Pros | Cons |
|------|------|
| Very fast | Can't route by URL path or header |
| Works for any TCP protocol | No HTTP-aware features |

Examples: AWS NLB, HAProxy (L4 mode).

### Layer 7 (Application Layer)

Routes based on **HTTP content** — URL, headers, cookies.

```
/api/*     → API server pool
/images/*  → static server pool
/*         → web app pool
```

| Pros | Cons |
|------|------|
| Smart routing | More CPU overhead |
| SSL termination | More complex config |
| Header manipulation | |

Examples: AWS ALB, Nginx, HAProxy (L7 mode).

## Load Balancing Algorithms

| Algorithm | How It Works | Best For |
|-----------|--------------|----------|
| **Round Robin** | Rotate through servers in order | Equal-capacity servers |
| **Weighted Round Robin** | Higher weight = more traffic | Mixed server sizes |
| **Least Connections** | Send to server with fewest active connections | Long-lived connections |
| **IP Hash** | Same client IP → same server | Session stickiness |
| **Random** | Pick random server | Simple, good enough at scale |
| **Least Response Time** | Pick fastest server | Latency-sensitive apps |

## Health Checks

Load balancers only send traffic to **healthy** servers.

```
Every 10 seconds:
  GET /health → 200 OK  → server stays in pool
  GET /health → timeout → server removed from pool
```

| Check Type | What It Tests |
|------------|---------------|
| HTTP | App responds correctly |
| TCP | Port is open |
| Custom | Deep check (DB connection, disk space) |

When Server 2 fails, traffic flows only to Server 1 and 3 — users may not notice.

## SSL/TLS Termination

Load balancer decrypts HTTPS, forwards plain HTTP internally:

```
Client ──HTTPS──▶ Load Balancer ──HTTP──▶ Backend servers
         (encrypt)   (decrypt here)      (faster, simpler certs)
```

Benefits:
- One place to manage certificates
- Backends don't do crypto overhead
- Centralized SSL policy

## Sticky Sessions (Session Affinity)

Force same user to same server:

```
User A → always Server 1
User B → always Server 2
```

| When Needed | When Avoid |
|-------------|------------|
| Server stores session in memory | Stateless apps with JWT |
| Legacy app, can't externalize state | Redis-backed sessions |

Prefer **stateless servers + shared session store** over sticky sessions when possible.

## Load Balancer Placement

### External (Public-Facing)

```
Internet → External LB → App servers in private subnet
```

Faces users. Public IP lives here.

### Internal

```
App Server → Internal LB → Database read replicas
```

Service-to-service traffic inside the VPC.

## Popular Load Balancers

| Tool | Type | Notes |
|------|------|-------|
| **AWS ALB** | L7, managed | HTTP routing, SSL |
| **AWS NLB** | L4, managed | High throughput, low latency |
| **Nginx** | L7, self-hosted | Reverse proxy + LB |
| **HAProxy** | L4/L7 | Battle-tested, high performance |
| **Cloudflare** | Edge LB | Global, DDoS protection |

## Load Balancer vs DNS Round-Robin

| DNS Round-Robin | Load Balancer |
|-----------------|---------------|
| Client picks IP from DNS | LB actively distributes |
| No health checks | Health checks built in |
| Cached — slow failover | Fast failover |
| Free (built into DNS) | Dedicated infrastructure |

Use **both**: DNS points to load balancer IP; LB distributes to backends.

## Common Problems

| Problem | Cause | Fix |
|---------|-------|-----|
| 502 Bad Gateway | All backends unhealthy | Fix app, check health endpoint |
| Uneven load | Sticky sessions or long connections | Least-connections algorithm |
| SSL errors | Cert expired on LB | Renew certificate |
| Slow uploads | LB buffer limits | Tune timeout and body size |

## Summary

A load balancer sits in front of your servers, distributes traffic, removes unhealthy nodes, and often handles SSL. Use L7 for HTTP-aware routing, L4 for raw TCP speed. Always configure health checks — a load balancer without health checks just spreads traffic to dead servers.

---

[Next: Reverse Proxy →](./03-reverse-proxy.md)
