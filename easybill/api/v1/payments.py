import frappe
from easybill.api.v1 import response, error_response

def on_submit_payment_entry(doc, method):
    """
    Update customer balance cache and queue receipt notification.
    """
    pass
