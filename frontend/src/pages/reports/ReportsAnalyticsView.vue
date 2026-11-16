<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top KPI Section -->
    <div class="p-6 pb-2">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
            Business Analytics & Reports
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Store profitability metrics, hourly customer footfall, category revenue split & Trading P&L
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <select
            v-model="selectedPeriod"
            class="px-3 py-2 text-xs bg-white border border-slate-200/90 rounded-xl font-bold text-slate-800 shadow-card focus:outline-none"
          >
            <option value="November 2026">November 2026 (Active)</option>
            <option value="October 2026">October 2026</option>
            <option value="Q3 FY 2026-27">Q3 FY 2026-27</option>
          </select>

          <button
            @click="exportAnalyticsCSV"
            class="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-1.5 transition"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      <!-- 4 Financial KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Gross Revenue -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Gross Sales Revenue</span>
            <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <TrendingUp class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            ₹{{ formatMoney(analytics.kpis.gross_revenue) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              +{{ analytics.kpis.revenue_growth }}%
            </span>
            <span class="text-slate-400">vs previous month</span>
          </div>
        </div>

        <!-- Card 2: Gross Profit & Margin -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Gross Profit (Margin %)</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
            ₹{{ formatMoney(analytics.kpis.gross_profit) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ analytics.kpis.gross_margin_pct }}% Margin
            </span>
            <span class="text-slate-400">trading profit</span>
          </div>
        </div>

        <!-- Card 3: Average Order Value -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Average Order Value (AOV)</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-indigo-700">
            ₹{{ formatMoney(analytics.kpis.average_order_value) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ analytics.kpis.total_invoices }} Bills
            </span>
            <span class="text-slate-400">customer baskets</span>
          </div>
        </div>

        <!-- Card 4: Net Operating Profit -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Net Operating Profit</span>
            <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BadgeDollarSign class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-purple-700">
            ₹{{ formatMoney(analytics.pnl_statement.net_operating_profit) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md font-tabular">
              Net Shop Earnings
            </span>
            <span class="text-slate-400">after expenses</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area: Charts & Deep Dives -->
    <div class="flex-1 p-6 pt-2 flex flex-col min-h-0">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        <!-- Sub-tabs -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center p-1 bg-slate-100/80 rounded-xl space-x-1">
            <button
              v-for="tab in reportTabs"
              :key="tab.id"
              @click="activeReportTab = tab.id"
              :class="[
                'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeReportTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- TAB 1: EXECUTIVE DASHBOARD & VISUAL CHARTS -->
        <div v-if="activeReportTab === 'overview'" class="flex-1 overflow-auto p-5 space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Hourly Sales Distribution Chart (2 cols) -->
            <div class="lg:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-200/70">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-xs font-extrabold text-slate-900">Hourly Footfall & Sales Velocity</h3>
                  <p class="text-[11px] text-slate-400">Peak customer traffic occurs between 11 AM - 12 PM and 6 PM - 8 PM</p>
                </div>
                <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  Peak: ₹16,800 @ 7 PM
                </span>
              </div>

              <!-- Bar Histogram -->
              <div class="flex items-end space-x-2 h-44 pt-4 border-b border-slate-200">
                <div
                  v-for="bar in analytics.hourly_sales"
                  :key="bar.hour"
                  class="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  <div
                    class="w-full bg-primary-500 group-hover:bg-primary-600 rounded-t-md transition-all duration-300 relative"
                    :style="{ height: `${(bar.sales / 18000) * 100}%` }"
                  >
                    <!-- Tooltip -->
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap transition-opacity font-mono z-20">
                      ₹{{ formatMoney(bar.sales) }} ({{ bar.invoices }} bills)
                    </div>
                  </div>
                  <div class="text-[9px] text-slate-400 mt-2 font-mono truncate w-full text-center">
                    {{ bar.hour.split(' ')[0] }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Methods Split (1 col) -->
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
              <div>
                <h3 class="text-xs font-extrabold text-slate-900">Payment Collection Breakdown</h3>
                <p class="text-[11px] text-slate-400 mb-4">Split by tender modes</p>

                <div class="space-y-3">
                  <div v-for="mode in analytics.payment_split" :key="mode.mode">
                    <div class="flex justify-between text-xs font-semibold mb-1">
                      <span class="text-slate-700">{{ mode.mode }}</span>
                      <span class="font-tabular text-slate-900">{{ mode.pct }}% (₹{{ formatMoney(mode.amount) }})</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-primary-600 rounded-full"
                        :style="{ width: `${mode.pct}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span class="text-slate-400">Digital Settlement:</span>
                <span class="font-bold text-emerald-700 ml-1">54.0% UPI adoption rate</span>
              </div>
            </div>
          </div>

          <!-- Category Revenue Split Progress Bars -->
          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <h3 class="text-xs font-extrabold text-slate-900 mb-1">Category Contribution</h3>
            <p class="text-[11px] text-slate-400 mb-4">Revenue share across product niches</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="cat in analytics.category_split"
                :key="cat.category"
                class="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5"
              >
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-slate-800">{{ cat.category }}</span>
                  <span class="font-extrabold text-primary-700 font-tabular">{{ cat.pct }}%</span>
                </div>
                <div class="text-sm font-extrabold text-slate-900 font-tabular">
                  ₹{{ formatMoney(cat.revenue) }}
                </div>
                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :style="{ width: `${cat.pct}%`, backgroundColor: cat.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: PROFIT & LOSS STATEMENT -->
        <div v-if="activeReportTab === 'pnl'" class="flex-1 overflow-auto p-5">
          <div class="max-w-3xl mx-auto border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-6">
            <div class="border-b border-slate-200 pb-3 flex justify-between items-center">
              <div>
                <h3 class="text-sm font-extrabold text-slate-900">Trading & Profit & Loss Statement</h3>
                <p class="text-xs text-slate-400">For the period ending {{ selectedPeriod }}</p>
              </div>
              <span class="text-xs font-mono font-bold bg-white px-2 py-1 rounded-lg border">
                Accrual Basis
              </span>
            </div>

            <!-- Revenue Section -->
            <div class="space-y-2 text-xs">
              <div class="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-primary-700">I. Revenue from Operations</div>
              <div class="flex justify-between text-slate-700">
                <span>Gross Billing Sales</span>
                <span class="font-tabular font-semibold">₹{{ formatMoney(analytics.pnl_statement.revenue.gross_sales) }}</span>
              </div>
              <div class="flex justify-between text-rose-600">
                <span>Less: Sales Returns & Credit Notes</span>
                <span class="font-tabular font-semibold">₹{{ formatMoney(analytics.pnl_statement.revenue.sales_returns) }}</span>
              </div>
              <div class="border-t border-slate-200 pt-1 flex justify-between font-extrabold text-slate-900">
                <span>Net Sales Revenue</span>
                <span class="font-tabular text-sm text-primary-700">₹{{ formatMoney(analytics.pnl_statement.revenue.net_sales) }}</span>
              </div>
            </div>

            <!-- COGS Section -->
            <div class="space-y-2 text-xs">
              <div class="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-amber-700">II. Cost of Goods Sold (COGS)</div>
              <div class="flex justify-between text-slate-700">
                <span>Opening Stock Value</span>
                <span class="font-tabular font-semibold">₹{{ formatMoney(analytics.pnl_statement.cogs.opening_stock) }}</span>
              </div>
              <div class="flex justify-between text-slate-700">
                <span>Add: Inward Purchases</span>
                <span class="font-tabular font-semibold">₹{{ formatMoney(analytics.pnl_statement.cogs.purchases) }}</span>
              </div>
              <div class="flex justify-between text-slate-700">
                <span>Less: Closing Inventory on Hand</span>
                <span class="font-tabular font-semibold text-emerald-700">₹{{ formatMoney(analytics.pnl_statement.cogs.closing_stock) }}</span>
              </div>
              <div class="border-t border-slate-200 pt-1 flex justify-between font-extrabold text-slate-900">
                <span>Total Cost of Goods Sold</span>
                <span class="font-tabular">₹{{ formatMoney(analytics.pnl_statement.cogs.cost_of_goods_sold) }}</span>
              </div>
            </div>

            <!-- Gross Profit Line -->
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <span class="font-extrabold text-emerald-900 uppercase">Gross Profit (Net Sales - COGS)</span>
              <span class="text-base font-extrabold text-emerald-700 font-tabular">₹{{ formatMoney(analytics.pnl_statement.gross_profit) }}</span>
            </div>

            <!-- Operating Expenses -->
            <div class="space-y-2 text-xs">
              <div class="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-rose-700">III. Operating & Petty Expenses</div>
              <div class="flex justify-between text-slate-700">
                <span>Staff Refreshments & Tea</span>
                <span class="font-tabular">₹{{ formatMoney(analytics.pnl_statement.operating_expenses.staff_refreshments) }}</span>
              </div>
              <div class="flex justify-between text-slate-700">
                <span>Freight & Inward Logistics</span>
                <span class="font-tabular">₹{{ formatMoney(analytics.pnl_statement.operating_expenses.freight_logistics) }}</span>
              </div>
              <div class="flex justify-between text-slate-700">
                <span>Packaging & Carry Bags</span>
                <span class="font-tabular">₹{{ formatMoney(analytics.pnl_statement.operating_expenses.packaging_stationery) }}</span>
              </div>
              <div class="border-t border-slate-200 pt-1 flex justify-between font-bold text-rose-700">
                <span>Total Operating Disbursals</span>
                <span class="font-tabular">₹{{ formatMoney(analytics.pnl_statement.operating_expenses.total_expenses) }}</span>
              </div>
            </div>

            <!-- Net Operating Profit -->
            <div class="p-4 bg-primary-50 rounded-xl border border-primary-200 flex justify-between items-center">
              <div>
                <div class="text-xs font-extrabold text-primary-900 uppercase">Net Operating Profit</div>
                <div class="text-[10px] text-primary-600">Net store bottomline earnings</div>
              </div>
              <div class="text-lg font-extrabold text-primary-700 font-tabular">
                ₹{{ formatMoney(analytics.pnl_statement.net_operating_profit) }}
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: TOP PRODUCTS LEADERBOARD -->
        <div v-if="activeReportTab === 'products'" class="flex-1 overflow-auto p-5">
          <div class="mb-4">
            <h3 class="text-xs font-extrabold text-slate-900">Top Selling Products Leaderboard</h3>
            <p class="text-[11px] text-slate-400">Ranked by gross sales volume and individual item profit margin</p>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">Rank & Item</th>
                  <th class="py-3 px-4">Category</th>
                  <th class="py-3 px-4 text-right">Units Sold</th>
                  <th class="py-3 px-4 text-right">Revenue (₹)</th>
                  <th class="py-3 px-4 text-right">Profit (₹)</th>
                  <th class="py-3 px-4 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="(p, idx) in analytics.top_products" :key="p.item_code" class="hover:bg-slate-50/50">
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-6 h-6 rounded-lg bg-primary-50 text-primary-700 font-bold flex items-center justify-center text-xs">
                        #{{ idx + 1 }}
                      </div>
                      <div>
                        <div class="font-bold text-slate-900">{{ p.name }}</div>
                        <div class="text-[10px] text-slate-400 font-mono">{{ p.item_code }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-medium text-slate-600">
                    {{ p.category }}
                  </td>
                  <td class="py-3 px-4 text-right font-bold font-tabular text-slate-800">
                    {{ p.qty_sold }}
                  </td>
                  <td class="py-3 px-4 text-right font-extrabold font-tabular text-slate-900">
                    ₹{{ formatMoney(p.revenue) }}
                  </td>
                  <td class="py-3 px-4 text-right font-extrabold font-tabular text-emerald-700">
                    ₹{{ formatMoney(p.profit) }}
                  </td>
                  <td class="py-3 px-4 text-right font-bold font-tabular text-indigo-700">
                    {{ p.margin }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div>
            Data Engine: <span class="font-bold text-slate-800">Real-time GL Aggregates</span>
          </div>
          <div>
            Updated: <span class="font-mono text-slate-700 font-semibold">{{ new Date().toLocaleTimeString() }}</span>
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
  Percent,
  ShoppingBag,
  BadgeDollarSign,
  Download
} from '@lucide/vue';

// State
const activeReportTab = ref('overview');
const selectedPeriod = ref('November 2026');

const reportTabs = [
  { id: 'overview', label: 'Overview & Velocity' },
  { id: 'pnl', label: 'Trading P&L' },
  { id: 'products', label: 'Top Products' }
];

const analytics = ref({
  period: "November 2026",
  kpis: {
    gross_revenue: 92480.00,
    revenue_growth: 18.4,
    cost_of_goods: 61037.14,
    gross_profit: 31442.86,
    gross_margin_pct: 34.0,
    total_invoices: 150,
    average_order_value: 616.53
  },
  hourly_sales: [
    { hour: "08:00 AM", sales: 1200.00, invoices: 4 },
    { hour: "09:00 AM", sales: 4800.00, invoices: 11 },
    { hour: "10:00 AM", sales: 8900.00, invoices: 18 },
    { hour: "11:00 AM", sales: 12400.00, invoices: 22 },
    { hour: "12:00 PM", sales: 9600.00, invoices: 16 },
    { hour: "01:00 PM", sales: 4200.00, invoices: 8 },
    { hour: "02:00 PM", sales: 2800.00, invoices: 5 },
    { hour: "03:00 PM", sales: 3900.00, invoices: 7 },
    { hour: "04:00 PM", sales: 6500.00, invoices: 12 },
    { hour: "05:00 PM", sales: 11800.00, invoices: 19 },
    { hour: "06:00 PM", sales: 14200.00, invoices: 24 },
    { hour: "07:00 PM", sales: 16800.00, invoices: 28 },
    { hour: "08:00 PM", sales: 11200.00, invoices: 17 },
    { hour: "09:00 PM", sales: 4180.00, invoices: 9 }
  ],
  top_products: [
    { item_code: "GEN-003", name: "Surgical Gloves Latex (Box of 50)", category: "General", qty_sold: 50, revenue: 17500.00, profit: 7000.00, margin: 40.0 },
    { item_code: "PER-001", name: "Dettol Antiseptic 100ml", category: "Personal Care", qty_sold: 180, revenue: 14400.00, profit: 5580.00, margin: 38.8 },
    { item_code: "MED-001", name: "Paracetamol 650mg", category: "Medicines", qty_sold: 350, revenue: 12250.00, profit: 4550.00, margin: 37.1 },
    { item_code: "GEN-001", name: "N95 Protective Mask", category: "General", qty_sold: 450, revenue: 11250.00, profit: 4950.00, margin: 44.0 },
    { item_code: "MED-002", name: "Amoxicillin 500mg", category: "Medicines", qty_sold: 140, revenue: 11200.00, profit: 4480.00, margin: 40.0 },
    { item_code: "BAB-002", name: "Digital Thermometer", category: "Baby Care", qty_sold: 45, revenue: 9900.00, profit: 4725.00, margin: 47.7 }
  ],
  category_split: [
    { category: "Medicines", revenue: 44800.00, pct: 48.4, color: "#4f46e5" },
    { category: "General & Surgical", revenue: 24200.00, pct: 26.2, color: "#06b6d4" },
    { category: "Personal Care", revenue: 14400.00, pct: 15.6, color: "#10b981" },
    { category: "Baby Care", revenue: 9080.00, pct: 9.8, color: "#f59e0b" }
  ],
  payment_split: [
    { mode: "UPI / QR Dynamic", amount: 49939.20, pct: 54.0 },
    { mode: "Cash from Drawer", amount: 33292.80, pct: 36.0 },
    { mode: "Customer Credit (Khata)", amount: 9248.00, pct: 10.0 }
  ],
  pnl_statement: {
    revenue: { gross_sales: 92480.00, sales_returns: -1344.00, net_sales: 91136.00 },
    cogs: { opening_stock: 42000.00, purchases: 55580.00, closing_stock: -53471.00, cost_of_goods_sold: 44109.00 },
    gross_profit: 47027.00,
    operating_expenses: { staff_refreshments: 480.00, freight_logistics: 1200.00, packaging_stationery: 2450.00, total_expenses: 4130.00 },
    net_operating_profit: 42897.00
  }
});

function formatMoney(amount: number): string {
  if (amount === undefined || amount === null) return '0.00';
  return Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function exportAnalyticsCSV() {
  const headers = ['Metric / Product', 'Category', 'Units', 'Revenue (₹)', 'Profit (₹)', 'Margin %'];
  const rows = analytics.value.top_products.map(p => [
    `"${p.name}"`,
    p.category,
    p.qty_sold,
    p.revenue,
    p.profit,
    `${p.margin}%`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `easybill_analytics_${selectedPeriod.value.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
