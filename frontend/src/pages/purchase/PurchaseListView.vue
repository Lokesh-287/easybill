<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top Financial KPI Cards Section (Behance Finance Standard) -->
    <div class="p-6 pb-2">
      <!-- Title & Quick Actions Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
            Purchases & Inward Stock
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Record supplier bills, inward inventory to warehouse, track liabilities & claim GST Input Tax Credit
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Export CSV Button -->
          <button
            @click="exportPurchasesCSV"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-card flex items-center space-x-1.5 transition"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <!-- New Purchase Bill Button (SCR-F2) -->
          <router-link
            to="/purchase/new"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <Plus class="w-4 h-4" />
            <span>+ New Purchase Bill</span>
          </router-link>
        </div>
      </div>

      <!-- 4 Financial KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Purchases -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Inward Purchases</span>
            <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <ShoppingBag class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            ₹{{ formatMoney(kpiTotals.totalPurchases) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ billsList.filter(b => !b.is_return).length }} bills
            </span>
            <span class="text-slate-400">inward stock logged</span>
          </div>
        </div>

        <!-- Card 2: Total Paid Amount -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Settled Payments</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
            ₹{{ formatMoney(kpiTotals.totalPaid) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ paidBillsCount }} Paid
            </span>
            <span class="text-slate-400">cleared via bank / cash</span>
          </div>
        </div>

        <!-- Card 3: Pending to Pay (Accounts Payable) -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Pending to Pay (AP)</span>
            <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownLeft class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-rose-700">
            ₹{{ formatMoney(kpiTotals.totalOutstanding) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ unpaidBillsCount }} Bills Due
            </span>
            <span class="text-slate-400">supplier credit payable</span>
          </div>
        </div>

        <!-- Card 4: Input Tax Credit (ITC) -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Input Tax Credit (ITC)</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-indigo-700">
            ₹{{ formatMoney(kpiTotals.totalITC) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md font-tabular">
              GSTR-2B Claim
            </span>
            <span class="text-slate-400">tax set-off available</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area: Filters & Data Table -->
    <div class="flex-1 p-6 pt-2 flex flex-col min-h-0">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        <!-- Filter Tabs & Search Controls Header -->
        <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Segmented Status Tabs -->
          <div class="flex items-center p-1 bg-slate-100/80 rounded-xl space-x-1">
            <button
              v-for="tab in filterTabs"
              :key="tab.id"
              @click="activeStatusTab = tab.id"
              :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeStatusTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              <span>{{ tab.label }}</span>
              <span
                :class="[
                  'ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full font-tabular',
                  activeStatusTab === tab.id
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'bg-slate-200/70 text-slate-600'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Search & Filter Selectors -->
          <div class="flex items-center space-x-2.5">
            <!-- Search Bar -->
            <div class="relative w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search Bill #, Supplier, Bill No..."
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 transition"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <!-- Supplier Filter Dropdown -->
            <select
              v-model="selectedSupplier"
              class="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="All">All Suppliers</option>
              <option v-for="sup in uniqueSuppliers" :key="sup" :value="sup">
                {{ sup }}
              </option>
            </select>
          </div>
        </div>

        <!-- Data Table Container -->
        <div class="flex-1 overflow-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th class="py-3 px-4">Purchase Bill #</th>
                <th class="py-3 px-4">Supplier Bill Ref</th>
                <th class="py-3 px-4">Supplier & GSTIN</th>
                <th class="py-3 px-4 text-right">Taxable</th>
                <th class="py-3 px-4 text-right">Tax (ITC)</th>
                <th class="py-3 px-4 text-right">Total Amount</th>
                <th class="py-3 px-4 text-center">Stock Inward</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="bill in filteredBills"
                :key="bill.id"
                @click="openPurchaseDetail(bill)"
                class="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <!-- Purchase Bill # -->
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <div
                      :class="[
                        'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                        bill.is_return ? 'bg-purple-100 text-purple-700' : 'bg-primary-50 text-primary-700'
                      ]"
                    >
                      <RotateCcw v-if="bill.is_return" class="w-3.5 h-3.5" />
                      <FileText v-else class="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div class="font-bold text-slate-900 group-hover:text-primary-600 transition">
                        {{ bill.id }}
                      </div>
                      <div class="text-[10px] text-slate-400">
                        {{ formatDate(bill.bill_date) }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Supplier Bill Ref -->
                <td class="py-3 px-4">
                  <div class="font-semibold text-slate-900 font-mono text-[11px]">
                    {{ bill.supplier_bill_no }}
                  </div>
                  <div class="text-[10px] text-slate-400 flex items-center space-x-1">
                    <span>Due:</span>
                    <span>{{ formatDate(bill.due_date) }}</span>
                  </div>
                </td>

                <!-- Supplier & GSTIN -->
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-900">
                    {{ bill.supplier_name }}
                  </div>
                  <div class="flex items-center space-x-1.5 mt-0.5">
                    <span v-if="bill.supplier_gstin" class="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                      {{ bill.supplier_gstin }}
                    </span>
                    <span class="text-[10px] text-slate-400">
                      {{ bill.supplier_state }}
                    </span>
                  </div>
                </td>

                <!-- Taxable Amount -->
                <td class="py-3 px-4 text-right font-tabular text-slate-600 font-medium">
                  ₹{{ formatMoney(bill.taxable_amount) }}
                </td>

                <!-- Tax (ITC) -->
                <td class="py-3 px-4 text-right font-tabular text-indigo-700 font-semibold">
                  ₹{{ formatMoney(bill.total_tax) }}
                </td>

                <!-- Total Amount -->
                <td class="py-3 px-4 text-right">
                  <div
                    :class="[
                      'font-extrabold font-tabular text-sm',
                      bill.is_return ? 'text-purple-700' : 'text-slate-900'
                    ]"
                  >
                    ₹{{ formatMoney(bill.grand_total) }}
                  </div>
                  <div v-if="bill.outstanding_amount > 0" class="text-[10px] text-rose-600 font-medium font-tabular">
                    Due: ₹{{ formatMoney(bill.outstanding_amount) }}
                  </div>
                </td>

                <!-- Stock Inward Status -->
                <td class="py-3 px-4 text-center">
                  <span
                    v-if="bill.stock_updated"
                    class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  >
                    <CheckCircle2 class="w-3 h-3 text-emerald-600" />
                    <span>Inwarded</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60"
                  >
                    <span>Pending</span>
                  </span>
                </td>

                <!-- Payment Status Pill -->
                <td class="py-3 px-4 text-center">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block',
                      bill.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' :
                      bill.payment_status === 'Partial' ? 'bg-amber-50 text-amber-700 border-amber-200/70' :
                      bill.payment_status === 'Debit Note' ? 'bg-purple-50 text-purple-700 border-purple-200/70' :
                      'bg-rose-50 text-rose-700 border-rose-200/70'
                    ]"
                  >
                    {{ bill.payment_status }}
                  </span>
                </td>

                <!-- Action Buttons -->
                <td class="py-3 px-4 text-right" @click.stop>
                  <div class="flex items-center justify-end space-x-1.5">
                    <!-- Issue Debit Note / Return Button -->
                    <button
                      v-if="!bill.is_return"
                      @click="openReturnModal(bill)"
                      title="Issue Debit Note / Purchase Return (SCR-F3)"
                      class="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                    >
                      <RotateCcw class="w-3.5 h-3.5" />
                    </button>

                    <!-- View Drawer -->
                    <button
                      @click="openPurchaseDetail(bill)"
                      title="View Bill Details"
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
            v-if="filteredBills.length === 0"
            class="py-16 flex flex-col items-center justify-center text-center"
          >
            <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <ShoppingBag class="w-6 h-6 text-slate-300" />
            </div>
            <h4 class="text-sm font-bold text-slate-700">No purchase bills match your criteria</h4>
            <p class="text-xs text-slate-400 mt-1">Try clearing search filters or record a new supplier bill</p>
          </div>
        </div>

        <!-- Table Footer Pagination / Status Bar -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span class="font-bold text-slate-800">{{ filteredBills.length }}</span> of <span class="font-bold text-slate-800">{{ billsList.length }}</span> purchase bills
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
    <!-- SLIDE-OVER DRAWER: Purchase Invoice Detail -->
    <!-- ========================================== -->
    <div
      v-if="showDetailDrawer && selectedBill"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
      @click.self="showDetailDrawer = false"
    >
      <div class="w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <!-- Drawer Header -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center space-x-3">
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center font-bold',
                selectedBill.is_return ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'
              ]"
            >
              <RotateCcw v-if="selectedBill.is_return" class="w-5 h-5" />
              <FileText v-else class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-extrabold text-slate-900">{{ selectedBill.id }}</span>
                <span
                  :class="[
                    'px-2 py-0.2 rounded-full text-[10px] font-bold border',
                    selectedBill.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedBill.payment_status === 'Debit Note' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  ]"
                >
                  {{ selectedBill.payment_status }}
                </span>
              </div>
              <div class="text-xs text-slate-400 mt-0.5">
                Supplier Bill: <span class="font-mono font-semibold text-slate-700">{{ selectedBill.supplier_bill_no }}</span> · Dated {{ formatDate(selectedBill.bill_date) }}
              </div>
            </div>
          </div>
          <button @click="showDetailDrawer = false" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Drawer Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Supplier Summary Card -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div class="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
              Supplier & Tax Details
            </div>
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-sm font-extrabold text-slate-900">{{ selectedBill.supplier_name }}</h3>
                <div class="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                  <span v-if="selectedBill.supplier_gstin" class="font-mono bg-white px-1.5 py-0.2 border rounded text-slate-700">
                    GSTIN: {{ selectedBill.supplier_gstin }}
                  </span>
                  <span>{{ selectedBill.supplier_state }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400">Inward Warehouse</div>
                <div class="text-xs font-bold text-slate-800 mt-0.5">{{ selectedBill.warehouse || 'Stores - EB' }}</div>
              </div>
            </div>
          </div>

          <!-- Inward Line Items Table -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-extrabold text-slate-800">Inward Items ({{ selectedBill.items.length }})</span>
              <span class="text-[11px] text-slate-400">Inventory updated atomically</span>
            </div>
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <tr>
                    <th class="py-2.5 px-3">Item Description</th>
                    <th class="py-2.5 px-3 text-center">Batch / Expiry</th>
                    <th class="py-2.5 px-3 text-right">Inward Qty</th>
                    <th class="py-2.5 px-3 text-right">Unit Rate</th>
                    <th class="py-2.5 px-3 text-right">Tax (GST)</th>
                    <th class="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr v-for="(item, idx) in selectedBill.items" :key="idx" class="hover:bg-slate-50/50">
                    <td class="py-2.5 px-3">
                      <div class="font-bold text-slate-900">{{ item.item_name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">HSN: {{ item.hsn }} · {{ item.item_code }}</div>
                    </td>
                    <td class="py-2.5 px-3 text-center text-[10px] text-slate-500">
                      <div v-if="item.batch_no" class="font-mono font-medium">{{ item.batch_no }}</div>
                      <div v-if="item.expiry_date" class="text-slate-400">Exp: {{ item.expiry_date }}</div>
                      <span v-if="!item.batch_no && !item.expiry_date" class="text-slate-300">—</span>
                    </td>
                    <td class="py-2.5 px-3 text-right font-tabular font-bold text-slate-800">
                      {{ item.qty }} {{ item.uom }}
                    </td>
                    <td class="py-2.5 px-3 text-right font-tabular">
                      ₹{{ formatMoney(item.rate) }}
                    </td>
                    <td class="py-2.5 px-3 text-right font-tabular text-indigo-700">
                      {{ item.gst_rate }}%
                    </td>
                    <td class="py-2.5 px-3 text-right font-tabular font-extrabold text-slate-900">
                      ₹{{ formatMoney(item.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Financial Settlement & Tax Breakdown -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2 text-xs">
            <div class="flex justify-between text-slate-600">
              <span>Taxable Subtotal</span>
              <span class="font-tabular font-semibold">₹{{ formatMoney(selectedBill.taxable_amount) }}</span>
            </div>
            <div class="flex justify-between text-slate-600" v-if="selectedBill.cgst">
              <span>CGST</span>
              <span class="font-tabular font-semibold text-indigo-600">₹{{ formatMoney(selectedBill.cgst) }}</span>
            </div>
            <div class="flex justify-between text-slate-600" v-if="selectedBill.sgst">
              <span>SGST</span>
              <span class="font-tabular font-semibold text-indigo-600">₹{{ formatMoney(selectedBill.sgst) }}</span>
            </div>
            <div class="flex justify-between text-slate-600" v-if="selectedBill.igst">
              <span>IGST (Inter-state)</span>
              <span class="font-tabular font-semibold text-indigo-600">₹{{ formatMoney(selectedBill.igst) }}</span>
            </div>
            <div class="border-t border-slate-200/70 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Grand Total</span>
              <span class="font-tabular text-base text-primary-700">₹{{ formatMoney(selectedBill.grand_total) }}</span>
            </div>
            <div class="flex justify-between text-emerald-700 pt-1">
              <span>Paid via {{ selectedBill.payment_mode }}</span>
              <span class="font-tabular font-bold">₹{{ formatMoney(selectedBill.paid_amount) }}</span>
            </div>
            <div v-if="selectedBill.outstanding_amount > 0" class="flex justify-between text-rose-700 font-bold border-t border-dashed border-slate-200 pt-2">
              <span>Pending Payable to Supplier</span>
              <span class="font-tabular">₹{{ formatMoney(selectedBill.outstanding_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Drawer Footer Actions -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            v-if="!selectedBill.is_return"
            @click="openReturnModal(selectedBill)"
            class="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 flex items-center space-x-1.5 transition"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Issue Debit Note (SCR-F3)</span>
          </button>
          <div v-else class="text-xs font-bold text-purple-700">
            Debit Note: {{ selectedBill.return_reason || 'Return' }}
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="showDetailDrawer = false"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: Purchase Return / Debit Note (SCR-F3)   -->
    <!-- ============================================== -->
    <div
      v-if="showReturnModal && returnBillTarget"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showReturnModal = false"
    >
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/60">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <RotateCcw class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">Issue Purchase Return / Debit Note (SCR-F3)</div>
              <div class="text-[10px] text-slate-500">Against {{ returnBillTarget.id }} (Supplier: {{ returnBillTarget.supplier_name }})</div>
            </div>
          </div>
          <button @click="showReturnModal = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Reason for Return</label>
            <select
              v-model="returnForm.reason"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="Damaged in Transit">Damaged in Transit / Transport</option>
              <option value="Defective Goods">Defective / Quality Rejected</option>
              <option value="Expired Batch">Expired / Near Expiry Batch</option>
              <option value="Supplier Over-shipment">Supplier Over-shipment</option>
              <option value="Pricing Error">Pricing Error on Supplier Invoice</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Refund Settlement Mode</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="mode in ['Debit Note', 'Cash Refund', 'Bank Transfer']"
                :key="mode"
                type="button"
                @click="returnForm.refund_mode = mode"
                :class="[
                  'py-2 px-2 text-center rounded-xl font-bold border transition text-[11px]',
                  returnForm.refund_mode === mode
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- Items to Return -->
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1.5">Select Items & Return Quantity</label>
            <div class="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
              <div
                v-for="item in returnBillTarget.items"
                :key="item.item_code"
                class="p-2.5 flex items-center justify-between text-xs"
              >
                <div>
                  <div class="font-bold text-slate-800">{{ item.item_name }}</div>
                  <div class="text-[10px] text-slate-400">Max returnable: {{ item.qty }} {{ item.uom }} @ ₹{{ item.rate }}</div>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="text-[10px] text-slate-400">Qty:</span>
                  <input
                    v-model.number="returnQuantities[item.item_code]"
                    type="number"
                    min="0"
                    :max="item.qty"
                    class="w-16 px-2 py-1 text-right font-tabular font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            @click="showReturnModal = false"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            @click="submitPurchaseReturn"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 flex items-center space-x-1.5"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>Confirm & Issue Debit Note</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  ShoppingBag,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Search,
  Plus,
  Download,
  FileText,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  X
} from '@lucide/vue';

interface PurchaseItem {
  item_code: string;
  item_name: string;
  hsn: string;
  qty: number;
  uom: string;
  rate: number;
  amount: number;
  gst_rate: number;
  cgst_amount?: number;
  sgst_amount?: number;
  batch_no?: string;
  expiry_date?: string;
}

interface PurchaseBill {
  id: string;
  supplier_bill_no: string;
  supplier_id: string;
  supplier_name: string;
  supplier_gstin: string;
  supplier_state: string;
  bill_date: string;
  due_date: string;
  taxable_amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_tax: number;
  round_off: number;
  grand_total: number;
  paid_amount: number;
  outstanding_amount: number;
  payment_status: 'Paid' | 'Partial' | 'Unpaid' | 'Debit Note';
  payment_mode: string;
  stock_updated: boolean;
  warehouse: string;
  is_return: boolean;
  return_against?: string;
  return_reason?: string;
  items: PurchaseItem[];
}

// State
const searchQuery = ref('');
const selectedSupplier = ref('All');
const activeStatusTab = ref('all');
const showDetailDrawer = ref(false);
const showReturnModal = ref(false);
const selectedBill = ref<PurchaseBill | null>(null);
const returnBillTarget = ref<PurchaseBill | null>(null);
const returnQuantities = ref<Record<string, number>>({});

const returnForm = ref({
  reason: 'Damaged in Transit',
  refund_mode: 'Debit Note'
});

// Seed Initial List
const billsList = ref<PurchaseBill[]>([
  {
    id: "PUR-2026-0001",
    supplier_bill_no: "INV-88912",
    supplier_id: "SUPP-001",
    supplier_name: "MediPharma Distributors",
    supplier_gstin: "33AABCM5678H1Z4",
    supplier_state: "Tamil Nadu (33)",
    bill_date: "2026-11-15",
    due_date: "2026-11-30",
    taxable_amount: 16500.00,
    cgst: 990.00,
    sgst: 990.00,
    igst: 0.00,
    total_tax: 1980.00,
    round_off: 0.00,
    grand_total: 18480.00,
    paid_amount: 18480.00,
    outstanding_amount: 0.00,
    payment_status: "Paid",
    payment_mode: "Bank Transfer",
    stock_updated: true,
    warehouse: "Stores - EB",
    is_return: false,
    items: [
      { item_code: "MED-001", item_name: "Paracetamol 650mg", hsn: "300490", qty: 500, uom: "Strip", rate: 22.00, amount: 11000.00, gst_rate: 12, batch_no: "BAT-26K01", expiry_date: "2027-10-31" },
      { item_code: "MED-002", item_name: "Amoxicillin 500mg", hsn: "300410", qty: 100, uom: "Strip", rate: 48.00, amount: 4800.00, gst_rate: 12, batch_no: "BAT-26K02", expiry_date: "2027-12-31" },
      { item_code: "MED-003", item_name: "Cetirizine 10mg", hsn: "300490", qty: 70, uom: "Strip", rate: 10.00, amount: 700.00, gst_rate: 12, batch_no: "BAT-26K03", expiry_date: "2028-02-28" }
    ]
  },
  {
    id: "PUR-2026-0002",
    supplier_bill_no: "SUP-4491",
    supplier_id: "SUPP-002",
    supplier_name: "Apex Health Supplies",
    supplier_gstin: "33AABCA4321J1Z8",
    supplier_state: "Tamil Nadu (33)",
    bill_date: "2026-11-14",
    due_date: "2026-11-29",
    taxable_amount: 11400.00,
    cgst: 600.00,
    sgst: 600.00,
    igst: 0.00,
    total_tax: 1200.00,
    round_off: 0.00,
    grand_total: 12600.00,
    paid_amount: 0.00,
    outstanding_amount: 12600.00,
    payment_status: "Unpaid",
    payment_mode: "Credit",
    stock_updated: true,
    warehouse: "Stores - EB",
    is_return: false,
    items: [
      { item_code: "GEN-001", item_name: "N95 Protective Mask", hsn: "630790", qty: 400, uom: "Pcs", rate: 14.00, amount: 5600.00, gst_rate: 5 },
      { item_code: "PER-001", item_name: "Dettol Antiseptic 100ml", hsn: "380894", qty: 100, uom: "Bottle", rate: 49.00, amount: 4900.00, gst_rate: 18, batch_no: "DET-881", expiry_date: "2028-06-30" },
      { item_code: "GEN-002", item_name: "Cotton Roll 100g", hsn: "300590", qty: 35, uom: "Roll", rate: 26.00, amount: 910.00, gst_rate: 5 }
    ]
  },
  {
    id: "PUR-2026-0003",
    supplier_bill_no: "APX-2026-901",
    supplier_id: "SUPP-003",
    supplier_name: "South India Drug House",
    supplier_gstin: "33AABCS8765K1Z9",
    supplier_state: "Tamil Nadu (33)",
    bill_date: "2026-11-12",
    due_date: "2026-11-27",
    taxable_amount: 21875.00,
    cgst: 1312.50,
    sgst: 1312.50,
    igst: 0.00,
    total_tax: 2625.00,
    round_off: 0.00,
    grand_total: 24500.00,
    paid_amount: 10000.00,
    outstanding_amount: 14500.00,
    payment_status: "Partial",
    payment_mode: "UPI / Bank",
    stock_updated: true,
    warehouse: "Stores - EB",
    is_return: false,
    items: [
      { item_code: "GEN-003", item_name: "Surgical Gloves Latex (Box of 50)", hsn: "401511", qty: 50, uom: "Box", rate: 210.00, amount: 10500.00, gst_rate: 12, batch_no: "GLV-901", expiry_date: "2029-01-31" },
      { item_code: "BAB-002", item_name: "Digital Thermometer", hsn: "902519", qty: 50, uom: "Pcs", rate: 115.00, amount: 5750.00, gst_rate: 18 },
      { item_code: "GEN-004", item_name: "Hand Sanitizer 500ml", hsn: "380894", qty: 65, uom: "Bottle", rate: 85.00, amount: 5525.00, gst_rate: 18, batch_no: "SAN-221", expiry_date: "2027-08-31" }
    ]
  },
  {
    id: "PUR-2026-0004",
    supplier_bill_no: "RET-DRG-11",
    supplier_id: "SUPP-003",
    supplier_name: "South India Drug House",
    supplier_gstin: "33AABCS8765K1Z9",
    supplier_state: "Tamil Nadu (33)",
    bill_date: "2026-11-13",
    due_date: "2026-11-13",
    taxable_amount: -2857.14,
    cgst: -171.43,
    sgst: -171.43,
    igst: 0.00,
    total_tax: -342.86,
    round_off: 0.00,
    grand_total: -3200.00,
    paid_amount: -3200.00,
    outstanding_amount: 0.00,
    payment_status: "Debit Note",
    payment_mode: "Credit Adjustment",
    stock_updated: true,
    warehouse: "Stores - EB",
    is_return: true,
    return_against: "PUR-2026-0003",
    return_reason: "Damaged in Transit",
    items: [
      { item_code: "GEN-004", item_name: "Hand Sanitizer 500ml", hsn: "380894", qty: -32, uom: "Bottle", rate: 85.00, amount: -2720.00, gst_rate: 18 }
    ]
  }
]);

// Computed
const uniqueSuppliers = computed(() => {
  const sups = new Set<string>();
  billsList.value.forEach(b => sups.add(b.supplier_name));
  return Array.from(sups);
});

const paidBillsCount = computed(() => billsList.value.filter(b => b.payment_status === 'Paid').length);
const unpaidBillsCount = computed(() => billsList.value.filter(b => b.payment_status === 'Unpaid' || b.payment_status === 'Partial').length);
const debitNotesCount = computed(() => billsList.value.filter(b => b.is_return).length);

const filterTabs = computed(() => [
  { id: 'all', label: 'All Purchases', count: billsList.value.length },
  { id: 'paid', label: 'Paid Bills', count: paidBillsCount.value },
  { id: 'unpaid', label: 'Unpaid / Credit', count: unpaidBillsCount.value },
  { id: 'returns', label: 'Debit Notes', count: debitNotesCount.value }
]);

const kpiTotals = computed(() => {
  const normalBills = billsList.value.filter(b => !b.is_return);
  return {
    totalPurchases: normalBills.reduce((acc, b) => acc + b.grand_total, 0),
    totalPaid: normalBills.reduce((acc, b) => acc + b.paid_amount, 0),
    totalOutstanding: normalBills.reduce((acc, b) => acc + b.outstanding_amount, 0),
    totalITC: normalBills.reduce((acc, b) => acc + b.total_tax, 0)
  };
});

const filteredBills = computed(() => {
  return billsList.value.filter(b => {
    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const match = (
        b.id.toLowerCase().includes(q) ||
        b.supplier_bill_no.toLowerCase().includes(q) ||
        b.supplier_name.toLowerCase().includes(q) ||
        b.supplier_gstin.toLowerCase().includes(q)
      );
      if (!match) return false;
    }

    // Supplier filter
    if (selectedSupplier.value !== 'All' && b.supplier_name !== selectedSupplier.value) {
      return false;
    }

    // Tab filter
    if (activeStatusTab.value === 'paid' && b.payment_status !== 'Paid') return false;
    if (activeStatusTab.value === 'unpaid' && b.payment_status !== 'Unpaid' && b.payment_status !== 'Partial') return false;
    if (activeStatusTab.value === 'returns' && !b.is_return) return false;

    return true;
  });
});

// Methods
function formatMoney(amount: number): string {
  if (amount === undefined || amount === null) return '0.00';
  return Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function openPurchaseDetail(bill: PurchaseBill) {
  selectedBill.value = bill;
  showDetailDrawer.value = true;
}

function openReturnModal(bill: PurchaseBill) {
  returnBillTarget.value = bill;
  returnQuantities.value = {};
  bill.items.forEach(itm => {
    returnQuantities.value[itm.item_code] = 0;
  });
  showReturnModal.value = true;
}

function submitPurchaseReturn() {
  if (!returnBillTarget.value) return;

  const target = returnBillTarget.value;
  let totalRetQty = 0;
  const returnItemsList: any[] = [];

  target.items.forEach(itm => {
    const qty = returnQuantities.value[itm.item_code] || 0;
    if (qty > 0) {
      totalRetQty += qty;
      returnItemsList.push({
        item_code: itm.item_code,
        item_name: itm.item_name,
        hsn: itm.hsn,
        qty: -qty,
        uom: itm.uom,
        rate: itm.rate,
        amount: -(qty * itm.rate),
        gst_rate: itm.gst_rate
      });
    }
  });

  if (totalRetQty === 0) {
    alert('Please enter a return quantity greater than 0 for at least one item');
    return;
  }

  const taxableRet = returnItemsList.reduce((acc, itm) => acc + itm.amount, 0);
  const taxRet = taxableRet * 0.12; // average
  const grandTotalRet = taxableRet + taxRet;

  const newReturnBill: PurchaseBill = {
    id: `PUR-2026-${billsList.value.length + 1}`.padStart(13, '0'),
    supplier_bill_no: `RET-${target.supplier_bill_no}`,
    supplier_id: target.supplier_id,
    supplier_name: target.supplier_name,
    supplier_gstin: target.supplier_gstin,
    supplier_state: target.supplier_state,
    bill_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
    taxable_amount: taxableRet,
    cgst: taxRet / 2,
    sgst: taxRet / 2,
    igst: 0,
    total_tax: taxRet,
    round_off: 0,
    grand_total: grandTotalRet,
    paid_amount: grandTotalRet,
    outstanding_amount: 0,
    payment_status: 'Debit Note',
    payment_mode: returnForm.value.refund_mode,
    stock_updated: true,
    warehouse: target.warehouse,
    is_return: true,
    return_against: target.id,
    return_reason: returnForm.value.reason,
    items: returnItemsList
  };

  billsList.value.unshift(newReturnBill);
  showReturnModal.value = false;
  showDetailDrawer.value = false;
}

function exportPurchasesCSV() {
  const headers = ['Purchase Bill ID', 'Supplier Bill No', 'Date', 'Supplier Name', 'GSTIN', 'Taxable', 'Tax', 'Grand Total', 'Paid', 'Due', 'Status'];
  const rows = billsList.value.map(b => [
    b.id,
    b.supplier_bill_no,
    b.bill_date,
    `"${b.supplier_name}"`,
    b.supplier_gstin,
    b.taxable_amount,
    b.total_tax,
    b.grand_total,
    b.paid_amount,
    b.outstanding_amount,
    b.payment_status
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `easybill_purchases_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Fetch from API if available
onMounted(async () => {
  try {
    const res = await fetch('/api/method/easybill.api.v1.purchase.list_purchases');
    if (res.ok) {
      const data = await res.json();
      if (data.message && data.message.data && data.message.data.rows) {
        billsList.value = data.message.data.rows;
      }
    }
  } catch (err) {
    console.log('Using local seed purchases');
  }
});
</script>
