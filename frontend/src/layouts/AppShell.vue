<template>
  <div class="flex h-screen bg-slate-900 overflow-hidden font-sans select-none">
    <!-- Desktop Sleek Sidebar -->
    <aside class="hidden lg:flex lg:flex-col w-64 bg-slate-950 text-slate-300 border-r border-slate-800/80 flex-shrink-0">
      <!-- Store Branding & Logo -->
      <div class="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/60">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Receipt class="w-5 h-5" :stroke-width="2.2" />
          </div>
          <div>
            <div class="font-bold text-white text-base tracking-tight leading-none flex items-center space-x-1.5">
              <span>EasyBill</span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">POS</span>
            </div>
            <div class="text-[11px] text-slate-400 font-medium mt-1 truncate max-w-[130px]">
              Coimbatore Main
            </div>
          </div>
        </div>

        <button
          @click="toggleStoreMenu"
          title="Switch Branch / Register"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
        >
          <ChevronDown class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Section -->
      <nav class="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <!-- Group 1: Core Operations -->
        <div>
          <div class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Operations
          </div>
          <div class="space-y-1">
            <router-link
              to="/bill/new"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Receipt :class="['w-4 h-4', isActive ? 'text-white' : 'text-sky-400 group-hover:text-white']" :stroke-width="2" />
                  <span>Billing POS</span>
                </div>
                <span
                  :class="[
                    'text-[10px] px-1.5 py-0.5 rounded font-mono font-medium',
                    isActive ? 'bg-sky-700/80 text-white' : 'bg-slate-800 text-slate-400'
                  ]"
                >
                  F8
                </span>
              </a>
            </router-link>

            <router-link
              to="/sales"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <FileText :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Sales Invoices</span>
                </div>
              </a>
            </router-link>

            <router-link
              to="/purchase"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <ShoppingBag :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Purchases</span>
                </div>
              </a>
            </router-link>
          </div>
        </div>

        <!-- Group 2: Master Records -->
        <div>
          <div class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Catalog & Parties
          </div>
          <div class="space-y-1">
            <router-link
              to="/items"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Package :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Items & Barcodes</span>
                </div>
              </a>
            </router-link>

            <router-link
              to="/parties"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Users :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Customers & Vendors</span>
                </div>
              </a>
            </router-link>

            <router-link
              to="/stock"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Package :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Stock & Inventory</span>
                </div>
              </a>
            </router-link>
          </div>
        </div>

        <!-- Group 3: Finance & Reports -->
        <div>
          <div class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Finance & Tax
          </div>
          <div class="space-y-1">
            <router-link
              to="/cash"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Wallet :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Day Book & Cash</span>
                </div>
              </a>
            </router-link>

            <router-link
              to="/gst"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <ShieldCheck :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>GST Dashboard</span>
                </div>
              </a>
            </router-link>

            <router-link
              to="/reports"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <BarChart3 :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Reports & Insights</span>
                </div>
              </a>
            </router-link>

            <router-link
              to="/settings"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Settings :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']" :stroke-width="1.8" />
                  <span>Settings & Devices</span>
                </div>
              </a>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Bottom Register Status & User Card -->
      <div class="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <!-- Daily sales mini card -->
        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-2.5">
          <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Today's Counter Sales</span>
            <span class="text-emerald-400 font-bold font-tabular">28 Bills</span>
          </div>
          <div class="text-sm font-bold text-white font-tabular flex items-baseline justify-between">
            <span>₹14,820.00</span>
            <span class="text-[10px] font-normal text-slate-400">Shift #1</span>
          </div>
        </div>

        <div class="flex items-center justify-between px-1">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
              LK
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-white truncate">Lokesh (Owner)</div>
              <div class="text-[10px] text-emerald-400 flex items-center space-x-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Active Shift</span>
              </div>
            </div>
          </div>
          <button
            title="Log Out"
            class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Workspace Container -->
    <div class="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
      <!-- Top Action Bar -->
      <header class="h-14 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between flex-shrink-0 z-10 shadow-xs">
        <!-- Left: Quick Navigation / Title -->
        <div class="flex items-center space-x-3">
          <div class="font-bold text-slate-900 text-sm tracking-tight flex items-center space-x-2">
            <span>EasyBill POS</span>
            <span class="text-slate-300">/</span>
            <span class="text-slate-600 font-normal">Express Billing Terminal</span>
          </div>
        </div>

        <!-- Center: Universal Search / Command Shortcut -->
        <div class="hidden md:flex items-center w-80 lg:w-96 relative">
          <Search class="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search bills, items, customers (Press F1)..."
            class="w-full pl-9 pr-14 py-1.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
          <kbd class="absolute right-2 px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 text-slate-500 rounded font-mono shadow-xs">
            F1
          </kbd>
        </div>

        <!-- Right: Status Indicators & Quick Toggles -->
        <div class="flex items-center space-x-3">
          <!-- Printer Ready Badge -->
          <div
            title="Thermal Printer Status: Connected (TVS RP3200 80mm)"
            class="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700"
          >
            <Printer class="w-3.5 h-3.5 text-emerald-600" />
            <span class="font-mono text-[10px]">RP3200 (Ready)</span>
          </div>

          <!-- Cloud Sync Badge -->
          <div
            title="Real-time Frappe sync status: Online and synchronized"
            class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Synced</span>
          </div>

          <!-- Language Switcher Pill -->
          <button
            @click="toggleLang"
            title="Toggle Language (English / தமிழ்)"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center space-x-1"
          >
            <span class="text-sky-600 font-bold">🌐</span>
            <span>{{ currentLang === 'en' ? 'தமிழ்' : 'English' }}</span>
          </button>

          <!-- Shortcuts Dialog Trigger -->
          <button
            @click="showShortcutsModal = true"
            title="Keyboard Shortcuts Guide"
            class="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <HelpCircle class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- Main Workspace View (Current Screen) -->
      <main class="flex-1 overflow-hidden relative">
        <router-view />
      </main>
    </div>

    <!-- Keyboard Shortcuts Modal -->
    <div
      v-if="showShortcutsModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showShortcutsModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Receipt class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">POS Keyboard Shortcuts</h3>
              <p class="text-xs text-slate-500">Lightning-fast cashier controls</p>
            </div>
          </div>
          <button
            @click="showShortcutsModal = false"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="py-4 grid grid-cols-2 gap-3 text-xs">
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span class="font-medium text-slate-700">Search Item / Focus</span>
            <kbd class="px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">F2</kbd>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span class="font-medium text-slate-700">Customer Selector</span>
            <kbd class="px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">F4</kbd>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span class="font-medium text-slate-700">Save & Print Bill</span>
            <kbd class="px-2 py-1 bg-emerald-600 text-white rounded font-mono font-bold shadow-xs">F8</kbd>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span class="font-medium text-slate-700">Hold / Park Bill</span>
            <kbd class="px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">F9</kbd>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span class="font-medium text-slate-700">Add Item (Quick)</span>
            <kbd class="px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">F3</kbd>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span class="font-medium text-slate-700">Clear Search / Modal</span>
            <kbd class="px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">Esc</kbd>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button
            @click="showShortcutsModal = false"
            class="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Receipt,
  FileText,
  ShoppingBag,
  Package,
  Users,
  Wallet,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  Search,
  Printer,
  HelpCircle,
  X
} from '@lucide/vue';

const showShortcutsModal = ref(false);
const currentLang = ref<'en' | 'ta'>('en');

function toggleLang() {
  currentLang.value = currentLang.value === 'en' ? 'ta' : 'en';
}

function toggleStoreMenu() {
  // branch selector
}
</script>
