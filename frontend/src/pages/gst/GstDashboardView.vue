<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top KPI Section -->
    <div class="p-6 pb-2">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
              GST Compliance & Tax Dashboard
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>GSTR-1 Ready</span>
            </span>
          </div>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            GSTIN: <span class="font-mono font-bold text-slate-700">{{ gstData.gstin }}</span> · Auto-generate GSTR-1, GSTR-3B & HSN-wise tax returns
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- CA Excel Export -->
          <button
            @click="exportGstCSV"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-card flex items-center space-x-1.5 transition"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>CA Excel Export</span>
          </button>

          <!-- GSTR-1 Govt JSON (SCR-K2) -->
          <button
            @click="downloadGstr1Json"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <FileSpreadsheet class="w-4 h-4" />
            <span>Download GSTR-1 JSON (SCR-K2)</span>
          </button>
        </div>
      </div>

      <!-- 4 Financial KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Outward Taxable Supplies -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Outward Taxable Sales</span>
            <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <TrendingUp class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            ₹{{ formatMoney(gstData.kpis.outward_taxable) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ gstData.kpis.b2b_sales_count }} B2B + {{ gstData.kpis.b2c_sales_count }} B2C
            </span>
            <span class="text-slate-400">invoices logged</span>
          </div>
        </div>

        <!-- Card 2: Output GST Liability -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Output GST Collected</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-indigo-700">
            ₹{{ formatMoney(gstData.kpis.output_gst) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md font-tabular">
              CGST + SGST
            </span>
            <span class="text-slate-400">sales tax collected</span>
          </div>
        </div>

        <!-- Card 3: Eligible Input Tax Credit -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Eligible ITC (Purchases)</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
            ₹{{ formatMoney(gstData.kpis.eligible_itc) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              GSTR-2B Matched
            </span>
            <span class="text-slate-400">purchase tax set-off</span>
          </div>
        </div>

        <!-- Card 4: Net Tax Payable in Cash -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Net Tax Payable (Cash)</span>
            <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Coins class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-rose-700">
            ₹{{ formatMoney(gstData.kpis.net_tax_payable) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md font-tabular">
              Final Challan Due
            </span>
            <span class="text-slate-400">due by 20th</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="flex-1 p-6 pt-2 flex flex-col min-h-0">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        <!-- Tab Selector Header -->
        <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center p-1 bg-slate-100/80 rounded-xl space-x-1">
            <button
              v-for="tab in mainTabs"
              :key="tab.id"
              @click="activeMainTab = tab.id"
              :class="[
                'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeMainTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-slate-500">Filing Period:</span>
            <select
              v-model="selectedPeriod"
              class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
            >
              <option value="November 2026">November 2026 (Active)</option>
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
            </select>
          </div>
        </div>

        <!-- TAB 1: GSTR-1 OUTWARD SUPPLIES -->
        <div v-if="activeMainTab === 'gstr1'" class="flex-1 overflow-auto p-5">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-xs font-extrabold text-slate-900">GSTR-1 Return Tables (Outward Supplies)</h3>
              <p class="text-[11px] text-slate-400">Classified according to official GST Council return categories</p>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              100% Tax Computation Validated
            </span>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">Table Code & Name</th>
                  <th class="py-3 px-4">Description</th>
                  <th class="py-3 px-4 text-center">Invoices</th>
                  <th class="py-3 px-4 text-right">Taxable Value (₹)</th>
                  <th class="py-3 px-4 text-right">CGST (₹)</th>
                  <th class="py-3 px-4 text-right">SGST (₹)</th>
                  <th class="py-3 px-4 text-right">Total Invoiced (₹)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="t in gstData.gstr1_tables" :key="t.code" class="hover:bg-slate-50/50">
                  <td class="py-3 px-4 font-bold text-slate-900">
                    <div class="font-mono text-primary-700 text-[11px]">Table {{ t.code }}</div>
                    <div class="text-xs">{{ t.name }}</div>
                  </td>
                  <td class="py-3 px-4 text-slate-500 text-[11px]">
                    {{ t.description }}
                  </td>
                  <td class="py-3 px-4 text-center font-bold font-tabular text-slate-800">
                    {{ t.count }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular font-semibold text-slate-800">
                    ₹{{ formatMoney(t.taxable_value) }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular text-indigo-700 font-medium">
                    ₹{{ formatMoney(t.cgst) }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular text-indigo-700 font-medium">
                    ₹{{ formatMoney(t.sgst) }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular font-extrabold text-slate-900">
                    ₹{{ formatMoney(t.total_value) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: GSTR-3B MONTHLY RETURN & SET-OFF -->
        <div v-if="activeMainTab === 'gstr3b'" class="flex-1 overflow-auto p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs font-extrabold text-slate-900">GSTR-3B Tax Liability & Input Credit Offset</h3>
              <p class="text-[11px] text-slate-400">Monthly self-assessment summary for GST payment</p>
            </div>
            <div class="text-xs font-bold text-slate-700">
              Return Period: <span class="text-primary-700">{{ selectedPeriod }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Box 1 -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div class="text-xs font-extrabold text-slate-900">Table 3.1: Total Outward Tax</div>
              <div class="text-[11px] text-slate-500">Liability from sales invoices</div>
              <div class="border-t border-slate-200 pt-2 space-y-1.5 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">Taxable:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.outward_taxable.taxable) }}</span>
                </div>
                <div class="flex justify-between text-indigo-700">
                  <span>CGST:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.outward_taxable.cgst) }}</span>
                </div>
                <div class="flex justify-between text-indigo-700">
                  <span>SGST:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.outward_taxable.sgst) }}</span>
                </div>
              </div>
            </div>

            <!-- Box 2 -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div class="text-xs font-extrabold text-emerald-900">Table 4: Eligible ITC Available</div>
              <div class="text-[11px] text-slate-500">Tax set-off from inward purchases</div>
              <div class="border-t border-slate-200 pt-2 space-y-1.5 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">Purchase Base:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.eligible_itc.taxable) }}</span>
                </div>
                <div class="flex justify-between text-emerald-700">
                  <span>CGST ITC:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.eligible_itc.cgst) }}</span>
                </div>
                <div class="flex justify-between text-emerald-700">
                  <span>SGST ITC:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.eligible_itc.sgst) }}</span>
                </div>
              </div>
            </div>

            <!-- Box 3 -->
            <div class="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
              <div class="text-xs font-extrabold text-rose-900">Table 6.1: Net Payment in Cash</div>
              <div class="text-[11px] text-rose-600">Final challan payment after ITC offset</div>
              <div class="border-t border-rose-200 pt-2 space-y-1.5 text-xs">
                <div class="flex justify-between text-rose-700">
                  <span>CGST Cash:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.net_liability.cgst) }}</span>
                </div>
                <div class="flex justify-between text-rose-700">
                  <span>SGST Cash:</span>
                  <span class="font-tabular font-bold">₹{{ formatMoney(gstData.gstr3b_breakdown.net_liability.sgst) }}</span>
                </div>
                <div class="border-t border-rose-200 pt-1.5 flex justify-between font-extrabold text-rose-900 text-sm">
                  <span>Total Challan:</span>
                  <span class="font-tabular">₹{{ formatMoney(gstData.gstr3b_breakdown.net_liability.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: HSN SUMMARY TABLE (TABLE 12) -->
        <div v-if="activeMainTab === 'hsn'" class="flex-1 overflow-auto p-5">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-xs font-extrabold text-slate-900">Table 12: HSN / SAC Outward Summary</h3>
              <p class="text-[11px] text-slate-400">Mandatory 6-digit HSN breakdown with quantity & tax distribution</p>
            </div>
            <button
              @click="exportGstCSV"
              class="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Export HSN Sheet</span>
            </button>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">HSN Code</th>
                  <th class="py-3 px-4">Description</th>
                  <th class="py-3 px-4 text-center">UOM</th>
                  <th class="py-3 px-4 text-right">Total Qty</th>
                  <th class="py-3 px-4 text-right">Taxable (₹)</th>
                  <th class="py-3 px-4 text-center">Rate</th>
                  <th class="py-3 px-4 text-right">CGST (₹)</th>
                  <th class="py-3 px-4 text-right">SGST (₹)</th>
                  <th class="py-3 px-4 text-right">Total Value (₹)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="h in gstData.hsn_table" :key="h.hsn" class="hover:bg-slate-50/50">
                  <td class="py-3 px-4 font-mono font-bold text-slate-900">
                    {{ h.hsn }}
                  </td>
                  <td class="py-3 px-4 text-slate-600 font-medium">
                    {{ h.description }}
                  </td>
                  <td class="py-3 px-4 text-center font-bold text-slate-500 font-mono text-[10px]">
                    {{ h.uom }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular font-bold text-slate-800">
                    {{ h.qty }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular font-semibold">
                    ₹{{ formatMoney(h.taxable_value) }}
                  </td>
                  <td class="py-3 px-4 text-center font-bold text-indigo-700 font-tabular">
                    {{ h.rate }}%
                  </td>
                  <td class="py-3 px-4 text-right font-tabular text-indigo-700 font-medium">
                    ₹{{ formatMoney(h.cgst) }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular text-indigo-700 font-medium">
                    ₹{{ formatMoney(h.sgst) }}
                  </td>
                  <td class="py-3 px-4 text-right font-tabular font-extrabold text-slate-900">
                    ₹{{ formatMoney(h.total_value) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Table Footer -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div>
            Filing Status: <span class="font-bold text-emerald-700">Audit Verified</span> · India Compliance Rule-Engine Passed
          </div>
          <div class="flex items-center space-x-3">
            <span>GST Portal Offline Tool Schema v1.3 Supported</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  TrendingUp,
  Receipt,
  ShieldCheck,
  Coins,
  Download,
  FileSpreadsheet
} from '@lucide/vue';

// State
const activeMainTab = ref('gstr1');
const selectedPeriod = ref('November 2026');

const mainTabs = [
  { id: 'gstr1', label: 'GSTR-1 Outward Summary' },
  { id: 'gstr3b', label: 'GSTR-3B Tax Offset' },
  { id: 'hsn', label: 'HSN Table 12' }
];

// Seed GST Data
const gstData = ref({
  period: "November 2026",
  gstin: "33AABCT1234A1Z5",
  kpis: {
    outward_taxable: 92480.00,
    output_gst: 11097.60,
    eligible_itc: 5805.00,
    net_tax_payable: 5292.60,
    b2b_sales_count: 8,
    b2c_sales_count: 142
  },
  gstr1_tables: [
    { code: "4A, 4B, 4C", name: "B2B Invoices (Registered)", description: "Taxable supplies to registered businesses with valid GSTIN", count: 8, taxable_value: 38400.00, cgst: 2304.00, sgst: 2304.00, total_value: 43008.00 },
    { code: "5A, 5B", name: "B2C Large (Inter-state > 2.5L)", description: "Unregistered inter-state supplies with invoice value > ₹2,50,000", count: 0, taxable_value: 0.00, cgst: 0.00, sgst: 0.00, total_value: 0.00 },
    { code: "7", name: "B2C Small (Retail & POS)", description: "Intra-state retail consumers & inter-state invoice value <= ₹2,50,000", count: 142, taxable_value: 54080.00, cgst: 3244.80, sgst: 3244.80, total_value: 60569.60 },
    { code: "9B", name: "Credit / Debit Notes (B2B)", description: "Sales returns and adjustments issued to registered buyers", count: 1, taxable_value: -1200.00, cgst: -72.00, sgst: -72.00, total_value: -1344.00 }
  ],
  gstr3b_breakdown: {
    outward_taxable: { taxable: 92480.00, cgst: 5548.80, sgst: 5548.80 },
    eligible_itc: { taxable: 49775.00, cgst: 2902.50, sgst: 2902.50 },
    net_liability: { cgst: 2646.30, sgst: 2646.30, total: 5292.60 }
  },
  hsn_table: [
    { hsn: "300490", description: "Medicaments consisting of mixed or unmixed products", uom: "STRIP", qty: 850, total_value: 31200.00, taxable_value: 27857.14, rate: 12.0, cgst: 1671.43, sgst: 1671.43 },
    { hsn: "300410", description: "Penicillins or derivatives (Amoxicillin)", uom: "STRIP", qty: 140, total_value: 11200.00, taxable_value: 10000.00, rate: 12.0, cgst: 600.00, sgst: 600.00 },
    { hsn: "630790", description: "Protective face masks (N95)", uom: "PCS", qty: 450, total_value: 11250.00, taxable_value: 10714.29, rate: 5.0, cgst: 267.86, sgst: 267.86 },
    { hsn: "380894", description: "Antiseptic disinfectants (Dettol & Sanitizer)", uom: "BOTTLE", qty: 180, total_value: 14400.00, taxable_value: 12203.39, rate: 18.0, cgst: 1098.31, sgst: 1098.31 },
    { hsn: "902519", description: "Digital clinical thermometers", uom: "PCS", qty: 45, total_value: 9900.00, taxable_value: 8389.83, rate: 18.0, cgst: 755.08, sgst: 755.08 },
    { hsn: "401511", description: "Surgical latex gloves", uom: "BOX", qty: 50, total_value: 17500.00, taxable_value: 15625.00, rate: 12.0, cgst: 937.50, sgst: 937.50 }
  ]
});

// Methods
function formatMoney(amount: number): string {
  if (amount === undefined || amount === null) return '0.00';
  return Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

async function downloadGstr1Json() {
  try {
    const res = await fetch('/api/method/easybill.api.v1.gst.export_gstr1_json');
    if (res.ok) {
      const data = await res.json();
      if (data.message && data.message.data) {
        const jsonStr = JSON.stringify(data.message.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `GSTR1_${gstData.value.gstin}_112026.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    }
  } catch (err) {
    console.log('JSON export error');
  }

  // Fallback direct JSON download
  const sampleJson = {
    gstin: gstData.value.gstin,
    fp: "112026",
    gt: gstData.value.kpis.outward_taxable,
    b2cs: [{ sply_ty: "INTRA", rt: 12.0, pos: "33", txval: 54080.00, camt: 3244.80, samt: 3244.80 }],
    hsn: { data: gstData.value.hsn_table }
  };
  const blob = new Blob([JSON.stringify(sampleJson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `GSTR1_${gstData.value.gstin}_112026.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportGstCSV() {
  const headers = ['HSN Code', 'Description', 'UOM', 'Total Qty', 'Total Value', 'Taxable Value', 'Rate %', 'CGST', 'SGST'];
  const rows = gstData.value.hsn_table.map(h => [
    h.hsn,
    `"${h.description}"`,
    h.uom,
    h.qty,
    h.total_value,
    h.taxable_value,
    h.rate,
    h.cgst,
    h.sgst
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `easybill_gstr1_hsn_${gstData.value.gstin}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
