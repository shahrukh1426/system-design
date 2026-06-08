# CDN (Content Delivery Network)

[← Reverse Proxy](./03-reverse-proxy.md) | [Day 5 Index](./README.md) | [Next: Caching →](./05-caching.md)

## What Is a CDN?

A **CDN** is a network of geographically distributed servers that cache and serve content close to users.

```
Without CDN:
  User in Tokyo ──────────────▶ Origin server in US (150ms+)

With CDN:
  User in Tokyo ──▶ Tokyo edge server (10ms)
                      │
                      └── cache miss? ──▶ Origin (once)
```

Instead of every user hitting your origin server, they hit the **nearest edge node**.

## Why It Exists

| Problem | CDN Fix |
|---------|---------|
| Users far from origin → high latency | Edge server nearby |
| Origin overwhelmed by static traffic | CDN absorbs most requests |
| Single origin bandwidth limit | Distributed across hundreds of edges |
| DDoS on origin | CDN absorbs attack at edge |

CDNs matter most for **static and cacheable content**: images, CSS, JS, videos, fonts.

## How a CDN Works

### First Request (Cache Miss)

```
1. User requests https://cdn.example.com/images/logo.png
2. DNS resolves to nearest CDN edge (Tokyo)
3. Tokyo edge: "I don't have logo.png"
4. Edge fetches from Origin server (US)
5. Edge stores copy, returns to user
```

### Second Request (Cache Hit)

```
1. Another Tokyo user requests logo.png
2. Tokyo edge: "I have it" → return immediately
3. Origin never touched
```

```
         ┌─────────┐
User ───▶│ CDN Edge│─── cache HIT → instant response
         │ (Tokyo) │
         └────┬────┘
              │ cache MISS (rare after warm-up)
              ▼
         ┌─────────┐
         │ Origin  │  (your real server / S3 bucket)
         │ Server  │
         └─────────┘
```

## What CDNs Cache

| Content Type | CDN Fit | Notes |
|--------------|---------|-------|
| Images | Excellent | Long cache TTL |
| CSS / JS | Excellent | Version in filename (`app.v2.js`) |
| Videos | Excellent | Major use case (Netflix, YouTube) |
| Fonts | Excellent | Rarely change |
| HTML pages | Moderate | Short TTL or cache per URL |
| API responses | Selective | Only if explicitly cacheable |
| User-specific data | Poor | Don't cache personalized content |

## CDN Architecture

```
                    ┌─────────────────────────┐
                    │      Origin Server       │
                    │  (S3, your web server)   │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
        ┌──────────┐      ┌──────────┐      ┌──────────┐
        │ Edge US  │      │ Edge EU  │      │ Edge APAC│
        │          │      │          │      │          │
        └────┬─────┘      └────┬─────┘      └────┬─────┘
             │                 │                 │
        US users          EU users          Asia users
```

### Key Concepts

| Term | Meaning |
|------|---------|
| **Origin** | Your real server or storage (source of truth) |
| **Edge / PoP** | Point of Presence — CDN server near users |
| **Cache hit** | Edge had the content |
| **Cache miss** | Edge fetched from origin |
| **TTL** | How long edge keeps content before revalidating |
| **Purge / Invalidate** | Force CDN to drop cached content |

## CDN + DNS

CDNs often provide DNS that routes users to the nearest edge:

```
images.shop.com → CNAME → d111111.cloudfront.net
                              ↓
                    Anycast IP (routes to nearest edge)
```

**Anycast:** Same IP announced from many locations — network routes to closest one.

## Cache Control

You control CDN caching via HTTP headers from origin:

```http
Cache-Control: public, max-age=31536000     # cache 1 year (versioned assets)
Cache-Control: public, max-age=3600         # cache 1 hour
Cache-Control: no-cache, no-store           # never cache (user dashboard)
ETag: "abc123"                              # revalidate when changed
```

### Versioned Assets Pattern

```
# Bad — browser/CDN may serve stale JS after deploy
/static/app.js

# Good — new deploy = new URL = fresh cache
/static/app.v2.4.1.js
/static/app.[content-hash].js
```

## CDN Features Beyond Caching

| Feature | Purpose |
|---------|---------|
| **DDoS protection** | Absorb volumetric attacks |
| **WAF** | Block SQL injection, XSS at edge |
| **SSL/TLS** | HTTPS at edge nodes |
| **Image optimization** | Resize, WebP conversion on the fly |
| **Compression** | Brotli/gzip at edge |
| **Origin shield** | Mid-tier cache reduces origin load further |

## Popular CDNs

| Provider | Notes |
|----------|-------|
| **Cloudflare** | CDN + DNS + WAF + DDoS |
| **AWS CloudFront** | Integrates with S3, ALB |
| **Fastly** | Fine-grained purge, edge compute |
| **Akamai** | Largest network, enterprise |
| **Google Cloud CDN** | GCP integration |

## CDN vs Caching (Redis)

| CDN | Application Cache (Redis) |
|-----|---------------------------|
| Caches HTTP responses at edge | Caches data in app memory |
| Close to users geographically | Close to app servers |
| Static files, public content | Database query results, sessions |
| Reduces origin bandwidth | Reduces database load |

Use **both** — CDN for static assets, Redis for dynamic data.

## When You Need a CDN

| Situation | CDN? |
|-----------|------|
| Global user base | Yes |
| Heavy images/video | Yes |
| Static JS/CSS assets | Yes |
| Internal tool, 50 users, one office | Probably not |
| Highly personalized API | Limited CDN use |

## Common Problems

| Problem | Cause | Fix |
|---------|-------|-----|
| Stale content after deploy | Long CDN TTL | Purge cache or version filenames |
| CDN serves old API data | `Cache-Control` too aggressive | Set `no-store` on dynamic endpoints |
| Origin overloaded | CDN not caching enough | Increase TTL, add origin shield |
| Wrong region served | DNS misconfiguration | Check CDN DNS settings |

## Summary

A CDN places copies of your content on servers worldwide so users get fast responses from a nearby edge node. It's essential for static assets and global audiences. Control caching with HTTP headers, version your assets, and keep personalized or sensitive data off the CDN cache.

---

[Next: Caching →](./05-caching.md)
