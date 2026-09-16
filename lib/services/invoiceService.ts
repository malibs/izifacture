import { supabase } from '@/lib/supabase';
import { Invoice, InvoiceItem } from '@/lib/types';

export const invoiceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customers (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map to match our frontend Invoice type (denormalizing client name)
    return (data as any[]).map(inv => ({
      ...inv,
      client_name: inv.customers?.name || 'Client Inconnu',
    })) as Invoice[];
  },

  async create(invoiceData: Omit<Invoice, 'id' | 'client_name'>, items: InvoiceItem[]) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Utilisateur non authentifié');

    // 1. Create the invoice
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .insert([
        {
          ...invoiceData,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (invError) throw invError;

    // 2. Create the invoice items
    const itemsWithId = items.map(item => ({
      ...item,
      invoice_id: invoice.id,
      total_price: item.quantity * item.price,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithId);

    if (itemsError) throw itemsError;

    return invoice as Invoice;
  },

  async updateStatus(id: string, status: Invoice['status']) {
    const { error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};
