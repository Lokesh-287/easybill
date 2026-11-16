<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top KPI Cards Section (Behance Finance Dashboard Style) -->
    <div class="p-6 pb-2">
      <!-- Welcome & Action Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
            Invoices & Sales
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Manage, track, and reconcile customer bills, payments, and GST
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <button
            @click="exportToCSV"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-card flex items-center space-x-1.5 transition"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <router-link
            to="/bill/new"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <Plus class="w-4 h-4" />
            <span>New Bill (F8)</span>
          </router-link>
        </div>
      </div>

      <!-- 4 Financial KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Revenue -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Total Invoiced</span>
            <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Receipt class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            ₹{{ formatMoney(kpiTotals.totalInvoiced) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              +14.2%
            </span>
            <span class="text-slate-400">vs last period</span>
          </div>
        </div>

        <!-- Card 2: Paid Amount -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Paid Amount</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
            ₹{{ formatMoney(kpiTotals.paidAmount) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-md font-tabular">
              {{ paidPercentage }}%
            </span>
            <span class="text-slate-400">collected</span>
          </div>
        </div>

        <!-- Card 3: Pending & Overdue -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Pending Amount</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-amber-700">
            ₹{{ formatMoney(kpiTotals.pendingAmount) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ pendingCount }} bills
            </span>
            <span class="text-slate-400">need follow-up</span>
          </div>
        </div>

        <!-- Card 4: Tax (GST) -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">GST Collected</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            ₹{{ formatMoney(kpiTotals.gstCollected) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md">
              CGST + SGST
            </span>
            <span class="text-slate-400">ready for filing</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar & Table Section -->
    <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 pt-3">
      <div class="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col overflow-hidden">
        <!-- Status Tabs & Controls Header -->
        <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <!-- Status Tabs -->
          <div class="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              v-for="tab in statusTabs"
              :key="tab.id"
              @click="activeStatusTab = tab.id"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5',
                activeStatusTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <span>{{ tab.name }}</span>
              <span
                :class="[
                  'text-[10px] px-1.5 py-0.2 rounded-full font-tabular',
                  activeStatusTab === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Search & Date Filter Group -->
          <div class="flex items-center space-x-2.5">
            <!-- Search Input -->
            <div class="relative w-56 lg:w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search invoice or customer..."
                class="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              />
            </div>

            <!-- Date Range Filter Pill -->
            <select
              v-model="activeDateFilter"
              class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <!-- Invoices Data Table -->
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <!-- Table Header -->
            <thead class="sticky top-0 bg-slate-50/90 backdrop-blur-xs text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 z-10">
              <tr>
                <th class="py-3 px-4 w-10">
                  <input type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                </th>
                <th class="py-3 px-4">Invoice #</th>
                <th class="py-3 px-4">Customer</th>
                <th class="py-3 px-4">Date & Time</th>
                <th class="py-3 px-4">Payment Mode</th>
                <th class="py-3 px-4 text-right">Taxable</th>
                <th class="py-3 px-4 text-right">Tax (GST)</th>
                <th class="py-3 px-4 text-right">Total Amount</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>

            <!-- Table Rows -->
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr
                v-for="inv in filteredInvoices"
                :key="inv.id"
                @click="openInvoiceDrawer(inv)"
                class="hover:bg-primary-50/40 cursor-pointer transition group"
              >
                <!-- Checkbox -->
                <td class="py-3.5 px-4" @click.stop>
                  <input type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                </td>

                <!-- Invoice Number -->
                <td class="py-3.5 px-4 font-bold text-slate-900 group-hover:text-primary-600 font-mono text-[11px] whitespace-nowrap">
                  {{ inv.number }}
                </td>

                <!-- Customer Info -->
                <td class="py-3.5 px-4">
                  <div class="flex items-center space-x-2.5">
                    <div class="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {{ getInitials(inv.customerName) }}
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-slate-900 truncate max-w-[150px]">{{ inv.customerName }}</div>
                      <div class="text-[10px] text-slate-400 font-medium">{{ inv.customerPhone || 'Walk-in' }}</div>
                    </div>
                  </div>
                </td>

                <!-- Date -->
                <td class="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                  <div>{{ inv.date }}</div>
                  <div class="text-[10px] text-slate-400">{{ inv.time }}</div>
                </td>

                <!-- Payment Mode Badge -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200/60 uppercase">
                    <span>{{ inv.paymentMode }}</span>
                  </span>
                </td>

                <!-- Taxable -->
                <td class="py-3.5 px-4 text-right font-tabular text-slate-600">
                  ₹{{ formatMoney(inv.taxable) }}
                </td>

                <!-- Tax -->
                <td class="py-3.5 px-4 text-right font-tabular text-slate-500 text-[11px]">
                  ₹{{ formatMoney(inv.tax) }}
                </td>

                <!-- Total Amount -->
                <td class="py-3.5 px-4 text-right font-bold text-slate-900 font-tabular">
                  ₹{{ formatMoney(inv.grandTotal) }}
                </td>

                <!-- Status Badge -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                      inv.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        : inv.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                        : inv.status === 'Overdue'
                        ? 'bg-rose-50 text-rose-700 border-rose-200/70'
                        : 'bg-purple-50 text-purple-700 border-purple-200/70'
                    ]"
                  >
                    <span
                      :class="[
                        'w-1.5 h-1.5 rounded-full',
                        inv.status === 'Paid' ? 'bg-emerald-500' : inv.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                      ]"
                    ></span>
                    <span>{{ inv.status }}</span>
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-center" @click.stop>
                  <div class="flex items-center justify-center space-x-1">
                    <button
                      @click="reprintBill(inv)"
                      title="Reprint Receipt (Thermal 80mm)"
                      class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Printer class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="shareWhatsApp(inv)"
                      title="Send on WhatsApp"
                      class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    >
                      <Share2 class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="openInvoiceDrawer(inv)"
                      title="View Details"
                      class="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                    >
                      <ArrowRight class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div
            v-if="filteredInvoices.length === 0"
            class="py-16 flex flex-col items-center justify-center text-center"
          >
            <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <FileText class="w-6 h-6 text-slate-300" />
            </div>
            <h4 class="text-sm font-bold text-slate-700">No invoices match your filter</h4>
            <p class="text-xs text-slate-400 mt-1">Try clearing search filters or create a new invoice</p>
          </div>
        </div>

        <!-- Table Pagination Footer -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span class="font-bold text-slate-800">{{ filteredInvoices.length }}</span> of <span class="font-bold text-slate-800">{{ invoices.length }}</span> invoices
          </div>
          <div class="flex items-center space-x-1">
            <button disabled class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-400 bg-white font-medium disabled:opacity-50">
              Previous
            </button>
            <button class="px-2.5 py-1 rounded-lg bg-primary-600 text-white font-bold">
              1
            </button>
            <button disabled class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-400 bg-white font-medium disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- SLIDE-OVER DRAWER: Invoice Detail (SCR-E3) -->
    <!-- ========================================== -->
    <div
      v-if="selectedInvoice"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
      @click.self="selectedInvoice = null"
    >
      <div class="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <!-- Drawer Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Receipt class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900 font-mono">{{ selectedInvoice.number }}</div>
              <div class="text-[10px] text-slate-400">Created on {{ selectedInvoice.date }} • {{ selectedInvoice.time }}</div>
            </div>
          </div>
          <button @click="selectedInvoice = null" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="flex-1 overflow-y-auto p-5 space-y-5">
          <!-- Status Banner -->
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div class="text-[10px] font-semibold text-slate-400 uppercase">Payment Status</div>
              <div class="text-xs font-bold text-slate-900 mt-0.5">{{ selectedInvoice.status }} via {{ selectedInvoice.paymentMode }}</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] font-semibold text-slate-400 uppercase">Grand Total</div>
              <div class="text-base font-extrabold text-slate-900 font-tabular">₹{{ formatMoney(selectedInvoice.grandTotal) }}</div>
            </div>
          </div>

          <!-- Customer Details -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Customer Details</div>
            <div class="p-3 rounded-xl bg-white border border-slate-200/80 text-xs space-y-1">
              <div class="font-bold text-slate-900">{{ selectedInvoice.customerName }}</div>
              <div class="text-slate-500">{{ selectedInvoice.customerPhone || 'Walk-in cash counter' }}</div>
              <div v-if="selectedInvoice.customerGstin" class="text-slate-500 font-mono text-[10px]">
                GSTIN: {{ selectedInvoice.customerGstin }}
              </div>
            </div>
          </div>

          <!-- Line Items Table -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Billed Items</div>
            <div class="rounded-xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 text-xs">
              <div
                v-for="item in selectedInvoice.items"
                :key="item.name"
                class="p-2.5 flex items-center justify-between"
              >
                <div>
                  <div class="font-semibold text-slate-900">{{ item.name }}</div>
                  <div class="text-[10px] text-slate-400">Qty: {{ item.qty }} • GST {{ item.gstRate }}%</div>
                </div>
                <div class="text-right font-bold text-slate-900 font-tabular">
                  ₹{{ formatMoney(item.rate * item.qty) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Taxes & Totals Breakup -->
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div class="flex justify-between text-slate-500">
              <span>Taxable Subtotal:</span>
              <span class="font-tabular font-medium">₹{{ formatMoney(selectedInvoice.taxable) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>CGST (6%):</span>
              <span class="font-tabular font-medium">₹{{ formatMoney(selectedInvoice.tax / 2) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>SGST (6%):</span>
              <span class="font-tabular font-medium">₹{{ formatMoney(selectedInvoice.tax / 2) }}</span>
            </div>
            <div class="flex justify-between pt-1.5 border-t border-slate-200 font-bold text-slate-900 text-sm">
              <span>Grand Total:</span>
              <span class="font-tabular">₹{{ formatMoney(selectedInvoice.grandTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Drawer Footer Actions -->
        <div class="p-4 border-t border-slate-100 bg-white flex items-center space-x-2">
          <button
            @click="openSalesReturnModal(selectedInvoice)"
            class="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center space-x-1.5 transition"
            title="Sales Return & Credit Note"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Return (SCR-E6)</span>
          </button>
          <button
            @click="shareWhatsApp(selectedInvoice)"
            class="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center space-x-1.5 transition"
          >
            <Share2 class="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            @click="reprintBill(selectedInvoice)"
            class="flex-1 py-2.5 px-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>Reprint (Thermal)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Sales Return / Credit Note (SCR-E6) -->
    <div
      v-if="showReturnModal && returnTargetInvoice"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showReturnModal = false"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div class="flex items-center space-x-2">
            <RotateCcw class="w-4 h-4 text-rose-600" />
            <div>
              <div class="text-xs font-bold text-slate-900">Sales Return & Credit Note (SCR-E6)</div>
              <div class="text-[10px] text-slate-500 font-mono">{{ returnTargetInvoice.number }} • {{ returnTargetInvoice.customerName }}</div>
            </div>
          </div>
          <button @click="showReturnModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1.5">Return Reason</label>
            <select
              v-model="returnForm.reason"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="Customer Exchange">Customer Size / Item Exchange</option>
              <option value="Defective / Quality Issue">Defective / Damaged / Expired</option>
              <option value="Excess Quantity Purchased">Excess Quantity Purchased</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1.5">Refund / Settlement Mode</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="returnForm.refund_mode = 'Credit Note'"
                :class="[
                  'py-2 px-3 text-center rounded-xl font-bold border transition text-xs',
                  returnForm.refund_mode === 'Credit Note'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                Khata Credit Note
              </button>
              <button
                type="button"
                @click="returnForm.refund_mode = 'Cash from Drawer'"
                :class="[
                  'py-2 px-3 text-center rounded-xl font-bold border transition text-xs',
                  returnForm.refund_mode === 'Cash from Drawer'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                Cash from Drawer
              </button>
            </div>
          </div>

          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-800">
            ✓ Returned items will be restored to Counter Inventory bin and Credit Note registered.
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            @click="showReturnModal = false"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            @click="confirmSalesReturn"
            class="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Confirm Return & Issue Credit Note
          </button>
        </div>
      </div>
    </div>

    <!-- Frappe Statutory Print Format Preview Modal -->
    <FrappePrintFormatModal
      v-model="showPrintFormatModal"
      :invoice="printTargetInvoice"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from '../../services/toast';
import FrappePrintFormatModal from '../../components/FrappePrintFormatModal.vue';
import {
  Plus,
  Search,
  Download,
  Receipt,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Printer,
  Share2,
  ArrowRight,
  RotateCcw,
  X
} from '@lucide/vue';

// Types
interface InvoiceItem {
  name: string;
  qty: number;
  rate: number;
  gstRate: number;
}

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  customerPhone?: string;
  customerGstin?: string;
  date: string;
  time: string;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Khata';
  taxable: number;
  tax: number;
  grandTotal: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Returned';
  items: InvoiceItem[];
}

// State
const toast = useToast();
const searchQuery = ref('');
const activeDateFilter = ref('all');
const activeStatusTab = ref('all');
const selectedInvoice = ref<Invoice | null>(null);

// Sales Return & Credit Note Modal (SCR-E6)
const showReturnModal = ref(false);
const returnTargetInvoice = ref<Invoice | null>(null);
const returnForm = ref({
  reason: 'Customer Exchange',
  refund_mode: 'Credit Note'
});

// Status Tabs
const statusTabs = ref([
  { id: 'all', name: 'All Invoices', count: 6 },
  { id: 'Paid', name: 'Paid', count: 4 },
  { id: 'Pending', name: 'Pending', count: 1 },
  { id: 'Overdue', name: 'Overdue', count: 1 },
]);

// Mock Invoices
const invoices = ref<Invoice[]>([
  {
    id: 'inv-1',
    number: 'INV-2026-0042',
    customerName: 'Walk-in Customer',
    customerPhone: 'Cash Sale',
    date: '16 Nov 2026',
    time: '11:15 AM',
    paymentMode: 'Cash',
    taxable: 151.04,
    tax: 16.96,
    grandTotal: 168.00,
    status: 'Paid',
    items: [
      { name: 'Paracetamol 650mg', qty: 2, rate: 35.00, gstRate: 12 },
      { name: 'Amoxicillin 500mg', qty: 1, rate: 72.50, gstRate: 12 },
      { name: 'N95 Protective Mask', qty: 1, rate: 25.00, gstRate: 5 }
    ]
  },
  {
    id: 'inv-2',
    number: 'INV-2026-0041',
    customerName: 'Ramesh Kumar (Retail)',
    customerPhone: '9842109876',
    date: '16 Nov 2026',
    time: '10:45 AM',
    paymentMode: 'UPI',
    taxable: 450.00,
    tax: 54.00,
    grandTotal: 504.00,
    status: 'Paid',
    items: [
      { name: 'Digital Thermometer', qty: 2, rate: 180.00, gstRate: 18 },
      { name: 'Dettol Antiseptic 100ml', qty: 2, rate: 65.00, gstRate: 18 }
    ]
  },
  {
    id: 'inv-3',
    number: 'INV-2026-0040',
    customerName: 'Priya Traders',
    customerPhone: '9443211223',
    customerGstin: '33AABCP1234F1Z1',
    date: '15 Nov 2026',
    time: '06:30 PM',
    paymentMode: 'Khata',
    taxable: 4200.00,
    tax: 504.00,
    grandTotal: 4704.00,
    status: 'Pending',
    items: [
      { name: 'Cetirizine 10mg Box', qty: 20, rate: 180.00, gstRate: 12 },
      { name: 'Baby Gripe Water 130ml', qty: 10, rate: 48.00, gstRate: 12 }
    ]
  },
  {
    id: 'inv-4',
    number: 'INV-2026-0039',
    customerName: 'Kumar Medicals',
    customerPhone: '9789123456',
    customerGstin: '33AABCK9988G1Z2',
    date: '14 Nov 2026',
    time: '04:15 PM',
    paymentMode: 'Card',
    taxable: 12000.00,
    tax: 1440.00,
    grandTotal: 13440.00,
    status: 'Paid',
    items: [
      { name: 'Surgical Gloves Box', qty: 15, rate: 450.00, gstRate: 12 },
      { name: 'Cotton Roll 100g Bundle', qty: 100, rate: 38.00, gstRate: 5 }
    ]
  },
  {
    id: 'inv-5',
    number: 'INV-2026-0038',
    customerName: 'Anand Sundaram',
    customerPhone: '9840011223',
    date: '02 Nov 2026',
    time: '01:20 PM',
    paymentMode: 'Khata',
    taxable: 2100.00,
    tax: 252.00,
    grandTotal: 2352.00,
    status: 'Overdue',
    items: [
      { name: 'First Aid Kit Complete', qty: 3, rate: 700.00, gstRate: 12 }
    ]
  },
  {
    id: 'inv-6',
    number: 'INV-2026-0037',
    customerName: 'Walk-in Customer',
    customerPhone: 'Cash Sale',
    date: '01 Nov 2026',
    time: '11:00 AM',
    paymentMode: 'Cash',
    taxable: 110.00,
    tax: 12.00,
    grandTotal: 122.00,
    status: 'Paid',
    items: [
      { name: 'Dettol Antiseptic 100ml', qty: 1, rate: 65.00, gstRate: 18 },
      { name: 'Cotton Roll 100g', qty: 1, rate: 40.00, gstRate: 5 }
    ]
  }
]);

// Computed KPI Metrics
const kpiTotals = computed(() => {
  const totalInvoiced = invoices.value.reduce((s, i) => s + i.grandTotal, 0);
  const paidAmount = invoices.value.filter(i => i.status === 'Paid').reduce((s, i) => s + i.grandTotal, 0);
  const pendingAmount = invoices.value.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((s, i) => s + i.grandTotal, 0);
  const gstCollected = invoices.value.reduce((s, i) => s + i.tax, 0);

  return { totalInvoiced, paidAmount, pendingAmount, gstCollected };
});

const paidPercentage = computed(() => {
  if (!kpiTotals.value.totalInvoiced) return 0;
  return Math.round((kpiTotals.value.paidAmount / kpiTotals.value.totalInvoiced) * 100);
});

const pendingCount = computed(() => {
  return invoices.value.filter(i => i.status === 'Pending' || i.status === 'Overdue').length;
});

// Filtered Invoices
const filteredInvoices = computed(() => {
  return invoices.value.filter(inv => {
    // Status filter
    if (activeStatusTab.value !== 'all' && inv.status !== activeStatusTab.value) {
      return false;
    }

    // Query filter
    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
      const matchNum = inv.number.toLowerCase().includes(q);
      const matchCust = inv.customerName.toLowerCase().includes(q);
      const matchPhone = inv.customerPhone?.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchPhone) return false;
    }

    return true;
  });
});

// Drawer & Actions
function openInvoiceDrawer(inv: Invoice) {
  selectedInvoice.value = inv;
}

function openSalesReturnModal(inv: Invoice) {
  returnTargetInvoice.value = inv;
  showReturnModal.value = true;
}

function confirmSalesReturn() {
  if (!returnTargetInvoice.value) return;
  const inv = returnTargetInvoice.value;
  inv.status = 'Returned';
  showReturnModal.value = false;
  selectedInvoice.value = null;
  toast.success(`Sales Return Processed: Credit Note issued for ${inv.number}. Stock restored to Counter.`);
}

const showPrintFormatModal = ref(false);
const printTargetInvoice = ref<any>(null);

function reprintBill(inv: Invoice) {
  printTargetInvoice.value = {
    number: inv.number,
    date: inv.date,
    time: '14:30',
    customer: inv.customerName,
    customer_phone: inv.customerPhone || '+91 94433 22110',
    customer_address: 'Gandhipuram, Coimbatore',
    items: inv.items.map(it => ({
      name: it.name,
      price: it.rate,
      qty: it.qty,
      unit: 'Pcs',
      gst_rate: it.gstRate || 12,
      hsn: '3004'
    })),
    taxable: inv.taxableAmount,
    tax: inv.taxAmount,
    total: inv.grandTotal,
    mode: inv.paymentMethod || 'Cash'
  };
  showPrintFormatModal.value = true;
  toast.success(`Opening Frappe Print Format for ${inv.number}...`);
}

function shareWhatsApp(inv: Invoice) {
  const text = `Hello ${inv.customerName}, your invoice #${inv.number} for ₹${formatMoney(inv.grandTotal)} from EasyBill Store is ready.`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  toast.info('Opening WhatsApp link...');
}

function exportToCSV() {
  const headers = ['Invoice No,Customer,Date,Payment Mode,Taxable,Tax,Total,Status\n'];
  const rows = invoices.value.map(i =>
    `"${i.number}","${i.customerName}","${i.date}","${i.paymentMode}",${i.taxable},${i.tax},${i.grandTotal},"${i.status}"\n`
  );
  const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `EasyBill_Invoices_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  toast.success('Invoices CSV exported successfully');
}

function getInitials(name: string): string {
  if (!name) return 'W';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatMoney(amount: number | undefined): string {
  if (amount === undefined || isNaN(amount)) return '0.00';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
</script>
