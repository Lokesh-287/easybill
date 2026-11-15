app_name = "easybill"
app_title = "EasyBill"
app_publisher = "EasyBill"
app_description = "GST-Ready Billing, Stock & Payments (ERPNext + Vue)"
app_email = "support@yourdomain.in"
app_license = "mit"

# Apps
# ------------------
required_apps = ["erpnext", "india_compliance"]

# Website route rules (DEC-03)
website_route_rules = [
    {"from_route": "/easybill/<path:app_path>", "to_route": "easybill"},
    {"from_route": "/easybill", "to_route": "easybill"},
    {"from_route": "/frontend/<path:app_path>", "to_route": "easybill"},
    {"from_route": "/frontend", "to_route": "easybill"},
]

# Fixtures (Section 5.2)
fixtures = [
    {
        "doctype": "Custom Field",
        "filters": [
            ["dt", "in", ["Item", "Sales Invoice", "Purchase Invoice", "Customer", "Payment Entry"]]
        ]
    }
]

# Document Events (Section 5.4)
doc_events = {
    "Sales Invoice": {
        "validate": "easybill.api.v1.sales.validate_sales_invoice",
        "on_submit": "easybill.api.v1.sales.on_submit_sales_invoice",
    },
    "Purchase Invoice": {
        "validate": "easybill.api.v1.purchase.validate_purchase_invoice",
    },
    "Payment Entry": {
        "on_submit": "easybill.api.v1.payments.on_submit_payment_entry",
    }
}

# Scheduler Events (Section 5.4)
scheduler_events = {
    "hourly": [
        "easybill.api.v1.system.hourly_check"
    ],
    "daily": [
        "easybill.api.v1.system.daily_check"
    ]
}
