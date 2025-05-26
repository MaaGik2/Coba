import { supabase } from '../lib/supabase';
import type { TypeComposant } from '../types';

export class TypeComposantRepository {
  async fetchAll(): Promise<TypeComposant[]> {
    const { data, error } = await supabase
      .from('type_composant')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async create(libelle: string): Promise<void> {
    const { error } = await supabase
      .from('type_composant')
      .insert([{ libelle }]);
    
    if (error) throw error;
  }
} 