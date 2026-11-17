<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Top Bar with Back and Actions -->
    <div class="p-6 pb-3 border-b border-slate-200/80 bg-white shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <router-link
            to="/purchase"
            class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft class="w-4 h-4" />
          </router-link>
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-lg font-extrabold text-slate-900 tracking-tight">
                New Inward Purchase Bill (SCR-F2)
              </h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-700 border border-primary-200">
                Inward Stock Entry
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Enter supplier invoice, verify duplicate bill guard, log inventory into warehouse & calculate Input Tax Credit
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2.5">
          <router-link
            to="/purchase"
            class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition"
          >
            Cancel
          </router-link>
          <button
            @click="savePurchaseBill(false)"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
          >
            Save Draft
          </button>
          <button
            @click="savePurchaseBill(true)"
            class="px-5 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Save & Inward Stock</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Entry Form Grid -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6">
      <!-- 1. HEADER PANE: Supplier & Bill Metadata -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
        <div class="text-xs font-extrabold text-slate-900 mb-4 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Supplier & Invoice Reference</span>
          </div>
          <span class="text-[11px] font-normal text-slate-400">
            Duplicate bill guard active on Bill Number blur
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Supplier Picker -->
          <div class="space-y-1">
            <label class="block text-[11px] font-bold text-slate-700">
              Supplier <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.supplier_id"
              @change="onSupplierChange"
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800"
            >
              <option value="" disabled>Select Supplier</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                {{ sup.name }} ({{ sup.city }})
              </option>
            </select>
            <div v-if="selectedSupplierObj" class="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>GSTIN: {{ selectedSupplierObj.gstin || 'Unregistered' }}</span>
              <span class="text-rose-600 font-medium">Due: ₹{{ formatMoney(selectedSupplierObj.balance) }}</span>
            </div>
          </div>

          <!-- Supplier Bill Number (Duplicate Check on Blur) -->
          <div class="space-y-1">
            <label class="block text-[11px] font-bold text-slate-700">
              Supplier Bill No <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.supplier_bill_no"
                @blur="handleBillNoBlur"
                type="text"
                placeholder="e.g. INV-98124"
                :class="[
                  'w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 uppercase font-mono font-bold transition',
                  duplicateDetected ? 'border-rose-400 text-rose-700 bg-rose-50/50' : 'border-slate-200 text-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                ]"
              />
              <span v-if="isCheckingDuplicate" class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                Checking...
              </span>
            </div>
            <p v-if="duplicateDetected" class="text-[10px] text-rose-600 font-medium">
              ⚠️ Conflict detected! Bill already exists.
            </p>
          </div>

          <!-- Supplier Bill Date -->
          <div class="space-y-1">
            <label class="block text-[11px] font-bold text-slate-700">
              Bill Date <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.bill_date"
              type="date"
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800"
            />
          </div>

          <!-- Warehouse Destination -->
          <div class="space-y-1">
            <label class="block text-[11px] font-bold text-slate-700">
              Destination Warehouse
            </label>
            <select
              v-model="form.warehouse"
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800"
            >
              <option value="Stores - EB">Stores - EB (Main Godown)</option>
              <option value="Shop Floor - EB">Shop Floor - EB (Front Counter)</option>
              <option value="Cold Storage - EB">Cold Storage - EB (Vaccines/Insulin)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 2. MIDDLE PANE: Inward Line Items Grid -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">2</span>
            <span class="text-xs font-extrabold text-slate-900">Inward Line Items & Tax Calculation</span>
          </div>

          <button
            @click="openQuickAddModal"
            class="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>+ Quick Create New Item (SCR-F5)</span>
          </button>
        </div>

        <!-- Items Table -->
        <div class="border border-slate-200 rounded-xl overflow-hidden mb-3">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
              <tr>
                <th class="py-2.5 px-3 w-48">Item / Product</th>
                <th class="py-2.5 px-3 w-28 text-center">Batch No</th>
                <th class="py-2.5 px-3 w-28 text-center">Expiry</th>
                <th class="py-2.5 px-3 w-24 text-right">Qty</th>
                <th class="py-2.5 px-3 w-20 text-center">UOM</th>
                <th class="py-2.5 px-3 w-28 text-right">Unit Rate (₹)</th>
                <th class="py-2.5 px-3 w-24 text-center">GST Slab</th>
                <th class="py-2.5 px-3 w-28 text-right">Tax (₹)</th>
                <th class="py-2.5 px-3 w-32 text-right">Total (₹)</th>
                <th class="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="(row, idx) in form.items" :key="idx" class="hover:bg-slate-50/50">
                <!-- Item Selector -->
                <td class="py-2 px-3">
                  <select
                    v-model="row.item_code"
                    @change="onItemRowSelect(row)"
                    class="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                  >
                    <option value="" disabled>Select Item</option>
                    <option v-for="cat in catalogItems" :key="cat.code" :value="cat.code">
                      {{ cat.name }} ({{ cat.code }})
                    </option>
                  </select>
                  <div class="text-[10px] text-slate-400 mt-0.5 font-mono">
                    HSN: {{ row.hsn || '—' }}
                  </div>
                </td>

                <!-- Batch No -->
                <td class="py-2 px-3 text-center">
                  <input
                    v-model="row.batch_no"
                    type="text"
                    placeholder="BAT-001"
                    class="w-full px-2 py-1 text-xs text-center font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </td>

                <!-- Expiry Date -->
                <td class="py-2 px-3 text-center">
                  <input
                    v-model="row.expiry_date"
                    type="date"
                    class="w-full px-1.5 py-1 text-xs text-center bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </td>

                <!-- Qty -->
                <td class="py-2 px-3 text-right">
                  <input
                    v-model.number="row.qty"
                    type="number"
                    min="1"
                    class="w-full px-2 py-1 text-xs text-right font-bold font-tabular bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-primary-500"
                  />
                </td>

                <!-- UOM -->
                <td class="py-2 px-3 text-center">
                  <span class="text-xs text-slate-500 font-medium">{{ row.uom || 'Pcs' }}</span>
                </td>

                <!-- Purchase Rate -->
                <td class="py-2 px-3 text-right">
                  <input
                    v-model.number="row.rate"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-2 py-1 text-xs text-right font-bold font-tabular bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-primary-500"
                  />
                </td>

                <!-- GST Slab -->
                <td class="py-2 px-3 text-center">
                  <select
                    v-model.number="row.gst_rate"
                    class="w-full px-1.5 py-1 text-xs text-center font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option :value="0">0%</option>
                    <option :value="5">5%</option>
                    <option :value="12">12%</option>
                    <option :value="18">18%</option>
                    <option :value="28">28%</option>
                  </select>
                </td>

                <!-- Computed Tax -->
                <td class="py-2 px-3 text-right font-tabular text-indigo-700 font-semibold">
                  ₹{{ formatMoney(getLineTax(row)) }}
                </td>

                <!-- Line Total -->
                <td class="py-2 px-3 text-right font-tabular font-extrabold text-slate-900">
                  ₹{{ formatMoney(getLineTotal(row)) }}
                </td>

                <!-- Delete Action -->
                <td class="py-2 px-2 text-center">
                  <button
                    v-if="form.items.length > 1"
                    @click="removeRow(idx)"
                    class="p-1 text-slate-300 hover:text-rose-500 rounded transition"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          @click="addNewRow"
          class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Add Another Line Item</span>
        </button>
      </div>

      <!-- 3. BOTTOM PANE: Settlement & Financial Totals -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Settlement Mode & Immediate Payment Entry -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-4">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">3</span>
            <span class="text-xs font-extrabold text-slate-900">Payment & Settlement Mode</span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1.5">Settlement Terms</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="mode in ['Credit', 'Bank Transfer', 'Cash']"
                  :key="mode"
                  type="button"
                  @click="form.payment_mode = mode"
                  :class="[
                    'py-2 px-3 text-center rounded-xl font-bold border transition text-xs',
                    form.payment_mode === mode
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  ]"
                >
                  {{ mode === 'Credit' ? 'Credit (To Pay Later)' : mode }}
                </button>
              </div>
            </div>

            <div v-if="form.payment_mode !== 'Credit'" class="space-y-1">
              <label class="block text-[11px] font-bold text-slate-700">
                Amount Settled Immediately (₹)
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="form.amount_paid"
                  type="number"
                  step="0.01"
                  min="0"
                  :max="grandTotal"
                  class="flex-1 px-3 py-2 text-xs font-bold font-tabular bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  @click="form.amount_paid = grandTotal"
                  class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Full Amount
                </button>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs flex justify-between items-center">
              <span class="text-slate-500">Remaining Balance (Accounts Payable):</span>
              <span class="font-tabular font-extrabold text-rose-700 text-sm">
                ₹{{ formatMoney(balanceDue) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tax & Totals Breakdown Card -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-3">
          <div class="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center">
            <span>Bill Valuation & Tax ITC</span>
            <span class="text-[10px] text-slate-400 font-mono">
              {{ isInterState ? 'IGST Applicable' : 'CGST + SGST Applicable' }}
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-slate-600">
              <span>Taxable Subtotal</span>
              <span class="font-tabular font-semibold">₹{{ formatMoney(taxableSubtotal) }}</span>
            </div>

            <div v-if="!isInterState" class="flex justify-between text-slate-600">
              <span>CGST</span>
              <span class="font-tabular font-semibold text-indigo-600">₹{{ formatMoney(totalTax / 2) }}</span>
            </div>

            <div v-if="!isInterState" class="flex justify-between text-slate-600">
              <span>SGST</span>
              <span class="font-tabular font-semibold text-indigo-600">₹{{ formatMoney(totalTax / 2) }}</span>
            </div>

            <div v-if="isInterState" class="flex justify-between text-slate-600">
              <span>IGST (Inter-state)</span>
              <span class="font-tabular font-semibold text-indigo-600">₹{{ formatMoney(totalTax) }}</span>
            </div>

            <div class="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <div>
                <div class="text-sm font-extrabold text-slate-900">Grand Total</div>
                <div class="text-[10px] text-slate-400">Total payable for inward stock</div>
              </div>
              <div class="text-xl font-extrabold font-tabular text-primary-700">
                ₹{{ formatMoney(grandTotal) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: SCR-F4 Duplicate Supplier Bill Warning -->
    <!-- ============================================== -->
    <div
      v-if="showDuplicateModal && duplicateConflict"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-modal border border-rose-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="p-4 bg-rose-50 border-b border-rose-100 flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-rose-900">Duplicate Supplier Bill Warning (SCR-F4)</h3>
            <p class="text-[10px] text-rose-600">Double-entry guard prevented accidental duplicate recording</p>
          </div>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-3 text-xs">
          <p class="text-slate-600 leading-relaxed">
            A purchase bill with number <span class="font-bold text-slate-900 font-mono">{{ duplicateConflict.supplier_bill_no }}</span> for supplier <span class="font-bold text-slate-900">{{ duplicateConflict.supplier_name }}</span> already exists in EasyBill.
          </p>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-[11px]">
            <div class="flex justify-between">
              <span class="text-slate-400">Internal Bill ID:</span>
              <span class="font-bold text-slate-800">{{ duplicateConflict.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Recorded Date:</span>
              <span class="font-bold text-slate-800">{{ duplicateConflict.bill_date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Invoiced Amount:</span>
              <span class="font-bold text-slate-900 font-tabular">₹{{ formatMoney(duplicateConflict.grand_total) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Created By:</span>
              <span class="font-bold text-slate-800">{{ duplicateConflict.owner }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            @click="correctBillNumber"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            Correct Bill Number
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: SCR-F5 Quick-Add Item Inline Modal       -->
    <!-- ============================================== -->
    <div
      v-if="showQuickAddModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showQuickAddModal = false"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-primary-50/50">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Plus class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">Quick-Add Product (SCR-F5)</div>
              <div class="text-[10px] text-slate-500">Add unknown product directly into catalog</div>
            </div>
          </div>
          <button @click="showQuickAddModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-5 space-y-3 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Item Name *</label>
            <input
              v-model="quickItem.name"
              type="text"
              placeholder="e.g. Cough Syrup 100ml"
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
              <select
                v-model="quickItem.category"
                class="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="Medicines">Medicines</option>
                <option value="General">General</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Baby Care">Baby Care</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">UOM</label>
              <select
                v-model="quickItem.unit"
                class="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="Strip">Strip</option>
                <option value="Bottle">Bottle</option>
                <option value="Pcs">Pcs</option>
                <option value="Box">Box</option>
                <option value="Roll">Roll</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Purchase Cost (₹)</label>
              <input
                v-model.number="quickItem.cost"
                type="number"
                step="0.01"
                class="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">GST Rate (%)</label>
              <select
                v-model.number="quickItem.gst_rate"
                class="w-full px-2.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              >
                <option :value="0">0%</option>
                <option :value="5">5%</option>
                <option :value="12">12%</option>
                <option :value="18">18%</option>
                <option :value="28">28%</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            @click="showQuickAddModal = false"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            @click="saveQuickItem"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/20"
          >
            Add to Bill Grid
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../../services/toast';
import { addPurchaseBill } from '../../stores/documentStore';
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle
} from '@lucide/vue';

const router = useRouter();
const toast = useToast();

// Master Data
const suppliers = ref([
  { id: 'SUPP-001', name: 'MediPharma Distributors', city: 'Erode', state: 'Tamil Nadu (33)', gstin: '33AABCM5678H1Z4', balance: 0.00 },
  { id: 'SUPP-002', name: 'Apex Health Supplies', city: 'Chennai', state: 'Tamil Nadu (33)', gstin: '33AABCA4321J1Z8', balance: 12600.00 },
  { id: 'SUPP-003', name: 'South India Drug House', city: 'Coimbatore', state: 'Tamil Nadu (33)', gstin: '33AABCS8765K1Z9', balance: 14500.00 },
  { id: 'SUPP-004', name: 'Global Pharma Corp', city: 'Bengaluru', state: 'Karnataka (29)', gstin: '29AABCG1234K1Z2', balance: 0.00 }
]);

const catalogItems = ref([
  { code: 'MED-001', name: 'Paracetamol 650mg', hsn: '300490', unit: 'Strip', cost: 22.00, gst_rate: 12 },
  { code: 'MED-002', name: 'Amoxicillin 500mg', hsn: '300410', unit: 'Strip', cost: 48.00, gst_rate: 12 },
  { code: 'MED-003', name: 'Cetirizine 10mg', hsn: '300490', unit: 'Strip', cost: 10.00, gst_rate: 12 },
  { code: 'GEN-001', name: 'N95 Protective Mask', hsn: '630790', unit: 'Pcs', cost: 14.00, gst_rate: 5 },
  { code: 'GEN-002', name: 'Cotton Roll 100g', hsn: '300590', unit: 'Roll', cost: 26.00, gst_rate: 5 },
  { code: 'PER-001', name: 'Dettol Antiseptic 100ml', hsn: '380894', unit: 'Bottle', cost: 49.00, gst_rate: 18 },
  { code: 'GEN-003', name: 'Surgical Gloves Latex', hsn: '401511', unit: 'Box', cost: 210.00, gst_rate: 12 },
  { code: 'BAB-002', name: 'Digital Thermometer', hsn: '902519', unit: 'Pcs', cost: 115.00, gst_rate: 18 }
]);

// Form State
const form = ref({
  supplier_id: 'SUPP-001',
  supplier_name: 'MediPharma Distributors',
  supplier_bill_no: '',
  bill_date: new Date().toISOString().split('T')[0],
  warehouse: 'Stores - EB',
  payment_mode: 'Credit',
  amount_paid: 0,
  items: [
    {
      item_code: 'MED-001',
      item_name: 'Paracetamol 650mg',
      hsn: '300490',
      batch_no: 'BAT-26K04',
      expiry_date: '2027-11-30',
      qty: 100,
      uom: 'Strip',
      rate: 22.00,
      gst_rate: 12
    }
  ]
});

// Duplicate Checking
const isCheckingDuplicate = ref(false);
const duplicateDetected = ref(false);
const showDuplicateModal = ref(false);
const duplicateConflict = ref<any>(null);

// Quick Add Item Modal
const showQuickAddModal = ref(false);
const quickItem = ref({
  name: '',
  category: 'Medicines',
  unit: 'Strip',
  cost: 50,
  gst_rate: 12
});

// Computed Properties
const selectedSupplierObj = computed(() => {
  return suppliers.value.find(s => s.id === form.value.supplier_id);
});

const isInterState = computed(() => {
  return selectedSupplierObj.value?.state?.includes('(29)') || false;
});

const taxableSubtotal = computed(() => {
  return form.value.items.reduce((acc, row) => acc + (row.qty * row.rate), 0);
});

const totalTax = computed(() => {
  return form.value.items.reduce((acc, row) => {
    const lineTaxable = row.qty * row.rate;
    return acc + (lineTaxable * (row.gst_rate / 100.0));
  }, 0);
});

const grandTotal = computed(() => {
  return Math.round((taxableSubtotal.value + totalTax.value) * 100) / 100;
});

const balanceDue = computed(() => {
  if (form.value.payment_mode === 'Credit') return grandTotal.value;
  return Math.max(0, grandTotal.value - (form.value.amount_paid || 0));
});

// Methods
function formatMoney(amount: number): string {
  if (amount === undefined || amount === null) return '0.00';
  return Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getLineTax(row: any): number {
  return (row.qty * row.rate) * (row.gst_rate / 100.0);
}

function getLineTotal(row: any): number {
  return (row.qty * row.rate) + getLineTax(row);
}

function onSupplierChange() {
  const sup = selectedSupplierObj.value;
  if (sup) {
    form.value.supplier_name = sup.name;
    if (form.value.supplier_bill_no) {
      handleBillNoBlur();
    }
  }
}

function onItemRowSelect(row: any) {
  const item = catalogItems.value.find(c => c.code === row.item_code);
  if (item) {
    row.item_name = item.name;
    row.hsn = item.hsn;
    row.uom = item.unit;
    row.rate = item.cost;
    row.gst_rate = item.gst_rate;
  }
}

function addNewRow() {
  form.value.items.push({
    item_code: '',
    item_name: '',
    hsn: '',
    batch_no: '',
    expiry_date: '',
    qty: 1,
    uom: 'Pcs',
    rate: 0,
    gst_rate: 12
  });
}

function removeRow(idx: number) {
  if (form.value.items.length > 1) {
    form.value.items.splice(idx, 1);
  }
}

async function handleBillNoBlur() {
  if (!form.value.supplier_bill_no.trim() || !form.value.supplier_name) return;

  isCheckingDuplicate.value = true;
  try {
    const url = `/api/method/easybill.api.v1.purchase.check_duplicate?supplier=${encodeURIComponent(form.value.supplier_name)}&bill_no=${encodeURIComponent(form.value.supplier_bill_no.trim())}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.message && data.message.data && data.message.data.exists) {
        duplicateDetected.value = true;
        duplicateConflict.value = data.message.data.conflict;
        showDuplicateModal.value = true;
        return;
      }
    }
  } catch (err) {
    // fallback local check
    if (form.value.supplier_bill_no.toUpperCase() === 'INV-88912') {
      duplicateDetected.value = true;
      duplicateConflict.value = {
        id: 'PUR-2026-0001',
        supplier_bill_no: 'INV-88912',
        supplier_name: 'MediPharma Distributors',
        bill_date: '2026-11-15',
        grand_total: 18480.00,
        owner: 'Administrator'
      };
      showDuplicateModal.value = true;
      return;
    }
  } finally {
    isCheckingDuplicate.value = false;
  }

  duplicateDetected.value = false;
}

function correctBillNumber() {
  form.value.supplier_bill_no = '';
  duplicateDetected.value = false;
  showDuplicateModal.value = false;
}

function openQuickAddModal() {
  quickItem.value = {
    name: '',
    category: 'Medicines',
    unit: 'Strip',
    cost: 50,
    gst_rate: 12
  };
  showQuickAddModal.value = true;
}

function saveQuickItem() {
  if (!quickItem.value.name) return;

  const newCode = `ITEM-${Date.now().toString().slice(-4)}`;
  const newItem = {
    code: newCode,
    name: quickItem.value.name,
    hsn: '300490',
    unit: quickItem.value.unit,
    cost: quickItem.value.cost,
    gst_rate: quickItem.value.gst_rate
  };

  catalogItems.value.push(newItem);

  // Add directly to form items
  form.value.items.push({
    item_code: newCode,
    item_name: newItem.name,
    hsn: newItem.hsn,
    batch_no: '',
    expiry_date: '',
    qty: 1,
    uom: newItem.unit,
    rate: newItem.cost,
    gst_rate: newItem.gst_rate
  });

  showQuickAddModal.value = false;
}

async function savePurchaseBill(inwardStock = true) {
  form.value.supplier_bill_no = (form.value.supplier_bill_no || '').trim().toUpperCase();
  if (!form.value.supplier_bill_no) {
    toast.error('Please enter the Supplier Bill Number');
    return;
  }
  if (duplicateDetected.value) {
    showDuplicateModal.value = true;
    return;
  }
  if (form.value.items.some(i => !i.item_code || isNaN(i.qty) || i.qty <= 0 || isNaN(i.rate) || i.rate < 0)) {
    toast.error('Please ensure all line items have a valid product selected, quantity > 0, and rate >= 0');
    return;
  }
  if (taxableSubtotal.value <= 0) {
    toast.error('Total bill amount must be greater than zero');
    return;
  }

  try {
    const payload = {
      supplier_id: form.value.supplier_id,
      supplier_name: form.value.supplier_name,
      supplier_bill_no: form.value.supplier_bill_no.trim(),
      supplier_state: selectedSupplierObj.value?.state || 'Tamil Nadu (33)',
      supplier_gstin: selectedSupplierObj.value?.gstin || '',
      bill_date: form.value.bill_date,
      warehouse: form.value.warehouse,
      payment_mode: form.value.payment_mode,
      amount_paid: form.value.payment_mode === 'Credit' ? 0 : (form.value.amount_paid || grandTotal.value),
      items: form.value.items
    };

    const res = await fetch('/api/method/easybill.api.v1.purchase.create_purchase_bill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: JSON.stringify(payload) })
    });

    // Persist to central document store
    addPurchaseBill({
      id: 'PUR-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      supplier_bill_no: form.value.supplier_bill_no,
      supplier_id: form.value.supplier_id,
      supplier_name: form.value.supplier_name,
      supplier_gstin: selectedSupplierObj.value?.gstin || '',
      supplier_state: selectedSupplierObj.value?.state || 'Tamil Nadu (33)',
      bill_date: form.value.bill_date,
      due_date: form.value.bill_date,
      taxable_amount: taxableSubtotal.value,
      cgst: isInterState.value ? 0 : totalTax.value / 2,
      sgst: isInterState.value ? 0 : totalTax.value / 2,
      igst: isInterState.value ? totalTax.value : 0,
      total_tax: totalTax.value,
      round_off: 0,
      grand_total: grandTotal.value,
      paid_amount: form.value.payment_mode === 'Credit' ? 0 : (form.value.amount_paid || grandTotal.value),
      outstanding_amount: form.value.payment_mode === 'Credit' ? grandTotal.value : 0,
      payment_status: form.value.payment_mode === 'Credit' ? 'Unpaid' : 'Paid',
      payment_mode: form.value.payment_mode,
      stock_updated: inwardStock,
      warehouse: form.value.warehouse,
      is_return: false,
      items: form.value.items.map(i => ({
        item_code: i.item_code,
        item_name: i.item_name,
        hsn: i.hsn,
        qty: i.qty,
        uom: i.uom,
        rate: i.rate,
        amount: i.qty * i.rate,
        gst_rate: i.gst_rate,
        batch_no: i.batch_no,
        expiry_date: i.expiry_date
      }))
    });

    toast.success(`Purchase Bill ${form.value.supplier_bill_no} saved successfully`);
    router.push('/purchase');
  } catch (err) {
    console.error('API create_purchase_bill failed:', err);
  }
}
</script>
