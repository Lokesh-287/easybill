/**
 * EasyBill Central Document & Transaction Data Store
 * Provides unified, reactive, local-first persistence across all ERP modules:
 * Sales Invoices, Purchase Bills, Goods Receipt Notes, Delivery Challans,
 * Stock Movement Ledger, Batches, Serials, and Cash Day Book.
 */
import { ref, computed } from 'vue';

export interface InvoiceItem {
  name: string;
  qty: number;
  rate: number;
  gstRate: number;
  hsn?: string;
  item_code?: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerName: string;
  customerPhone?: string;
  customerGstin?: string;
  date: string;
  time: string;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Khata';
  taxable: number;
  tax: number;
  grandTotal: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Returned';
  items: InvoiceItem[];
}

export interface PurchaseItem {
  item_code: string;
  item_name: string;
  hsn: string;
  qty: number;
  uom: string;
  rate: number;
  amount: number;
  gst_rate: number;
  cgst_amount?: number;
  sgst_amount?: number;
  batch_no?: string;
  expiry_date?: string;
}

export interface PurchaseBill {
  id: string;
  supplier_bill_no: string;
  supplier_id: string;
  supplier_name: string;
  supplier_gstin: string;
  supplier_state: string;
  bill_date: string;
  due_date: string;
  taxable_amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_tax: number;
  round_off: number;
  grand_total: number;
  paid_amount: number;
  outstanding_amount: number;
  payment_status: 'Paid' | 'Partial' | 'Unpaid' | 'Debit Note';
  payment_mode: string;
  stock_updated: boolean;
  warehouse: string;
  is_return: boolean;
  return_against?: string;
  return_reason?: string;
  items: PurchaseItem[];
}

export interface GoodsReceiptNote {
  grn_no: string;
  supplier_name: string;
  po_no: string;
  vehicle_no: string;
  transporter: string;
  date: string;
  received_qty: number;
  accepted_qty: number;
  rejected_qty: number;
  total_value: number;
  status: 'Accepted' | 'Partial Rejection';
}

export interface DeliveryChallan {
  challan_no: string;
  customer_name: string;
  customer_phone?: string;
  invoice_ref: string;
  source_warehouse: string;
  vehicle_no: string;
  transporter: string;
  date: string;
  total_qty: number;
  status: 'Dispatched' | 'Delivered';
  items?: any[];
}

export interface BatchItem {
  batch_no: string;
  item_code: string;
  item_name: string;
  category: string;
  warehouse: string;
  mfg_date: string;
  expiry_date: string;
  days_left: number;
  qty: number;
  unit: string;
  mrp: number;
  status: 'Fresh' | 'Critical (<30d)' | 'Expired' | 'Quarantined';
}

export interface SerialItem {
  serial_no: string;
  item_code: string;
  item_name: string;
  warehouse: string;
  inward_date: string;
  warranty_months: number;
  warranty_expiry: string;
  status: 'In Store' | 'Sold' | 'Under RMA';
}

export interface StockLedgerEntry {
  id: string;
  item_code: string;
  item_name: string;
  date: string;
  voucher_type: string;
  voucher_no: string;
  warehouse: string;
  inward_qty: number;
  outward_qty: number;
  balance_qty: number;
  valuation_rate: number;
  remarks: string;
}

export interface CashTransaction {
  id: string;
  time: string;
  type: 'Inflow' | 'Outflow';
  category: string;
  party: string;
  inflow: number;
  outflow: number;
  running_balance: number;
  ref_no: string;
  notes?: string;
}

export interface DayBookData {
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

// Storage Keys
const KEY_INVOICES = 'easybill_doc_invoices';
const KEY_PURCHASES = 'easybill_doc_purchases';
const KEY_GRNS = 'easybill_doc_grns';
const KEY_CHALLANS = 'easybill_doc_challans';
const KEY_STOCK_LEDGER = 'easybill_doc_stock_ledger';
const KEY_BATCHES = 'easybill_doc_batches';
const KEY_SERIALS = 'easybill_doc_serials';
const KEY_DAYBOOK = 'easybill_doc_daybook';
const KEY_CLEARED_FLAG = 'easybill_docs_cleared';

function loadStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`[documentStore] Failed to load ${key}:`, e);
  }
  return defaultValue;
}

function saveStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[documentStore] Failed to save ${key}:`, e);
  }
}

// Reactive Singleton States
// Default to empty array if cleared or no data exists
const isCleared = localStorage.getItem(KEY_CLEARED_FLAG) === 'true';

export const invoices = ref<Invoice[]>(loadStored<Invoice[]>(KEY_INVOICES, []));
export const purchaseBills = ref<PurchaseBill[]>(loadStored<PurchaseBill[]>(KEY_PURCHASES, []));
export const goodsReceiptNotes = ref<GoodsReceiptNote[]>(loadStored<GoodsReceiptNote[]>(KEY_GRNS, []));
export const deliveryChallans = ref<DeliveryChallan[]>(loadStored<DeliveryChallan[]>(KEY_CHALLANS, []));
export const stockLedger = ref<StockLedgerEntry[]>(loadStored<StockLedgerEntry[]>(KEY_STOCK_LEDGER, []));
export const batches = ref<BatchItem[]>(loadStored<BatchItem[]>(KEY_BATCHES, []));
export const serials = ref<SerialItem[]>(loadStored<SerialItem[]>(KEY_SERIALS, []));

export const dayBook = ref<DayBookData>(loadStored<DayBookData>(KEY_DAYBOOK, {
  date: new Date().toISOString().split('T')[0],
  opening_cash: 2000.00,
  cash_in: 0.00,
  cash_out: 0.00,
  expected_cash: 2000.00,
  counted_cash: 2000.00,
  variance: 0.00,
  status: 'Open',
  transactions: []
}));

// Action Methods
export function clearAllDocumentData() {
  invoices.value = [];
  purchaseBills.value = [];
  goodsReceiptNotes.value = [];
  deliveryChallans.value = [];
  stockLedger.value = [];
  batches.value = [];
  serials.value = [];
  
  dayBook.value = {
    date: new Date().toISOString().split('T')[0],
    opening_cash: 2000.00,
    cash_in: 0.00,
    cash_out: 0.00,
    expected_cash: 2000.00,
    counted_cash: 2000.00,
    variance: 0.00,
    status: 'Open',
    transactions: []
  };

  localStorage.setItem(KEY_CLEARED_FLAG, 'true');
  saveStored(KEY_INVOICES, invoices.value);
  saveStored(KEY_PURCHASES, purchaseBills.value);
  saveStored(KEY_GRNS, goodsReceiptNotes.value);
  saveStored(KEY_CHALLANS, deliveryChallans.value);
  saveStored(KEY_STOCK_LEDGER, stockLedger.value);
  saveStored(KEY_BATCHES, batches.value);
  saveStored(KEY_SERIALS, serials.value);
  saveStored(KEY_DAYBOOK, dayBook.value);
}

export function addInvoice(inv: Invoice) {
  invoices.value.unshift(inv);
  saveStored(KEY_INVOICES, invoices.value);

  // Update DayBook if Cash
  if (inv.paymentMode === 'Cash') {
    const currentBal = (dayBook.value.expected_cash || 0) + inv.grandTotal;
    dayBook.value.cash_in += inv.grandTotal;
    dayBook.value.expected_cash = currentBal;
    dayBook.value.counted_cash = currentBal;
    dayBook.value.transactions.unshift({
      id: 'CSH-' + Date.now().toString().slice(-4),
      time: inv.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Inflow',
      category: 'Sales Receipt',
      party: inv.customerName || 'Walk-in Customer',
      inflow: inv.grandTotal,
      outflow: 0,
      running_balance: currentBal,
      ref_no: inv.number,
      notes: `POS Bill ${inv.number}`
    });
    saveStored(KEY_DAYBOOK, dayBook.value);
  }

  // Update Stock Ledger for each item
  for (const item of inv.items) {
    stockLedger.value.unshift({
      id: 'LED-' + Date.now().toString().slice(-4) + Math.floor(Math.random() * 100),
      item_code: item.item_code || 'MED-001',
      item_name: item.name,
      date: inv.date + ' ' + inv.time,
      voucher_type: 'Sales Invoice',
      voucher_no: inv.number,
      warehouse: 'Shop Floor - EB (Front Counter)',
      inward_qty: 0,
      outward_qty: item.qty,
      balance_qty: Math.max(0, 45 - item.qty), // default reference
      valuation_rate: item.rate,
      remarks: `Outward POS Sale to ${inv.customerName}`
    });
  }
  saveStored(KEY_STOCK_LEDGER, stockLedger.value);
}

export function addPurchaseBill(bill: PurchaseBill) {
  purchaseBills.value.unshift(bill);
  saveStored(KEY_PURCHASES, purchaseBills.value);

  // Update DayBook if Cash payment
  if (bill.payment_mode === 'Cash' && bill.paid_amount > 0) {
    const currentBal = Math.max(0, (dayBook.value.expected_cash || 0) - bill.paid_amount);
    dayBook.value.cash_out += bill.paid_amount;
    dayBook.value.expected_cash = currentBal;
    dayBook.value.counted_cash = currentBal;
    dayBook.value.transactions.unshift({
      id: 'CSH-' + Date.now().toString().slice(-4),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Outflow',
      category: 'Supplier Payment',
      party: bill.supplier_name,
      inflow: 0,
      outflow: bill.paid_amount,
      running_balance: currentBal,
      ref_no: bill.id,
      notes: `Purchase Inward Bill ${bill.supplier_bill_no}`
    });
    saveStored(KEY_DAYBOOK, dayBook.value);
  }

  // Update Stock Ledger
  for (const item of bill.items) {
    stockLedger.value.unshift({
      id: 'LED-' + Date.now().toString().slice(-4) + Math.floor(Math.random() * 100),
      item_code: item.item_code,
      item_name: item.item_name,
      date: bill.bill_date + ' 10:00 AM',
      voucher_type: 'Purchase Receipt',
      voucher_no: bill.id,
      warehouse: bill.warehouse || 'Stores - EB (Main Godown)',
      inward_qty: item.qty,
      outward_qty: 0,
      balance_qty: item.qty + 50,
      valuation_rate: item.rate,
      remarks: `Inward from ${bill.supplier_name}`
    });
  }
  saveStored(KEY_STOCK_LEDGER, stockLedger.value);
}

export function addGrn(grn: GoodsReceiptNote) {
  goodsReceiptNotes.value.unshift(grn);
  saveStored(KEY_GRNS, goodsReceiptNotes.value);

  stockLedger.value.unshift({
    id: 'LED-' + Date.now().toString().slice(-4),
    item_code: 'MED-001',
    item_name: 'Paracetamol 650mg',
    date: grn.date + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    voucher_type: 'Goods Receipt Note',
    voucher_no: grn.grn_no,
    warehouse: 'Stores - EB (Main Godown)',
    inward_qty: grn.accepted_qty,
    outward_qty: 0,
    balance_qty: grn.accepted_qty + 45,
    valuation_rate: 22.00,
    remarks: `Gate Inward GRN from ${grn.supplier_name} (PO: ${grn.po_no})`
  });
  saveStored(KEY_STOCK_LEDGER, stockLedger.value);
}

export function addDeliveryChallan(dc: DeliveryChallan) {
  deliveryChallans.value.unshift(dc);
  saveStored(KEY_CHALLANS, deliveryChallans.value);

  stockLedger.value.unshift({
    id: 'LED-' + Date.now().toString().slice(-4),
    item_code: 'MED-001',
    item_name: 'Paracetamol 650mg',
    date: dc.date + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    voucher_type: 'Delivery Challan',
    voucher_no: dc.challan_no,
    warehouse: dc.source_warehouse,
    inward_qty: 0,
    outward_qty: dc.total_qty,
    balance_qty: Math.max(0, 45 - dc.total_qty),
    valuation_rate: 22.00,
    remarks: `Outward Dispatch to ${dc.customer_name} (${dc.vehicle_no})`
  });
  saveStored(KEY_STOCK_LEDGER, stockLedger.value);
}

export function addBatch(b: BatchItem) {
  batches.value.unshift(b);
  saveStored(KEY_BATCHES, batches.value);
}

export function addSerials(items: SerialItem[]) {
  serials.value.unshift(...items);
  saveStored(KEY_SERIALS, serials.value);
}

export function addCashExpense(expense: { category: string; amount: number; party: string; notes?: string }) {
  const currentBal = Math.max(0, (dayBook.value.expected_cash || 0) - expense.amount);
  dayBook.value.cash_out += expense.amount;
  dayBook.value.expected_cash = currentBal;
  dayBook.value.counted_cash = currentBal;
  dayBook.value.transactions.unshift({
    id: 'EXP-' + Date.now().toString().slice(-4),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'Outflow',
    category: expense.category,
    party: expense.party || 'Petty Cash',
    inflow: 0,
    outflow: expense.amount,
    running_balance: currentBal,
    ref_no: 'VCH-' + Math.floor(100 + Math.random() * 900),
    notes: expense.notes
  });
  saveStored(KEY_DAYBOOK, dayBook.value);
}

// Load Demo Dataset for testing if requested
export function loadDemoData() {
  localStorage.removeItem(KEY_CLEARED_FLAG);

  invoices.value = [
    {
      id: 'inv-1',
      number: 'INV-2026-0042',
      customerName: 'Walk-in Customer',
      customerPhone: 'Cash Sale',
      date: '16 Nov 2026',
      time: '11:15 AM',
      paymentMode: 'Cash',
      taxable: 151.04,
      tax: 16.96,
      grandTotal: 168.00,
      status: 'Paid',
      items: [
        { name: 'Paracetamol 650mg', qty: 2, rate: 35.00, gstRate: 12 },
        { name: 'Amoxicillin 500mg', qty: 1, rate: 72.50, gstRate: 12 },
        { name: 'N95 Protective Mask', qty: 1, rate: 25.00, gstRate: 5 }
      ]
    },
    {
      id: 'inv-2',
      number: 'INV-2026-0041',
      customerName: 'Ramesh Kumar (Retail)',
      customerPhone: '9842109876',
      date: '16 Nov 2026',
      time: '10:45 AM',
      paymentMode: 'UPI',
      taxable: 450.00,
      tax: 54.00,
      grandTotal: 504.00,
      status: 'Paid',
      items: [
        { name: 'Digital Thermometer', qty: 2, rate: 180.00, gstRate: 18 },
        { name: 'Dettol Antiseptic 100ml', qty: 2, rate: 65.00, gstRate: 18 }
      ]
    }
  ];

  purchaseBills.value = [
    {
      id: "PUR-2026-0001",
      supplier_bill_no: "INV-88912",
      supplier_id: "SUPP-001",
      supplier_name: "MediPharma Distributors",
      supplier_gstin: "33AABCM5678H1Z4",
      supplier_state: "Tamil Nadu (33)",
      bill_date: "2026-11-15",
      due_date: "2026-11-30",
      taxable_amount: 16500.00,
      cgst: 990.00,
      sgst: 990.00,
      igst: 0.00,
      total_tax: 1980.00,
      round_off: 0.00,
      grand_total: 18480.00,
      paid_amount: 18480.00,
      outstanding_amount: 0.00,
      payment_status: "Paid",
      payment_mode: "Bank Transfer (NEFT)",
      stock_updated: true,
      warehouse: "Stores - EB",
      is_return: false,
      items: [
        { item_code: "MED-001", item_name: "Paracetamol 650mg", hsn: "300490", qty: 200, uom: "Strip", rate: 22.00, amount: 4400.00, gst_rate: 12 },
        { item_code: "MED-002", item_name: "Amoxicillin 500mg", hsn: "300410", qty: 100, uom: "Strip", rate: 45.00, amount: 4500.00, gst_rate: 12 }
      ]
    }
  ];

  goodsReceiptNotes.value = [
    {
      grn_no: 'GRN-2026-001',
      supplier_name: 'Cipla Healthcare Ltd',
      po_no: 'PO-2026-089',
      vehicle_no: 'TN 37 CZ 8921',
      transporter: 'VRL Logistics',
      date: '15 Nov 2026',
      received_qty: 300,
      accepted_qty: 295,
      rejected_qty: 5,
      total_value: 6490.00,
      status: 'Accepted'
    }
  ];

  deliveryChallans.value = [
    {
      challan_no: 'DC-2026-001',
      customer_name: 'Murugan Medicals',
      customer_phone: '9842109876',
      invoice_ref: 'INV-2026-0042',
      source_warehouse: 'Stores - EB (Main Godown)',
      vehicle_no: 'TN 38 BX 4412',
      transporter: 'Direct Van Delivery',
      date: '16 Nov 2026',
      total_qty: 15,
      status: 'Dispatched'
    }
  ];

  batches.value = [
    {
      batch_no: 'BAT-2026-A12',
      item_code: 'MED-001',
      item_name: 'Paracetamol 650mg',
      category: 'Medicines',
      warehouse: 'Stores - EB',
      mfg_date: '2026-01-15',
      expiry_date: '2028-01-14',
      days_left: 423,
      qty: 45,
      unit: 'Strip',
      mrp: 38.00,
      status: 'Fresh'
    }
  ];

  serials.value = [
    {
      serial_no: 'SN-9820192847291',
      item_code: 'DEV-001',
      item_name: 'Digital BP Monitor Omron',
      warehouse: 'Stores - EB',
      inward_date: '2026-10-10',
      warranty_months: 24,
      warranty_expiry: '2028-10-09',
      status: 'In Store'
    }
  ];

  saveStored(KEY_INVOICES, invoices.value);
  saveStored(KEY_PURCHASES, purchaseBills.value);
  saveStored(KEY_GRNS, goodsReceiptNotes.value);
  saveStored(KEY_CHALLANS, deliveryChallans.value);
  saveStored(KEY_STOCK_LEDGER, stockLedger.value);
  saveStored(KEY_BATCHES, batches.value);
  saveStored(KEY_SERIALS, serials.value);
  saveStored(KEY_DAYBOOK, dayBook.value);
}

// Initial execution: If cleared flag is true or no data, ensure clean slate
if (isCleared) {
  clearAllDocumentData();
}
