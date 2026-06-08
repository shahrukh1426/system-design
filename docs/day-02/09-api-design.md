# API Design

[← Data Design](./08-data-design.md) | [Day 2 Index](./README.md) | [Next: Performance Design →](./10-performance-design.md)

## What Is API Design?

**API design** defines the contracts between components — how services expose capabilities and how clients consume them. A well-designed API is intuitive, consistent, and stable.

It answers: *How do parts of the system talk to each other?*

## API Styles

| Style | Protocol | Best For |
|-------|----------|----------|
| **REST** | HTTP + JSON | Public APIs, CRUD resources, web/mobile clients |
| **gRPC** | HTTP/2 + Protobuf | Internal service-to-service, high performance |
| **GraphQL** | HTTP + query language | Flexible client queries, reducing over-fetching |
| **WebSocket** | TCP | Real-time bidirectional (chat, live updates) |
| **Webhooks** | HTTP callbacks | Event notifications to external systems |
| **Message Queue** | Async protocol | Decoupled, event-driven communication |

Most systems use **REST** for external APIs and **gRPC or queues** internally.

## REST API Design Principles

### Resource-Oriented URLs

Use nouns, not verbs. Resources map to URLs.

```
Good:
  GET    /users              → list users
  GET    /users/123          → get user 123
  POST   /users              → create user
  PUT    /users/123          → update user 123
  DELETE /users/123          → delete user 123
  GET    /users/123/orders   → list orders for user 123

Bad:
  GET  /getUser?id=123
  POST /createUser
  POST /deleteUser
```

### HTTP Methods

| Method | Purpose | Idempotent? |
|--------|---------|-------------|
| `GET` | Read resource | Yes |
| `POST` | Create resource | No |
| `PUT` | Full update | Yes |
| `PATCH` | Partial update | No |
| `DELETE` | Remove resource | Yes |

### Status Codes

| Code | Meaning | When |
|------|---------|------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Invalid input |
| `401` | Unauthorized | Missing/invalid auth |
| `403` | Forbidden | Valid auth, insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate, state conflict |
| `429` | Too Many Requests | Rate limited |
| `500` | Internal Error | Server bug |
| `503` | Service Unavailable | Downstream failure, maintenance |

### Request and Response Format

**Consistent envelope:**

```json
// Success
{
  "data": {
    "id": "123",
    "name": "Alice",
    "email": "alice@example.com"
  },
  "meta": {
    "request_id": "req-abc-456"
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "must not be empty" }
    ]
  },
  "meta": {
    "request_id": "req-abc-456"
  }
}
```

### Pagination

For list endpoints, always paginate.

```
GET /users?page=2&limit=20

Response:
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 1500,
    "has_next": true
  }
}
```

Alternatives: cursor-based (`?cursor=abc&limit=20`) for real-time feeds.

### Filtering and Sorting

```
GET /orders?status=ACTIVE&sort=-created_at&limit=10
```

Use query parameters — keep the resource URL clean.

## API Versioning

APIs evolve. Versioning prevents breaking existing clients.

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **URL path** | `/v1/users` | Explicit, easy | URL pollution |
| **Header** | `Accept: application/vnd.api+json;version=1` | Clean URLs | Less visible |
| **Query param** | `/users?version=1` | Simple | Easy to forget |

**Best practice:** URL path versioning for public APIs. Deprecate old versions with a timeline.

```
/v1/users  → active, supported
/v2/users  → new version with breaking changes
/v0/users  → deprecated, sunset date announced
```

## Internal API Design (gRPC)

For service-to-service communication:

```protobuf
service OrderService {
  rpc CreateOrder(CreateOrderRequest) returns (Order);
  rpc GetOrder(GetOrderRequest) returns (Order);
  rpc ListOrders(ListOrdersRequest) returns (OrderList);
}
```

| REST (External) | gRPC (Internal) |
|-----------------|-----------------|
| Human-readable JSON | Binary Protobuf |
| Browser-friendly | Service-to-service |
| Loosely typed | Strongly typed contracts |
| Wider ecosystem | Higher performance |

## API Design Best Practices

### 1. Consistency

Pick conventions and stick to them across all endpoints.

```
Always use ISO 8601 dates: "2024-03-15T10:30:00Z"
Always use snake_case or camelCase — not both
Always include request_id in responses
```

### 2. Idempotency

`POST` operations that create resources should support idempotency keys.

```
POST /orders
Idempotency-Key: uuid-unique-key
```

### 3. Rate Limiting Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 742
X-RateLimit-Reset: 1620000000
```

### 4. Documentation

Use **OpenAPI (Swagger)** for REST or **Protobuf docs** for gRPC. Generate client SDKs from specs.

### 5. Backward Compatibility

Safe changes (no version bump):
- Adding optional fields to response
- Adding new endpoints
- Adding optional query parameters

Breaking changes (need new version):
- Removing fields
- Changing field types
- Renaming fields
- Changing URL structure

## API Gateway Pattern

Single entry point for all client requests.

```
Client → API Gateway → [Auth, Rate Limit, Route] → Backend Services
```

Benefits: centralized auth, rate limiting, routing, SSL termination, request logging.

## Summary

API design defines how system components communicate. Use REST for external-facing APIs with consistent URLs, status codes, and response formats. Version carefully, paginate list endpoints, and document with OpenAPI. For internal services, prefer gRPC for performance and strong contracts.

---

[Next: Performance Design →](./10-performance-design.md)
