---
name: accounting-e2e-reconciler
description: Automated accounting reconciliation tests, mathematical ledger invariants, and Puppeteer visual regression verification.
---

# Accounting E2E Reconciler

## Overview
Automated quality assurance framework specifically tailored for accounting accuracy, tax breakdown validation, day book cash drawer balance verification, and headless browser visual tests.

## Verification Checklist & Invariants
1. **Mathematical Invariant Test:**
   ```
   Grand Total == Taxable Amount + CGST + SGST + IGST + Roundoff
   ```
   No floating point drift allowed; every calculation must be checked with 2-decimal rounded precision.
2. **Cash Drawer Balancing Equation:**
   ```
   Expected Cash == Opening Float + Cash Inflows - Cash Outflows
   Variance == Physical Counted Total - Expected Cash
   ```
3. **Headless Visual Suite:**
   - Execute Puppeteer automated journeys through all 12 application screens.
   - Assert critical UI elements render in < 300 ms.
   - Capture regression artifact screenshots across viewport sizes (1440x900 desktop and 390x844 mobile).
4. **Offline Resilience Test:**
   - Simulate `navigator.onLine = false` during active cart checkout.
   - Assert provisional invoice receipt prints locally with clock icon (*Pending Push*).
   - Simulate network restoration and assert queue flushes to server without data loss.
