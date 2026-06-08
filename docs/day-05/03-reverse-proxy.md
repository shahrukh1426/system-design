# Reverse Proxy

[← Load Balancer](./02-load-balancer.md) | [Day 5 Index](./README.md) | [Next: CDN →](./04-cdn.md)

## What Is a Reverse Proxy?

A **reverse proxy** sits in front of backend servers and acts on their behalf — receiving client requests and forwarding them to the right internal server.

```
Client thinks it talks to one server:
  Client ──▶ Reverse Proxy ──▶ Backend Server(s)

Client never sees the real backend directly.
```

**Reverse** = proxy faces the public internet on behalf of servers behind it.  
(Contrast **forward proxy**: hides the *client* from servers — used in VPNs/corporate networks.)

## Why It Exists

| Job | Detail |
|-----|--------|
| **Hide backend topology** | Clients see one address; servers can change behind the proxy |
| **SSL termination** | Decrypt HTTPS at the proxy |
| **Route requests** | `/api` → API server, `/` → web app |
| **Serve static files** | Nginx serves CSS/JS directly — faster than app server |
| **Security** | Backend in private network, never exposed to internet |
| **Compression** | gzip/brotli responses before sending to client |
| **Rate limiting** | Block abusive clients at the edge |

## Reverse Proxy vs Load Balancer

They overlap heavily. Many tools do **both** (Nginx, HAProxy, AWS ALB).

| Reverse Proxy | Load Balancer |
|---------------|---------------|
| Focus: represent backends, route, protect | Focus: distribute traffic evenly |
| Often one entry point | Often multiple identical backends |
| URL-based routing | Connection-based distribution |

In practice: **Nginx as reverse proxy + load balancer** is one of the most common patterns.

```
                    ┌─────────────────────┐
Client ────────────▶│  Nginx (Reverse     │
                    │  Proxy + LB)        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        /static/*         /api/*            /*
        file server      API pool         web app pool
```

## How It Works

### Request Flow

```
1. Client sends: GET https://shop.example.com/api/products
2. Reverse proxy receives request
3. Proxy matches rule: /api/* → upstream api_servers
4. Proxy forwards to api-server-2:8080
5. Backend responds with JSON
6. Proxy adds headers, compresses, returns to client
```

### Example Nginx Config (Conceptual)

```nginx
upstream web_app {
    server 10.0.1.10:3000;
    server 10.0.1.11:3000;
}

upstream api_app {
    server 10.0.2.10:8080;
}

server {
    listen 443 ssl;

    location /api/ {
        proxy_pass http://api_app;
    }

    location /static/ {
        root /var/www/assets;    # serve directly, no backend
    }

    location / {
        proxy_pass http://web_app;
    }
}
```

## Common Reverse Proxy Features

### 1. SSL Termination

```
Client ──HTTPS──▶ Proxy (decrypt) ──HTTP──▶ Backend
```

Certificate lives on proxy only. Backends use plain HTTP on private network.

### 2. Caching (Proxy-Level)

```
GET /static/logo.png
  → Proxy checks local cache
  → HIT: return immediately (backend never touched)
  → MISS: fetch from backend, cache, return
```

### 3. Request Buffering

Proxy receives full client request before forwarding — protects slow backends from slow clients.

### 4. WebSocket Support

Proxy maintains long-lived connections for real-time apps (chat, live updates).

```
Client ←──WebSocket──▶ Proxy ←──WebSocket──▶ Backend
```

### 5. Access Control

```
/admin/*  → allow only internal IP range
/api/*    → rate limit 100 req/min per IP
```

## Reverse Proxy in Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Public Internet                    │
└────────────────────────┬─────────────────────────────┘
                         │
                  ┌──────▼──────┐
                  │ Reverse     │
                  │ Proxy       │  (Nginx / ALB)
                  │ (public IP) │
                  └──────┬──────┘
                         │  private network
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ Web App  │   │ API      │   │ Worker   │
   │ :3000    │   │ :8080    │   │ (no public IP)
   └──────────┘   └──────────┘   └──────────┘
```

Backends have **no public IP** — only the proxy is reachable from outside.

## Popular Reverse Proxies

| Tool | Strengths |
|------|-----------|
| **Nginx** | Fast static files, widely used, L7 routing |
| **HAProxy** | High-performance LB + proxy |
| **Caddy** | Automatic HTTPS, simple config |
| **Traefik** | Cloud-native, auto-discovery (Kubernetes) |
| **Envoy** | Service mesh, advanced observability |
| **AWS ALB** | Managed, integrates with AWS ecosystem |

## Reverse Proxy vs API Gateway

| Reverse Proxy | API Gateway |
|---------------|-------------|
| Generic HTTP routing | API-specific features |
| SSL, compression, static files | Auth, API keys, request transformation |
| Infrastructure layer | Product/platform layer |

API Gateway (Kong, AWS API Gateway) is a **specialized** reverse proxy for APIs.

## Common Problems

| Problem | Cause | Fix |
|---------|-------|-----|
| 502 Bad Gateway | Backend down or wrong upstream | Check upstream config, health |
| Wrong client IP in logs | Proxy hides real IP | Forward `X-Forwarded-For` header |
| WebSocket drops | Proxy timeout too short | Increase `proxy_read_timeout` |
| Redirect loops | HTTP/HTTPS mismatch behind proxy | Set `X-Forwarded-Proto` |

## When to Use a Reverse Proxy

| Scenario | Use Reverse Proxy? |
|----------|-------------------|
| Single app server, production | Yes — SSL, security, future scaling |
| Multiple services behind one domain | Yes — path-based routing |
| Static files + dynamic app | Yes — Nginx serves static directly |
| Local development only | Optional — direct to localhost is fine |
| Kubernetes | Yes — Ingress controller is a reverse proxy |

## Summary

A reverse proxy is the public face of your backend — it receives client traffic, routes it internally, and shields real servers from the internet. Nginx and similar tools often combine reverse proxy, load balancing, SSL termination, and static file serving in one layer.

---

[Next: CDN →](./04-cdn.md)
