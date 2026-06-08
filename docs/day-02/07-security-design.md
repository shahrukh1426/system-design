# Security Design

[← Reliability Design](./06-reliability-design.md) | [Day 2 Index](./README.md) | [Next: Data Design →](./08-data-design.md)

## What Is Security Design?

**Security design** embeds protection into the architecture from the start — not as an afterthought. It covers who can access what, how data is protected, and how you defend against threats.

It answers: *What can go wrong from a security perspective, and how do we prevent it?*

## The Security Mindset

| Reactive (Bad) | Proactive (Good) |
|----------------|------------------|
| "We'll add auth later" | Auth designed in HLD |
| "Nobody would attack us" | Threat model from day one |
| "HTTPS is enough" | Defense in depth at every layer |

**Assume breach** — design so that even if one layer fails, damage is limited.

## Core Security Pillars

### 1. Authentication — Who Are You?

Verify identity.

| Method | Use Case |
|--------|----------|
| **Password + hash** | Traditional login (bcrypt, Argon2) |
| **OAuth 2.0 / OIDC** | Social login, SSO (Google, GitHub) |
| **JWT** | Stateless API auth |
| **API keys** | Service-to-service, developer APIs |
| **MFA** | Extra factor for sensitive accounts |

```
Login flow:
Client → POST /auth/login (email, password)
       → Server validates hash
       → Returns JWT (short-lived access + long-lived refresh token)
Client → Authorization: Bearer <JWT> on subsequent requests
```

### 2. Authorization — What Can You Do?

Control access after identity is verified.

| Model | Description | Example |
|-------|-------------|---------|
| **RBAC** | Role-Based Access Control | Admin, Editor, Viewer |
| **ABAC** | Attribute-Based | "Owner of resource can edit" |
| **ACL** | Per-resource permissions | File sharing permissions |

```
Principle of Least Privilege:
  Give minimum permissions needed — nothing more.
```

### 3. Data Protection

| State | Protection |
|-------|------------|
| **In transit** | TLS 1.2+ (HTTPS everywhere) |
| **At rest** | AES-256 encryption on databases and storage |
| **In use** | Minimize sensitive data in logs and memory |

**Never store:**
- Plaintext passwords
- Credit card numbers (use tokenization via Stripe, etc.)
- Secrets in source code (use secret managers)

### 4. Input Validation

Treat all external input as hostile.

| Threat | Prevention |
|--------|------------|
| **SQL injection** | Parameterized queries, ORMs |
| **XSS** | Output encoding, Content-Security-Policy |
| **CSRF** | CSRF tokens, SameSite cookies |
| **Path traversal** | Validate file paths, sandbox access |
| **Command injection** | Never pass user input to shell commands |

Validate on the **server** — client-side validation is for UX only.

### 5. Network Security

```
Internet → WAF → Load Balancer → Private Subnet (App Servers)
                                              → Private Subnet (DB)
```

| Layer | Tool |
|-------|------|
| **Firewall** | Allow only required ports |
| **WAF** | Block common web attacks |
| **VPC / private subnets** | DB not reachable from internet |
| **mTLS** | Encrypted service-to-service communication |

### 6. Rate Limiting and DDoS Protection

```
Rate limits:
  /api/login     → 5 requests/minute per IP
  /api/search    → 100 requests/minute per user
  /api/upload    → 10 requests/hour per user
```

Prevents brute force, scraping, and resource exhaustion.

## Threat Modeling

A structured way to find vulnerabilities before attackers do.

### STRIDE Framework

| Threat | Description | Example |
|--------|-------------|---------|
| **S**poofing | Fake identity | Stolen JWT |
| **T**ampering | Modify data | Altering order amount |
| **R**epudiation | Deny action | "I didn't place that order" |
| **I**nformation disclosure | Leak data | Exposed API returning other users' data |
| **D**enial of service | Make unavailable | Flood of requests |
| **E**levation of privilege | Gain unauthorized access | User accessing admin endpoints |

### Threat Model Template

```
Asset:        User payment data
Threat:       Attacker intercepts payment API call
Impact:       Financial fraud, data breach
Likelihood:   Medium
Mitigation:   TLS, tokenization, no card data stored
```

## Security in System Design Interviews

Common topics to address:

- How are passwords stored? (hashed, salted)
- How is API auth handled? (JWT, OAuth)
- How is data encrypted? (TLS in transit, AES at rest)
- How do you prevent unauthorized access? (RBAC, ACLs)
- How do you handle secrets? (Vault, AWS Secrets Manager)
- What happens if a token is stolen? (short expiry, refresh rotation, revocation)

## Security Checklist

- [ ] HTTPS everywhere, TLS 1.2+
- [ ] Authentication on all non-public endpoints
- [ ] Authorization checks at service layer (not just API gateway)
- [ ] Passwords hashed with bcrypt/Argon2
- [ ] Secrets in secret manager, not code or env files in repos
- [ ] Input validation on all user-provided data
- [ ] Rate limiting on auth and write endpoints
- [ ] Database in private network, not internet-facing
- [ ] Audit logging for sensitive operations
- [ ] Dependency scanning (CVE alerts)
- [ ] Regular penetration testing for production systems

## Summary

Security design builds protection into every layer: authentication, authorization, encryption, input validation, network isolation, and rate limiting. Use threat modeling to find risks early, apply least privilege, and never treat security as a feature to add later.

---

[Next: Data Design →](./08-data-design.md)
