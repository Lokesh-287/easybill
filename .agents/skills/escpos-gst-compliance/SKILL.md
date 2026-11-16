---
name: escpos-gst-compliance
description: Hardware driver standards for ESC/POS thermal printers, RJ11 cash drawer pulses, and India GST statutory JSON schemas.
---

# ESC/POS Thermal Printing & GST Compliance

## Overview
Low-level peripheral control and statutory government compliance standards for Indian retail operations.

## Thermal Printer Protocols & Specs
1. **Paper Roll Profiles:**
   - **80mm Roll:** 48 monospace characters per line. Standard for supermarket and pharmacy itemized receipts.
   - **58mm Roll:** 32 monospace characters per line. Compact slip format for quick retail counters.
2. **ESC/POS Command Sequences:**
   - Initialize: `\x1b\x40`
   - Center Align: `\x1b\x61\x01`
   - Bold Text On / Off: `\x1b\x45\x01` / `\x1b\x45\x00`
   - Cash Drawer Kick (RJ11 Pin 2 Solenoid): `\x1b\x70\x00\x19\xfa`
   - Partial Paper Cut: `\x1d\x56\x41\x00`
3. **Bilingual Unicode Printing:**
   - For non-ASCII Tamil characters, render text to high-contrast monochrome canvas bitmap and stream via ESC/POS raster bit image command `\x1d\x76\x30\x00`.

## Statutory GST Engine Standards
1. **Tax Split Logic:**
   - First 2 digits of Customer GSTIN match Store GSTIN State Code -> Intra-state (`CGST` + `SGST` equally split).
   - First 2 digits differ -> Inter-state (`IGST`).
2. **GSTR-1 JSON Schema v1.3:**
   - Validates B2B (`ctin`, `inum`, `idt`, `val`, `pos`, `rchrg`, `itms`), B2CS (`sply_ty`, `rt`, `pos`, `txval`, `camt`, `samt`), and Table 12 HSN summaries (`hsn_sc`, `desc`, `uqc`, `qty`, `val`, `txval`, `camt`, `samt`, `iamt`).
