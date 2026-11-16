<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto"
    @click.self="closeModal"
    @keydown.esc="closeModal"
  >
    <!-- ======================================================== -->
    <!-- FRAPPE-STYLE TOP CONTROL TOOLBAR (Hidden during print)    -->
    <!-- ======================================================== -->
    <div
      class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-4 print:hidden transition-all duration-200"
    >
      <div class="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <!-- Title & Document Number -->
        <div class="flex items-center space-x-2.5">
          <div class="p-1.5 bg-primary-600 rounded-lg text-white">
            <FileText class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold tracking-wide text-white">Print Format Preview</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {{ invoiceData.number || 'INV-2026-0042' }}
              </span>
            </div>
            <p class="text-[10px] text-slate-400">Frappe-style Statutory GST Print Preview Engine</p>
          </div>
        </div>

        <!-- Format Selector & Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Format Dropdown -->
          <div class="flex items-center bg-slate-800 rounded-xl px-2 py-1 border border-slate-700">
            <span class="text-[11px] font-semibold text-slate-400 mr-1.5 hidden sm:inline">Format:</span>
            <select
              data-testid="print-format-select"
              v-model="selectedFormat"
              class="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option class="bg-slate-900 text-white" value="a4_gst">Standard GST Tax Invoice (A4)</option>
              <option class="bg-slate-900 text-white" value="a5_gst">Modern Compact Tax Invoice (A5)</option>
              <option class="bg-slate-900 text-white" value="thermal_80">Retail Thermal Receipt (80mm / 3")</option>
              <option class="bg-slate-900 text-white" value="thermal_58">Portable Bluetooth Receipt (58mm / 2")</option>
              <option class="bg-slate-900 text-white" value="delivery_challan">Delivery Challan / Transport Memo</option>
            </select>
          </div>

          <!-- Document Copy Selector (A4/A5 only) -->
          <div v-if="selectedFormat === 'a4_gst' || selectedFormat === 'a5_gst'" class="flex items-center bg-slate-800 rounded-xl px-2 py-1 border border-slate-700">
            <select
              v-model="selectedCopy"
              class="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option class="bg-slate-900 text-white" value="Original for Recipient">Original for Recipient</option>
              <option class="bg-slate-900 text-white" value="Duplicate for Transporter">Duplicate for Transporter</option>
              <option class="bg-slate-900 text-white" value="Triplicate for Supplier">Triplicate for Supplier</option>
            </select>
          </div>

          <!-- Close Button -->
          <button
            @click="closeModal"
            class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Close Preview (Esc)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Secondary Filter Toggles Bar -->
      <div class="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex flex-wrap items-center gap-4 text-slate-700">
          <label class="flex items-center space-x-1.5 cursor-pointer hover:text-slate-900 select-none">
            <input type="checkbox" v-model="withLetterhead" class="rounded text-primary-600 focus:ring-0" />
            <span class="font-semibold text-[11px]">With Letterhead</span>
          </label>

          <label v-if="selectedFormat === 'a4_gst' || selectedFormat === 'a5_gst'" class="flex items-center space-x-1.5 cursor-pointer hover:text-slate-900 select-none">
            <input type="checkbox" v-model="showTaxBreakup" class="rounded text-primary-600 focus:ring-0" />
            <span class="font-semibold text-[11px]">GST Tax Breakdown</span>
          </label>

          <label class="flex items-center space-x-1.5 cursor-pointer hover:text-slate-900 select-none">
            <input type="checkbox" v-model="showUpiQr" class="rounded text-primary-600 focus:ring-0" />
            <span class="font-semibold text-[11px]">Dynamic UPI QR</span>
          </label>

          <label v-if="selectedFormat === 'a4_gst' || selectedFormat === 'a5_gst'" class="flex items-center space-x-1.5 cursor-pointer hover:text-slate-900 select-none">
            <input type="checkbox" v-model="showBankDetails" class="rounded text-primary-600 focus:ring-0" />
            <span class="font-semibold text-[11px]">Bank Details</span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <!-- WhatsApp Share -->
          <button
            @click="shareOnWhatsApp"
            class="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 font-semibold text-xs flex items-center space-x-1 transition"
            title="Send Invoice on WhatsApp"
          >
            <Share2 class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">WhatsApp</span>
          </button>

          <!-- Bluetooth Thermal Direct Print -->
          <button
            @click="printViaBluetooth"
            class="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 font-semibold text-xs flex items-center space-x-1 transition"
            title="Stream to Bluetooth ESC/POS Thermal Printer"
          >
            <Printer class="w-3.5 h-3.5 text-indigo-600" />
            <span class="hidden sm:inline">BT Print</span>
          </button>

          <!-- Native Print / PDF (Ctrl+P) -->
          <button
            @click="triggerSystemPrint"
            class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-xs font-bold text-xs flex items-center space-x-1.5 transition"
            title="Print or Save PDF (Ctrl+P)"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>Print (Ctrl+P)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- PREVIEW CANVAS (Real Paper Sheet Rendering)               -->
    <!-- ======================================================== -->
    <div class="w-full flex justify-center pb-10 print:p-0 print:m-0 print:w-full">
      
      <!-- ---------------------------------------------------- -->
      <!-- FORMAT 1: A4 Standard GST Tax Invoice                -->
      <!-- ---------------------------------------------------- -->
      <div
        v-if="selectedFormat === 'a4_gst' || selectedFormat === 'delivery_challan'"
        id="easybill-printable-sheet"
        class="w-full max-w-4xl bg-white text-slate-900 border border-slate-300 shadow-2xl rounded-sm p-8 print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full text-xs leading-normal font-sans"
      >
        <!-- Header / Letterhead -->
        <div v-if="withLetterhead" class="border-b-2 border-slate-900 pb-4 mb-4">
          <div class="flex justify-between items-start">
            <div class="space-y-0.5">
              <h1 class="text-xl font-black tracking-tight text-slate-900">{{ store.name }}</h1>
              <p class="text-xs text-slate-600 font-medium">{{ store.address }}</p>
              <p class="text-xs text-slate-600 font-medium">{{ store.city }} - {{ store.pincode }} • State: {{ store.state }} (State Code: {{ store.state_code }})</p>
              <div class="flex flex-wrap items-center gap-x-4 pt-1 text-[11px] font-semibold text-slate-700">
                <span>GSTIN: <strong class="font-mono text-slate-900">{{ store.gstin }}</strong></span>
                <span>PAN: <strong class="font-mono text-slate-900">{{ store.pan }}</strong></span>
                <span>FSSAI: <strong class="font-mono text-slate-900">{{ store.fssai }}</strong></span>
                <span>Ph: {{ store.phone }}</span>
              </div>
            </div>
            <!-- Document Badge -->
            <div class="text-right">
              <div class="inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-sm tracking-wider uppercase rounded-xs">
                {{ selectedFormat === 'delivery_challan' ? 'DELIVERY CHALLAN' : 'TAX INVOICE' }}
              </div>
              <div class="text-[10px] text-slate-500 font-medium mt-1">
                (Issued under Sec 31 of CGST Act, 2017)
              </div>
              <div class="text-[11px] font-bold text-slate-800 mt-0.5">
                {{ selectedCopy }}
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice & Parties Metadata Grid -->
        <div class="border border-slate-300 rounded-sm mb-4 overflow-hidden">
          <div class="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-slate-50/70 p-2.5 text-[11px]">
            <div class="space-y-1">
              <div>Invoice No: <strong class="font-mono font-bold text-slate-900 text-xs">{{ invoiceData.number }}</strong></div>
              <div>Invoice Date: <strong class="font-mono">{{ invoiceData.date }}</strong> • Time: <strong class="font-mono">{{ invoiceData.time || '17:55' }}</strong></div>
              <div>Place of Supply: <strong>{{ store.state }} ({{ store.state_code }})</strong></div>
            </div>
            <div class="space-y-1 pl-3">
              <div>Reverse Charge: <strong>No</strong></div>
              <div>Payment Mode: <strong class="uppercase text-primary-700">{{ invoiceData.mode || 'CASH' }}</strong></div>
              <div>Godown / Counter: <strong>{{ invoiceData.godown || 'Main Godown (Shelf A1)' }}</strong></div>
            </div>
          </div>

          <!-- Billed To & Shipped To Grid -->
          <div class="grid grid-cols-2 divide-x divide-slate-300 p-2.5 text-[11px]">
            <div class="space-y-0.5 pr-2">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Details of Receiver / Billed To:</div>
              <div class="font-bold text-slate-900 text-xs">{{ customer.name }}</div>
              <div class="text-slate-600">{{ customer.address || 'Walk-in Retail Customer' }}</div>
              <div class="text-slate-600">Phone: {{ customer.phone || 'N/A' }}</div>
              <div v-if="customer.gstin" class="pt-0.5">GSTIN: <strong class="font-mono">{{ customer.gstin }}</strong></div>
              <div>State: {{ customer.state || store.state }} ({{ customer.state_code || store.state_code }})</div>
            </div>
            <div class="space-y-0.5 pl-3">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Details of Consignee / Shipped To:</div>
              <div class="font-bold text-slate-900 text-xs">{{ customer.name }}</div>
              <div class="text-slate-600">{{ customer.address || 'Over the counter delivery' }}</div>
              <div class="text-slate-600">State: {{ customer.state || store.state }} ({{ customer.state_code || store.state_code }})</div>
            </div>
          </div>
        </div>

        <!-- Line Items Tabular Table -->
        <table class="w-full border-collapse border border-slate-300 mb-4 text-[11px]">
          <thead>
            <tr class="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-300">
              <th class="py-1.5 px-2 text-center w-8 border-r border-slate-300">#</th>
              <th class="py-1.5 px-2 text-left border-r border-slate-300">Item Description</th>
              <th class="py-1.5 px-2 text-center w-16 border-r border-slate-300 font-mono">HSN/SAC</th>
              <th class="py-1.5 px-2 text-center w-14 border-r border-slate-300">Qty</th>
              <th class="py-1.5 px-2 text-right w-16 border-r border-slate-300 font-mono">Rate (₹)</th>
              <th class="py-1.5 px-2 text-right w-14 border-r border-slate-300 font-mono">Disc</th>
              <th class="py-1.5 px-2 text-right w-20 border-r border-slate-300 font-mono">Taxable (₹)</th>
              <th class="py-1.5 px-2 text-center w-14 border-r border-slate-300 font-mono">GST %</th>
              <th class="py-1.5 px-2 text-right w-20 font-mono">Total (₹)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(item, idx) in invoiceData.items" :key="item.code || idx" class="hover:bg-slate-50/50">
              <td class="py-1.5 px-2 text-center font-mono text-slate-500 border-r border-slate-300">{{ idx + 1 }}</td>
              <td class="py-1.5 px-2 border-r border-slate-300">
                <div class="font-semibold text-slate-900">{{ item.name }}</div>
                <div v-if="item.name_ta" class="text-[10px] text-slate-500 font-tamil">{{ item.name_ta }}</div>
              </td>
              <td class="py-1.5 px-2 text-center font-mono border-r border-slate-300 text-slate-600">{{ item.hsn || '3004' }}</td>
              <td class="py-1.5 px-2 text-center font-mono font-bold border-r border-slate-300">{{ item.qty }} {{ item.unit || 'Pcs' }}</td>
              <td class="py-1.5 px-2 text-right font-mono border-r border-slate-300">{{ formatMoney(item.price) }}</td>
              <td class="py-1.5 px-2 text-right font-mono border-r border-slate-300 text-slate-500">{{ item.discount ? item.discount + '%' : '-' }}</td>
              <td class="py-1.5 px-2 text-right font-mono border-r border-slate-300">{{ formatMoney(getItemTaxable(item)) }}</td>
              <td class="py-1.5 px-2 text-center font-mono border-r border-slate-300">{{ item.gst_rate || 12 }}%</td>
              <td class="py-1.5 px-2 text-right font-mono font-bold text-slate-900">{{ formatMoney(item.price * item.qty) }}</td>
            </tr>
          </tbody>
          <!-- Table Footer Subtotals -->
          <tfoot>
            <tr class="bg-slate-50 font-bold border-t-2 border-slate-300 text-[11px]">
              <td colspan="3" class="py-1.5 px-2 text-right border-r border-slate-300">Total Items: {{ invoiceData.items?.length }}</td>
              <td class="py-1.5 px-2 text-center font-mono border-r border-slate-300">{{ totalQuantity }}</td>
              <td colspan="2" class="py-1.5 px-2 text-right border-r border-slate-300">Subtotal:</td>
              <td class="py-1.5 px-2 text-right font-mono border-r border-slate-300">₹{{ formatMoney(invoiceData.taxable) }}</td>
              <td class="py-1.5 px-2 border-r border-slate-300"></td>
              <td class="py-1.5 px-2 text-right font-mono text-slate-900">₹{{ formatMoney(rawTotal) }}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Totals & Invariants Grid -->
        <div class="grid grid-cols-12 gap-4 mb-4">
          <!-- Left Column: Amount in Words & Bank Details -->
          <div class="col-span-7 space-y-3">
            <div class="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Invoice Amount in Words:</div>
              <div class="font-bold text-slate-900 italic text-xs leading-snug">
                {{ amountInWords }}
              </div>
            </div>

            <!-- Bank & UPI Payment Details -->
            <div v-if="showBankDetails || showUpiQr" class="p-2.5 border border-slate-200 rounded flex items-center justify-between gap-3 bg-white">
              <div v-if="showBankDetails" class="space-y-0.5 text-[10px]">
                <div class="font-bold text-slate-800 uppercase tracking-wider text-[9px]">Bank Remittance Account:</div>
                <div>Bank Name: <strong>{{ store.bank_name }}</strong></div>
                <div>Account No: <strong class="font-mono">{{ store.bank_account }}</strong></div>
                <div>IFSC Code: <strong class="font-mono">{{ store.bank_ifsc }}</strong></div>
                <div>Branch: <strong>{{ store.bank_branch }}</strong></div>
              </div>

              <!-- UPI Scan to Pay QR Code -->
              <div v-if="showUpiQr" class="flex flex-col items-center shrink-0">
                <img v-if="upiQrDataUrl" :src="upiQrDataUrl" alt="UPI QR Code" class="w-20 h-20 border border-slate-200 rounded p-1" />
                <span class="text-[8px] font-bold text-slate-500 mt-0.5 font-mono">SCAN TO PAY (UPI)</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Tax Calculation Summary -->
          <div class="col-span-5">
            <div class="border border-slate-300 rounded overflow-hidden text-[11px]">
              <div class="flex justify-between py-1 px-2.5 border-b border-slate-200 bg-slate-50/50">
                <span class="text-slate-600">Taxable Subtotal:</span>
                <span class="font-mono font-semibold">₹{{ formatMoney(invoiceData.taxable) }}</span>
              </div>
              <div class="flex justify-between py-1 px-2.5 border-b border-slate-200">
                <span class="text-slate-600">CGST (Central Tax):</span>
                <span class="font-mono">₹{{ formatMoney(invoiceData.tax / 2) }}</span>
              </div>
              <div class="flex justify-between py-1 px-2.5 border-b border-slate-200">
                <span class="text-slate-600">SGST (State Tax):</span>
                <span class="font-mono">₹{{ formatMoney(invoiceData.tax / 2) }}</span>
              </div>
              <div class="flex justify-between py-1 px-2.5 border-b border-slate-200 text-slate-500 text-[10px]">
                <span>Round Off:</span>
                <span class="font-mono">{{ roundOffString }}</span>
              </div>
              <div class="flex justify-between py-2 px-2.5 bg-slate-900 text-white font-bold text-xs">
                <span>NET PAYABLE:</span>
                <span class="font-mono text-sm">₹{{ formatMoney(invoiceData.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statutory GST Tax Analysis Breakup Table (Section 31 requirement) -->
        <div v-if="showTaxBreakup" class="mb-4">
          <div class="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Statutory GST Tax Breakup Analysis (INR)
          </div>
          <table class="w-full border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr class="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                <th class="py-1 px-2 text-center border-r border-slate-300 font-mono">HSN/SAC</th>
                <th class="py-1 px-2 text-right border-r border-slate-300 font-mono">Taxable Value</th>
                <th class="py-1 px-2 text-center border-r border-slate-300 font-mono">Central Tax Rate</th>
                <th class="py-1 px-2 text-right border-r border-slate-300 font-mono">Central Tax Amt</th>
                <th class="py-1 px-2 text-center border-r border-slate-300 font-mono">State Tax Rate</th>
                <th class="py-1 px-2 text-right border-r border-slate-300 font-mono">State Tax Amt</th>
                <th class="py-1 px-2 text-right font-mono">Total Tax</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="taxRow in taxBreakupRows" :key="taxRow.hsn" class="text-center font-mono">
                <td class="py-1 px-2 border-r border-slate-300 font-bold">{{ taxRow.hsn }}</td>
                <td class="py-1 px-2 text-right border-r border-slate-300">{{ formatMoney(taxRow.taxable) }}</td>
                <td class="py-1 px-2 border-r border-slate-300">{{ taxRow.cgst_rate }}%</td>
                <td class="py-1 px-2 text-right border-r border-slate-300">{{ formatMoney(taxRow.cgst_amt) }}</td>
                <td class="py-1 px-2 border-r border-slate-300">{{ taxRow.sgst_rate }}%</td>
                <td class="py-1 px-2 text-right border-r border-slate-300">{{ formatMoney(taxRow.sgst_amt) }}</td>
                <td class="py-1 px-2 text-right font-bold">{{ formatMoney(taxRow.total_tax) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Terms, Declaration & Signatory -->
        <div class="border-t border-slate-300 pt-3 flex justify-between items-end text-[10px]">
          <div class="space-y-1 max-w-sm text-slate-500 leading-snug">
            <div class="font-bold text-slate-700">Terms & Conditions:</div>
            <div>1. Goods once sold will not be accepted back without original tax invoice.</div>
            <div>2. Any disputes are subject to Coimbatore jurisdiction only.</div>
            <div>3. Certified that the particulars given above are true and correct.</div>
          </div>
          <div class="text-right space-y-8">
            <div class="text-slate-800 font-bold">For {{ store.name }}</div>
            <div class="text-[10px] border-t border-slate-400 pt-1 font-semibold text-slate-600">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>

      <!-- ---------------------------------------------------- -->
      <!-- FORMAT 2: A5 Compact Tax Invoice                     -->
      <!-- ---------------------------------------------------- -->
      <div
        v-else-if="selectedFormat === 'a5_gst'"
        id="easybill-printable-sheet"
        class="w-full max-w-2xl bg-white text-slate-900 border border-slate-300 shadow-2xl rounded-sm p-6 print:p-0 print:border-none print:shadow-none print:w-full text-xs leading-tight font-sans"
      >
        <div class="border-b-2 border-slate-900 pb-2 mb-3 flex justify-between items-start">
          <div>
            <h2 class="text-base font-black tracking-tight text-slate-900">{{ store.name }}</h2>
            <div class="text-[10px] text-slate-600">{{ store.address }}, {{ store.city }} • Ph: {{ store.phone }}</div>
            <div class="text-[10px] font-mono font-bold text-slate-800">GSTIN: {{ store.gstin }}</div>
          </div>
          <div class="text-right">
            <span class="px-2 py-0.5 bg-slate-900 text-white font-extrabold text-xs uppercase">TAX INVOICE (A5)</span>
            <div class="text-[10px] font-bold font-mono mt-0.5">{{ invoiceData.number }}</div>
            <div class="text-[10px] text-slate-500">{{ invoiceData.date }}</div>
          </div>
        </div>

        <!-- Customer & Meta -->
        <div class="bg-slate-50 border border-slate-200 rounded p-2 mb-2 flex justify-between text-[10px]">
          <div>Billed To: <strong class="text-slate-900">{{ customer.name }}</strong> ({{ customer.phone || 'Cash Customer' }})</div>
          <div>Mode: <strong class="uppercase font-mono text-primary-700">{{ invoiceData.mode || 'CASH' }}</strong></div>
        </div>

        <!-- Compact Items -->
        <table class="w-full border-collapse border border-slate-300 mb-3 text-[10px]">
          <thead>
            <tr class="bg-slate-100 font-bold border-b border-slate-300 text-slate-800">
              <th class="py-1 px-1.5 text-left">Item Description</th>
              <th class="py-1 px-1.5 text-center font-mono w-12">Qty</th>
              <th class="py-1 px-1.5 text-right font-mono w-14">Rate</th>
              <th class="py-1 px-1.5 text-center font-mono w-12">GST</th>
              <th class="py-1 px-1.5 text-right font-mono w-16">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in invoiceData.items" :key="item.code">
              <td class="py-1 px-1.5 font-semibold text-slate-900">{{ item.name }}</td>
              <td class="py-1 px-1.5 text-center font-mono">{{ item.qty }}</td>
              <td class="py-1 px-1.5 text-right font-mono">{{ formatMoney(item.price) }}</td>
              <td class="py-1 px-1.5 text-center font-mono">{{ item.gst_rate }}%</td>
              <td class="py-1 px-1.5 text-right font-mono font-bold">{{ formatMoney(item.price * item.qty) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Compact Summary -->
        <div class="flex justify-between items-center border-t border-slate-300 pt-2 text-[11px]">
          <div class="text-[10px] text-slate-500">
            <div>Items: {{ invoiceData.items?.length }} • Taxable: ₹{{ formatMoney(invoiceData.taxable) }}</div>
            <div>Total GST: ₹{{ formatMoney(invoiceData.tax) }}</div>
          </div>
          <div class="text-right">
            <div class="text-[10px] font-bold text-slate-600">GRAND TOTAL:</div>
            <div class="text-base font-black font-mono text-slate-900">₹{{ formatMoney(invoiceData.total) }}</div>
          </div>
        </div>
      </div>

      <!-- ---------------------------------------------------- -->
      <!-- FORMAT 3 & 4: Retail Thermal Receipts (80mm & 58mm)   -->
      <!-- ---------------------------------------------------- -->
      <div
        v-else-if="selectedFormat === 'thermal_80' || selectedFormat === 'thermal_58'"
        id="easybill-printable-sheet"
        :class="[
          'bg-white text-slate-900 border border-dashed border-slate-400 shadow-2xl rounded-xs p-4 print:p-0 print:border-none print:shadow-none font-mono leading-tight select-text',
          selectedFormat === 'thermal_80' ? 'w-[340px] text-[11px]' : 'w-[260px] text-[10px]'
        ]"
      >
        <!-- Store Header -->
        <div class="text-center pb-2 border-b border-dashed border-slate-400">
          <div class="font-black text-sm tracking-wider uppercase">{{ store.name }}</div>
          <div class="text-[10px]">{{ store.address }}</div>
          <div class="text-[10px]">{{ store.city }} - {{ store.pincode }}</div>
          <div class="text-[10px] font-bold mt-0.5">GSTIN: {{ store.gstin }}</div>
          <div class="text-[9px]">Ph: {{ store.phone }}</div>
        </div>

        <!-- Meta -->
        <div class="py-1.5 border-b border-dashed border-slate-400 text-[10px]">
          <div class="flex justify-between">
            <span>Bill: {{ invoiceData.number }}</span>
            <span>{{ invoiceData.date }}</span>
          </div>
          <div class="flex justify-between">
            <span>Customer: {{ customer.name }}</span>
            <span>Cashier: POS-1</span>
          </div>
        </div>

        <!-- Items -->
        <div class="py-2 border-b border-dashed border-slate-400">
          <div class="flex justify-between font-bold pb-1 text-[10px]">
            <span class="w-1/2">Item</span>
            <span class="w-1/6 text-right">Qty</span>
            <span class="w-1/3 text-right">Amt</span>
          </div>
          <div v-for="item in invoiceData.items" :key="item.code" class="flex justify-between py-0.5">
            <span class="w-1/2 truncate">{{ item.name }}</span>
            <span class="w-1/6 text-right">{{ item.qty }}</span>
            <span class="w-1/3 text-right">₹{{ formatMoney(item.price * item.qty) }}</span>
          </div>
        </div>

        <!-- Totals -->
        <div class="py-2 border-b border-dashed border-slate-400 space-y-1 text-right text-[10px]">
          <div class="flex justify-between">
            <span>Taxable Subtotal:</span>
            <span>₹{{ formatMoney(invoiceData.taxable) }}</span>
          </div>
          <div class="flex justify-between">
            <span>CGST (6%):</span>
            <span>₹{{ formatMoney(invoiceData.tax / 2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>SGST (6%):</span>
            <span>₹{{ formatMoney(invoiceData.tax / 2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-xs pt-1 border-t border-slate-300 text-slate-900">
            <span>GRAND TOTAL:</span>
            <span>₹{{ formatMoney(invoiceData.total) }}</span>
          </div>
          <div class="flex justify-between text-slate-600 pt-0.5">
            <span>Tender ({{ (invoiceData.mode || 'CASH').toUpperCase() }}):</span>
            <span>₹{{ formatMoney(invoiceData.total) }}</span>
          </div>
        </div>

        <!-- Thermal UPI QR -->
        <div v-if="showUpiQr" class="py-2 text-center border-b border-dashed border-slate-400 flex flex-col items-center">
          <img v-if="upiQrDataUrl" :src="upiQrDataUrl" alt="UPI QR" class="w-20 h-20" />
          <div class="text-[9px] mt-0.5 font-bold">Scan & Pay via UPI</div>
        </div>

        <div class="text-center pt-2 text-[10px] space-y-0.5 text-slate-600">
          <div>Thank you for visiting {{ store.name }}!</div>
          <div class="font-tamil">மீண்டும் வருக</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import QRCode from 'qrcode';
import {
  FileText,
  Printer,
  Share2,
  X
} from 'lucide-vue-next';
import { bluetoothPrinter } from '../services/bluetoothPrinter';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    invoice?: any;
    storeProfile?: any;
  }>(),
  {
    modelValue: false,
    invoice: () => ({}),
    storeProfile: () => ({})
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'printed'): void;
}>();

// Store Details
const store = computed(() => ({
  name: props.storeProfile?.store_name || 'EASYBILL SUPERMARKET & PHARMACY',
  address: props.storeProfile?.address_line1 || '104, Cross Cut Road, Gandhipuram',
  city: props.storeProfile?.city || 'Coimbatore',
  pincode: props.storeProfile?.pincode || '641012',
  state: props.storeProfile?.state || 'Tamil Nadu',
  state_code: props.storeProfile?.state_code || '33',
  gstin: props.storeProfile?.gstin || '33AAAAA0000A1Z5',
  pan: props.storeProfile?.pan || 'AAAAA0000A',
  fssai: props.storeProfile?.fssai_number || '12423008000123',
  phone: props.storeProfile?.phone || '+91 98765 43210',
  bank_name: props.storeProfile?.bank_name || 'Bank of Baroda',
  bank_account: props.storeProfile?.bank_account_no || '9876543210001',
  bank_ifsc: props.storeProfile?.bank_ifsc || 'BARB0GANDHI',
  bank_branch: props.storeProfile?.bank_branch || 'Gandhipuram, Coimbatore'
}));

// State
const selectedFormat = ref<'a4_gst' | 'a5_gst' | 'thermal_80' | 'thermal_58' | 'delivery_challan'>('a4_gst');
const selectedCopy = ref('Original for Recipient');
const withLetterhead = ref(true);
const showTaxBreakup = ref(true);
const showUpiQr = ref(true);
const showBankDetails = ref(true);
const upiQrDataUrl = ref('');

// Normalized invoice data
const invoiceData = computed(() => {
  const inv = props.invoice || {};
  return {
    number: inv.number || inv.invoice_number || 'INV-2026-0042',
    date: inv.date || inv.posting_date || new Date().toLocaleDateString('en-IN'),
    time: inv.time || '17:55',
    customer: inv.customer || 'Walk-in Customer',
    items: inv.items || [
      { code: 'MED-001', name: 'Paracetamol 500mg (Dolo 650)', name_ta: 'டோலோ 650', hsn: '3004', price: 32.50, qty: 2, gst_rate: 12, unit: 'Strip' },
      { code: 'MED-003', name: 'Amoxicillin 500mg Capsules', name_ta: 'அமாக்ஸிசில்லிங்', hsn: '3004', price: 85.00, qty: 1, gst_rate: 12, unit: 'Strip' }
    ],
    taxable: inv.taxable || 133.93,
    tax: inv.tax || 16.07,
    total: inv.total || inv.grand_total || 150.00,
    mode: inv.mode || inv.payment_mode || 'Cash',
    godown: inv.godown || 'Main Godown (Shelf A1)'
  };
});

// Normalized customer
const customer = computed(() => {
  const inv = props.invoice || {};
  return {
    name: inv.customer_name || inv.customer || 'Walk-in Retail Customer',
    phone: inv.customer_phone || '+91 94433 22110',
    address: inv.customer_address || '12/4 Cross Street, Coimbatore',
    gstin: inv.customer_gstin || '',
    state: 'Tamil Nadu',
    state_code: '33'
  };
});

const totalQuantity = computed(() => {
  return (invoiceData.value.items || []).reduce((sum: number, it: any) => sum + (Number(it.qty) || 0), 0);
});

const rawTotal = computed(() => {
  return (invoiceData.value.items || []).reduce((sum: number, it: any) => sum + ((it.price || 0) * (it.qty || 1)), 0);
});

const roundOffString = computed(() => {
  const diff = (invoiceData.value.total || 0) - (invoiceData.value.taxable + invoiceData.value.tax);
  if (Math.abs(diff) < 0.01) return '₹0.00';
  return diff > 0 ? `+₹${diff.toFixed(2)}` : `-₹${Math.abs(diff).toFixed(2)}`;
});

// Tax Breakup Analysis Rows
const taxBreakupRows = computed(() => {
  const groups: Record<string, { hsn: string; taxable: number; gst_rate: number }> = {};
  for (const item of invoiceData.value.items || []) {
    const hsn = item.hsn || '3004';
    const rate = item.gst_rate || 12;
    const taxable = getItemTaxable(item);
    if (!groups[hsn]) {
      groups[hsn] = { hsn, taxable: 0, gst_rate: rate };
    }
    groups[hsn].taxable += taxable;
  }

  return Object.values(groups).map(g => {
    const halfRate = g.gst_rate / 2;
    const cgst_amt = (g.taxable * halfRate) / 100;
    const sgst_amt = (g.taxable * halfRate) / 100;
    return {
      hsn: g.hsn,
      taxable: g.taxable,
      cgst_rate: halfRate,
      cgst_amt,
      sgst_rate: halfRate,
      sgst_amt,
      total_tax: cgst_amt + sgst_amt
    };
  });
});

function getItemTaxable(item: any): number {
  const gross = (item.price || 0) * (item.qty || 1);
  const gst = item.gst_rate || 12;
  // Inclusive calculation
  return gross / (1 + gst / 100);
}

function formatMoney(amount: number): string {
  return Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Convert Number to Indian Words
const amountInWords = computed(() => {
  const num = Math.round(invoiceData.value.total || 0);
  return 'INR ' + convertToIndianWords(num) + ' Only';
});

function convertToIndianWords(n: number): string {
  if (n === 0) return 'Zero';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function helper(num: number): string {
    if (num === 0) return '';
    if (num < 20) return a[num] + ' ';
    if (num < 100) return b[Math.floor(num / 10)] + ' ' + helper(num % 10);
    if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred ' + helper(num % 100);
    if (num < 100000) return helper(Math.floor(num / 1000)) + 'Thousand ' + helper(num % 1000);
    if (num < 10000000) return helper(Math.floor(num / 100000)) + 'Lakh ' + helper(num % 100000);
    return helper(Math.floor(num / 10000000)) + 'Crore ' + helper(num % 10000000);
  }

  return helper(n).trim();
}

// Generate Dynamic UPI QR Code
async function generateUpiQr() {
  try {
    const pa = 'easybill@barodampay';
    const pn = encodeURIComponent(store.value.name);
    const am = (invoiceData.value.total || 0).toFixed(2);
    const tn = encodeURIComponent(`Bill ${invoiceData.value.number}`);
    const upiUri = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
    upiQrDataUrl.value = await QRCode.toDataURL(upiUri, {
      margin: 1,
      width: 140,
      color: { dark: '#0f172a', light: '#ffffff' }
    });
  } catch (err) {
    console.error('QR code generation error:', err);
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      generateUpiQr();
    }
  },
  { immediate: true }
);

function closeModal() {
  emit('update:modelValue', false);
}

function triggerSystemPrint() {
  window.print();
  emit('printed');
}

async function printViaBluetooth() {
  try {
    await bluetoothPrinter.printReceipt({
      invoice_no: invoiceData.value.number,
      customer_name: customer.value.name,
      items: invoiceData.value.items,
      taxable_subtotal: invoiceData.value.taxable,
      cgst: invoiceData.value.tax / 2,
      sgst: invoiceData.value.tax / 2,
      grand_total: invoiceData.value.total,
      payment_mode: invoiceData.value.mode,
      date_str: invoiceData.value.date
    });
    emit('printed');
  } catch (err) {
    console.error('Bluetooth print error:', err);
  }
}

function shareOnWhatsApp() {
  const phone = customer.value.phone?.replace(/[^0-9]/g, '') || '';
  const text = encodeURIComponent(
    `Hello ${customer.value.name}, here is your tax invoice ${invoiceData.value.number} for ₹${formatMoney(invoiceData.value.total)} from ${store.value.name}. Thank you for shopping with us!`
  );
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #easybill-printable-sheet, #easybill-printable-sheet * {
    visibility: visible;
  }
  #easybill-printable-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
