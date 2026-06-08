# DNS

[← Day 5 Index](./README.md) | [Next: Load Balancer →](./02-load-balancer.md)

## What Is DNS?

**DNS (Domain Name System)** translates human-readable domain names into IP addresses that computers use to connect.

```
shop.example.com  →  93.184.216.34
```

Without DNS, you'd type numeric IPs instead of URLs. DNS is the internet's **phone book**.

## Why It Exists

| Problem | DNS Solution |
|---------|--------------|
| Humans can't remember IPs | Memorable domain names |
| Servers change IPs | Update DNS record — users keep same URL |
| One domain, many servers | Return different IPs (load distribution) |
| Services on subdomains | `api.example.com`, `cdn.example.com` |

## How DNS Resolution Works

When you visit `shop.example.com`, the browser asks: *"What IP is this?"*

```
┌─────────┐
│ Browser │  "IP for shop.example.com?"
└────┬────┘
     ▼
┌─────────────┐  cache hit? → return IP
│ OS Resolver │
└────┬────────┘
     ▼
┌──────────────────┐
│ Recursive Resolver│  (ISP, 8.8.8.8, 1.1.1.1)
└────┬─────────────┘
     │
     ├──▶ Root DNS       ".com? ask TLD server"
     ├──▶ TLD DNS (.com)  "example.com? ask authoritative"
     └──▶ Authoritative   "shop.example.com = 93.184.216.34"
```

### The Four Layers

| Layer | Role | Example |
|-------|------|---------|
| **Browser cache** | Fastest — recent lookups | Chrome DNS cache |
| **OS cache** | System-level cache | Windows/macOS resolver |
| **Recursive resolver** | Does the full lookup for you | Google 8.8.8.8, Cloudflare 1.1.1.1 |
| **Authoritative DNS** | Source of truth for a domain | Route 53, Cloudflare DNS |

## Common DNS Record Types

| Record | Purpose | Example |
|--------|---------|---------|
| **A** | Domain → IPv4 | `shop.example.com → 93.184.216.34` |
| **AAAA** | Domain → IPv6 | `shop.example.com → 2606:2800:...` |
| **CNAME** | Alias → another domain | `www.example.com → shop.example.com` |
| **MX** | Mail server | `example.com → mail.example.com` |
| **TXT** | Text metadata | SPF, domain verification |
| **NS** | Nameserver delegation | Who hosts DNS for this domain |
| **TTL** | Cache duration (seconds) | `300` = cache 5 minutes |

## DNS in System Design

### Load Distribution via DNS

Return **multiple A records** — clients pick one (round-robin at DNS level):

```
shop.example.com → 10.0.0.1
shop.example.com → 10.0.0.2
shop.example.com → 10.0.0.3
```

Simple, but less control than a dedicated load balancer.

### GeoDNS / Latency-Based Routing

Return different IPs based on user location:

```
User in US     → US datacenter IP
User in Europe → EU datacenter IP
```

Used by: Route 53, Cloudflare, NS1.

### Failover

If primary server is down, DNS returns backup IP (with health checks).

```
Healthy:   shop.example.com → primary IP
Unhealthy: shop.example.com → standby IP
```

**Caveat:** DNS caching (TTL) means failover isn't instant — cached clients may hit dead IP until TTL expires.

## TTL Trade-offs

| Low TTL (60s) | High TTL (3600s) |
|---------------|------------------|
| Fast failover | Slower failover |
| More DNS queries | Fewer queries, faster lookups |
| Good for changing infra | Good for stable infra |

## DNS and HTTPS

TLS certificates are issued for **domain names**, not IPs. DNS must resolve correctly before HTTPS can verify identity.

```
Certificate says: shop.example.com
DNS must resolve shop.example.com → correct server
Browser checks: cert domain matches URL
```

## Common Problems

| Problem | Symptom | Fix |
|---------|---------|-----|
| Wrong A record | Site points to old server | Update authoritative DNS |
| High TTL during migration | Some users see old site for hours | Lower TTL before migration |
| DNS propagation delay | Changes not global instantly | Wait or use low TTL pre-change |
| NXDOMAIN | Domain doesn't exist | Register domain, add records |
| DNS DDoS | Resolver overwhelmed | Use managed DNS (Cloudflare, Route 53) |

## When to Use What

| Need | Approach |
|------|----------|
| Simple site, one server | Single A record |
| Multiple servers | Multiple A records or CNAME to load balancer |
| Global users | GeoDNS or anycast |
| High availability | Low TTL + health-checked failover |
| Subdomain routing | `api.`, `cdn.`, `staging.` as separate records |

## Summary

DNS maps domain names to IPs so users and browsers can find your servers. It's the first step in every web request. In system design, DNS also enables geo-routing, basic load distribution, and failover — but respect TTL when planning migrations.

---

[Next: Load Balancer →](./02-load-balancer.md)
