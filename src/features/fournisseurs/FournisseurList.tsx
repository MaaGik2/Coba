import { Plus } from 'lucide-react';
import type { Fournisseur } from '../../types';

interface FournisseurListProps {
  fournisseurs: Fournisseur[];
  onAddClick: () => void;
}

export function FournisseurList({ fournisseurs, onAddClick }: FournisseurListProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Fournisseurs</h2>
        <button
          onClick={onAddClick}
          className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
        >
          <Plus size={20} />
          Nouveau Fournisseur
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fournisseurs.map(fournisseur => (
          <div
            key={fournisseur.id}
            className="bg-gray-700/50 border border-gray-600 rounded-xl p-4"
          >
            <h3 className="text-lg font-semibold">{fournisseur.nom}</h3>
            {fournisseur.email && (
              <p className="text-sm text-gray-400">{fournisseur.email}</p>
            )}
            {fournisseur.telephone && (
              <p className="text-sm text-gray-400">{fournisseur.telephone}</p>
            )}
            {fournisseur.site_web && (
              <a
                href={fournisseur.site_web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Site web
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 