# Website Request Lifecycle — Answer Key & Explanations (14)

Answer key for [day-04-questions.md](../day-04-questions.md)


---

### Q01 [Easy] — Tracing a Shopper's Click

**Answer:** A, C, D

**Explanation:** Network setup (DNS, TCP, TLS), routing (LB, web server, backend), then response and render happen in sequence. Rendering is last, not before DNS (B).

---

### Q02 [Easy] — Browser-Side Caching on Repeat Visits

**Answer:** A, C, D

**Explanation:** Memory, disk, and Service Worker caches live in the browser. Redis runs on application servers, not inside the browser (B).

---

### Q03 [Easy] — DNS Records for a Storefront

**Answer:** A, B, C, D

**Explanation:** A/AAAA map names to IPs; CNAME aliases hosts; TTL controls cache duration. All are part of DNS configuration for a public website.

---

### Q04 [Easy] — Establishing a Secure Connection

**Answer:** A, B, C

**Explanation:** SYN, SYN-ACK, and ACK open the connection. FIN packets close connections — they are not the opening handshake (D).

---

### Q05 [Easy] — TLS Certificate Validation Failures

**Answer:** A, C, D

**Explanation:** Trust chain, domain match, expiry, and revocation status matter for TLS. Hardware specs are irrelevant to certificate validation (B).

---

### Q06 [Medium] [Case Study] — 503 During ShopExample Flash Sale

**Answer:** A, C, D

**Explanation:** LB distributes, health-checks, and may terminate TLS. Database queries run in application services, not the load balancer (B).

---

### Q07 [Medium] [Case Study] — Slow Product Page Backend

**Answer:** A, B, C

**Explanation:** Cache-aside reads Redis first; on miss, populate from DB. Skipping cache entirely overloads the database (D).

---

### Q08 [Medium] — HTTP Response Headers Shoppers Rely On

**Answer:** A, B, C, D

**Explanation:** Content type, compression, caching policy, and secure cookies all influence how the browser handles the response.

---

### Q09 [Medium] — Why the Page Is Not Visible Immediately

**Answer:** A, B, D

**Explanation:** DOM, CSSOM, render tree, layout, and paint are rendering steps. DNS and TLS happen earlier in the network stack (C).

---

### Q10 [Medium] — Render-Blocking Resources

**Answer:** A, C, D

**Explanation:** CSS and sync JS block rendering. Images load progressively — the layout can appear before all images finish (D overstates image blocking).

---

### Q11 [Hard] [Case Study] — Where the Request Spends Time

**Answer:** B, C, D

**Explanation:** DNS, TCP/TLS, and front-door routing precede application logic. The database query runs inside the backend (A).

---

### Q12 [Hard] [Case Study] — ShopExample Outage Triage

**Answer:** A, B, C

**Explanation:** Cert, LB, and DB failures map to warnings, 503, and 500 respectively. DB timeouts do not produce 404 (D).

---

### Q13 [Hard] — Latency Budget for First Meaningful Paint

**Answer:** A, B, C, D

**Explanation:** These ranges reflect realistic per-layer contributions on a first visit; repeat visits are faster due to cached DNS, connections, and assets.

---

### Q14 [Hard] [Case Study] — Engineering Practices in One Page Load

**Answer:** A, B, C, D

**Explanation:** A typical production page load exercises caching at multiple layers, transport security, front-door reliability, and operational telemetry throughout the stack.
