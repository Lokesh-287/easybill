import os
import re
import frappe

def get_context(context):
    context.no_cache = 1
    context.boot = frappe._dict({
        "site_name": frappe.local.site,
        "user": frappe.session.user,
        "roles": frappe.get_roles(),
    })

    frontend_dir = frappe.get_app_path("easybill", "public", "frontend")
    index_html_path = os.path.join(frontend_dir, "index.html")

    links = []
    scripts = []

    if os.path.exists(index_html_path):
        with open(index_html_path, "r", encoding="utf-8") as f:
            html = f.read()
            for link in re.findall(r'<link[^>]+>', html):
                links.append(link)
            for script in re.findall(r'<script[^>]+></script>', html):
                scripts.append(script)

    context.frontend_head = "\n    ".join(links)
    context.frontend_scripts = "\n    ".join(scripts)
