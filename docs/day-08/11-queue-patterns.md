# Queue Patterns

[← Retry, DLQ, Idempotency](./10-retry-dlq-and-idempotency.md) | [Day 8 Index](./README.md) | [Next: Tools and Operations →](./12-tools-operations-and-tradeoffs.md)

## Common Patterns in Production

---

## 1. Task Queue (Job Queue)

Single unit of work processed by one worker.

```
API publishes: { "task": "resize_image", "s3_key": "...", "sizes": [100, 400] }
Worker pool competes for jobs
Worker completes → ack
```

**Use:** image processing, PDF generation, data export, cron jobs.

**Tools:** Celery + Redis/RabbitMQ, SQS + Lambda, Sidekiq.

```
┌─────┐     ┌───────┐     ┌─────────┐
│ API │ ──▶ │ Queue │ ──▶ │ Workers │
└─────┘     └───────┘     └─────────┘
```

---

## 2. Event-Driven Architecture

Services publish **domain events**. Others subscribe without direct coupling.

```
Order Service publishes order.created
  → Inventory Service: reserve stock
  → Notification Service: send email
  → Analytics Service: record funnel
  → Search Service: update index
```

**Use:** microservices, reactive systems, audit trails.

**Tools:** Kafka, SNS+SQS fan-out, Google Pub/Sub.

---

## 3. Fan-Out

One message triggers multiple downstream queues.

```
                    ┌──▶ email-queue
SNS topic ──────────├──▶ sms-queue
                    └──▶ push-queue
```

AWS pattern: **SNS → multiple SQS queues** — each channel independent retry/DLQ.

---

## 4. Transactional Outbox

Guarantee DB write and event publish stay consistent.

```
BEGIN TRANSACTION
  INSERT order ...
  INSERT outbox (event_json, status='PENDING')
COMMIT

Outbox Poller (separate process):
  SELECT * FROM outbox WHERE status='PENDING'
  PUBLISH to broker
  UPDATE outbox SET status='SENT'
```

**Use:** avoid "saved to DB but event never published" race.

No two-phase commit across DB and Kafka needed.

---

## 5. Saga Pattern

Distributed transaction across services via chain of events + compensations.

```
Place Order Saga:
  1. OrderCreated
  2. PaymentCaptured
  3. InventoryReserved
  4. OrderConfirmed

Failure at step 3:
  → Publish PaymentRefunded (compensating)
  → Publish OrderCancelled
```

**Use:** microservices without distributed 2PC.

Implement with choreography (events) or orchestration (saga coordinator).

---

## 6. Delay / Scheduled Queue

Process message after delay.

```
SQS DelaySeconds: 900        → deliver in 15 min
RabbitMQ TTL + DLX           → dead letter exchange after delay
Scheduled job publishes at T → time-triggered queue
```

**Use:** reminder emails, trial expiry, retry with delay.

---

## 7. Priority Queue

High-priority messages processed first.

```
RabbitMQ: multiple queues (high, normal, low) — workers poll high first
Separate topics with dedicated worker pools
```

**Use:** premium user notifications, critical alerts.

Most managed queues (SQS) don't natively support priority — design with separate queues.

---

## 8. Request-Reply

Async request with response queue.

```
Client → request_queue (correlation_id=abc)
Worker → processes → reply_queue (correlation_id=abc)
Client ← reads reply_queue filtered by abc
```

**Use:** RPC over messaging, legacy integration.

Modern alternative: sync gRPC for request-response; queue for one-way work.

---

## 9. Change Data Capture (CDC)

Database changes streamed to queue.

```
PostgreSQL → Debezium → Kafka → Search index, cache, warehouse
```

**Use:** keep read models in sync without dual writes.

---

## Pattern Selection

| Need | Pattern |
|------|---------|
| Background job | Task queue |
| Decouple microservices | Event-driven |
| DB + event atomicity | Outbox |
| Multi-step distributed txn | Saga |
| Notify email + SMS + push | Fan-out |
| Retry later | Delay queue |
| Sync search index with DB | CDC |

---

## Summary

Task queues handle jobs. Event-driven + fan-out decouple services. Outbox and saga solve consistency across boundaries. Delay and priority queues handle timing and urgency. Match pattern to consistency and coupling requirements.

---

[Next: Tools and Operations →](./12-tools-operations-and-tradeoffs.md)
