# When to Use System Design

[← Types of System Design](./03-types-of-system-design.md) | [Day 1 Index](./README.md) | [Next: Starter Example →](./05-starter-example.md)

## It's Not Only for Big Tech

A common misconception: system design is only for companies serving millions of users. That's wrong.

You use system design whenever you need to make **architectural decisions** that are costly or painful to reverse later.

## Clear Signals You Need It

### 1. Starting a New Product or Major Feature

Before writing code, ask:

- Who are the users and how many do we expect?
- What data do we store and how fast does it grow?
- What are the latency and availability targets?

**Example:** Building a real-time chat feature — do you use WebSockets, long polling, or a managed service like Firebase? That decision affects everything downstream.

### 2. Hitting Performance or Scale Limits

Warning signs:

- Response times creeping up as traffic grows
- Database CPU pegged during peak hours
- Frequent timeouts or OOM crashes
- Horizontal scaling doesn't help anymore

**Action:** Step back and redesign the bottleneck — caching layer, read replicas, sharding, or async processing.

### 3. Preparing for Growth

You don't have scale problems *yet*, but you know they're coming:

- Launching in new markets
- Viral marketing campaign planned
- Enterprise clients requiring SLAs
- Regulatory requirements (GDPR, HIPAA)

Design for the next order of magnitude, not the current one.

### 4. Splitting a Monolith

When a single codebase becomes:

- Slow to build and test
- Risky to deploy (one change breaks unrelated features)
- Owned by too many teams stepping on each other

Time to define service boundaries and migration strategy.

### 5. Reliability Incidents

After repeated outages, ask architectural questions:

- Is there a single point of failure?
- Do we have redundancy across availability zones?
- Can the system degrade gracefully?
- Are retries and circuit breakers in place?

### 6. Job Interviews and Skill Building

Practicing system design sharpens your ability to:

- Communicate technical ideas clearly
- Reason about trade-offs under time pressure
- Structure ambiguous problems

Even if you're not interviewing, the exercise makes you a better engineer.

## When You Can Skip Heavy Design

Not every change needs a full architecture review.

| Situation | Approach |
|-----------|----------|
| Bug fix in a well-understood module | Fix it, ship it |
| Small UI change | No architecture needed |
| Internal tool with &lt; 50 users | Keep it simple — monolith is fine |
| Prototype to validate an idea | Speed over perfection |
| Adding a field to an existing API | Follow existing patterns |

**Rule of thumb:** If the change is easily reversible and affects few users, light design is enough. If it's hard to undo or affects core data flows, invest in proper design.

## The Cost of Skipping Design

| Skipped Step | Later Cost |
|--------------|------------|
| No capacity planning | Emergency scaling, downtime, revenue loss |
| No failure modeling | Cascading outages, data corruption |
| No API contract design | Breaking changes, client integration pain |
| No data model planning | Painful migrations, inconsistent state |
| No security review | Breaches, compliance failures |

The best time to design is **before** the pain, not after.

## A Simple Decision Framework

Ask these five questions:

```
1. Is this hard to reverse?
   YES → Invest in design
   NO  → Move fast, iterate

2. Will this affect core data or user-facing SLAs?
   YES → Invest in design
   NO  → Lighter process

3. Are multiple teams involved?
   YES → Invest in design (clear contracts needed)
   NO  → Team can align informally

4. Is scale expected to grow 10x+ in the next year?
   YES → Invest in design
   NO  → Optimize when needed

5. Does this involve money, health, or safety data?
   YES → Invest heavily (reliability + security)
   NO  → Standard process
```

If you answer **YES** to two or more, spend real time on system design.

## Where It Fits in the Development Lifecycle

```
Idea → Requirements → System Design → Implementation → Testing → Deploy → Monitor
                            ↑
                    You are here (Day 1)
                    Learning the foundations
```

Design is not a one-time event. Revisit it when:

- Requirements change significantly
- Scale crosses a threshold
- New failure modes appear
- Technology landscape shifts (new tools, deprecations)

## Summary

Use system design when architectural decisions are hard to reverse, when scale or reliability demands it, or when multiple teams need shared structure. Skip heavy design for small, reversible changes — but never skip thinking entirely about data flow and failure modes.

---

[Next: Starter Example →](./05-starter-example.md)
