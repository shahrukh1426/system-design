# Refactor Design

[← Observability Design](./11-observability-design.md) | [Day 2 Index](./README.md)

## What Is Refactor Design?

**Refactor design** is the discipline of improving an existing system's architecture, code, or infrastructure **without breaking production** — while the system continues to serve users.

It answers: *How do we evolve this system safely?*

Every long-lived system needs refactoring. Requirements change, teams grow, scale increases, and tech debt accumulates. Refactor design is how you manage that evolution deliberately.

## When Refactoring Is Needed

| Signal | Example |
|--------|---------|
| **Deploy risk** | Every release breaks unrelated features |
| **Scale ceiling** | Can't handle 2× current traffic |
| **Team bottleneck** | 20 engineers on one codebase, constant merge conflicts |
| **Tech debt** | Framework EOL, critical CVE with no patch |
| **Cost** | Infrastructure bills growing faster than revenue |
| **Velocity drop** | Simple features take weeks instead of days |
| **Onboarding pain** | New engineers take months to be productive |

## Refactor vs Rewrite

| Refactor | Rewrite |
|----------|---------|
| Incremental changes | Build new system from scratch |
| System stays running | Parallel development, big cutover |
| Lower risk | Higher risk (second-system effect) |
| Slower progress | Faster initial progress, painful migration |
| **Preferred** | Last resort |

> "The single worst strategic mistake that any software company can make: rewrite from scratch." — Joel Spolsky

Rewrites take longer than planned, miss accumulated edge cases, and often fail. Refactor incrementally unless the codebase is truly unsalvageable.

## Common Refactoring Scenarios

### 1. Monolith → Microservices

The most common refactor in system design.

```
Phase 1: Modular monolith (clear module boundaries inside one deployable)
Phase 2: Extract one service (highest pain point first)
Phase 3: Strangler fig pattern (route traffic gradually)
Phase 4: Extract remaining services over months
```

**Don't:** Split into 20 microservices overnight.  
**Do:** Extract the service with the clearest boundary and highest independent scaling need.

### 2. Database Migration

```
Phase 1: Dual-write (write to old and new DB)
Phase 2: Backfill historical data
Phase 3: Verify consistency
Phase 4: Switch reads to new DB
Phase 5: Stop writing to old DB
Phase 6: Decommission old DB
```

Never do a big-bang database migration on production.

### 3. API Versioning / Contract Change

```
Phase 1: Launch v2 alongside v1
Phase 2: Migrate internal clients to v2
Phase 3: Notify external clients with deprecation timeline
Phase 4: Monitor v1 usage decline
Phase 5: Sunset v1 after deadline
```

### 4. Framework / Language Migration

```
Phase 1: New code in new framework (coexist)
Phase 2: Migrate module by module
Phase 3: Shared interface layer during transition
Phase 4: Retire old framework when usage hits zero
```

## The Strangler Fig Pattern

Named after a tree that gradually envelops its host. Applied to systems:

```
                    ┌──────────────┐
         ┌─────────│  API Gateway  │─────────┐
         │         └──────────────┘         │
         ▼                                   ▼
  ┌──────────────┐                   ┌──────────────┐
  │  New Service │ ← growing         │   Old        │ ← shrinking
  │  (extracted) │                   │  Monolith    │
  └──────────────┘                   └──────────────┘
```

1. Place a routing layer (API gateway) in front
2. Build new service for one feature
3. Route that feature's traffic to new service
4. Repeat for next feature
5. Monolith shrinks until it's empty → decommission

**Benefits:** Zero downtime, rollback per feature, incremental investment.

## Refactor Design Principles

### 1. Make It Work, Make It Right, Make It Fast

Don't refactor and add features simultaneously. Separate concerns:

```
Sprint 1: Feature works (maybe messy)
Sprint 2: Refactor for clarity
Sprint 3: Optimize performance (if needed)
```

### 2. Tests Before Refactoring

```
No tests + refactor = gambling with production
```

Before any structural change:
- Add integration tests for critical paths
- Ensure CI pipeline catches regressions
- Use feature flags to control rollout

### 3. Feature Flags

Deploy refactored code behind a flag. Switch gradually.

```
if (feature_flags.is_enabled("new_payment_flow", user_id)):
    return new_payment_service.process(order)
else:
    return legacy_payment.process(order)
```

Rollback = flip the flag off. No redeploy needed.

### 4. Measure Before and After

Define success metrics before starting:

| Metric | Before | Target |
|--------|--------|--------|
| Deploy frequency | 1×/month | 1×/week |
| p99 latency | 800ms | < 300ms |
| Error rate | 0.5% | < 0.1% |
| Build time | 45 min | < 10 min |
| Onboarding time | 3 months | 3 weeks |

If metrics don't improve after refactoring, reconsider the approach.

### 5. Boy Scout Rule

> "Leave the code better than you found it."

Every PR touches a file → make one small improvement in that file. Compounds over time without dedicated refactor sprints.

## Refactor Planning Template

```
## Refactor: [Name]

### Problem
What's broken and why refactor now?

### Goal
What does success look like? (metrics)

### Scope
What's in / out of this refactor?

### Approach
Strangler fig / dual-write / module extraction / other

### Phases
1. [Phase 1] — timeline, rollback plan
2. [Phase 2] — timeline, rollback plan
3. [Phase 3] — timeline, rollback plan

### Risks
- Risk 1 → mitigation
- Risk 2 → mitigation

### Rollback Plan
How to revert each phase if things go wrong
```

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| Big-bang rewrite | Misses edge cases, long downtime |
| Refactoring without tests | Breaks production silently |
| Refactoring everything at once | Too much risk, no incremental value |
| Gold-plating | Perfect architecture, no user value delivered |
| Ignoring team capacity | Refactor stalls, morale drops |
| No rollback plan | Stuck with broken migration |

## Summary

Refactor design evolves existing systems safely through incremental changes — strangler fig pattern, dual-writes, feature flags, and module extraction. Prefer refactoring over rewriting, measure before and after, and always have a rollback plan. Every mature system needs this discipline to stay healthy.

---

**Day 2 complete.** Paste Day 3 topics when ready.

[← Back to Day 2 Index](./README.md) | [Day 1](../day-01/README.md)
