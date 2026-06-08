# Why System Design?

[← Day 1 Index](./README.md) | [Next: What Is System Design →](./02-what-is-system-design.md)

## The Problem It Solves

Most software starts small. A single server, one database, a few hundred users. It works — until it doesn't.

Growth brings pressure:

- More users → slower responses
- More data → storage and query bottlenecks
- More features → tangled, fragile code
- More traffic → outages during peak hours

**System design** is how you plan ahead so your system can handle growth without breaking down or becoming impossibly expensive to maintain.

## Why It Matters in the Real World

### 1. Scale

Companies like Google, Netflix, and Amazon serve billions of requests. That doesn't happen by accident. Every layer — caching, load balancing, database sharding, message queues — is a deliberate design choice.

You may not build at that scale today, but the **thinking** transfers everywhere.

### 2. Reliability

Users expect systems to be available 24/7. A well-designed system:

- Handles failures gracefully (one server dies, others keep working)
- Recovers automatically where possible
- Degrades thoughtfully instead of crashing entirely

### 3. Cost Efficiency

Bad design wastes money. Over-provisioned servers, redundant databases, and unnecessary complexity all add up. Good design uses resources where they matter most.

### 4. Team Collaboration

In real teams, no one person holds the entire codebase in their head. Clear architecture lets engineers:

- Work in parallel on different components
- Onboard faster
- Make changes without unintended side effects

### 5. Interviews and Career Growth

System design is a core skill tested in senior engineering interviews. More importantly, it's what separates engineers who can **ship features** from those who can **build platforms**.

## What Happens Without It?

| Symptom | Root Cause (Often) |
|---------|-------------------|
| App slows down at peak hours | No caching, no load balancing |
| Database crashes under load | No read replicas, no connection pooling |
| Deployments break production | Tight coupling, no isolation between services |
| Features take months to ship | Monolith grew too large, no clear boundaries |
| Bills spike unexpectedly | No capacity planning, over-scaled infrastructure |

## The Mindset Shift

System design isn't about memorizing that "Twitter uses Cassandra." It's about learning to ask:

- What are the **requirements**? (functional and non-functional)
- What are the **constraints**? (budget, team size, timeline)
- What are the **trade-offs**? (consistency vs availability, speed vs cost)
- What happens when something **fails**?

## Summary

System design exists because software that works for 10 users often fails at 10 million. Learning it early helps you build systems that are scalable, reliable, cost-effective, and easier for teams to maintain.

---

[Next: What Is System Design →](./02-what-is-system-design.md)
