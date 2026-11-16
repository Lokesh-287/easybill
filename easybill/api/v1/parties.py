import frappe
from frappe import _
from easybill.api.v1 import response, error_response

DEFAULT_PARTIES = [
    {
        "id": "CUST-001",
        "name": "Walk-in Customer",
        "type": "Customer",
        "phone": "",
        "city": "Coimbatore",
        "state": "Tamil Nadu (33)",
        "gstin": "",
        "balance": 0.00,
        "credit_limit": 0.00,
        "balance_type": "None",
        "status": "Active"
    },
    {
        "id": "CUST-002",
        "name": "Ramesh Kumar (Retail)",
        "type": "Customer",
        "phone": "9842109876",
        "city": "Coimbatore",
        "state": "Tamil Nadu (33)",
        "gstin": "",
        "balance": 0.00,
        "credit_limit": 5000.00,
        "balance_type": "None",
        "status": "Active"
    },
    {
        "id": "CUST-003",
        "name": "Priya Traders",
        "type": "Customer",
        "phone": "9443211223",
        "city": "Tiruppur",
        "state": "Tamil Nadu (33)",
        "gstin": "33AABCP1234F1Z1",
        "balance": 4704.00,
        "credit_limit": 25000.00,
        "balance_type": "To Receive",
        "status": "Active"
    },
    {
        "id": "CUST-004",
        "name": "Kumar Medicals",
        "type": "Customer",
        "phone": "9789123456",
        "city": "Erode",
        "state": "Tamil Nadu (33)",
        "gstin": "33AABCK9988G1Z2",
        "balance": 0.00,
        "credit_limit": 50000.00,
        "balance_type": "None",
        "status": "Active"
    },
    {
        "id": "CUST-005",
        "name": "Anand Sundaram",
        "type": "Customer",
        "phone": "9840011223",
        "city": "Coimbatore",
        "state": "Tamil Nadu (33)",
        "gstin": "",
        "balance": 2352.00,
        "credit_limit": 10000.00,
        "balance_type": "To Receive",
        "status": "Active"
    },
    {
        "id": "SUPP-001",
        "name": "Apex Pharma Distributors",
        "type": "Supplier",
        "phone": "9820098200",
        "city": "Chennai",
        "state": "Tamil Nadu (33)",
        "gstin": "33AAACA1122H1Z5",
        "balance": 18450.00,
        "credit_limit": 100000.00,
        "balance_type": "To Pay",
        "status": "Active"
    },
    {
        "id": "SUPP-002",
        "name": "Kovai Healthcare Supplies",
        "type": "Supplier",
        "phone": "9443355667",
        "city": "Coimbatore",
        "state": "Tamil Nadu (33)",
        "gstin": "33AABCK5544J1Z8",
        "balance": 3950.00,
        "credit_limit": 50000.00,
        "balance_type": "To Pay",
        "status": "Active"
    },
    {
        "id": "SUPP-003",
        "name": "Micro Hygiene Surgicals",
        "type": "Supplier",
        "phone": "9789098711",
        "city": "Bengaluru",
        "state": "Karnataka (29)",
        "gstin": "29AABCM8899K1Z4",
        "balance": 0.00,
        "credit_limit": 75000.00,
        "balance_type": "None",
        "status": "Active"
    }
]

@frappe.whitelist()
def list_parties(party_type="All", q="", **kwargs):
    """
    API-20: parties.list & search
    """
    res = []
    q_clean = (q or "").strip().lower()
    for p in DEFAULT_PARTIES:
        if party_type != "All" and p["type"] != party_type:
            continue
        if q_clean:
            match = (
                q_clean in p["name"].lower()
                or q_clean in p["phone"].lower()
                or q_clean in p.get("gstin", "").lower()
                or q_clean in p["city"].lower()
            )
            if not match:
                continue
        res.append(p)

    return response(data={"rows": res, "total": len(res)})

@frappe.whitelist()
def save(party_data, **kwargs):
    """
    API-21: parties.save
    """
    data = frappe.parse_json(party_data) if isinstance(party_data, str) else party_data
    if not data or not data.get("name"):
        return error_response("VALIDATION_ERROR", "Party Name is required", field="name")

    party_id = data.get("id") or ("PARTY-" + frappe.generate_hash(length=6).upper())
    return response(data={"id": party_id, "name": data.get("name"), "status": "Saved"})
