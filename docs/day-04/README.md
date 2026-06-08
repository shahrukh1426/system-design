# Day 4 — What Happens When You Visit a Website?

Day 4 is a **scenario-based walkthrough**. We follow one user action — typing a URL and hitting Enter — through every layer of the internet stack until the page appears on screen.

## Scenario

> **Alice opens her browser and visits `https://shop.example.com/products`**

We trace that single action step by step, from her keyboard to pixels on the screen.

## The Journey

| Step | Component | What Happens |
|------|-----------|--------------|
| 1 | [User](./01-visit-website-scenario.md#step-1--user) | Types a URL and submits |
| 2 | [Browser](./01-visit-website-scenario.md#step-2--browser) | Parses URL, checks cache |
| 3 | [DNS Lookup](./01-visit-website-scenario.md#step-3--dns-lookup) | Resolves domain to IP |
| 4 | [IP Address](./01-visit-website-scenario.md#step-4--ip-address) | Target server location found |
| 5 | [TCP Connection](./01-visit-website-scenario.md#step-5--tcp-connection) | Reliable connection established |
| 6 | [HTTPS Request](./01-visit-website-scenario.md#step-6--https-request) | Encrypted HTTP request sent |
| 7 | [Load Balancer](./01-visit-website-scenario.md#step-7--load-balancer) | Traffic routed to healthy server |
| 8 | [Web Server](./01-visit-website-scenario.md#step-8--web-server) | Request handled or forwarded |
| 9 | [Backend / Databases](./01-visit-website-scenario.md#step-9--backend-services--databases) | Business logic and data fetch |
| 10 | [Response Generated](./01-visit-website-scenario.md#step-10--response-generated) | HTML assembled and sent back |
| 11 | [Browser Render](./01-visit-website-scenario.md#step-11--browser-render) | Page built and displayed |

## Document

| # | Topic | File |
|---|-------|------|
| 1 | [Full Scenario Walkthrough](./01-visit-website-scenario.md) | End-to-end story with diagrams |

## Reading Order

Read the single document top to bottom — it's written as one continuous scenario. Takes ~20 minutes.

## Key Takeaways

- Visiting a website is a **chain of steps** across networks, servers, and the browser — not one magic request.
- **DNS** and **TCP/TLS** happen before your app code ever runs.
- The **load balancer** and **web server** sit in front of your backend — users never talk to databases directly.
- The browser does more work **after** the first response — fetching assets, parsing, rendering.

## Related

- [Day 1: What Is System Design](../day-01/02-what-is-system-design.md)
- [Day 2: HLD](../day-02/02-hld.md)
- [Day 2: Performance Design](../day-02/10-performance-design.md)
- [Day 2: Security Design](../day-02/07-security-design.md)
