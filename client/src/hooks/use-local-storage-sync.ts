import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { localStorageManager } from '@/lib/localStorage';
import { type Customer, type Product, type Invoice, type Settings } from '@shared/schema';

export function useLocalStorageSync() {
  const queryClient = useQueryClient();

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: invoices } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  useEffect(() => {
    if (customers) {
      localStorageManager.saveCustomers(customers);
    }
  }, [customers]);

  useEffect(() => {
    if (products) {
      localStorageManager.saveProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (invoices) {
      localStorageManager.saveInvoices(invoices);
    }
  }, [invoices]);

  useEffect(() => {
    if (settings) {
      localStorageManager.saveSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    const loadCachedData = () => {
      const cachedCustomers = localStorageManager.loadCustomers();
      const cachedProducts = localStorageManager.loadProducts();
      const cachedInvoices = localStorageManager.loadInvoices();
      const cachedSettings = localStorageManager.loadSettings();

      if (cachedCustomers.length > 0) {
        queryClient.setQueryData(['/api/customers'], cachedCustomers);
      }
      if (cachedProducts.length > 0) {
        queryClient.setQueryData(['/api/products'], cachedProducts);
      }
      if (cachedInvoices.length > 0) {
        queryClient.setQueryData(['/api/invoices'], cachedInvoices);
      }
      if (cachedSettings) {
        queryClient.setQueryData(['/api/settings'], cachedSettings);
      }
    };

    loadCachedData();
  }, [queryClient]);

  return {
    lastSync: localStorageManager.getLastSync(),
    clearCache: () => localStorageManager.clearAll(),
  };
}
