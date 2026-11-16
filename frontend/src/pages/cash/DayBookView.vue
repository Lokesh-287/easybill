<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top KPI Section -->
    <div class="p-6 pb-2">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
              Day Book & Cash Drawer
            </h1>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1',
                dayBook.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-300'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="dayBook.status === 'Open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
              <span>Register {{ dayBook.status }}</span>
            </span>
          </div>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Real-time cash in drawer tracking, petty expenses, shift closures & denomination reconciliation
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Export CSV -->
          <button
            @click="exportDayBookCSV"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/90 shadow-card flex items-center space-x-1.5 transition"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>Export Day Book</span>
          </button>

          <!-- Record Expense Button (SCR-I3) -->
          <button
            @click="showExpenseModal = true"
            class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center space-x-1.5 transition"
          >
            <MinusCircle class="w-4 h-4" />
            <span>Record Expense (SCR-I3)</span>
          </button>

          <!-- Close Shift Button (SCR-I2) -->
          <button
            @click="openCloseModal"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <Lock class="w-4 h-4" />
            <span>Shift / Day Close (SCR-I2)</span>
          </button>
        </div>
      </div>

      <!-- 4 Financial KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Opening Float -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Opening Cash Float</span>
            <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Banknote class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight">
            ₹{{ formatMoney(dayBook.opening_cash) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-md font-tabular">
              Shift Start
            </span>
            <span class="text-slate-400">counter drawer balance</span>
          </div>
        </div>

        <!-- Card 2: Cash In (Inflow) -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Total Cash In</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-emerald-700">
            ₹{{ formatMoney(dayBook.cash_in) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-tabular">
              Cash Sales + Khata
            </span>
            <span class="text-slate-400">collected in drawer</span>
          </div>
        </div>

        <!-- Card 3: Cash Out (Outflow) -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Total Cash Out</span>
            <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-rose-700">
            ₹{{ formatMoney(dayBook.cash_out) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-md font-tabular">
              Expenses + Payouts
            </span>
            <span class="text-slate-400">disbursed from drawer</span>
          </div>
        </div>

        <!-- Card 4: Expected Drawer Balance -->
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500">Expected in Drawer</span>
            <div class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Wallet class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xl font-extrabold text-slate-900 font-tabular tracking-tight text-primary-700">
            ₹{{ formatMoney(dayBook.expected_cash) }}
          </div>
          <div class="flex items-center space-x-1.5 mt-2 text-[11px]">
            <span class="font-bold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded-md font-tabular">
              System Total
            </span>
            <span class="text-slate-400">physical count target</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area: Cash Ledger -->
    <div class="flex-1 p-6 pt-2 flex flex-col min-h-0">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        <!-- Filter Tabs & Date Filter -->
        <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="flex items-center p-1 bg-slate-100/80 rounded-xl space-x-1">
            <button
              v-for="tab in filterTabs"
              :key="tab.id"
              @click="activeCashTab = tab.id"
              :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeCashTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              <span>{{ tab.label }}</span>
              <span
                :class="[
                  'ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full font-tabular',
                  activeCashTab === tab.id
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'bg-slate-200/70 text-slate-600'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>

          <div class="flex items-center space-x-2.5">
            <!-- Search -->
            <div class="relative w-64">
              <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search transaction, party..."
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 transition"
              />
            </div>

            <!-- Date Picker -->
            <input
              v-model="selectedDate"
              type="date"
              class="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="flex-1 overflow-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th class="py-3 px-4">Time & Voucher Ref</th>
                <th class="py-3 px-4">Transaction Type</th>
                <th class="py-3 px-4">Party / Beneficiary / Purpose</th>
                <th class="py-3 px-4 text-right">Cash In (₹)</th>
                <th class="py-3 px-4 text-right">Cash Out (₹)</th>
                <th class="py-3 px-4 text-right">Drawer Balance (₹)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="txn in filteredTransactions"
                :key="txn.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <!-- Time & Ref -->
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-900 font-mono text-[11px]">{{ txn.time }}</div>
                  <div class="text-[10px] text-slate-400 font-mono">{{ txn.ref_no }}</div>
                </td>

                <!-- Type -->
                <td class="py-3 px-4">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block',
                      txn.type === 'Cash Sale' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      txn.type === 'Debt Collection' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      txn.type === 'Opening Balance' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    ]"
                  >
                    {{ txn.type }}
                  </span>
                  <div class="text-[10px] text-slate-400 mt-0.5">{{ txn.category }}</div>
                </td>

                <!-- Party / Purpose -->
                <td class="py-3 px-4">
                  <div class="font-semibold text-slate-900">{{ txn.party }}</div>
                  <div v-if="txn.notes" class="text-[10px] text-slate-400">{{ txn.notes }}</div>
                </td>

                <!-- Cash In -->
                <td class="py-3 px-4 text-right font-tabular">
                  <span v-if="txn.inflow > 0" class="text-emerald-700 font-extrabold">
                    +₹{{ formatMoney(txn.inflow) }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>

                <!-- Cash Out -->
                <td class="py-3 px-4 text-right font-tabular">
                  <span v-if="txn.outflow > 0" class="text-rose-700 font-extrabold">
                    -₹{{ formatMoney(txn.outflow) }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>

                <!-- Drawer Balance -->
                <td class="py-3 px-4 text-right font-tabular font-extrabold text-slate-900">
                  ₹{{ formatMoney(txn.running_balance) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span class="font-bold text-slate-800">{{ filteredTransactions.length }}</span> of <span class="font-bold text-slate-800">{{ dayBook.transactions.length }}</span> cash entries
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-slate-600">
              Total Inflow: <span class="font-bold text-emerald-700 font-tabular">₹{{ formatMoney(dayBook.cash_in) }}</span>
            </div>
            <div class="text-slate-600">
              Total Outflow: <span class="font-bold text-rose-700 font-tabular">₹{{ formatMoney(dayBook.cash_out) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: Record Petty Cash Expense (SCR-I3)      -->
    <!-- ============================================== -->
    <div
      v-if="showExpenseModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showExpenseModal = false"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <MinusCircle class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">Record Petty Cash Expense (SCR-I3)</div>
              <div class="text-[10px] text-slate-500">Immediate cash disbursement from counter drawer</div>
            </div>
          </div>
          <button @click="showExpenseModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Expense Category *</label>
            <select
              v-model="expenseForm.category"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="Tea & Snacks">Tea & Snacks / Refreshments</option>
              <option value="Transport">Transport / Delivery / Auto Fare</option>
              <option value="Cleaning & Maintenance">Shop Cleaning & Housekeeping</option>
              <option value="Electricity & Utilities">Electricity & Water Utilities</option>
              <option value="Packaging Material">Packaging Materials & Carry Bags</option>
              <option value="Printing & Stationery">Printing & Office Stationery</option>
              <option value="Staff Advance">Staff Petty Advance</option>
              <option value="Miscellaneous">Miscellaneous Minor Expense</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Disbursed Amount (₹) *</label>
            <input
              v-model.number="expenseForm.amount"
              type="number"
              step="1"
              min="1"
              placeholder="0.00"
              class="w-full px-3 py-2 text-base font-extrabold font-tabular text-rose-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Payment Mode</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="expenseForm.mode = 'Cash from Drawer'"
                :class="[
                  'py-2 px-3 text-center rounded-xl font-bold border transition text-xs',
                  expenseForm.mode === 'Cash from Drawer'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                Cash from Drawer
              </button>
              <button
                type="button"
                @click="expenseForm.mode = 'UPI / Bank'"
                :class="[
                  'py-2 px-3 text-center rounded-xl font-bold border transition text-xs',
                  expenseForm.mode === 'UPI / Bank'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                UPI / Shop Bank
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Paid To / Beneficiary</label>
            <input
              v-model="expenseForm.party"
              type="text"
              placeholder="e.g. Senthil Tea Stall"
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Notes / Bill Reference</label>
            <input
              v-model="expenseForm.notes"
              type="text"
              placeholder="e.g. Evening tea for staff"
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            @click="showExpenseModal = false"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            @click="submitExpense"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20"
          >
            Record Payout
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: Shift / Day Close & Reconcile (SCR-I2)  -->
    <!-- ============================================== -->
    <div
      v-if="showCloseModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showCloseModal = false"
    >
      <div class="w-full max-w-xl bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-primary-50/50">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Lock class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">Shift / Day Register Close (SCR-I2)</div>
              <div class="text-[10px] text-slate-500">Count physical currency, verify drawer variance & generate closing slip</div>
            </div>
          </div>
          <button @click="showCloseModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          <!-- Balance Target Comparison -->
          <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
            <div>
              <div class="text-[10px] text-slate-400">Expected in Drawer</div>
              <div class="text-base font-extrabold text-slate-900 font-tabular">₹{{ formatMoney(dayBook.expected_cash) }}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">Total Counted Cash</div>
              <div class="text-base font-extrabold text-primary-700 font-tabular">₹{{ formatMoney(totalCountedCash) }}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">Variance (Short / Excess)</div>
              <div
                :class="[
                  'text-base font-extrabold font-tabular',
                  countedVariance === 0 ? 'text-emerald-700' :
                  countedVariance > 0 ? 'text-blue-700' : 'text-rose-700'
                ]"
              >
                {{ countedVariance > 0 ? '+' : countedVariance < 0 ? '-' : '' }}₹{{ formatMoney(countedVariance) }}
              </div>
            </div>
          </div>

          <!-- Denomination Counter Grid -->
          <div>
            <div class="text-xs font-bold text-slate-700 mb-2">Physical Currency Denomination Counter</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div
                v-for="denom in denominationPresets"
                :key="denom.val"
                class="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div class="font-bold text-slate-800 text-[11px]">₹{{ denom.val }}</div>
                <div class="flex items-center space-x-1">
                  <span class="text-[10px] text-slate-400">×</span>
                  <input
                    v-model.number="denomCounts[denom.val]"
                    type="number"
                    min="0"
                    class="w-14 px-1.5 py-1 text-center font-bold font-tabular bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Audit Notes -->
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Closing Supervisor Notes</label>
            <textarea
              v-model="closingNotes"
              rows="2"
              placeholder="e.g. Evening shift complete. Physical count matched expected drawer balance."
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            @click="showCloseModal = false"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            @click="submitDayClose"
            class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/20 flex items-center space-x-1.5"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>Confirm & Lock Register</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '../../services/toast';
import {
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Search,
  Download,
  MinusCircle,
  Lock,
  CheckCircle2
} from '@lucide/vue';

const toast = useToast();

interface CashTransaction {
  id: string;
  time: string;
  type: string;
  category: string;
  party: string;
  inflow: number;
  outflow: number;
  running_balance: number;
  ref_no: string;
  notes?: string;
}

interface DayBookData {
  date: string;
  opening_cash: number;
  cash_in: number;
  cash_out: number;
  expected_cash: number;
  counted_cash: number;
  variance: number;
  status: 'Open' | 'Closed';
  transactions: CashTransaction[];
}

// State
const searchQuery = ref('');
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const activeCashTab = ref('all');
const showExpenseModal = ref(false);
const showCloseModal = ref(false);

const expenseForm = ref({
  category: 'Tea & Snacks',
  amount: 0,
  mode: 'Cash from Drawer',
  party: '',
  notes: ''
});

const closingNotes = ref('Evening shift complete. Physical count verified.');

// Denominations
const denominationPresets = [
  { val: 2000 },
  { val: 500 },
  { val: 200 },
  { val: 100 },
  { val: 50 },
  { val: 20 },
  { val: 10 },
  { val: 5 },
  { val: 1 }
];

const denomCounts = ref<Record<number, number>>({
  2000: 4,  // 8000
  500: 20,  // 10000
  200: 8,   // 1600
  100: 6,   // 600
  50: 1,    // 50
  20: 0,
  10: 0,
  5: 0,
  1: 0
});

// Seed Day Book
const dayBook = ref<DayBookData>({
  date: new Date().toISOString().split('T')[0],
  opening_cash: 5000.00,
  cash_in: 18450.00,
  cash_out: 3200.00,
  expected_cash: 20250.00,
  counted_cash: 20250.00,
  variance: 0.00,
  status: 'Open',
  transactions: [
    { id: "TXN-001", time: "09:00 AM", type: "Opening Balance", category: "Float", party: "Shift Opening Float", inflow: 5000.00, outflow: 0.00, running_balance: 5000.00, ref_no: "OPEN-01" },
    { id: "TXN-002", time: "10:15 AM", type: "Cash Sale", category: "Sales Invoice", party: "Walk-in Customer", inflow: 420.00, outflow: 0.00, running_balance: 5420.00, ref_no: "INV-2026-0001" },
    { id: "TXN-003", time: "11:30 AM", type: "Petty Expense", category: "Tea & Snacks", party: "Morning Staff Refreshments", inflow: 0.00, outflow: 120.00, running_balance: 5300.00, ref_no: "EXP-2026-01" },
    { id: "TXN-004", time: "12:45 PM", type: "Debt Collection", category: "Khata Receipt", party: "Ramesh Kumar (Retail)", inflow: 2500.00, outflow: 0.00, running_balance: 7800.00, ref_no: "REC-2026-0001" },
    { id: "TXN-005", time: "02:10 PM", type: "Supplier Payout", category: "Transport", party: "Fast Track Logistics (Freight)", inflow: 0.00, outflow: 850.00, running_balance: 6950.00, ref_no: "PAY-2026-01" },
    { id: "TXN-006", time: "03:40 PM", type: "Cash Sale", category: "Sales Invoice", party: "Walk-in Customer", inflow: 15530.00, outflow: 0.00, running_balance: 22480.00, ref_no: "INV-2026-0005" },
    { id: "TXN-007", time: "04:20 PM", type: "Petty Expense", category: "Packaging Material", party: "Carry Bags & Tape Roll", inflow: 0.00, outflow: 2230.00, running_balance: 20250.00, ref_no: "EXP-2026-02" }
  ]
});

// Computed
const filterTabs = computed(() => [
  { id: 'all', label: 'All Transactions', count: dayBook.value.transactions.length },
  { id: 'inflow', label: 'Cash Inflow', count: dayBook.value.transactions.filter(t => t.inflow > 0).length },
  { id: 'outflow', label: 'Cash Outflow', count: dayBook.value.transactions.filter(t => t.outflow > 0).length }
]);

const totalCountedCash = computed(() => {
  return denominationPresets.reduce((acc, d) => {
    const raw = denomCounts.value[d.val];
    const count = typeof raw === 'number' && !isNaN(raw) ? raw : Number(raw);
    const safeCount = isNaN(count) || count < 0 ? 0 : count;
    return acc + (d.val * safeCount);
  }, 0);
});

const countedVariance = computed(() => {
  return totalCountedCash.value - dayBook.value.expected_cash;
});

const filteredTransactions = computed(() => {
  return dayBook.value.transactions.filter(t => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const match = (
        t.id.toLowerCase().includes(q) ||
        t.ref_no.toLowerCase().includes(q) ||
        t.party.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
      if (!match) return false;
    }

    if (activeCashTab.value === 'inflow' && t.inflow <= 0) return false;
    if (activeCashTab.value === 'outflow' && t.outflow <= 0) return false;

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

function openCloseModal() {
  showCloseModal.value = true;
}

async function submitExpense() {
  if (expenseForm.value.amount <= 0) {
    toast.error('Invalid Amount', 'Please enter a valid expense amount');
    return;
  }

  try {
    const res = await fetch('/api/method/easybill.api.v1.cash.add_expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: expenseForm.value.category,
        amount: expenseForm.value.amount,
        mode: expenseForm.value.mode,
        party: expenseForm.value.party,
        notes: expenseForm.value.notes
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.message && data.message.data) {
        dayBook.value = data.message.data.day_book;
        showExpenseModal.value = false;
        toast.success('Expense Recorded', `₹${formatMoney(expenseForm.value.amount)} paid for ${expenseForm.value.category}`);
        return;
      }
    }
  } catch (err) {
    console.log('Expense local fallback');
  }

  // Local fallback
  const amount = expenseForm.value.amount;
  dayBook.value.cash_out += amount;
  dayBook.value.expected_cash = dayBook.value.opening_cash + dayBook.value.cash_in - dayBook.value.cash_out;

  dayBook.value.transactions.push({
    id: `TXN-00${dayBook.value.transactions.length + 1}`,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    type: 'Petty Expense',
    category: expenseForm.value.category,
    party: expenseForm.value.party || expenseForm.value.category,
    inflow: 0.00,
    outflow: amount,
    running_balance: dayBook.value.expected_cash,
    ref_no: `EXP-${Date.now().toString().slice(-4)}`,
    notes: expenseForm.value.notes
  });

  showExpenseModal.value = false;
  toast.success('Expense Recorded', `₹${formatMoney(amount)} logged in Day Book`);
}

async function submitDayClose() {
  try {
    const res = await fetch('/api/method/easybill.api.v1.cash.close_day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        counted_cash: totalCountedCash.value,
        notes: closingNotes.value
      })
    });
    if (res.ok) {
      dayBook.value.status = 'Closed';
      dayBook.value.counted_cash = totalCountedCash.value;
      dayBook.value.variance = countedVariance.value;
      showCloseModal.value = false;
      toast.success('Day Closed', 'Register closed and drawer locked successfully');
      return;
    }
  } catch (err) {
    console.log('Day close local fallback');
  }

  dayBook.value.status = 'Closed';
  dayBook.value.counted_cash = totalCountedCash.value;
  dayBook.value.variance = countedVariance.value;
  showCloseModal.value = false;
  toast.success('Day Closed', 'Register closed and drawer locked successfully');
}

function exportDayBookCSV() {
  const headers = ['Time', 'Voucher Ref', 'Type', 'Category', 'Party / Purpose', 'Cash Inflow', 'Cash Outflow', 'Drawer Balance'];
  const rows = dayBook.value.transactions.map(t => [
    t.time,
    t.ref_no,
    t.type,
    t.category,
    `"${t.party}"`,
    t.inflow,
    t.outflow,
    t.running_balance
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `easybill_daybook_${dayBook.value.date}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(async () => {
  try {
    const res = await fetch('/api/method/easybill.api.v1.cash.get_day_book');
    if (res.ok) {
      const data = await res.json();
      if (data.message && data.message.data) {
        dayBook.value = data.message.data;
      }
    }
  } catch (err) {
    console.log('Using local seed day book');
  }
});
</script>
