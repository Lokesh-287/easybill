<template>
  <div class="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden select-none">
    <!-- Sleek Behance-Style Sidebar (Clean Light Minimalist) -->
    <aside class="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200/80 flex-shrink-0 z-20">
      <!-- Brand Header -->
      <div class="h-16 flex items-center justify-between px-5 border-b border-slate-100">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/25">
            <Receipt class="w-5 h-5" :stroke-width="2.2" />
          </div>
          <div>
            <div class="font-extrabold text-slate-900 text-base tracking-tight leading-none flex items-center space-x-1.5">
              <span>EasyBill</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200/60">
                PRO
              </span>
            </div>
            <div class="text-[11px] text-slate-400 font-medium mt-1 truncate max-w-[130px]">
              Finance & POS
            </div>
          </div>
        </div>

        <button
          @click="toggleBranchMenu"
          title="Switch Branch"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <ChevronDown class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3.5 py-4 space-y-6 overflow-y-auto">
        <!-- Section 1: Invoicing & Sales -->
        <div>
          <div class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Invoicing & POS
          </div>
          <div class="space-y-1">
            <router-link
              to="/sales"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <FileText :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="2" />
                  <span>Invoices & Bills</span>
                </div>
                <span
                  v-if="!isActive"
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-700 font-tabular"
                >
                  SCR-E2
                </span>
              </a>
            </router-link>

            <router-link
              to="/bill/new"
              v-slot="{ isActive, href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Receipt :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="2" />
                  <span>Rapid Billing POS</span>
                </div>
                <span
                  :class="[
                    'text-[10px] px-1.5 py-0.5 rounded font-mono font-bold',
                    isActive ? 'bg-primary-700 text-white' : 'bg-slate-100 text-slate-500'
                  ]"
                >
                  F8
                </span>
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <ShoppingBag :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
                  <span>Purchases (Inward)</span>
                </div>
              </a>
            </router-link>
          </div>
        </div>

        <!-- Section 2: Catalog & Master Data -->
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Package :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
                  <span>Items & Catalog</span>
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Users :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Boxes :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
                  <span>Stock Inventory</span>
                </div>
              </a>
            </router-link>
          </div>
        </div>

        <!-- Section 3: Finance & Reports -->
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Wallet :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <ShieldCheck :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
                  <span>GST Compliance</span>
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <BarChart3 :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
                  <span>Analytics & Reports</span>
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
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Settings :class="['w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600']" :stroke-width="1.8" />
                  <span>Settings & Devices</span>
                </div>
              </a>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Sidebar Bottom: Shift KPI Card & User Card -->
      <div class="p-3.5 border-t border-slate-100 bg-slate-50/60">
        <!-- Daily sales mini card -->
        <div class="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-card mb-3">
          <div class="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span class="font-medium">Today's Revenue</span>
            <span class="text-emerald-700 font-bold font-tabular bg-emerald-50 px-1.5 py-0.2 rounded-md">
              +12.8%
            </span>
          </div>
          <div class="text-base font-extrabold text-slate-900 font-tabular flex items-baseline justify-between">
            <span>₹14,820.00</span>
            <span class="text-[11px] font-medium text-slate-400">28 Bills</span>
          </div>
        </div>

        <div class="flex items-center justify-between px-1">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              LK
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-900 truncate">Lokesh (Owner)</div>
              <div class="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active Shift</span>
              </div>
            </div>
          </div>
          <button
            title="Log Out"
            class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
      <!-- Topbar Header -->
      <header class="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-10">
        <!-- Left: Breadcrumb / Active Route Title & Mobile Awesomebar Trigger -->
        <div class="flex items-center space-x-2.5">
          <button
            @click="openAwesomebar"
            class="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Search / Awesomebar (Ctrl+K)"
          >
            <Search class="w-4 h-4" />
          </button>
          <div class="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
            <span class="hidden sm:inline">Dashboard</span>
            <span class="hidden sm:inline text-slate-300">/</span>
            <span class="font-bold text-slate-900 text-sm">
              {{ currentScreenTitle }}
            </span>
          </div>
        </div>

        <!-- Center: Universal Search Input (Triggers Awesomebar) -->
        <div
          @click="openAwesomebar"
          class="hidden md:flex items-center w-80 lg:w-96 relative cursor-pointer group"
        >
          <Search class="w-4 h-4 absolute left-3.5 text-slate-400 group-hover:text-primary-600 transition" />
          <input
            type="text"
            readonly
            placeholder="Search screens, actions, items, customers (Ctrl+K)..."
            class="w-full pl-10 pr-16 py-2 bg-slate-50 group-hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 cursor-pointer focus:outline-none transition shadow-2xs"
          />
          <div class="absolute right-3 flex items-center space-x-1">
            <kbd class="px-1.5 py-0.5 text-[9px] bg-white border border-slate-200 text-slate-500 rounded font-mono shadow-2xs">
              Ctrl+K
            </kbd>
          </div>
        </div>

        <!-- Right: Actions, Badges & Toggles -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Fast Route CTA -->
          <router-link
            v-if="$route.path !== '/bill/new'"
            to="/bill/new"
            class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-primary-500/25 transition"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>New Bill (F8)</span>
          </router-link>

          <!-- Printer Status -->
          <button
            @click="connectBluetoothPrinter"
            title="Bluetooth / Thermal Printer: Click to connect portable 58mm/80mm printer"
            class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[11px] font-medium text-slate-600 transition"
          >
            <Printer class="w-3.5 h-3.5 text-emerald-600" />
            <span class="font-mono text-[10px] hidden sm:inline">{{ isBluetoothConnected ? bluetoothDeviceName : 'BT Print' }}</span>
          </button>

          <!-- Cloud Sync Badge -->
          <div
            class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="hidden sm:inline">Synced</span>
          </div>

          <!-- Language Switcher -->
          <button
            @click="toggleLang"
            class="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            🌐 {{ currentLang === 'en' ? 'தமிழ்' : 'En' }}
          </button>
        </div>
      </header>

      <!-- Main Screen View -->
      <main class="flex-1 overflow-hidden relative pb-16 lg:pb-0">
        <router-view />
      </main>

      <!-- Mobile Bottom Navigation Bar (lg:hidden) -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-around px-2 shadow-lg">
        <router-link
          to="/bill/new"
          class="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-primary-600 transition"
          :class="{ 'text-primary-600 font-extrabold': $route.path === '/bill/new' }"
        >
          <Receipt class="w-5 h-5" />
          <span class="text-[10px] mt-0.5">POS Bill</span>
        </router-link>

        <router-link
          to="/sales"
          class="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-primary-600 transition"
          :class="{ 'text-primary-600 font-extrabold': $route.path === '/sales' }"
        >
          <FileText class="w-5 h-5" />
          <span class="text-[10px] mt-0.5">Invoices</span>
        </router-link>

        <router-link
          to="/stock"
          class="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-primary-600 transition"
          :class="{ 'text-primary-600 font-extrabold': $route.path === '/stock' }"
        >
          <Boxes class="w-5 h-5" />
          <span class="text-[10px] mt-0.5">Stock</span>
        </router-link>

        <router-link
          to="/mobile/owner"
          class="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-indigo-600 transition"
          :class="{ 'text-indigo-600 font-extrabold': $route.path === '/mobile/owner' }"
        >
          <Crown class="w-5 h-5" />
          <span class="text-[10px] mt-0.5">Owner Live</span>
        </router-link>

        <button
          @click="showMobileMenu = true"
          class="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-primary-600 transition"
        >
          <Menu class="w-5 h-5" />
          <span class="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      <!-- Mobile Full Menu Slide-up Sheet -->
      <div
        v-if="showMobileMenu"
        class="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end"
        @click.self="showMobileMenu = false"
      >
        <div class="bg-white rounded-t-3xl shadow-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <Receipt class="w-5 h-5 text-primary-600" />
              <span class="font-extrabold text-sm text-slate-900">EasyBill Mobile Menu</span>
            </div>
            <button @click="showMobileMenu = false" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">✕</button>
          </div>

          <div class="grid grid-cols-2 gap-2.5 text-xs">
            <router-link
              to="/cash"
              @click="showMobileMenu = false"
              class="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-2.5 font-bold text-slate-800"
            >
              <Banknote class="w-4 h-4 text-emerald-600" />
              <span>Day Book</span>
            </router-link>

            <router-link
              to="/purchase"
              @click="showMobileMenu = false"
              class="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-2.5 font-bold text-slate-800"
            >
              <ShoppingBag class="w-4 h-4 text-amber-600" />
              <span>Purchases</span>
            </router-link>

            <router-link
              to="/items"
              @click="showMobileMenu = false"
              class="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-2.5 font-bold text-slate-800"
            >
              <Package class="w-4 h-4 text-indigo-600" />
              <span>Items Master</span>
            </router-link>

            <router-link
              to="/parties"
              @click="showMobileMenu = false"
              class="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-2.5 font-bold text-slate-800"
            >
              <Users class="w-4 h-4 text-blue-600" />
              <span>Khata Parties</span>
            </router-link>

            <router-link
              to="/gst"
              @click="showMobileMenu = false"
              class="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-2.5 font-bold text-slate-800"
            >
              <ShieldCheck class="w-4 h-4 text-indigo-600" />
              <span>GST Hub</span>
            </router-link>

            <router-link
              to="/settings"
              @click="showMobileMenu = false"
              class="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-2.5 font-bold text-slate-800"
            >
              <Settings class="w-4 h-4 text-slate-600" />
              <span>Settings</span>
            </router-link>
          </div>

          <!-- Bottom Session Actions -->
          <div class="pt-3 border-t border-slate-100 flex items-center space-x-2">
            <router-link
              to="/login"
              @click="showMobileMenu = false"
              class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center text-xs"
            >
              Lock PIN Pad
            </router-link>
            <button
              @click="connectBluetoothPrinter"
              class="flex-1 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-center text-xs border border-indigo-200 flex items-center justify-center space-x-1"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Pair Bluetooth</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Global Awesomebar Command Palette (Ctrl+K) -->
      <Awesomebar ref="awesomebarRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { OfflineSyncService } from '../services/offlineSync';
import { useToast } from '../services/toast';
import { bluetoothPrinter } from '../services/bluetoothPrinter';
import Awesomebar from '../components/Awesomebar.vue';
import {
  Receipt,
  FileText,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  Wallet,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  Search,
  Printer,
  Plus,
  Crown,
  Menu,
  Banknote
} from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const currentLang = ref<'en' | 'ta'>('en');
const awesomebarRef = ref<any>(null);

const showMobileMenu = ref(false);
const isBluetoothConnected = ref(false);
const bluetoothDeviceName = ref('BT Print');

function openAwesomebar() {
  awesomebarRef.value?.open();
}

async function connectBluetoothPrinter() {
  showMobileMenu.value = false;
  try {
    const success = await bluetoothPrinter.connect();
    if (success) {
      isBluetoothConnected.value = true;
      bluetoothDeviceName.value = bluetoothPrinter.getDeviceName();
      toast.success('Bluetooth Printer Connected', `Paired with ${bluetoothDeviceName.value} (58mm/80mm)`);
    }
  } catch (err: any) {
    if (err && err.name !== 'NotFoundError') {
      toast.error('Bluetooth Connection Error', err.message || 'Could not pair device');
    }
  }
}

const currentScreenTitle = computed(() => {
  if (route.path.startsWith('/mobile/owner')) return 'Store Owner Live Companion';
  if (route.path.startsWith('/items')) return 'Items Catalog & Inventory (SCR-C1)';
  if (route.path.startsWith('/sales')) return 'Invoices & Billing Dashboard (SCR-E2)';
  if (route.path.startsWith('/parties')) return 'Customers & Vendors (SCR-D1)';
  if (route.path.startsWith('/purchase')) return 'Purchases & Inward Stock (SCR-F1)';
  if (route.path.startsWith('/stock')) return 'Stock Summary & Movement (SCR-G1)';
  if (route.path.startsWith('/cash')) return 'Day Book & Cash Drawer (SCR-I1)';
  if (route.path.startsWith('/gst')) return 'GST Compliance Dashboard (SCR-K1)';
  if (route.path.startsWith('/reports')) return 'Business Analytics & Reports (SCR-J1)';
  if (route.path.startsWith('/settings')) return 'Settings & Hardware Configuration (SCR-B2)';
  return 'Express Billing POS Terminal (SCR-E1)';
});

function toggleLang() {
  currentLang.value = currentLang.value === 'en' ? 'ta' : 'en';
}

function toggleBranchMenu() {
  // branch switcher
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'F1' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
    e.preventDefault();
    openAwesomebar();
  } else if (e.key === 'F8') {
    e.preventDefault();
    router.push('/bill/new');
  } else if (e.key === 'F2') {
    e.preventDefault();
    toggleLang();
  } else if (e.key === 'F7') {
    e.preventDefault();
    router.push('/stock');
  } else if (e.key === 'F9') {
    e.preventDefault();
    router.push('/cash');
  } else if (e.key === 'F10') {
    e.preventDefault();
    router.push('/gst');
  } else if (e.key === 'F12') {
    e.preventDefault();
    router.push('/settings');
  }
}

onMounted(() => {
  OfflineSyncService.init();
  window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>
