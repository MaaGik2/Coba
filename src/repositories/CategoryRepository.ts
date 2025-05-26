import { supabase } from '../lib/supabase';
import type { Category } from '../types';

export class CategoryRepository {
  async fetchAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      throw error;
    }
    
    return data;
  }

  async create(name: string, parent_id: string | null): Promise<void> {
    const categoryData = {
      name,
      parent_id
    };
    
    const { error } = await supabase
      .from('categories')
      .insert([categoryData]);
    
    if (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      throw error;
    }
  }
} 