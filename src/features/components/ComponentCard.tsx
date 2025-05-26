import { Trash2, Grid, Save } from 'lucide-react';
import type { Component, Category } from '../../types';

interface ComponentCardProps {
  component: Component;
  category: Category | undefined;
  onColorChange: (id: string, color: { r: number; g: number; b: number }) => void;
}

export function ComponentCard({ component, category, onColorChange }: ComponentCardProps) {
  return (
    <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4 hover:bg-gray-700/70 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{component.name}</h3>
          <p className="text-sm text-gray-600">
            Catégorie: {category?.name}
          </p>
          {component.value && (
            <p className="text-sm text-gray-600">
              Valeur: {component.value} {component.unit}
            </p>
          )}
        </div>
        <button className="text-gray-700 hover:text-gray-600">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantité
          </label>
          <input
            type="number"
            value={component.quantity}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={() => {}}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emplacement
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={component.grid_row}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rangée"
              onChange={() => {}}
            />
            <input
              type="number"
              value={component.grid_column}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Colonne"
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Couleur LED
        </label>
        <input
          type="color"
          value={`#${component.led_color_r.toString(16).padStart(2, '0')}${component.led_color_g.toString(16).padStart(2, '0')}${component.led_color_b.toString(16).padStart(2, '0')}`}
          onChange={(e) => {
            const color = e.target.value;
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            onColorChange(component.id, { r, g, b });
          }}
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>

      <div className="flex justify-between">
        <button className="text-gray-700 hover:text-gray-600 flex items-center gap-1">
          <Grid size={16} />
          Propriétés
        </button>
        <button className="bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors px-3 py-1">
          <Save size={16} />
          Sauvegarder
        </button>
      </div>
    </div>
  );
} 