import frappe
from frappe import _
from easybill.api.v1 import response, error_response

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
