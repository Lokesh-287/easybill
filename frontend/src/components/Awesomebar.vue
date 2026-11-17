<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150"
    @click.self="close"
  >
    <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]">
      <!-- Search Input Header -->
      <div class="p-3.5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
        <Search class="w-5 h-5 text-primary-600 flex-shrink-0" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          placeholder="Search screens, actions, items, customers (Ctrl+K)..."
          class="flex-1 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="selectCurrent"
          @keydown.esc="close"
        />
        <kbd class="px-2 py-0.5 text-[10px] bg-slate-200 border border-slate-300 text-slate-600 rounded font-mono font-bold">
          ESC
        </kbd>
      </div>

      <!-- Results Body -->
      <div class="flex-1 overflow-y-auto p-2 space-y-4">
        <!-- Empty State -->
        <div v-if="filteredGroups.length === 0" class="py-12 text-center text-slate-400 text-xs">
          No matches found for "<span class="font-bold text-slate-600">{{ query }}</span>"
        </div>

        <!-- Groups -->
        <div v-for="group in filteredGroups" :key="group.title" class="space-y-1">
          <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{{ group.title }}</span>
            <span class="text-[9px] font-mono text-slate-400 font-normal">{{ group.items.length }}</span>
          </div>

          <div
            v-for="(item, idx) in group.items"
            :key="item.id"
            @click="executeItem(item)"
            @mouseenter="selectedIndex = item.globalIndex"
            :class="[
              'px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition',
              selectedIndex === item.globalIndex
                ? 'bg-primary-600 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            ]"
          >
            <div class="flex items-center space-x-2.5 min-w-0">
              <component
                :is="item.icon"
                :class="[
                  'w-4 h-4 flex-shrink-0',
                  selectedIndex === item.globalIndex ? 'text-white' : 'text-slate-400'
                ]"
              />
              <span class="truncate">{{ item.label }}</span>
              <span
                v-if="item.subtitle"
                :class="[
                  'text-[10px] font-normal truncate',
                  selectedIndex === item.globalIndex ? 'text-white/80' : 'text-slate-400'
                ]"
              >
                — {{ item.subtitle }}
              </span>
            </div>

            <div class="flex items-center space-x-1.5 flex-shrink-0 ml-2">
              <kbd
                v-if="item.shortcut"
                :class="[
                  'px-1.5 py-0.5 text-[9px] rounded font-mono font-bold',
                  selectedIndex === item.globalIndex
                    ? 'bg-primary-700 text-white'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                ]"
              >
                {{ item.shortcut }}
              </kbd>
              <ArrowRight
                v-if="selectedIndex === item.globalIndex"
                class="w-3.5 h-3.5 text-white animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bar -->
      <div class="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400">
        <div class="flex items-center space-x-2">
          <span>Navigate <kbd class="px-1 bg-white border border-slate-300 rounded font-mono text-[9px]">↑</kbd> <kbd class="px-1 bg-white border border-slate-300 rounded font-mono text-[9px]">↓</kbd></span>
          <span>•</span>
          <span>Select <kbd class="px-1 bg-white border border-slate-300 rounded font-mono text-[9px]">↵</kbd></span>
        </div>
        <div class="text-[10px] font-mono text-slate-500">
          EasyBill Awesomebar (Ctrl+K)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../services/toast';
import { clearAllDocumentData, loadDemoData } from '../stores/documentStore';
import {
  Search,
  Receipt,
  FileText,
  ShoppingBag,
  Package,
  Boxes,
  Banknote,
  ShieldCheck,
  BarChart3,
  Settings,
  Users,
  Plus,
  ArrowRight,
  Printer,
  MinusCircle,
  SlidersHorizontal,
  Lock,
  Compass,
  Crown,
  CalendarClock,
  Cpu,
  Truck,
  SendHorizontal,
  ClipboardCheck,
  ArrowLeftRight,
  Trash2,
  RefreshCw
} from '@lucide/vue';

const router = useRouter();
const toast = useToast();

const isOpen = ref(false);
const query = ref('');
const selectedIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

// Static command registry
const commandGroups = [
  {
    title: 'Navigation & Screens',
    items: [
      { id: 'nav-owner', label: 'Store Owner Live Companion', subtitle: 'Mobile revenue, KPIs & Khata', icon: Crown, route: '/mobile/owner' },
      { id: 'nav-pos', label: 'Rapid Billing POS', subtitle: 'New bill terminal', icon: Receipt, route: '/bill/new', shortcut: 'F8' },
      { id: 'nav-sales', label: 'Invoices & Sales', subtitle: 'View billing history', icon: FileText, route: '/sales' },
      { id: 'nav-purchase', label: 'Purchases & Inward', subtitle: 'Vendor invoices & stock in', icon: ShoppingBag, route: '/purchase' },
      { id: 'nav-items', label: 'Item Master Catalog', subtitle: 'Manage prices & HSN', icon: Package, route: '/items' },
      { id: 'nav-parties', label: 'Customers & Vendors', subtitle: 'Khata ledger & credit', icon: Users, route: '/parties' },
      { id: 'nav-stock', label: 'Stock Summary & Valuation', subtitle: 'Inventory counts & FIFO', icon: Boxes, route: '/stock' },
      { id: 'nav-batches', label: 'Batch & Expiry (FEFO)', subtitle: 'Medicine lots & shelf life', icon: CalendarClock, route: '/stock?tab=batches' },
      { id: 'nav-serials', label: 'Serial & IMEI Tracker', subtitle: 'Electronic devices & warranty', icon: Cpu, route: '/stock?tab=serials' },
      { id: 'nav-grn', label: 'Goods Receipt Note (GRN)', subtitle: 'Gate inward & PO verification', icon: Truck, route: '/stock?tab=grn' },
      { id: 'nav-challan', label: 'Delivery Challans', subtitle: 'Outward dispatch & transport note', icon: SendHorizontal, route: '/stock?tab=challan' },
      { id: 'nav-audit', label: 'Physical Stock Audit', subtitle: 'Reconciliation & variance sheet', icon: ClipboardCheck, route: '/stock?tab=audit' },
      { id: 'nav-cash', label: 'Day Book & Cash Drawer', subtitle: 'Shift float & reconciliation', icon: Banknote, route: '/cash' },
      { id: 'nav-gst', label: 'GST Compliance Hub', subtitle: 'GSTR-1, 3B returns', icon: ShieldCheck, route: '/gst' },
      { id: 'nav-reports', label: 'Analytics & P&L Statement', subtitle: 'Financial reports', icon: BarChart3, route: '/reports' },
      { id: 'nav-settings', label: 'Settings & Hardware', subtitle: 'Printer & store profile', icon: Settings, route: '/settings' },
      { id: 'nav-login', label: 'Fast PIN Pad Unlock', subtitle: 'Switch cashier shift', icon: Lock, route: '/login' },
    ]
  },
  {
    title: 'Quick POS Actions',
    items: [
      { id: 'act-new-bill', label: 'Start New Bill', subtitle: 'Clear and open POS', icon: Plus, route: '/bill/new', shortcut: 'F8' },
      { id: 'act-add-cust', label: 'Add New Customer', subtitle: 'Register Khata client', icon: Users, route: '/parties' },
      { id: 'act-add-prod', label: 'Quick Add Product', subtitle: 'Insert into catalog', icon: Package, route: '/items' },
      { id: 'act-new-purch', label: 'New Purchase Bill', subtitle: 'Inward vendor stock', icon: ShoppingBag, route: '/purchase/new' },
      { id: 'act-expense', label: 'Record Petty Cash Expense', subtitle: 'Disburse tea/transport', icon: MinusCircle, route: '/cash' },
      { id: 'act-reconcile', label: 'Reconcile Stock Count', subtitle: 'Audit warehouse inventory', icon: SlidersHorizontal, route: '/stock?tab=audit' },
      { id: 'act-transfer', label: 'Inter-Godown Transfer', subtitle: 'Move items between godowns', icon: ArrowLeftRight, route: '/stock?action=transfer' },
      { id: 'act-new-batch', label: 'Inward New Batch (FEFO)', subtitle: 'Record batch no & expiry', icon: CalendarClock, route: '/stock?tab=batches&action=new_batch' },
      { id: 'act-register-serial', label: 'Register Serial / IMEI', subtitle: 'Barcode scan serial list', icon: Cpu, route: '/stock?tab=serials&action=new_serial' },
      { id: 'act-new-grn', label: 'Create Goods Receipt Note', subtitle: 'Record inward truck shipment', icon: Truck, route: '/stock?tab=grn&action=new_grn' },
      { id: 'act-new-challan', label: 'Issue Delivery Challan', subtitle: 'Generate dispatch note', icon: SendHorizontal, route: '/stock?tab=challan&action=new_challan' },
      { id: 'act-close-day', label: 'Shift / Day Close Register', subtitle: 'Lock cash counter', icon: Lock, route: '/cash' },
      { id: 'act-test-print', label: 'Test Print 80mm Slip', subtitle: 'Trigger thermal printer', icon: Printer, action: () => testPrint() },
      { id: 'act-clear-data', label: 'Clear All Document Data (Reset for Testing)', subtitle: 'Wipe all bills, purchases, stock ledger to start fresh', icon: Trash2, action: () => clearDataAction() },
      { id: 'act-load-demo', label: 'Reload Demo Dataset', subtitle: 'Restore sample invoices and bills', icon: RefreshCw, action: () => loadDemoAction() },
    ]
  },
  {
    title: 'Frequent Products & Customers',
    items: [
      { id: 'rec-p1', label: 'Paracetamol 650mg', subtitle: 'Strip • ₹35.00 • Stock: 45', icon: Package, route: '/items' },
      { id: 'rec-p2', label: 'Amoxicillin 500mg', subtitle: 'Strip • ₹72.50 • Stock: 20', icon: Package, route: '/items' },
      { id: 'rec-p3', label: 'Cetirizine 10mg', subtitle: 'Strip • ₹18.00 • Stock: 60', icon: Package, route: '/items' },
      { id: 'rec-p4', label: 'N95 Protective Mask', subtitle: 'Pcs • ₹25.00 • Stock: 120', icon: Package, route: '/items' },
      { id: 'rec-c1', label: 'Ramesh Kumar (Retail)', subtitle: 'Customer • 9842109876 • Due: ₹0', icon: Users, route: '/parties' },
      { id: 'rec-c2', label: 'Priya Traders', subtitle: 'Customer • 9443211223 • Due: ₹450', icon: Users, route: '/parties' },
      { id: 'rec-s1', label: 'MediPharma Distributors', subtitle: 'Supplier • GSTIN: 33AABCM5678H1Z4', icon: ShoppingBag, route: '/purchase' },
    ]
  }
];

// Flat list for keyboard indexing
const filteredGroups = computed(() => {
  const q = query.value.trim().toLowerCase();
  let currentIndex = 0;

  return commandGroups.map(group => {
    const matchedItems = group.items.filter(item => {
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
      );
    }).map(item => {
      return {
        ...item,
        globalIndex: currentIndex++
      };
    });

    return {
      title: group.title,
      items: matchedItems
    };
  }).filter(group => group.items.length > 0);
});

const totalItemsCount = computed(() => {
  return filteredGroups.value.reduce((acc, g) => acc + g.items.length, 0);
});

function navigateDown() {
  if (selectedIndex.value < totalItemsCount.value - 1) {
    selectedIndex.value++;
  } else {
    selectedIndex.value = 0;
  }
}

function navigateUp() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  } else {
    selectedIndex.value = totalItemsCount.value - 1;
  }
}

function selectCurrent() {
  for (const group of filteredGroups.value) {
    const match = group.items.find(i => i.globalIndex === selectedIndex.value);
    if (match) {
      executeItem(match);
      return;
    }
  }
}

function executeItem(item: any) {
  close();
  if (item.action) {
    item.action();
  } else if (item.route) {
    router.push(item.route);
  }
}

function testPrint() {
  toast.success('Thermal Printer: Test slip sent to 80mm ESC/POS printer (RP3200)');
}

function clearDataAction() {
  if (confirm('Clear all document data? All sales bills, purchases, GRNs, challans, and day book logs will be reset.')) {
    clearAllDocumentData();
    toast.success('Document Data Cleared', 'All document records wiped. Clean slate ready for manual testing.');
  }
}

function loadDemoAction() {
  loadDemoData();
  toast.success('Demo Dataset Loaded', 'Sample transactions and documents restored.');
}

function open() {
  isOpen.value = true;
  query.value = '';
  selectedIndex.value = 0;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function close() {
  isOpen.value = false;
  query.value = '';
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && (e.key?.toLowerCase() === 'k' || e.code === 'KeyK')) {
    e.preventDefault();
    if (isOpen.value) close();
    else open();
  } else if (e.key === 'F1' || e.code === 'F1') {
    e.preventDefault();
    if (isOpen.value) close();
    else open();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

defineExpose({
  open,
  close
});
</script>
