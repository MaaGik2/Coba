import { supabase } from '../lib/supabase';
import type { Component, NewComponentFormData } from '../types';

export class ComponentRepository {
  async fetchAll(): Promise<Component[]> {
    const { data, error } = await supabase
      .from('components')
      .select('*');
    
    if (error) {
      console.error('Erreur lors du chargement des composants:', error);
      throw error;
    }
    
    return data;
  }

  async create(component: NewComponentFormData): Promise<void> {
    const { error } = await supabase
      .from('components')
      .insert([component]);
    
    if (error) {
      console.error('Erreur lors de l\'ajout du composant:', error);
      throw error;
    }
  }

  async updateColor(id: string, color: { r: number; g: number; b: number }): Promise<void> {
    const { error } = await supabase
      .from('components')
      .update({
        led_color_r: color.r,
        led_color_g: color.g,
        led_color_b: color.b
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la mise à jour de la couleur:', error);
      throw error;
    }
  }
} 