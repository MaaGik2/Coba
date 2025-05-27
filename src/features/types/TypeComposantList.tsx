import { Plus } from 'lucide-react';
import type { TypeComposant } from '../../types';

interface TypeComposantListProps {
  types: TypeComposant[];
  onAddClick: () => void;
}

export function TypeComposantList({ types, onAddClick }: TypeComposantListProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Types de Composants</h2>
        <button
          onClick={onAddClick}
          className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
        >
          <Plus size={20} />
          Nouveau Type
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map(type => (
          <div
            key={type.id}
            className="bg-gray-700/50 border border-gray-600 rounded-xl p-4"
          >
            <h3 className="text-lg font-semibold">{type.libelle}</h3>
          </div>
        ))}
      </div>
    </div>
  );
} 