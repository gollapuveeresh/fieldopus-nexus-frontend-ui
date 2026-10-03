# Store & Inventory Backend Contracts

## Current repository state

The frontend repository contains no API client, base URL configuration, backend schema, inventory endpoints, work-order material endpoints, database integration, or backend RBAC contract. Existing work-order and inventory-like records elsewhere in the UI are presentation constants and are not safe integration sources.

No endpoint paths are proposed here. Paths must be supplied by the backend owner and aligned with the application's existing authentication and authorization architecture.

## Required read capabilities

| Capability | HTTP method | Path | Required query/input | Required response | Authorization |
| --- | --- | --- | --- | --- | --- |
| Dashboard summary | GET | Backend-owned / TBD | Store, date range | Item, stock, issue, receipt, return, and movement totals with an `asOf` timestamp | Authorized inventory read |
| Inventory health | GET | Backend-owned / TBD | Store, category, status, criticality | Backend status, item count, stock quantity, criticality | Authorized inventory read |
| Attention queue | GET | Backend-owned / TBD | Store, type, priority, pagination | Typed exception records with entity references and supported actions | Authorized inventory read |
| Items | GET | Backend-owned / TBD | Search, category, criticality, status, pagination, sort | Canonical item fields and server pagination metadata | Authorized item read |
| Item detail | GET | Backend-owned / TBD | Item identifier | Canonical item, balances, locations, movements, consumption, and history | Authorized item read |
| Stock levels | GET | Backend-owned / TBD | Store, item, status, pagination, sort | On-hand, reserved, available, thresholds, status, and updated timestamp | Authorized stock read |
| Stock movements | GET | Backend-owned / TBD | Store, item, work order, movement type, date range, pagination | Transaction identifier, timestamp, item, movement, quantity, store, reference, actor, status | Authorized transaction read |
| Stores | GET | Backend-owned / TBD | Active status, pagination | Store identifier, code, name, location, manager, item count, stock status | Authorized store read |
| Work-order material requests | GET | Backend-owned / TBD | Store, work order, status, priority, pagination | Request, work order, asset, technician, item, quantities, priority, status, requested timestamp | Inventory and work-order material read |
| Work-order consumption | GET | Backend-owned / TBD | Store, work order, technician, date range, pagination | Work order, asset, technician, item, issued, consumed, returned, remaining, timestamp, status | Inventory and work-order material read |

All list responses need stable identifiers, explicit status values, backend-owned sorting, and pagination metadata. Dates must include timezone information. Quantity fields must include their unit of measure.

## Required transactional capabilities

### Goods receipt

- **Method:** POST
- **Path:** Backend-owned / TBD
- **Request:** store identifier, item identifier, quantity, unit, reference or purchase-order identifier when applicable, received timestamp, notes, idempotency key
- **Response:** committed receipt transaction, resulting authoritative balance, audit metadata
- **Validation:** valid active item/store, positive quantity, valid reference rules
- **Transaction behavior:** atomically persist the receipt, update stock, and write transaction/audit history

### Material issue

- **Method:** POST
- **Path:** Backend-owned / TBD
- **Request:** work-order identifier, material-request identifier when applicable, item identifier, store identifier, technician identifier, requested quantity, issue quantity, unit, reference, notes, idempotency key
- **Response:** committed issue transaction, resulting authoritative balance, updated work-order material state, audit metadata
- **Validation:** active work order, authorized technician/store, valid item, positive quantity, issue quantity not greater than backend-calculated availability
- **Transaction behavior:** lock or conditionally update stock, prevent negative quantity and duplicate issue, associate the issue with the work order and technician, and atomically write transaction/audit history

### Stock return

- **Method:** POST
- **Path:** Backend-owned / TBD
- **Request:** work-order identifier, original issue identifier, item identifier, store identifier, technician identifier, issued quantity, consumed quantity, return quantity, unit, reason, idempotency key
- **Response:** committed return transaction, resulting authoritative balance, updated consumption state, audit metadata
- **Validation:** return does not exceed eligible remaining quantity and references a valid issue
- **Transaction behavior:** atomically update stock, work-order consumption, transaction history, and audit history

### Stock transfer

- **Methods:** POST for request; backend-owned transition methods for approve, source issue, destination receipt, and completion
- **Paths:** Backend-owned / TBD
- **Request:** source store, destination store, item, quantity, requested date, requester, reason, idempotency key
- **Response:** transfer identifier, authoritative workflow status, timestamps, actors, source and destination transactions
- **Validation:** different active stores, valid item, positive quantity, sufficient source availability, authorized transition
- **Transaction behavior:** use an explicit state machine. Never report completion until the destination receipt commits

### Stock adjustment

- **Method:** POST
- **Path:** Backend-owned / TBD
- **Request:** item, store, expected current quantity/version, adjusted quantity or delta, adjustment type, reason, approver reference, idempotency key
- **Response:** committed adjustment, resulting authoritative balance, audit metadata
- **Validation:** authorized approver, mandatory reason, concurrency/version check, valid resulting stock
- **Transaction behavior:** reject stale balances and atomically write the adjustment and audit history

## Cross-cutting requirements

- Reuse the application's real session or bearer-token mechanism when one exists; do not introduce a second credential store.
- Enforce inventory permissions on the backend. Store-role navigation in the frontend is not an authorization boundary.
- Require idempotency keys for stock-changing requests and reject duplicate submissions.
- Use database transactions and row/version checks for balance changes.
- Return stable machine-readable error codes for validation, conflict, unauthorized, forbidden, unavailable, and duplicate request failures.
- Return authoritative post-transaction balances; the frontend must not calculate or commit stock changes independently.
- Record actor, timestamp, type, reference, item, store, quantity, reason where applicable, and correlation identifier in the existing audit infrastructure.
- Define canonical enums for item status, stock status, movement type, request status, transaction status, criticality, and transfer status.

## Frontend integration pending

Once concrete backend paths and schemas exist, the inventory page still needs:

1. A repository-standard authenticated API client.
2. Typed adapters for all read responses.
3. Server-side search, sort, filters, and pagination.
4. Loading, retry, error, and stale-data states driven by real requests.
5. Item details with real balance and history data.
6. Transaction forms with duplicate-submit protection and backend validation errors.
7. Cache invalidation or refetch after successful transactions.
8. Integration tests against the real work-order material workflow.
