<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
      <!-- Stepper Progress Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">EasyBill Onboarding Setup (SCR-B1)</h1>
        <p class="text-xs text-slate-500 font-medium mt-1">Get your store ready for GST billing, thermal printing, and inventory in 4 steps</p>

        <!-- Steps Dots -->
        <div class="flex items-center justify-center space-x-3 mt-6">
          <div
            v-for="s in [1, 2, 3, 4]"
            :key="s"
            class="flex items-center"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                step === s ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' :
                step > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
              ]"
            >
              <Check v-if="step > s" class="w-4 h-4" />
              <span v-else>{{ s }}</span>
            </div>
            <div v-if="s < 4" class="w-12 h-1 bg-slate-200 mx-2 rounded-full" :class="{ 'bg-emerald-500': step > s }"></div>
          </div>
        </div>
      </div>

      <!-- Step Cards Container -->
      <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <!-- STEP 1: Store & Branding -->
        <div v-if="step === 1" class="space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-sm font-extrabold text-slate-900">Step 1: Store & Trade Details</h3>
            <p class="text-xs text-slate-400">Enter your store name and Tamil title for bilingual bill prints</p>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Store / Business Name *</label>
              <input
                v-model="wizard.store_name"
                type="text"
                placeholder="e.g. EasyBill Supermarket"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Tamil Business Name (தமிழ்)</label>
              <input
                v-model="wizard.store_name_ta"
                type="text"
                placeholder="e.g. ஈசிபில் சூப்பர்மார்க்கெட்"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-tamil"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  v-model="wizard.phone"
                  type="text"
                  placeholder="9842109876"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">City / Town</label>
                <input
                  v-model="wizard.city"
                  type="text"
                  placeholder="Coimbatore"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: GSTIN & Tax Settings -->
        <div v-if="step === 2" class="space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-sm font-extrabold text-slate-900">Step 2: GST & Tax Identification</h3>
            <p class="text-xs text-slate-400">State code auto-extracts from 15-character GSTIN</p>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">GSTIN Number</label>
              <input
                v-model="wizard.gstin"
                type="text"
                placeholder="33AABCT1234A1Z5"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none uppercase font-mono font-bold text-primary-700"
              />
              <p class="text-[10px] text-slate-400 mt-1">Leave blank if unregistered composition dealer</p>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">UPI VPA for Instant Payments</label>
              <input
                v-model="wizard.upi_vpa"
                type="text"
                placeholder="merchant@upi"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono font-bold text-emerald-700"
              />
            </div>
          </div>
        </div>

        <!-- STEP 3: Thermal Printer -->
        <div v-if="step === 3" class="space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-sm font-extrabold text-slate-900">Step 3: Thermal Receipt Hardware</h3>
            <p class="text-xs text-slate-400">Select your counter POS bill printer</p>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Printer Model</label>
              <select
                v-model="wizard.printer"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
              >
                <option value="TVS RP3200 Plus (80mm)">TVS RP3200 Plus (80mm Standard)</option>
                <option value="EPSON TM-T82X (80mm)">EPSON TM-T82X (80mm High Speed)</option>
                <option value="NGX Bluetooth (58mm)">NGX Bluetooth (58mm Portable)</option>
              </select>
            </div>

            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
              ✓ Fast continuous thermal printing enabled. ESC/POS cutter and cash drawer kick will activate automatically on bill settlement.
            </div>
          </div>
        </div>

        <!-- STEP 4: Seed Initial Catalog -->
        <div v-if="step === 4" class="space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-sm font-extrabold text-slate-900">Step 4: Sample Catalog & Ready to Launch</h3>
            <p class="text-xs text-slate-400">We have pre-loaded a GST-compliant starter catalog with barcode mappings</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div class="flex items-center space-x-2 text-slate-800 font-bold">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>10 Medical & General store catalog items loaded</span>
            </div>
            <div class="flex items-center space-x-2 text-slate-800 font-bold">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>Standard GST tax templates (0%, 5%, 12%, 18%) initialized</span>
            </div>
            <div class="flex items-center space-x-2 text-slate-800 font-bold">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>FIFO inventory valuation enabled in Main Godown (Stores - EB)</span>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="border-t border-slate-100 pt-5 flex items-center justify-between">
          <button
            v-if="step > 1"
            @click="step--"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
          >
            Back
          </button>
          <div v-else></div>

          <button
            v-if="step < 4"
            @click="step++"
            class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-1.5"
          >
            <span>Continue</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>

          <button
            v-else
            @click="finishSetup"
            class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center space-x-2"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Check, CheckCircle2, ArrowRight } from '@lucide/vue';

const router = useRouter();
const step = ref(1);

const wizard = ref({
  store_name: 'EasyBill Supermarket & Pharmacy',
  store_name_ta: 'ஈசிபில் சூப்பர்மார்க்கெட் & மருந்தகம்',
  phone: '9842198765',
  city: 'Coimbatore',
  gstin: '33AABCT1234A1Z5',
  upi_vpa: 'easybill@okaxis',
  printer: 'TVS RP3200 Plus (80mm)'
});

function finishSetup() {
  router.push('/bill/new');
}
</script>
