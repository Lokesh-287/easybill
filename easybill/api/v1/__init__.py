import frappe
from frappe.utils import now_datetime

def response(ok=True, data=None, error=None, status_code=200):
    frappe.local.response['http_status_code'] = status_code
    return {
        "ok": ok,
        "data": data,
        "error": error,
        "server_time": now_datetime().isoformat()
    }

def error_response(code, message_en, message_ta="", field=None, status_code=400):
    frappe.local.response['http_status_code'] = status_code
    return {
        "ok": False,
        "data": None,
        "error": {
            "code": code,
            "message_en": message_en,
            "message_ta": message_ta,
            "field": field
        },
        "server_time": now_datetime().isoformat()
    }
