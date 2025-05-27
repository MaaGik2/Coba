import React from 'react';
import { Search, Plus } from 'lucide-react';
import type { Component, Category, NewComponentFormData, TypeComposant, Emplacement, Fournisseur } from './types';
import { supabase } from './lib/supabase';
import { Header } from './components/layout/Header';
import { ComponentCard } from './features/components/ComponentCard';
import { NewComponentModal } from './components/modals/NewComponentModal';
import { NewCategoryModal } from './components/modals/NewCategoryModal';
import { useComponents } from './hooks/useComponents';
import { useAuth } from './hooks/useAuth';
import { useCategories } from './hooks/useCategories';
import { useTypesComposant } from './hooks/useTypesComposant';
import { useEmplacements } from './hooks/useEmplacements';
import { useFournisseurs } from './hooks/useFournisseurs';
// import { CategoryRepository } from './repositories/CategoryRepository';
// import { TypeComposantRepository } from './repositories/TypeComposantRepository';
// import { EmplacementRepository } from './repositories/EmplacementRepository';
// import { FournisseurRepository } from './repositories/FournisseurRepository';
import { NewTypeComposantModal } from './components/modals/NewTypeComposantModal';
// import { TypeComposantList } from './features/types/TypeComposantList';
// import { EmplacementList } from './features/emplacements/EmplacementList';
// import { FournisseurList } from './features/fournisseurs/FournisseurList';
import { NewEmplacementModal } from './components/modals/NewEmplacementModal';
import { NewFournisseurModal } from './components/modals/NewFournisseurModal';

// État initial pour les nouveaux éléments
const initialNewComponent: NewComponentFormData = {
  name: '',
  category_id: '',
  quantity: 0,
  grid_row: 1,
  grid_column: 1,
  led_color_r: 0,
  led_color_g: 0,
  led_color_b: 0,
  properties: {},
  value: undefined,
  unit: undefined
};

const initialNewCategory = { name: '', parent_id: '' };
const initialNewTypeComposant = { libelle: '' };
const initialNewEmplacement = { description: '' };
const initialNewFournisseur = {
  nom: '',
  site_web: '',
  email: '',
  telephone: ''
};

function App() {
  // Hooks personnalisés pour la gestion des données
  const { components, createComponent, updateColor } = useComponents();
  const { user, email, setEmail, password, setPassword, handleSignIn, handleSignUp, handleSignOut } = useAuth();
  const { categories, newCategory, setNewCategory, handleCategorySubmit } = useCategories();
  const { typesComposant, newTypeComposant, setNewTypeComposant, handleTypeComposantSubmit } = useTypesComposant();
  const { emplacements, newEmplacement, setNewEmplacement, handleEmplacementSubmit } = useEmplacements();
  const { fournisseurs, newFournisseur, setNewFournisseur, handleFournisseurSubmit } = useFournisseurs();

  // États locaux
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isTypeComposantModalOpen, setIsTypeComposantModalOpen] = React.useState(false);
  const [isEmplacementModalOpen, setIsEmplacementModalOpen] = React.useState(false);
  const [isFournisseurModalOpen, setIsFournisseurModalOpen] = React.useState(false);
  const [newComponent, setNewComponent] = React.useState<NewComponentFormData>(initialNewComponent);

  // Filtrage des composants
  const filteredComponents = React.useMemo(() => {
    return components.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || component.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [components, searchTerm, selectedCategory]);

  // Gestionnaires d'événements
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComponent(newComponent);
      setIsModalOpen(false);
      setNewComponent(initialNewComponent);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du composant:', err);
    }
  };

  // Fonctions utilitaires pour les catégories
  const getSubcategories = (parentId: string | null = null) => {
    return categories.filter((category: Category) => category.parent_id === parentId);
  };

  const getMainCategories = () => {
    return categories.filter((category: Category) => !category.parent_id);
  };

  const renderCategoryOptions = (categories: Category[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <option value={category.id}>
          {'  '.repeat(level) + category.name}
        </option>
        {renderCategoryOptions(getSubcategories(category.id), level + 1)}
      </React.Fragment>
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Inscription
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header onSignOut={handleSignOut} />

        {/* Section Composants */}
        <div className="bg-grey rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un composant..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <select
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {renderCategoryOptions(getMainCategories())}
            </select>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
            >
              <Plus size={20} />
              Nouvelle Catégorie
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
            >
              <Plus size={20} />
              Nouveau Composant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map(component => (
              <ComponentCard
                key={component.id}
                component={component}
                category={categories.find(c => c.id === component.category_id)}
                onColorChange={updateColor}
              />
            ))}
          </div>
        </div>

        {/* Modals */}
        <NewComponentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          newComponent={newComponent}
          setNewComponent={setNewComponent}
          categories={categories}
          typesComposant={typesComposant}
          emplacements={emplacements}
          fournisseurs={fournisseurs}
          renderCategoryOptions={renderCategoryOptions}
          getMainCategories={getMainCategories}
          onAddTypeComposant={() => setIsTypeComposantModalOpen(true)}
          onAddEmplacement={() => setIsEmplacementModalOpen(true)}
          onAddFournisseur={() => setIsFournisseurModalOpen(true)}
        />

        <NewCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSubmit={handleCategorySubmit}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categories={categories}
          renderCategoryOptions={renderCategoryOptions}
          getMainCategories={getMainCategories}
        />

        <NewTypeComposantModal
          isOpen={isTypeComposantModalOpen}
          onClose={() => setIsTypeComposantModalOpen(false)}
          onSubmit={handleTypeComposantSubmit}
          newType={newTypeComposant}
          setNewType={setNewTypeComposant}
        />

        <NewEmplacementModal
          isOpen={isEmplacementModalOpen}
          onClose={() => setIsEmplacementModalOpen(false)}
          onSubmit={handleEmplacementSubmit}
          newEmplacement={newEmplacement}
          setNewEmplacement={setNewEmplacement}
        />

        <NewFournisseurModal
          isOpen={isFournisseurModalOpen}
          onClose={() => setIsFournisseurModalOpen(false)}
          onSubmit={handleFournisseurSubmit}
          newFournisseur={newFournisseur}
          setNewFournisseur={setNewFournisseur}
        />
      </div>
    </div>
  );
}

export default App;