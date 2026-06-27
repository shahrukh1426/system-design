# API Gateway & Service Discovery — MCQ Questions (50)

Multi-select format: each question has **two or more** correct answers. Questions tagged **[Case Study]** include a business context block.

> **Answers and explanations:** see [answer-key/day-10-answers.md](./answer-key/day-10-answers.md)

---

### Q01 [Easy] [Case Study] — CloudMart Deploy Bottleneck


**Context:** CloudMart runs a 400K-line monolith. A one-line CSS fix requires a full 25-minute deploy and weekend change window. Payment and catalog ship together.

**Select all that apply.**

Which signals favor splitting toward microservices over time?

- [ ] A. Small team of 4 engineers still validating product-market fit
- [ ] B. Clear domain boundaries — catalog, orders, and payments are distinct
- [ ] C. One module needs 10× scale while blog traffic stays flat
- [ ] D. Deploy pain — any change requires full redeploy of unrelated modules

---

### Q02 [Easy] — Monolith Advantages


**Select all that apply.**

Which are genuine advantages of a monolithic architecture?

- [ ] A. Simple local debugging — no network between modules
- [ ] B. Independent per-service deploy without coordination
- [ ] C. Low operational overhead for early-stage products
- [ ] D. ACID transactions across modules in one database

---

### Q03 [Easy] [Case Study] — CloudMart MVP Team Size


**Context:** CloudMart's startup spin-off has 6 engineers, unclear domain boundaries, and 2K daily users.

**Select all that apply.**

When is staying monolithic (or modular monolith) the better default?

- [ ] A. Strong need for cross-module ACID transactions in one workflow
- [ ] B. Product still finding fit — minimize ops surface area
- [ ] C. Low traffic and simple domain reduce distributed complexity
- [ ] D. Every team needs separate repos on day one

---

### Q04 [Easy] — Microservices Trade-offs


**Select all that apply.**

Which are real costs of adopting microservices?

- [ ] A. Eliminates all need for API gateways and discovery
- [ ] B. Distributed debugging and tracing across hops
- [ ] C. Network latency and failure modes between services
- [ ] D. Harder cross-service data consistency without careful design

---

### Q05 [Easy] — Modular Monolith


**Select all that apply.**

What describes a modular monolith strategy?

- [ ] A. Each module must run in a separate Kubernetes cluster
- [ ] B. One codebase can still share a database with disciplined boundaries
- [ ] C. Enables later extraction via strangler fig without big-bang rewrite
- [ ] D. Clear module boundaries inside one deployable unit

---

### Q06 [Easy] [Case Study] — CloudMart Internal RPC Choice


**Context:** CloudMart order service calls inventory 8,000 times/sec with strict latency SLO. Public mobile app uses REST.

**Select all that apply.**

Which protocol choices fit?

- [ ] A. gRPC + Protobuf for high-throughput internal order → inventory calls
- [ ] B. Queues for fire-and-forget side effects (email, analytics)
- [ ] C. GraphQL between every internal microservice by default
- [ ] D. REST/JSON for public client APIs — universal and debuggable

---

### Q07 [Easy] — Sync vs Async Between Services


**Select all that apply.**

When should service-to-service communication be asynchronous?

- [ ] A. Fan-out to inventory, email, and analytics after order placed
- [ ] B. Decoupling producers from slow or flaky consumers
- [ ] C. Side effects where the caller does not need an immediate result
- [ ] D. Payment authorization shown in the HTTP response to the user

---

### Q08 [Easy] [Case Study] — CloudMart Mobile Data Needs


**Context:** CloudMart's mobile app needs different field sets per screen — home feed vs checkout vs profile — from overlapping services.

**Select all that apply.**

Which client-facing API approach helps?

- [ ] A. GraphQL eliminates N+1 risk without server-side DataLoader design
- [ ] B. GraphQL for flexible client queries; not necessarily between every internal service
- [ ] C. GraphQL at the gateway — client requests exact fields in one round trip
- [ ] D. BFF per client type is an alternative to a single flexible GraphQL layer

---

### Q09 [Medium] [Case Study] — CloudMart Internal Service Trust


**Context:** CloudMart assumed private VPC meant internal HTTP needed no auth. A compromised pod scanned and called payment APIs directly.

**Select all that apply.**

Which internal authentication practices apply?

- [ ] A. Private network means any pod may impersonate any service safely
- [ ] B. Short-lived service tokens issued by a central auth component
- [ ] C. Service mesh can automate mTLS between sidecars
- [ ] D. mTLS or service JWT — never trust VPC alone

---

### Q10 [Medium] — gRPC Production Considerations


**Select all that apply.**

Which statements about gRPC in production are correct?

- [ ] A. HTTP/2 long-lived connections need L7-aware load balancing
- [ ] B. Combine with timeouts, retries on idempotent reads, circuit breakers
- [ ] C. Browser-native without grpc-web or gateway translation
- [ ] D. Strong contracts via Protobuf with code generation

---

### Q11 [Easy] [Case Study] — CloudMart Client URL Sprawl


**Context:** CloudMart's mobile app hardcodes auth.cloudmart.com, orders.internal:8080, and catalog.internal:3000. Certificate and CORS updates require app store releases.

**Select all that apply.**

How does an API gateway address this?

- [ ] A. Hide internal hostnames and topology from external consumers
- [ ] B. Centralize CORS, SSL termination, and routing in one place
- [ ] C. Single public domain (api.cloudmart.com) — one TLS cert, simpler clients
- [ ] D. Expose every microservice port directly for lower latency

---

### Q12 [Easy] — API Gateway vs Load Balancer


**Select all that apply.**

How does an API gateway differ from a basic load balancer?

- [ ] A. Gateway is application-aware — path routing, auth, transforms
- [ ] B. LB always validates JWT and API keys; gateway never does
- [ ] C. LB typically distributes traffic to one pool; gateway routes to many services
- [ ] D. Gateway can terminate TLS and apply rate limits per route

---

### Q13 [Easy] — Gateway Cross-Cutting Concerns


**Select all that apply.**

Which concerns are commonly centralized at the API gateway?

- [ ] A. Per-API-key rate limiting before backends
- [ ] B. SSL/TLS termination for public HTTPS
- [ ] C. All resource-level authorization (user owns order 123)
- [ ] D. JWT validation and request logging at the edge

---

### Q14 [Medium] [Case Study] — CloudMart Mobile vs Web APIs


**Context:** CloudMart mobile needs lightweight payloads; web admin needs rich dashboards. One generic REST API causes over-fetching on mobile and under-powering on web.

**Select all that apply.**

Which architecture patterns help?

- [ ] A. BFF replaces all need for a gateway — clients call BFF ports directly on internet
- [ ] B. Gateway → BFF → microservices is common at larger scale
- [ ] C. BFF (Backend for Frontend) per client type behind the gateway
- [ ] D. API gateway for shared routing/auth; BFF for tailored aggregation

---

### Q15 [Medium] [Case Study] — CloudMart Gateway Routing Table


**Context:** CloudMart exposes /v1/users, /v1/orders, /v1/products, and /graphql on api.cloudmart.com.

**Select all that apply.**

Which gateway routing responsibilities apply?

- [ ] A. Host-based routing can separate public API from admin subdomain
- [ ] B. Path-based routing maps URL prefixes to backend services
- [ ] C. API versioning routes /v1 and /v2 to different backend pools
- [ ] D. Gateway should own all business rules and database queries

---

### Q16 [Medium] — TLS at the Gateway


**Select all that apply.**

Which SSL/TLS termination practices are sound?

- [ ] A. Terminate HTTPS at gateway; forward HTTP on private network to backends
- [ ] B. Central certificate management (ACM, Let's Encrypt) at the edge
- [ ] C. Backends must always terminate TLS again for security — double encryption required always
- [ ] D. Optional mTLS between gateway and services for stricter internal trust

---

### Q17 [Medium] — Request Transformation


**Select all that apply.**

Which gateway transformations are valid use cases?

- [ ] A. Inject X-Request-Id and strip client-supplied spoofed identity headers
- [ ] B. Store shopping cart state in gateway memory for all users
- [ ] C. Protocol translation: REST client → gRPC backend
- [ ] D. Path rewrite: /api/v1/users → /users on backend

---

### Q18 [Medium] [Case Study] — CloudMart Dashboard Aggregation


**Context:** CloudMart's mobile home screen needs user profile, recent orders, and notification count — three backend services.

**Select all that apply.**

How should the gateway or BFF handle this?

- [ ] A. Parallel backend calls merged into one JSON response — reduces client round trips
- [ ] B. Mobile client must call three services directly over the public internet
- [ ] C. API composition at edge helps slow mobile networks
- [ ] D. Keep aggregation thin — no heavy business rules in gateway

---

### Q19 [Medium] — Gateway Anti-Patterns


**Select all that apply.**

What should an API gateway avoid?

- [ ] A. Becoming a god-object that every feature passes through
- [ ] B. Heavy business logic and direct database access
- [ ] C. Long-running synchronous processing — use async queue instead
- [ ] D. Routing, auth, rate limits, and TLS termination

---

### Q20 [Medium] [Case Study] — CloudMart Path Routing Incident


**Context:** CloudMart misconfigured gateway: /api/v1/orders/* routed to catalog-service. Checkout returned product JSON for order IDs.

**Select all that apply.**

Which routing concepts prevent this class of failure?

- [ ] A. Explicit path-based upstream mapping per service
- [ ] B. Integration tests that hit gateway routes end-to-end
- [ ] C. Path routing is optional — any service can handle any path
- [ ] D. Separate admin and public routes by host or path prefix

---

### Q21 [Medium] — Header-Based Routing


**Select all that apply.**

When is header-based routing at the gateway useful?

- [ ] A. Multi-tenant routing via X-Tenant header to tenant-specific pools
- [ ] B. Replacing all need for authentication
- [ ] C. API version selection without changing URL path
- [ ] D. Canary releases — route small % to v2 via header or cookie

---

### Q22 [Medium] [Case Study] — CloudMart Canary Release


**Context:** CloudMart deploys order-service v2. Gateway sends 5% of traffic to v2; error rate on v2 is 3× v1.

**Select all that apply.**

Which traffic-shaping practices apply?

- [ ] A. Canary split at gateway or mesh — roll back by reducing v2 percentage
- [ ] B. Canary requires clients to change URLs for each version
- [ ] C. Monitor error rate and latency per upstream pool during canary
- [ ] D. Blue-green flips all traffic at once after validation

---

### Q23 [Hard] — gRPC Load Balancing


**Select all that apply.**

Why does naive TCP round-robin fail for gRPC?

- [ ] A. Need L7-aware proxy (Envoy) or client-side subchannel LB
- [ ] B. HTTP/2 multiplexes many RPCs on one long-lived connection — uneven pinning
- [ ] C. Proxy that balances per RPC, not per connection
- [ ] D. gRPC always uses UDP so TCP LB does not apply

---

### Q24 [Medium] — Sticky Sessions at Gateway


**Select all that apply.**

When should sticky sessions be avoided at the load balancer?

- [ ] A. Legacy server memory sessions without shared store — sticky required
- [ ] B. Sessions stored in centralized Redis — instances interchangeable
- [ ] C. Stateless services with JWT in cookie — any instance can serve
- [ ] D. Sticky sessions complicate rolling deploys and failover

---

### Q25 [Medium] [Case Study] — CloudMart JWT at Edge


**Context:** CloudMart gateway validates JWT once and forwards X-User-Id to order-service. Order-service trusts any X-User-Id header from the network.

**Select all that apply.**

Which auth design fixes this?

- [ ] A. Services should trust any header if request comes from private IP
- [ ] B. Coarse auth at gateway; resource checks (user owns order) in order-service
- [ ] C. Backends reject client-supplied identity headers — trust gateway only via network policy/mTLS
- [ ] D. Gateway strips client X-User-Id; injects verified identity after JWT validation

---

### Q26 [Medium] — API Keys for Partners


**Select all that apply.**

Which API key practices at the gateway are correct?

- [ ] A. Lookup key → tenant, rate tier, and permissions
- [ ] B. Per-key rate limits enforce billing tiers
- [ ] C. API keys in gateway config git repo without secret manager
- [ ] D. Common for partner and server-to-server integrations

---

### Q27 [Medium] [Case Study] — CloudMart Admin Route Exposure


**Context:** CloudMart /admin/* routes were reachable without role check at gateway. Any logged-in user could hit admin upstream.

**Select all that apply.**

How should gateway and services split authorization?

- [ ] A. Services enforce fine-grained resource ownership
- [ ] B. Authentication at gateway; authorization split coarse (gateway) + fine (service)
- [ ] C. Gateway enforces route-level roles — /admin/* requires admin in JWT
- [ ] D. Gateway alone decides if user 789 may access order 456 owned by user 123

---

### Q28 [Hard] — OAuth and Token Lifecycle


**Select all that apply.**

Which token practices at the gateway are production-safe?

- [ ] A. Short-lived access tokens; refresh handled by auth service
- [ ] B. 30-day access JWT with no refresh — simplest UX
- [ ] C. Validate iss, aud, exp on JWT; support OAuth/OIDC introspection when needed
- [ ] D. Public routes (/health, catalog) explicitly allowlisted without auth

---

### Q29 [Medium] — mTLS Gateway to Service


**Select all that apply.**

What does mTLS between gateway and backends provide?

- [ ] A. Complements JWT user auth with service-to-service trust
- [ ] B. Service mesh can automate certificate rotation for sidecars
- [ ] C. Eliminates need for any user authentication at gateway
- [ ] D. Both sides present certificates — prevents impersonation inside VPC

---

### Q30 [Medium] [Case Study] — CloudMart Scraping Attack


**Context:** A bot sends 12,000 req/s to CloudMart's search API through the gateway. Catalog pods hit 100% CPU; legitimate users see timeouts.

**Select all that apply.**

Which gateway protections apply?

- [ ] A. Rate limit by IP or API key before traffic reaches catalog-service
- [ ] B. Return 429 with Retry-After when limit exceeded
- [ ] C. Rate limiting only inside catalog-service — gateway passes all traffic
- [ ] D. Stricter limits on expensive routes like /search

---

### Q31 [Easy] [Case Study] — CloudMart Login Brute Force


**Context:** CloudMart sees 50,000 POST /login attempts per hour from rotating IPs against stolen email list.

**Select all that apply.**

Which rate-limiting approaches help?

- [ ] A. Token bucket allows controlled bursts while capping sustained abuse
- [ ] B. Sliding window smoother than fixed window for fairness
- [ ] C. Low limit on POST /login per IP (e.g., 5/min) — brute-force protection
- [ ] D. Fixed window has no burst boundary problem at minute rollovers

---

### Q32 [Medium] — Rate Limit Response Headers


**Select all that apply.**

Which HTTP responses and headers are correct for rate limiting?

- [ ] A. HTTP 429 Too Many Requests when quota exceeded
- [ ] B. HTTP 200 with silent drop — best UX for abusive clients
- [ ] C. Retry-After tells clients when to retry
- [ ] D. X-RateLimit-Limit, Remaining, Reset for transparency

---

### Q33 [Hard] — Distributed Rate Limiting


**Select all that apply.**

CloudMart runs 6 gateway replicas. Which distributed limit designs work?

- [ ] A. Per-node counters only — effective limit is limit × replica count
- [ ] B. Quota (daily total) separate from per-second rate burst control
- [ ] C. Token bucket in Redis with atomic INCR/EXPIRE
- [ ] D. Shared Redis counters — all nodes see same count

---

### Q34 [Easy] [Case Study] — CloudMart Hardcoded Upstream IPs


**Context:** CloudMart's gateway config lists order-service at 10.0.1.10. After Kubernetes rollout, pods are at 10.0.2.x — all order API calls fail 502.

**Select all that apply.**

What fixes instance discovery?

- [ ] A. Static IPs work forever if autoscaler never runs
- [ ] B. Kubernetes DNS/Endpoints update pod lists on scale and deploy
- [ ] C. Service discovery — gateway queries registry for current healthy instances
- [ ] D. Logical service name (order-service) instead of hardcoded pod IP

---

### Q35 [Easy] — Service Registry Concepts


**Select all that apply.**

Which service discovery terms are correct?

- [ ] A. Hardcoded IP lists are the cloud-native default for autoscaled pods
- [ ] B. Registration — instance announces itself on startup
- [ ] C. Deregistration — instance removes itself on graceful shutdown
- [ ] D. Registry stores logical service name → list of instance addresses

---

### Q36 [Medium] [Case Study] — CloudMart Kubernetes Service DNS


**Context:** CloudMart pods call http://order-service:8080/orders. No Eureka deployed. DNS resolves to ClusterIP; kube-proxy load-balances to endpoints.

**Select all that apply.**

Which statements about K8s discovery are correct?

- [ ] A. Stable DNS name with endpoints controller updating pod list on rollout
- [ ] B. Built-in server-side discovery — no separate registry required for K8s-native apps
- [ ] C. DNS TTL delays mean K8s never updates endpoints on pod death
- [ ] D. ClusterIP Service provides logical name decoupled from pod IPs

---

### Q37 [Medium] — DNS-Based Discovery Trade-offs


**Select all that apply.**

Which statements about DNS-based service discovery are correct?

- [ ] A. Basic DNS may lack health awareness without health-checked registry
- [ ] B. DNS TTL can delay propagation after instance failure
- [ ] C. DNS always provides instant failover with zero stale traffic
- [ ] D. Simple and universal — multiple A records for instances

---

### Q38 [Medium] — Health-Aware Registry


**Select all that apply.**

How do health-aware registries improve discovery?

- [ ] A. Only return instances passing health checks to callers
- [ ] B. Return all registered instances including crashed ones for retry practice
- [ ] C. Tie registration to periodic GET /health probes
- [ ] D. Consul/Eureka/K8s endpoints filter unhealthy nodes

---

### Q39 [Medium] [Case Study] — CloudMart Polyglot Services


**Context:** CloudMart has Go, Python, and Node services. Team debates Eureka+Ribbon (Java client LB) vs Kubernetes Services.

**Select all that apply.**

Which discovery pattern fits heterogeneous services?

- [ ] A. Client-side discovery requires per-language libraries — higher coupling
- [ ] B. Server-side discovery via K8s Service DNS — simple HTTP clients
- [ ] C. External clients still use gateway + LB (server-side) regardless
- [ ] D. Client-side discovery eliminates all load balancer hops

---

### Q40 [Medium] — Client-Side Discovery


**Select all that apply.**

Which describe client-side service discovery?

- [ ] A. Zero discovery logic in application code
- [ ] B. No intermediary LB hop — direct to chosen instance
- [ ] C. Caller queries registry and picks instance (Ribbon, gRPC resolver)
- [ ] D. Netflix Eureka + Ribbon is a classic Java stack example

---

### Q41 [Medium] [Case Study] — CloudMart Internal Call Pattern


**Context:** Order-service calls inventory-service via http://inventory-service:8080 inside the cluster.

**Select all that apply.**

Which server-side discovery characteristics apply?

- [ ] A. Lower client complexity — any language with HTTP
- [ ] B. Caller must embed Eureka client to resolve IPs
- [ ] C. Extra hop through kube-proxy or LB compared to direct client-side pick
- [ ] D. Client uses stable logical URL; platform picks healthy instance

---

### Q42 [Hard] — Mesh Data Plane Discovery


**Select all that apply.**

How does service mesh hide discovery from application code?

- [ ] A. App calls localhost sidecar; sidecar has endpoint list from control plane
- [ ] B. Apps must import Eureka SDK for every outbound call
- [ ] C. Discovery and mTLS handled in data plane without app changes
- [ ] D. Istio/Envoy pushes routes and endpoints to proxies

---

### Q43 [Medium] [Case Study] — CloudMart Pod Restart Loop


**Context:** CloudMart liveness probe hits /health/ready which checks PostgreSQL. DB blip causes all pods killed and restarted — worse outage.

**Select all that apply.**

Which health check design fixes this?

- [ ] A. Deep DB check on readiness, not liveness — avoid restart storm
- [ ] B. Liveness lightweight — process up; readiness checks DB for traffic routing
- [ ] C. Readiness failure removes pod from LB without killing container
- [ ] D. Same heavy check for liveness and readiness is safest

---

### Q44 [Medium] — Shallow vs Deep Health


**Select all that apply.**

Which health check distinctions are correct?

- [ ] A. Shallow check alone catches broken database connections
- [ ] B. Deep readiness checks critical dependencies (DB, Redis)
- [ ] C. Shallow GET /health — process and HTTP server up
- [ ] D. Gateway upstream health polls remove failed instances from pool

---

### Q45 [Medium] [Case Study] — CloudMart Deploy Connection Drops


**Context:** During CloudMart deploy, SIGKILL stops pods mid-request. Users see 502 and duplicate charges on retry.

**Select all that apply.**

Which graceful shutdown steps apply?

- [ ] A. Immediate SIGKILL is best for fastest deploy velocity
- [ ] B. Align grace period with max request duration
- [ ] C. Finish in-flight requests within terminationGracePeriodSeconds
- [ ] D. Mark readiness failing — LB stops new traffic to draining pod

---

### Q46 [Hard] — Health Check Cascading Failure


**Select all that apply.**

Database slow causes all apps to fail deep readiness and LB removes entire fleet. Which mitigations apply?

- [ ] A. Readiness checks only truly critical deps; degraded mode for optional features
- [ ] B. Feature flags disable DB-heavy paths while core stays ready
- [ ] C. Fail deep readiness on any slow dependency always — safest
- [ ] D. Circuit breaker on DB before readiness fails entirely

---

### Q47 [Medium] [Case Study] — CloudMart Mesh Adoption Debate


**Context:** CloudMart has 35 microservices. Platform team proposes Istio day one for a 3-service MVP migration.

**Select all that apply.**

When is a full service mesh justified?

- [ ] A. Start with gateway + K8s DNS + observability before mesh complexity
- [ ] B. Small team on early MVP — mesh ops overhead may outweigh benefits
- [ ] C. Many services needing mTLS, retries, and traffic policy without library sprawl
- [ ] D. Mesh required on day one for any Kubernetes deployment

---

### Q48 [Medium] [Case Study] — CloudMart Traffic Directions


**Context:** CloudMart uses Kong for mobile API and Istio between internal services.

**Select all that apply.**

Which north-south vs east-west split is correct?

- [ ] A. North-south: external client → API gateway into cluster
- [ ] B. Service mesh replaces all need for public API gateway
- [ ] C. East-west: service-to-service inside cluster — mesh handles mTLS and retries
- [ ] D. Gateway for JWT and external rate limits; mesh for internal hop policy

---

### Q49 [Hard] — Gateway vs Mesh Capabilities


**Select all that apply.**

Which capability split between API gateway and service mesh is accurate?

- [ ] A. Mesh: mTLS, internal retries, east-west observability
- [ ] B. Both can coexist — complementary scopes
- [ ] C. Mesh is the right place for partner API key validation on internet traffic
- [ ] D. Gateway: public entry, JWT validation, external rate limits

---

### Q50 [Hard] [Case Study] — CloudMart Order Placement Flow


**Context:** User POSTs /v1/orders on CloudMart. Flow: Cloud LB → Kong (JWT, rate limit) → order-service via discovery → gRPC catalog check → Kafka order.created → 201 to client. Payment runs async.

**Select all that apply.**

Which statements about this architecture are correct?

- [ ] A. Synchronous path must include 8-minute payment processor in HTTP request
- [ ] B. Catalog gRPC timeout/circuit breaker prevents hung checkout thread
- [ ] C. Gateway validates auth and routes before discovery picks order instance
- [ ] D. User gets 201 before async payment completes — hybrid sync/async
