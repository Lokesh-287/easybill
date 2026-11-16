<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top KPI Cards Section (Behance Inventory & Finance Style) -->
    <div class="p-6 pb-2">
      <!-- Header & Quick Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
            Item Catalog & Inventory
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Manage product catalog, HSN codes, GST tax slabs, barcodes, and stock levels
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Print Labels Modal Trigger (SCR-C4) -->
          <button
            @click="showLabelModal = true"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-card flex items-center space-x-1.5 transition"
          >
            <Barcode class="w-3.5 h-3.5 text-slate-500" />
            <span>Print Labels</span>
          </button>

          <!-- Import CSV Trigger (SCR-C3) -->
          <button
            @click="triggerImportModal"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-card flex items-center space-x-1.5 transition"
          >
            <Upload class="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <!-- Add Product Button (SCR-C2) -->
          <button
            @click="openAddProductDrawer"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <Plus class="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <!-- 4 Inventory KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Catalog Items -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Catalog Size</span>
            <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Package class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            {{ itemsList.length }} Products
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              +12 this week
            </span>
            <span class="text-slate-400">active SKU count</span>
          </div>
        </div>

        <!-- Card 2: Inventory Value -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Stock Valuation</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Boxes class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
            ₹{{ formatMoney(totalStockValuation) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-md font-tabular">
              {{ totalUnitsInStock }} units
            </span>
            <span class="text-slate-400">in warehouse</span>
          </div>
        </div>

        <!-- Card 3: Low Stock Warnings -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Low Stock Alerts</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-amber-700">
            {{ lowStockCount }} Items
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
              Reorder Needed
            </span>
            <span class="text-slate-400">below min level</span>
          </div>
        </div>

        <!-- Card 4: GST Compliance Rate -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">GST Compliance</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            100%
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md">
              HSN Tagged
            </span>
            <span class="text-slate-400">GSTIN verified</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar & Master Data Table -->
    <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 pt-3">
      <div class="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col overflow-hidden">
        <!-- Status Tabs & Filter Toolbar -->
        <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <!-- Stock Filter Tabs -->
          <div class="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              v-for="tab in filterTabs"
              :key="tab.id"
              @click="activeFilterTab = tab.id"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5',
                activeFilterTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <span>{{ tab.name }}</span>
              <span
                :class="[
                  'text-[10px] px-1.5 py-0.2 rounded-full font-tabular',
                  activeFilterTab === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Search & Category Filters -->
          <div class="flex items-center space-x-2.5">
            <!-- Search Input -->
            <div class="relative w-56 lg:w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search name, barcode, HSN..."
                class="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              />
            </div>

            <!-- Category Dropdown Filter -->
            <select
              v-model="selectedCategory"
              class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="All">All Categories</option>
              <option value="Medicines">Medicines</option>
              <option value="General">General</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Baby Care">Baby Care</option>
            </select>
          </div>
        </div>

        <!-- Master Items Data Table -->
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-slate-50/90 backdrop-blur-xs text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 z-10">
              <tr>
                <th class="py-3 px-4 w-10">
                  <input type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                </th>
                <th class="py-3 px-4">Item Code & Barcode</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">HSN Code</th>
                <th class="py-3 px-4 text-center">GST Slab</th>
                <th class="py-3 px-4 text-right">Selling Price</th>
                <th class="py-3 px-4 text-right">Cost Price</th>
                <th class="py-3 px-4 text-center">Stock Level</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4 text-center w-24">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 text-xs">
              <tr
                v-for="item in filteredItems"
                :key="item.code"
                @click="openEditProductDrawer(item)"
                class="hover:bg-primary-50/40 cursor-pointer transition group"
              >
                <!-- Checkbox -->
                <td class="py-3 px-4" @click.stop>
                  <input type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                </td>

                <!-- Item Code & Barcode -->
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="font-bold text-slate-900 font-mono text-[11px] group-hover:text-primary-600 transition">
                    {{ item.code }}
                  </div>
                  <div class="text-[10px] text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
                    <Barcode class="w-3 h-3 text-slate-400" />
                    <span>{{ item.barcode || 'No barcode' }}</span>
                  </div>
                </td>

                <!-- Description -->
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-900 group-hover:text-primary-600 transition">
                    {{ item.name }}
                  </div>
                  <div v-if="item.name_ta" class="text-[11px] text-slate-500 font-tamil mt-0.5">
                    {{ item.name_ta }}
                  </div>
                </td>

                <!-- Category -->
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/60">
                    {{ item.category }}
                  </span>
                </td>

                <!-- HSN Code -->
                <td class="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                  <span v-if="item.hsn" class="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    {{ item.hsn }}
                  </span>
                  <span v-else class="text-rose-600 text-[10px] font-bold">Missing HSN</span>
                </td>

                <!-- GST Slab -->
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200/60 font-tabular">
                    {{ item.gst_rate }}% GST
                  </span>
                </td>

                <!-- Selling Price & MRP -->
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <div class="font-bold text-slate-900 font-tabular">
                    ₹{{ formatMoney(item.price) }}
                  </div>
                  <div class="text-[10px] text-slate-400 line-through font-tabular">
                    MRP: ₹{{ formatMoney(item.mrp) }}
                  </div>
                </td>

                <!-- Cost Price & Margin -->
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <div class="font-medium text-slate-600 font-tabular text-[11px]">
                    ₹{{ formatMoney(item.cost) }}
                  </div>
                  <div class="text-[10px] font-bold text-emerald-600 font-tabular">
                    +{{ calculateMargin(item) }}% Margin
                  </div>
                </td>

                <!-- Stock Level -->
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-tabular',
                      item.stock > item.min_stock
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        : item.stock > 0
                        ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                        : 'bg-rose-50 text-rose-700 border-rose-200/70'
                    ]"
                  >
                    <span
                      :class="[
                        'w-1.5 h-1.5 rounded-full',
                        item.stock > item.min_stock ? 'bg-emerald-500' : item.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                      ]"
                    ></span>
                    <span>{{ item.stock }} {{ item.unit }}</span>
                  </span>
                </td>

                <!-- Status -->
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {{ item.status || 'Active' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3 px-4 text-center" @click.stop>
                  <div class="flex items-center justify-center space-x-1">
                    <button
                      @click="openEditProductDrawer(item)"
                      title="Edit Item Master"
                      class="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                    >
                      <Edit3 class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="printSingleBarcode(item)"
                      title="Print Barcode Label"
                      class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Printer class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="deleteItem(item)"
                      title="Deactivate / Delete"
                      class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div
            v-if="filteredItems.length === 0"
            class="py-16 flex flex-col items-center justify-center text-center"
          >
            <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <Package class="w-6 h-6 text-slate-300" />
            </div>
            <h4 class="text-sm font-bold text-slate-700">No products match your filter</h4>
            <p class="text-xs text-slate-400 mt-1">Try resetting search or add a new product</p>
          </div>
        </div>

        <!-- Table Footer Pagination -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span class="font-bold text-slate-800">{{ filteredItems.length }}</span> of <span class="font-bold text-slate-800">{{ itemsList.length }}</span> products
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
    <!-- SLIDE-OVER DRAWER: Product Master (SCR-C2) -->
    <!-- ========================================== -->
    <div
      v-if="showProductDrawer"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
      @click.self="showProductDrawer = false"
    >
      <div class="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <!-- Drawer Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Package class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">
                {{ editingItem ? `Edit Product: ${editingItem.code}` : 'Add New Product (SCR-C2)' }}
              </div>
              <div class="text-[10px] text-slate-400">GST-ready product master with barcode and pricing</div>
            </div>
          </div>
          <button @click="showProductDrawer = false" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Drawer Form Body -->
        <form @submit.prevent="saveProduct" class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Section 1: Basic Product Information -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Basic Info</div>
            <div class="space-y-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Product Name (English) *</label>
                <input
                  v-model="formItem.name"
                  required
                  type="text"
                  placeholder="e.g. Paracetamol 650mg"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Vernacular Name (Tamil)</label>
                <input
                  v-model="formItem.name_ta"
                  type="text"
                  placeholder="e.g. பாரசிட்டமால் 650mg"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-tamil font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    v-model="formItem.category"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Medicines">Medicines</option>
                    <option value="General">General</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Baby Care">Baby Care</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">Unit of Measure (UOM)</label>
                  <select
                    v-model="formItem.unit"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Strip">Strip</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Box">Box</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Roll">Roll</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Taxation & HSN -->
          <div class="pt-2 border-t border-slate-100">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Taxation (GST)</div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">HSN / SAC Code *</label>
                <input
                  v-model="formItem.hsn"
                  required
                  type="text"
                  placeholder="e.g. 300490"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">GST Tax Slab</label>
                <select
                  v-model.number="formItem.gst_rate"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option :value="0">0% (Nil Rated)</option>
                  <option :value="5">5% GST</option>
                  <option :value="12">12% GST</option>
                  <option :value="18">18% GST</option>
                  <option :value="28">28% GST</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 3: Pricing & Margin Preview -->
          <div class="pt-2 border-t border-slate-100">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Pricing & Margins</div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
                <input
                  v-model.number="formItem.price"
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">MRP (₹)</label>
                <input
                  v-model.number="formItem.mrp"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Purchase Cost (₹)</label>
                <input
                  v-model.number="formItem.cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <!-- Profit Margin Preview Badge -->
            <div class="mt-2.5 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 flex items-center justify-between text-xs">
              <span class="font-medium text-emerald-800">Gross Margin:</span>
              <span class="font-bold text-emerald-800 font-tabular">
                ₹{{ formatMoney(formItem.price - formItem.cost) }} per {{ formItem.unit }} (+{{ calculateFormMargin() }}%)
              </span>
            </div>
          </div>

          <!-- Section 4: Barcode & Stock Control -->
          <div class="pt-2 border-t border-slate-100">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Inventory & Barcode</div>
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-[11px] font-semibold text-slate-700">Barcode (EAN-13 / Code-128)</label>
                  <button
                    type="button"
                    @click="generateEan13"
                    class="text-[10px] font-bold text-primary-600 hover:text-primary-800 transition"
                  >
                    Generate EAN-13
                  </button>
                </div>
                <div class="relative">
                  <Barcode class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="formItem.barcode"
                    type="text"
                    placeholder="Scan or enter barcode"
                    class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">Current Stock</label>
                  <input
                    v-model.number="formItem.stock"
                    type="number"
                    placeholder="50"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">Min Reorder Alert</label>
                  <input
                    v-model.number="formItem.min_stock"
                    type="number"
                    placeholder="10"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <!-- Drawer Footer Buttons -->
        <div class="p-4 border-t border-slate-100 bg-white flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="showProductDrawer = false"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveProduct"
            class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 transition"
          >
            {{ editingItem ? 'Save Changes' : 'Create Product' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL: Barcode Label Print Modal (SCR-C4)  -->
    <!-- ========================================== -->
    <div
      v-if="showLabelModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showLabelModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center space-x-2">
            <Barcode class="w-5 h-5 text-primary-600" />
            <h3 class="text-sm font-bold text-slate-900">Print Barcode Labels (SCR-C4)</h3>
          </div>
          <button @click="showLabelModal = false" class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="py-4 space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Select Label Format</label>
            <select class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
              <option>50mm x 25mm (Standard Barcode Sticker)</option>
              <option>38mm x 25mm (Jewellery / Pharmacy Tag)</option>
              <option>A4 Sheet (24 labels per sheet)</option>
            </select>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono">
            <div class="text-[10px] text-slate-500">EASYBILL STORE</div>
            <div class="font-bold text-xs text-slate-900 mt-1">Paracetamol 650mg</div>
            <div class="text-xs text-slate-800 font-bold">₹35.00 (Incl. 12% GST)</div>
            <div class="my-1.5 text-lg font-bold tracking-widest text-slate-800">|||||| ||||| |||||||</div>
            <div class="text-[9px] text-slate-500">8901234001</div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end space-x-2">
          <button
            @click="showLabelModal = false"
            class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            @click="printLabels"
            class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Print Labels
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  Package,
  Plus,
  Search,
  Barcode,
  Upload,
  Boxes,
  AlertTriangle,
  ShieldCheck,
  Edit3,
  Printer,
  Trash2,
  X
} from '@lucide/vue';

// Types
interface ProductItem {
  code: string;
  name: string;
  name_ta?: string;
  category: string;
  hsn: string;
  gst_rate: number;
  price: number;
  mrp: number;
  cost: number;
  unit: string;
  stock: number;
  min_stock: number;
  barcode: string;
  status: 'Active' | 'Inactive';
}

// State
const searchQuery = ref('');
const selectedCategory = ref('All');
const activeFilterTab = ref('all');
const showProductDrawer = ref(false);
const showLabelModal = ref(false);
const editingItem = ref<ProductItem | null>(null);

// Form State
const formItem = ref<ProductItem>({
  code: '',
  name: '',
  name_ta: '',
  category: 'Medicines',
  hsn: '300490',
  gst_rate: 12,
  price: 0,
  mrp: 0,
  cost: 0,
  unit: 'Strip',
  stock: 50,
  min_stock: 10,
  barcode: '',
  status: 'Active'
});

// Master Products List
const itemsList = ref<ProductItem[]>([
  {
    code: 'MED-001',
    name: 'Paracetamol 650mg',
    name_ta: 'பாரசிட்டமால் 650mg',
    category: 'Medicines',
    hsn: '300490',
    gst_rate: 12,
    price: 35.00,
    mrp: 38.00,
    cost: 22.00,
    unit: 'Strip',
    stock: 45,
    min_stock: 10,
    barcode: '8901234001',
    status: 'Active'
  },
  {
    code: 'MED-002',
    name: 'Amoxicillin 500mg',
    name_ta: 'அமாக்சிசிலின் 500mg',
    category: 'Medicines',
    hsn: '300410',
    gst_rate: 12,
    price: 72.50,
    mrp: 80.00,
    cost: 48.00,
    unit: 'Strip',
    stock: 20,
    min_stock: 15,
    barcode: '8901234002',
    status: 'Active'
  },
  {
    code: 'MED-003',
    name: 'Cetirizine 10mg',
    name_ta: 'செட்டிரிசின் 10mg',
    category: 'Medicines',
    hsn: '300490',
    gst_rate: 12,
    price: 18.00,
    mrp: 20.00,
    cost: 10.00,
    unit: 'Strip',
    stock: 60,
    min_stock: 20,
    barcode: '8901234003',
    status: 'Active'
  },
  {
    code: 'GEN-001',
    name: 'N95 Protective Mask',
    name_ta: 'N95 முகக்கவசம்',
    category: 'General',
    hsn: '630790',
    gst_rate: 5,
    price: 25.00,
    mrp: 30.00,
    cost: 14.00,
    unit: 'Pcs',
    stock: 120,
    min_stock: 30,
    barcode: '8901234004',
    status: 'Active'
  },
  {
    code: 'GEN-002',
    name: 'Cotton Roll 100g',
    name_ta: 'பஞ்சு 100g',
    category: 'General',
    hsn: '300590',
    gst_rate: 5,
    price: 40.00,
    mrp: 45.00,
    cost: 26.00,
    unit: 'Roll',
    stock: 25,
    min_stock: 10,
    barcode: '8901234005',
    status: 'Active'
  },
  {
    code: 'PER-001',
    name: 'Dettol Antiseptic 100ml',
    name_ta: 'டெட்டால் 100ml',
    category: 'Personal Care',
    hsn: '380894',
    gst_rate: 18,
    price: 65.00,
    mrp: 70.00,
    cost: 49.00,
    unit: 'Bottle',
    stock: 15,
    min_stock: 8,
    barcode: '8901234006',
    status: 'Active'
  },
  {
    code: 'BAB-001',
    name: 'Baby Gripe Water 130ml',
    name_ta: 'கிரைப் வாட்டர்',
    category: 'Baby Care',
    hsn: '300490',
    gst_rate: 12,
    price: 48.00,
    mrp: 52.00,
    cost: 32.00,
    unit: 'Bottle',
    stock: 30,
    min_stock: 10,
    barcode: '8901234007',
    status: 'Active'
  },
  {
    code: 'BAB-002',
    name: 'Digital Thermometer',
    name_ta: 'டிஜிட்டல் தெர்மாமீட்டர்',
    category: 'Baby Care',
    hsn: '902519',
    gst_rate: 18,
    price: 180.00,
    mrp: 220.00,
    cost: 115.00,
    unit: 'Pcs',
    stock: 4,
    min_stock: 10,
    barcode: '8901234008',
    status: 'Active'
  },
  {
    code: 'GEN-003',
    name: 'Surgical Gloves Latex (Box of 50)',
    name_ta: 'அறுவைசிகிச்சை கையுறைகள்',
    category: 'General',
    hsn: '401511',
    gst_rate: 12,
    price: 320.00,
    mrp: 350.00,
    cost: 210.00,
    unit: 'Box',
    stock: 12,
    min_stock: 5,
    barcode: '8901234009',
    status: 'Active'
  },
  {
    code: 'GEN-004',
    name: 'Hand Sanitizer 500ml',
    name_ta: 'கிருமிநாசினி 500ml',
    category: 'General',
    hsn: '380894',
    gst_rate: 18,
    price: 125.00,
    mrp: 150.00,
    cost: 80.00,
    unit: 'Bottle',
    stock: 2,
    min_stock: 10,
    barcode: '8901234010',
    status: 'Active'
  }
]);

// Filter Tabs
const filterTabs = computed(() => {
  const all = itemsList.value.length;
  const inStock = itemsList.value.filter(i => i.stock > i.min_stock).length;
  const lowStock = itemsList.value.filter(i => i.stock <= i.min_stock && i.stock > 0).length;
  const outOfStock = itemsList.value.filter(i => i.stock <= 0).length;

  return [
    { id: 'all', name: 'All Products', count: all },
    { id: 'in_stock', name: 'In Stock', count: inStock },
    { id: 'low_stock', name: 'Low Stock', count: lowStock },
    { id: 'out_of_stock', name: 'Out of Stock', count: outOfStock },
  ];
});

// Computed Inventory Metrics
const totalStockValuation = computed(() => {
  return itemsList.value.reduce((s, i) => s + (i.price * i.stock), 0);
});

const totalUnitsInStock = computed(() => {
  return itemsList.value.reduce((s, i) => s + i.stock, 0);
});

const lowStockCount = computed(() => {
  return itemsList.value.filter(i => i.stock <= i.min_stock).length;
});

// Filtered List
const filteredItems = computed(() => {
  return itemsList.value.filter(item => {
    // Category filter
    if (selectedCategory.value !== 'All' && item.category !== selectedCategory.value) {
      return false;
    }

    // Stock tab filter
    if (activeFilterTab.value === 'in_stock' && item.stock <= item.min_stock) return false;
    if (activeFilterTab.value === 'low_stock' && (item.stock > item.min_stock || item.stock <= 0)) return false;
    if (activeFilterTab.value === 'out_of_stock' && item.stock > 0) return false;

    // Search query
    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
      const matchCode = item.code.toLowerCase().includes(q);
      const matchName = item.name.toLowerCase().includes(q);
      const matchTa = item.name_ta && item.name_ta.toLowerCase().includes(q);
      const matchHsn = item.hsn.includes(q);
      const matchBarcode = item.barcode && item.barcode.includes(q);
      if (!matchCode && !matchName && !matchTa && !matchHsn && !matchBarcode) return false;
    }

    return true;
  });
});

// Drawer Operations (SCR-C2)
function openAddProductDrawer() {
  editingItem.value = null;
  formItem.value = {
    code: 'ITEM-' + Math.floor(1000 + Math.random() * 9000),
    name: '',
    name_ta: '',
    category: 'Medicines',
    hsn: '300490',
    gst_rate: 12,
    price: 0,
    mrp: 0,
    cost: 0,
    unit: 'Strip',
    stock: 50,
    min_stock: 10,
    barcode: '',
    status: 'Active'
  };
  showProductDrawer.value = true;
}

function openEditProductDrawer(item: ProductItem) {
  editingItem.value = item;
  formItem.value = { ...item };
  showProductDrawer.value = true;
}

function saveProduct() {
  if (!formItem.value.name) return;

  if (editingItem.value) {
    const idx = itemsList.value.findIndex(i => i.code === editingItem.value!.code);
    if (idx !== -1) {
      itemsList.value[idx] = { ...formItem.value };
    }
  } else {
    itemsList.value.unshift({ ...formItem.value });
  }

  showProductDrawer.value = false;
}

function deleteItem(item: ProductItem) {
  if (confirm(`Deactivate product ${item.name}?`)) {
    item.status = 'Inactive';
  }
}

function generateEan13() {
  formItem.value.barcode = '890' + Math.floor(100000000 + Math.random() * 900000000);
}

function calculateMargin(item: ProductItem): number {
  if (!item.cost || !item.price) return 0;
  return Math.round(((item.price - item.cost) / item.price) * 100);
}

function calculateFormMargin(): number {
  if (!formItem.value.cost || !formItem.value.price) return 0;
  return Math.round(((formItem.value.price - formItem.value.cost) / formItem.value.price) * 100);
}

function printSingleBarcode(item: ProductItem) {
  alert(`Printing barcode label for ${item.name} (${item.barcode})...`);
}

function printLabels() {
  alert('Sending label sheet to thermal label printer...');
  showLabelModal.value = false;
}

function triggerImportModal() {
  alert('Excel & CSV Catalog Importer (SCR-C3): Upload spreadsheet to bulk-import items.');
}

function formatMoney(amount: number | undefined): string {
  if (amount === undefined || isNaN(amount)) return '0.00';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    showProductDrawer.value = false;
    showLabelModal.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
