import { Plus } from 'lucide-react';
import type { Emplacement } from '../../types';

interface EmplacementListProps {
  emplacements: Emplacement[];
  onAddClick: () => void;
}

export function EmplacementList({ emplacements, onAddClick }: EmplacementListProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Emplacements</h2>
        <button
          onClick={onAddClick}
          className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
        >
          <Plus size={20} />
          Nouvel Emplacement
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emplacements.map(emplacement => (
          <div
            key={emplacement.id}
            className="bg-gray-700/50 border border-gray-600 rounded-xl p-4"
          >
            <h3 className="text-lg font-semibold">{emplacement.description}</h3>
          </div>
        ))}
      </div>
    </div>
  );
} 