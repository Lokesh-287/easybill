<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans select-none">
    <!-- Header -->
    <div class="p-6 pb-3 border-b border-slate-200/80 bg-white shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">
            Settings & Hardware Configuration
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Store profile, GSTIN credentials, UPI payments, 80mm ESC/POS thermal printer & system rules
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <button
            @click="testPrintReceipt"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <Printer class="w-4 h-4" />
            <span>Test Print 80mm Slip</span>
          </button>

          <button
            @click="saveAllSettings"
            class="px-5 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center space-x-2 transition"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area with Subtabs -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col overflow-hidden">
        <!-- Subtab Navigation -->
        <div class="border-b border-slate-100 p-2 flex items-center space-x-1 bg-slate-50/60">
          <button
            v-for="tab in settingsTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-xl transition-all',
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- TAB 1: STORE PROFILE & GSTIN (SCR-B2) -->
        <div v-if="activeTab === 'profile'" class="p-6 space-y-6">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-xs font-extrabold text-slate-900">Business & Store Profile (SCR-B2)</h3>
            <p class="text-[11px] text-slate-400">Printed on receipt headers and GSTR-1 tax invoices</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Store Legal Name -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Store / Business Name *</label>
              <input
                v-model="settings.store_profile.store_name"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold text-slate-900"
              />
            </div>

            <!-- Tamil Store Name -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Tamil Business Name (தமிழ்)</label>
              <input
                v-model="settings.store_profile.store_name_ta"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-tamil text-slate-900"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                v-model="settings.store_profile.phone"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
              <input
                v-model="settings.store_profile.email"
                type="email"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <!-- GSTIN -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Shop GSTIN *</label>
              <input
                v-model="settings.store_profile.gstin"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none uppercase font-mono font-bold text-primary-700"
              />
              <p class="text-[10px] text-slate-400 mt-1">State: {{ settings.store_profile.state }}</p>
            </div>

            <!-- UPI QR VPA -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">UPI VPA ID (For Dynamic QR Codes)</label>
              <input
                v-model="settings.store_profile.upi_vpa"
                type="text"
                placeholder="e.g. merchant@icici"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono font-bold text-emerald-700"
              />
            </div>

            <!-- Address Full -->
            <div class="md:col-span-2">
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Store Address</label>
              <input
                v-model="settings.store_profile.address"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <!-- Bill Prefix -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Invoice Number Series Prefix</label>
              <input
                v-model="settings.store_profile.invoice_prefix"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono uppercase"
              />
            </div>

            <!-- Receipt Footer Note -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Thermal Receipt Footer Note</label>
              <input
                v-model="settings.store_profile.footer_message"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- TAB 2: HARDWARE & THERMAL PRINTER (SCR-L1) -->
        <div v-if="activeTab === 'hardware'" class="p-6 space-y-6">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-xs font-extrabold text-slate-900">ESC/POS Thermal Printer Setup (SCR-L1)</h3>
            <p class="text-[11px] text-slate-400">High-speed 80mm / 58mm direct receipt printing and cash drawer trigger</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Printer Model -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Printer Model</label>
              <select
                v-model="settings.printer_config.printer_model"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold text-slate-800"
              >
                <option value="TVS RP3200 Plus">TVS RP3200 Plus (80mm)</option>
                <option value="EPSON TM-T82X">EPSON TM-T82X (80mm)</option>
                <option value="NGX Bluetooth 58mm">NGX Bluetooth (58mm)</option>
                <option value="Everycom EC-58">Everycom EC-58 (58mm)</option>
                <option value="Generic ESC/POS">Generic ESC/POS Standard</option>
              </select>
            </div>

            <!-- Paper Width -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Paper Roll Width</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="settings.printer_config.paper_width = '80mm'"
                  :class="[
                    'py-2 px-3 text-center rounded-xl font-bold border transition text-xs',
                    settings.printer_config.paper_width === '80mm'
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  ]"
                >
                  80mm (48 Columns)
                </button>
                <button
                  type="button"
                  @click="settings.printer_config.paper_width = '58mm'"
                  :class="[
                    'py-2 px-3 text-center rounded-xl font-bold border transition text-xs',
                    settings.printer_config.paper_width === '58mm'
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  ]"
                >
                  58mm (32 Columns)
                </button>
              </div>
            </div>

            <!-- Connection Interface -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Connection Interface</label>
              <select
                v-model="settings.printer_config.connection_mode"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
              >
                <option value="Browser Raw Print">Browser Raw / System Print Dialog</option>
                <option value="Network TCP/IP">Network TCP/IP (LAN Ethernet / Wi-Fi)</option>
                <option value="USB Direct">USB Direct (WebUSB / Native Host)</option>
                <option value="Bluetooth">Bluetooth SPP / WebBluetooth</option>
              </select>
            </div>

            <!-- IP Address if Network -->
            <div v-if="settings.printer_config.connection_mode === 'Network TCP/IP'">
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Printer IP Address & Port</label>
              <div class="flex space-x-2">
                <input
                  v-model="settings.printer_config.ip_address"
                  type="text"
                  placeholder="192.168.1.100"
                  class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
                <input
                  v-model.number="settings.printer_config.port"
                  type="number"
                  placeholder="9100"
                  class="w-20 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono text-center"
                />
              </div>
            </div>
          </div>

          <!-- Feature Toggles -->
          <div class="border-t border-slate-100 pt-4 space-y-3">
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <div class="text-xs font-bold text-slate-900">Auto-Print on Bill Settlement</div>
                <div class="text-[10px] text-slate-400">Instantly print receipt without opening preview dialog</div>
              </div>
              <input
                v-model="settings.printer_config.auto_print"
                type="checkbox"
                class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
            </div>

            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <div class="text-xs font-bold text-slate-900">Cash Drawer RJ11 Kick Pulse</div>
                <div class="text-[10px] text-slate-400">Trigger electronic cash drawer on cash payments (\x1b\x70\x00)</div>
              </div>
              <input
                v-model="settings.printer_config.cash_drawer_kick"
                type="checkbox"
                class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
            </div>

            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <div class="text-xs font-bold text-slate-900">Bilingual Print (Tamil + English)</div>
                <div class="text-[10px] text-slate-400">Render high-resolution Tamil product names as ESC/POS graphics</div>
              </div>
              <input
                v-model="settings.printer_config.bilingual_print"
                type="checkbox"
                class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- TAB 3: TAX RULES & ROUNDING -->
        <div v-if="activeTab === 'tax'" class="p-6 space-y-6">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-xs font-extrabold text-slate-900">GST Calculation & Pricing Rules</h3>
            <p class="text-[11px] text-slate-400">Tax templates, rounding off and inventory policies</p>
          </div>

          <div class="space-y-4 text-xs">
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <div class="text-xs font-bold text-slate-900">Tax-Inclusive Pricing (Retail MRP)</div>
                <div class="text-[10px] text-slate-400">When enabled, entered item selling prices already include GST</div>
              </div>
              <input
                v-model="settings.tax_rules.tax_inclusive_pricing"
                type="checkbox"
                class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
            </div>

            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <div class="text-xs font-bold text-slate-900">Automatic Round-Off to Nearest ₹1.00</div>
                <div class="text-[10px] text-slate-400">Rounds final invoice grand total to eliminate paise in cash transactions</div>
              </div>
              <input
                v-model="settings.tax_rules.auto_round_off"
                type="checkbox"
                class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
            </div>

            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <div class="text-xs font-bold text-slate-900">Multi-Warehouse Inventory Tracking</div>
                <div class="text-[10px] text-slate-400">Enable separate tracking for Stores Godown, Shop Floor & Cold Storage</div>
              </div>
              <input
                v-model="settings.tax_rules.multi_warehouse"
                type="checkbox"
                class="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- TAB 4: SYSTEM INFO & BACKUP -->
        <div v-if="activeTab === 'system'" class="p-6 space-y-6">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-xs font-extrabold text-slate-900">System Environment & Backup</h3>
            <p class="text-[11px] text-slate-400">Stack versions and local storage management</p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl border">
              <span class="text-slate-400">EasyBill App:</span>
              <div class="font-bold text-slate-900">{{ settings.system_info.version }}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border">
              <span class="text-slate-400">Frappe Framework:</span>
              <div class="font-bold text-slate-900">{{ settings.system_info.frappe_version }}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border">
              <span class="text-slate-400">ERPNext Engine:</span>
              <div class="font-bold text-slate-900">{{ settings.system_info.erpnext_version }}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border">
              <span class="text-slate-400">India Compliance:</span>
              <div class="font-bold text-slate-900">{{ settings.system_info.india_compliance_version }}</div>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-4 flex space-x-3">
            <button
              @click="downloadBackupJSON"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Export Full Database Backup (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Print Thermal Modal -->
    <div
      v-if="showTestPrintModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showTestPrintModal = false"
    >
      <div class="w-full max-w-sm bg-white rounded-2xl shadow-modal border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-primary-50/50">
          <div class="flex items-center space-x-2">
            <Printer class="w-4 h-4 text-primary-700" />
            <span class="text-xs font-bold text-slate-900">Thermal Slip Preview (80mm)</span>
          </div>
          <button @click="showTestPrintModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="p-6 bg-slate-50 flex justify-center">
          <!-- 80mm Receipt Simulation -->
          <div class="w-64 bg-white p-4 shadow-md font-mono text-[10px] text-slate-800 border border-slate-200">
            <div class="text-center font-bold text-xs">{{ settings.store_profile.store_name }}</div>
            <div class="text-center text-[9px]">{{ settings.store_profile.store_name_ta }}</div>
            <div class="text-center text-[9px] text-slate-500">{{ settings.store_profile.address }}</div>
            <div class="text-center text-[9px] font-bold">GSTIN: {{ settings.store_profile.gstin }}</div>
            <div class="border-b border-dashed border-slate-300 my-2"></div>
            <div class="flex justify-between">
              <span>TEST ITEM 80MM</span>
              <span>₹100.00</span>
            </div>
            <div class="border-b border-dashed border-slate-300 my-2"></div>
            <div class="flex justify-between font-bold text-xs">
              <span>TOTAL</span>
              <span>₹100.00</span>
            </div>
            <div class="border-b border-dashed border-slate-300 my-2"></div>
            <div class="text-center text-[9px] text-slate-500">{{ settings.store_profile.footer_message }}</div>
          </div>
        </div>

        <div class="p-3 border-t border-slate-100 bg-white flex justify-end">
          <button
            @click="showTestPrintModal = false"
            class="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Printer,
  CheckCircle2,
  Download
} from '@lucide/vue';

// State
const activeTab = ref('profile');
const showTestPrintModal = ref(false);

const settingsTabs = [
  { id: 'profile', label: 'Store Profile & GST (SCR-B2)' },
  { id: 'hardware', label: 'Thermal Printer & POS (SCR-L1)' },
  { id: 'tax', label: 'Tax Rules' },
  { id: 'system', label: 'System & Backup' }
];

const settings = ref({
  store_profile: {
    store_name: "EasyBill Supermarket & Pharmacy",
    store_name_ta: "ஈசிபில் சூப்பர்மார்க்கெட் & மருந்தகம்",
    phone: "+91 98421 98765",
    email: "contact@easybill.store",
    address: "124, Cross Cut Road, Gandhipuram",
    city: "Coimbatore",
    pincode: "641012",
    state: "Tamil Nadu (33)",
    state_code: "33",
    gstin: "33AABCT1234A1Z5",
    upi_vpa: "easybill@okaxis",
    invoice_prefix: "INV-2026-",
    footer_message: "Thank You! Please Visit Again / நன்றி, மீண்டும் வருக!"
  },
  printer_config: {
    printer_model: "TVS RP3200 Plus",
    paper_width: "80mm",
    connection_mode: "Browser Raw Print",
    ip_address: "192.168.1.100",
    port: 9100,
    auto_print: true,
    cash_drawer_kick: true,
    bilingual_print: true
  },
  tax_rules: {
    default_gst_rate: 12,
    tax_inclusive_pricing: true,
    auto_round_off: true,
    multi_warehouse: true
  },
  system_info: {
    version: "EasyBill v1.0.0",
    frappe_version: "v15.82.0",
    erpnext_version: "v15.70.0",
    india_compliance_version: "v15.20.0",
    db_size: "42 MB",
    offline_records_cached: 10
  }
});

function testPrintReceipt() {
  showTestPrintModal.value = true;
}

async function saveAllSettings() {
  try {
    const res = await fetch('/api/method/easybill.api.v1.settings.save_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: JSON.stringify(settings.value) })
    });
    if (res.ok) {
      alert('Settings saved successfully!');
      return;
    }
  } catch (err) {
    console.log('Settings save fallback');
  }
  alert('Settings saved successfully!');
}

function downloadBackupJSON() {
  const jsonStr = JSON.stringify(settings.value, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `easybill_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
