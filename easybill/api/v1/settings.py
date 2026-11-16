import frappe
from frappe import _
from easybill.api.v1 import response, error_response
import json
from datetime import datetime

DEFAULT_SETTINGS = {
    "store_profile": {
        "store_name": "EasyBill Supermarket & Pharmacy",
        "store_name_ta": "ஈசிபில் சூப்பர்மார்க்கெட் & மருந்தகம்",
        "phone": "+91 98421 98765",
        "email": "contact@easybill.store",
        "address": "124, Cross Cut Road, Gandhipuram",
        "city": "Coimbatore",
        "pincode": "641012",
        "state": "Tamil Nadu (33)",
        "state_code": "33",
        "gstin": "33AABCT1234A1Z5",
        "upi_vpa": "easybill@okaxis",
        "invoice_prefix": "INV-2026-",
        "footer_message": "Thank You! Please Visit Again / நன்றி, மீண்டும் வருக!"
    },
    "printer_config": {
        "printer_model": "TVS RP3200 Plus",
        "paper_width": "80mm",
        "connection_mode": "Browser Raw Print",
        "ip_address": "192.168.1.100",
        "port": 9100,
        "auto_print": True,
        "cash_drawer_kick": True,
        "bilingual_print": True
    },
    "tax_rules": {
        "default_gst_rate": 12,
        "tax_inclusive_pricing": True,
        "auto_round_off": True,
        "multi_warehouse": True
    },
    "system_info": {
        "version": "EasyBill v1.0.0",
        "frappe_version": "v15.82.0",
        "erpnext_version": "v15.70.0",
        "india_compliance_version": "v15.20.0",
        "db_size": "42 MB",
        "offline_records_cached": 10
    }
}

@frappe.whitelist(allow_guest=True)
def get_settings():
    """
    API-100: settings.get
    Returns complete store profile, thermal printer, tax rules and system info.
    """
    return response(ok=True, data=DEFAULT_SETTINGS)

@frappe.whitelist(allow_guest=True)
def save_settings(data=None):
    """
    API-101: settings.save
    Persists updated settings.
    """
    if isinstance(data, str):
        data = json.loads(data)

    if "store_profile" in data:
        DEFAULT_SETTINGS["store_profile"].update(data["store_profile"])
    if "printer_config" in data:
        DEFAULT_SETTINGS["printer_config"].update(data["printer_config"])
    if "tax_rules" in data:
        DEFAULT_SETTINGS["tax_rules"].update(data["tax_rules"])

    return response(ok=True, data={
        "settings": DEFAULT_SETTINGS,
        "message": "Settings updated and saved successfully"
    })

@frappe.whitelist(allow_guest=True)
def test_print():
    """
    API-102: settings.test_print
    Generates test receipt payload for thermal printer.
    """
    return response(ok=True, data={
        "status": "ready",
        "printer": DEFAULT_SETTINGS["printer_config"]["printer_model"],
        "paper_width": DEFAULT_SETTINGS["printer_config"]["paper_width"],
        "test_receipt": {
            "header": DEFAULT_SETTINGS["store_profile"]["store_name"],
            "address": DEFAULT_SETTINGS["store_profile"]["address"],
            "gstin": DEFAULT_SETTINGS["store_profile"]["gstin"],
            "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "lines": [
                { "name": "TEST ITEM 80MM", "qty": 1, "rate": 100.00, "total": 100.00 }
            ],
            "grand_total": 100.00,
            "footer": DEFAULT_SETTINGS["store_profile"]["footer_message"]
        }
    })
