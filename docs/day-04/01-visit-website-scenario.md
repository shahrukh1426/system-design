# Scenario: What Happens When You Visit a Website?

[← Day 4 Index](./README.md)

## The Scenario

**Alice** sits at her laptop. She wants to browse products on an online shop. She opens Chrome, clicks the address bar, types:

```
https://shop.example.com/products
```

She presses **Enter**.

What happens in the next 1–2 seconds — across networks, servers, and her browser — is what this document explains.

---

## Full Picture (Bird's-Eye View)

```
 Alice (User)
     │
     ▼
 Browser ── parses URL, checks cache
     │
     ▼
 DNS Lookup ── shop.example.com → 93.184.216.34
     │
     ▼
 IP Address ── know where to connect
     │
     ▼
 TCP Connection ── three-way handshake
     │
     ▼
 HTTPS Request ── TLS encrypt, send GET /products
     │
     ▼
 Load Balancer ── pick a healthy web server
     │
     ▼
 Web Server ── receive request, route to app
     │
     ▼
 Backend Services / Databases ── fetch product data
     │
     ▼
 Response Generated ── HTML sent back
     │
     ▼
 Browser Render ── parse, fetch assets, paint page
     │
     ▼
 Alice sees the products page
```

**Total time (typical):** 500ms – 2s for first paint, depending on network, server load, and page complexity.

---

## Step 1 — User

Alice performs a simple action: she **submits a URL**.

```
Input:  https://shop.example.com/products
Action: Press Enter (or click a link / bookmark)
```

From her perspective, she's asking: *"Show me the products page."*

She doesn't know about DNS, TCP, or databases. The entire stack exists to fulfill that one intent.

| What Alice provides | What the system must figure out |
|---------------------|--------------------------------|
| Domain: `shop.example.com` | Which server hosts this site? |
| Path: `/products` | Which page or API to return? |
| Scheme: `https` | Encrypted connection required |

---

## Step 2 — Browser

The **browser** (Chrome) is Alice's agent on the internet. It takes her input and prepares a network request.

### What the Browser Does Immediately

```
1. Parse the URL
   scheme:   https
   host:     shop.example.com
   port:     443 (default for HTTPS)
   path:     /products

2. Check local cache
   → Is this page cached and still fresh?
   → If yes: skip network, render from cache (done!)
   → If no: continue below

3. Check HSTS list
   → Force HTTPS for known domains

4. Prepare to resolve shop.example.com
```

### Browser Cache Layers

| Cache | What's Stored | Speed |
|-------|---------------|-------|
| Memory cache | Recently visited pages | Instant |
| Disk cache | HTML, CSS, JS, images | Very fast |
| Service Worker | Offline-capable apps | App-controlled |

For this scenario, Alice hasn't visited the site recently — **cache miss**. The browser must go to the network.

---

## Step 3 — DNS Lookup

Before connecting to a server, the browser needs its **IP address**. Humans use domain names; computers use IPs.

```
Question: What is the IP of shop.example.com?
Answer:   93.184.216.34 (example)
```

### DNS Resolution Chain

```
Browser
  │  "What is shop.example.com?"
  ▼
OS Resolver (checks local cache)
  │  miss
  ▼
Recursive DNS Resolver (ISP or 8.8.8.8 / 1.1.1.1)
  │
  ├──▶ Root DNS        → ".com lives at TLD server X"
  ├──▶ TLD DNS (.com)  → "example.com lives at authoritative server Y"
  └──▶ Authoritative DNS (example.com)
         → shop.example.com = 93.184.216.34
```

### DNS Record Types (Relevant Here)

| Record | Purpose |
|--------|---------|
| **A** | Domain → IPv4 address |
| **AAAA** | Domain → IPv6 address |
| **CNAME** | Alias → another domain |
| **TTL** | How long to cache the answer |

**Typical DNS lookup time:** 20–120ms (cached) or 50–300ms (uncached).

The result is cached locally so repeat visits skip most of this work.

---

## Step 4 — IP Address

DNS returns an **IP address** — the numeric location of the server on the internet.

```
shop.example.com  →  93.184.216.34
```

Think of it like a street address:

| Human-readable | Machine-readable |
|----------------|------------------|
| shop.example.com | 93.184.216.34 |
| "123 Main St" | GPS coordinates |

The browser now knows **where** to connect:

```
Target: 93.184.216.34
Port:   443 (HTTPS)
```

### What If DNS Fails?

| Failure | User Sees |
|---------|-----------|
| Domain doesn't exist | `DNS_PROBE_FINISHED_NXDOMAIN` |
| DNS server timeout | Slow load, then error |
| Wrong IP (misconfiguration) | Wrong site or connection refused |

---

## Step 5 — TCP Connection

The browser opens a **TCP connection** to the server. TCP guarantees data arrives reliably and in order.

### Three-Way Handshake

```
Browser                    Server (93.184.216.34:443)
   │                              │
   │──────── SYN ────────────────▶│  "I want to connect"
   │◀─────── SYN-ACK ─────────────│  "OK, I acknowledge"
   │──────── ACK ────────────────▶│  "Connection established"
   │                              │
```

| Packet | Meaning |
|--------|---------|
| **SYN** | Client initiates connection |
| **SYN-ACK** | Server accepts and responds |
| **ACK** | Client confirms — connection open |

**Typical time:** 1 round trip (20–100ms depending on distance).

### Why TCP First?

HTTP and HTTPS run **on top of** TCP. You need a reliable pipe before sending application data.

```
Application Layer:   HTTP / HTTPS
Transport Layer:     TCP          ← we are here
Network Layer:       IP
Link Layer:          Ethernet / Wi-Fi
```

---

## Step 6 — HTTPS Request

Alice used `https://`, so before any HTTP data flows, the browser and server perform a **TLS handshake** to encrypt the connection.

### TLS Handshake (Simplified)

```
Browser                              Server
   │                                    │
   │──── ClientHello (supported ciphers) ──▶│
   │◀─── ServerHello + Certificate ────────│
   │     (proves identity of shop.example.com)
   │                                    │
   │  Browser verifies certificate       │
   │  with trusted Certificate Authority │
   │                                    │
   │──── Key exchange ──────────────────▶│
   │◀─── Encrypted channel ready ────────│
```

### Certificate Verification

The browser checks:

- Certificate is signed by a trusted CA
- Domain matches (`shop.example.com`)
- Certificate is not expired
- Certificate is not revoked

If any check fails → browser shows **"Your connection is not private"** warning.

### HTTP Request Sent (Now Encrypted)

Once TLS is established, the browser sends the actual HTTP request:

```http
GET /products HTTP/1.1
Host: shop.example.com
User-Agent: Mozilla/5.0 (Chrome/120...)
Accept: text/html,application/xhtml+xml
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Cookie: session_id=abc123; theme=dark
```

| Header | Purpose |
|--------|---------|
| `GET /products` | Method and path Alice wants |
| `Host` | Virtual host — important behind load balancers |
| `User-Agent` | Browser identity |
| `Accept-Encoding` | Client supports compression |
| `Cookie` | Session data from previous visits |

**Keep-alive:** The same TCP connection can be reused for follow-up requests (images, CSS, JS) — saves handshake time.

---

## Step 7 — Load Balancer

Alice's request hits the data center. The first server it usually meets is a **load balancer** — not the app server itself.

```
                    ┌─────────────────┐
Alice's request ───▶│  Load Balancer  │
                    │  (public IP)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Web      │  │ Web      │  │ Web      │
        │ Server 1 │  │ Server 2 │  │ Server 3 │
        └──────────┘  └──────────┘  └──────────┘
```

### What the Load Balancer Does

| Job | Detail |
|-----|--------|
| **Distribute traffic** | Round-robin, least connections, or IP hash |
| **Health checks** | Stop sending traffic to dead servers |
| **SSL termination** | Decrypt HTTPS here, forward HTTP internally |
| **Sticky sessions** | Same user → same server (if needed) |

For Alice's request, the load balancer picks **Web Server 2** (least busy) and forwards the `GET /products` request.

### Other Front-Door Components (Often Present)

| Component | Role |
|-----------|------|
| **CDN** | Serve static assets from edge (may answer before origin) |
| **WAF** | Block malicious requests (SQL injection, bots) |
| **API Gateway** | Route `/api/*` to microservices |
| **Reverse Proxy** | Nginx, HAProxy — same role as load balancer |

---

## Step 8 — Web Server

**Web Server 2** receives the request. Software like **Nginx** or **Apache** sits here.

```
GET /products HTTP/1.1
Host: shop.example.com
```

### Web Server Decision Tree

```
Is /products a static file? (e.g. products.html on disk)
  YES → read file from disk → return HTML (fast path)
  NO  → forward to application backend
```

For a modern shop, `/products` is usually handled by an **application server**, not a static file.

```
Web Server (Nginx)
      │
      │ proxy_pass http://app-backend
      ▼
Application Server (Node.js / Python / Java)
```

### What the Web Server Handles

| Task | Example |
|------|---------|
| Static files | `style.css`, `logo.png` served directly |
| Compression | gzip response before sending |
| Request routing | `/api/* → API service, `/*` → web app |
| Rate limiting | Block IPs making too many requests |
| Access logs | Log every request for observability |

---

## Step 9 — Backend Services / Databases

The application server needs **product data**. It doesn't store everything in memory — it talks to backend services and databases.

```
Application Server
       │
       ├──▶ Product Service  ──▶  PostgreSQL (products table)
       │
       ├──▶ Inventory Service ──▶ Redis (stock cache)
       │
       └──▶ User Service     ──▶  PostgreSQL (read session cookie)
```

### What Happens for `/products`

```
1. Read session cookie → identify Alice (optional: logged-in user)
2. Call Product Service: getProducts(page=1, limit=20)
3. Product Service queries database:

   SELECT id, name, price, image_url
   FROM products
   WHERE active = true
   ORDER BY created_at DESC
   LIMIT 20;

4. Check Redis cache first:
   cache key: "products:page:1"
   → HIT: return cached JSON (5ms)
   → MISS: query DB, store in cache (50ms)

5. Inventory Service checks stock levels (if shown on page)
6. Application merges data into a view model
```

### Backend Architecture (Typical)

```
┌─────────────────────────────────────────────────┐
│              Application Server                  │
│         (business logic, templating)             │
└───────┬─────────────┬─────────────┬─────────────┘
        │             │             │
        ▼             ▼             ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Product  │  │  User    │  │ Inventory│
  │ Service  │  │ Service  │  │ Service  │
  └────┬─────┘  └────┬─────┘  └────┬─────┘
       │             │             │
       ▼             ▼             ▼
   PostgreSQL    PostgreSQL      Redis
```

**Typical backend time:** 50–300ms depending on cache hits and query complexity.

Alice's browser is still waiting. Nothing visible yet — all of this is server-side.

---

## Step 10 — Response Generated

The application server builds the **HTTP response** and sends it back up the chain.

### Response Assembly

```
1. Render HTML template with product data
2. Set response headers
3. Web server compresses (gzip)
4. Load balancer forwards to client
5. TLS encrypts on the wire
```

### HTTP Response

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Encoding: gzip
Cache-Control: max-age=60
Set-Cookie: session_id=abc123; HttpOnly; Secure
Content-Length: 4821

<!DOCTYPE html>
<html>
<head>
  <title>Products - Shop Example</title>
  <link rel="stylesheet" href="/static/css/main.css">
</head>
<body>
  <h1>Products</h1>
  <div class="product-grid">
    <div class="product-card">
      <img src="/images/widget.jpg" alt="Widget">
      <h2>Widget</h2>
      <p>$29.99</p>
    </div>
    ...
  </div>
  <script src="/static/js/app.js"></script>
</body>
</html>
```

### Response Headers Explained

| Header | Meaning |
|--------|---------|
| `200 OK` | Success |
| `Content-Type: text/html` | Browser should render as HTML |
| `Content-Encoding: gzip` | Body is compressed |
| `Cache-Control: max-age=60` | Browser can cache for 60 seconds |
| `Set-Cookie` | Store session for next request |

### The Return Path

```
Database → App Server → Web Server → Load Balancer → Internet → Alice's Browser
```

Same path in reverse. **Total round trip so far:** often 300ms – 1.5s.

---

## Step 11 — Browser Render

Alice's browser receives the HTML. But she's **not** seeing the page yet — the browser must **build** it.

### Rendering Pipeline

```
1. Parse HTML        → build DOM tree
2. Parse CSS         → build CSSOM tree
3. Execute JS        → may modify DOM
4. Build render tree → DOM + CSSOM combined
5. Layout            → calculate positions and sizes
6. Paint             → fill in pixels
7. Composite         → layers merged on screen
```

```
HTML ──▶ DOM Tree ──┐
                    ├──▶ Render Tree ──▶ Layout ──▶ Paint ──▶ Screen
CSS  ──▶ CSSOM ─────┘
```

### Additional Network Requests

The HTML references more resources. The browser fetches them **in parallel** (same TCP connection via keep-alive):

```
GET /static/css/main.css     → Web Server → CSS file
GET /static/js/app.js        → Web Server → JavaScript
GET /images/widget.jpg       → CDN edge (cached) → image
GET /fonts/inter.woff2       → CDN → font
```

| Resource | Blocks render? |
|----------|----------------|
| CSS | Yes — browser waits (render-blocking) |
| JS (no defer/async) | Yes — blocks HTML parsing |
| Images | No — page shows, images fill in later |
| Fonts | Partial — text may flash unstyled (FOUT) |

### Critical Rendering Path

```
First HTML byte arrives
    → DOM construction starts
    → CSS fetched and parsed
    → First paint (background, layout shell)
    → JS fetched and executed
    → Images loaded
    → Full page interactive
```

| Milestone | What Alice Perceives |
|-----------|----------------------|
| **TTFB** (Time to First Byte) | Waiting... (blank or spinner) |
| **First Paint** | Something appears (header, layout) |
| **First Contentful Paint** | Text or image visible |
| **Time to Interactive** | Can click buttons, scroll smoothly |

### Final Result

After ~1–2 seconds, Alice sees:

```
┌─────────────────────────────────────────┐
│  Shop Example          🔍  Cart  Login   │
├─────────────────────────────────────────┤
│  Products                               │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Widget  │  │ Gadget  │  │ Gizmo   │ │
│  │ $29.99  │  │ $49.99  │  │ $19.99  │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

She never saw DNS, TCP, the load balancer, or the database. The stack worked.

---

## Timeline Summary

| Step | Component | Typical Time |
|------|-----------|--------------|
| 1 | User input | 0ms |
| 2 | Browser parse + cache check | 1–5ms |
| 3–4 | DNS lookup | 20–120ms |
| 5 | TCP handshake | 20–80ms |
| 6 | TLS handshake | 40–200ms |
| 6 | HTTP request travel | 20–100ms |
| 7 | Load balancer | 1–5ms |
| 8 | Web server routing | 1–10ms |
| 9 | Backend + database | 50–300ms |
| 10 | Response travel back | 20–100ms |
| 11 | Browser render + assets | 100–800ms |
| | **Total (first meaningful paint)** | **~500ms – 2s** |

*Subsequent visits are faster: DNS cached, TCP reused, assets cached.*

---

## What Can Go Wrong? (Failure Scenarios)

| Step | Failure | Alice Experiences |
|------|---------|-------------------|
| DNS | Domain expired | "Site can't be reached" |
| TCP | Server down | Connection timeout |
| TLS | Expired certificate | Security warning |
| Load Balancer | All backends unhealthy | 503 Service Unavailable |
| Web Server | Misconfigured route | 404 Not Found |
| Backend | Database timeout | 500 Internal Server Error |
| Backend | Slow query | Long blank wait, then page |
| Render | JS error | Broken layout or blank section |

Each layer can fail independently. Good system design handles failures at every step — retries, fallbacks, caching, health checks.

---

## How This Maps to System Design

| Concept from Earlier Days | Where It Appears Here |
|---------------------------|----------------------|
| [HLD](../day-02/02-hld.md) | Load balancer → web server → backend services |
| [Scalability](../day-02/05-scalability-design.md) | Load balancer distributes across servers |
| [Caching](../day-02/10-performance-design.md) | DNS cache, Redis, browser cache, CDN |
| [Security](../day-02/07-security-design.md) | HTTPS, TLS certificates, HttpOnly cookies |
| [Performance](../day-02/10-performance-design.md) | gzip, keep-alive, CDN, critical rendering path |
| [Reliability](../day-02/06-reliability-design.md) | Load balancer health checks, DB failover |
| [Observability](../day-02/11-observability-design.md) | Access logs, latency metrics per layer |

---

## Summary

Visiting `https://shop.example.com/products` triggers a chain: the **browser** parses the URL, **DNS** resolves the domain to an **IP**, **TCP** and **TLS** establish a secure connection, an **HTTPS request** travels through a **load balancer** to a **web server**, which calls **backend services and databases** to build data, a **response** travels back as HTML, and the **browser renders** the page — fetching CSS, JS, and images along the way.

Every layer has a job. System design is understanding each layer, where bottlenecks form, and what fails when load grows or components break.

---

**Day 4 complete.** Paste Day 5 when ready.

[← Back to Day 4 Index](./README.md)
