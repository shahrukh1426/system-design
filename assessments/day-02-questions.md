# Design Disciplines — MCQ Questions (28)

Multi-select format: each question has **two or more** correct answers. Questions tagged **[Case Study]** include a business context block.

> **Answers and explanations:** see [answer-key/day-02-answers.md](./answer-key/day-02-answers.md)


---

### Q01 [Easy] — Architecture Review Lenses



**Select all that apply.**

You are staffing an architecture review for a new payments platform. Which specialized design disciplines should the review cover?

- [ ] A. Compiler design — optimizing bytecode
- [ ] B. Refactor design — evolving existing systems safely
- [ ] C. Observability design — logs, metrics, traces
- [ ] D. Capacity design — sizing infrastructure

---

### Q02 [Easy] — Classifying Non-Functional Concerns



**Select all that apply.**

During a design doc review, which disciplines address **how well** the system behaves rather than its structural shape?

- [ ] A. Scalability design
- [ ] B. Performance design
- [ ] C. Security design
- [ ] D. High-level design (HLD)

---

### Q03 [Easy] — What Belongs in an HLD Doc



**Select all that apply.**

You are drafting the HLD for a food-delivery platform. Which elements belong in this document?

- [ ] A. Data flows for key user journeys
- [ ] B. Third-party dependencies (payment gateway, SMS provider)
- [ ] C. Major services and their responsibilities
- [ ] D. Exact B-tree index definitions on each table

---

### Q04 [Easy] — What Belongs in an LLD Doc



**Select all that apply.**

You are detailing the Order Service before implementation. Which artifacts belong in the LLD?

- [ ] A. State machine for order status transitions
- [ ] B. Database schema with indexes
- [ ] C. Class or module structure
- [ ] D. Exact production server instance counts

---

### Q05 [Easy] — Sizing a New API



**Select all that apply.**

You estimate capacity for an API with 1M DAU, 50 requests/user/day, and a 3× peak-to-average ratio. Which outputs should your capacity worksheet include?

- [ ] A. Choosing microservice boundaries by domain
- [ ] B. Peak bandwidth from QPS × average response size
- [ ] C. Storage growth with index and replica overhead
- [ ] D. Peak QPS (design for peak, not average)

---

### Q06 [Easy] — Horizontal vs Vertical Scaling



**Select all that apply.**

Your database server is at 90% CPU. Which are advantages of **horizontal** scaling (adding more machines)?

- [ ] A. Theoretically unlimited scale-out
- [ ] B. Often more cost-effective at very large scale
- [ ] C. No application changes ever required
- [ ] D. Fault tolerance — one node fails, others continue

---

### Q07 [Easy] — Reliability Metrics in an SLA Discussion



**Select all that apply.**

Legal asks you to define disaster-recovery targets for a billing system. Which metrics should you be ready to explain?

- [ ] A. RTO — maximum acceptable time to restore service
- [ ] B. QPS — queries per second
- [ ] C. RPO — maximum acceptable data loss window
- [ ] D. MTTR — mean time to recover from failure

---

### Q08 [Easy] — Security Design Basics



**Select all that apply.**

You are threat-modeling a customer-facing REST API. Which security pillars must the design address?

- [ ] A. Authentication — verifying user identity
- [ ] B. Data protection — encryption in transit and at rest
- [ ] C. Authorization — controlling what authenticated users can do
- [ ] D. Eliminating all third-party integrations

---

### Q09 [Easy] — Picking a Database Type



**Select all that apply.**

You are designing an inventory system where stock levels must be ACID-accurate and orders join across products and warehouses. Which storage leanings are appropriate?

- [ ] A. Complex queries with joins
- [ ] B. Strong data integrity requirements
- [ ] C. Wide-column NoSQL for schema-free documents only
- [ ] D. Relational SQL with transactions

---

### Q10 [Medium] [Case Study] — Greenfield Launch Checklist



**Context:** NovaCart is six weeks from public launch. The team has HLD diagrams but no capacity numbers, no on-call runbooks, and auth is "TODO." Expected launch traffic is 50K DAU growing to 500K within a year.

**Select all that apply.**

Which design disciplines should be **prioritized before launch**?

- [ ] A. Observability — metrics, alerts, dashboards
- [ ] B. Refactor — extract microservices from a monolith not yet in production
- [ ] C. Capacity — back-of-envelope QPS and storage
- [ ] D. Security — auth, encryption, threat model

---

### Q11 [Medium] — Sync vs Async in an Order Flow



**Select all that apply.**

You are mapping the "Place Order" journey: validate cart, charge card, send confirmation email. Which communication choices are appropriate?

- [ ] A. Webhook from payment provider when charge settles later
- [ ] B. Synchronous REST call to Payment Service — caller needs immediate pass/fail
- [ ] C. Async queue for confirmation email — delay is acceptable
- [ ] D. Synchronous email send inside the checkout request — user waits for SMTP

---

### Q12 [Medium] — LLD Review for Order Service



**Select all that apply.**

A junior engineer's Order Service design puts all logic in the controller and skips idempotency on `POST /orders`. Which fixes should the review require?

- [ ] A. Move business rules to a service layer
- [ ] B. Use repository pattern to isolate data access
- [ ] C. Add idempotency keys for retriable order creation
- [ ] D. Add a god class that handles HTTP, SQL, and payments together

---

### Q13 [Medium] [Case Study] — ReadStorm API Connection Exhaustion



**Context:** CatalogAPI serves 3,000 read QPS with a 15:1 read:write ratio. PostgreSQL logs show "too many connections" during peaks. p95 latency is 900ms. No cache layer exists. The team wants relief without sharding yet.

**Select all that apply.**

Which scalability techniques should the team apply **first**?

- [ ] A. Connection pooling (e.g., PgBouncer)
- [ ] B. Redis cache for hot product queries
- [ ] C. Immediate horizontal sharding of all tables
- [ ] D. Read replicas for read traffic

---

### Q14 [Medium] — Growth Roadmap for a Successful MVP



**Select all that apply.**

Your MVP runs on one app server and one database. Traffic doubles every quarter. Which scaling stages appear in a sensible progression?

- [ ] A. Separate DB and add cache before read replicas
- [ ] B. Microservices per domain only after clear domain pain
- [ ] C. Multi-region deployment as the first scaling step
- [ ] D. Read replicas and CDN as read load grows

---

### Q15 [Medium] [Case Study] — Payment Provider Outage at Checkout



**Context:** During peak checkout, Stripe timeouts spike. Order Service retries aggressively; thread pools exhaust; unrelated catalog APIs slow down. Circuit breaker is not implemented. Product wants checkout to degrade gracefully.

**Select all that apply.**

Which reliability patterns should be in the checkout design?

- [ ] A. Remove all timeouts so calls eventually succeed
- [ ] B. Circuit breaker on Payment Service calls
- [ ] C. Exponential backoff with jitter on retries
- [ ] D. Graceful degradation — queue orders as PENDING when payment is down

---

### Q16 [Medium] [Case Study] — STRIDE Review of a User API



**Context:** A security review finds that `GET /api/users/{id}` returns other users' email addresses when the ID is incremented. JWTs are long-lived with no revocation. Passwords were stored in plaintext in a legacy table.

**Select all that apply.**

Which STRIDE categories and mitigations match these findings?

- [ ] A. Information disclosure — enforce authorization checks per resource
- [ ] B. Spoofing — stolen long-lived JWT; shorten expiry and support revocation
- [ ] C. Tampering — use parameterized queries and input validation
- [ ] D. Repudiation — users deny actions; add audit logging for sensitive operations

---

### Q17 [Medium] [Case Study] — Feed vs Ledger Consistency



**Context:** Your team runs a social feed (stale posts OK for 30s) and a wallet balance service (must never show wrong money). Both are distributed across regions.

**Select all that apply.**

Which consistency choices fit each system?

- [ ] A. Social feed — favor availability (AP) with eventual consistency
- [ ] B. Wallet — eventual consistency is always acceptable
- [ ] C. Most consumer web features tolerate brief staleness on non-financial reads
- [ ] D. Wallet service — favor consistency (CP) over availability during partition

---

### Q18 [Medium] — Public REST API Standards



**Select all that apply.**

You are publishing `/v1/users` for external partners. Which API design practices should you enforce?

- [ ] A. Resource URLs with nouns (`GET /users/123`)
- [ ] B. Verb-based URLs (`POST /getUserById`)
- [ ] C. Idempotency keys on POST that create resources
- [ ] D. Pagination on all list endpoints

---

### Q19 [Medium] — Performance Tuning Priority



**Select all that apply.**

Search p99 latency is 2s. The team wants to optimize. Which approaches follow the highest-impact-first hierarchy?

- [ ] A. Paginate and trim response payloads
- [ ] B. Add Redis cache for popular queries before rewriting algorithms
- [ ] C. Buy faster CPUs before measuring where time is spent
- [ ] D. Move heavy ranking work to async background jobs

---

### Q20 [Hard] — Cache Pattern Selection



**Select all that apply.**

Match each business need to an appropriate cache pattern.

- [ ] A. Write-heavy analytics counters — write-behind (write-back)
- [ ] B. Session store that must stay in sync with DB — write-through
- [ ] C. Product catalog reads — cache-aside with TTL
- [ ] D. App reads only through cache layer — read-through

---

### Q21 [Hard] [Case Study] — On-Call Alert Noise at 3 AM



**Context:** On-call gets paged when any single CPU core hits 55%. Logs are plain text with no request IDs. When checkout fails, engineers cannot trace a user request across Order, Payment, and Notification services.

**Select all that apply.**

Which observability improvements address these gaps?

- [ ] A. Distributed tracing across service boundaries
- [ ] B. Alert on CPU > 55% on any core — keep sensitivity high
- [ ] C. RED metrics (rate, errors, duration) per service
- [ ] D. Structured JSON logs with request_id on every line

---

### Q22 [Hard] — SLO Error Budget Before a Risky Release



**Select all that apply.**

Your team defines: SLI = % of API requests completing under 300ms; SLO = 99% monthly. You have 43 minutes of error budget left this month. A risky caching refactor is ready to ship. Which statements about SLIs, SLOs, and error budgets are correct?

- [ ] A. SLI is what you measure; SLO is the internal target
- [ ] B. Error budget means you can ignore reliability until next month
- [ ] C. Remaining error budget suggests caution before shipping risky changes
- [ ] D. SLA is a contractual commitment to customers — stricter than internal SLO

---

### Q23 [Hard] [Case Study] — Extracting Payment from a Monolith



**Context:** ShopHub's monolith deploy takes 2 hours and breaks billing when unrelated teams merge. Payment code changes weekly; catalog code monthly. Leadership approved incremental extraction — no big-bang rewrite.

**Select all that apply.**

Which refactor strategies fit ShopHub's constraints?

- [ ] A. Feature flags to roll back payment flow without redeploy
- [ ] B. Dual-write to old and new payment stores during migration
- [ ] C. Strangler fig — route payment traffic to a new service via API gateway
- [ ] D. Big-bang rewrite of the entire monolith over one weekend

---

### Q24 [Hard] — SLA Negotiation: The Nines



**Select all that apply.**

Your customer contract requires **99.9%** availability. Which downtime budgets align with that commitment?

- [ ] A. About 8.76 hours downtime per year
- [ ] B. Each additional nine is roughly 10× harder to achieve
- [ ] C. About 43.8 minutes downtime per month
- [ ] D. You should always commit to five nines regardless of business need

---

### Q25 [Hard] — Scalability Anti-Patterns in Production



**Select all that apply.**

A team scaled from 4 to 40 app servers but latency worsened. Sessions are stored in server memory. They sharded the database before adding any cache. Which anti-patterns explain the outcome?

- [ ] A. Scaling before measuring — wrong bottleneck targeted
- [ ] B. No cache strategy — database still overwhelmed on reads
- [ ] C. Sharding before caching — added complexity without fixing hot reads
- [ ] D. Stateful app servers — cannot distribute load evenly

---

### Q26 [Hard] — Data Pipeline Architecture Choices



**Select all that apply.**

A analytics team needs nightly warehouse loads and real-time search index updates from the operational database. Which data flow patterns apply?

- [ ] A. ETL batch jobs to the data warehouse
- [ ] B. CQRS with separate read models for heavy dashboards
- [ ] C. Event sourcing for audit trails in financial modules
- [ ] D. CDC streaming changes to Kafka for search indexing

---

### Q27 [Hard] — Capacity vs Scalability Planning



**Select all that apply.**

Your platform team is planning next year's infrastructure budget and a three-year growth path. Which division of responsibility is correct?

- [ ] A. Scalability design — how the architecture **grows** when load increases
- [ ] B. They are the same discipline — only one plan is needed
- [ ] C. Capacity design — how much infrastructure is needed **now** for peak load
- [ ] D. Capacity sizes the starting point; scalability plans the evolution

---

### Q28 [Hard] [Case Study] — Input Validation Gaps on a Public Form



**Context:** A public contact form was exploited via SQL injection. Another endpoint reflects user input in HTML without encoding, triggering XSS in admin browsers. CSRF protection is missing on state-changing POSTs.

**Select all that apply.**

Which threat-prevention pairings should be implemented?

- [ ] A. SQL injection — parameterized queries or ORM, never string-concat SQL
- [ ] B. CSRF — anti-CSRF tokens and SameSite cookie attributes
- [ ] C. XSS — output encoding and Content-Security-Policy headers
- [ ] D. Path traversal — pass raw user input to shell commands for flexibility
