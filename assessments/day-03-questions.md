# Parking Lot System (LLD) — MCQ Questions (10)

Multi-select format: each question has **two or more** correct answers. Questions tagged **[Case Study]** include a business context block.

> **Answers and explanations:** see [answer-key/day-03-answers.md](./answer-key/day-03-answers.md)


---

### Q01 [Easy] — Modeling a Downtown Garage



**Select all that apply.**

You are designing an object model for a single-floor parking garage where cars are identified by license plate and receive a ticket on entry. Which entity responsibilities are correct?

- [ ] A. `Car` — identified by license plate
- [ ] B. `ParkingTicket` — responsible for freeing the spot when the car exits
- [ ] C. `ParkingSpot` — tracks whether one physical slot is free or occupied
- [ ] D. `ParkingLot` — owns spots; orchestrates enter, exit, and availability

---

### Q02 [Easy] — Spot State Transitions



**Select all that apply.**

Which state transitions are valid for a `ParkingSpot`?

- [ ] A. FREE → OCCUPIED when `park(car)` is called on an empty spot
- [ ] B. Reject `park()` when the spot is already occupied
- [ ] C. OCCUPIED → FREE when `park()` is called again
- [ ] D. OCCUPIED → FREE when `vacate()` is called

---

### Q03 [Easy] [Case Study] — MVP Scope for MetroGarage



**Context:** MetroGarage wants a software system for one downtown lot: cars enter, get a ticket, exit, and operators see how many spots are free. Phase 2 might add trucks, payments, and multiple floors — but not in the first release.

**Select all that apply.**

Which capabilities should **not** be built in the MVP?

- [ ] A. Assigning a free spot and issuing a ticket on entry
- [ ] B. Managing multiple unrelated parking lots from one admin panel
- [ ] C. Hourly payment and billing on exit
- [ ] D. Separate spot types for motorcycles and trucks

---

### Q04 [Medium] — Entry Flow Design



**Select all that apply.**

A driver arrives at the gate. The system must assign a spot and issue a ticket. Which steps belong in `enter(car)`?

- [ ] A. Reject if the same license plate already has an active ticket
- [ ] B. Call `spot.park(car)`, create a ticket, register it as active
- [ ] C. Find an available spot; reject with "lot full" if none exist
- [ ] D. Charge a flat fee before opening the gate

---

### Q05 [Medium] — REST API Contract for Gate Kiosks



**Select all that apply.**

Gate kiosks call your parking API. Which HTTP status and error code pairings are correct?

- [ ] A. Lot full → `409 Conflict` with error `PARKING_FULL`
- [ ] B. Invalid ticket at exit → `404 Not Found` with error `INVALID_TICKET`
- [ ] C. Same car enters twice → `409 Conflict` with error `ALREADY_PARKED`
- [ ] D. Successful entry → `201 Created` with ticket details

---

### Q06 [Medium] — Single Responsibility in the Object Model



**Select all that apply.**

Which responsibility assignments follow good LLD separation?

- [ ] A. `ParkingLot` finds a free spot and coordinates enter/exit
- [ ] B. `ParkingLot` calculates hourly payment on exit
- [ ] C. `ParkingSpot` updates its own occupied/free flag
- [ ] D. `ParkingSpot` searches all spots to find the next free one

---

### Q07 [Medium] [Case Study] — Production Bug: Double Booking



**Context:** After a busy Saturday, operators report two cars assigned to spot #14. Logs show two `enter()` calls 200ms apart for different plates when only one spot was free. The MVP runs single-process in memory with no locking.

**Select all that apply.**

Which edge cases and fixes address this class of bug?

- [ ] A. Two concurrent enters racing for the last spot → need per-spot lock or DB transaction in production
- [ ] B. Zero spots configured → enter should always succeed
- [ ] C. Same car entering twice → reject with `ALREADY_PARKED`
- [ ] D. Exit twice with the same ticket → second exit fails; ticket already removed

---

### Q08 [Hard] [Case Study] — INVALID_TICKET Spike at Exit Lanes



**Context:** Exit kiosks report a spike in `INVALID_TICKET` errors. Investigation shows drivers scanning paper tickets faded by sun, while the database still has active sessions. Some drivers try to exit twice after a successful first exit.

**Select all that apply.**

Which behaviors should the exit flow enforce?

- [ ] A. Reject unknown ticket IDs with `INVALID_TICKET`
- [ ] B. Never assign two cars to the same spot (correctness NFR)
- [ ] C. On successful exit, remove ticket from active registry so a second scan fails
- [ ] D. Support 10,000 concurrent entry races in the in-memory MVP without any locking

---

### Q09 [Hard] [Case Study] — Phase 2: Trucks and Paid Exits



**Context:** MetroGarage phase 2 adds large spots for trucks, compact spots for motorcycles, and payment on exit based on `entry_time`. The garage remains single-floor but must match vehicle type to compatible spots.

**Select all that apply.**

Which design extensions are appropriate?

- [ ] A. On exit, compute fee from duration × rate using ticket `entry_time`
- [ ] B. Optimistic locking on `is_occupied` when moving to a persisted database
- [ ] C. `ParkingFloor` entity for multi-floor search — required immediately
- [ ] D. `SpotType` enum (compact, regular, large) matched to vehicle type

---

### Q10 [Hard] [Case Study] — Clarifying a Vague Product Brief



**Context:** The product owner says: "Build a parking lot system." Before coding, you run a requirements workshop. You agree on: one lot, one floor, cars only, license plate identification, ticket on entry, in-memory storage for v1.

**Select all that apply.**

Which assumptions correctly bound the v1 design?

- [ ] A. License plate identifies the vehicle
- [ ] B. Multi-lot registry with payment gateway integration in v1
- [ ] C. One parking lot, single floor, cars only
- [ ] D. Ticket issued on entry linking car, spot, and entry time
