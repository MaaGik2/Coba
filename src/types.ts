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