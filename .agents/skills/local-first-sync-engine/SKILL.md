---
name: local-first-sync-engine
description: Architecture, state management, and offline-first queue synchronization for retail POS and ERPNext.
---

# Local-First Offline Sync Engine

## Overview
This skill governs local-first data architecture for high-velocity retail billing. It ensures POS terminals operate continuously without network latency, buffering offline transactions and syncing atomically with Frappe/ERPNext when online.

## Principles & Core Rules
1. **Zero Cashier Blocking:** The UI must NEVER freeze or disable the "Complete Bill" button due to network latency.
2. **Client-Generated UUIDs (`RULE-05`):** Every bill created on the client must generate an idempotent UUID (`crypto.randomUUID()`). Re-transmissions of the same UUID must return the existing record and NEVER duplicate stock deduction or accounts receivable entries.
3. **Outbox Pattern:** Offline invoices are written immediately to IndexedDB/Dexie in the `outbox` collection with `sync_status = 'pending'`.
4. **FIFO Reconnection Drain:** When network connectivity is restored, the outbox queue drains strictly in First-In-First-Out sequence using `sync.push` (`API-110`).
5. **Conflict Resolution:** Catalog updates pull deltas via timestamp (`since`). If a pricing conflict occurs while offline, the printed receipt price takes precedence to honor consumer price commitments under Legal Metrology laws.
