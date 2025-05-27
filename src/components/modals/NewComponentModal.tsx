import { X, Plus } from 'lucide-react';
import type { NewComponentFormData, Category, TypeComposant, Emplacement, Fournisseur } from '../../types';

interface NewComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newComponent: NewComponentFormData;
  setNewComponent: (component: NewComponentFormData) => void;
  categories: Category[];
  typesComposant: TypeComposant[];
  emplacements: Emplacement[];
  fournisseurs: Fournisseur[];
  renderCategoryOptions: (categories: Category[], level?: number) => JSX.Element[];
  getMainCategories: () => Category[];
  onAddTypeComposant: () => void;
  onAddEmplacement: () => void;
  onAddFournisseur: () => void;
}

export function NewComponentModal({
  isOpen,
  onClose,
  onSubmit,
  newComponent,
  setNewComponent,
  categories,
  typesComposant,
  emplacements,
  fournisseurs,
  renderCategoryOptions,
  getMainCategories,
  onAddTypeComposant,
  onAddEmplacement,
  onAddFournisseur
}: NewComponentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nouveau Composant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                required
                value={newComponent.name}
                onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de composant
              </label>
              <div className="flex gap-2">
                <select
                  value={newComponent.type_id || ''}
                  onChange={(e) => setNewComponent({...newComponent, type_id: e.target.value})}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un type</option>
                  {typesComposant.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.libelle}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onAddTypeComposant}
                  className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emplacement
              </label>
              <div className="flex gap-2">
                <select
                  value={newComponent.emplacement_id || ''}
                  onChange={(e) => setNewComponent({...newComponent, emplacement_id: e.target.value})}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un emplacement</option>
                  {emplacements.map(emplacement => (
                    <option key={emplacement.id} value={emplacement.id}>
                      {emplacement.description}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onAddEmplacement}
                  className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur
              </label>
              <div className="flex gap-2">
                <select
                  value={newComponent.fournisseur_id || ''}
                  onChange={(e) => setNewComponent({...newComponent, fournisseur_id: e.target.value})}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map(fournisseur => (
                    <option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.nom}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onAddFournisseur}
                  className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valeur
                </label>
                <input
                  type="number"
                  step="any"
                  value={newComponent.value || ''}
                  onChange={(e) => setNewComponent({...newComponent, value: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unité
                </label>
                <input
                  type="text"
                  value={newComponent.unit || ''}
                  onChange={(e) => setNewComponent({...newComponent, unit: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ω, µF, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                required
                min="0"
                value={newComponent.quantity}
                onChange={(e) => setNewComponent({...newComponent, quantity: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emplacement
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Rangée"
                  value={newComponent.grid_row}
                  onChange={(e) => setNewComponent({...newComponent, grid_row: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Colonne"
                  value={newComponent.grid_column}
                  onChange={(e) => setNewComponent({...newComponent, grid_column: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur LED
              </label>
              <input
                type="color"
                value={`#${newComponent.led_color_r.toString(16).padStart(2, '0')}${newComponent.led_color_g.toString(16).padStart(2, '0')}${newComponent.led_color_b.toString(16).padStart(2, '0')}`}
                onChange={(e) => {
                  const color = e.target.value;
                  const r = parseInt(color.slice(1, 3), 16);
                  const g = parseInt(color.slice(3, 5), 16);
                  const b = parseInt(color.slice(5, 7), 16);
                  setNewComponent({
                    ...newComponent,
                    led_color_r: r,
                    led_color_g: g,
                    led_color_b: b
                  });
                }}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 