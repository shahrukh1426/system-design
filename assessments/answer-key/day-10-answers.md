# API Gateway & Service Discovery — Answer Key & Explanations (50)

Answer key for [day-10-questions.md](../day-10-questions.md)

---

### Q01 [Easy] [Case Study] — CloudMart Deploy Bottleneck

**Answer:** B, C, D

**Explanation:** Deploy pain and scale mismatch are split signals. Early MVP small team should often stay modular monolith (A).

---

### Q02 [Easy] — Monolith Advantages

**Answer:** A, C, D

**Explanation:** Monoliths excel at simplicity and cross-module transactions. Per-service deploy is microservices (B).

---

### Q03 [Easy] [Case Study] — CloudMart MVP Team Size

**Answer:** A, B, C

**Explanation:** Early stage favors monolith/modular monolith. Separate repos day one is premature (D).

---

### Q04 [Easy] — Microservices Trade-offs

**Answer:** B, C, D

**Explanation:** Microservices need gateway, discovery, observability — not eliminate them (A).

---

### Q05 [Easy] — Modular Monolith

**Answer:** B, C, D

**Explanation:** Modular monolith is one deployable with boundaries — not separate clusters (A).

---

### Q06 [Easy] [Case Study] — CloudMart Internal RPC Choice

**Answer:** A, B, D

**Explanation:** Typical stack: REST public, gRPC internal, queues async. GraphQL everywhere internal is overkill (C).

---

### Q07 [Easy] — Sync vs Async Between Services

**Answer:** A, B, C

**Explanation:** User-visible payment decision needs sync path. Async for reactions (C wrong for async-only).

---

### Q08 [Easy] [Case Study] — CloudMart Mobile Data Needs

**Answer:** B, C, D

**Explanation:** GraphQL/BFF at edge for clients. N+1 still needs server design (A).

---

### Q09 [Medium] [Case Study] — CloudMart Internal Service Trust

**Answer:** B, C, D

**Explanation:** Authenticate every hop. VPC is not sufficient (A).

---

### Q10 [Medium] — gRPC Production Considerations

**Answer:** A, B, D

**Explanation:** gRPC is not browser-native (C). Needs HTTP/2-aware LB and Day 9 reliability patterns.

---

### Q11 [Easy] [Case Study] — CloudMart Client URL Sprawl

**Answer:** A, B, C

**Explanation:** Gateway is single front door. Direct port exposure worsens client sprawl (D).

---

### Q12 [Easy] — API Gateway vs Load Balancer

**Answer:** A, C, D

**Explanation:** Auth/rate limits are gateway strengths, not typical LB (C reversed).

---

### Q13 [Easy] — Gateway Cross-Cutting Concerns

**Answer:** A, B, D

**Explanation:** Fine-grained resource auth stays in services (C). Gateway does coarse edge auth.

---

### Q14 [Medium] [Case Study] — CloudMart Mobile vs Web APIs

**Answer:** B, C, D

**Explanation:** Gateway still front door; BFF tailors per UI. BFF alone without gateway loses central edge policy (A).

---

### Q15 [Medium] [Case Study] — CloudMart Gateway Routing Table

**Answer:** A, B, C

**Explanation:** Gateway routes and versions — not business logic or DB (D).

---

### Q16 [Medium] — TLS at the Gateway

**Answer:** A, B, D

**Explanation:** Internal HTTP on private VPC is common; mTLS optional upgrade (C overstates).

---

### Q17 [Medium] — Request Transformation

**Answer:** A, C, D

**Explanation:** Gateway should not hold session state (B) — use Redis/JWT.

---

### Q18 [Medium] [Case Study] — CloudMart Dashboard Aggregation

**Answer:** A, C, D

**Explanation:** Aggregation at gateway/BFF is standard. Forcing three public calls defeats gateway purpose (B).

---

### Q19 [Medium] — Gateway Anti-Patterns

**Answer:** A, B, C

**Explanation:** Routing/auth/rate limits are core gateway jobs (C is wrong as anti-pattern).

---

### Q20 [Medium] [Case Study] — CloudMart Path Routing Incident

**Answer:** A, B, D

**Explanation:** Deliberate path→service mapping required. Random routing is wrong (C).

---

### Q21 [Medium] — Header-Based Routing

**Answer:** A, C, D

**Explanation:** Header routing for canary/tenant/version — not auth replacement (B).

---

### Q22 [Medium] [Case Study] — CloudMart Canary Release

**Answer:** A, C, D

**Explanation:** Canary/blue-green hide version routing from clients (C false).

---

### Q23 [Hard] — gRPC Load Balancing

**Answer:** A, B, C

**Explanation:** gRPC uses HTTP/2 on TCP (C wrong). Connection pinning causes hot spots.

---

### Q24 [Medium] — Sticky Sessions at Gateway

**Answer:** B, C, D

**Explanation:** Prefer external session store or JWT. Sticky is required for legacy in-memory sessions (A), not a reason to avoid stickiness.

---

### Q25 [Medium] [Case Study] — CloudMart JWT at Edge

**Answer:** B, C, D

**Explanation:** Never trust client identity headers or IP alone (A).

---

### Q26 [Medium] — API Keys for Partners

**Answer:** A, B, D

**Explanation:** Secrets belong in Vault/Secrets Manager (C).

---

### Q27 [Medium] [Case Study] — CloudMart Admin Route Exposure

**Answer:** A, B, C

**Explanation:** Resource ownership checks belong in services (C wrong at gateway only).

---

### Q28 [Hard] — OAuth and Token Lifecycle

**Answer:** A, C, D

**Explanation:** Long-lived access tokens are risky (B). Short + refresh is standard.

---

### Q29 [Medium] — mTLS Gateway to Service

**Answer:** A, B, D

**Explanation:** mTLS is service identity; user auth still at gateway (C).

---

### Q30 [Medium] [Case Study] — CloudMart Scraping Attack

**Answer:** A, B, D

**Explanation:** Edge rate limit protects whole platform. Backend-only limit is too late (C).

---

### Q31 [Easy] [Case Study] — CloudMart Login Brute Force

**Answer:** A, B, C

**Explanation:** Fixed window allows 2× burst at boundary (C false).

---

### Q32 [Medium] — Rate Limit Response Headers

**Answer:** A, C, D

**Explanation:** Silent 200 hides limit state (B). Standard is 429 + headers.

---

### Q33 [Hard] — Distributed Rate Limiting

**Answer:** B, C, D

**Explanation:** Without shared store, limits multiply by replica count (B describes the bug).

---

### Q34 [Easy] [Case Study] — CloudMart Hardcoded Upstream IPs

**Answer:** B, C, D

**Explanation:** Containers change IPs — discovery required (C is fragile fiction).

---

### Q35 [Easy] — Service Registry Concepts

**Answer:** B, C, D

**Explanation:** Autoscaled environments need dynamic registry (D wrong).

---

### Q36 [Medium] [Case Study] — CloudMart Kubernetes Service DNS

**Answer:** A, B, D

**Explanation:** K8s endpoints update on pod changes — not stale forever (C).

---

### Q37 [Medium] — DNS-Based Discovery Trade-offs

**Answer:** A, B, D

**Explanation:** DNS has TTL/propagation trade-offs (D false).

---

### Q38 [Medium] — Health-Aware Registry

**Answer:** A, C, D

**Explanation:** Routing to dead instances causes errors (C wrong).

---

### Q39 [Medium] [Case Study] — CloudMart Polyglot Services

**Answer:** A, B, C

**Explanation:** Server-side K8s DNS suits polyglot clients. Client-side adds per-language coupling (C overstates hop elimination).

---

### Q40 [Medium] — Client-Side Discovery

**Answer:** B, C, D

**Explanation:** Client-side embeds discovery in caller (C false).

---

### Q41 [Medium] [Case Study] — CloudMart Internal Call Pattern

**Answer:** A, C, D

**Explanation:** Server-side = simple client, platform LB. Eureka client is client-side (B).

---

### Q42 [Hard] — Mesh Data Plane Discovery

**Answer:** A, C, D

**Explanation:** Mesh removes SDK need from app (C false).

---

### Q43 [Medium] [Case Study] — CloudMart Pod Restart Loop

**Answer:** A, B, C

**Explanation:** Heavy liveness on deps causes cascading kills (C wrong).

---

### Q44 [Medium] — Shallow vs Deep Health

**Answer:** B, C, D

**Explanation:** Shallow misses DB failure (C false).

---

### Q45 [Medium] [Case Study] — CloudMart Deploy Connection Drops

**Answer:** B, C, D

**Explanation:** Drain before exit prevents mid-request kill (C wrong).

---

### Q46 [Hard] — Health Check Cascading Failure

**Answer:** A, B, D

**Explanation:** Blind deep readiness amplifies outages (C wrong).

---

### Q47 [Medium] [Case Study] — CloudMart Mesh Adoption Debate

**Answer:** A, B, C

**Explanation:** Don't adopt mesh day one (C false). Grow into it.

---

### Q48 [Medium] [Case Study] — CloudMart Traffic Directions

**Answer:** A, C, D

**Explanation:** Mesh does not replace public gateway (B).

---

### Q49 [Hard] — Gateway vs Mesh Capabilities

**Answer:** A, B, D

**Explanation:** Partner/external auth at gateway, not mesh edge (C).

---

### Q50 [Hard] [Case Study] — CloudMart Order Placement Flow

**Answer:** B, C, D

**Explanation:** Payment async after 201; sync path stays fast (C wrong).
