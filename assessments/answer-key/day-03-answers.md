# Parking Lot System (LLD) — Answer Key & Explanations (10)

Answer key for [day-03-questions.md](../day-03-questions.md)


---

### Q01 [Easy] — Modeling a Downtown Garage

**Answer:** A, C, D

**Explanation:** The lot orchestrates flows; each spot owns its occupied/free state; the car holds identity. The ticket records entry — the lot calls `vacate()` on exit, not the ticket itself (B).

---

### Q02 [Easy] — Spot State Transitions

**Answer:** A, B, D

**Explanation:** Valid flow is FREE → OCCUPIED via `park()` and OCCUPIED → FREE via `vacate()`. Calling `park()` on an occupied spot is invalid (C).

---

### Q03 [Easy] [Case Study] — MVP Scope for MetroGarage

**Answer:** B, C, D

**Explanation:** Payment, multi-vehicle types, and multi-lot management are out of scope for v1. Enter/exit with tickets is core (A).

---

### Q04 [Medium] — Entry Flow Design

**Answer:** A, B, C

**Explanation:** Enter checks duplicate entry, finds a spot, parks the car, and issues a ticket. Payment is out of scope for v1 (D).

---

### Q05 [Medium] — REST API Contract for Gate Kiosks

**Answer:** A, B, C, D

**Explanation:** All four match standard REST semantics for create, conflict, and not-found cases in the parking API design.

---

### Q06 [Medium] — Single Responsibility in the Object Model

**Answer:** A, C

**Explanation:** Spots manage local state; the lot orchestrates. Searching all spots is the lot's job (D). Payment is a future extension, not v1 lot logic (B).

---

### Q07 [Medium] [Case Study] — Production Bug: Double Booking

**Answer:** A, C, D

**Explanation:** Duplicate entry and double-exit are specified edge cases. Concurrent entry races require locking — the MVP defers this but production needs it (A). Zero spots means enter always fails (B).

---

### Q08 [Hard] [Case Study] — INVALID_TICKET Spike at Exit Lanes

**Answer:** A, B, C

**Explanation:** Invalid tickets, one-time exit, and spot uniqueness are core rules. The MVP explicitly defers concurrency at scale — 10K concurrent races without locking is not a v1 requirement (D).

---

### Q09 [Hard] [Case Study] — Phase 2: Trucks and Paid Exits

**Answer:** A, B, D

**Explanation:** Vehicle types, payment from entry time, and concurrency control are planned extensions. Multi-floor is a separate extension — not required for single-floor phase 2 (C).

---

### Q10 [Hard] [Case Study] — Clarifying a Vague Product Brief

**Answer:** A, C, D

**Explanation:** Single lot, tickets on entry, and license plate ID are v1 assumptions. Multi-lot and payment are explicitly deferred (B).
