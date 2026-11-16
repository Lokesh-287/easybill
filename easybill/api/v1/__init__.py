import frappe
from frappe.utils import now_datetime
import re

GSTIN_REGEX = re.compile(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")

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

def validate_gstin(gstin):
    """
    Validates GSTIN against statutory schema and extracts state code.
    Rule from financial-audit-tamper-guard skill.
    """
    if not gstin:
        return True, None
    gstin = gstin.strip().upper()
    if not GSTIN_REGEX.match(gstin):
        return False, None
    state_code = gstin[:2]
    return True, state_code

def enforce_role_redaction(data, sensitive_fields=("cost", "valuation_rate", "profit", "gross_margin_pct")):
    """
    RULE-08: Redacts wholesale costs and profit margins for Staff/Cashier roles.
    """
    user_roles = frappe.get_roles() if hasattr(frappe, "get_roles") else []
    is_privileged = any(r in user_roles for r in ("System Manager", "Administrator", "Owner"))
    if is_privileged:
        return data

    if isinstance(data, list):
        return [enforce_role_redaction(item, sensitive_fields) for item in data]
    elif isinstance(data, dict):
        cleaned = dict(data)
        for field in sensitive_fields:
            if field in cleaned:
                cleaned[field] = None
        return cleaned
    return data
