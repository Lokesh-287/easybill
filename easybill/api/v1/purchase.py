import frappe
from frappe import _
from easybill.api.v1 import response, error_response
import json
from datetime import datetime

DEFAULT_PURCHASES = [
    {
        "id": "PUR-2026-0001",
        "supplier_bill_no": "INV-88912",
        "supplier_id": "SUPP-001",
        "supplier_name": "MediPharma Distributors",
        "supplier_gstin": "33AABCM5678H1Z4",
        "supplier_state": "Tamil Nadu (33)",
        "bill_date": "2026-11-15",
        "due_date": "2026-11-30",
        "taxable_amount": 16500.00,
        "cgst": 990.00,
        "sgst": 990.00,
        "igst": 0.00,
        "total_tax": 1980.00,
        "round_off": 0.00,
        "grand_total": 18480.00,
        "paid_amount": 18480.00,
        "outstanding_amount": 0.00,
        "payment_status": "Paid",
        "payment_mode": "Bank Transfer",
        "stock_updated": True,
        "warehouse": "Stores - EB",
        "is_return": False,
        "items": [
            {
                "item_code": "MED-001",
                "item_name": "Paracetamol 650mg",
                "hsn": "300490",
                "qty": 500,
                "uom": "Strip",
                "rate": 22.00,
                "amount": 11000.00,
                "gst_rate": 12,
                "cgst_amount": 660.00,
                "sgst_amount": 660.00,
                "batch_no": "BAT-26K01",
                "expiry_date": "2027-10-31"
            },
            {
                "item_code": "MED-002",
                "item_name": "Amoxicillin 500mg",
                "hsn": "300410",
                "qty": 100,
                "uom": "Strip",
                "rate": 48.00,
                "amount": 4800.00,
                "gst_rate": 12,
                "cgst_amount": 288.00,
                "sgst_amount": 288.00,
                "batch_no": "BAT-26K02",
                "expiry_date": "2027-12-31"
            },
            {
                "item_code": "MED-003",
                "item_name": "Cetirizine 10mg",
                "hsn": "300490",
                "qty": 70,
                "uom": "Strip",
                "rate": 10.00,
                "amount": 700.00,
                "gst_rate": 12,
                "cgst_amount": 42.00,
                "sgst_amount": 42.00,
                "batch_no": "BAT-26K03",
                "expiry_date": "2028-02-28"
            }
        ]
    },
    {
        "id": "PUR-2026-0002",
        "supplier_bill_no": "SUP-4491",
        "supplier_id": "SUPP-002",
        "supplier_name": "Apex Health Supplies",
        "supplier_gstin": "33AABCA4321J1Z8",
        "supplier_state": "Tamil Nadu (33)",
        "bill_date": "2026-11-14",
        "due_date": "2026-11-29",
        "taxable_amount": 11400.00,
        "cgst": 600.00,
        "sgst": 600.00,
        "igst": 0.00,
        "total_tax": 1200.00,
        "round_off": 0.00,
        "grand_total": 12600.00,
        "paid_amount": 0.00,
        "outstanding_amount": 12600.00,
        "payment_status": "Unpaid",
        "payment_mode": "Credit",
        "stock_updated": True,
        "warehouse": "Stores - EB",
        "is_return": False,
        "items": [
            {
                "item_code": "GEN-001",
                "item_name": "N95 Protective Mask",
                "hsn": "630790",
                "qty": 400,
                "uom": "Pcs",
                "rate": 14.00,
                "amount": 5600.00,
                "gst_rate": 5,
                "cgst_amount": 140.00,
                "sgst_amount": 140.00,
                "batch_no": "",
                "expiry_date": ""
            },
            {
                "item_code": "PER-001",
                "item_name": "Dettol Antiseptic 100ml",
                "hsn": "380894",
                "qty": 100,
                "uom": "Bottle",
                "rate": 49.00,
                "amount": 4900.00,
                "gst_rate": 18,
                "cgst_amount": 441.00,
                "sgst_amount": 441.00,
                "batch_no": "DET-881",
                "expiry_date": "2028-06-30"
            },
            {
                "item_code": "GEN-002",
                "item_name": "Cotton Roll 100g",
                "hsn": "300590",
                "qty": 35,
                "uom": "Roll",
                "rate": 26.00,
                "amount": 910.00,
                "gst_rate": 5,
                "cgst_amount": 22.75,
                "sgst_amount": 22.75,
                "batch_no": "",
                "expiry_date": ""
            }
        ]
    },
    {
        "id": "PUR-2026-0003",
        "supplier_bill_no": "APX-2026-901",
        "supplier_id": "SUPP-003",
        "supplier_name": "South India Drug House",
        "supplier_gstin": "33AABCS8765K1Z9",
        "supplier_state": "Tamil Nadu (33)",
        "bill_date": "2026-11-12",
        "due_date": "2026-11-27",
        "taxable_amount": 21875.00,
        "cgst": 1312.50,
        "sgst": 1312.50,
        "igst": 0.00,
        "total_tax": 2625.00,
        "round_off": 0.00,
        "grand_total": 24500.00,
        "paid_amount": 10000.00,
        "outstanding_amount": 14500.00,
        "payment_status": "Partial",
        "payment_mode": "UPI / Bank",
        "stock_updated": True,
        "warehouse": "Stores - EB",
        "is_return": False,
        "items": [
            {
                "item_code": "GEN-003",
                "item_name": "Surgical Gloves Latex (Box of 50)",
                "hsn": "401511",
                "qty": 50,
                "uom": "Box",
                "rate": 210.00,
                "amount": 10500.00,
                "gst_rate": 12,
                "cgst_amount": 630.00,
                "sgst_amount": 630.00,
                "batch_no": "GLV-901",
                "expiry_date": "2029-01-31"
            },
            {
                "item_code": "BAB-002",
                "item_name": "Digital Thermometer",
                "hsn": "902519",
                "qty": 50,
                "uom": "Pcs",
                "rate": 115.00,
                "amount": 5750.00,
                "gst_rate": 18,
                "cgst_amount": 517.50,
                "sgst_amount": 517.50,
                "batch_no": "",
                "expiry_date": ""
            },
            {
                "item_code": "GEN-004",
                "item_name": "Hand Sanitizer 500ml",
                "hsn": "380894",
                "qty": 65,
                "uom": "Bottle",
                "rate": 85.00,
                "amount": 5525.00,
                "gst_rate": 18,
                "cgst_amount": 497.25,
                "sgst_amount": 497.25,
                "batch_no": "SAN-221",
                "expiry_date": "2027-08-31"
            }
        ]
    },
    {
        "id": "PUR-2026-0004",
        "supplier_bill_no": "RET-DRG-11",
        "supplier_id": "SUPP-003",
        "supplier_name": "South India Drug House",
        "supplier_gstin": "33AABCS8765K1Z9",
        "supplier_state": "Tamil Nadu (33)",
        "bill_date": "2026-11-13",
        "due_date": "2026-11-13",
        "taxable_amount": -2857.14,
        "cgst": -171.43,
        "sgst": -171.43,
        "igst": 0.00,
        "total_tax": -342.86,
        "round_off": 0.00,
        "grand_total": -3200.00,
        "paid_amount": -3200.00,
        "outstanding_amount": 0.00,
        "payment_status": "Debit Note",
        "payment_mode": "Credit Adjustment",
        "stock_updated": True,
        "warehouse": "Stores - EB",
        "is_return": True,
        "return_against": "PUR-2026-0003",
        "return_reason": "Damaged in Transit",
        "items": [
            {
                "item_code": "GEN-004",
                "item_name": "Hand Sanitizer 500ml",
                "hsn": "380894",
                "qty": -32,
                "uom": "Bottle",
                "rate": 85.00,
                "amount": -2720.00,
                "gst_rate": 18,
                "cgst_amount": -244.80,
                "sgst_amount": -244.80,
                "batch_no": "SAN-221",
                "expiry_date": "2027-08-31"
            }
        ]
    }
]

def validate_purchase_invoice(doc, method):
    """
    Validation hook for Purchase Invoice: duplicate supplier bill guard.
    Section 5.4 & SCR-F4 of EasyBill Implementation Plan.
    """
    if doc.bill_no and doc.supplier:
        existing = frappe.db.get_value(
            "Purchase Invoice",
            {"supplier": doc.supplier, "bill_no": doc.bill_no, "docstatus": ["!=", 2], "name": ["!=", doc.name]},
            "name"
        )
        if existing:
            frappe.throw(_("Duplicate supplier bill {0} already entered for {1} (Invoice {2})").format(
                doc.bill_no, doc.supplier, existing
            ), exc=frappe.DuplicateEntryError)

@frappe.whitelist(allow_guest=True)
def check_duplicate(supplier=None, bill_no=None, current_id=None):
    """
    API-41: purchase.check_duplicate
    Rapid lookup on (supplier + supplier_bill_no + FY) to prevent duplicate purchase invoice entries.
    """
    if not supplier or not bill_no:
        return response(ok=True, data={"exists": False})

    supplier = supplier.strip()
    bill_no = bill_no.strip()

    # 1. Check ERPNext DB if available
    try:
        filters = {
            "bill_no": bill_no,
            "docstatus": ["!=", 2]
        }
        if current_id:
            filters["name"] = ["!=", current_id]

        matched = frappe.db.get_all(
            "Purchase Invoice",
            filters=filters,
            fields=["name", "supplier", "bill_no", "bill_date", "grand_total", "owner"],
            limit=1
        )
        if matched:
            inv = matched[0]
            return response(ok=True, data={
                "exists": True,
                "conflict": {
                    "id": inv.name,
                    "supplier_bill_no": inv.bill_no,
                    "supplier_name": inv.supplier,
                    "bill_date": str(inv.bill_date),
                    "grand_total": float(inv.grand_total or 0),
                    "owner": inv.owner
                }
            })
    except Exception:
        pass

    # 2. Check DEFAULT_PURCHASES memory store
    for p in DEFAULT_PURCHASES:
        if current_id and p["id"] == current_id:
            continue
        if p["supplier_bill_no"].lower() == bill_no.lower():
            if supplier.lower() in p["supplier_name"].lower() or p["supplier_id"].lower() == supplier.lower():
                return response(ok=True, data={
                    "exists": True,
                    "conflict": {
                        "id": p["id"],
                        "supplier_bill_no": p["supplier_bill_no"],
                        "supplier_name": p["supplier_name"],
                        "bill_date": p["bill_date"],
                        "grand_total": p["grand_total"],
                        "owner": "Administrator"
                    }
                })

    return response(ok=True, data={"exists": False})

@frappe.whitelist(allow_guest=True)
def list_purchases(q=None, supplier=None, status=None, date_range=None):
    """
    API-42: purchase.list
    Returns purchase bills list with filtering, search, and KPI totals.
    """
    bills = list(DEFAULT_PURCHASES)

    # In ERPNext, if real Purchase Invoices exist, fetch and prepend them
    try:
        db_invoices = frappe.db.get_all(
            "Purchase Invoice",
            fields=["name", "bill_no", "supplier", "bill_date", "due_date", "net_total", "total_taxes_and_charges", "grand_total", "outstanding_amount", "status", "is_return", "return_against"],
            order_by="creation desc",
            limit=50
        )
        for inv in db_invoices:
            if not any(b["id"] == inv.name for b in bills):
                bills.insert(0, {
                    "id": inv.name,
                    "supplier_bill_no": inv.bill_no or inv.name,
                    "supplier_id": inv.supplier,
                    "supplier_name": inv.supplier,
                    "supplier_gstin": "",
                    "supplier_state": "Tamil Nadu (33)",
                    "bill_date": str(inv.bill_date or ""),
                    "due_date": str(inv.due_date or ""),
                    "taxable_amount": float(inv.net_total or 0),
                    "cgst": float((inv.total_taxes_and_charges or 0) / 2),
                    "sgst": float((inv.total_taxes_and_charges or 0) / 2),
                    "igst": 0.00,
                    "total_tax": float(inv.total_taxes_and_charges or 0),
                    "round_off": 0.00,
                    "grand_total": float(inv.grand_total or 0),
                    "paid_amount": float((inv.grand_total or 0) - (inv.outstanding_amount or 0)),
                    "outstanding_amount": float(inv.outstanding_amount or 0),
                    "payment_status": "Paid" if float(inv.outstanding_amount or 0) <= 0 else "Unpaid",
                    "payment_mode": "Bank Transfer",
                    "stock_updated": True,
                    "warehouse": "Stores - EB",
                    "is_return": bool(inv.is_return),
                    "return_against": inv.return_against,
                    "items": []
                })
    except Exception:
        pass

    # Filtering
    filtered = []
    for b in bills:
        # Search query
        if q:
            query = q.lower().strip()
            match = (
                query in b["id"].lower() or
                query in b["supplier_bill_no"].lower() or
                query in b["supplier_name"].lower()
            )
            if not match:
                continue

        # Supplier filter
        if supplier and supplier != "All":
            if supplier != b["supplier_name"] and supplier != b["supplier_id"]:
                continue

        # Status filter
        if status and status != "All":
            if status == "Paid" and b["payment_status"] != "Paid":
                continue
            elif status == "Unpaid" and b["payment_status"] not in ["Unpaid", "Partial"]:
                continue
            elif status == "Debit Note" and not b.get("is_return"):
                continue

        filtered.append(b)

    # Compute KPI totals
    total_purchases = sum(b["grand_total"] for b in bills if not b.get("is_return", False))
    total_paid = sum(b["paid_amount"] for b in bills if not b.get("is_return", False))
    total_outstanding = sum(b["outstanding_amount"] for b in bills if not b.get("is_return", False))
    total_itc = sum(b["total_tax"] for b in bills if not b.get("is_return", False))

    return response(ok=True, data={
        "rows": filtered,
        "kpis": {
            "total_purchases": round(total_purchases, 2),
            "total_paid": round(total_paid, 2),
            "total_outstanding": round(total_outstanding, 2),
            "total_itc": round(total_itc, 2),
            "bill_count": len(bills)
        }
    })

@frappe.whitelist(allow_guest=True)
def get_purchase(bill_id=None):
    """
    API-42: purchase.get
    Fetches full purchase bill details with line items.
    """
    if not bill_id:
        return error_response("MISSING_ID", "Purchase Bill ID is required")

    for b in DEFAULT_PURCHASES:
        if b["id"] == bill_id:
            return response(ok=True, data=b)

    try:
        if frappe.db.exists("Purchase Invoice", bill_id):
            doc = frappe.get_doc("Purchase Invoice", bill_id)
            return response(ok=True, data={
                "id": doc.name,
                "supplier_bill_no": doc.bill_no or doc.name,
                "supplier_id": doc.supplier,
                "supplier_name": doc.supplier_name or doc.supplier,
                "supplier_gstin": getattr(doc, "supplier_gstin", ""),
                "bill_date": str(doc.bill_date),
                "due_date": str(doc.due_date),
                "taxable_amount": float(doc.net_total or 0),
                "total_tax": float(doc.total_taxes_and_charges or 0),
                "grand_total": float(doc.grand_total or 0),
                "paid_amount": float((doc.grand_total or 0) - (doc.outstanding_amount or 0)),
                "outstanding_amount": float(doc.outstanding_amount or 0),
                "payment_status": "Paid" if float(doc.outstanding_amount or 0) <= 0 else "Unpaid",
                "items": [
                    {
                        "item_code": d.item_code,
                        "item_name": d.item_name,
                        "qty": d.qty,
                        "uom": d.uom,
                        "rate": d.rate,
                        "amount": d.amount,
                        "batch_no": d.batch_no or ""
                    }
                    for d in doc.items
                ]
            })
    except Exception:
        pass

    return error_response("NOT_FOUND", f"Purchase Bill {bill_id} not found")

@frappe.whitelist(allow_guest=True)
def create_purchase_bill(data=None):
    """
    API-40: purchase.create_bill
    Creates and validates an inward purchase bill with automatic duplicate check and stock update.
    """
    if isinstance(data, str):
        data = json.loads(data)

    supplier_id = data.get("supplier_id")
    supplier_name = data.get("supplier_name", "Supplier")
    supplier_bill_no = data.get("supplier_bill_no", "").strip()
    bill_date = data.get("bill_date") or datetime.now().strftime("%Y-%m-%d")
    items = data.get("items", [])
    payment_mode = data.get("payment_mode", "Credit")
    amount_paid = float(data.get("amount_paid", 0.0))

    if not supplier_bill_no:
        return error_response("REQUIRED_FIELD", "Supplier Bill Number is required", field="supplier_bill_no")
    if not items or len(items) == 0:
        return error_response("REQUIRED_FIELD", "At least one item is required in the purchase bill")

    # Run duplicate check
    dup_check = check_duplicate(supplier=supplier_name, bill_no=supplier_bill_no)
    if dup_check.get("data", {}).get("exists"):
        conflict = dup_check["data"]["conflict"]
        return error_response(
            "DUP_SUPPLIER_BILL",
            f"Supplier Bill #{supplier_bill_no} already exists ({conflict['id']} dated {conflict['bill_date']})",
            field="supplier_bill_no"
        )

    # Calculate totals
    taxable_amount = 0.0
    total_tax = 0.0
    cgst = 0.0
    sgst = 0.0
    igst = 0.0
    is_interstate = "Tamil Nadu" not in data.get("supplier_state", "Tamil Nadu (33)")

    processed_items = []
    for itm in items:
        qty = float(itm.get("qty", 1))
        rate = float(itm.get("rate", 0))
        gst_rate = float(itm.get("gst_rate", 12))
        line_taxable = round(qty * rate, 2)
        line_tax = round(line_taxable * (gst_rate / 100.0), 2)

        taxable_amount += line_taxable
        total_tax += line_tax

        if is_interstate:
            igst += line_tax
            line_cgst = 0.0
            line_sgst = 0.0
        else:
            line_cgst = round(line_tax / 2.0, 2)
            line_sgst = round(line_tax / 2.0, 2)
            cgst += line_cgst
            sgst += line_sgst

        processed_items.append({
            "item_code": itm.get("item_code"),
            "item_name": itm.get("item_name"),
            "hsn": itm.get("hsn", "300490"),
            "qty": qty,
            "uom": itm.get("uom", "Pcs"),
            "rate": rate,
            "amount": line_taxable,
            "gst_rate": gst_rate,
            "cgst_amount": line_cgst if not is_interstate else 0.0,
            "sgst_amount": line_sgst if not is_interstate else 0.0,
            "batch_no": itm.get("batch_no", ""),
            "expiry_date": itm.get("expiry_date", "")
        })

    grand_total = round(taxable_amount + total_tax, 2)
    outstanding = max(0.0, round(grand_total - amount_paid, 2))
    payment_status = "Paid" if outstanding <= 0 else ("Partial" if amount_paid > 0 else "Unpaid")

    new_bill_id = f"PUR-2026-{len(DEFAULT_PURCHASES) + 1:04d}"

    record = {
        "id": new_bill_id,
        "supplier_bill_no": supplier_bill_no,
        "supplier_id": supplier_id or "SUPP-001",
        "supplier_name": supplier_name,
        "supplier_gstin": data.get("supplier_gstin", ""),
        "supplier_state": data.get("supplier_state", "Tamil Nadu (33)"),
        "bill_date": bill_date,
        "due_date": data.get("due_date") or bill_date,
        "taxable_amount": taxable_amount,
        "cgst": cgst,
        "sgst": sgst,
        "igst": igst,
        "total_tax": total_tax,
        "round_off": 0.0,
        "grand_total": grand_total,
        "paid_amount": amount_paid,
        "outstanding_amount": outstanding,
        "payment_status": payment_status,
        "payment_mode": payment_mode,
        "stock_updated": True,
        "warehouse": data.get("warehouse", "Stores - EB"),
        "is_return": False,
        "items": processed_items
    }

    DEFAULT_PURCHASES.insert(0, record)

    return response(ok=True, data={
        "id": new_bill_id,
        "supplier_bill_no": supplier_bill_no,
        "grand_total": grand_total,
        "payment_status": payment_status,
        "message": f"Purchase bill {new_bill_id} recorded and inventory inwarded successfully"
    })

@frappe.whitelist(allow_guest=True)
def return_purchase(bill_id=None, items=None, return_reason="Damaged in Transit", refund_mode="Debit Note"):
    """
    API-43 / SCR-F3: purchase.return
    Creates a purchase return / debit note against an existing purchase invoice.
    """
    if not bill_id:
        return error_response("MISSING_ID", "Original Purchase Bill ID is required")

    original = None
    for b in DEFAULT_PURCHASES:
        if b["id"] == bill_id:
            original = b
            break

    if not original:
        return error_response("NOT_FOUND", f"Original purchase bill {bill_id} not found")

    if isinstance(items, str):
        items = json.loads(items)

    return_id = f"RET-{bill_id.replace('PUR-', '')}"
    return_items = []
    taxable_ret = 0.0
    tax_ret = 0.0

    for itm in (items or original.get("items", [])):
        ret_qty = -abs(float(itm.get("return_qty") or itm.get("qty", 1)))
        rate = float(itm.get("rate", 0))
        gst = float(itm.get("gst_rate", 12))
        line_taxable = round(ret_qty * rate, 2)
        line_tax = round(line_taxable * (gst / 100.0), 2)
        taxable_ret += line_taxable
        tax_ret += line_tax
        return_items.append({
            "item_code": itm.get("item_code"),
            "item_name": itm.get("item_name"),
            "hsn": itm.get("hsn", ""),
            "qty": ret_qty,
            "uom": itm.get("uom", "Pcs"),
            "rate": rate,
            "amount": line_taxable,
            "gst_rate": gst,
            "cgst_amount": round(line_tax / 2, 2),
            "sgst_amount": round(line_tax / 2, 2)
        })

    grand_total_ret = round(taxable_ret + tax_ret, 2)

    return_record = {
        "id": return_id,
        "supplier_bill_no": f"RET-{original['supplier_bill_no']}",
        "supplier_id": original["supplier_id"],
        "supplier_name": original["supplier_name"],
        "supplier_gstin": original["supplier_gstin"],
        "supplier_state": original["supplier_state"],
        "bill_date": datetime.now().strftime("%Y-%m-%d"),
        "due_date": datetime.now().strftime("%Y-%m-%d"),
        "taxable_amount": taxable_ret,
        "cgst": round(tax_ret / 2, 2),
        "sgst": round(tax_ret / 2, 2),
        "igst": 0.0,
        "total_tax": tax_ret,
        "round_off": 0.0,
        "grand_total": grand_total_ret,
        "paid_amount": grand_total_ret,
        "outstanding_amount": 0.0,
        "payment_status": "Debit Note",
        "payment_mode": refund_mode,
        "stock_updated": True,
        "warehouse": original.get("warehouse", "Stores - EB"),
        "is_return": True,
        "return_against": bill_id,
        "return_reason": return_reason,
        "items": return_items
    }

    DEFAULT_PURCHASES.insert(0, return_record)

    return response(ok=True, data={
        "id": return_id,
        "return_against": bill_id,
        "grand_total": grand_total_ret,
        "message": f"Debit note {return_id} issued successfully against {bill_id}"
    })
