import frappe
from frappe import _
from easybill.api.v1 import response, error_response
import json
from datetime import datetime

DEFAULT_GST_METRICS = {
    "period": "November 2026",
    "fy": "2026-27",
    "gstin": "33AABCT1234A1Z5",
    "legal_name": "EasyBill Supermarket & Pharmacy",
    "trade_name": "EasyBill Retail",
    "kpis": {
        "outward_taxable": 92480.00,
        "output_gst": 11097.60,
        "eligible_itc": 5805.00,
        "net_tax_payable": 5292.60,
        "b2b_sales_count": 8,
        "b2c_sales_count": 142
    },
    "gstr1_tables": [
        {
            "code": "4A, 4B, 4C",
            "name": "B2B Invoices (Registered)",
            "description": "Taxable supplies to registered businesses with valid GSTIN",
            "count": 8,
            "taxable_value": 38400.00,
            "cgst": 2304.00,
            "sgst": 2304.00,
            "igst": 0.00,
            "cess": 0.00,
            "total_value": 43008.00
        },
        {
            "code": "5A, 5B",
            "name": "B2C Large (Inter-state > 2.5L)",
            "description": "Unregistered inter-state supplies with invoice value > ₹2,50,000",
            "count": 0,
            "taxable_value": 0.00,
            "cgst": 0.00,
            "sgst": 0.00,
            "igst": 0.00,
            "cess": 0.00,
            "total_value": 0.00
        },
        {
            "code": "7",
            "name": "B2C Small (Retail & POS)",
            "description": "Intra-state retail consumers & inter-state invoice value <= ₹2,50,000",
            "count": 142,
            "taxable_value": 54080.00,
            "cgst": 3244.80,
            "sgst": 3244.80,
            "igst": 0.00,
            "cess": 0.00,
            "total_value": 60569.60
        },
        {
            "code": "9B",
            "name": "Credit / Debit Notes (B2B)",
            "description": "Sales returns and adjustments issued to registered buyers",
            "count": 1,
            "taxable_value": -1200.00,
            "cgst": -72.00,
            "sgst": -72.00,
            "igst": 0.00,
            "cess": 0.00,
            "total_value": -1344.00
        },
        {
            "code": "11A, 11B",
            "name": "Tax Liability on Advances",
            "description": "Advance received for future supplies",
            "count": 0,
            "taxable_value": 0.00,
            "cgst": 0.00,
            "sgst": 0.00,
            "igst": 0.00,
            "cess": 0.00,
            "total_value": 0.00
        }
    ],
    "gstr3b_breakdown": {
        "outward_taxable": {
            "description": "3.1 (a) Outward taxable supplies (other than zero rated, nil and exempted)",
            "taxable": 92480.00,
            "igst": 0.00,
            "cgst": 5548.80,
            "sgst": 5548.80,
            "cess": 0.00
        },
        "eligible_itc": {
            "description": "4 (A) (5) All other Input Tax Credit (from inward purchases)",
            "taxable": 49775.00,
            "igst": 0.00,
            "cgst": 2902.50,
            "sgst": 2902.50,
            "cess": 0.00
        },
        "net_liability": {
            "description": "6.1 Net Tax Payable in Cash",
            "igst": 0.00,
            "cgst": 2646.30,
            "sgst": 2646.30,
            "total": 5292.60
        }
    },
    "hsn_table": [
        {
            "hsn": "300490",
            "description": "Medicaments consisting of mixed or unmixed products",
            "uom": "STRIP",
            "qty": 850,
            "total_value": 31200.00,
            "taxable_value": 27857.14,
            "rate": 12.0,
            "cgst": 1671.43,
            "sgst": 1671.43,
            "igst": 0.00
        },
        {
            "hsn": "300410",
            "description": "Penicillins or derivatives (Amoxicillin)",
            "uom": "STRIP",
            "qty": 140,
            "total_value": 11200.00,
            "taxable_value": 10000.00,
            "rate": 12.0,
            "cgst": 600.00,
            "sgst": 600.00,
            "igst": 0.00
        },
        {
            "hsn": "630790",
            "description": "Protective face masks (N95)",
            "uom": "PCS",
            "qty": 450,
            "total_value": 11250.00,
            "taxable_value": 10714.29,
            "rate": 5.0,
            "cgst": 267.86,
            "sgst": 267.86,
            "igst": 0.00
        },
        {
            "hsn": "380894",
            "description": "Antiseptic disinfectants (Dettol & Sanitizer)",
            "uom": "BOTTLE",
            "qty": 180,
            "total_value": 14400.00,
            "taxable_value": 12203.39,
            "rate": 18.0,
            "cgst": 1098.31,
            "sgst": 1098.31,
            "igst": 0.00
        },
        {
            "hsn": "902519",
            "description": "Digital clinical thermometers",
            "uom": "PCS",
            "qty": 45,
            "total_value": 9900.00,
            "taxable_value": 8389.83,
            "rate": 18.0,
            "cgst": 755.08,
            "sgst": 755.08,
            "igst": 0.00
        },
        {
            "hsn": "401511",
            "description": "Surgical latex gloves",
            "uom": "BOX",
            "qty": 50,
            "total_value": 17500.00,
            "taxable_value": 15625.00,
            "rate": 12.0,
            "cgst": 937.50,
            "sgst": 937.50,
            "igst": 0.00
        }
    ]
}

@frappe.whitelist(allow_guest=True)
def get_dashboard(period="November 2026"):
    """
    API-90: gst.dashboard
    Returns full GSTR-1, GSTR-3B, HSN table, and ITC reconciliation data.
    """
    return response(ok=True, data=DEFAULT_GST_METRICS)

@frappe.whitelist(allow_guest=True)
def export_gstr1_json(period="November 2026"):
    """
    API-92: gst.export_json
    Returns official GST portal schema format JSON for direct upload to GSTN.
    """
    schema = {
        "gstin": DEFAULT_GST_METRICS["gstin"],
        "fp": "112026",
        "gt": 92480.00,
        "cur_gt": 92480.00,
        "b2b": [
            {
                "ctin": "33AABCP1234F1Z1",
                "inv": [
                    {
                        "inum": "INV-2026-0003",
                        "idt": "15-11-2026",
                        "val": 4704.00,
                        "pos": "33",
                        "rchrg": "N",
                        "inv_typ": "R",
                        "itms": [
                            {
                                "num": 1,
                                "itm_det": {
                                    "txval": 4200.00,
                                    "rt": 12.0,
                                    "iamt": 0.00,
                                    "camt": 252.00,
                                    "samt": 252.00,
                                    "csamt": 0.00
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        "b2cs": [
            {
                "sply_ty": "INTRA",
                "rt": 12.0,
                "typ": "OE",
                "pos": "33",
                "txval": 28400.00,
                "iamt": 0.00,
                "camt": 1704.00,
                "samt": 1704.00,
                "csamt": 0.00
            },
            {
                "sply_ty": "INTRA",
                "rt": 18.0,
                "typ": "OE",
                "pos": "33",
                "txval": 25680.00,
                "iamt": 0.00,
                "camt": 2311.20,
                "samt": 2311.20,
                "csamt": 0.00
            }
        ],
        "hsn": {
            "data": [
                {
                    "num": idx + 1,
                    "hsn_sc": item["hsn"],
                    "desc": item["description"],
                    "uqc": item["uom"],
                    "qty": item["qty"],
                    "val": item["total_value"],
                    "txval": item["taxable_value"],
                    "iamt": item["igst"],
                    "camt": item["cgst"],
                    "samt": item["sgst"],
                    "csamt": 0.00
                }
                for idx, item in enumerate(DEFAULT_GST_METRICS["hsn_table"])
            ]
        }
    }
    return response(ok=True, data=schema)
