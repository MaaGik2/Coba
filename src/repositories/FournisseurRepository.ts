import { supabase } from '../lib/supabase';
import type { Fournisseur } from '../types';

export class FournisseurRepository {
  async fetchAll(): Promise<Fournisseur[]> {
    const { data, error } = await supabase
      .from('fournisseur')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async create(fournisseur: Omit<Fournisseur, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('fournisseur')
      .insert([fournisseur]);
    
    if (error) throw error;
  }
} 