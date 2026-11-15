<template>
  <div class="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100">
    <!-- LEFT PANE: Catalog & Search -->
    <div class="lg:w-7/12 flex flex-col p-4 border-r border-slate-200 overflow-hidden">
      <!-- Search & Shortcuts Bar -->
      <div class="flex items-center space-x-3 mb-4">
        <div class="relative flex-1">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search items by name, barcode, or HSN (Press F2)..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            @keydown.enter="handleSearchEnter"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
        </div>
        <button
          @click="showQuickAddModal = true"
          class="px-3.5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-lg shadow-sm flex items-center space-x-1 transition"
        >
          <span>+ Add Item</span>
        </button>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex space-x-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition',
            activeCategory === cat
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Item Tiles Grid -->
      <div class="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pr-1">
        <div
          v-for="item in filteredItems"
          :key="item.code"
          @click="addToCart(item)"
          class="bg-white p-3 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between group active:scale-[0.98]"
        >
          <div>
            <div class="flex justify-between items-start mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {{ item.category }}
              </span>
              <span
                :class="[
                  'text-[10px] font-bold px-1.5 py-0.5 rounded',
                  item.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                ]"
              >
                {{ item.stock }} {{ item.unit }}
              </span>
            </div>
            <h3 class="font-semibold text-slate-900 text-sm group-hover:text-sky-600 line-clamp-2">
              {{ item.name }}
            </h3>
            <div v-if="item.name_ta" class="text-xs text-slate-500 font-medium">
              {{ item.name_ta }}
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-100 flex justify-between items-baseline">
            <span class="text-xs text-slate-500">GST {{ item.gst_rate }}%</span>
            <span class="text-base font-bold text-slate-900">
              ₹{{ formatMoney(item.price) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANE: Bill Cart & Payment Split -->
    <div class="lg:w-5/12 flex flex-col bg-white border-l border-slate-200 shadow-sm overflow-hidden">
      <!-- Party Selector Bar -->
      <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-lg">👤</span>
          <div>
            <div class="text-xs text-slate-500 font-medium">Customer (F4)</div>
            <div class="text-sm font-semibold text-slate-800">{{ customer.name }}</div>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-500">Balance: </span>
          <span class="text-xs font-bold text-emerald-600">₹0.00</span>
        </div>
      </div>

      <!-- Cart Items Table -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400">
          <span class="text-4xl mb-2">🛒</span>
          <p class="text-sm font-medium">Cart is empty</p>
          <p class="text-xs text-slate-400 mt-1">Scan barcode or tap items to bill</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(line, idx) in cart"
            :key="line.code"
            class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            <div class="flex-1 pr-3">
              <div class="font-medium text-slate-900 text-sm">{{ line.name }}</div>
              <div class="text-xs text-slate-500">
                ₹{{ formatMoney(line.rate) }} / {{ line.unit }}
              </div>
            </div>

            <!-- Qty Stepper -->
            <div class="flex items-center space-x-2 mr-3">
              <button
                @click="updateQty(idx, -1)"
                class="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
              >
                -
              </button>
              <span class="w-8 text-center font-bold text-sm text-slate-900">
                {{ line.qty }}
              </span>
              <button
                @click="updateQty(idx, 1)"
                class="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
              >
                +
              </button>
            </div>

            <!-- Line Total -->
            <div class="text-right w-20">
              <div class="font-bold text-sm text-slate-900">
                ₹{{ formatMoney(line.qty * line.rate) }}
              </div>
              <button
                @click="removeFromCart(idx)"
                class="text-[11px] text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Totals & Payment Settlement Bar -->
      <div class="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
        <!-- Subtotals & Taxes -->
        <div class="space-y-1 text-xs text-slate-600">
          <div class="flex justify-between">
            <span>Taxable Subtotal:</span>
            <span>₹{{ formatMoney(totals.taxable) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Taxes (CGST + SGST):</span>
            <span>₹{{ formatMoney(totals.tax) }}</span>
          </div>
          <div class="flex justify-between items-baseline font-bold text-slate-900 text-lg pt-1 border-t border-slate-200">
            <span>Total Payable:</span>
            <span class="text-sky-600 text-2xl font-black">₹{{ formatMoney(totals.grandTotal) }}</span>
          </div>
        </div>

        <!-- Payment Mode Row -->
        <div class="grid grid-cols-4 gap-2 pt-1">
          <button
            v-for="mode in ['Cash', 'UPI', 'Card', 'Credit']"
            :key="mode"
            @click="selectedPaymentMode = mode"
            :class="[
              'py-2 rounded-lg text-xs font-bold border transition flex items-center justify-center space-x-1',
              selectedPaymentMode === mode
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            ]"
          >
            <span>{{ mode }}</span>
          </button>
        </div>

        <!-- Action Buttons (F8, F9) -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button
            @click="holdCart"
            :disabled="cart.length === 0"
            class="py-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-bold text-sm rounded-xl transition"
          >
            ⏸ Hold (F9)
          </button>
          <button
            @click="completeSale"
            :disabled="cart.length === 0"
            class="py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-1"
          >
            <span>⚡ Save & Print (F8)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Add Item Modal -->
    <div
      v-if="showQuickAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Quick Add Item (SCR-F5)</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
            <input v-model="newItem.name" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Paracetamol 650mg" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Barcode</label>
            <input v-model="newItem.barcode" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Scan or type barcode" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹)</label>
              <input v-model.number="newItem.price" type="number" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">GST Rate</label>
              <select v-model.number="newItem.gst_rate" class="w-full px-3 py-2 border rounded-lg text-sm">
                <option :value="0">0%</option>
                <option :value="5">5%</option>
                <option :value="12">12%</option>
                <option :value="18">18%</option>
                <option :value="40">40%</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button @click="showQuickAddModal = false" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button @click="saveNewItem" class="px-4 py-2 text-sm font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700">Add to Bill</button>
        </div>
      </div>
    </div>

    <!-- Bill Success Toast / Modal -->
    <div
      v-if="lastBill"
      class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-4 border border-slate-700"
    >
      <div>
        <div class="text-emerald-400 font-bold text-sm">✓ Bill Saved & Printed!</div>
        <div class="text-xs text-slate-300">Invoice: {{ lastBill.number }} • ₹{{ formatMoney(lastBill.total) }}</div>
      </div>
      <button @click="lastBill = null" class="text-slate-400 hover:text-white text-xs font-bold">Dismiss</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Item {
  code: string;
  name: string;
  name_ta?: string;
  category: string;
  unit: string;
  price: number;
  gst_rate: number;
  stock: number;
  barcode?: string;
}

interface CartItem extends Item {
  qty: number;
  rate: number;
}

const searchInput = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const activeCategory = ref('All');
const selectedPaymentMode = ref('Cash');
const showQuickAddModal = ref(false);
const lastBill = ref<{ number: string; total: number } | null>(null);

const customer = ref({
  name: 'Walk-in Customer',
  phone: '',
  balance: 0,
});

const categories = ['All', 'Medicines', 'General', 'Personal Care', 'Baby Care'];

const items = ref<Item[]>([
  { code: 'ITM-001', name: 'Paracetamol 650mg', name_ta: 'பாராசிட்டமால் 650mg', category: 'Medicines', unit: 'Strip', price: 35.00, gst_rate: 12, stock: 45, barcode: '890123456001' },
  { code: 'ITM-002', name: 'Amoxicillin 500mg', name_ta: 'அமாக்சிசிலின் 500mg', category: 'Medicines', unit: 'Strip', price: 72.50, gst_rate: 12, stock: 20, barcode: '890123456002' },
  { code: 'ITM-003', name: 'Dettol Antiseptic 100ml', name_ta: 'டெட்டால் 100ml', category: 'Personal Care', unit: 'Bottle', price: 65.00, gst_rate: 18, stock: 15, barcode: '890123456003' },
  { code: 'ITM-004', name: 'N95 Protective Mask', name_ta: 'N95 முகக்கவசம்', category: 'General', unit: 'Pcs', price: 25.00, gst_rate: 5, stock: 120, barcode: '890123456004' },
  { code: 'ITM-005', name: 'Digital Thermometer', name_ta: 'டிஜிட்டல் தெர்மாமீட்டர்', category: 'General', unit: 'Pcs', price: 180.00, gst_rate: 18, stock: 8, barcode: '890123456005' },
  { code: 'ITM-006', name: 'Baby Gripe Water 130ml', name_ta: 'கிரைப் வாட்டர்', category: 'Baby Care', unit: 'Bottle', price: 48.00, gst_rate: 12, stock: 30, barcode: '890123456006' },
  { code: 'ITM-007', name: 'Cetirizine 10mg', name_ta: 'செட்டிரிசின் 10mg', category: 'Medicines', unit: 'Strip', price: 18.00, gst_rate: 12, stock: 60, barcode: '890123456007' },
  { code: 'ITM-008', name: 'Cotton Roll 100g', name_ta: 'பஞ்சு 100g', category: 'General', unit: 'Roll', price: 40.00, gst_rate: 5, stock: 25, barcode: '890123456008' },
]);

const cart = ref<CartItem[]>([]);

const newItem = ref({
  name: '',
  barcode: '',
  price: 50,
  gst_rate: 18,
  category: 'General',
  unit: 'Pcs'
});

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesCat = activeCategory.value === 'All' || item.category === activeCategory.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || (item.barcode && item.barcode.includes(q));
    return matchesCat && matchesSearch;
  });
});

const totals = computed(() => {
  let subtotal = 0;
  let tax = 0;
  cart.value.forEach(line => {
    const lineTotal = line.qty * line.rate;
    subtotal += lineTotal;
    tax += (lineTotal * line.gst_rate) / (100 + line.gst_rate);
  });
  return {
    subtotal,
    taxable: subtotal - tax,
    tax,
    grandTotal: subtotal,
  };
});

function addToCart(item: Item) {
  const existing = cart.value.find(l => l.code === item.code);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.value.push({
      ...item,
      qty: 1,
      rate: item.price,
    });
  }
}

function updateQty(index: number, delta: number) {
  const line = cart.value[index];
  if (line) {
    line.qty += delta;
    if (line.qty <= 0) {
      cart.value.splice(index, 1);
    }
  }
}

function removeFromCart(index: number) {
  cart.value.splice(index, 1);
}

function handleSearchEnter() {
  if (filteredItems.value.length === 1) {
    addToCart(filteredItems.value[0]);
    searchQuery.value = '';
  }
}

function holdCart() {
  if (cart.value.length > 0) {
    alert('Bill saved to Held Bills (SCR-E5)');
    cart.value = [];
  }
}

let billCounter = 1;
function completeSale() {
  if (cart.value.length === 0) return;
  const billNum = `INV-D1-${String(billCounter++).padStart(5, '0')}`;
  lastBill.value = {
    number: billNum,
    total: totals.value.grandTotal,
  };
  cart.value = [];
  searchQuery.value = '';
  searchInput.value?.focus();
}

function saveNewItem() {
  if (!newItem.value.name) return;
  const created: Item = {
    code: `ITM-${Date.now().toString().slice(-4)}`,
    name: newItem.value.name,
    category: newItem.value.category,
    unit: newItem.value.unit,
    price: newItem.value.price,
    gst_rate: newItem.value.gst_rate,
    stock: 50,
    barcode: newItem.value.barcode,
  };
  items.value.unshift(created);
  addToCart(created);
  showQuickAddModal.value = false;
  newItem.value = { name: '', barcode: '', price: 50, gst_rate: 18, category: 'General', unit: 'Pcs' };
}

function formatMoney(num: number): string {
  return (num || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'F2') {
    e.preventDefault();
    searchInput.value?.focus();
  } else if (e.key === 'F8') {
    e.preventDefault();
    completeSale();
  } else if (e.key === 'F9') {
    e.preventDefault();
    holdCart();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
  searchInput.value?.focus();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>
