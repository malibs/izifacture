import { supabase } from '@/lib/supabase';
import { Customer } from '@/lib/types';

export const customerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Customer[];
  },

  async create(customer: Omit<Customer, 'id'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([
        {
          ...customer,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};
