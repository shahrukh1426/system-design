# Day 3 — Design Task: Parking Lot

Day 3 is a hands-on **low-level design** exercise. We take a small, real-world problem and walk through requirements, class design, operations, and APIs step by step.

## Task

> **Design a Parking Lot**

### Requirements

1. Cars enter the parking lot
2. Cars exit the parking lot
3. Show available parking spots

## What You'll Practice

| Skill | Where |
|-------|-------|
| Requirement clarification | Expanding vague requirements into concrete specs |
| Entity identification | ParkingLot, Spot, Car, Ticket |
| LLD / OOP design | Classes, relationships, responsibilities |
| State management | Spot availability, active sessions |
| API design | Enter, exit, availability endpoints |
| Edge cases | Full lot, invalid exit, duplicate entry |

## Document

| # | Topic | File |
|---|-------|------|
| 1 | [Parking Lot — Full Design](./01-parking-lot-design.md) | Complete walkthrough |

## Reading Order

One document, read top to bottom. Takes ~15–20 minutes.

## Key Takeaways

- Small design problems still need **clarifying questions** before you draw classes.
- Assign each class **one clear responsibility** — ParkingLot orchestrates, Spot tracks occupancy.
- Model **enter** and **exit** as state changes on a spot, linked by a ticket or session.
- Start simple (single floor, cars only), then list **extensions** for follow-up discussion.

## Related

- [Day 1: Starter Example (URL Shortener)](../day-01/05-starter-example.md)
- [Day 2: LLD](../day-02/03-lld.md)
- [Day 2: API Design](../day-02/09-api-design.md)
