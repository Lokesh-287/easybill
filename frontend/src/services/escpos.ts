/**
 * EasyBill ESC/POS Thermal Printer Driver Service
 * Implements WP-07 & escpos-gst-compliance skill
 */

export interface ReceiptData {
  storeName: string;
  storeNameTa?: string;
  address: string;
  gstin: string;
  phone: string;
  billNo: string;
  date: string;
  cashier: string;
  items: Array<{
    name: string;
    qty: number;
    rate: number;
    amount: number;
  }>;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst?: number;
  roundOff: number;
  grandTotal: number;
  paymentMode: string;
  footerNote: string;
}

export class EscPosService {
  // ESC/POS Command Byte Sequences
  static CMD = {
    INIT: '\x1b\x40',
    ALIGN_LEFT: '\x1b\x61\x00',
    ALIGN_CENTER: '\x1b\x61\x01',
    ALIGN_RIGHT: '\x1b\x61\x02',
    BOLD_ON: '\x1b\x45\x01',
    BOLD_OFF: '\x1b\x45\x00',
    DOUBLE_HEIGHT_ON: '\x1b\x21\x10',
    DOUBLE_HEIGHT_OFF: '\x1b\x21\x00',
    CUT_PARTIAL: '\x1d\x56\x41\x00',
    CASH_DRAWER_KICK: '\x1b\x70\x00\x19\xfa' // 24V Solenoid kick pulse on Pin 2
  };

  /**
   * Formats a complete 80mm (48 columns) thermal receipt string
   */
  static format80mmReceipt(data: ReceiptData, triggerCashDrawer = true): string {
    const W = 48; // 80mm column width
    let r = '';

    // Initialize printer
    r += this.CMD.INIT;

    // Optional Cash Drawer Kick
    if (triggerCashDrawer && data.paymentMode.toLowerCase().includes('cash')) {
      r += this.CMD.CASH_DRAWER_KICK;
    }

    // Header
    r += this.CMD.ALIGN_CENTER;
    r += this.CMD.BOLD_ON + this.CMD.DOUBLE_HEIGHT_ON;
    r += `${data.storeName}\n`;
    r += this.CMD.DOUBLE_HEIGHT_OFF;
    if (data.storeNameTa) {
      r += `${data.storeNameTa}\n`;
    }
    r += this.CMD.BOLD_OFF;
    r += `${data.address}\n`;
    r += `GSTIN: ${data.gstin} | PH: ${data.phone}\n`;
    r += '-'.repeat(W) + '\n';

    // Invoice Meta
    r += this.CMD.ALIGN_LEFT;
    r += this.formatTwoCol(`Bill: ${data.billNo}`, `Date: ${data.date}`, W) + '\n';
    r += `Cashier: ${data.cashier}\n`;
    r += '='.repeat(W) + '\n';

    // Item Table Header
    r += this.formatFourCol('ITEM', 'QTY', 'RATE', 'TOTAL', W) + '\n';
    r += '-'.repeat(W) + '\n';

    // Items
    for (const item of data.items) {
      r += this.formatFourCol(
        item.name.substring(0, 20),
        item.qty.toString(),
        item.rate.toFixed(2),
        item.amount.toFixed(2),
        W
      ) + '\n';
    }
    r += '-'.repeat(W) + '\n';

    // Totals
    r += this.formatTwoCol('Taxable Subtotal:', `Rs.${data.taxableAmount.toFixed(2)}`, W) + '\n';
    if (data.cgst > 0) {
      r += this.formatTwoCol('CGST:', `Rs.${data.cgst.toFixed(2)}`, W) + '\n';
      r += this.formatTwoCol('SGST:', `Rs.${data.sgst.toFixed(2)}`, W) + '\n';
    }
    if (data.igst && data.igst > 0) {
      r += this.formatTwoCol('IGST:', `Rs.${data.igst.toFixed(2)}`, W) + '\n';
    }
    if (data.roundOff !== 0) {
      r += this.formatTwoCol('Round Off:', `Rs.${data.roundOff.toFixed(2)}`, W) + '\n';
    }

    // Grand Total Bold
    r += '='.repeat(W) + '\n';
    r += this.CMD.BOLD_ON;
    r += this.formatTwoCol('GRAND TOTAL:', `Rs.${data.grandTotal.toFixed(2)}`, W) + '\n';
    r += this.CMD.BOLD_OFF;
    r += this.formatTwoCol('Tender Mode:', data.paymentMode, W) + '\n';
    r += '='.repeat(W) + '\n';

    // Footer
    r += this.CMD.ALIGN_CENTER;
    r += `${data.footerNote}\n`;
    r += 'Powered by EasyBill GST POS\n\n\n';

    // Paper Cut
    r += this.CMD.CUT_PARTIAL;

    return r;
  }

  private static formatTwoCol(left: string, right: string, width: number): string {
    const spaces = Math.max(1, width - left.length - right.length);
    return left + ' '.repeat(spaces) + right;
  }

  private static formatFourCol(c1: string, c2: string, c3: string, c4: string, width: number): string {
    const w1 = 22;
    const w2 = 6;
    const w3 = 9;
    const w4 = 11;

    const p1 = c1.padEnd(w1).substring(0, w1);
    const p2 = c2.padStart(w2).substring(0, w2);
    const p3 = c3.padStart(w3).substring(0, w3);
    const p4 = c4.padStart(w4).substring(0, w4);

    return `${p1}${p2}${p3}${p4}`;
  }
}
