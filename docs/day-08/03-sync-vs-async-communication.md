# Sync vs Async Communication

[← What Is a Message Queue](./02-what-is-a-message-queue.md) | [Day 8 Index](./README.md) | [Next: Queue, Pub/Sub, Streams →](./04-queue-pubsub-and-streams.md)

## Two Ways Services Talk

### Synchronous (Sync)

Caller sends request and **waits** for response.

```
Order Service ──HTTP/gRPC──▶ Payment Service
              ◀── response ──
```

### Asynchronous (Async)

Caller sends message and **continues** without waiting for processing to finish.

```
Order Service ──publish──▶ Queue ──▶ Payment Worker
              (returns immediately)
```

---

## Comparison

| Aspect | Sync | Async (Queue) |
|--------|------|---------------|
| Coupling | Tight — caller waits for callee | Loose — time and availability decoupled |
| Latency to user | Includes all downstream calls | Only includes publish step |
| Failure handling | Immediate error to caller | Retry in background |
| Callee down | Caller fails or times out | Messages queue until consumer up |
| Ordering | Natural request order | Must be designed (partitions, FIFO) |
| Debugging | Single trace | Distributed, harder |
| Consistency | Easier strong consistency | Eventual consistency |

---

## When to Use Sync

| Scenario | Why Sync |
|----------|----------|
| User needs answer now | Search results, login, payment confirmation |
| Operation must fail fast | Insufficient funds — tell user immediately |
| Simple two-service call | Low latency, low complexity |
| Strong consistency required | Read-your-writes in same request |
| Query/response pattern | GET user profile |

```
POST /checkout
  → validate cart (sync)
  → charge card (sync) — user must know pass/fail now
  → return receipt
```

---

## When to Use Async (Queue)

| Scenario | Why Async |
|----------|-----------|
| Side effects not blocking UX | Email, push notification, analytics |
| Slow processing | Video transcode, report generation |
| Spike absorption | 10× traffic — queue buffers |
| Multiple downstream services | One event → many consumers |
| Callee unreliable or slow | Third-party API with rate limits |

```
POST /checkout
  → save order + charge card (sync — critical path)
  → publish order_created (async)
       → email worker
       → warehouse worker
       → analytics worker
  → return receipt
```

---

## Hybrid (Most Real Systems)

Critical path sync. Everything else async.

```
                    SYNC (user waits)
User ──▶ API ──▶ DB + Payment Gateway ──▶ 201 OK
                    │
                    ASYNC (background)
                    ▼
              [Message Queue]
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     Email      Warehouse    Analytics
```

Design rule: **sync for decisions, async for reactions.**

---

## Sync Chain Problems

```
A → B → C → D → E

If D is slow: entire chain slow
If D fails:   entire request fails (unless complex retry)
If E added:   A must change to call E
```

**Queue alternative:**

```
A → publish event → [B, C, D, E subscribe independently]
```

---

## Request-Reply Over Queue (Advanced)

Sometimes you need async with a response later.

```
1. Client publishes request with correlation_id
2. Worker processes, publishes reply to reply_queue
3. Client correlates response

Used in: RPC over messaging, legacy enterprise systems
Modern alternative: gRPC for sync, queue for fire-and-forget
```

---

## Decision Framework

```
Does the user need the result in this HTTP response?
  YES → sync (or sync for critical part only)
  NO  → async queue

Can the operation fail silently and retry later?
  YES → async

Does downstream downtime block the user?
  NO  → async preferred

Is ordering across all messages critical?
  YES → careful queue design (FIFO, single partition)
```

---

## Summary

Sync: caller waits — use for user-facing decisions and immediate feedback. Async: fire-and-forget via queue — use for side effects, slow work, and fan-out. Production systems combine both on the same request.

---

[Next: Queue, Pub/Sub, and Streams →](./04-queue-pubsub-and-streams.md)
