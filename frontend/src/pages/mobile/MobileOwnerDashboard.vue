<template>
  <div class="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 font-sans select-none pb-20">
    <!-- Top Mobile Header -->
    <div class="bg-slate-900 text-white p-5 pt-6 pb-6 rounded-b-3xl shadow-lg border-b border-slate-800">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-600/80 text-white flex items-center justify-center font-bold shadow-md">
            <Crown class="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div class="text-xs font-bold text-slate-200">Store Owner Companion</div>
            <div class="text-base font-extrabold text-white tracking-tight">SuperMart Hyperlocal</div>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Live Pulse -->
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
            LIVE
          </span>

          <button
            @click="refreshData"
            class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Store Vitals"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
          </button>
        </div>
      </div>

      <!-- Main Headline Revenue Card -->
      <div class="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80">
        <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Today's Total Gross Sales</span>
          <span class="text-emerald-400 font-bold flex items-center text-[11px]">
            <TrendingUp class="w-3.5 h-3.5 mr-1" />
            +14.8% vs Yesterday
          </span>
        </div>
        <div class="text-2xl sm:text-3xl font-extrabold font-tabular text-white tracking-tight mt-1">
          ₹{{ formatMoney(metrics.grossSales) }}
        </div>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/60 text-xs">
          <div>
            <span class="text-slate-400 text-[10px]">Total Bills</span>
            <div class="font-extrabold text-slate-100 font-tabular">{{ metrics.billsCount }} Invoices</div>
          </div>
          <div>
            <span class="text-slate-400 text-[10px]">Avg Bill Value</span>
            <div class="font-extrabold text-slate-100 font-tabular">₹{{ formatMoney(metrics.avgBillValue) }}</div>
          </div>
          <div>
            <span class="text-slate-400 text-[10px]">Active Shift</span>
            <div class="font-extrabold text-indigo-400 font-mono">Counter 01</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Status Pills -->
    <div class="px-4 -mt-3 grid grid-cols-2 gap-3 z-10">
      <!-- Cash Drawer Status -->
      <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cash in Drawer</div>
          <div class="text-base font-extrabold text-slate-900 font-tabular mt-0.5">₹{{ formatMoney(metrics.cashInDrawer) }}</div>
          <div class="text-[10px] text-slate-400 font-medium">Expected balance</div>
        </div>
        <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Banknote class="w-4 h-4" />
        </div>
      </div>

      <!-- UPI & Digital Payments -->
      <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">UPI / QR Digital</div>
          <div class="text-base font-extrabold text-indigo-600 font-tabular mt-0.5">₹{{ formatMoney(metrics.upiCollections) }}</div>
          <div class="text-[10px] text-slate-400 font-medium">Direct Bank Settlement</div>
        </div>
        <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <QrCode class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="p-4 space-y-5 mt-2">
      <!-- Section 1: Hourly Sales Velocity Graph -->
      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <Clock class="w-4 h-4 text-primary-600" />
            <h3 class="text-xs font-extrabold text-slate-900">Hourly Sales Velocity</h3>
          </div>
          <span class="text-[10px] font-bold text-slate-400">Peak: 11 AM - 1 PM</span>
        </div>

        <div class="h-24 flex items-end justify-between space-x-2 pt-2 px-1">
          <div v-for="h in hourlyTrend" :key="h.hour" class="flex-1 flex flex-col items-center">
            <div
              :style="{ height: `${(h.sales / maxHourlySales) * 100}%` }"
              class="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all relative group"
            >
              <div class="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded font-tabular whitespace-nowrap z-20 pointer-events-none">
                ₹{{ h.sales }}
              </div>
            </div>
            <span class="text-[9px] font-mono text-slate-400 mt-1.5">{{ h.hour }}</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Low Stock & Reorder Alerts -->
      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <AlertTriangle class="w-4 h-4 text-amber-500" />
            <h3 class="text-xs font-extrabold text-slate-900">Low Stock Alerts (Urgent Replenish)</h3>
          </div>
          <router-link to="/stock" class="text-[10px] font-bold text-primary-600 hover:underline">
            View All Stock →
          </router-link>
        </div>

        <div class="space-y-2">
          <div
            v-for="item in lowStockItems"
            :key="item.code"
            class="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs"
          >
            <div>
              <div class="font-bold text-slate-900">{{ item.name }}</div>
              <div class="text-[10px] text-slate-500 font-mono">{{ item.code }} • Reorder at {{ item.reorder }} {{ item.unit }}</div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 bg-rose-100 text-rose-700 font-extrabold font-tabular rounded-lg text-xs">
                {{ item.stock }} {{ item.unit }} left
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Customer Khata Receivables & 1-Click WhatsApp Payment Reminder -->
      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <Users class="w-4 h-4 text-emerald-600" />
            <h3 class="text-xs font-extrabold text-slate-900">Khata Credit Receivables</h3>
          </div>
          <span class="text-xs font-extrabold text-rose-600 font-tabular">
            Total Due: ₹{{ formatMoney(totalKhataDue) }}
          </span>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="cust in khataReceivables"
            :key="cust.phone"
            class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-xs text-slate-900">{{ cust.name }}</div>
              <div class="text-[10px] text-slate-400 font-mono">{{ cust.phone }} • Last bill: {{ cust.lastDate }}</div>
            </div>

            <div class="flex items-center space-x-2">
              <div class="text-right">
                <div class="text-xs font-extrabold text-rose-600 font-tabular">₹{{ formatMoney(cust.balance) }}</div>
                <div class="text-[9px] text-slate-400">overdue</div>
              </div>

              <!-- 1-Click WhatsApp Reminder -->
              <button
                @click="sendWhatsAppReminder(cust)"
                class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center space-x-1 shadow-xs transition"
                title="Send Payment Reminder via WhatsApp"
              >
                <Share2 class="w-3 h-3" />
                <span>Remind</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Fast Godown Stock Checker -->
      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <Boxes class="w-4 h-4 text-indigo-600" />
            <h3 class="text-xs font-extrabold text-slate-900">Instant Godown Stock Lookup</h3>
          </div>
        </div>

        <div class="relative mb-3">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="stockSearch"
            type="text"
            placeholder="Search medicine, FMCG item or code..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div class="space-y-2">
          <div
            v-for="stk in filteredStockLookup"
            :key="stk.code"
            class="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
          >
            <div>
              <div class="font-bold text-slate-900">{{ stk.name }}</div>
              <div class="text-[10px] text-slate-400 font-mono">{{ stk.code }} • MRP ₹{{ stk.mrp }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <div class="text-right">
                <div class="text-[10px] text-slate-400">Stores Godown</div>
                <div class="font-extrabold text-slate-800 font-tabular">{{ stk.godownQty }} {{ stk.unit }}</div>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-slate-400">Shop Shelf</div>
                <div class="font-extrabold text-emerald-700 font-tabular">{{ stk.counterQty }} {{ stk.unit }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from '../../services/toast';
import {
  Crown,
  TrendingUp,
  Banknote,
  QrCode,
  Clock,
  AlertTriangle,
  Users,
  Boxes,
  Search,
  Share2,
  RefreshCw
} from '@lucide/vue';

const toast = useToast();
const isRefreshing = ref(false);
const stockSearch = ref('');

const metrics = ref({
  grossSales: 48650.00,
  billsCount: 62,
  avgBillValue: 784.67,
  cashInDrawer: 21400.00,
  upiCollections: 24450.00,
  creditDue: 2800.00
});

const hourlyTrend = ref([
  { hour: '9AM', sales: 1200 },
  { hour: '11AM', sales: 8400 },
  { hour: '1PM', sales: 12600 },
  { hour: '3PM', sales: 5200 },
  { hour: '5PM', sales: 9800 },
  { hour: '7PM', sales: 11450 }
]);

const maxHourlySales = computed(() => {
  return Math.max(...hourlyTrend.value.map(h => h.sales), 1000);
});

const lowStockItems = ref([
  { code: 'BAB-001', name: 'Baby Gripe Water 130ml', stock: 8, reorder: 15, unit: 'Bottle' },
  { code: 'GEN-004', name: 'Hand Sanitizer 500ml', stock: 0, reorder: 20, unit: 'Bottle' },
  { code: 'MED-002', name: 'Amoxicillin 500mg Strip', stock: 20, reorder: 25, unit: 'Strip' }
]);

const khataReceivables = ref([
  { name: 'Murugan Department Stores', phone: '9842233445', balance: 1850.00, lastDate: '12 Nov 2026' },
  { name: 'Kumar Medicals', phone: '9789123456', balance: 1200.00, lastDate: '14 Nov 2026' },
  { name: 'Priya Traders', phone: '9443211223', balance: 450.00, lastDate: '15 Nov 2026' }
]);

const totalKhataDue = computed(() => {
  return khataReceivables.value.reduce((acc, c) => acc + c.balance, 0);
});

const stockLookupItems = ref([
  { code: 'MED-001', name: 'Paracetamol 650mg', mrp: 35.00, godownQty: 480, counterQty: 65, unit: 'Strip' },
  { code: 'GEN-001', name: 'N95 Protective Mask', mrp: 25.00, godownQty: 420, counterQty: 100, unit: 'Pcs' },
  { code: 'PER-001', name: 'Dettol Antiseptic 100ml', mrp: 65.00, godownQty: 95, counterQty: 20, unit: 'Bottle' },
  { code: 'BAB-002', name: 'Digital Thermometer', mrp: 160.00, godownQty: 40, counterQty: 18, unit: 'Pcs' }
]);

const filteredStockLookup = computed(() => {
  const q = stockSearch.value.trim().toLowerCase();
  if (!q) return stockLookupItems.value;
  return stockLookupItems.value.filter(i =>
    i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q)
  );
});

function formatMoney(amount: number): string {
  if (amount === undefined || amount === null) return '0.00';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function refreshData() {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    toast.success('Live store metrics synchronized with central bench.');
  }, 600);
}

function sendWhatsAppReminder(cust: any) {
  const msg = `Vanakkam ${cust.name}, this is a gentle reminder from SuperMart regarding pending Khata balance of ₹${formatMoney(cust.balance)}. You can pay via UPI to easybill@okaxis. Thank you!`;
  const url = `https://wa.me/91${cust.phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  toast.success(`WhatsApp payment reminder prepared for ${cust.name}`);
}
</script>
