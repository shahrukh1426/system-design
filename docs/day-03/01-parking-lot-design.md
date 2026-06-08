# Design Task: Parking Lot

[← Day 3 Index](./README.md)

## The Task

Design a parking lot system that supports:

1. Cars **enter** the parking lot
2. Cars **exit** the parking lot
3. **Show available** parking spots

This is a classic low-level design (LLD) problem — small scope, but it tests how you think in objects, state, and operations.

---

## Step 1 — Clarify Requirements

The given requirements are minimal. A good designer asks questions before writing code.

### Questions and Assumptions

| Question | Assumption for This Design |
|----------|---------------------------|
| Single lot or multiple? | **One** parking lot |
| Multiple floors? | **Single floor** (extend later) |
| Vehicle types? | **Cars only** for v1 |
| Spot sizes? | All spots fit one car (same size) |
| How is a car identified? | **License plate** |
| Ticket on entry? | Yes — issue a **ticket** with spot + entry time |
| Payment / pricing? | **Out of scope** for v1 |
| Concurrency? | Single-process app (no parallel entry race for v1) |
| Persistence? | In-memory (extend to DB later) |

### Functional Requirements (Expanded)

| # | Requirement | Detail |
|---|-------------|--------|
| FR-1 | Enter | Assign an available spot to a car; return a ticket |
| FR-2 | Exit | Free the spot when car leaves; validate ticket |
| FR-3 | Availability | Return count (and optionally list) of free spots |

### Non-Functional Requirements (Light)

| NFR | Target |
|-----|--------|
| Correctness | Never assign two cars to the same spot |
| Response | Instant for in-memory (single lot, hundreds of spots) |
| Simplicity | Easy to extend for floors, vehicle types, payment |

### Out of Scope (v1)

- Motorcycles, trucks, handicapped spots
- Payment and hourly billing
- Entry gates, sensors, cameras
- Multi-lot management
- Reservations

---

## Step 2 — Identify Entities

| Entity | Responsibility |
|--------|----------------|
| **ParkingLot** | Owns spots; handles enter, exit, availability |
| **ParkingSpot** | One physical slot; tracks occupied or free |
| **Car** | Identified by license plate |
| **ParkingTicket** | Proof of entry; links car, spot, entry time |

### Relationships

```
ParkingLot
  ├── has many → ParkingSpot
  └── creates  → ParkingTicket

ParkingTicket
  ├── references → Car
  └── references → ParkingSpot

ParkingSpot
  └── optionally holds → Car (when occupied)
```

---

## Step 3 — Class Design (LLD)

### Class Diagram

```
┌─────────────────────┐
│     ParkingLot      │
├─────────────────────┤
│ - id: string        │
│ - spots: Spot[]     │
│ - activeTickets     │
├─────────────────────┤
│ + enter(car): Ticket│
│ + exit(ticket): void│
│ + available(): int  │
│ + availableSpots()  │
└─────────┬───────────┘
          │ 1..*
          ▼
┌─────────────────────┐       ┌─────────────────────┐
│    ParkingSpot      │       │         Car         │
├─────────────────────┤       ├─────────────────────┤
│ - id: int           │       │ - licensePlate      │
│ - isOccupied: bool  │       └─────────────────────┘
│ - car: Car?         │
├─────────────────────┤
│ + park(car): void   │
│ + vacate(): void    │
│ + isAvailable():bool│
└─────────────────────┘

┌─────────────────────┐
│   ParkingTicket     │
├─────────────────────┤
│ - ticketId: string  │
│ - car: Car          │
│ - spot: ParkingSpot │
│ - entryTime: time   │
└─────────────────────┘
```

### Responsibility Split

| Class | Owns | Does NOT |
|-------|------|----------|
| `ParkingSpot` | Its own occupied/free state | Search for free spots |
| `ParkingLot` | All spots, ticket registry | Store payment logic |
| `ParkingTicket` | Entry record | Free the spot (lot does on exit) |
| `Car` | Identity (license plate) | Know which spot it's in |

---

## Step 4 — Core Operations

### 1. Car Enters (`enter`)

```
enter(car):
  1. Check if car already has active ticket → reject (duplicate entry)
  2. Find first available spot
  3. If none → reject ("Parking lot full")
  4. spot.park(car)
  5. Create ParkingTicket(car, spot, now)
  6. Store ticket in activeTickets
  7. Return ticket
```

### 2. Car Exits (`exit`)

```
exit(ticket):
  1. Validate ticket exists in activeTickets
  2. Get spot from ticket
  3. spot.vacate()
  4. Remove ticket from activeTickets
  5. Return success (optionally duration for future billing)
```

### 3. Show Available Spots

```
availableCount():
  return spots.filter(s → s.isAvailable()).count()

availableSpots():
  return spots.filter(s → s.isAvailable())   // list of spot IDs
```

### Spot State Machine

```
  FREE ──park()──▶ OCCUPIED
    ▲                  │
    └────vacate()──────┘
```

Invalid: `park()` when occupied, `vacate()` when already free.

---

## Step 5 — Sequence Diagrams

### Enter

```
Driver     ParkingLot      ParkingSpot     ParkingTicket
  │             │                │                │
  │ enter(car)  │                │                │
  │────────────▶│                │                │
  │             │ find free spot │                │
  │             │───────────────▶│                │
  │             │ park(car)      │                │
  │             │───────────────▶│                │
  │             │ create ticket  │                │
  │             │───────────────────────────────▶  │
  │◀────────────│ return ticket  │                │
```

### Exit

```
Driver     ParkingLot      ParkingSpot
  │             │                │
  │ exit(ticket)│                │
  │────────────▶│                │
  │             │ validate ticket│
  │             │ vacate()       │
  │             │───────────────▶│
  │             │ remove ticket  │
  │◀────────────│ success        │
```

### Check Availability

```
Client       ParkingLot       ParkingSpot[]
  │               │                  │
  │ GET /spots    │                  │
  │──────────────▶│                  │
  │               │ filter available │
  │               │─────────────────▶│
  │◀──────────────│ { free: 42 }     │
```

---

## Step 6 — API Design

Simple REST API wrapping the parking lot service.

### Enter (Park)

```
POST /api/v1/parking/enter
Body: { "license_plate": "ABC-1234" }

201 Created:
{
  "ticket_id": "T-00091",
  "spot_id": 7,
  "license_plate": "ABC-1234",
  "entry_time": "2024-03-15T10:30:00Z"
}

409 Conflict:  { "error": "PARKING_FULL" }
409 Conflict:  { "error": "ALREADY_PARKED", "ticket_id": "T-00042" }
```

### Exit (Unpark)

```
POST /api/v1/parking/exit
Body: { "ticket_id": "T-00091" }

200 OK:
{
  "ticket_id": "T-00091",
  "spot_id": 7,
  "duration_minutes": 95
}

404 Not Found: { "error": "INVALID_TICKET" }
```

### Available Spots

```
GET /api/v1/parking/spots/available

200 OK:
{
  "total_spots": 100,
  "available_count": 42,
  "occupied_count": 58,
  "available_spot_ids": [3, 7, 12, 15, ...]
}
```

For a display board, `available_count` alone may be enough. For a map UI, return `available_spot_ids`.

---

## Step 7 — Sample Implementation (Pseudocode)

```python
class Car:
    def __init__(self, license_plate: str):
        self.license_plate = license_plate


class ParkingSpot:
    def __init__(self, spot_id: int):
        self.spot_id = spot_id
        self.car = None

    def is_available(self) -> bool:
        return self.car is None

    def park(self, car: Car) -> None:
        if not self.is_available():
            raise SpotOccupiedError()
        self.car = car

    def vacate(self) -> None:
        self.car = None


class ParkingTicket:
    def __init__(self, ticket_id: str, car: Car, spot: ParkingSpot, entry_time):
        self.ticket_id = ticket_id
        self.car = car
        self.spot = spot
        self.entry_time = entry_time


class ParkingLot:
    def __init__(self, num_spots: int):
        self.spots = [ParkingSpot(i) for i in range(1, num_spots + 1)]
        self.active_tickets: dict[str, ParkingTicket] = {}
        self._ticket_counter = 0

    def enter(self, car: Car) -> ParkingTicket:
        for ticket in self.active_tickets.values():
            if ticket.car.license_plate == car.license_plate:
                raise AlreadyParkedError(ticket.ticket_id)

        spot = next((s for s in self.spots if s.is_available()), None)
        if spot is None:
            raise ParkingFullError()

        spot.park(car)
        self._ticket_counter += 1
        ticket = ParkingTicket(f"T-{self._ticket_counter:05d}", car, spot, now())
        self.active_tickets[ticket.ticket_id] = ticket
        return ticket

    def exit(self, ticket_id: str) -> ParkingTicket:
        ticket = self.active_tickets.pop(ticket_id, None)
        if ticket is None:
            raise InvalidTicketError()
        ticket.spot.vacate()
        return ticket

    def available_count(self) -> int:
        return sum(1 for s in self.spots if s.is_available())

    def available_spots(self) -> list[int]:
        return [s.spot_id for s in self.spots if s.is_available()]
```

---

## Step 8 — Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Lot is full | Reject entry with `PARKING_FULL` |
| Invalid ticket on exit | Reject with `INVALID_TICKET` |
| Same car tries to enter twice | Reject with `ALREADY_PARKED` |
| Exit twice with same ticket | Second exit fails — ticket already removed |
| Zero spots configured | Always full; enter always fails |
| Check availability when empty | `available_count == total_spots` |

---

## Step 9 — Data Model (If Persisted)

For a real deployment, store sessions in a database.

```sql
CREATE TABLE parking_spots (
    id          INT PRIMARY KEY,
    floor       INT DEFAULT 1,
    is_occupied BOOLEAN DEFAULT FALSE
);

CREATE TABLE parking_sessions (
    ticket_id      VARCHAR(10) PRIMARY KEY,
    license_plate  VARCHAR(20) NOT NULL,
    spot_id        INT REFERENCES parking_spots(id),
    entry_time     TIMESTAMP NOT NULL,
    exit_time      TIMESTAMP NULL
);

CREATE INDEX idx_sessions_active ON parking_sessions(exit_time)
    WHERE exit_time IS NULL;
```

Active session = `exit_time IS NULL`. On exit, set `exit_time` and mark spot free.

---

## Step 10 — Extensions (Follow-Up Discussion)

Interviewers often ask "how would you extend this?" Have answers ready:

| Extension | Design Change |
|-----------|---------------|
| **Multiple vehicle types** | `SpotType`: compact, large, handicapped; match car type to spot |
| **Multiple floors** | `ParkingFloor` contains spots; lot searches floor by floor |
| **Payment** | On exit, compute `duration × rate` from `entry_time` |
| **Display board** | Read-only endpoint; WebSocket push when count changes |
| **Concurrency** | DB transaction or lock per spot; optimistic locking on `is_occupied` |
| **Multiple lots** | `ParkingLotRegistry` maps lot ID → `ParkingLot` instance |
| **Find nearest spot** | Return closest free spot to entrance instead of first free |

### Multiple Vehicle Types (Sketch)

```
enum SpotType { COMPACT, REGULAR, LARGE }

class ParkingLot:
    def enter(self, vehicle: Vehicle) -> ParkingTicket:
        spot = find_first_available(where: spot.type fits vehicle.type)
        ...
```

A motorcycle can use compact or regular; a truck needs large.

---

## Step 11 — HLD (Optional — If Asked at System Level)

For a **single building parking garage**, the whole thing runs as one service:

```
┌──────────┐     ┌─────────────────┐     ┌──────────────┐
│  Entry   │────▶│  Parking Lot    │────▶│   Database   │
│  Kiosk   │     │  Service        │     │  (sessions)  │
└──────────┘     └────────┬────────┘     └──────────────┘
┌──────────┐              │
│  Exit    │──────────────┘
│  Kiosk   │
└──────────┘
┌──────────┐
│ Display  │──── GET /spots/available
│  Board   │
└──────────┘
```

At mall or city scale you'd add lot registry, payment service, and sensor integration — out of scope for this small example.

---

## Design Review Checklist

- [x] **Requirements** — enter, exit, availability covered
- [x] **Entities** — Lot, Spot, Car, Ticket with clear roles
- [x] **Enter flow** — find spot → park → issue ticket
- [x] **Exit flow** — validate ticket → vacate spot
- [x] **Availability** — count and list of free spots
- [x] **Edge cases** — full lot, duplicate entry, bad ticket
- [x] **API** — REST endpoints defined
- [x] **Extensions** — vehicle types, floors, payment sketched

---

## Summary

A parking lot design boils down to **managing state on spots**: a car enters → assign a free spot and issue a ticket; a car exits → validate the ticket and free the spot; availability is counting spots where `isOccupied == false`. Keep `ParkingSpot` responsible for its own state and `ParkingLot` responsible for orchestration — that split scales cleanly to floors, vehicle types, and payment later.

---

**Day 3 complete.** Paste Day 4 when ready.

[← Back to Day 3 Index](./README.md)
