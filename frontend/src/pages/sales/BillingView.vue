<template>
  <div class="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100 select-none">
    <!-- ========================================== -->
    <!-- LEFT PANE: Catalog, Search & Categories    -->
    <!-- ========================================== -->
    <div class="lg:w-7/12 flex flex-col p-4 border-r border-slate-200/90 overflow-hidden bg-slate-50/60">
      <!-- Search, Barcode & Action Controls -->
      <div class="flex items-center space-x-2.5 mb-3.5">
        <!-- Search Input -->
        <div class="relative flex-1">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Scan barcode or search name/HSN (F2)..."
            class="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-xs transition"
            @keydown.enter="handleSearchEnter"
            @keydown.esc="searchQuery = ''"
          />
          <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <span v-if="searchQuery" @click="searchQuery = ''" class="cursor-pointer text-slate-400 hover:text-slate-600 p-0.5">
              <X class="w-3.5 h-3.5" />
            </span>
            <kbd class="px-1.5 py-0.5 text-[10px] bg-slate-100 border border-slate-300 text-slate-500 rounded font-mono shadow-2xs">
              F2
            </kbd>
          </div>
        </div>

        <!-- Barcode Continuous Mode Toggle -->
        <button
          @click="isBarcodeMode = !isBarcodeMode"
          :class="[
            'px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs',
            isBarcodeMode
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          ]"
          :title="isBarcodeMode ? 'Continuous Barcode Mode ON' : 'Click to enable Continuous Barcode Mode'"
        >
          <Barcode class="w-4 h-4" />
          <span class="hidden sm:inline">Scanner</span>
          <span :class="['w-2 h-2 rounded-full', isBarcodeMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300']"></span>
        </button>

        <!-- Quick Add Item Button (SCR-F5) -->
        <button
          @click="showQuickAddModal = true"
          class="px-3.5 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold text-xs rounded-xl shadow-xs shadow-primary-600/30 flex items-center space-x-1.5 transition"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Add Item</span>
          <kbd class="hidden md:inline px-1 py-0.2 bg-primary-700 text-[9px] rounded font-mono">F3</kbd>
        </button>
      </div>

      <!-- Category Filter Pills & Density Switcher -->
      <div class="flex items-center justify-between space-x-2 mb-3">
        <!-- Category Tabs -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
          <button
            v-for="cat in categories"
            :key="cat.name"
            @click="activeCategory = cat.name"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5',
              activeCategory === cat.name
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <span>{{ cat.name }}</span>
            <span
              :class="[
                'text-[10px] px-1.5 py-0.2 rounded-full font-tabular',
                activeCategory === cat.name ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
              ]"
            >
              {{ cat.count }}
            </span>
          </button>
        </div>

        <!-- View Switcher (Grid vs Dense List) -->
        <div class="hidden sm:flex items-center p-0.5 bg-white border border-slate-200 rounded-lg">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-1.5 rounded-md transition text-xs',
              viewMode === 'grid' ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' : 'text-slate-400 hover:text-slate-700'
            ]"
            title="Grid View"
          >
            <div class="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
              <span class="bg-current rounded-xs"></span>
              <span class="bg-current rounded-xs"></span>
              <span class="bg-current rounded-xs"></span>
              <span class="bg-current rounded-xs"></span>
            </div>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-1.5 rounded-md transition text-xs',
              viewMode === 'list' ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' : 'text-slate-400 hover:text-slate-700'
            ]"
            title="Dense List View"
          >
            <div class="w-3.5 h-3.5 flex flex-col justify-between">
              <span class="h-0.5 bg-current rounded-xs"></span>
              <span class="h-0.5 bg-current rounded-xs"></span>
              <span class="h-0.5 bg-current rounded-xs"></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Catalog Presentation: Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 pr-1 content-start"
      >
        <div
          v-for="item in filteredItems"
          :key="item.code"
          data-testid="pos-item-card"
          @click="addToCart(item)"
          class="pos-item-card bg-white p-3 rounded-xl border border-slate-200 hover:border-primary-500 hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col justify-between group active:scale-[0.98] relative overflow-hidden"
        >
          <!-- Category & Stock Badges -->
          <div>
            <div class="flex justify-between items-start mb-1.5">
              <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {{ item.category }}
              </span>
              <span
                :class="[
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-md font-tabular flex items-center space-x-1',
                  item.stock > 10
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : item.stock > 0
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                ]"
              >
                <span :class="['w-1.5 h-1.5 rounded-full', item.stock > 10 ? 'bg-emerald-500' : item.stock > 0 ? 'bg-amber-500' : 'bg-rose-500']"></span>
                <span>{{ item.stock }} {{ item.unit }}</span>
              </span>
            </div>

            <!-- Product Names -->
            <h3 class="font-semibold text-slate-900 text-xs leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
              {{ item.name }}
            </h3>
            <div v-if="item.name_ta" class="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              {{ item.name_ta }}
            </div>
            <div class="text-[9px] text-slate-400 font-mono mt-1">
              HSN: {{ item.hsn }}
            </div>
          </div>

          <!-- Price & Tax Footer -->
          <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <span class="text-[10px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              GST {{ item.gst_rate }}%
            </span>
            <div class="text-right">
              <span class="text-xs font-bold text-slate-900 font-tabular">
                ₹{{ formatMoney(item.price) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Catalog Presentation: Dense List View -->
      <div v-else class="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        <div
          v-for="item in filteredItems"
          :key="item.code"
          @click="addToCart(item)"
          class="px-3.5 py-2 hover:bg-primary-50/60 cursor-pointer flex items-center justify-between transition group"
        >
          <div class="flex items-center space-x-3 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 flex-shrink-0">
              <Package class="w-4 h-4 text-slate-500" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-xs text-slate-900 group-hover:text-primary-600 truncate">{{ item.name }}</span>
                <span class="text-[10px] text-slate-400 font-mono">HSN: {{ item.hsn }}</span>
              </div>
              <div class="text-[11px] text-slate-500 truncate">{{ item.name_ta }} • {{ item.category }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-4 flex-shrink-0">
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {{ item.stock }} in stock
            </span>
            <span class="text-[10px] text-slate-500 font-medium">GST {{ item.gst_rate }}%</span>
            <span class="text-xs font-bold text-slate-900 font-tabular w-16 text-right">
              ₹{{ formatMoney(item.price) }}
            </span>
            <button class="p-1 rounded-md bg-slate-100 text-slate-600 group-hover:bg-primary-600 group-hover:text-white transition">
              <Plus class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Bill Cart & Payment Split      -->
    <!-- ========================================== -->
    <div class="lg:w-5/12 flex flex-col bg-white border-l border-slate-200/90 shadow-sm overflow-hidden flex-shrink-0">
      <!-- Customer Selector Header -->
      <div class="p-3.5 border-b border-slate-200/90 bg-slate-50/90 flex items-center justify-between">
        <div
          @click="showCustomerModal = true"
          class="flex items-center space-x-2.5 cursor-pointer group p-1 -m-1 rounded-lg hover:bg-slate-200/60 transition"
          title="Change Customer (F4)"
        >
          <div class="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <User class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center space-x-1.5">
              <span class="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition truncate max-w-[170px]">
                {{ currentCustomer.name }}
              </span>
              <kbd class="px-1 py-0.2 text-[9px] bg-white border border-slate-300 text-slate-500 rounded font-mono">F4</kbd>
            </div>
            <div class="text-[11px] text-slate-500">
              {{ currentCustomer.phone || 'Cash Customer' }}
            </div>
          </div>
        </div>

        <div class="text-right">
          <div class="text-[10px] font-medium text-slate-400">Balance</div>
          <div
            :class="[
              'text-xs font-bold font-tabular',
              currentCustomer.balance > 0 ? 'text-amber-600' : 'text-emerald-600'
            ]"
          >
            ₹{{ formatMoney(currentCustomer.balance) }}
          </div>
        </div>
      </div>

      <!-- Cart Header & Line Count Bar -->
      <div class="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
        <div class="flex items-center space-x-2">
          <span>Items ({{ cart.length }})</span>
          <span v-if="cart.length" class="text-slate-400">•</span>
          <span v-if="cart.length" class="text-slate-500 font-tabular font-normal">{{ totalUnits }} units</span>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Held Bills Counter Trigger (SCR-E5) -->
          <button
            v-if="heldBills.length"
            @click="showHeldBillsModal = true"
            class="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-bold flex items-center space-x-1 transition"
          >
            <Pause class="w-3 h-3" />
            <span>{{ heldBills.length }} Held</span>
          </button>

          <button
            v-if="cart.length"
            @click="clearCart"
            class="text-[11px] font-medium text-rose-600 hover:text-rose-800 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Cart Line Items Table -->
      <div class="flex-1 overflow-y-auto">
        <!-- Empty State -->
        <div
          v-if="cart.length === 0"
          class="h-full flex flex-col items-center justify-center p-8 text-center"
        >
          <div class="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
            <Receipt class="w-8 h-8 text-slate-300" />
          </div>
          <h4 class="text-sm font-bold text-slate-700">Bill Cart is Empty</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-[220px]">
            Scan a barcode or tap products from catalog to start billing
          </p>
          <div class="mt-4 flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-700">F2</kbd>
            <span>Search items</span>
          </div>
        </div>

        <!-- Table of Line Items -->
        <div v-else class="divide-y divide-slate-100">
          <div
            v-for="(line, idx) in cart"
            :key="line.code"
            class="p-3 hover:bg-slate-50/80 transition flex items-center justify-between"
          >
            <!-- Left: Item details -->
            <div class="min-w-0 flex-1 pr-3">
              <div class="flex items-center space-x-1.5">
                <span class="text-[11px] font-bold text-slate-400 font-tabular">{{ idx + 1 }}.</span>
                <span class="font-semibold text-xs text-slate-900 truncate">{{ line.name }}</span>
              </div>
              <div class="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                <span>₹{{ formatMoney(line.price) }} / {{ line.unit }}</span>
                <span>•</span>
                <span>GST {{ line.gst_rate }}%</span>
              </div>
            </div>

            <!-- Center: Qty Stepper -->
            <div class="flex items-center space-x-1 mr-3 flex-shrink-0">
              <button
                @click="updateQty(line, -1)"
                class="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 transition"
              >
                <Minus class="w-3 h-3" />
              </button>
              <input
                v-model.number="line.qty"
                type="number"
                min="1"
                class="w-10 h-6 text-center text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 font-tabular"
              />
              <button
                @click="updateQty(line, 1)"
                class="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 transition"
              >
                <Plus class="w-3 h-3" />
              </button>
            </div>

            <!-- Right: Line Total & Remove -->
            <div class="text-right flex items-center space-x-3 flex-shrink-0">
              <div class="text-xs font-bold text-slate-900 font-tabular w-16">
                ₹{{ formatMoney(line.price * line.qty) }}
              </div>
              <button
                @click="removeFromCart(idx)"
                class="p-1 rounded-md text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition"
                title="Remove item"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- Cart Totals & Payment Settlement Panel     -->
      <!-- ========================================== -->
      <div class="border-t border-slate-200/90 bg-slate-50/90 p-4 space-y-3">
        <!-- Subtotals & Taxes Grid -->
        <div class="space-y-1.5 text-xs text-slate-600">
          <div class="flex justify-between font-medium">
            <span>Taxable Subtotal:</span>
            <span class="font-tabular">₹{{ formatMoney(taxableSubtotal) }}</span>
          </div>
          <div class="flex justify-between font-medium text-slate-500">
            <span>Taxes (CGST + SGST):</span>
            <span class="font-tabular">₹{{ formatMoney(totalTax) }}</span>
          </div>
          <div v-if="roundingDiff !== 0" class="flex justify-between text-[11px] text-slate-400">
            <span>Round Off:</span>
            <span class="font-tabular">{{ roundingDiff > 0 ? '+' : '' }}₹{{ formatMoney(roundingDiff) }}</span>
          </div>
          <!-- Total Payable in massive font -->
          <div class="flex justify-between items-baseline pt-2 border-t border-slate-200 font-bold text-slate-900">
            <span class="text-xs uppercase tracking-wide text-slate-500">Total Payable</span>
            <div class="text-right">
              <span class="text-2xl font-extrabold text-slate-900 font-tabular">
                ₹{{ formatMoney(roundedGrandTotal) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Mode Selectors -->
        <div class="grid grid-cols-4 gap-1.5 pt-1">
          <button
            v-for="mode in paymentModes"
            :key="mode.id"
            @click="selectedPaymentMode = mode.id"
            :class="[
              'py-2 px-1 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center space-y-1',
              selectedPaymentMode === mode.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            ]"
          >
            <component :is="mode.icon" class="w-3.5 h-3.5" />
            <span class="text-[11px]">{{ mode.name }}</span>
          </button>
        </div>

        <!-- Dynamic Payment Panel: Cash Denominations & Change -->
        <div v-if="selectedPaymentMode === 'cash'" class="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-slate-600">Cash Received:</span>
            <div class="flex items-center space-x-1.5">
              <span class="text-slate-400 font-bold text-xs">₹</span>
              <input
                v-model.number="cashReceived"
                type="number"
                placeholder="0.00"
                class="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-right font-bold text-xs text-slate-900 font-tabular focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          <!-- Quick Cash Presets -->
          <div class="flex items-center space-x-1 overflow-x-auto pb-0.5">
            <button
              @click="cashReceived = roundedGrandTotal"
              class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold font-tabular transition"
            >
              Exact
            </button>
            <button
              v-for="preset in [100, 200, 500, 2000]"
              :key="preset"
              @click="cashReceived = preset"
              class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold font-tabular transition"
            >
              ₹{{ preset }}
            </button>
          </div>
          <!-- Change Return Display -->
          <div v-if="cashReceived > roundedGrandTotal" class="pt-1.5 border-t border-slate-100 flex justify-between items-center text-xs">
            <span class="font-semibold text-emerald-700">Change to Return:</span>
            <span class="font-bold text-emerald-700 font-tabular text-sm">
              ₹{{ formatMoney(cashReceived - roundedGrandTotal) }}
            </span>
          </div>
        </div>

        <!-- Dynamic Payment Panel: UPI QR Code -->
        <div v-else-if="selectedPaymentMode === 'upi'" class="p-3 bg-white border border-slate-200 rounded-xl flex items-center space-x-3">
          <div class="w-14 h-14 bg-slate-100 rounded-lg border border-slate-200 p-1 flex items-center justify-center flex-shrink-0">
            <QrCode class="w-12 h-12 text-slate-800" />
          </div>
          <div class="text-xs min-w-0">
            <div class="font-bold text-slate-800">Dynamic UPI QR</div>
            <div class="text-[11px] text-slate-500 font-mono truncate">easybill@icici • ₹{{ formatMoney(roundedGrandTotal) }}</div>
            <div class="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center space-x-1">
              <Check class="w-3 h-3" />
              <span>Ready for Customer Scan</span>
            </div>
          </div>
        </div>

        <!-- Bottom Action Buttons Toolbar (F8, F9, Hold) -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <!-- Hold / Park Bill Button (F9) -->
          <button
            :disabled="!cart.length"
            @click="holdCurrentBill"
            class="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
          >
            <Pause class="w-3.5 h-3.5" />
            <span>Hold Bill</span>
            <kbd class="px-1 py-0.2 bg-slate-300 text-[9px] rounded font-mono">F9</kbd>
          </button>

          <!-- Primary CTA: Save & Print Bill (F8) -->
          <button
            :disabled="!cart.length"
            data-testid="btn-save-print"
            @click="completeAndPrintBill"
            class="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center justify-center space-x-1.5"
          >
            <Printer class="w-4 h-4" />
            <span>Save & Print</span>
            <kbd class="px-1.5 py-0.2 bg-emerald-700 text-emerald-100 text-[10px] rounded font-mono font-bold">F8</kbd>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 1: Thermal Receipt Preview Modal     -->
    <!-- ========================================== -->
    <div
      v-if="showReceiptModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Receipt Modal Header -->
        <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Printer class="w-4 h-4 text-emerald-400" />
            <span class="font-bold text-sm">Receipt Preview (80mm)</span>
          </div>
          <button @click="showReceiptModal = false" class="text-slate-400 hover:text-white p-1">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Thermal Receipt Body (Emulated Print Paper) -->
        <div class="p-5 overflow-y-auto bg-slate-50 font-mono text-[11px] leading-tight text-slate-800 select-text" id="thermal-receipt-printable">
          <div class="text-center pb-3 border-b border-dashed border-slate-400">
            <div class="text-sm font-bold tracking-wider">EASYBILL STORE</div>
            <div class="text-[10px]">104, Cross Cut Road, Gandhipuram</div>
            <div class="text-[10px]">Coimbatore - 641012 • Ph: 9876543210</div>
            <div class="text-[10px] font-bold mt-1">GSTIN: 33AAAAA0000A1Z5</div>
          </div>

          <div class="py-2 border-b border-dashed border-slate-400 text-[10px]">
            <div class="flex justify-between">
              <span>Invoice: {{ lastBill.number || 'INV-2026-0042' }}</span>
              <span>{{ lastBill.date || '16-11-2026' }}</span>
            </div>
            <div class="flex justify-between mt-0.5">
              <span>Customer: {{ lastBill.customer || 'Walk-in' }}</span>
              <span>Cashier: LK</span>
            </div>
          </div>

          <!-- Items Table in Receipt -->
          <div class="py-2 border-b border-dashed border-slate-400">
            <div class="flex justify-between font-bold pb-1 text-[10px]">
              <span class="w-1/2">Item</span>
              <span class="w-1/6 text-right">Qty</span>
              <span class="w-1/3 text-right">Total</span>
            </div>
            <div v-for="item in lastBill.items" :key="item.code" class="flex justify-between py-0.5">
              <span class="w-1/2 truncate">{{ item.name }}</span>
              <span class="w-1/6 text-right">{{ item.qty }}</span>
              <span class="w-1/3 text-right">₹{{ formatMoney(item.price * item.qty) }}</span>
            </div>
          </div>

          <!-- Totals Breakdown -->
          <div class="py-2 border-b border-dashed border-slate-400 space-y-1 text-right text-[10px]">
            <div class="flex justify-between">
              <span>Taxable Subtotal:</span>
              <span>₹{{ formatMoney(lastBill.taxable) }}</span>
            </div>
            <div class="flex justify-between">
              <span>CGST (6%):</span>
              <span>₹{{ formatMoney(lastBill.tax / 2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>SGST (6%):</span>
              <span>₹{{ formatMoney(lastBill.tax / 2) }}</span>
            </div>
            <div class="flex justify-between font-bold text-xs pt-1 border-t border-slate-300 text-slate-900">
              <span>GRAND TOTAL:</span>
              <span>₹{{ formatMoney(lastBill.total) }}</span>
            </div>
            <div class="flex justify-between text-slate-600 pt-0.5">
              <span>Paid ({{ lastBill.mode?.toUpperCase() }}):</span>
              <span>₹{{ formatMoney(lastBill.total) }}</span>
            </div>
          </div>

          <div class="text-center pt-3 text-[10px] space-y-0.5 text-slate-600">
            <div>Thank you for your visit!</div>
            <div class="font-tamil">மீண்டும் வருக</div>
          </div>
        </div>

        <!-- Receipt Actions -->
        <div class="p-3 bg-white border-t border-slate-200 flex items-center justify-between space-x-2">
          <button
            @click="shareOnWhatsApp"
            class="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center space-x-1 transition"
          >
            <Share2 class="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            @click="triggerPrint"
            class="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1 transition"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>Print (Enter)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 2: Customer Selector Modal (F4)      -->
    <!-- ========================================== -->
    <div
      v-if="showCustomerModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showCustomerModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center space-x-2">
            <User class="w-5 h-5 text-primary-600" />
            <h3 class="text-sm font-bold text-slate-900">Select Customer (F4)</h3>
          </div>
          <button @click="showCustomerModal = false" class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Customer List -->
        <div class="py-3 space-y-1.5 max-h-60 overflow-y-auto">
          <div
            v-for="c in customersList"
            :key="c.id"
            @click="selectCustomer(c)"
            class="p-2.5 rounded-xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50/60 cursor-pointer transition flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-xs text-slate-900">{{ c.name }}</div>
              <div class="text-[11px] text-slate-500">{{ c.phone }}</div>
            </div>
            <div class="text-right">
              <span
                :class="[
                  'text-xs font-bold font-tabular',
                  c.balance > 0 ? 'text-amber-600' : 'text-emerald-600'
                ]"
              >
                ₹{{ formatMoney(c.balance) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 3: Quick Add Item Modal (SCR-F5)     -->
    <!-- ========================================== -->
    <div
      v-if="showQuickAddModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showQuickAddModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
              <Plus class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Quick-Add Item (SCR-F5)</h3>
              <p class="text-[11px] text-slate-500">Insert new product directly into catalog</p>
            </div>
          </div>
          <button @click="showQuickAddModal = false" class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="saveQuickItem" class="py-4 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">Item Name *</label>
              <input
                v-model="newItem.name"
                required
                type="text"
                placeholder="e.g. Crocin Advance"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">Tamil Name (Vernacular)</label>
              <input
                v-model="newItem.name_ta"
                type="text"
                placeholder="e.g. குரோசின்"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
              <select
                v-model="newItem.category"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
              >
                <option value="Medicines">Medicines</option>
                <option value="General">General</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Baby Care">Baby Care</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">HSN Code</label>
              <input
                v-model="newItem.hsn"
                type="text"
                placeholder="3004"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium font-mono"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">GST Rate (%)</label>
              <select
                v-model.number="newItem.gst_rate"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
              >
                <option :value="0">0%</option>
                <option :value="5">5%</option>
                <option :value="12">12%</option>
                <option :value="18">18%</option>
                <option :value="28">28%</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                v-model.number="newItem.price"
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-bold font-tabular"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">Unit</label>
              <input
                v-model="newItem.unit"
                type="text"
                placeholder="Strip / Pcs"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">Initial Stock</label>
              <input
                v-model.number="newItem.stock"
                type="number"
                placeholder="50"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-bold font-tabular"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              @click="showQuickAddModal = false"
              class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Add to Catalog & Cart
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 4: Held Bills Drawer / Modal (SCR-E5)-->
    <!-- ========================================== -->
    <div
      v-if="showHeldBillsModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showHeldBillsModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center space-x-2">
            <Pause class="w-5 h-5 text-amber-600" />
            <h3 class="text-sm font-bold text-slate-900">Held Bills (SCR-E5)</h3>
          </div>
          <button @click="showHeldBillsModal = false" class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="py-3 space-y-2 max-h-72 overflow-y-auto">
          <div
            v-for="(held, idx) in heldBills"
            :key="idx"
            class="p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-xs text-slate-900">{{ held.customer }}</div>
              <div class="text-[10px] text-slate-500 font-tabular">{{ held.time }} • {{ held.items.length }} items</div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-slate-900 font-tabular">₹{{ formatMoney(held.total) }}</span>
              <button
                @click="resumeHeldBill(idx)"
                class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition"
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Barcode,
  Printer,
  Share2,
  Pause,
  Check,
  X,
  User,
  Package,
  QrCode,
  CreditCard,
  Banknote,
  Wallet
} from '@lucide/vue';

// Types
interface CatalogItem {
  code: string;
  name: string;
  name_ta?: string;
  category: string;
  hsn: string;
  gst_rate: number;
  price: number;
  unit: string;
  stock: number;
  barcode?: string;
}

interface CartItem extends CatalogItem {
  qty: number;
}

// State
const searchQuery = ref('');
const isBarcodeMode = ref(false);
const activeCategory = ref('All');
const viewMode = ref<'grid' | 'list'>('grid');
const searchInputRef = ref<HTMLInputElement | null>(null);

// Modals
const showReceiptModal = ref(false);
const showCustomerModal = ref(false);
const showQuickAddModal = ref(false);
const showHeldBillsModal = ref(false);

// Active Customer
const currentCustomer = ref({
  id: 'walk-in',
  name: 'Walk-in Customer',
  phone: '',
  balance: 0
});

const customersList = ref([
  { id: 'c1', name: 'Walk-in Customer', phone: 'Cash Sale', balance: 0 },
  { id: 'c2', name: 'Ramesh Kumar (Retail)', phone: '9842109876', balance: 0 },
  { id: 'c3', name: 'Priya Traders', phone: '9443211223', balance: 450.00 },
  { id: 'c4', name: 'Kumar Medicals', phone: '9789123456', balance: 1200.00 },
]);

// Categories
const categories = ref([
  { name: 'All', count: 8 },
  { name: 'Medicines', count: 3 },
  { name: 'General', count: 2 },
  { name: 'Personal Care', count: 1 },
  { name: 'Baby Care', count: 2 },
]);

// Catalog Items (Mock database)
const catalog = ref<CatalogItem[]>([
  {
    code: 'MED-001',
    name: 'Paracetamol 650mg',
    name_ta: 'பாரசிட்டமால் 650mg',
    category: 'Medicines',
    hsn: '300490',
    gst_rate: 12,
    price: 35.00,
    unit: 'Strip',
    stock: 45,
    barcode: '8901234001'
  },
  {
    code: 'MED-002',
    name: 'Amoxicillin 500mg',
    name_ta: 'அமாக்சிசிலின் 500mg',
    category: 'Medicines',
    hsn: '300410',
    gst_rate: 12,
    price: 72.50,
    unit: 'Strip',
    stock: 20,
    barcode: '8901234002'
  },
  {
    code: 'MED-003',
    name: 'Cetirizine 10mg',
    name_ta: 'செட்டிரிசின் 10mg',
    category: 'Medicines',
    hsn: '300490',
    gst_rate: 12,
    price: 18.00,
    unit: 'Strip',
    stock: 60,
    barcode: '8901234003'
  },
  {
    code: 'GEN-001',
    name: 'N95 Protective Mask',
    name_ta: 'N95 முகக்கவசம்',
    category: 'General',
    hsn: '630790',
    gst_rate: 5,
    price: 25.00,
    unit: 'Pcs',
    stock: 120,
    barcode: '8901234004'
  },
  {
    code: 'GEN-002',
    name: 'Cotton Roll 100g',
    name_ta: 'பஞ்சு 100g',
    category: 'General',
    hsn: '300590',
    gst_rate: 5,
    price: 40.00,
    unit: 'Roll',
    stock: 25,
    barcode: '8901234005'
  },
  {
    code: 'PER-001',
    name: 'Dettol Antiseptic 100ml',
    name_ta: 'டெட்டால் 100ml',
    category: 'Personal Care',
    hsn: '380894',
    gst_rate: 18,
    price: 65.00,
    unit: 'Bottle',
    stock: 15,
    barcode: '8901234006'
  },
  {
    code: 'BAB-001',
    name: 'Baby Gripe Water 130ml',
    name_ta: 'கிரைப் வாட்டர்',
    category: 'Baby Care',
    hsn: '300490',
    gst_rate: 12,
    price: 48.00,
    unit: 'Bottle',
    stock: 30,
    barcode: '8901234007'
  },
  {
    code: 'BAB-002',
    name: 'Digital Thermometer',
    name_ta: 'டிஜிட்டல் தெர்மாமீட்டர்',
    category: 'Baby Care',
    hsn: '902519',
    gst_rate: 18,
    price: 180.00,
    unit: 'Pcs',
    stock: 8,
    barcode: '8901234008'
  }
]);

// Cart
const cart = ref<CartItem[]>([]);

// Payment Settings
const paymentModes = [
  { id: 'cash', name: 'Cash', icon: Banknote },
  { id: 'upi', name: 'UPI / QR', icon: QrCode },
  { id: 'card', name: 'Card', icon: CreditCard },
  { id: 'credit', name: 'Khata', icon: Wallet },
];
const selectedPaymentMode = ref<'cash' | 'upi' | 'card' | 'credit'>('cash');
const cashReceived = ref<number>(0);

// Held Bills Queue (SCR-E5)
const heldBills = ref<any[]>([]);

// Last bill preview for Receipt Modal
const lastBill = ref<any>({});

// Quick Add Form
const newItem = ref({
  name: '',
  name_ta: '',
  category: 'Medicines',
  hsn: '3004',
  gst_rate: 12,
  price: 0,
  unit: 'Pcs',
  stock: 50
});

// Filtered Catalog Items
const filteredItems = computed(() => {
  return catalog.value.filter(item => {
    const matchesCat = activeCategory.value === 'All' || item.category === activeCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return matchesCat;

    const matchesQuery =
      item.name.toLowerCase().includes(q) ||
      (item.name_ta && item.name_ta.toLowerCase().includes(q)) ||
      item.hsn.toLowerCase().includes(q) ||
      (item.barcode && item.barcode.includes(q));

    return matchesCat && matchesQuery;
  });
});

// Cart Computations
const totalUnits = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.qty, 0);
});

const taxableSubtotal = computed(() => {
  return cart.value.reduce((sum, item) => {
    const itemTotal = item.price * item.qty;
    // Price is tax-inclusive in retail (DEC-10): base = total / (1 + rate/100)
    const base = itemTotal / (1 + item.gst_rate / 100);
    return sum + base;
  }, 0);
});

const totalTax = computed(() => {
  const gross = cart.value.reduce((sum, item) => sum + item.price * item.qty, 0);
  return gross - taxableSubtotal.value;
});

const rawGrandTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0);
});

const roundedGrandTotal = computed(() => {
  return Math.round(rawGrandTotal.value);
});

const roundingDiff = computed(() => {
  return roundedGrandTotal.value - rawGrandTotal.value;
});

// Cart Operations
function addToCart(item: CatalogItem) {
  const existing = cart.value.find(l => l.code === item.code);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.value.push({ ...item, qty: 1 });
  }

  // Pre-fill cash exact
  if (selectedPaymentMode.value === 'cash' && cashReceived.value <= rawGrandTotal.value) {
    cashReceived.value = roundedGrandTotal.value;
  }
}

function updateQty(line: CartItem, delta: number) {
  line.qty += delta;
  if (line.qty <= 0) {
    const idx = cart.value.findIndex(l => l.code === line.code);
    if (idx !== -1) cart.value.splice(idx, 1);
  }
  if (selectedPaymentMode.value === 'cash') {
    cashReceived.value = roundedGrandTotal.value;
  }
}

function removeFromCart(idx: number) {
  cart.value.splice(idx, 1);
}

function clearCart() {
  if (confirm('Are you sure you want to discard this bill?')) {
    cart.value = [];
    cashReceived.value = 0;
  }
}

// Search & Barcode scanning handler
function handleSearchEnter() {
  if (filteredItems.value.length === 1) {
    addToCart(filteredItems.value[0]);
    searchQuery.value = '';
  }
}

// Customer Operations
function selectCustomer(cust: any) {
  currentCustomer.value = cust;
  showCustomerModal.value = false;
}

// Quick Add Item
function saveQuickItem() {
  const code = 'ITEM-' + Date.now().toString().slice(-4);
  const created: CatalogItem = {
    code,
    name: newItem.value.name,
    name_ta: newItem.value.name_ta,
    category: newItem.value.category,
    hsn: newItem.value.hsn,
    gst_rate: newItem.value.gst_rate,
    price: newItem.value.price,
    unit: newItem.value.unit || 'Pcs',
    stock: newItem.value.stock || 50
  };

  catalog.value.unshift(created);
  addToCart(created);
  showQuickAddModal.value = false;

  // reset form
  newItem.value = {
    name: '',
    name_ta: '',
    category: 'Medicines',
    hsn: '3004',
    gst_rate: 12,
    price: 0,
    unit: 'Pcs',
    stock: 50
  };
}

// Hold / Recall Bills (SCR-E5)
function holdCurrentBill() {
  if (!cart.value.length) return;
  heldBills.value.push({
    customer: currentCustomer.value.name,
    items: [...cart.value],
    total: roundedGrandTotal.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  cart.value = [];
  cashReceived.value = 0;
}

function resumeHeldBill(idx: number) {
  const held = heldBills.value.splice(idx, 1)[0];
  cart.value = held.items;
  currentCustomer.value.name = held.customer;
  showHeldBillsModal.value = false;
}

// Complete Bill & Print (F8)
function completeAndPrintBill() {
  if (!cart.value.length) return;

  const billNo = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  lastBill.value = {
    number: billNo,
    date: new Date().toLocaleDateString('en-IN'),
    customer: currentCustomer.value.name,
    items: [...cart.value],
    taxable: taxableSubtotal.value,
    tax: totalTax.value,
    total: roundedGrandTotal.value,
    mode: selectedPaymentMode.value
  };

  showReceiptModal.value = true;
  cart.value = [];
  cashReceived.value = 0;
}

function triggerPrint() {
  window.print();
  showReceiptModal.value = false;
}

function shareOnWhatsApp() {
  const text = `Hello ${lastBill.value.customer}, your bill #${lastBill.value.number} for ₹${formatMoney(lastBill.value.total)} from EasyBill Store is ready. Thank you!`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Utility
function formatMoney(amount: number | undefined): string {
  if (amount === undefined || isNaN(amount)) return '0.00';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Global Keyboard Shortcuts (F2, F4, F8, F9, F3, Esc)
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'F2') {
    e.preventDefault();
    searchInputRef.value?.focus();
  } else if (e.key === 'F4') {
    e.preventDefault();
    showCustomerModal.value = true;
  } else if (e.key === 'F8') {
    e.preventDefault();
    completeAndPrintBill();
  } else if (e.key === 'F9') {
    e.preventDefault();
    holdCurrentBill();
  } else if (e.key === 'F3') {
    e.preventDefault();
    showQuickAddModal.value = true;
  } else if (e.key === 'Escape') {
    showReceiptModal.value = false;
    showCustomerModal.value = false;
    showQuickAddModal.value = false;
    showHeldBillsModal.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  searchInputRef.value?.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
