import { supabase } from '@/lib/supabase';
import { Invoice, InvoiceItem, SubscriptionPlan } from '@/lib/types';
import { PLAN_LIMITS } from '@/lib/plans';

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

    // Charger tous les items en une seule requête pour éviter le N+1
    const invoiceIds = (data as any[]).map(inv => inv.id);
    let itemsMap: Record<string, any[]> = {};

    if (invoiceIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .in('invoice_id', invoiceIds);

      if (itemsError) throw itemsError;

      itemsMap = (itemsData || []).reduce((acc, item) => {
        if (!acc[item.invoice_id]) acc[item.invoice_id] = [];
        acc[item.invoice_id].push(item);
        return acc;
      }, {} as Record<string, any[]>);
    }

    // Map DB columns to frontend Invoice type
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
      items: (itemsMap[inv.id] || []).map((item: any) => ({
        description: item.description,
        quantity: Number(item.quantity),
        price: Number(item.unit_price),
      })) as InvoiceItem[],
    })) as Invoice[];
  },

  /**
   * Récupère une facture par son ID, avec ses items et le nom du client.
   */
  async getById(id: string): Promise<Invoice> {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customers (name, email, phone, address)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const { data: items, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id)
      .order('created_at', { ascending: true });

    if (itemsError) throw itemsError;

    return {
      id: invoice.id,
      client_id: invoice.customer_id,
      client_name: invoice.customers?.name || 'Client Inconnu',
      invoice_number: invoice.invoice_number,
      date_issue: invoice.date_issue,
      date_due: invoice.date_due,
      status: invoice.status,
      subtotal: Number(invoice.subtotal),
      vat: Number(invoice.vat),
      total: Number(invoice.total),
      notes: invoice.notes,
      items: (items || []).map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        price: Number(item.unit_price),
      })),
      // @ts-expect-error — données supplémentaires pour la page détail
      customer: invoice.customers,
    };
  },

  /**
   * Génère automatiquement le prochain numéro de facture au format INV-{YYYY}-{NNN}.
   */
  async getNextInvoiceNumber(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const year = new Date().getFullYear();
    const startOfYear = `${year}-01-01`;

    const { count, error } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('date_issue', startOfYear);

    if (error) throw error;

    const nextNumber = (count || 0) + 1;
    return `INV-${year}-${String(nextNumber).padStart(3, '0')}`;
  },

  /**
   * Compte les factures créées ce mois-ci (pour le contrôle des limites d'abonnement).
   */
  async getMonthlyInvoiceCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const { count, error } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('date_issue', startOfMonth);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Vérifie que l'utilisateur n'a pas atteint sa limite d'abonnement.
   * Lance une erreur claire si la limite est atteinte.
   */
  async checkPlanLimit(plan: SubscriptionPlan): Promise<void> {
    const config = PLAN_LIMITS[plan];
    if (config.maxInvoicesPerMonth === Infinity) return;

    const monthlyCount = await this.getMonthlyInvoiceCount();
    if (monthlyCount >= config.maxInvoicesPerMonth) {
      throw new Error(
        `Vous avez atteint la limite de ${config.maxInvoicesPerMonth} factures/mois du plan ${plan === 'free' ? 'Gratuit' : plan}. ` +
        `Passez à un plan supérieur pour des factures illimitées.`,
      );
    }
  },

  async create(invoiceData: Omit<Invoice, 'id' | 'client_name'>, items: InvoiceItem[], plan?: SubscriptionPlan) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Utilisateur non authentifié');

    // 0. Vérifier la limite d'abonnement
    if (plan) {
      await this.checkPlanLimit(plan);
    }

    // 1. Auto-générer le numéro si vide
    let invoiceNumber = invoiceData.invoice_number;
    if (!invoiceNumber || invoiceNumber.trim() === '') {
      invoiceNumber = await this.getNextInvoiceNumber();
    }

    // 2. Create the invoice — map frontend `client_id` to DB `customer_id`
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .insert([
        {
          user_id: user.id,
          customer_id: invoiceData.client_id,
          invoice_number: invoiceNumber,
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

    // 3. Create the invoice items (map frontend `price` to DB `unit_price`)
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