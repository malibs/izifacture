import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';

export const profileService = {
  /**
   * Récupère le profil de l'utilisateur connecté.
   */
  async getProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // Si le profil n'existe pas encore, on le crée
      if (error.code === 'PGRST116') {
        return this.ensureProfile(user.id, user.email || '', user.user_metadata?.company_name);
      }
      throw error;
    }

    const profile = this.mapProfile(data);

    // Vérifier l'expiration de l'abonnement
    if (
      profile.subscription_ends_at &&
      profile.subscription_status === 'active' &&
      new Date(profile.subscription_ends_at) < new Date()
    ) {
      await this.expireSubscription(user.id);
      profile.subscription_status = 'expired';
      profile.subscription_plan = 'free';
    }

    return profile;
  },

  /**
   * Fait passer un abonnement expiré au plan gratuit.
   * Appelé quand subscription_ends_at est dépassé.
   */
  async expireSubscription(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_plan: 'free',
        subscription_status: 'expired',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors de l\'expiration de l\'abonnement:', error);
    }
  },

  /**
   * Crée un profil par défaut s'il n'existe pas encore.
   */
  async ensureProfile(userId: string, email: string, companyName?: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        company_name: companyName || 'Nouvelle Entreprise',
        company_email: email,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapProfile(data);
  },

  /**
   * Met à jour le profil avec les champs fournis.
   */
  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    // On ne met jamais à jour l'id ni les champs d'abonnement depuis ici
    const safeUpdates: Record<string, unknown> = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.subscription_plan;
    delete safeUpdates.subscription_status;
    delete safeUpdates.trial_ends_at;
    delete safeUpdates.updated_at;

    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return this.mapProfile(data);
  },

  /**
   * Upload le logo de l'entreprise vers Supabase Storage (bucket `logos`).
   * Retourne l'URL publique du fichier.
   */
  async uploadLogo(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  /**
   * Map les colonnes DB vers le type Profile du frontend.
   */
  mapProfile(data: any): Profile {
    return {
      id: data.id,
      company_name: data.company_name || '',
      company_email: data.company_email || '',
      company_phone: data.company_phone || '',
      company_address: data.company_address || '',
      company_logo_url: data.company_logo_url || null,
      vat_rate: Number(data.vat_rate) || 18,
      currency: data.currency || 'XOF',
      ninea_rccm: data.ninea_rccm || null,
      subscription_plan: data.subscription_plan || 'free',
      subscription_status: data.subscription_status || 'trial',
      trial_ends_at: data.trial_ends_at || null,
      subscription_ends_at: data.subscription_ends_at || null,
      updated_at: data.updated_at || '',
    };
  },
};