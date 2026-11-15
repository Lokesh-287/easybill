import frappe
from frappe import _
import json

@frappe.whitelist()
def provision(payload=None, **kwargs):
    """
    Idempotent provisioning script for bootstrapping a newly instantiated Frappe site.
    Section 5.5 of EasyBill Implementation Plan.
    """
    if payload is None:
        payload = kwargs
    elif isinstance(payload, str):
        try:
            payload = json.loads(payload)
        except Exception:
            payload = {}
        
    results = {}
    try:
        # Step 0: Ensure standard ERPNext fixtures if needed
        if not frappe.db.exists("Warehouse Type", "Transit"):
            from erpnext.setup.setup_wizard.operations.install_fixtures import install
            install("India")

        # Step 1: Ensure Company
        shop_name = payload.get("shop_name", "EasyBill Retail")
        company_name = shop_name
        if not frappe.db.exists("Company", company_name):
            comp = frappe.get_doc({
                "doctype": "Company",
                "company_name": company_name,
                "country": "India",
                "default_currency": "INR"
            })
            comp.insert(ignore_permissions=True)
            results["company"] = "created"
        else:
            results["company"] = "exists"

        # Step 2: Setup POS Mode of Payments
        for mode in ["Cash", "UPI", "Card", "Credit"]:
            if not frappe.db.exists("Mode of Payment", mode):
                m = frappe.get_doc({
                    "doctype": "Mode of Payment",
                    "mode_of_payment": mode,
                    "type": "Cash" if mode == "Cash" else "Bank"
                })
                m.insert(ignore_permissions=True)
        results["payment_modes"] = "pass"

        # Step 3: Setup Default Customer (Walk-in)
        if not frappe.db.exists("Customer", "Walk-in"):
            c = frappe.get_doc({
                "doctype": "Customer",
                "customer_name": "Walk-in",
                "customer_type": "Individual",
                "customer_group": "Individual",
                "territory": "India"
            })
            c.insert(ignore_permissions=True)
        results["defaults"] = "pass"

        # Step 4: Setup Roles
        for role in ["Shop Owner", "Shop Staff", "Shop Accountant"]:
            if not frappe.db.exists("Role", role):
                r = frappe.get_doc({"doctype": "Role", "role_name": role, "desk_access": 0 if role != "Shop Owner" else 1})
                r.insert(ignore_permissions=True)
        results["roles"] = "pass"

        # Step 5: Shop Config Singleton
        if frappe.db.exists("DocType", "Shop Config"):
            sc = frappe.get_single("Shop Config")
            sc.shop_name = shop_name
            sc.business_type = payload.get("business_type", "General")
            sc.gst_mode = payload.get("gst_mode", "regular")
            sc.invoice_prefix = payload.get("invoice_prefix", "INV-")
            sc.default_language = payload.get("default_language", "ta")
            sc.upi_id = payload.get("upi_id", "")
            sc.save(ignore_permissions=True)
            results["shop_config"] = "pass"

        frappe.db.commit()
        return {
            "ok": True,
            "site_url": frappe.utils.get_site_url(frappe.local.site),
            "checklist": results
        }
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(f"EasyBill provisioning failed: {str(e)}", "EasyBill Provisioning")
        return {
            "ok": False,
            "error": str(e),
            "checklist": results
        }
