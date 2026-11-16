import frappe
from frappe import _
from easybill.api.v1 import response, error_response
import json
from datetime import datetime

DEFAULT_STOCK_INVENTORY = [
    {
        "item_code": "MED-001",
        "item_name": "Paracetamol 650mg",
        "name_ta": "பாரசிட்டமால் 650mg",
        "category": "Medicines",
        "warehouse": "Stores - EB",
        "qty_on_hand": 545,
        "valuation_rate": 22.00,
        "stock_value": 11990.00,
        "reorder_level": 50,
        "reorder_qty": 200,
        "unit": "Strip",
        "status": "In Stock",
        "batch_count": 2,
        "last_updated": "2026-11-15 14:30"
    },
    {
        "item_code": "MED-002",
        "item_name": "Amoxicillin 500mg",
        "name_ta": "அமாக்சிசிலின் 500mg",
        "category": "Medicines",
        "warehouse": "Stores - EB",
        "qty_on_hand": 120,
        "valuation_rate": 48.00,
        "stock_value": 5760.00,
        "reorder_level": 25,
        "reorder_qty": 100,
        "unit": "Strip",
        "status": "In Stock",
        "batch_count": 1,
        "last_updated": "2026-11-15 14:30"
    },
    {
        "item_code": "MED-003",
        "item_name": "Cetirizine 10mg",
        "name_ta": "செட்டிரிசின் 10mg",
        "category": "Medicines",
        "warehouse": "Stores - EB",
        "qty_on_hand": 130,
        "valuation_rate": 10.00,
        "stock_value": 1300.00,
        "reorder_level": 30,
        "reorder_qty": 100,
        "unit": "Strip",
        "status": "In Stock",
        "batch_count": 1,
        "last_updated": "2026-11-15 14:30"
    },
    {
        "item_code": "GEN-001",
        "item_name": "N95 Protective Mask",
        "name_ta": "N95 முகக்கவசம்",
        "category": "General",
        "warehouse": "Stores - EB",
        "qty_on_hand": 520,
        "valuation_rate": 14.00,
        "stock_value": 7280.00,
        "reorder_level": 100,
        "reorder_qty": 300,
        "unit": "Pcs",
        "status": "In Stock",
        "batch_count": 0,
        "last_updated": "2026-11-14 11:20"
    },
    {
        "item_code": "GEN-002",
        "item_name": "Cotton Roll 100g",
        "name_ta": "பஞ்சு 100g",
        "category": "General",
        "warehouse": "Stores - EB",
        "qty_on_hand": 60,
        "valuation_rate": 26.00,
        "stock_value": 1560.00,
        "reorder_level": 20,
        "reorder_qty": 50,
        "unit": "Roll",
        "status": "In Stock",
        "batch_count": 0,
        "last_updated": "2026-11-14 11:20"
    },
    {
        "item_code": "PER-001",
        "item_name": "Dettol Antiseptic 100ml",
        "name_ta": "டெட்டால் 100ml",
        "category": "Personal Care",
        "warehouse": "Stores - EB",
        "qty_on_hand": 115,
        "valuation_rate": 49.00,
        "stock_value": 5635.00,
        "reorder_level": 25,
        "reorder_qty": 50,
        "unit": "Bottle",
        "status": "In Stock",
        "batch_count": 1,
        "last_updated": "2026-11-14 11:20"
    },
    {
        "item_code": "BAB-001",
        "item_name": "Baby Gripe Water 130ml",
        "name_ta": "கிரைப் வாட்டர்",
        "category": "Baby Care",
        "warehouse": "Stores - EB",
        "qty_on_hand": 8,
        "valuation_rate": 32.00,
        "stock_value": 256.00,
        "reorder_level": 15,
        "reorder_qty": 30,
        "unit": "Bottle",
        "status": "Low Stock",
        "batch_count": 1,
        "last_updated": "2026-11-13 09:15"
    },
    {
        "item_code": "BAB-002",
        "item_name": "Digital Thermometer",
        "name_ta": "டிஜிட்டல் தெர்மாமீட்டர்",
        "category": "Baby Care",
        "warehouse": "Stores - EB",
        "qty_on_hand": 58,
        "valuation_rate": 115.00,
        "stock_value": 6670.00,
        "reorder_level": 15,
        "reorder_qty": 30,
        "unit": "Pcs",
        "status": "In Stock",
        "batch_count": 0,
        "last_updated": "2026-11-12 16:40"
    },
    {
        "item_code": "GEN-003",
        "item_name": "Surgical Gloves Latex (Box of 50)",
        "name_ta": "அறுவைசிகிச்சை கையுறைகள்",
        "category": "General",
        "warehouse": "Stores - EB",
        "qty_on_hand": 62,
        "valuation_rate": 210.00,
        "stock_value": 13020.00,
        "reorder_level": 10,
        "reorder_qty": 50,
        "unit": "Box",
        "status": "In Stock",
        "batch_count": 1,
        "last_updated": "2026-11-12 16:40"
    },
    {
        "item_code": "GEN-004",
        "item_name": "Hand Sanitizer 500ml",
        "name_ta": "கிருமிநாசினி 500ml",
        "category": "General",
        "warehouse": "Stores - EB",
        "qty_on_hand": 0,
        "valuation_rate": 85.00,
        "stock_value": 0.00,
        "reorder_level": 20,
        "reorder_qty": 50,
        "unit": "Bottle",
        "status": "Out of Stock",
        "batch_count": 0,
        "last_updated": "2026-11-13 17:00"
    }
]

DEFAULT_LEDGER = [
    {
        "id": "SLE-2026-0001",
        "item_code": "MED-001",
        "item_name": "Paracetamol 650mg",
        "date": "2026-11-15 14:30",
        "voucher_type": "Purchase Invoice",
        "voucher_no": "PUR-2026-0001",
        "warehouse": "Stores - EB",
        "inward_qty": 500,
        "outward_qty": 0,
        "balance_qty": 545,
        "valuation_rate": 22.00,
        "remarks": "Inward purchase from MediPharma Distributors (Inv: INV-88912)"
    },
    {
        "id": "SLE-2026-0002",
        "item_code": "MED-001",
        "item_name": "Paracetamol 650mg",
        "date": "2026-11-15 10:12",
        "voucher_type": "Sales Invoice",
        "voucher_no": "INV-2026-0002",
        "warehouse": "Stores - EB",
        "inward_qty": 0,
        "outward_qty": 5,
        "balance_qty": 45,
        "valuation_rate": 22.00,
        "remarks": "POS Retail sale to Walk-in Customer"
    },
    {
        "id": "SLE-2026-0003",
        "item_code": "GEN-004",
        "item_name": "Hand Sanitizer 500ml",
        "date": "2026-11-13 17:00",
        "voucher_type": "Purchase Return",
        "voucher_no": "RET-DRG-11",
        "warehouse": "Stores - EB",
        "inward_qty": 0,
        "outward_qty": 32,
        "balance_qty": 0,
        "valuation_rate": 85.00,
        "remarks": "Returned damaged in transit bottles to South India Drug House"
    }
]

@frappe.whitelist(allow_guest=True)
def get_summary(warehouse=None, category=None, status=None, q=None):
    """
    API-50: stock.summary
    Returns current stock levels, valuation rates, reorder alerts and valuation metrics.
    """
    items = list(DEFAULT_STOCK_INVENTORY)

    # In ERPNext, if Bin records exist, merge real counts
    try:
        bins = frappe.db.get_all(
            "Bin",
            fields=["item_code", "warehouse", "actual_qty", "valuation_rate", "stock_value"],
            limit=50
        )
        bin_map = {b.item_code: b for b in bins}
        for itm in items:
            if itm["item_code"] in bin_map:
                b = bin_map[itm["item_code"]]
                itm["qty_on_hand"] = float(b.actual_qty or 0)
                itm["valuation_rate"] = float(b.valuation_rate or itm["valuation_rate"])
                itm["stock_value"] = float(b.stock_value or (itm["qty_on_hand"] * itm["valuation_rate"]))
                if itm["qty_on_hand"] <= 0:
                    itm["status"] = "Out of Stock"
                elif itm["qty_on_hand"] <= itm["reorder_level"]:
                    itm["status"] = "Low Stock"
                else:
                    itm["status"] = "In Stock"
    except Exception:
        pass

    filtered = []
    for itm in items:
        # Search query
        if q:
            query = q.lower().strip()
            match = (
                query in itm["item_code"].lower() or
                query in itm["item_name"].lower() or
                query in itm.get("name_ta", "").lower() or
                query in itm["category"].lower()
            )
            if not match:
                continue

        # Warehouse filter
        if warehouse and warehouse != "All" and itm["warehouse"] != warehouse:
            continue

        # Category filter
        if category and category != "All" and itm["category"] != category:
            continue

        # Status filter
        if status and status != "All":
            if status == "Low Stock" and itm["status"] != "Low Stock":
                continue
            elif status == "Out of Stock" and itm["status"] != "Out of Stock":
                continue
            elif status == "In Stock" and itm["status"] != "In Stock":
                continue

        filtered.append(itm)

    # Metrics
    total_valuation = sum(i["stock_value"] for i in items)
    total_qty = sum(i["qty_on_hand"] for i in items)
    low_stock = sum(1 for i in items if i["status"] == "Low Stock")
    out_of_stock = sum(1 for i in items if i["status"] == "Out of Stock")

    return response(ok=True, data={
        "rows": filtered,
        "kpis": {
            "total_valuation": round(total_valuation, 2),
            "total_qty": round(total_qty, 0),
            "catalog_count": len(items),
            "low_stock_count": low_stock,
            "out_of_stock_count": out_of_stock
        }
    })

@frappe.whitelist(allow_guest=True)
def get_ledger(item_code=None):
    """
    API-50: stock.ledger
    Returns chronological stock ledger entries for a specific item.
    """
    if not item_code:
        return response(ok=True, data=DEFAULT_LEDGER)

    entries = [e for e in DEFAULT_LEDGER if e["item_code"] == item_code]
    return response(ok=True, data=entries)

@frappe.whitelist(allow_guest=True)
def adjust_stock(data=None):
    """
    API-51: stock.adjust
    Adjusts stock count with physical count discrepancy, breakage, or opening balance.
    """
    if isinstance(data, str):
        data = json.loads(data)

    item_code = data.get("item_code")
    actual_qty = float(data.get("actual_qty", 0))
    reason = data.get("reason", "Physical Count Discrepancy")
    notes = data.get("notes", "")

    if not item_code:
        return error_response("MISSING_ITEM", "Item Code is required")

    found = None
    for itm in DEFAULT_STOCK_INVENTORY:
        if itm["item_code"] == item_code:
            found = itm
            break

    if not found:
        return error_response("NOT_FOUND", f"Item {item_code} not found")

    old_qty = found["qty_on_hand"]
    diff_qty = actual_qty - old_qty
    found["qty_on_hand"] = actual_qty
    found["stock_value"] = round(actual_qty * found["valuation_rate"], 2)
    found["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M")

    if actual_qty <= 0:
        found["status"] = "Out of Stock"
    elif actual_qty <= found["reorder_level"]:
        found["status"] = "Low Stock"
    else:
        found["status"] = "In Stock"

    # Add to ledger
    ledger_entry = {
        "id": f"SLE-2026-{len(DEFAULT_LEDGER) + 1:04d}",
        "item_code": item_code,
        "item_name": found["item_name"],
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "voucher_type": "Stock Adjustment",
        "voucher_no": f"ADJ-2026-{len(DEFAULT_LEDGER) + 1:04d}",
        "warehouse": found["warehouse"],
        "inward_qty": diff_qty if diff_qty > 0 else 0,
        "outward_qty": abs(diff_qty) if diff_qty < 0 else 0,
        "balance_qty": actual_qty,
        "valuation_rate": found["valuation_rate"],
        "remarks": f"Stock adjustment: {reason} ({notes or 'Direct adjustment'})"
    }
    DEFAULT_LEDGER.insert(0, ledger_entry)

    return response(ok=True, data={
        "item_code": item_code,
        "old_qty": old_qty,
        "actual_qty": actual_qty,
        "diff_qty": diff_qty,
        "new_stock_value": found["stock_value"],
        "message": f"Stock for {found['item_name']} updated to {actual_qty} {found['unit']}"
    })
