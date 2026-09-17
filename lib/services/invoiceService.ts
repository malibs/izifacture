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

    // Map DB columns to frontend Invoice type
    // DB: customer_id → Frontend: client_id
    // DB: customers.name → Frontend: client_name
    return (data as any[]).map(inv => ({
      id: inv.id,
      client_id: inv.customer_id,
      client_name: inv.customers?.name || 'Client Inconnu',
      invoice_number: inv.invoice_number,
      date_issue: inv.date_issue,
      date_due: inv.date_due,
      status: inv.status,
      subtotal: Number(inv.subtotal),
      vat: Number(inv.vat),
      total: Number(inv.total),
      notes: inv.notes,
      items: [],
    })) as Invoice[];
  },

  async create(invoiceData: Omit<Invoice, 'id' | 'client_name'>, items: InvoiceItem[]) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Utilisateur non authentifié');

    // 1. Create the invoice — map frontend `client_id` to DB `customer_id`
    //    and exclude `items` (stored in a separate table).
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .insert([
        {
          user_id: user.id,
          customer_id: invoiceData.client_id,
          invoice_number: invoiceData.invoice_number,
          date_issue: invoiceData.date_issue,
          date_due: invoiceData.date_due,
          status: invoiceData.status,
          subtotal: invoiceData.subtotal,
          vat: invoiceData.vat,
          total: invoiceData.total,
          notes: invoiceData.notes,
        },
      ])
      .select()
      .single();

    if (invError) throw invError;

    // 2. Create the invoice items (map frontend `price` to DB `unit_price`)
    const itemsWithId = items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.price,
      invoice_id: invoice.id,
      total_price: item.quantity * item.price,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithId);

    if (itemsError) throw itemsError;

    // Return in frontend Invoice format
    return {
      id: invoice.id,
      client_id: invoice.customer_id,
      client_name: '',
      invoice_number: invoice.invoice_number,
      date_issue: invoice.date_issue,
      date_due: invoice.date_due,
      status: invoice.status,
      subtotal: Number(invoice.subtotal),
      vat: Number(invoice.vat),
      total: Number(invoice.total),
      notes: invoice.notes,
      items,
    } as Invoice;
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