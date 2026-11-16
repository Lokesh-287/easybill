/**
 * EasyBill Local-First Offline Sync Service
 * Implements WP-09 & local-first-sync-engine skill
 */

export interface OfflineBill {
  client_uuid: string;
  created_at: string;
  payload: any;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retry_count: number;
}

const OUTBOX_KEY = 'easybill_offline_outbox';

export class OfflineSyncService {
  private static isOnline = navigator.onLine;

  static init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.drainOutbox();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    if (this.isOnline) {
      this.drainOutbox();
    }
  }

  static getOutbox(): OfflineBill[] {
    try {
      const data = localStorage.getItem(OUTBOX_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static enqueueBill(payload: any): OfflineBill {
    const bill: OfflineBill = {
      client_uuid: crypto.randomUUID ? crypto.randomUUID() : `OFF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      payload,
      status: 'pending',
      retry_count: 0
    };

    const outbox = this.getOutbox();
    outbox.push(bill);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox));

    if (this.isOnline) {
      this.drainOutbox();
    }

    return bill;
  }

  static async drainOutbox() {
    const outbox = this.getOutbox();
    const pending = outbox.filter(b => b.status === 'pending');
    if (pending.length === 0) return;

    for (const bill of pending) {
      bill.status = 'syncing';
      try {
        const res = await fetch('/api/method/easybill.api.v1.sales.create_bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_uuid: bill.client_uuid,
            ...bill.payload
          })
        });

        if (res.ok) {
          bill.status = 'synced';
        } else {
          bill.retry_count++;
          bill.status = 'failed';
        }
      } catch (err) {
        bill.retry_count++;
        bill.status = 'failed';
      }
    }

    // Keep only non-synced items in outbox
    const remaining = outbox.filter(b => b.status !== 'synced');
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(remaining));
  }

  static getPendingCount(): number {
    return this.getOutbox().filter(b => b.status === 'pending').length;
  }
}
