"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, Customer, InvoiceStatus, Profile } from '@/lib/types';
import { MOCK_INVOICES } from '@/lib/mocks';
import { MOCK_CUSTOMERS } from '@/lib/mocks_customers';
import { customerService } from '@/lib/services/customerService';
import { invoiceService } from '@/lib/services/invoiceService';
import { profileService } from '@/lib/services/profileService';

interface StoreContextType {
  invoices: Invoice[];
  customers: Customer[];
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileData: (updates: Partial<Profile>) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'client_name'>, items: Invoice['items']) => Promise<void>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [invs, custs, prof] = await Promise.all([
        invoiceService.getAll(),
        customerService.getAll(),
        profileService.getProfile(),
      ]);
      setInvoices(invs);
      setCustomers(custs);
      setProfile(prof);
    } catch (err: any) {
      console.error('Error fetching data from Supabase:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des données');

      // Fallback to mocks if Supabase is not configured yet
      setInvoices(MOCK_INVOICES as Invoice[]);
      setCustomers(MOCK_CUSTOMERS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshProfile = async () => {
    try {
      const prof = await profileService.getProfile();
      setProfile(prof);
    } catch (err: any) {
      console.error('Error refreshing profile:', err);
    }
  };

  const updateProfileData = async (updates: Partial<Profile>) => {
    try {
      const updated = await profileService.updateProfile(updates);
      setProfile(updated);
    } catch (err: any) {
      throw err;
    }
  };

  const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'client_name'>, items: Invoice['items']) => {
    try {
      const newInvoice = await invoiceService.create(invoiceData, items, profile?.subscription_plan);
      setInvoices(prev => [newInvoice, ...prev]);
    } catch (err: any) {
      throw err;
    }
  };

  const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    try {
      await invoiceService.updateStatus(id, status);
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    } catch (err: any) {
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await invoiceService.delete(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    } catch (err: any) {
      throw err;
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const newCustomer = await customerService.create(customer);
      setCustomers(prev => [newCustomer, ...prev]);
    } catch (err: any) {
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const updatedCustomer = await customerService.update(id, updates);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
    } catch (err: any) {
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id);
      setCustomers(prev => prev.filter(cust => cust.id !== id));
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <StoreContext.Provider value={{
      invoices,
      customers,
      profile,
      isLoading,
      error,
      fetchData,
      refreshProfile,
      updateProfileData,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      addCustomer,
      updateCustomer,
      deleteCustomer
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}