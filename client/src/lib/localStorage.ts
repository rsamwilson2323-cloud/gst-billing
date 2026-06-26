import { type Customer, type Product, type Invoice, type Settings } from "@shared/schema";

const STORAGE_KEYS = {
  CUSTOMERS: 'gst_billing_customers',
  PRODUCTS: 'gst_billing_products',
  INVOICES: 'gst_billing_invoices',
  SETTINGS: 'gst_billing_settings',
  LAST_SYNC: 'gst_billing_last_sync'
} as const;

export class LocalStorageManager {
  saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      this.updateLastSync();
    } catch (error) {
      console.error('Error saving customers to localStorage:', error);
    }
  }

  loadCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading customers from localStorage:', error);
      return [];
    }
  }

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.updateLastSync();
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }

  loadProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return [];
    }
  }

  saveInvoices(invoices: Invoice[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
      this.updateLastSync();
    } catch (error) {
      console.error('Error saving invoices to localStorage:', error);
    }
  }

  loadInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading invoices from localStorage:', error);
      return [];
    }
  }

  saveSettings(settings: Settings | null): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      this.updateLastSync();
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }

  loadSettings(): Settings | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return null;
    }
  }

  updateLastSync(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  getLastSync(): Date | null {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return data ? new Date(data) : null;
  }

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const localStorageManager = new LocalStorageManager();
