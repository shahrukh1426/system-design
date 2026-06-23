# System Design MCQ Bank — Days 1–9 Topics

240 **multi-select** practice questions (select all that apply). Each question has **two or more** correct answers.

Questions are **real-world**, **scenario-based**, and include **106 case studies** with a business context block. No course-meta framing ("according to the curriculum", "Day 3", etc.).

Validated: [validation-report.md](./validation-report.md)

**Answers and explanations** are in a separate folder: [answer-key/](./answer-key/) — question files contain stems and options only.

---

## Question Types

| Type | Count | How to recognize |
|------|-------|------------------|
| **Case study** | 106 | Title includes `[Case Study]` + `**Context:**` block (company, metrics, incident) |
| **Scenario** | ~74 | 1–2 sentence situational stem |
| **Technical** | ~60 | Direct engineering question in production context |

---

## Folder layout

```
assessments/
├── day-01-questions.md … day-09-questions.md   ← questions only
├── answer-key/
│   ├── README.md
│   └── day-01-answers.md … day-09-answers.md   ← answers + explanations
├── README.md
└── validation-report.md
```

---

| File | Topic | Questions | Case studies | Easy | Medium | Hard |
|------|-------|-----------|--------------|------|--------|------|
| [day-01-questions.md](./day-01-questions.md) → [answers](./answer-key/day-01-answers.md) | Foundations & URL Shortener | 18 | 7 | 6 | 6 | 6 |
| [day-02-questions.md](./day-02-questions.md) → [answers](./answer-key/day-02-answers.md) | Design Disciplines | 28 | 8 | 9 | 10 | 9 |
| [day-03-questions.md](./day-03-questions.md) → [answers](./answer-key/day-03-answers.md) | Parking Lot (LLD) | 10 | 5 | 3 | 4 | 3 |
| [day-04-questions.md](./day-04-questions.md) → [answers](./answer-key/day-04-answers.md) | Website Request Lifecycle | 14 | 5 | 5 | 5 | 4 |
| [day-05-questions.md](./day-05-questions.md) → [answers](./answer-key/day-05-answers.md) | Infrastructure Components | 30 | 15 | 10 | 10 | 10 |
| [day-06-questions.md](./day-06-questions.md) → [answers](./answer-key/day-06-answers.md) | Database Internals | 50 | 23 | 15 | 20 | 15 |
| [day-07-questions.md](./day-07-questions.md) → [answers](./answer-key/day-07-answers.md) | Caching Deep Dive | 30 | 14 | 9 | 13 | 8 |
| [day-08-questions.md](./day-08-questions.md) → [answers](./answer-key/day-08-answers.md) | Message Queues Deep Dive | 30 | 14 | 9 | 13 | 8 |
| [day-09-questions.md](./day-09-questions.md) → [answers](./answer-key/day-09-answers.md) | Reliability & Fault Tolerance | 30 | 15 | 9 | 13 | 8 |
| **Total** | | **240** | **106** | **75** | **94** | **71** |

---

## Recurring Case Study Companies

Several questions reuse fictional companies so you can follow a narrative arc:

| Company | Files | Themes |
|---------|-------|--------|
| **LinkShare** | day-01 | URL shortener capacity, redirect latency, scaling |
| **ShopExample** | day-04 | End-to-end page load, outages, rendering |
| **MetroGarage** | day-03 | Parking MVP, bugs, phase-2 extensions |
| **RetailHub** | day-05, day-07 | Black Friday LB/CDN, cache stampede, invalidation |
| **LedgerFlow** | day-06 | Indexes, transactions, replication, sharding |
| **EventPipe** | day-08 | Video pipeline, partitions, DLQ, outbox |
| **UptimeCorp** | day-09 | Circuit breaker, SLO burn, failover, game days |

---

## Recommended Study Order

### By topic (follows docs/day-01 → day-09)

1. [Foundations & URL Shortener](./day-01-questions.md)
2. [Design Disciplines](./day-02-questions.md)
3. [Parking Lot LLD](./day-03-questions.md)
4. [Website Request Lifecycle](./day-04-questions.md)
5. [Infrastructure Components](./day-05-questions.md)
6. [Database Internals](./day-06-questions.md)
7. [Caching Deep Dive](./day-07-questions.md)
8. [Message Queues Deep Dive](./day-08-questions.md)
9. [Reliability & Fault Tolerance](./day-09-questions.md)

### By difficulty

1. All `[Easy]` questions across files  
2. All `[Medium]` questions  
3. All `[Hard]` and `[Case Study]` questions  

### Exam cram (high yield)

- [Website Request Lifecycle](./day-04-questions.md) — full HTTP path  
- [Infrastructure Components](./day-05-questions.md) — DNS, LB, cache, queue  
- [Database Internals](./day-06-questions.md) — indexes, transactions, N+1, sharding  
- [Caching Deep Dive](./day-07-questions.md) — patterns, invalidation, stampede  
- [Reliability & Fault Tolerance](./day-09-questions.md) — timeouts, breaker, SLO  

---

## Topic Quick Lookup

| Topic | File | Example Q IDs |
|-------|------|---------------|
| NFRs, design process | day-01 | Q03, Q05 |
| URL shortener arc | day-01 | Q12–Q16 |
| HLD, capacity, security | day-02 | Q03–Q06, Q16 |
| Parking lot LLD | day-03 | Q01–Q08 |
| Browser → DNS → render | day-04 | Q01, Q06, Q11 |
| DNS, LB, CDN, queues | day-05 | Q01–Q09, Q20–Q25 |
| Storage, indexes, ACID | day-06 | Q01, Q04, Q09, Q23, Q34, Q42 |
| ORM N+1, pooling, replication | day-06 | Q11, Q13, Q15, Q39, Q47 |
| Sharding, sagas | day-06 | Q17, Q20, Q30, Q49 |
| MVCC, vacuum, pagination | day-06 | Q31, Q35, Q43 |
| Cache-aside, write-through | day-07 | Q07–Q09, Q21 |
| Stampede, penetration, avalanche | day-07 | Q13–Q15 |
| Queue vs pub/sub vs stream | day-08 | Q04, Q05 |
| Delivery guarantees, idempotency | day-08 | Q09, Q10, Q26 |
| Outbox, saga, CDC | day-08 | Q17, Q18, Q28 |
| Timeouts, retries, circuit breaker | day-09 | Q09, Q11, Q13 |
| Bulkhead, degradation, DR | day-09 | Q15, Q17, Q19 |
| SLI/SLO, chaos, game days | day-09 | Q21, Q25, Q30 |

---

## How to Practice

1. Open a **questions** file (e.g. [day-06-questions.md](./day-06-questions.md)). Read each question and **Context** block for case studies.
2. Select **all** options you believe are correct. Write down your answers.
3. Check the matching file in [answer-key/](./answer-key/) (e.g. [day-06-answers.md](./answer-key/day-06-answers.md)).
4. Read **Explanation** for any missed questions; review `docs/day-XX/` for that topic.

---

## Source Material

Questions are grounded in topics from:

- [docs/day-01/](../docs/day-01/) through [docs/day-09/](../docs/day-09/)

Lesson links are not embedded in questions — use the docs index when you need to reread a topic.
