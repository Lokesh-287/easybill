---
name: financial-audit-tamper-guard
description: Security rules, RBAC enforcement, double-entry ledger immutability and anti-tamper audit guards for billing systems.
---

# Financial Audit & Tamper Guard

## Overview
Enforces financial data integrity, statutory ledger locks, role-based access control, and prevention of fraudulent alterations across all sales, purchase, cash, and tax workflows.

## Principles & Core Rules
1. **Role-Based Financial Redaction (`RULE-08`):**
   - Store Cashiers (`Staff`) have permission to enter quantities and collect payments, but purchase costs, supplier margins, markup percentages, and overall store profitability metrics are strictly withheld by API response filters.
   - Only `Owner` / `Administrator` roles may access P&L, expense approvals, and cashier shift discrepancy reports.
2. **Double-Entry Immutability:**
   - Once a `Sales Invoice` or `Purchase Invoice` is submitted (`docstatus = 1`), it can NEVER be updated in-place.
   - Adjustments must occur via linked reversal documents: Credit Notes (`SCR-E4`) or Debit Notes (`SCR-F3`).
   - Cancelled bills remain visible with strike-through typography and mandatory `cancel_reason` audit trails; hard deletes are prohibited.
3. **Duplicate Invoice Guard (`RULE-06` / `API-41`):**
   - Inward purchase bills must enforce unique `(supplier + supplier_bill_no + fiscal_year)` constraints.
   - Any duplicate submission immediately triggers `SCR-F4` warning modal and blocks stock ledger inflation.
4. **GSTIN Checksum & State Validation:**
   - All 15-character GSTINs must conform to statutory regex `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$` with 2-digit state code auto-detection.
