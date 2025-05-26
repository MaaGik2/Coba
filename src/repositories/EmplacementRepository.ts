import { supabase } from '../lib/supabase';
import type { Emplacement } from '../types';

export class EmplacementRepository {
  async fetchAll(): Promise<Emplacement[]> {
    const { data, error } = await supabase
      .from('emplacement')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async create(description: string): Promise<void> {
    const { error } = await supabase
      .from('emplacement')
      .insert([{ description }]);
    
    if (error) throw error;
  }
} 