import frappe
from frappe import _
from easybill.api.v1 import response, error_response

DEFAULT_CATALOG = [
    {
        "code": "MED-001",
        "name": "Paracetamol 650mg",
        "name_ta": "பாரசிட்டமால் 650mg",
        "category": "Medicines",
        "hsn": "300490",
        "gst_rate": 12,
        "price": 35.00,
        "mrp": 38.00,
        "cost": 22.00,
        "unit": "Strip",
        "stock": 45,
        "min_stock": 10,
        "barcode": "8901234001",
        "status": "Active"
    },
    {
        "code": "MED-002",
        "name": "Amoxicillin 500mg",
        "name_ta": "அமாக்சிசிலின் 500mg",
        "category": "Medicines",
        "hsn": "300410",
        "gst_rate": 12,
        "price": 72.50,
        "mrp": 80.00,
        "cost": 48.00,
        "unit": "Strip",
        "stock": 20,
        "min_stock": 15,
        "barcode": "8901234002",
        "status": "Active"
    },
    {
        "code": "MED-003",
        "name": "Cetirizine 10mg",
        "name_ta": "செட்டிரிசின் 10mg",
        "category": "Medicines",
        "hsn": "300490",
        "gst_rate": 12,
        "price": 18.00,
        "mrp": 20.00,
        "cost": 10.00,
        "unit": "Strip",
        "stock": 60,
        "min_stock": 20,
        "barcode": "8901234003",
        "status": "Active"
    },
    {
        "code": "GEN-001",
        "name": "N95 Protective Mask",
        "name_ta": "N95 முகக்கவசம்",
        "category": "General",
        "hsn": "630790",
        "gst_rate": 5,
        "price": 25.00,
        "mrp": 30.00,
        "cost": 14.00,
        "unit": "Pcs",
        "stock": 120,
        "min_stock": 30,
        "barcode": "8901234004",
        "status": "Active"
    },
    {
        "code": "GEN-002",
        "name": "Cotton Roll 100g",
        "name_ta": "பஞ்சு 100g",
        "category": "General",
        "hsn": "300590",
        "gst_rate": 5,
        "price": 40.00,
        "mrp": 45.00,
        "cost": 26.00,
        "unit": "Roll",
        "stock": 25,
        "min_stock": 10,
        "barcode": "8901234005",
        "status": "Active"
    },
    {
        "code": "PER-001",
        "name": "Dettol Antiseptic 100ml",
        "name_ta": "டெட்டால் 100ml",
        "category": "Personal Care",
        "hsn": "380894",
        "gst_rate": 18,
        "price": 65.00,
        "mrp": 70.00,
        "cost": 49.00,
        "unit": "Bottle",
        "stock": 15,
        "min_stock": 8,
        "barcode": "8901234006",
        "status": "Active"
    },
    {
        "code": "BAB-001",
        "name": "Baby Gripe Water 130ml",
        "name_ta": "கிரைப் வாட்டர்",
        "category": "Baby Care",
        "hsn": "300490",
        "gst_rate": 12,
        "price": 48.00,
        "mrp": 52.00,
        "cost": 32.00,
        "unit": "Bottle",
        "stock": 30,
        "min_stock": 10,
        "barcode": "8901234007",
        "status": "Active"
    },
    {
        "code": "BAB-002",
        "name": "Digital Thermometer",
        "name_ta": "டிஜிட்டல் தெர்மாமீட்டர்",
        "category": "Baby Care",
        "hsn": "902519",
        "gst_rate": 18,
        "price": 180.00,
        "mrp": 220.00,
        "cost": 115.00,
        "unit": "Pcs",
        "stock": 8,
        "min_stock": 10,
        "barcode": "8901234008",
        "status": "Active"
    },
    {
        "code": "GEN-003",
        "name": "Surgical Gloves Latex (Box of 50)",
        "name_ta": "அறுவைசிகிச்சை கையுறைகள்",
        "category": "General",
        "hsn": "401511",
        "gst_rate": 12,
        "price": 320.00,
        "mrp": 350.00,
        "cost": 210.00,
        "unit": "Box",
        "stock": 12,
        "min_stock": 5,
        "barcode": "8901234009",
        "status": "Active"
    },
    {
        "code": "GEN-004",
        "name": "Hand Sanitizer 500ml",
        "name_ta": "கிருமிநாசினி 500ml",
        "category": "General",
        "hsn": "380894",
        "gst_rate": 18,
        "price": 125.00,
        "mrp": 150.00,
        "cost": 80.00,
        "unit": "Bottle",
        "stock": 4,
        "min_stock": 10,
        "barcode": "8901234010",
        "status": "Active"
    }
]

@frappe.whitelist()
def search(q="", category="", limit=100, **kwargs):
    """
    API-10: items.search
    Returns rows: code, name, name_ta, hsn, gst_rate, price, mrp, cost, unit, stock, min_stock, barcode, status
    """
    # If ERPNext Item table has records, read from ERPNext
    if frappe.db.count("Item") > 0:
        filters = {}
        if category and category != "All":
            filters["item_group"] = category
            
        items = frappe.get_all(
            "Item",
            filters=filters,
            fields=["name as code", "item_name as name", "item_group as category", "stock_uom as unit", "disabled"],
            limit=limit
        )
        
        # Enrich with price and stock
        rows = []
        for it in items:
            rate = frappe.db.get_value("Item Price", {"item_code": it.code, "price_list": "Standard Selling"}, "price_list_rate") or 0
            stock = frappe.db.get_value("Bin", {"item_code": it.code}, "actual_qty") or 0
            hsn = frappe.db.get_value("Item", it.code, "gst_hsn_code") or "3004"
            rows.append({
                "code": it.code,
                "name": it.name,
                "name_ta": "",
                "category": it.category,
                "hsn": hsn,
                "gst_rate": 12,
                "price": float(rate),
                "mrp": float(rate * 1.1),
                "cost": float(rate * 0.7),
                "unit": it.unit or "Pcs",
                "stock": float(stock),
                "min_stock": 10,
                "barcode": it.code,
                "status": "Inactive" if it.disabled else "Active"
            })
        return response(data={"rows": rows, "total": len(rows)})

    # Fallback to rich seed catalog
    res = []
    q_clean = (q or "").strip().lower()
    for item in DEFAULT_CATALOG:
        if category and category != "All" and item["category"] != category:
            continue
        if q_clean:
            match = (
                q_clean in item["name"].lower()
                or q_clean in item.get("name_ta", "").lower()
                or q_clean in item["code"].lower()
                or q_clean in item.get("barcode", "").lower()
                or q_clean in item["hsn"].lower()
            )
            if not match:
                continue
        res.append(item)

    return response(data={"rows": res, "total": len(res)})

@frappe.whitelist()
def save(item_data, **kwargs):
    """
    API-11: items.save
    Creates or updates an Item in ERPNext.
    """
    data = frappe.parse_json(item_data) if isinstance(item_data, str) else item_data
    if not data or not data.get("name"):
        return error_response("VALIDATION_ERROR", "Item Name is required", field="name")

    code = data.get("code") or ("ITEM-" + frappe.generate_hash(length=6).upper())
    
    # In ERPNext, create or update Item Doc
    if not frappe.db.exists("Item", code):
        doc = frappe.get_doc({
            "doctype": "Item",
            "item_code": code,
            "item_name": data.get("name"),
            "item_group": data.get("category", "All Item Groups"),
            "stock_uom": data.get("unit", "Nos"),
            "is_stock_item": 1,
            "gst_hsn_code": data.get("hsn", "3004")
        })
        doc.insert(ignore_permissions=True)
    else:
        doc = frappe.get_doc("Item", code)
        doc.item_name = data.get("name")
        doc.item_group = data.get("category", doc.item_group)
        doc.stock_uom = data.get("unit", doc.stock_uom)
        doc.gst_hsn_code = data.get("hsn", doc.gst_hsn_code)
        doc.save(ignore_permissions=True)

    # Set selling price
    if data.get("price"):
        price_name = frappe.db.get_value("Item Price", {"item_code": code, "price_list": "Standard Selling"})
        if price_name:
            p_doc = frappe.get_doc("Item Price", price_name)
            p_doc.price_list_rate = data.get("price")
            p_doc.save(ignore_permissions=True)
        else:
            p_doc = frappe.get_doc({
                "doctype": "Item Price",
                "item_code": code,
                "price_list": "Standard Selling",
                "price_list_rate": data.get("price")
            })
            p_doc.insert(ignore_permissions=True)

    return response(data={"code": code, "name": data.get("name"), "status": "Saved"})
