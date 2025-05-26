import { LogOut } from 'lucide-react';

interface HeaderProps {
  onSignOut: () => void;
}

export function Header({ onSignOut }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Coba
        </h1>
        <p className="text-gray-400 mt-1">Gestionnaire de Composants Électroniques</p>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
      >
        <LogOut size={20} />
        Déconnexion
      </button>
    </div>
  );
} 