import frappe
from frappe import _
from easybill.api.v1 import response, error_response
import json
from datetime import datetime

DEFAULT_DAY_BOOK = {
    "date": datetime.now().strftime("%Y-%m-%d"),
    "opening_cash": 5000.00,
    "cash_in": 18450.00,
    "cash_out": 3200.00,
    "expected_cash": 20250.00,
    "counted_cash": 20250.00,
    "variance": 0.00,
    "status": "Open",
    "transactions": [
        {
            "id": "TXN-001",
            "time": "09:00 AM",
            "type": "Opening Balance",
            "category": "Float",
            "party": "Shift Opening Float",
            "inflow": 5000.00,
            "outflow": 0.00,
            "running_balance": 5000.00,
            "ref_no": "OPEN-01"
        },
        {
            "id": "TXN-002",
            "time": "10:15 AM",
            "type": "Cash Sale",
            "category": "Sales Invoice",
            "party": "Walk-in Customer",
            "inflow": 420.00,
            "outflow": 0.00,
            "running_balance": 5420.00,
            "ref_no": "INV-2026-0001"
        },
        {
            "id": "TXN-003",
            "time": "11:30 AM",
            "type": "Petty Expense",
            "category": "Tea & Snacks",
            "party": "Morning Staff Refreshments",
            "inflow": 0.00,
            "outflow": 120.00,
            "running_balance": 5300.00,
            "ref_no": "EXP-2026-01"
        },
        {
            "id": "TXN-004",
            "time": "12:45 PM",
            "type": "Debt Collection",
            "category": "Khata Receipt",
            "party": "Ramesh Kumar (Retail)",
            "inflow": 2500.00,
            "outflow": 0.00,
            "running_balance": 7800.00,
            "ref_no": "REC-2026-0001"
        },
        {
            "id": "TXN-005",
            "time": "02:10 PM",
            "type": "Supplier Payout",
            "category": "Transport",
            "party": "Fast Track Logistics (Freight)",
            "inflow": 0.00,
            "outflow": 850.00,
            "running_balance": 6950.00,
            "ref_no": "PAY-2026-01"
        },
        {
            "id": "TXN-006",
            "time": "03:40 PM",
            "type": "Cash Sale",
            "category": "Sales Invoice",
            "party": "Walk-in Customer",
            "inflow": 15530.00,
            "outflow": 0.00,
            "running_balance": 22480.00,
            "ref_no": "INV-2026-0005"
        },
        {
            "id": "TXN-007",
            "time": "04:20 PM",
            "type": "Petty Expense",
            "category": "Packaging Material",
            "party": "Carry Bags & Tape Roll",
            "inflow": 0.00,
            "outflow": 2230.00,
            "running_balance": 20250.00,
            "ref_no": "EXP-2026-02"
        }
    ]
}

DEFAULT_CLOSINGS = []

@frappe.whitelist(allow_guest=True)
def get_day_book(date=None):
    """
    API-70: cash.day_book
    Returns opening cash, inflow, outflow, expected cash, and transaction ledger for given date.
    """
    return response(ok=True, data=DEFAULT_DAY_BOOK)

@frappe.whitelist(allow_guest=True)
def add_expense(category="Tea & Snacks", amount=0.0, mode="Cash from Drawer", party="", notes=""):
    """
    API-72: expenses.add
    Adds a petty expense and deducts cash from drawer if mode is Cash.
    """
    amount = float(amount or 0)
    if amount <= 0:
        return error_response("INVALID_AMOUNT", "Expense amount must be greater than zero")

    new_id = f"EXP-2026-{len(DEFAULT_DAY_BOOK['transactions']) + 1:02d}"
    now_time = datetime.now().strftime("%I:%M %p")

    if mode == "Cash from Drawer":
        DEFAULT_DAY_BOOK["cash_out"] += amount
        DEFAULT_DAY_BOOK["expected_cash"] = DEFAULT_DAY_BOOK["opening_cash"] + DEFAULT_DAY_BOOK["cash_in"] - DEFAULT_DAY_BOOK["cash_out"]
        new_balance = DEFAULT_DAY_BOOK["expected_cash"]
    else:
        new_balance = DEFAULT_DAY_BOOK["expected_cash"]

    entry = {
        "id": new_id,
        "time": now_time,
        "type": "Petty Expense",
        "category": category,
        "party": party or category,
        "inflow": 0.00,
        "outflow": amount,
        "running_balance": new_balance,
        "ref_no": new_id,
        "notes": notes
    }

    DEFAULT_DAY_BOOK["transactions"].append(entry)

    return response(ok=True, data={
        "entry": entry,
        "day_book": DEFAULT_DAY_BOOK,
        "message": f"Expense of ₹{amount:.2f} for {category} recorded successfully"
    })

@frappe.whitelist(allow_guest=True)
def close_day(counted_cash=None, denominations=None, notes=""):
    """
    API-71: cash.day_close
    Reconciles counted cash vs expected cash, records closing denominations and audit note.
    """
    counted = float(counted_cash or 0)
    expected = DEFAULT_DAY_BOOK["expected_cash"]
    variance = round(counted - expected, 2)

    close_record = {
        "date": DEFAULT_DAY_BOOK["date"],
        "closed_at": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
        "opening_cash": DEFAULT_DAY_BOOK["opening_cash"],
        "cash_in": DEFAULT_DAY_BOOK["cash_in"],
        "cash_out": DEFAULT_DAY_BOOK["cash_out"],
        "expected_cash": expected,
        "counted_cash": counted,
        "variance": variance,
        "status": "Closed",
        "denominations": denominations or {},
        "notes": notes,
        "closed_by": "Administrator"
    }

    DEFAULT_DAY_BOOK["counted_cash"] = counted
    DEFAULT_DAY_BOOK["variance"] = variance
    DEFAULT_DAY_BOOK["status"] = "Closed"

    DEFAULT_CLOSINGS.append(close_record)

    return response(ok=True, data={
        "closing": close_record,
        "message": f"Day register closed with variance: ₹{variance:.2f}"
    })
