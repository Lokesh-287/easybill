<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top Financial KPI Cards Section (Behance Finance Standard) -->
    <div class="p-6 pb-2">
      <!-- Title & Quick Actions Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
            Customers & Vendors
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Manage customer credit, supplier payables, GSTIN details, and ledger statements
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Export CSV Button -->
          <button
            @click="exportPartiesCSV"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-card flex items-center space-x-1.5 transition"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <!-- Add Party Button (SCR-D2) -->
          <button
            @click="openAddPartyDrawer"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <Plus class="w-4 h-4" />
            <span>Add Party</span>
          </button>
        </div>
      </div>

      <!-- 4 Financial KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Receivables (To Receive) -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">To Receive (Credit)</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
            ₹{{ formatMoney(kpiTotals.toReceive) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ customersWithBalanceCount }} customers
            </span>
            <span class="text-slate-400">outstanding dues</span>
          </div>
        </div>

        <!-- Card 2: Total Payables (To Pay) -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">To Pay (Vendors)</span>
            <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-rose-700">
            ₹{{ formatMoney(kpiTotals.toPay) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md font-tabular">
              {{ suppliersWithBalanceCount }} suppliers
            </span>
            <span class="text-slate-400">pending payment</span>
          </div>
        </div>

        <!-- Card 3: Total Customers -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Total Customers</span>
            <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Users class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            {{ totalCustomersCount }} Accounts
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded-md">
              {{ b2bCustomersCount }} B2B (GST)
            </span>
            <span class="text-slate-400">regular buyers</span>
          </div>
        </div>

        <!-- Card 4: Verified Suppliers -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Suppliers (Vendors)</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            {{ totalSuppliersCount }} Vendors
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md">
              100% Verified
            </span>
            <span class="text-slate-400">GSTIN active</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar & Master Data Table -->
    <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 pt-3">
      <div class="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col overflow-hidden">
        <!-- Status Tabs & Filter Toolbar -->
        <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <!-- Party Type Tabs -->
          <div class="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              v-for="tab in partyTabs"
              :key="tab.id"
              @click="activePartyTab = tab.id"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5',
                activePartyTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <span>{{ tab.name }}</span>
              <span
                :class="[
                  'text-[10px] px-1.5 py-0.2 rounded-full font-tabular',
                  activePartyTab === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Search & City Filters -->
          <div class="flex items-center space-x-2.5">
            <!-- Search Input -->
            <div class="relative w-56 lg:w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search name, phone, GSTIN..."
                class="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              />
            </div>

            <!-- City Dropdown Filter -->
            <select
              v-model="selectedCity"
              class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="All">All Cities</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruppur">Tiruppur</option>
              <option value="Erode">Erode</option>
              <option value="Chennai">Chennai</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        <!-- Master Parties Data Table -->
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-slate-50/90 backdrop-blur-xs text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 z-10">
              <tr>
                <th class="py-3 px-4 w-10">
                  <input type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                </th>
                <th class="py-3 px-4">Party Name</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Contact Phone</th>
                <th class="py-3 px-4">City & State</th>
                <th class="py-3 px-4">GSTIN</th>
                <th class="py-3 px-4 text-right">Credit Limit</th>
                <th class="py-3 px-4 text-right">Balance</th>
                <th class="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 text-xs">
              <tr
                v-for="party in filteredParties"
                :key="party.id"
                @click="openPartyDetailDrawer(party)"
                class="hover:bg-primary-50/40 cursor-pointer transition group"
              >
                <!-- Checkbox -->
                <td class="py-3.5 px-4" @click.stop>
                  <input type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                </td>

                <!-- Party Name & Avatar -->
                <td class="py-3.5 px-4">
                  <div class="flex items-center space-x-2.5">
                    <div
                      :class="[
                        'w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0',
                        party.type === 'Customer'
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-indigo-100 text-indigo-700'
                      ]"
                    >
                      {{ getInitials(party.name) }}
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-slate-900 group-hover:text-primary-600 transition truncate max-w-[170px]">
                        {{ party.name }}
                      </div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ party.id }}</div>
                    </div>
                  </div>
                </td>

                <!-- Type Badge -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border',
                      party.type === 'Customer'
                        ? 'bg-sky-50 text-sky-700 border-sky-200/70'
                        : 'bg-purple-50 text-purple-700 border-purple-200/70'
                    ]"
                  >
                    {{ party.type }}
                  </span>
                </td>

                <!-- Contact Phone -->
                <td class="py-3.5 px-4 whitespace-nowrap font-medium text-slate-600">
                  <div class="flex items-center space-x-1.5">
                    <Phone class="w-3 h-3 text-slate-400" />
                    <span>{{ party.phone || 'No phone' }}</span>
                  </div>
                </td>

                <!-- City & State -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="font-semibold text-slate-900 text-xs">{{ party.city }}</div>
                  <div class="text-[10px] text-slate-400">{{ party.state }}</div>
                </td>

                <!-- GSTIN -->
                <td class="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                  <span v-if="party.gstin" class="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                    {{ party.gstin }}
                  </span>
                  <span v-else class="text-[10px] text-slate-400 font-sans">Unregistered</span>
                </td>

                <!-- Credit Limit -->
                <td class="py-3.5 px-4 text-right font-tabular text-slate-600 whitespace-nowrap">
                  <span v-if="party.credit_limit > 0">₹{{ formatMoney(party.credit_limit) }}</span>
                  <span v-else class="text-slate-400">—</span>
                </td>

                <!-- Balance Status -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div
                    v-if="party.balance > 0"
                    :class="[
                      'font-bold font-tabular text-xs flex items-center justify-end space-x-1',
                      party.balance_type === 'To Receive' ? 'text-emerald-700' : 'text-rose-700'
                    ]"
                  >
                    <span>₹{{ formatMoney(party.balance) }}</span>
                    <span
                      :class="[
                        'text-[9px] px-1 py-0.2 rounded font-sans uppercase font-bold',
                        party.balance_type === 'To Receive' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      ]"
                    >
                      {{ party.balance_type === 'To Receive' ? 'Dr' : 'Cr' }}
                    </span>
                  </div>
                  <div v-else class="font-tabular text-slate-400 text-xs">
                    ₹0.00
                  </div>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-center" @click.stop>
                  <div class="flex items-center justify-center space-x-1">
                    <button
                      v-if="party.phone"
                      @click="sendWhatsAppReminder(party)"
                      title="Send WhatsApp Balance Reminder"
                      class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    >
                      <Share2 class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="openEditPartyDrawer(party)"
                      title="Edit Party Master"
                      class="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                    >
                      <Edit3 class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="openPartyDetailDrawer(party)"
                      title="View Khata Ledger"
                      class="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
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
            v-if="filteredParties.length === 0"
            class="py-16 flex flex-col items-center justify-center text-center"
          >
            <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <Users class="w-6 h-6 text-slate-300" />
            </div>
            <h4 class="text-sm font-bold text-slate-700">No parties match your filter</h4>
            <p class="text-xs text-slate-400 mt-1">Try clearing search filters or add a new party</p>
          </div>
        </div>

        <!-- Table Footer Pagination -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span class="font-bold text-slate-800">{{ filteredParties.length }}</span> of <span class="font-bold text-slate-800">{{ partiesList.length }}</span> parties
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
    <!-- SLIDE-OVER DRAWER 1: Party Master (SCR-D2) -->
    <!-- ========================================== -->
    <div
      v-if="showPartyFormDrawer"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
      @click.self="showPartyFormDrawer = false"
    >
      <div class="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <!-- Drawer Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <UserPlus class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">
                {{ editingParty ? `Edit Party: ${editingParty.name}` : 'Add Customer / Vendor (SCR-D2)' }}
              </div>
              <div class="text-[10px] text-slate-400">GST-ready party master with credit limit & state verification</div>
            </div>
          </div>
          <button @click="showPartyFormDrawer = false" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Drawer Form Body -->
        <form @submit.prevent="saveParty" class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Section 1: Type & Name -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Party Classification</div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <label
                :class="[
                  'p-3 rounded-xl border cursor-pointer transition flex items-center space-x-2.5',
                  formParty.type === 'Customer'
                    ? 'border-primary-500 bg-primary-50/40 text-primary-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                ]"
              >
                <input type="radio" v-model="formParty.type" value="Customer" class="sr-only" />
                <Users class="w-4 h-4 text-primary-600" />
                <span class="text-xs">Customer (Buyer)</span>
              </label>

              <label
                :class="[
                  'p-3 rounded-xl border cursor-pointer transition flex items-center space-x-2.5',
                  formParty.type === 'Supplier'
                    ? 'border-indigo-500 bg-indigo-50/40 text-indigo-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                ]"
              >
                <input type="radio" v-model="formParty.type" value="Supplier" class="sr-only" />
                <Building2 class="w-4 h-4 text-indigo-600" />
                <span class="text-xs">Supplier (Vendor)</span>
              </label>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Business / Full Name *</label>
                <input
                  v-model="formParty.name"
                  required
                  type="text"
                  placeholder="e.g. Priya Traders"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                <input
                  v-model="formParty.phone"
                  required
                  type="tel"
                  placeholder="e.g. 9443211223"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>

          <!-- Section 2: Taxation & State -->
          <div class="pt-2 border-t border-slate-100">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">GST Compliance</div>
            <div class="space-y-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">GSTIN (15-Digit GST Number)</label>
                <input
                  v-model="formParty.gstin"
                  @input="handleGstinInput"
                  type="text"
                  placeholder="e.g. 33AABCP1234F1Z1"
                  maxlength="15"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">State (Determines Tax)</label>
                  <select
                    v-model="formParty.state"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Tamil Nadu (33)">Tamil Nadu (33)</option>
                    <option value="Karnataka (29)">Karnataka (29)</option>
                    <option value="Kerala (32)">Kerala (32)</option>
                    <option value="Andhra Pradesh (37)">Andhra Pradesh (37)</option>
                    <option value="Maharashtra (27)">Maharashtra (27)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-1">City / Town</label>
                  <input
                    v-model="formParty.city"
                    type="text"
                    placeholder="e.g. Coimbatore"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Credit Terms & Balance -->
          <div class="pt-2 border-t border-slate-100">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Credit Terms & Opening Khata</div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Credit Limit (₹)</label>
                <input
                  v-model.number="formParty.credit_limit"
                  type="number"
                  placeholder="25000"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Opening Balance (₹)</label>
                <input
                  v-model.number="formParty.balance"
                  type="number"
                  placeholder="0.00"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>
        </form>

        <!-- Drawer Footer Buttons -->
        <div class="p-4 border-t border-slate-100 bg-white flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="showPartyFormDrawer = false"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveParty"
            class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 transition"
          >
            {{ editingParty ? 'Save Changes' : 'Create Party' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- SLIDE-OVER DRAWER 2: Party Detail (SCR-D3) -->
    <!-- ========================================== -->
    <div
      v-if="selectedParty"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
      @click.self="selectedParty = null"
    >
      <div class="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <!-- Drawer Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center space-x-2.5">
            <div
              :class="[
                'w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center',
                selectedParty.type === 'Customer' ? 'bg-primary-100 text-primary-700' : 'bg-indigo-100 text-indigo-700'
              ]"
            >
              {{ getInitials(selectedParty.name) }}
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">{{ selectedParty.name }}</div>
              <div class="text-[10px] text-slate-400">{{ selectedParty.phone }} • {{ selectedParty.city }}</div>
            </div>
          </div>
          <button @click="selectedParty = null" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Drawer Content Body -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Balance Summary Card -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div class="text-[10px] font-semibold text-slate-400 uppercase">
                {{ selectedParty.type === 'Customer' ? 'Customer Outstanding' : 'Payable to Vendor' }}
              </div>
              <div
                :class="[
                  'text-xl font-extrabold font-tabular mt-0.5',
                  selectedParty.balance_type === 'To Receive' ? 'text-emerald-700' : selectedParty.balance > 0 ? 'text-rose-700' : 'text-slate-900'
                ]"
              >
                ₹{{ formatMoney(selectedParty.balance) }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-[10px] font-semibold text-slate-400 uppercase">Credit Limit</div>
              <div class="text-xs font-bold text-slate-800 font-tabular mt-0.5">
                ₹{{ formatMoney(selectedParty.credit_limit) }}
              </div>
            </div>
          </div>

          <!-- GSTIN Info Card -->
          <div class="p-3 rounded-xl bg-white border border-slate-200/80 text-xs space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-500">GSTIN:</span>
              <span class="font-mono font-bold text-slate-800">{{ selectedParty.gstin || 'Unregistered B2C' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Place of Supply:</span>
              <span class="font-medium text-slate-800">{{ selectedParty.state }}</span>
            </div>
          </div>

          <!-- Khata Ledger Transactions List -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Khata Statement (Recent)</div>
            <div class="rounded-xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 text-xs">
              <div class="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <div class="font-bold text-slate-900">Bill #INV-2026-0040</div>
                  <div class="text-[10px] text-slate-400">15 Nov 2026 • 2 items (Medical)</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-slate-900 font-tabular">+₹4,704.00</div>
                  <div class="text-[10px] text-amber-600 font-semibold">Unpaid</div>
                </div>
              </div>

              <div class="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <div class="font-bold text-slate-900">Payment Received (UPI)</div>
                  <div class="text-[10px] text-slate-400">01 Nov 2026 • Ref: UPI-984421</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-emerald-600 font-tabular">-₹5,000.00</div>
                  <div class="text-[10px] text-emerald-600 font-semibold">Settled</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Footer Quick Actions -->
        <div class="p-4 border-t border-slate-100 bg-white flex items-center space-x-2">
          <button
            @click="sendWhatsAppReminder(selectedParty)"
            class="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center space-x-1.5 transition"
          >
            <Share2 class="w-3.5 h-3.5" />
            <span>WhatsApp Reminder</span>
          </button>

          <router-link
            to="/bill/new"
            class="flex-1 py-2.5 px-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition"
          >
            <Receipt class="w-3.5 h-3.5" />
            <span>Create Bill</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useToast } from '../../services/toast';
import {
  Users,
  Building2,
  Plus,
  Search,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  Edit3,
  Share2,
  ArrowRight,
  UserPlus,
  Receipt,
  X
} from '@lucide/vue';

// Types
interface Party {
  id: string;
  name: string;
  type: 'Customer' | 'Supplier';
  phone: string;
  city: string;
  state: string;
  gstin: string;
  balance: number;
  credit_limit: number;
  balance_type: 'To Receive' | 'To Pay' | 'None';
  status: 'Active' | 'Inactive';
}

// State
const toast = useToast();
const searchQuery = ref('');
const selectedCity = ref('All');
const activePartyTab = ref('all');
const showPartyFormDrawer = ref(false);
const selectedParty = ref<Party | null>(null);
const editingParty = ref<Party | null>(null);

// Form Party
const formParty = ref<Party>({
  id: '',
  name: '',
  type: 'Customer',
  phone: '',
  city: 'Coimbatore',
  state: 'Tamil Nadu (33)',
  gstin: '',
  balance: 0,
  credit_limit: 25000,
  balance_type: 'None',
  status: 'Active'
});

// Parties List
const partiesList = ref<Party[]>([
  {
    id: 'CUST-001',
    name: 'Walk-in Customer',
    type: 'Customer',
    phone: '',
    city: 'Coimbatore',
    state: 'Tamil Nadu (33)',
    gstin: '',
    balance: 0.00,
    credit_limit: 0.00,
    balance_type: 'None',
    status: 'Active'
  },
  {
    id: 'CUST-002',
    name: 'Ramesh Kumar (Retail)',
    type: 'Customer',
    phone: '9842109876',
    city: 'Coimbatore',
    state: 'Tamil Nadu (33)',
    gstin: '',
    balance: 0.00,
    credit_limit: 5000.00,
    balance_type: 'None',
    status: 'Active'
  },
  {
    id: 'CUST-003',
    name: 'Priya Traders',
    type: 'Customer',
    phone: '9443211223',
    city: 'Tiruppur',
    state: 'Tamil Nadu (33)',
    gstin: '33AABCP1234F1Z1',
    balance: 4704.00,
    credit_limit: 25000.00,
    balance_type: 'To Receive',
    status: 'Active'
  },
  {
    id: 'CUST-004',
    name: 'Kumar Medicals',
    type: 'Customer',
    phone: '9789123456',
    city: 'Erode',
    state: 'Tamil Nadu (33)',
    gstin: '33AABCK9988G1Z2',
    balance: 0.00,
    credit_limit: 50000.00,
    balance_type: 'None',
    status: 'Active'
  },
  {
    id: 'CUST-005',
    name: 'Anand Sundaram',
    type: 'Customer',
    phone: '9840011223',
    city: 'Coimbatore',
    state: 'Tamil Nadu (33)',
    gstin: '',
    balance: 2352.00,
    credit_limit: 10000.00,
    balance_type: 'To Receive',
    status: 'Active'
  },
  {
    id: 'SUPP-001',
    name: 'Apex Pharma Distributors',
    type: 'Supplier',
    phone: '9820098200',
    city: 'Chennai',
    state: 'Tamil Nadu (33)',
    gstin: '33AAACA1122H1Z5',
    balance: 18450.00,
    credit_limit: 100000.00,
    balance_type: 'To Pay',
    status: 'Active'
  },
  {
    id: 'SUPP-002',
    name: 'Kovai Healthcare Supplies',
    type: 'Supplier',
    phone: '9443355667',
    city: 'Coimbatore',
    state: 'Tamil Nadu (33)',
    gstin: '33AABCK5544J1Z8',
    balance: 3950.00,
    credit_limit: 50000.00,
    balance_type: 'To Pay',
    status: 'Active'
  },
  {
    id: 'SUPP-003',
    name: 'Micro Hygiene Surgicals',
    type: 'Supplier',
    phone: '9789098711',
    city: 'Bengaluru',
    state: 'Karnataka (29)',
    gstin: '29AABCM8899K1Z4',
    balance: 0.00,
    credit_limit: 75000.00,
    balance_type: 'None',
    status: 'Active'
  }
]);

// Filter Tabs
const partyTabs = computed(() => {
  const all = partiesList.value.length;
  const cust = partiesList.value.filter(p => p.type === 'Customer').length;
  const supp = partiesList.value.filter(p => p.type === 'Supplier').length;
  const balance = partiesList.value.filter(p => p.balance > 0).length;

  return [
    { id: 'all', name: 'All Parties', count: all },
    { id: 'customers', name: 'Customers', count: cust },
    { id: 'suppliers', name: 'Suppliers', count: supp },
    { id: 'balance', name: 'With Balance', count: balance },
  ];
});

// Computed KPIs
const kpiTotals = computed(() => {
  const toReceive = partiesList.value
    .filter(p => p.type === 'Customer' && p.balance > 0)
    .reduce((s, p) => s + p.balance, 0);

  const toPay = partiesList.value
    .filter(p => p.type === 'Supplier' && p.balance > 0)
    .reduce((s, p) => s + p.balance, 0);

  return { toReceive, toPay };
});

const customersWithBalanceCount = computed(() => {
  return partiesList.value.filter(p => p.type === 'Customer' && p.balance > 0).length;
});

const suppliersWithBalanceCount = computed(() => {
  return partiesList.value.filter(p => p.type === 'Supplier' && p.balance > 0).length;
});

const totalCustomersCount = computed(() => {
  return partiesList.value.filter(p => p.type === 'Customer').length;
});

const b2bCustomersCount = computed(() => {
  return partiesList.value.filter(p => p.type === 'Customer' && p.gstin).length;
});

const totalSuppliersCount = computed(() => {
  return partiesList.value.filter(p => p.type === 'Supplier').length;
});

// Filtered List
const filteredParties = computed(() => {
  return partiesList.value.filter(p => {
    // Tab filter
    if (activePartyTab.value === 'customers' && p.type !== 'Customer') return false;
    if (activePartyTab.value === 'suppliers' && p.type !== 'Supplier') return false;
    if (activePartyTab.value === 'balance' && p.balance <= 0) return false;

    // City filter
    if (selectedCity.value !== 'All' && p.city !== selectedCity.value) return false;

    // Search query
    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
      const matchName = p.name.toLowerCase().includes(q);
      const matchPhone = p.phone.includes(q);
      const matchGstin = p.gstin.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchGstin && !matchCity) return false;
    }

    return true;
  });
});

// Drawer Operations
function openAddPartyDrawer() {
  editingParty.value = null;
  formParty.value = {
    id: 'PARTY-' + Math.floor(1000 + Math.random() * 9000),
    name: '',
    type: 'Customer',
    phone: '',
    city: 'Coimbatore',
    state: 'Tamil Nadu (33)',
    gstin: '',
    balance: 0,
    credit_limit: 25000,
    balance_type: 'None',
    status: 'Active'
  };
  showPartyFormDrawer.value = true;
}

function openEditPartyDrawer(party: Party) {
  editingParty.value = party;
  formParty.value = { ...party };
  showPartyFormDrawer.value = true;
}

function openPartyDetailDrawer(party: Party) {
  selectedParty.value = party;
}

function saveParty() {
  if (!formParty.value.name.trim()) {
    toast.error('Please enter party name');
    return;
  }
  const cleanPhone = (formParty.value.phone || '').replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    toast.error('Please enter a valid 10-digit mobile number');
    return;
  }
  formParty.value.phone = cleanPhone;

  // Validate GSTIN if entered
  const gstin = (formParty.value.gstin || '').trim().toUpperCase();
  if (gstin) {
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinPattern.test(gstin)) {
      toast.error('Invalid GSTIN format. Expected 15 characters (e.g. 33AAAAA0000A1Z5)');
      return;
    }
    formParty.value.gstin = gstin;
  }

  // Ensure balance & credit limit are non-NaN numbers
  formParty.value.balance = Number(formParty.value.balance) || 0;
  formParty.value.credit_limit = Number(formParty.value.credit_limit) || 0;

  if (editingParty.value) {
    const idx = partiesList.value.findIndex(p => p.id === editingParty.value!.id);
    if (idx !== -1) {
      partiesList.value[idx] = { ...formParty.value };
    }
    toast.success(`Party "${formParty.value.name}" updated successfully`);
  } else {
    partiesList.value.unshift({ ...formParty.value });
    toast.success(`New party "${formParty.value.name}" created`);
  }

  showPartyFormDrawer.value = false;
}

function handleGstinInput() {
  formParty.value.gstin = (formParty.value.gstin || '').trim().toUpperCase();
  const g = formParty.value.gstin;
  if (g.length >= 2) {
    const code = g.slice(0, 2);
    if (code === '33') formParty.value.state = 'Tamil Nadu (33)';
    else if (code === '29') formParty.value.state = 'Karnataka (29)';
    else if (code === '32') formParty.value.state = 'Kerala (32)';
    else if (code === '37') formParty.value.state = 'Andhra Pradesh (37)';
    else if (code === '27') formParty.value.state = 'Maharashtra (27)';
  }
}

function sendWhatsAppReminder(party: Party) {
  const text = `Hello ${party.name}, gentle reminder from EasyBill Store: your outstanding balance is ₹${formatMoney(party.balance)}. Please make the payment at your earliest convenience. Thank you!`;
  window.open(`https://wa.me/91${party.phone}?text=${encodeURIComponent(text)}`, '_blank');
}

function exportPartiesCSV() {
  const headers = ['Party ID,Name,Type,Phone,City,State,GSTIN,Credit Limit,Balance\n'];
  const rows = partiesList.value.map(p =>
    `"${p.id}","${p.name}","${p.type}","${p.phone}","${p.city}","${p.state}","${p.gstin}",${p.credit_limit},${p.balance}\n`
  );
  const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `EasyBill_Parties_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function getInitials(name: string): string {
  if (!name) return 'P';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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
    showPartyFormDrawer.value = false;
    selectedParty.value = null;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
