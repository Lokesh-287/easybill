<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top Enterprise Stock Header -->
    <div class="p-6 pb-2 shrink-0">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div class="flex items-center space-x-2.5">
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
              Stock & Inventory Control Center
            </h1>
            <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono text-[10px] font-bold">
              ERPNext Enterprise SCM
            </span>
          </div>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Multi-godown valuation, FEFO batches & expiry, serial/IMEI tracking, GRN inward, delivery challans & physical audit
          </p>
        </div>

        <!-- Global Action Buttons -->
        <div class="flex items-center space-x-2">
          <button
            @click="exportActiveRegisterCSV"
            class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-1.5 transition"
            title="Export CSV"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span class="hidden sm:inline">Export CSV</span>
          </button>

          <button
            @click="openTransferModal(null)"
            class="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 shadow-2xs flex items-center space-x-1.5 transition"
          >
            <ArrowLeftRight class="w-3.5 h-3.5 text-indigo-600" />
            <span>Godown Transfer (SCR-G3)</span>
          </button>

          <button
            @click="openQuickAdjustModal(null)"
            class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
          >
            <SlidersHorizontal class="w-3.5 h-3.5" />
            <span>Stock Reconciliation (SCR-G2)</span>
          </button>
        </div>
      </div>

      <!-- Enterprise Module Navigation Tabs Bar -->
      <div class="flex items-center space-x-1.5 overflow-x-auto scrollbar-none border-b border-slate-200/90 pb-2">
        <button
          v-for="tab in moduleTabs"
          :key="tab.id"
          :data-testid="'stock-module-' + tab.id"
          @click="currentModuleTab = tab.id"
          :class="[
            'px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer border select-none min-h-[36px]',
            currentModuleTab === tab.id
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
          ]"
        >
          <component :is="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge !== undefined"
            :class="[
              'text-[10px] px-1.5 py-0.2 rounded-full font-tabular font-bold',
              currentModuleTab === tab.id ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-600'
            ]"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>
    </div>

    <!-- Main Workspace Container -->
    <div class="flex-1 p-6 pt-2 flex flex-col min-h-0 overflow-hidden">
      
      <!-- ======================================================== -->
      <!-- TAB 1: STOCK SUMMARY & VALUATION (SCR-G1)                -->
      <!-- ======================================================== -->
      <div v-if="currentModuleTab === 'summary'" class="flex flex-col h-full overflow-hidden space-y-4">
        <!-- 4 Financial KPI Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <!-- Card 1: Total Valuation -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-500">Stock Valuation</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Boxes class="w-4 h-4" />
              </div>
            </div>
            <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
              ₹{{ formatMoney(kpiMetrics.totalValuation) }}
            </div>
            <div class="flex items-center space-x-1.5 mt-1.5 text-[11px]">
              <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
                FIFO Asset Value
              </span>
              <span class="text-slate-400">across warehouses</span>
            </div>
          </div>

          <!-- Card 2: Total Units On Hand -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-500">Units on Hand</span>
              <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Package class="w-4 h-4" />
              </div>
            </div>
            <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
              {{ formatQty(kpiMetrics.totalQty) }} Units
            </div>
            <div class="flex items-center space-x-1.5 mt-1.5 text-[11px]">
              <span class="font-bold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded-md font-tabular">
                {{ inventoryList.length }} catalog items
              </span>
              <span class="text-slate-400">tracked in Bin</span>
            </div>
          </div>

          <!-- Card 3: Low Stock Items -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-500">Low Stock Alert</span>
              <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle class="w-4 h-4" />
              </div>
            </div>
            <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-amber-600">
              {{ kpiMetrics.lowStockCount }} Items
            </div>
            <div class="flex items-center space-x-1.5 mt-1.5 text-[11px]">
              <span class="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md font-tabular">
                Below Reorder Level
              </span>
              <span class="text-slate-400">reorder needed</span>
            </div>
          </div>

          <!-- Card 4: Out of Stock Items -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-500">Out of Stock</span>
              <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle class="w-4 h-4" />
              </div>
            </div>
            <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-rose-600">
              {{ kpiMetrics.outOfStockCount }} Items
            </div>
            <div class="flex items-center space-x-1.5 mt-1.5 text-[11px]">
              <span class="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md font-tabular">
                Zero Available
              </span>
              <span class="text-slate-400">urgent replenishment</span>
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <!-- Segmented Status Tabs -->
            <div class="flex items-center p-1 bg-slate-100/80 rounded-xl space-x-1">
              <button
                v-for="tab in filterTabs"
                :key="tab.id"
                @click="activeStatusTab = tab.id"
                :class="[
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  activeStatusTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
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

            <!-- Filters & Search -->
            <div class="flex items-center space-x-2.5">
              <div class="relative w-64">
                <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search Item, Code, Category..."
                  class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 transition"
                />
              </div>

              <select
                v-model="selectedWarehouse"
                class="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Warehouses</option>
                <option value="Stores - EB">Stores - EB (Main Godown)</option>
                <option value="Shop Floor - EB">Shop Floor - EB (Front Counter)</option>
                <option value="Cold Storage - EB">Cold Storage - EB</option>
              </select>

              <select
                v-model="selectedCategory"
                class="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
          </div>

          <!-- Data Table -->
          <div class="flex-1 overflow-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">Item & SKU Code</th>
                  <th class="py-3 px-4">Warehouse Location</th>
                  <th class="py-3 px-4 text-right">Available Qty</th>
                  <th class="py-3 px-4 text-right">Valuation Rate</th>
                  <th class="py-3 px-4 text-right">Stock Value</th>
                  <th class="py-3 px-4 text-center">Reorder Threshold</th>
                  <th class="py-3 px-4 text-center">Stock Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr
                  v-for="item in filteredInventory"
                  :key="item.item_code"
                  class="hover:bg-slate-50/80 transition-colors group"
                >
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {{ item.item_name.substring(0, 2).toUpperCase() }}
                      </div>
                      <div>
                        <div class="font-bold text-slate-900 group-hover:text-primary-600 transition">
                          {{ item.item_name }}
                        </div>
                        <div class="text-[10px] text-slate-400 flex items-center space-x-1.5 font-mono">
                          <span>{{ item.item_code }}</span>
                          <span>·</span>
                          <span class="text-slate-500">{{ item.category }}</span>
                          <span v-if="item.name_ta" class="text-slate-400 font-normal font-tamil">({{ item.name_ta }})</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {{ item.warehouse }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <span :class="['font-mono font-bold text-xs', item.qty_on_hand > item.reorder_level ? 'text-slate-900' : 'text-amber-600']">
                      {{ item.qty_on_hand }} {{ item.unit }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right font-mono">₹{{ formatMoney(item.valuation_rate) }}</td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-emerald-700">₹{{ formatMoney(item.stock_value) }}</td>
                  <td class="py-3 px-4 text-center font-mono text-slate-500">{{ item.reorder_level }} {{ item.unit }}</td>
                  <td class="py-3 px-4 text-center">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    ]">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end space-x-1.5">
                      <button
                        @click="openLedgerHistory(item)"
                        class="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition"
                        title="Movement Ledger History"
                      >
                        <History class="w-3.5 h-3.5" />
                      </button>
                      <button
                        @click="openTransferModal(item)"
                        class="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition"
                        title="Inter-Godown Transfer"
                      >
                        <ArrowLeftRight class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 2: BATCH & EXPIRY MANAGEMENT (FEFO) (SCR-G4)         -->
      <!-- ======================================================== -->
      <div v-else-if="currentModuleTab === 'batches'" class="flex flex-col h-full overflow-hidden space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0">
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-500 font-semibold">Total Batches</div>
            <div class="text-xl font-extrabold text-slate-900 mt-1 font-mono">{{ batchList.length }}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Active inventory lots</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-emerald-600 font-semibold">Fresh Batches</div>
            <div class="text-xl font-extrabold text-emerald-700 mt-1 font-mono">{{ batchList.filter(b => b.status === 'Fresh').length }}</div>
            <div class="text-[10px] text-emerald-600 mt-0.5">&gt; 60 Days shelf life</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-amber-600 font-semibold">Critical (&lt; 30 Days)</div>
            <div class="text-xl font-extrabold text-amber-600 mt-1 font-mono">{{ batchList.filter(b => b.status === 'Critical (<30d)').length }}</div>
            <div class="text-[10px] text-amber-600 mt-0.5">FEFO priority clearance</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-rose-600 font-semibold">Expired Batches</div>
            <div class="text-xl font-extrabold text-rose-600 mt-1 font-mono">{{ batchList.filter(b => b.status === 'Expired').length }}</div>
            <div class="text-[10px] text-rose-600 mt-0.5">Quarantined / Returnable</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div class="flex items-center space-x-2">
              <div class="relative w-64">
                <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="batchSearch"
                  type="text"
                  placeholder="Search Batch No, Item SKU..."
                  class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <button
              @click="showNewBatchModal = true"
              class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Inward New Batch</span>
            </button>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th class="py-3 px-4">Batch No</th>
                  <th class="py-3 px-4">Product Name & SKU</th>
                  <th class="py-3 px-4">Warehouse Godown</th>
                  <th class="py-3 px-4 text-center font-mono">Mfg Date</th>
                  <th class="py-3 px-4 text-center font-mono">Expiry Date</th>
                  <th class="py-3 px-4 text-center font-mono">Days Left</th>
                  <th class="py-3 px-4 text-right font-mono">Available Qty</th>
                  <th class="py-3 px-4 text-right font-mono">MRP (₹)</th>
                  <th class="py-3 px-4 text-center">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="b in filteredBatches" :key="b.batch_no" class="hover:bg-slate-50/70">
                  <td class="py-3 px-4 font-mono font-bold text-slate-900">{{ b.batch_no }}</td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">{{ b.item_name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ b.item_code }}</div>
                  </td>
                  <td class="py-3 px-4 text-slate-600">{{ b.warehouse }}</td>
                  <td class="py-3 px-4 text-center font-mono text-slate-500">{{ b.mfg_date }}</td>
                  <td class="py-3 px-4 text-center font-mono font-bold" :class="b.days_left <= 0 ? 'text-rose-600' : 'text-slate-800'">
                    {{ b.expiry_date }}
                  </td>
                  <td class="py-3 px-4 text-center font-mono font-bold">
                    <span :class="b.days_left <= 0 ? 'text-rose-600' : b.days_left <= 30 ? 'text-amber-600' : 'text-emerald-600'">
                      {{ b.days_left <= 0 ? 'Expired' : `${b.days_left}d` }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-bold">{{ b.qty }} {{ b.unit }}</td>
                  <td class="py-3 px-4 text-right font-mono">₹{{ formatMoney(b.mrp) }}</td>
                  <td class="py-3 px-4 text-center">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      b.status === 'Fresh' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      b.status === 'Critical (<30d)' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    ]">
                      {{ b.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button
                      v-if="b.days_left <= 0"
                      @click="quarantineBatch(b)"
                      class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold border border-rose-200"
                    >
                      Quarantine
                    </button>
                    <span v-else class="text-[10px] text-emerald-600 font-semibold font-mono">FEFO Ready</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 3: SERIAL NUMBER & IMEI TRACKING (SCR-G5)            -->
      <!-- ======================================================== -->
      <div v-else-if="currentModuleTab === 'serials'" class="flex flex-col h-full overflow-hidden space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0">
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-500 font-semibold">Total Serials</div>
            <div class="text-xl font-extrabold text-slate-900 mt-1 font-mono">{{ serialList.length }}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Asset instances tracked</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-emerald-600 font-semibold">In Store</div>
            <div class="text-xl font-extrabold text-emerald-700 mt-1 font-mono">{{ serialList.filter(s => s.status === 'In Store').length }}</div>
            <div class="text-[10px] text-emerald-600 mt-0.5">Available for billing</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-indigo-600 font-semibold">Sold / Invoiced</div>
            <div class="text-xl font-extrabold text-indigo-700 mt-1 font-mono">{{ serialList.filter(s => s.status === 'Sold').length }}</div>
            <div class="text-[10px] text-indigo-600 mt-0.5">Active customer warranties</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-amber-600 font-semibold">Under RMA / Repair</div>
            <div class="text-xl font-extrabold text-amber-600 mt-1 font-mono">{{ serialList.filter(s => s.status === 'Under RMA').length }}</div>
            <div class="text-[10px] text-amber-600 mt-0.5">Manufacturer service</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div class="relative w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="serialSearch"
                type="text"
                placeholder="Search IMEI, Serial No, Product..."
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button
              @click="showNewSerialModal = true"
              class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Register Serial / IMEI</span>
            </button>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th class="py-3 px-4">Serial / IMEI No</th>
                  <th class="py-3 px-4">Product Name & Code</th>
                  <th class="py-3 px-4">Godown Location</th>
                  <th class="py-3 px-4 text-center font-mono">Inward Date</th>
                  <th class="py-3 px-4 text-center font-mono">Warranty Period</th>
                  <th class="py-3 px-4 text-center font-mono">Warranty Expiry</th>
                  <th class="py-3 px-4 text-center">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="s in filteredSerials" :key="s.serial_no" class="hover:bg-slate-50/70">
                  <td class="py-3 px-4 font-mono font-bold text-slate-900">{{ s.serial_no }}</td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">{{ s.item_name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ s.item_code }}</div>
                  </td>
                  <td class="py-3 px-4 text-slate-600">{{ s.warehouse }}</td>
                  <td class="py-3 px-4 text-center font-mono text-slate-500">{{ s.inward_date }}</td>
                  <td class="py-3 px-4 text-center font-mono font-bold text-slate-700">{{ s.warranty_months }} Months</td>
                  <td class="py-3 px-4 text-center font-mono font-bold text-slate-800">{{ s.warranty_expiry }}</td>
                  <td class="py-3 px-4 text-center">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      s.status === 'In Store' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      s.status === 'Sold' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    ]">
                      {{ s.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button
                      @click="toggleSerialStatus(s)"
                      class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 4: GOODS RECEIPT NOTE (GRN) (SCR-F4)                 -->
      <!-- ======================================================== -->
      <div v-else-if="currentModuleTab === 'grn'" class="flex flex-col h-full overflow-hidden space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0">
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-500 font-semibold">Total Inwards (GRN)</div>
            <div class="text-xl font-extrabold text-slate-900 mt-1 font-mono">{{ grnList.length }}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Gate entries verified</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-emerald-600 font-semibold">Accepted Units</div>
            <div class="text-xl font-extrabold text-emerald-700 mt-1 font-mono">
              {{ grnList.reduce((acc, g) => acc + g.accepted_qty, 0) }}
            </div>
            <div class="text-[10px] text-emerald-600 mt-0.5">Added to warehouse stock</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-rose-600 font-semibold">Damaged / Rejected</div>
            <div class="text-xl font-extrabold text-rose-600 mt-1 font-mono">
              {{ grnList.reduce((acc, g) => acc + g.rejected_qty, 0) }}
            </div>
            <div class="text-[10px] text-rose-600 mt-0.5">Returned to vendor</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-500 font-semibold">Total Inward Value</div>
            <div class="text-xl font-extrabold text-slate-900 mt-1 font-mono">
              ₹{{ formatMoney(grnList.reduce((acc, g) => acc + g.total_value, 0)) }}
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">Valuation added</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div class="relative w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="grnSearch"
                type="text"
                placeholder="Search GRN No, Supplier, PO..."
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button
              @click="showNewGrnModal = true"
              class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>New Goods Receipt Note (GRN)</span>
            </button>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th class="py-3 px-4">GRN Number</th>
                  <th class="py-3 px-4">Supplier & PO Ref</th>
                  <th class="py-3 px-4">Vehicle & Transporter</th>
                  <th class="py-3 px-4 text-center font-mono">Gate Date</th>
                  <th class="py-3 px-4 text-right font-mono">Received Qty</th>
                  <th class="py-3 px-4 text-right font-mono text-emerald-700">Accepted Qty</th>
                  <th class="py-3 px-4 text-right font-mono text-rose-700">Rejected Qty</th>
                  <th class="py-3 px-4 text-right font-mono">Total Value (₹)</th>
                  <th class="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="g in filteredGrns" :key="g.grn_no" class="hover:bg-slate-50/70">
                  <td class="py-3 px-4 font-mono font-bold text-slate-900">{{ g.grn_no }}</td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">{{ g.supplier_name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ g.po_no }}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-semibold text-slate-800">{{ g.vehicle_no }}</div>
                    <div class="text-[10px] text-slate-500">{{ g.transporter }}</div>
                  </td>
                  <td class="py-3 px-4 text-center font-mono text-slate-600">{{ g.date }}</td>
                  <td class="py-3 px-4 text-right font-mono">{{ g.received_qty }}</td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-emerald-700">{{ g.accepted_qty }}</td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-rose-600">{{ g.rejected_qty }}</td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">₹{{ formatMoney(g.total_value) }}</td>
                  <td class="py-3 px-4 text-center">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      g.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    ]">
                      {{ g.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 5: DELIVERY DISPATCH CHALLANS (SCR-E7)               -->
      <!-- ======================================================== -->
      <div v-else-if="currentModuleTab === 'challan'" class="flex flex-col h-full overflow-hidden space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0">
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-500 font-semibold">Total Challans</div>
            <div class="text-xl font-extrabold text-slate-900 mt-1 font-mono">{{ challanList.length }}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Outward dispatch memos</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-indigo-600 font-semibold">Dispatched / Transit</div>
            <div class="text-xl font-extrabold text-indigo-700 mt-1 font-mono">{{ challanList.filter(c => c.status !== 'Delivered').length }}</div>
            <div class="text-[10px] text-indigo-600 mt-0.5">On road to destination</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-emerald-600 font-semibold">Delivered (POD)</div>
            <div class="text-xl font-extrabold text-emerald-700 mt-1 font-mono">{{ challanList.filter(c => c.status === 'Delivered').length }}</div>
            <div class="text-[10px] text-emerald-600 mt-0.5">Customer acknowledged</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-xs text-slate-500 font-semibold">Total Units Dispatched</div>
            <div class="text-xl font-extrabold text-slate-900 mt-1 font-mono">
              {{ challanList.reduce((acc, c) => acc + c.total_qty, 0) }}
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">Inventory moved outward</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div class="relative w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="challanSearch"
                type="text"
                placeholder="Search Challan No, Customer..."
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button
              @click="showNewChallanModal = true"
              class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Create Delivery Challan</span>
            </button>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th class="py-3 px-4">Challan Number</th>
                  <th class="py-3 px-4">Customer & Invoice Ref</th>
                  <th class="py-3 px-4">Dispatch Godown</th>
                  <th class="py-3 px-4">Vehicle & Transporter</th>
                  <th class="py-3 px-4 text-center font-mono">Date</th>
                  <th class="py-3 px-4 text-right font-mono">Total Qty</th>
                  <th class="py-3 px-4 text-center">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="c in filteredChallans" :key="c.challan_no" class="hover:bg-slate-50/70">
                  <td class="py-3 px-4 font-mono font-bold text-slate-900">{{ c.challan_no }}</td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">{{ c.customer_name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ c.invoice_ref }}</div>
                  </td>
                  <td class="py-3 px-4 text-slate-600">{{ c.source_warehouse }}</td>
                  <td class="py-3 px-4">
                    <div class="font-semibold text-slate-800">{{ c.vehicle_no }}</div>
                    <div class="text-[10px] text-slate-500">{{ c.transporter }}</div>
                  </td>
                  <td class="py-3 px-4 text-center font-mono text-slate-600">{{ c.date }}</td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">{{ c.total_qty }} Units</td>
                  <td class="py-3 px-4 text-center">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      c.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-indigo-50 text-indigo-700 border-indigo-200'
                    ]">
                      {{ c.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end space-x-1.5">
                      <button
                        @click="printDeliveryChallan(c)"
                        class="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                        title="Print Challan Slip (Frappe Format)"
                      >
                        <Printer class="w-3.5 h-3.5" />
                      </button>
                      <button
                        v-if="c.status !== 'Delivered'"
                        @click="markChallanDelivered(c)"
                        class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200"
                      >
                        Confirm POD
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 6: PHYSICAL STOCK RECONCILIATION AUDIT SHEET (SCR-G2)-->
      <!-- ======================================================== -->
      <div v-else-if="currentModuleTab === 'audit'" class="flex flex-col h-full overflow-hidden space-y-4">
        <!-- Audit Summary Banner -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              <ClipboardCheck class="w-5 h-5" />
            </div>
            <div>
              <div class="text-sm font-extrabold text-slate-900">Physical Stock Count Verification Audit</div>
              <div class="text-xs text-slate-500">
                Audit Godown: <strong class="text-slate-800">{{ auditWarehouse }}</strong> • Discrepancy Items: <strong class="text-amber-600 font-mono">{{ auditDiscrepancyCount }}</strong>
              </div>
            </div>
          </div>

          <!-- Godown Selector & Save Button -->
          <div class="flex items-center space-x-2.5">
            <select
              v-model="auditWarehouse"
              class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
            >
              <option value="Shop Floor - EB">Shop Floor - EB (Front Counter)</option>
              <option value="Stores - EB">Stores - EB (Main Godown)</option>
              <option value="Cold Storage - EB">Cold Storage - EB</option>
            </select>

            <button
              @click="submitFullAuditReconciliation"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
            >
              <Check class="w-4 h-4" />
              <span>Submit & Apply Reconciliation</span>
            </button>
          </div>
        </div>

        <!-- Audit Table -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="flex-1 overflow-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th class="py-3 px-4 w-12 text-center">#</th>
                  <th class="py-3 px-4">Item & SKU Code</th>
                  <th class="py-3 px-4">Category</th>
                  <th class="py-3 px-4 text-right font-mono">Valuation Rate</th>
                  <th class="py-3 px-4 text-center font-mono">Book Stock Qty</th>
                  <th class="py-3 px-4 text-center font-mono w-40">Physical Counted Qty</th>
                  <th class="py-3 px-4 text-center font-mono">Variance (+/-)</th>
                  <th class="py-3 px-4 text-right font-mono">Value Impact (₹)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(item, idx) in auditItems" :key="item.item_code" class="hover:bg-slate-50/70">
                  <td class="py-3 px-4 text-center font-mono text-slate-400">{{ idx + 1 }}</td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">{{ item.item_name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ item.item_code }}</div>
                  </td>
                  <td class="py-3 px-4 text-slate-600">{{ item.category }}</td>
                  <td class="py-3 px-4 text-right font-mono text-slate-600">₹{{ formatMoney(item.valuation_rate) }}</td>
                  <td class="py-3 px-4 text-center font-mono font-bold text-slate-800">{{ item.qty_on_hand }} {{ item.unit }}</td>
                  <td class="py-3 px-4 text-center">
                    <input
                      v-model.number="item.physical_qty"
                      type="number"
                      step="any"
                      min="0"
                      class="w-28 px-2 py-1 text-center font-mono font-bold text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </td>
                  <td class="py-3 px-4 text-center font-mono font-bold">
                    <span :class="[
                      (item.physical_qty - item.qty_on_hand) > 0 ? 'text-emerald-600' :
                      (item.physical_qty - item.qty_on_hand) < 0 ? 'text-rose-600' : 'text-slate-400'
                    ]">
                      {{ (item.physical_qty - item.qty_on_hand) > 0 ? `+${item.physical_qty - item.qty_on_hand}` : (item.physical_qty - item.qty_on_hand) }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-bold">
                    <span :class="[
                      (item.physical_qty - item.qty_on_hand) * item.valuation_rate > 0 ? 'text-emerald-600' :
                      (item.physical_qty - item.qty_on_hand) * item.valuation_rate < 0 ? 'text-rose-600' : 'text-slate-400'
                    ]">
                      ₹{{ formatMoney((item.physical_qty - item.qty_on_hand) * item.valuation_rate) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 1: Quick Adjust Modal (SCR-G2)           -->
    <!-- ============================================== -->
    <div
      v-if="showAdjustModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showAdjustModal = false"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-primary-50/50">
          <div class="flex items-center space-x-2">
            <SlidersHorizontal class="w-4 h-4 text-primary-700" />
            <div class="text-xs font-bold text-slate-900">Stock Reconciliation (SCR-G2)</div>
          </div>
          <button @click="showAdjustModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Select Item *</label>
            <select
              v-model="adjustForm.item_code"
              @change="onAdjustItemCodeChange"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="" disabled>Choose Item</option>
              <option v-for="itm in inventoryList" :key="itm.item_code" :value="itm.item_code">
                {{ itm.item_name }} ({{ itm.item_code }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Current Book Qty</label>
              <div class="w-full px-3 py-2 font-bold font-mono bg-slate-100 rounded-xl text-slate-700">
                {{ adjustTargetItem ? adjustTargetItem.qty_on_hand : 0 }}
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Physical Counted Qty *</label>
              <input
                v-model.number="adjustForm.actual_qty"
                type="number"
                step="any"
                class="w-full px-3 py-2 font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Reason for Adjustment</label>
            <select
              v-model="adjustForm.reason"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="Physical Count Discrepancy">Physical Count Discrepancy</option>
              <option value="Damaged / Broken in Transit">Damaged / Broken in Transit</option>
              <option value="Expired Stock Removal">Expired Stock Removal</option>
              <option value="Free Sample / Promotion">Free Sample / Promotion</option>
            </select>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button @click="showAdjustModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">Cancel</button>
          <button @click="submitStockAdjustment" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs">
            Confirm Adjustment
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 2: Inter-Godown Stock Transfer (SCR-G3)  -->
    <!-- ============================================== -->
    <div
      v-if="showTransferModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showTransferModal = false"
    >
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/60">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ArrowLeftRight class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">Inter-Godown Stock Transfer (SCR-G3)</div>
              <div class="text-[10px] text-slate-500">Move inventory between godown and retail racks</div>
            </div>
          </div>
          <button @click="showTransferModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Source Godown (From) *</label>
              <select v-model="transferForm.from_warehouse" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Stores - EB">Stores - EB (Main Godown)</option>
                <option value="Shop Floor - EB">Shop Floor - EB (Front Counter)</option>
                <option value="Cold Storage - EB">Cold Storage - EB</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Target Godown (To) *</label>
              <select v-model="transferForm.to_warehouse" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Shop Floor - EB">Shop Floor - EB (Front Counter)</option>
                <option value="Stores - EB">Stores - EB (Main Godown)</option>
                <option value="Cold Storage - EB">Cold Storage - EB</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Select Item to Transfer *</label>
            <select v-model="transferForm.item_code" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="" disabled>Choose Item</option>
              <option v-for="itm in inventoryList" :key="itm.item_code" :value="itm.item_code">
                {{ itm.item_name }} (Available: {{ itm.qty_on_hand }} {{ itm.unit }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Transfer Qty *</label>
              <input v-model.number="transferForm.qty" type="number" step="1" min="1" class="w-full px-3 py-2 font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Available in Source</label>
              <div class="w-full px-3 py-2 font-mono font-bold rounded-xl border bg-slate-100 border-slate-200 text-slate-700">
                {{ selectedTransferItem ? selectedTransferItem.qty_on_hand : 0 }} {{ selectedTransferItem ? selectedTransferItem.unit : 'Units' }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button @click="showTransferModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">Cancel</button>
          <button @click="submitStockTransfer" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs">
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 3: Inward New Batch (SCR-G4)             -->
    <!-- ============================================== -->
    <div
      v-if="showNewBatchModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showNewBatchModal = false"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-primary-50/50">
          <div class="flex items-center space-x-2">
            <CalendarClock class="w-4 h-4 text-primary-700" />
            <div class="text-xs font-bold text-slate-900">Inward / Create New Batch (FEFO)</div>
          </div>
          <button @click="showNewBatchModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Batch Number *</label>
            <input v-model="newBatchForm.batch_no" type="text" placeholder="e.g. BAT-2026-X09" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase" />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Select Item *</label>
            <select v-model="newBatchForm.item_code" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <option v-for="i in inventoryList" :key="i.item_code" :value="i.item_code">{{ i.item_name }} ({{ i.item_code }})</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Mfg Date *</label>
              <input v-model="newBatchForm.mfg_date" type="date" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Expiry Date *</label>
              <input v-model="newBatchForm.expiry_date" type="date" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Batch Qty *</label>
              <input v-model.number="newBatchForm.qty" type="number" min="1" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Selling MRP (₹) *</label>
              <input v-model.number="newBatchForm.mrp" type="number" step="0.5" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold" />
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button @click="showNewBatchModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">Cancel</button>
          <button @click="submitNewBatch" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs">
            Save & Inward Batch
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 4: Register Serial / IMEI (SCR-G5)       -->
    <!-- ============================================== -->
    <div
      v-if="showNewSerialModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showNewSerialModal = false"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-primary-50/50">
          <div class="flex items-center space-x-2">
            <Cpu class="w-4 h-4 text-primary-700" />
            <div class="text-xs font-bold text-slate-900">Register Serial Numbers / IMEI</div>
          </div>
          <button @click="showNewSerialModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Select Product *</label>
            <select v-model="newSerialForm.item_code" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <option v-for="i in inventoryList" :key="i.item_code" :value="i.item_code">{{ i.item_name }} ({{ i.item_code }})</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Serial / IMEI Numbers (One per line) *</label>
            <textarea
              v-model="newSerialForm.serial_numbers_raw"
              rows="3"
              placeholder="e.g.&#10;IMEI-984019284729103&#10;IMEI-984019284729104"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Warranty (Months)</label>
              <input v-model.number="newSerialForm.warranty_months" type="number" min="0" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Target Warehouse</label>
              <select v-model="newSerialForm.warehouse" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Stores - EB">Stores - EB (Main Godown)</option>
                <option value="Shop Floor - EB">Shop Floor - EB</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button @click="showNewSerialModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">Cancel</button>
          <button @click="submitNewSerials" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs">
            Register Serials
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 5: Create Goods Receipt Note (SCR-F4)    -->
    <!-- ============================================== -->
    <div
      v-if="showNewGrnModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showNewGrnModal = false"
    >
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-primary-50/50">
          <div class="flex items-center space-x-2">
            <Truck class="w-4 h-4 text-primary-700" />
            <div class="text-xs font-bold text-slate-900">Goods Receipt Note (GRN) Inward Gate Entry</div>
          </div>
          <button @click="showNewGrnModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-3.5 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Supplier Name *</label>
              <input v-model="newGrnForm.supplier_name" type="text" placeholder="e.g. Cipla Healthcare Ltd" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Purchase Order (PO) Ref</label>
              <input v-model="newGrnForm.po_no" type="text" placeholder="e.g. PO-2026-089" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Vehicle / LR No</label>
              <input v-model="newGrnForm.vehicle_no" type="text" placeholder="e.g. TN 37 CZ 8921" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Transporter Name</label>
              <input v-model="newGrnForm.transporter" type="text" placeholder="e.g. VRL Logistics" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Item Received *</label>
            <select v-model="newGrnForm.item_code" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <option v-for="i in inventoryList" :key="i.item_code" :value="i.item_code">{{ i.item_name }} ({{ i.item_code }})</option>
            </select>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Received Qty *</label>
              <input v-model.number="newGrnForm.received_qty" type="number" min="1" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-emerald-700 mb-1">Accepted Qty *</label>
              <input v-model.number="newGrnForm.accepted_qty" type="number" min="0" class="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-xl font-mono font-bold text-emerald-800" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-rose-700 mb-1">Rejected Qty</label>
              <input v-model.number="newGrnForm.rejected_qty" type="number" min="0" class="w-full px-3 py-2 bg-rose-50 border border-rose-300 rounded-xl font-mono font-bold text-rose-800" />
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button @click="showNewGrnModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">Cancel</button>
          <button @click="submitNewGrn" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs">
            Approve & Inward Stock
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 6: Create Delivery Challan (SCR-E7)      -->
    <!-- ============================================== -->
    <div
      v-if="showNewChallanModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showNewChallanModal = false"
    >
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/60">
          <div class="flex items-center space-x-2">
            <SendHorizontal class="w-4 h-4 text-indigo-700" />
            <div class="text-xs font-bold text-slate-900">Create Outward Delivery Challan (SCR-E7)</div>
          </div>
          <button @click="showNewChallanModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-3.5 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Customer / Recipient *</label>
              <input v-model="newChallanForm.customer_name" type="text" placeholder="e.g. Murugan Medicals" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Sales Invoice / Order Ref</label>
              <input v-model="newChallanForm.invoice_ref" type="text" placeholder="e.g. INV-2026-0042" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Dispatch Vehicle No</label>
              <input v-model="newChallanForm.vehicle_no" type="text" placeholder="e.g. TN 38 BX 4412" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Transporter / Driver</label>
              <input v-model="newChallanForm.transporter" type="text" placeholder="e.g. Direct Van Delivery" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Dispatch Item *</label>
            <select v-model="newChallanForm.item_code" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <option v-for="i in inventoryList" :key="i.item_code" :value="i.item_code">{{ i.item_name }} (Available: {{ i.qty_on_hand }})</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Dispatch Quantity *</label>
              <input v-model.number="newChallanForm.qty" type="number" min="1" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Source Godown</label>
              <select v-model="newChallanForm.source_warehouse" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Stores - EB">Stores - EB (Main Godown)</option>
                <option value="Shop Floor - EB">Shop Floor - EB</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button @click="showNewChallanModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">Cancel</button>
          <button @click="submitNewChallan" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs">
            Issue & Dispatch Challan
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- SLIDE-OVER DRAWER: Stock Ledger History        -->
    <!-- ============================================== -->
    <div
      v-if="showLedgerDrawer && ledgerTargetItem"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
      @click.self="showLedgerDrawer = false"
    >
      <div class="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              <History class="w-5 h-5" />
            </div>
            <div>
              <div class="text-sm font-extrabold text-slate-900">{{ ledgerTargetItem.item_name }}</div>
              <div class="text-xs text-slate-400 mt-0.5">
                Stock Movement Ledger · Code: <span class="font-mono text-slate-700 font-bold">{{ ledgerTargetItem.item_code }}</span>
              </div>
            </div>
          </div>
          <button @click="showLedgerDrawer = false" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <div class="text-[10px] text-slate-400">Current Qty</div>
              <div class="text-sm font-extrabold text-slate-900 font-tabular">{{ ledgerTargetItem.qty_on_hand }} {{ ledgerTargetItem.unit }}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">Valuation Rate</div>
              <div class="text-sm font-extrabold text-slate-900 font-tabular">₹{{ formatMoney(ledgerTargetItem.valuation_rate) }}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">Total Stock Value</div>
              <div class="text-sm font-extrabold text-emerald-700 font-tabular">₹{{ formatMoney(ledgerTargetItem.stock_value) }}</div>
            </div>
          </div>

          <div>
            <div class="text-xs font-bold text-slate-700 mb-2">Transaction History (Chronological)</div>
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <tr>
                    <th class="py-2.5 px-3">Date & Voucher</th>
                    <th class="py-2.5 px-3 text-right">Inward</th>
                    <th class="py-2.5 px-3 text-right">Outward</th>
                    <th class="py-2.5 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr v-for="entry in ledgerEntries" :key="entry.id" class="hover:bg-slate-50/50">
                    <td class="py-2.5 px-3">
                      <div class="font-bold text-slate-900">{{ entry.voucher_type }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ entry.voucher_no }} · {{ entry.date }}</div>
                      <div class="text-[10px] text-slate-500 mt-0.5">{{ entry.remarks }}</div>
                    </td>
                    <td class="py-2.5 px-3 text-right font-tabular text-emerald-700 font-bold">
                      {{ entry.inward_qty > 0 ? `+${entry.inward_qty}` : '—' }}
                    </td>
                    <td class="py-2.5 px-3 text-right font-tabular text-rose-700 font-bold">
                      {{ entry.outward_qty > 0 ? `-${entry.outward_qty}` : '—' }}
                    </td>
                    <td class="py-2.5 px-3 text-right font-tabular font-extrabold text-slate-900">
                      {{ entry.balance_qty }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button @click="showLedgerDrawer = false" class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">Close</button>
        </div>
      </div>
    </div>

    <!-- Frappe Print Format Modal for Printable Delivery Challan -->
    <FrappePrintFormatModal
      v-model="showPrintModal"
      :invoice="printTargetChallan"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '../../services/toast';
import FrappePrintFormatModal from '../../components/FrappePrintFormatModal.vue';
import {
  Boxes,
  Package,
  AlertCircle,
  AlertTriangle,
  Search,
  Download,
  SlidersHorizontal,
  ArrowLeftRight,
  History,
  CheckCircle2,
  CalendarClock,
  Cpu,
  Truck,
  SendHorizontal,
  ClipboardCheck,
  Plus,
  Printer,
  Check
} from '@lucide/vue';

const toast = useToast();

// Sub-module navigation tabs
const currentModuleTab = ref<'summary' | 'batches' | 'serials' | 'grn' | 'challan' | 'audit'>('summary');

// Interfaces
interface StockItem {
  item_code: string;
  item_name: string;
  name_ta?: string;
  category: string;
  warehouse: string;
  qty_on_hand: number;
  valuation_rate: number;
  stock_value: number;
  reorder_level: number;
  reorder_qty: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  batch_count: number;
  last_updated: string;
}

interface BatchItem {
  batch_no: string;
  item_code: string;
  item_name: string;
  category: string;
  warehouse: string;
  mfg_date: string;
  expiry_date: string;
  days_left: number;
  qty: number;
  unit: string;
  mrp: number;
  status: 'Fresh' | 'Critical (<30d)' | 'Expired' | 'Quarantined';
}

interface SerialItem {
  serial_no: string;
  item_code: string;
  item_name: string;
  warehouse: string;
  inward_date: string;
  warranty_months: number;
  warranty_expiry: string;
  status: 'In Store' | 'Sold' | 'Under RMA';
}

interface GoodsReceiptNote {
  grn_no: string;
  supplier_name: string;
  po_no: string;
  vehicle_no: string;
  transporter: string;
  date: string;
  received_qty: number;
  accepted_qty: number;
  rejected_qty: number;
  total_value: number;
  status: 'Accepted' | 'Partial Rejection';
}

interface DeliveryChallan {
  challan_no: string;
  customer_name: string;
  customer_phone?: string;
  invoice_ref: string;
  source_warehouse: string;
  vehicle_no: string;
  transporter: string;
  date: string;
  total_qty: number;
  status: 'Dispatched' | 'In Transit' | 'Delivered';
  items?: any[];
}

interface LedgerEntry {
  id: string;
  item_code: string;
  item_name: string;
  date: string;
  voucher_type: string;
  voucher_no: string;
  warehouse: string;
  inward_qty: number;
  outward_qty: number;
  balance_qty: number;
  valuation_rate: number;
  remarks: string;
}

// -------------------------------------------------------------
// INVENTORY MOCK DATA & STATE
// -------------------------------------------------------------
const inventoryList = ref<StockItem[]>([
  {
    item_code: 'MED-001',
    item_name: 'Paracetamol 650mg',
    name_ta: 'பாரசிட்டமால் 650mg',
    category: 'Medicines',
    warehouse: 'Shop Floor - EB',
    qty_on_hand: 45,
    valuation_rate: 22.00,
    stock_value: 990.00,
    reorder_level: 20,
    reorder_qty: 100,
    unit: 'Strip',
    status: 'In Stock',
    batch_count: 2,
    last_updated: '16-11-2026 14:30'
  },
  {
    item_code: 'MED-003',
    item_name: 'Amoxicillin 500mg',
    name_ta: 'அமாக்சிசிலின் 500mg',
    category: 'Medicines',
    warehouse: 'Stores - EB',
    qty_on_hand: 20,
    valuation_rate: 45.00,
    stock_value: 900.00,
    reorder_level: 15,
    reorder_qty: 50,
    unit: 'Strip',
    status: 'In Stock',
    batch_count: 1,
    last_updated: '16-11-2026 11:15'
  },
  {
    item_code: 'MED-004',
    item_name: 'Cetirizine 10mg',
    name_ta: 'செட்டிரிசின் 10mg',
    category: 'Medicines',
    warehouse: 'Shop Floor - EB',
    qty_on_hand: 12,
    valuation_rate: 8.50,
    stock_value: 102.00,
    reorder_level: 25,
    reorder_qty: 80,
    unit: 'Strip',
    status: 'Low Stock',
    batch_count: 1,
    last_updated: '15-11-2026 18:00'
  },
  {
    item_code: 'BAB-001',
    item_name: 'Baby Gripe Water 130ml',
    name_ta: 'கிரைப் வாட்டர்',
    category: 'Baby Care',
    warehouse: 'Stores - EB',
    qty_on_hand: 30,
    valuation_rate: 32.00,
    stock_value: 960.00,
    reorder_level: 10,
    reorder_qty: 30,
    unit: 'Bottle',
    status: 'In Stock',
    batch_count: 2,
    last_updated: '16-11-2026 09:40'
  },
  {
    item_code: 'BAB-002',
    item_name: 'Digital Thermometer',
    name_ta: 'டிஜிட்டல் தெர்மாமீட்டர்',
    category: 'Baby Care',
    warehouse: 'Shop Floor - EB',
    qty_on_hand: 8,
    valuation_rate: 110.00,
    stock_value: 880.00,
    reorder_level: 10,
    reorder_qty: 20,
    unit: 'Pcs',
    status: 'Low Stock',
    batch_count: 1,
    last_updated: '14-11-2026 16:20'
  },
  {
    item_code: 'GEN-001',
    item_name: 'N95 Protective Mask',
    name_ta: 'N95 முகக்கவசம்',
    category: 'General',
    warehouse: 'Stores - EB',
    qty_on_hand: 120,
    valuation_rate: 12.00,
    stock_value: 1440.00,
    reorder_level: 50,
    reorder_qty: 200,
    unit: 'Pcs',
    status: 'In Stock',
    batch_count: 1,
    last_updated: '16-11-2026 12:00'
  },
  {
    item_code: 'GEN-002',
    item_name: 'Cotton Roll 100g',
    name_ta: 'பஞ்சு 100g',
    category: 'General',
    warehouse: 'Shop Floor - EB',
    qty_on_hand: 0,
    valuation_rate: 26.00,
    stock_value: 0.00,
    reorder_level: 15,
    reorder_qty: 50,
    unit: 'Roll',
    status: 'Out of Stock',
    batch_count: 0,
    last_updated: '15-11-2026 20:10'
  }
]);

// -------------------------------------------------------------
// BATCH REGISTER MOCK DATA (SCR-G4)
// -------------------------------------------------------------
const batchList = ref<BatchItem[]>([
  {
    batch_no: 'BAT-2026-P01',
    item_code: 'MED-001',
    item_name: 'Paracetamol 650mg',
    category: 'Medicines',
    warehouse: 'Shop Floor - EB',
    mfg_date: '2026-01-10',
    expiry_date: '2027-01-10',
    days_left: 420,
    qty: 45,
    unit: 'Strip',
    mrp: 35.00,
    status: 'Fresh'
  },
  {
    batch_no: 'BAT-2026-A02',
    item_code: 'MED-003',
    item_name: 'Amoxicillin 500mg',
    category: 'Medicines',
    warehouse: 'Stores - EB',
    mfg_date: '2025-12-05',
    expiry_date: '2026-12-05',
    days_left: 19,
    qty: 20,
    unit: 'Strip',
    mrp: 72.50,
    status: 'Critical (<30d)'
  },
  {
    batch_no: 'BAT-2026-C03',
    item_code: 'MED-004',
    item_name: 'Cetirizine 10mg',
    category: 'Medicines',
    warehouse: 'Shop Floor - EB',
    mfg_date: '2025-06-01',
    expiry_date: '2026-11-25',
    days_left: 8,
    qty: 12,
    unit: 'Strip',
    mrp: 18.00,
    status: 'Critical (<30d)'
  },
  {
    batch_no: 'BAT-2025-X04',
    item_code: 'BAB-001',
    item_name: 'Baby Gripe Water 130ml',
    category: 'Baby Care',
    warehouse: 'Stores - EB',
    mfg_date: '2024-11-01',
    expiry_date: '2025-11-01',
    days_left: -15,
    qty: 5,
    unit: 'Bottle',
    mrp: 48.00,
    status: 'Expired'
  }
]);

// -------------------------------------------------------------
// SERIAL NUMBER / IMEI REGISTER (SCR-G5)
// -------------------------------------------------------------
const serialList = ref<SerialItem[]>([
  {
    serial_no: 'IMEI-984019284729101',
    item_code: 'BAB-002',
    item_name: 'Digital Thermometer',
    warehouse: 'Shop Floor - EB',
    inward_date: '2026-10-15',
    warranty_months: 12,
    warranty_expiry: '2027-10-15',
    status: 'In Store'
  },
  {
    serial_no: 'IMEI-984019284729102',
    item_code: 'BAB-002',
    item_name: 'Digital Thermometer',
    warehouse: 'Shop Floor - EB',
    inward_date: '2026-10-15',
    warranty_months: 12,
    warranty_expiry: '2027-10-15',
    status: 'Sold'
  },
  {
    serial_no: 'SN-OXY-2026-0041',
    item_code: 'GEN-001',
    item_name: 'N95 Protective Mask (Pack of 50)',
    warehouse: 'Stores - EB',
    inward_date: '2026-11-01',
    warranty_months: 6,
    warranty_expiry: '2027-05-01',
    status: 'In Store'
  },
  {
    serial_no: 'SN-NEB-2026-0082',
    item_code: 'BAB-002',
    item_name: 'Digital Thermometer Pro',
    warehouse: 'Stores - EB',
    inward_date: '2026-09-10',
    warranty_months: 24,
    warranty_expiry: '2028-09-10',
    status: 'Under RMA'
  }
]);

// -------------------------------------------------------------
// GOODS RECEIPT NOTES (GRN) (SCR-F4)
// -------------------------------------------------------------
const grnList = ref<GoodsReceiptNote[]>([
  {
    grn_no: 'GRN-2026-0038',
    supplier_name: 'Cipla Healthcare Ltd',
    po_no: 'PO-2026-081',
    vehicle_no: 'TN 37 CZ 8921',
    transporter: 'VRL Logistics',
    date: '16-11-2026',
    received_qty: 65,
    accepted_qty: 65,
    rejected_qty: 0,
    total_value: 1890.00,
    status: 'Accepted'
  },
  {
    grn_no: 'GRN-2026-0039',
    supplier_name: 'Apollo Surgicals Ltd',
    po_no: 'PO-2026-084',
    vehicle_no: 'TN 38 CJ 4410',
    transporter: 'TCI Freight',
    date: '15-11-2026',
    received_qty: 100,
    accepted_qty: 95,
    rejected_qty: 5,
    total_value: 1140.00,
    status: 'Partial Rejection'
  }
]);

// -------------------------------------------------------------
// DELIVERY CHALLANS (SCR-E7)
// -------------------------------------------------------------
const challanList = ref<DeliveryChallan[]>([
  {
    challan_no: 'DC-2026-0019',
    customer_name: 'Murugan Traders',
    invoice_ref: 'INV-2026-0041',
    source_warehouse: 'Stores - EB',
    vehicle_no: 'TN 38 AF 9012',
    transporter: 'Direct Van Delivery',
    date: '16-11-2026',
    total_qty: 45,
    status: 'Dispatched',
    items: [{ code: 'MED-001', name: 'Paracetamol 650mg', qty: 45, unit: 'Strip', price: 35.00 }]
  },
  {
    challan_no: 'DC-2026-0020',
    customer_name: 'Annapoorna Retail',
    invoice_ref: 'INV-2026-0035',
    source_warehouse: 'Shop Floor - EB',
    vehicle_no: 'TN 37 B 5519',
    transporter: 'Store Bike Courier',
    date: '15-11-2026',
    total_qty: 12,
    status: 'Delivered',
    items: [{ code: 'BAB-001', name: 'Baby Gripe Water 130ml', qty: 12, unit: 'Bottle', price: 48.00 }]
  }
]);

// -------------------------------------------------------------
// PHYSICAL AUDIT SHEET (SCR-G2)
// -------------------------------------------------------------
const auditWarehouse = ref('Shop Floor - EB');
const auditItems = ref<any[]>([]);

function initAuditSheet() {
  auditItems.value = inventoryList.value
    .filter(i => i.warehouse === auditWarehouse.value || auditWarehouse.value === 'All')
    .map(i => ({
      ...i,
      physical_qty: i.qty_on_hand // initially matches book count
    }));
}

const auditDiscrepancyCount = computed(() => {
  return auditItems.value.filter(i => (i.physical_qty - i.qty_on_hand) !== 0).length;
});

// Navigation Module Tabs definition
const moduleTabs = computed(() => [
  { id: 'summary', label: 'Stock Summary & Valuation', icon: Boxes, badge: inventoryList.value.length },
  { id: 'batches', label: 'Batch & Expiry (FEFO)', icon: CalendarClock, badge: batchList.value.filter(b => b.status !== 'Fresh').length },
  { id: 'serials', label: 'Serial & IMEI Tracker', icon: Cpu, badge: serialList.value.length },
  { id: 'grn', label: 'Goods Receipt Note (GRN)', icon: Truck, badge: grnList.value.length },
  { id: 'challan', label: 'Delivery Challans', icon: SendHorizontal, badge: challanList.value.filter(c => c.status !== 'Delivered').length },
  { id: 'audit', label: 'Physical Audit Sheet', icon: ClipboardCheck, badge: auditDiscrepancyCount.value }
]);

// Common Stock Summary State
const searchQuery = ref('');
const selectedWarehouse = ref('All');
const selectedCategory = ref('All');
const activeStatusTab = ref('all');

// Modals State
const showAdjustModal = ref(false);
const showTransferModal = ref(false);
const showLedgerDrawer = ref(false);
const showNewBatchModal = ref(false);
const showNewSerialModal = ref(false);
const showNewGrnModal = ref(false);
const showNewChallanModal = ref(false);
const showPrintModal = ref(false);

const printTargetChallan = ref<any>(null);
const ledgerTargetItem = ref<StockItem | null>(null);
const adjustTargetItem = ref<StockItem | null>(null);

// Forms
const adjustForm = ref({
  item_code: '',
  actual_qty: 0,
  reason: 'Physical Count Discrepancy',
  notes: ''
});

const transferForm = ref({
  item_code: '',
  from_warehouse: 'Stores - EB',
  to_warehouse: 'Shop Floor - EB',
  qty: 10,
  remarks: ''
});

const newBatchForm = ref({
  batch_no: '',
  item_code: 'MED-001',
  mfg_date: '2026-02-01',
  expiry_date: '2027-02-01',
  qty: 50,
  mrp: 35.00,
  warehouse: 'Stores - EB'
});

const newSerialForm = ref({
  item_code: 'BAB-002',
  serial_numbers_raw: '',
  warranty_months: 12,
  warehouse: 'Shop Floor - EB'
});

const newGrnForm = ref({
  supplier_name: '',
  po_no: '',
  vehicle_no: '',
  transporter: '',
  item_code: 'MED-001',
  received_qty: 50,
  accepted_qty: 50,
  rejected_qty: 0,
  warehouse: 'Stores - EB'
});

const newChallanForm = ref({
  customer_name: '',
  invoice_ref: '',
  vehicle_no: '',
  transporter: '',
  item_code: 'MED-001',
  qty: 10,
  source_warehouse: 'Stores - EB'
});

// Search filters
const batchSearch = ref('');
const serialSearch = ref('');
const grnSearch = ref('');
const challanSearch = ref('');

// Computed filtered registers
const filteredBatches = computed(() => {
  return batchList.value.filter(b => {
    const q = batchSearch.value.toLowerCase().trim();
    if (!q) return true;
    return b.batch_no.toLowerCase().includes(q) || b.item_name.toLowerCase().includes(q) || b.item_code.toLowerCase().includes(q);
  });
});

const filteredSerials = computed(() => {
  return serialList.value.filter(s => {
    const q = serialSearch.value.toLowerCase().trim();
    if (!q) return true;
    return s.serial_no.toLowerCase().includes(q) || s.item_name.toLowerCase().includes(q) || s.item_code.toLowerCase().includes(q);
  });
});

const filteredGrns = computed(() => {
  return grnList.value.filter(g => {
    const q = grnSearch.value.toLowerCase().trim();
    if (!q) return true;
    return g.grn_no.toLowerCase().includes(q) || g.supplier_name.toLowerCase().includes(q) || g.po_no.toLowerCase().includes(q);
  });
});

const filteredChallans = computed(() => {
  return challanList.value.filter(c => {
    const q = challanSearch.value.toLowerCase().trim();
    if (!q) return true;
    return c.challan_no.toLowerCase().includes(q) || c.customer_name.toLowerCase().includes(q) || c.invoice_ref.toLowerCase().includes(q);
  });
});

const ledgerEntries = ref<LedgerEntry[]>([
  {
    id: 'LED-001',
    item_code: 'MED-001',
    item_name: 'Paracetamol 650mg',
    date: '16-11-2026 14:30',
    voucher_type: 'Sales Invoice',
    voucher_no: 'INV-2026-0042',
    warehouse: 'Shop Floor - EB',
    inward_qty: 0,
    outward_qty: 2,
    balance_qty: 45,
    valuation_rate: 22.00,
    remarks: 'POS Checkout LK'
  },
  {
    id: 'LED-002',
    item_code: 'MED-001',
    item_name: 'Paracetamol 650mg',
    date: '16-11-2026 10:15',
    voucher_type: 'Stock Transfer',
    voucher_no: 'TR-2026-0018',
    warehouse: 'Shop Floor - EB',
    inward_qty: 20,
    outward_qty: 0,
    balance_qty: 47,
    valuation_rate: 22.00,
    remarks: 'Replenished from Stores - EB'
  },
  {
    id: 'LED-003',
    item_code: 'MED-001',
    item_name: 'Paracetamol 650mg',
    date: '14-11-2026 16:00',
    voucher_type: 'Goods Receipt Note',
    voucher_no: 'GRN-2026-0038',
    warehouse: 'Stores - EB',
    inward_qty: 50,
    outward_qty: 0,
    balance_qty: 27,
    valuation_rate: 22.00,
    remarks: 'Supplier Inward Cipla PO-2026-081'
  }
]);

// Summary Filters & Metrics
const uniqueCategories = computed(() => {
  return Array.from(new Set(inventoryList.value.map(i => i.category)));
});

const inStockCount = computed(() => inventoryList.value.filter(i => i.status === 'In Stock').length);
const lowStockCount = computed(() => inventoryList.value.filter(i => i.status === 'Low Stock').length);
const outOfStockCount = computed(() => inventoryList.value.filter(i => i.status === 'Out of Stock').length);

const filterTabs = computed(() => [
  { id: 'all', label: 'All Inventory', count: inventoryList.value.length },
  { id: 'in_stock', label: 'In Stock', count: inStockCount.value },
  { id: 'low_stock', label: 'Low Stock Alerts', count: lowStockCount.value },
  { id: 'out_of_stock', label: 'Out of Stock', count: outOfStockCount.value }
]);

const kpiMetrics = computed(() => {
  return {
    totalValuation: inventoryList.value.reduce((acc, i) => acc + i.stock_value, 0),
    totalQty: inventoryList.value.reduce((acc, i) => acc + i.qty_on_hand, 0),
    lowStockCount: lowStockCount.value,
    outOfStockCount: outOfStockCount.value
  };
});

const filteredInventory = computed(() => {
  return inventoryList.value.filter(itm => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const match = (
        itm.item_code.toLowerCase().includes(q) ||
        itm.item_name.toLowerCase().includes(q) ||
        (itm.name_ta && itm.name_ta.includes(q)) ||
        itm.category.toLowerCase().includes(q)
      );
      if (!match) return false;
    }
    if (selectedWarehouse.value !== 'All' && itm.warehouse !== selectedWarehouse.value) return false;
    if (selectedCategory.value !== 'All' && itm.category !== selectedCategory.value) return false;
    if (activeStatusTab.value === 'in_stock' && itm.status !== 'In Stock') return false;
    if (activeStatusTab.value === 'low_stock' && itm.status !== 'Low Stock') return false;
    if (activeStatusTab.value === 'out_of_stock' && itm.status !== 'Out of Stock') return false;
    return true;
  });
});

const selectedTransferItem = computed(() => {
  return inventoryList.value.find(i => i.item_code === transferForm.value.item_code);
});

// -------------------------------------------------------------
// METHODS & HANDLERS
// -------------------------------------------------------------
function formatMoney(amount: number | undefined): string {
  if (amount === undefined || amount === null) return '0.00';
  return Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatQty(qty: number | undefined): string {
  if (qty === undefined || qty === null) return '0';
  return qty.toLocaleString('en-IN');
}

function openLedgerHistory(item: StockItem) {
  ledgerTargetItem.value = item;
  showLedgerDrawer.value = true;
}

function openTransferModal(item: StockItem | null) {
  if (item) {
    transferForm.value.item_code = item.item_code;
    transferForm.value.qty = Math.min(10, item.qty_on_hand);
  } else if (inventoryList.value.length > 0) {
    transferForm.value.item_code = inventoryList.value[0].item_code;
    transferForm.value.qty = 10;
  }
  showTransferModal.value = true;
}

function submitStockTransfer() {
  if (!transferForm.value.item_code) {
    toast.error('Selection Error', 'Please select an item to transfer');
    return;
  }
  if (transferForm.value.from_warehouse === transferForm.value.to_warehouse) {
    toast.error('Invalid Warehouse', 'Source and target godowns must be different');
    return;
  }
  if (!transferForm.value.qty || transferForm.value.qty <= 0) {
    toast.error('Invalid Quantity', 'Please enter a valid transfer quantity');
    return;
  }

  const itm = inventoryList.value.find(i => i.item_code === transferForm.value.item_code);
  if (!itm) return;

  if (itm.qty_on_hand < transferForm.value.qty) {
    toast.warning('Insufficient Stock', `Source has ${itm.qty_on_hand} available`);
    return;
  }

  itm.qty_on_hand -= transferForm.value.qty;
  itm.stock_value = itm.qty_on_hand * itm.valuation_rate;

  ledgerEntries.value.unshift({
    id: 'LED-' + Date.now().toString().slice(-4),
    item_code: itm.item_code,
    item_name: itm.item_name,
    date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    voucher_type: 'Stock Transfer',
    voucher_no: 'TR-2026-' + Math.floor(100 + Math.random() * 900),
    warehouse: transferForm.value.to_warehouse,
    inward_qty: transferForm.value.qty,
    outward_qty: 0,
    balance_qty: itm.qty_on_hand,
    valuation_rate: itm.valuation_rate,
    remarks: `Transfer to ${transferForm.value.to_warehouse}: ${transferForm.value.remarks || 'Inter-Godown'}`
  });

  showTransferModal.value = false;
  toast.success('Stock Transferred', `Moved ${transferForm.value.qty} ${itm.unit} to ${transferForm.value.to_warehouse}`);
}

function openQuickAdjustModal(item: StockItem | null) {
  adjustTargetItem.value = item;
  if (item) {
    adjustForm.value.item_code = item.item_code;
    adjustForm.value.actual_qty = item.qty_on_hand;
  } else if (inventoryList.value.length > 0) {
    adjustForm.value.item_code = inventoryList.value[0].item_code;
    adjustForm.value.actual_qty = inventoryList.value[0].qty_on_hand;
  }
  showAdjustModal.value = true;
}

function onAdjustItemCodeChange() {
  const item = inventoryList.value.find(i => i.item_code === adjustForm.value.item_code);
  if (item) {
    adjustTargetItem.value = item;
    adjustForm.value.actual_qty = item.qty_on_hand;
  }
}

function submitStockAdjustment() {
  const itm = inventoryList.value.find(i => i.item_code === adjustForm.value.item_code);
  if (!itm) return;

  const variance = (adjustForm.value.actual_qty || 0) - itm.qty_on_hand;
  itm.qty_on_hand = adjustForm.value.actual_qty;
  itm.stock_value = itm.qty_on_hand * itm.valuation_rate;

  ledgerEntries.value.unshift({
    id: 'LED-' + Date.now().toString().slice(-4),
    item_code: itm.item_code,
    item_name: itm.item_name,
    date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    voucher_type: 'Stock Reconciliation',
    voucher_no: 'ADJ-2026-' + Math.floor(100 + Math.random() * 900),
    warehouse: itm.warehouse,
    inward_qty: variance > 0 ? variance : 0,
    outward_qty: variance < 0 ? Math.abs(variance) : 0,
    balance_qty: itm.qty_on_hand,
    valuation_rate: itm.valuation_rate,
    remarks: `Reconciliation: ${adjustForm.value.reason}`
  });

  showAdjustModal.value = false;
  toast.success('Stock Reconciled', `${itm.item_name} balance set to ${itm.qty_on_hand} ${itm.unit}`);
}

// Batch Methods
function submitNewBatch() {
  if (!newBatchForm.value.batch_no) {
    toast.error('Validation Error', 'Batch number is required');
    return;
  }
  const item = inventoryList.value.find(i => i.item_code === newBatchForm.value.item_code);
  const now = new Date();
  const exp = new Date(newBatchForm.value.expiry_date);
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  batchList.value.unshift({
    batch_no: newBatchForm.value.batch_no.toUpperCase(),
    item_code: newBatchForm.value.item_code,
    item_name: item ? item.item_name : 'New Item',
    category: item ? item.category : 'Medicines',
    warehouse: newBatchForm.value.warehouse,
    mfg_date: newBatchForm.value.mfg_date,
    expiry_date: newBatchForm.value.expiry_date,
    days_left: diffDays,
    qty: newBatchForm.value.qty,
    unit: item ? item.unit : 'Strip',
    mrp: newBatchForm.value.mrp,
    status: diffDays <= 0 ? 'Expired' : diffDays <= 30 ? 'Critical (<30d)' : 'Fresh'
  });

  showNewBatchModal.value = false;
  toast.success('Batch Inwarded', `Batch ${newBatchForm.value.batch_no} added with ${newBatchForm.value.qty} units`);
}

function quarantineBatch(batch: BatchItem) {
  batch.status = 'Quarantined';
  toast.warning('Batch Quarantined', `Batch ${batch.batch_no} quarantined and locked from billing`);
}

// Serial Methods
function submitNewSerials() {
  const raw = newSerialForm.value.serial_numbers_raw.trim();
  if (!raw) return;

  const numbers = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  const item = inventoryList.value.find(i => i.item_code === newSerialForm.value.item_code);

  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + newSerialForm.value.warranty_months);

  for (const sn of numbers) {
    serialList.value.unshift({
      serial_no: sn.toUpperCase(),
      item_code: newSerialForm.value.item_code,
      item_name: item ? item.item_name : 'Electronic Item',
      warehouse: newSerialForm.value.warehouse,
      inward_date: new Date().toLocaleDateString('en-IN'),
      warranty_months: newSerialForm.value.warranty_months,
      warranty_expiry: expDate.toLocaleDateString('en-IN'),
      status: 'In Store'
    });
  }

  showNewSerialModal.value = false;
  newSerialForm.value.serial_numbers_raw = '';
  toast.success('Serials Registered', `Added ${numbers.length} unique serial assets`);
}

function toggleSerialStatus(s: SerialItem) {
  if (s.status === 'In Store') s.status = 'Under RMA';
  else if (s.status === 'Under RMA') s.status = 'In Store';
  toast.info('Status Updated', `Serial ${s.serial_no} is now ${s.status}`);
}

// GRN Methods
function submitNewGrn() {
  if (!newGrnForm.value.supplier_name) {
    toast.error('Validation Error', 'Supplier name is required');
    return;
  }
  const grnNo = 'GRN-2026-' + Math.floor(1000 + Math.random() * 9000);
  const itm = inventoryList.value.find(i => i.item_code === newGrnForm.value.item_code);
  const totalVal = (itm ? itm.valuation_rate : 20) * newGrnForm.value.accepted_qty;

  grnList.value.unshift({
    grn_no: grnNo,
    supplier_name: newGrnForm.value.supplier_name,
    po_no: newGrnForm.value.po_no || 'PO-2026-DIRECT',
    vehicle_no: newGrnForm.value.vehicle_no || 'N/A',
    transporter: newGrnForm.value.transporter || 'Direct Delivery',
    date: new Date().toLocaleDateString('en-IN'),
    received_qty: newGrnForm.value.received_qty,
    accepted_qty: newGrnForm.value.accepted_qty,
    rejected_qty: newGrnForm.value.rejected_qty,
    total_value: totalVal,
    status: newGrnForm.value.rejected_qty > 0 ? 'Partial Rejection' : 'Accepted'
  });

  // Increment stock
  if (itm) {
    itm.qty_on_hand += newGrnForm.value.accepted_qty;
    itm.stock_value = itm.qty_on_hand * itm.valuation_rate;
  }

  showNewGrnModal.value = false;
  toast.success('GRN Created', `${grnNo}: Accepted ${newGrnForm.value.accepted_qty} units into stock`);
}

// Challan Methods
function submitNewChallan() {
  if (!newChallanForm.value.customer_name) {
    toast.error('Validation Error', 'Customer name is required');
    return;
  }
  const challanNo = 'DC-2026-' + Math.floor(1000 + Math.random() * 9000);
  const itm = inventoryList.value.find(i => i.item_code === newChallanForm.value.item_code);

  challanList.value.unshift({
    challan_no: challanNo,
    customer_name: newChallanForm.value.customer_name,
    invoice_ref: newChallanForm.value.invoice_ref || 'SO-2026-DISP',
    source_warehouse: newChallanForm.value.source_warehouse,
    vehicle_no: newChallanForm.value.vehicle_no || 'TN 38 V 1001',
    transporter: newChallanForm.value.transporter || 'Express Dispatch',
    date: new Date().toLocaleDateString('en-IN'),
    total_qty: newChallanForm.value.qty,
    status: 'Dispatched',
    items: [{ code: itm?.item_code, name: itm?.item_name, qty: newChallanForm.value.qty, unit: itm?.unit, price: itm?.valuation_rate }]
  });

  // Deduct stock
  if (itm) {
    itm.qty_on_hand = Math.max(0, itm.qty_on_hand - newChallanForm.value.qty);
    itm.stock_value = itm.qty_on_hand * itm.valuation_rate;
  }

  showNewChallanModal.value = false;
  toast.success('Challan Issued', `${challanNo} dispatched for ${newChallanForm.value.customer_name}`);
}

function printDeliveryChallan(c: DeliveryChallan) {
  printTargetChallan.value = {
    number: c.challan_no,
    date: c.date,
    customer: c.customer_name,
    customer_phone: '+91 94433 22110',
    items: (c.items || []).map(i => ({
      code: i.code || 'MED-001',
      name: i.name || 'Dispatched Item',
      qty: i.qty || c.total_qty,
      unit: i.unit || 'Units',
      price: i.price || 50,
      gst_rate: 12,
      hsn: '3004'
    })),
    taxable: 450,
    tax: 54,
    total: 504,
    mode: 'Delivery Challan Memo',
    godown: c.source_warehouse
  };
  showPrintModal.value = true;
}

function markChallanDelivered(c: DeliveryChallan) {
  c.status = 'Delivered';
  toast.success('Proof of Delivery (POD)', `Challan ${c.challan_no} confirmed delivered by customer`);
}

// Full Physical Audit Submission
function submitFullAuditReconciliation() {
  let adjustedCount = 0;
  for (const aItem of auditItems.value) {
    const orig = inventoryList.value.find(i => i.item_code === aItem.item_code && i.warehouse === aItem.warehouse);
    if (orig && orig.qty_on_hand !== aItem.physical_qty) {
      const variance = aItem.physical_qty - orig.qty_on_hand;
      orig.qty_on_hand = aItem.physical_qty;
      orig.stock_value = orig.qty_on_hand * orig.valuation_rate;
      adjustedCount++;

      ledgerEntries.value.unshift({
        id: 'LED-' + Date.now().toString().slice(-4),
        item_code: orig.item_code,
        item_name: orig.item_name,
        date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voucher_type: 'Physical Stock Audit',
        voucher_no: 'AUD-' + Math.floor(100 + Math.random() * 900),
        warehouse: aItem.warehouse,
        inward_qty: variance > 0 ? variance : 0,
        outward_qty: variance < 0 ? Math.abs(variance) : 0,
        balance_qty: orig.qty_on_hand,
        valuation_rate: orig.valuation_rate,
        remarks: `Audit Sheet Reconciliation by Store Manager`
      });
    }
  }

  toast.success('Audit Reconciled', `Physical counts updated for ${adjustedCount} items in ${auditWarehouse.value}`);
}

// Export CSV for active register
function exportActiveRegisterCSV() {
  let headers = '';
  let rows: string[] = [];

  if (currentModuleTab.value === 'summary') {
    headers = 'Item Code,Item Name,Category,Warehouse,Qty On Hand,Valuation Rate,Stock Value,Status\n';
    rows = filteredInventory.value.map(i => `${i.item_code},"${i.item_name}",${i.category},${i.warehouse},${i.qty_on_hand},${i.valuation_rate},${i.stock_value},${i.status}`);
  } else if (currentModuleTab.value === 'batches') {
    headers = 'Batch No,Item Code,Item Name,Warehouse,Mfg Date,Expiry Date,Days Left,Qty,MRP,Status\n';
    rows = filteredBatches.value.map(b => `${b.batch_no},${b.item_code},"${b.item_name}",${b.warehouse},${b.mfg_date},${b.expiry_date},${b.days_left},${b.qty},${b.mrp},${b.status}`);
  } else if (currentModuleTab.value === 'serials') {
    headers = 'Serial/IMEI,Item Code,Item Name,Warehouse,Inward Date,Warranty Months,Expiry,Status\n';
    rows = filteredSerials.value.map(s => `${s.serial_no},${s.item_code},"${s.item_name}",${s.warehouse},${s.inward_date},${s.warranty_months},${s.warranty_expiry},${s.status}`);
  } else if (currentModuleTab.value === 'grn') {
    headers = 'GRN No,Supplier,PO Ref,Vehicle No,Date,Received Qty,Accepted Qty,Rejected Qty,Value,Status\n';
    rows = filteredGrns.value.map(g => `${g.grn_no},"${g.supplier_name}",${g.po_no},${g.vehicle_no},${g.date},${g.received_qty},${g.accepted_qty},${g.rejected_qty},${g.total_value},${g.status}`);
  } else if (currentModuleTab.value === 'challan') {
    headers = 'Challan No,Customer,Invoice Ref,Warehouse,Vehicle,Date,Qty,Status\n';
    rows = filteredChallans.value.map(c => `${c.challan_no},"${c.customer_name}",${c.invoice_ref},${c.source_warehouse},${c.vehicle_no},${c.date},${c.total_qty},${c.status}`);
  }

  const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `easybill_stock_${currentModuleTab.value}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Export Successful', `Downloaded ${currentModuleTab.value} register CSV`);
}

const route = useRoute();

onMounted(() => {
  initAuditSheet();
  if (route.query.tab && ['summary', 'batches', 'serials', 'grn', 'challan', 'audit'].includes(route.query.tab as string)) {
    currentModuleTab.value = route.query.tab as any;
  }
  if (route.query.action === 'transfer') {
    openTransferModal(null);
  } else if (route.query.action === 'new_batch') {
    showNewBatchModal.value = true;
  } else if (route.query.action === 'new_serial') {
    showNewSerialModal.value = true;
  } else if (route.query.action === 'new_grn') {
    showNewGrnModal.value = true;
  } else if (route.query.action === 'new_challan') {
    showNewChallanModal.value = true;
  }
});
</script>
