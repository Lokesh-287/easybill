/**
 * EasyBill Mobile Bluetooth ESC/POS Thermal Printing Service
 * Compliant with escpos-gst-compliance standards
 */

export interface BillReceiptData {
  invoiceNo: string;
  date: string;
  time: string;
  storeName: string;
  storePhone?: string;
  gstin?: string;
  customerName: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    total: number;
  }>;
  taxable: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  paymentMode: string;
}

class BluetoothPrinterService {
  private device: any = null;
  private characteristic: any = null;
  private isConnected = false;

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getDeviceName(): string {
    return this.device ? this.device.name || 'Bluetooth Thermal Printer' : 'Not Connected';
  }

  /**
   * Request user permission and pair with Bluetooth ESC/POS printer
   */
  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Web Bluetooth is not supported on this browser/device.');
    }

    try {
      // Standard SPP & thermal printer GATT services
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb', // Standard Printer service
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Posnet service
          '49535343-fe7d-4ae5-8fa9-9fafd205e455', // ISSC transparent service
        ]
      });

      this.device = device;
      const server = await device.gatt.connect();

      // Find writable characteristic
      const services = await server.getPrimaryServices();
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            this.characteristic = char;
            this.isConnected = true;
            return true;
          }
        }
      }

      throw new Error('Writable printer characteristic not found on selected device.');
    } catch (err: any) {
      this.isConnected = false;
      throw err;
    }
  }

  /**
   * Disconnect active Bluetooth connection
   */
  public disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
    this.device = null;
    this.characteristic = null;
  }

  /**
   * Format receipt into ESC/POS bytecode (58mm 32-col or 80mm 48-col)
   */
  public formatReceiptBytes(bill: BillReceiptData, paperWidth: '58mm' | '80mm' = '58mm'): Uint8Array {
    const cols = paperWidth === '58mm' ? 32 : 48;
    const encoder = new TextEncoder();
    const parts: number[] = [];

    // ESC/POS Commands
    const ESC = 0x1b;
    const GS = 0x1d;

    // Initialize
    parts.push(ESC, 0x40);

    // Center Align
    parts.push(ESC, 0x61, 0x01);
    // Double height & bold for store title
    parts.push(ESC, 0x45, 0x01);
    parts.push(...encoder.encode(bill.storeName + '\n'));
    parts.push(ESC, 0x45, 0x00);

    if (bill.storePhone) {
      parts.push(...encoder.encode(`Ph: ${bill.storePhone}\n`));
    }
    if (bill.gstin) {
      parts.push(...encoder.encode(`GSTIN: ${bill.gstin}\n`));
    }

    // Divider
    parts.push(...encoder.encode('-'.repeat(cols) + '\n'));

    // Left Align for Invoice metadata
    parts.push(ESC, 0x61, 0x00);
    parts.push(...encoder.encode(`Bill: ${bill.invoiceNo}\n`));
    parts.push(...encoder.encode(`Date: ${bill.date} ${bill.time}\n`));
    parts.push(...encoder.encode(`Customer: ${bill.customerName}\n`));

    // Divider
    parts.push(...encoder.encode('-'.repeat(cols) + '\n'));

    // Items Header
    if (paperWidth === '58mm') {
      // 32 cols: "Item            Qty    Total"
      parts.push(...encoder.encode('Item            Qty    Total\n'));
    } else {
      // 48 cols
      parts.push(...encoder.encode('Item Name              Qty    Rate     Total\n'));
    }
    parts.push(...encoder.encode('-'.repeat(cols) + '\n'));

    // Items Rows
    for (const item of bill.items) {
      if (paperWidth === '58mm') {
        const namePart = item.name.length > 15 ? item.name.substring(0, 15) : item.name.padEnd(15);
        const qtyPart = String(item.qty).padStart(4);
        const totPart = item.total.toFixed(2).padStart(11);
        parts.push(...encoder.encode(`${namePart}${qtyPart} ${totPart}\n`));
      } else {
        const namePart = item.name.length > 22 ? item.name.substring(0, 22) : item.name.padEnd(22);
        const qtyPart = String(item.qty).padStart(4);
        const ratePart = item.price.toFixed(2).padStart(9);
        const totPart = item.total.toFixed(2).padStart(11);
        parts.push(...encoder.encode(`${namePart} ${qtyPart} ${ratePart} ${totPart}\n`));
      }
    }

    // Divider
    parts.push(...encoder.encode('-'.repeat(cols) + '\n'));

    // Financial Totals
    const padTotal = (label: string, val: number) => {
      const vStr = '₹' + val.toFixed(2);
      const space = cols - label.length - vStr.length;
      return label + ' '.repeat(Math.max(1, space)) + vStr + '\n';
    };

    parts.push(...encoder.encode(padTotal('Taxable Value:', bill.taxable)));
    parts.push(...encoder.encode(padTotal('CGST:', bill.cgst)));
    parts.push(...encoder.encode(padTotal('SGST:', bill.sgst)));

    // Bold Grand Total
    parts.push(ESC, 0x45, 0x01);
    parts.push(...encoder.encode(padTotal('GRAND TOTAL:', bill.grandTotal)));
    parts.push(ESC, 0x45, 0x00);

    parts.push(...encoder.encode(`Paid Via: ${bill.paymentMode}\n`));

    // Footer
    parts.push(...encoder.encode('-'.repeat(cols) + '\n'));
    parts.push(ESC, 0x61, 0x01);
    parts.push(...encoder.encode('Thank You! Visit Again.\n'));
    parts.push(...encoder.encode('EasyBill POS • GST Compliant\n\n\n\n'));

    // Partial Cut (GS V A 0)
    parts.push(GS, 0x56, 0x41, 0x00);

    return new Uint8Array(parts);
  }

  /**
   * Send binary bytecode stream to paired Bluetooth printer
   */
  public async printReceipt(bill: BillReceiptData, paperWidth: '58mm' | '80mm' = '58mm'): Promise<boolean> {
    if (!this.isConnected || !this.characteristic) {
      // If not connected, attempt to connect
      await this.connect();
    }

    const data = this.formatReceiptBytes(bill, paperWidth);

    // Write in chunks of 512 bytes to avoid BLE MTU overflow
    const CHUNK_SIZE = 512;
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      if (this.characteristic.writeValueWithoutResponse) {
        await this.characteristic.writeValueWithoutResponse(chunk);
      } else {
        await this.characteristic.writeValue(chunk);
      }
      // Small pause between BLE packets
      await new Promise(r => setTimeout(r, 20));
    }

    return true;
  }
}

export const bluetoothPrinter = new BluetoothPrinterService();
