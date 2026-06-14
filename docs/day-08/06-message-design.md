# Message Design

[← Core Components](./05-core-components.md) | [Day 8 Index](./README.md) | [Next: Delivery Guarantees →](./07-delivery-guarantees.md)

## Why Message Design Matters

Bad messages cause debugging nightmares, version breakage, and oversized payloads that clog the broker.

Design messages like APIs — schema, versioning, and size limits.

---

## Message Structure

```json
{
  "message_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "order.created",
  "schema_version": "v2",
  "timestamp": "2024-03-15T10:30:00Z",
  "correlation_id": "req-abc-123",
  "partition_key": "order-456",
  "payload": {
    "order_id": 456,
    "user_id": 789,
    "total": 99.99,
    "currency": "USD"
  },
  "metadata": {
    "source": "order-service",
    "trace_id": "trace-xyz"
  }
}
```

| Field | Purpose |
|-------|---------|
| `message_id` | Unique — idempotency, dedup |
| `event_type` | Consumer routing |
| `schema_version` | Backward-compatible evolution |
| `timestamp` | Ordering, debugging, SLA |
| `correlation_id` | Trace across services |
| `partition_key` | Explicit key for Kafka ordering |
| `payload` | Business data |
| `metadata` | Operational context (not business logic) |

---

## Commands vs Events

| Type | Meaning | Example |
|------|---------|---------|
| **Command** | "Do this" | `SendEmail`, `ChargePayment` |
| **Event** | "This happened" | `OrderCreated`, `PaymentCaptured` |

**Prefer events** in microservices — services react to facts, don't order each other around.

```
Bad (command coupling):
  Order Service → "InventoryService.decrement(stock)"

Good (event):
  Order Service → publishes OrderCreated
  Inventory Service → subscribes, decrements own data
```

---

## Payload Size

| Rule | Detail |
|------|--------|
| Keep small | Target &lt; 256 KB (SQS max 256 KB) |
| Reference large data | Store file in S3, send URL in message |
| Don't embed images/PDFs | Pass object key only |
| Avoid full DB rows | Send IDs — consumer fetches if needed |

```json
{
  "event_type": "video.uploaded",
  "payload": {
    "video_id": "v-123",
    "s3_key": "uploads/user-789/v-123.mp4",
    "size_bytes": 52428800
  }
}
```

Worker downloads from S3 — message stays tiny.

---

## Schema and Versioning

Messages outlive deploys. Plan for schema changes.

```
order.created v1: { order_id, user_id, total }
order.created v2: { order_id, user_id, total, currency }  ← new field

Consumers:
  - ignore unknown fields (forward compatible)
  - use schema_version to branch logic
  - use Avro/Protobuf + Schema Registry for enforced compatibility
```

| Strategy | Tool |
|----------|------|
| JSON + version field | Simple, manual |
| Avro + Schema Registry | Kafka ecosystem standard |
| Protobuf | gRPC, high performance |

**Compatibility rules:**
- Add optional fields — safe
- Remove fields — breaking — new topic or version
- Rename fields — treat as remove + add

---

## Idempotency Key in Message

Always include unique `message_id` or business idempotency key.

```json
{
  "message_id": "uuid-unique-per-publish",
  "payload": {
    "order_id": 456,
    "idempotency_key": "order-456-payment"
  }
}
```

Consumer stores processed keys — skip duplicates.

---

## Sensitive Data

| Do | Don't |
|----|-------|
| Send user_id, order_id | Send password, credit card number |
| Encrypt at rest on broker if required | Put PII in message without need |
| Use reference to secure vault | Log full message in plain text |

Compliance (GDPR, PCI) applies to queue messages too.

---

## Envelope Pattern

Wrap payload in standard envelope across all events.

```
{
  "meta": { id, type, version, timestamp, trace_id },
  "data": { ... business fields ... }
}
```

All consumers parse `meta` consistently — logging, tracing, routing.

---

## Summary

Design messages with unique IDs, event types, schema versions, and small payloads. Prefer events over commands. Reference large blobs by URL. Version schemas carefully — treat messages as long-lived API contracts.

---

[Next: Delivery Guarantees →](./07-delivery-guarantees.md)
