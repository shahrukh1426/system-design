# Validation Report — Days 1–10 MCQ Bank

**Last validation:** 2026-06-27  
**Questions reviewed:** 350  
**Answer keys reviewed:** 350  
**Location:** [assessments/](./) — questions in root; answers in [answer-key/](./answer-key/)

---

## Summary

| Check | Result | Details |
|-------|--------|---------|
| Question count | **PASS** | 100 (Days 1–5) + 250 (Days 6–10) = **350** |
| Answer key count | **PASS** | 350 entries — 1:1 with questions |
| Q ↔ A ID/title/difficulty match | **PASS** | All Q01–Qxx align across 10 files |
| Answer letters valid | **PASS** | Every letter exists in that question's options |
| Multi-select rule (≥2 correct) | **PASS** | 350/350 have 2–4 correct options |
| Explanations present | **PASS** | 350/350 answer-key entries include **Explanation** |
| Answers separated from questions | **PASS** | 0 `**Answer:**` / `**Explanation:**` in question files |
| Answer-key links in question files | **PASS** | All 10 question files link to matching answer-key file |
| Banned meta phrases | **PASS** | 0 matches (curriculum, Day N, Source:, listed in, etc.) |
| Case studies | **PASS** | 160 tagged `[Case Study]` with **Context** blocks |
| Days 6–10 per-file count | **PASS** | 50 / 50 / 50 / 50 / 50 |
| Duplicate stems | **PASS** | 0 duplicate `**Select all that apply.**` in new files |
| Option order shuffled | **PASS** | 2026-06-27 — `scripts/shuffle-options.js` (deterministic per-question seed) |

**Overall status: PASS — ready for exam practice**

---

## Per-File Breakdown

| Questions | Answer key | Count | Case studies | Easy | Medium | Hard |
|-----------|------------|-------|--------------|------|--------|------|
| [day-01-questions.md](./day-01-questions.md) | [answer-key/day-01-answers.md](./answer-key/day-01-answers.md) | 18 | 7 | 6 | 6 | 6 |
| [day-02-questions.md](./day-02-questions.md) | [answer-key/day-02-answers.md](./answer-key/day-02-answers.md) | 28 | 8 | 9 | 10 | 9 |
| [day-03-questions.md](./day-03-questions.md) | [answer-key/day-03-answers.md](./answer-key/day-03-answers.md) | 10 | 5 | 3 | 4 | 3 |
| [day-04-questions.md](./day-04-questions.md) | [answer-key/day-04-answers.md](./answer-key/day-04-answers.md) | 14 | 5 | 5 | 5 | 4 |
| [day-05-questions.md](./day-05-questions.md) | [answer-key/day-05-answers.md](./answer-key/day-05-answers.md) | 30 | 15 | 10 | 10 | 10 |
| [day-06-questions.md](./day-06-questions.md) | [answer-key/day-06-answers.md](./answer-key/day-06-answers.md) | 50 | 23 | 15 | 20 | 15 |
| [day-07-questions.md](./day-07-questions.md) | [answer-key/day-07-answers.md](./answer-key/day-07-answers.md) | 50 | 24 | 15 | 21 | 14 |
| [day-08-questions.md](./day-08-questions.md) | [answer-key/day-08-answers.md](./answer-key/day-08-answers.md) | 50 | 24 | 15 | 21 | 14 |
| [day-09-questions.md](./day-09-questions.md) | [answer-key/day-09-answers.md](./answer-key/day-09-answers.md) | 50 | 25 | 15 | 21 | 14 |
| [day-10-questions.md](./day-10-questions.md) | [answer-key/day-10-answers.md](./answer-key/day-10-answers.md) | 50 | 24 | 14 | 29 | 7 |
| **Total** | | **350** | **160** | **107** | **147** | **96** |

---

## Days 6–9 Generation Notes

| File | Arc company | Themes covered |
|------|-------------|----------------|
| day-06 | **LedgerFlow** | Pages/buffer pool, indexes, ACID, N+1, pooling, replication lag, sharding |
| day-07 | **RetailHub** | Cache-aside, write-through/back, invalidation, stampede, avalanche, Redis HA |
| day-08 | **EventPipe** | Async upload, pub/sub fan-out, at-least-once, partitions, DLQ, outbox, saga |
| day-09 | **UptimeCorp** | Cascading failure, timeouts, retries, circuit breaker, bulkhead, SLO, DR |

Days 6–9 difficulty targets ~10/10/10 per file; actual ~9/13/8 — acceptable spread with emphasis on medium scenario questions.

---

## Topic Coverage Matrix (Days 6–9)

### Database Internals (day-06)

| Topic | Question IDs |
|-------|--------------|
| Storage / WAL / pages | Q01, Q21, Q25, Q34, Q35 |
| Keys / normalization | Q02, Q03, Q26, Q29, Q32 |
| Indexes / planner | Q04, Q07, Q23, Q24, Q42, Q46, Q48, Q50 |
| Joins | Q05, Q06, Q41 |
| Transactions / isolation | Q09, Q10, Q19, Q38, Q44, Q45 |
| ORM / N+1 | Q11, Q12, Q27, Q36 |
| Connection pooling | Q13, Q14, Q39 |
| Replication | Q15, Q16, Q47 |
| Sharding | Q17, Q18, Q28, Q30, Q40, Q49 |
| Sagas / distributed tx | Q20 |
| Analytics / OLTP split | Q22 |
| Pagination / hot rows / idempotency | Q31, Q33, Q37 |
| DDL / migrations | Q43 |

### Caching Deep Dive (day-07)

| Topic | Question IDs |
|-------|--------------|
| Why / what / where | Q01, Q02, Q19 |
| Static / session / keys | Q03, Q05, Q06 |
| Cache-aside | Q07, Q08 |
| Write-through / write-back | Q09, Q10, Q21 |
| Invalidation / TTL | Q11, Q12, Q29 |
| Stampede / penetration / avalanche | Q13, Q14, Q15 |
| Distributed Redis / hot keys | Q16, Q17, Q28 |
| Read-through / refresh-ahead / warming | Q18, Q24, Q25 |
| HTTP cache headers | Q23 |
| Monitoring / circuit breaker | Q27, Q30 |

### Message Queues Deep Dive (day-08)

| Topic | Question IDs |
|-------|--------------|
| Why queues / components | Q01, Q02, Q20, Q27 |
| Sync vs async / hybrid | Q03, Q19 |
| Queue vs pub/sub vs stream | Q04, Q05, Q29 |
| Broker / partitions | Q06, Q11, Q12, Q13 |
| Message design | Q07, Q08 |
| Delivery guarantees / idempotency | Q09, Q10, Q25, Q26 |
| Retry / DLQ / backoff | Q14, Q15, Q16 |
| Outbox / saga / CDC | Q17, Q18, Q28 |
| SQS / Kafka / fan-out | Q21, Q22, Q23, Q24 |
| Delay queues | Q30 |

### Reliability & Fault Tolerance (day-09)

| Topic | Question IDs |
|-------|--------------|
| Why reliability / metrics | Q01, Q02, Q03, Q04, Q27 |
| SPOF / serial dependencies | Q05, Q06 |
| HA / redundancy | Q07, Q08 |
| Timeouts | Q09, Q10 |
| Retries / idempotency | Q11, Q12 |
| Circuit breaker | Q13, Q14 |
| Bulkhead | Q15, Q16 |
| Graceful degradation / load shed | Q17, Q18, Q28 |
| DR / failover / split-brain | Q19, Q20 |
| SLI / SLO / error budget | Q21, Q22 |
| Safe deploy / chaos / game day | Q23, Q25, Q30 |
| Defense in depth | Q24, Q26, Q29 |

### API Gateway & Service Discovery (day-10)

| Topic | Question IDs |
|-------|--------------|
| Monolith vs microservices | Q01–Q05 |
| Service communication (REST, gRPC, GraphQL) | Q06–Q10 |
| Why API gateway / BFF | Q11–Q14 |
| Gateway responsibilities | Q15–Q19 |
| Routing, LB, canary, gRPC LB | Q20–Q24 |
| Auth at gateway | Q25–Q29 |
| Rate limiting | Q30–Q33 |
| Service discovery | Q34–Q38 |
| Client vs server-side discovery | Q39–Q42 |
| Health checks | Q43–Q46 |
| Service mesh | Q47–Q49 |
| End-to-end order flow | Q50 |

---

## Day 10 Generation Notes

| File | Arc company | Themes covered |
|------|-------------|----------------|
| day-10 | **CloudMart** | Gateway routing, JWT/API keys, rate limits, K8s discovery, mesh, north-south |

---

## Prior Fixes (Days 1–5)

| Item | Action |
|------|--------|
| day-02 Q22 | Removed duplicate `**Select all that apply.**` stem |
| day-02 Q25 | Removed duplicate `**Select all that apply.**` stem |

---

## How to Re-run Validation

From `assessments/`:

```bash
node -e "
const fs=require('fs');
const days=['01','02','03','04','05','06','07','08','09','10'];
let n=0, issues=[];
for(const d of days){
  const q=fs.readFileSync('day-'+d+'-questions.md','utf8');
  const a=fs.readFileSync('answer-key/day-'+d+'-answers.md','utf8');
  const qc=(q.match(/^### Q\\d+/gm)||[]).length;
  const ac=(a.match(/^### Q\\d+/gm)||[]).length;
  n+=qc;
  if(qc!==ac) issues.push('count '+d);
  if(/\\*\\*Answer:\\*\\*/.test(q)) issues.push('leak '+d);
}
console.log('Total:',n, issues.length?issues:'PASS');
"
```

1. Confirm 350 questions and 350 answer entries.
2. Confirm no `**Answer:**` in `day-*-questions.md`.
3. Confirm 350 `**Explanation:**` in answer-key files.
4. Spot-check Q/A pairs against `docs/day-XX/` lesson content.

### Shuffle option order (reduce position bias)

```bash
node scripts/shuffle-options.js          # all days
node scripts/shuffle-options.js 07 08 09  # specific days
```

Uses a deterministic seed per question (`day * 1000 + Q number`) so re-runs are reproducible.

**Status: Validated and ready for study.**
