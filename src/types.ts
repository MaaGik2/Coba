export interface Component {
  id: string;
  name: string;
  category_id: string;
  quantity: number;
  grid_row: number;
  grid_column: number;
  led_color_r: number;
  led_color_g: number;
  led_color_b: number;
  properties: Record<string, string>;
  value?: number;
  unit?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  created_at?: string;
}

export interface NewComponentFormData {
  name: string;
  category_id: string;
  type_id?: string;
  emplacement_id?: string;
  fournisseur_id?: string;
  quantity: number;
  grid_row: number;
  grid_column: number;
  led_color_r: number;
  led_color_g: number;
  led_color_b: number;
  properties: Record<string, string>;
  value?: number;
  unit?: string;
}

export interface TypeComposant {
  id: string;
  libelle: string;
}

export interface Emplacement {
  id: string;
  description: string;
}

export interface Fournisseur {
  id: string;
  nom: string;
  site_web?: string;
  email?: string;
  telephone?: string;
}

export interface Composant {
  id: string;
  nom: string;
  description?: string;
  valeur?: string;
  boitier?: string;
  quantite_en_stock: number;
  seuil_alerte: number;
  type_id?: string;
  emplacement_id?: string;
}

export interface Commande {
  id: string;
  date_commande: string;
  statut: string;
  fournisseur_id?: string;
}

export interface LigneCommande {
  commande_id: string;
  composant_id: string;
  quantite_commandee: number;
  prix_unitaire?: number;
}