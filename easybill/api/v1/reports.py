import frappe
from frappe import _
from easybill.api.v1 import response, error_response
import json
from datetime import datetime

DEFAULT_ANALYTICS = {
    "period": "November 2026",
    "kpis": {
        "gross_revenue": 92480.00,
        "revenue_growth": 18.4,
        "cost_of_goods": 61037.14,
        "gross_profit": 31442.86,
        "gross_margin_pct": 34.0,
        "total_invoices": 150,
        "average_order_value": 616.53,
        "net_profit": 28242.86
    },
    "hourly_sales": [
        { "hour": "08:00 AM", "sales": 1200.00, "invoices": 4 },
        { "hour": "09:00 AM", "sales": 4800.00, "invoices": 11 },
        { "hour": "10:00 AM", "sales": 8900.00, "invoices": 18 },
        { "hour": "11:00 AM", "sales": 12400.00, "invoices": 22 },
        { "hour": "12:00 PM", "sales": 9600.00, "invoices": 16 },
        { "hour": "01:00 PM", "sales": 4200.00, "invoices": 8 },
        { "hour": "02:00 PM", "sales": 2800.00, "invoices": 5 },
        { "hour": "03:00 PM", "sales": 3900.00, "invoices": 7 },
        { "hour": "04:00 PM", "sales": 6500.00, "invoices": 12 },
        { "hour": "05:00 PM", "sales": 11800.00, "invoices": 19 },
        { "hour": "06:00 PM", "sales": 14200.00, "invoices": 24 },
        { "hour": "07:00 PM", "sales": 16800.00, "invoices": 28 },
        { "hour": "08:00 PM", "sales": 11200.00, "invoices": 17 },
        { "hour": "09:00 PM", "sales": 4180.00, "invoices": 9 }
    ],
    "top_products": [
        { "item_code": "GEN-003", "name": "Surgical Gloves Latex (Box of 50)", "category": "General", "qty_sold": 50, "revenue": 17500.00, "profit": 7000.00, "margin": 40.0 },
        { "item_code": "PER-001", "name": "Dettol Antiseptic 100ml", "category": "Personal Care", "qty_sold": 180, "revenue": 14400.00, "profit": 5580.00, "margin": 38.8 },
        { "item_code": "MED-001", "name": "Paracetamol 650mg", "category": "Medicines", "qty_sold": 350, "revenue": 12250.00, "profit": 4550.00, "margin": 37.1 },
        { "item_code": "GEN-001", "name": "N95 Protective Mask", "category": "General", "qty_sold": 450, "revenue": 11250.00, "profit": 4950.00, "margin": 44.0 },
        { "item_code": "MED-002", "name": "Amoxicillin 500mg", "category": "Medicines", "qty_sold": 140, "revenue": 11200.00, "profit": 4480.00, "margin": 40.0 },
        { "item_code": "BAB-002", "name": "Digital Thermometer", "category": "Baby Care", "qty_sold": 45, "revenue": 9900.00, "profit": 4725.00, "margin": 47.7 }
    ],
    "category_split": [
        { "category": "Medicines", "revenue": 44800.00, "pct": 48.4, "color": "#4f46e5" },
        { "category": "General & Surgical", "revenue": 24200.00, "pct": 26.2, "color": "#06b6d4" },
        { "category": "Personal Care", "revenue": 14400.00, "pct": 15.6, "color": "#10b981" },
        { "category": "Baby Care", "revenue": 9080.00, "pct": 9.8, "color": "#f59e0b" }
    ],
    "payment_split": [
        { "mode": "UPI / QR Dynamic", "amount": 49939.20, "pct": 54.0 },
        { "mode": "Cash from Drawer", "amount": 33292.80, "pct": 36.0 },
        { "mode": "Customer Credit (Khata)", "amount": 9248.00, "pct": 10.0 }
    ],
    "pnl_statement": {
        "revenue": {
            "gross_sales": 92480.00,
            "sales_returns": -1344.00,
            "net_sales": 91136.00
        },
        "cogs": {
            "opening_stock": 42000.00,
            "purchases": 55580.00,
            "closing_stock": -53471.00,
            "cost_of_goods_sold": 44109.00
        },
        "gross_profit": 47027.00,
        "operating_expenses": {
            "staff_refreshments": 480.00,
            "freight_logistics": 1200.00,
            "packaging_stationery": 2450.00,
            "total_expenses": 4130.00
        },
        "net_operating_profit": 42897.00
    }
}

@frappe.whitelist(allow_guest=True)
def get_analytics(period="November 2026"):
    """
    API-80: reports.dashboard
    Returns sales trends, hourly peak footfall, category split, top items, and P&L metrics.
    """
    return response(ok=True, data=DEFAULT_ANALYTICS)
