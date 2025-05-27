import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Component, Category, NewComponentFormData, TypeComposant, Emplacement, Fournisseur } from './types';
import { supabase } from './lib/supabase';
import { Header } from './components/layout/Header';
import { ComponentCard } from './features/components/ComponentCard';
import { NewComponentModal } from './components/modals/NewComponentModal';
import { NewCategoryModal } from './components/modals/NewCategoryModal';
import { useComponents } from './hooks/useComponents';
import { CategoryRepository } from './repositories/CategoryRepository';
import { TypeComposantRepository } from './repositories/TypeComposantRepository';
import { EmplacementRepository } from './repositories/EmplacementRepository';
import { FournisseurRepository } from './repositories/FournisseurRepository';
import { NewTypeComposantModal } from './components/modals/NewTypeComposantModal';
import { TypeComposantList } from './features/types/TypeComposantList';
import { EmplacementList } from './features/emplacements/EmplacementList';
import { FournisseurList } from './features/fournisseurs/FournisseurList';
import { NewEmplacementModal } from './components/modals/NewEmplacementModal';
import { NewFournisseurModal } from './components/modals/NewFournisseurModal';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', parent_id: '' });
  const [newComponent, setNewComponent] = useState<NewComponentFormData>({
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
  });
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typesComposant, setTypesComposant] = useState<TypeComposant[]>([]);
  const [emplacements, setEmplacements] = useState<Emplacement[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [isTypeComposantModalOpen, setIsTypeComposantModalOpen] = useState(false);
  const [newTypeComposant, setNewTypeComposant] = useState({ libelle: '' });
  const [isEmplacementModalOpen, setIsEmplacementModalOpen] = useState(false);
  const [isFournisseurModalOpen, setIsFournisseurModalOpen] = useState(false);
  const [newEmplacement, setNewEmplacement] = useState({ description: '' });
  const [newFournisseur, setNewFournisseur] = useState({
    nom: '',
    site_web: '',
    email: '',
    telephone: ''
  });

  const { components, createComponent, updateColor } = useComponents();
  const categoryRepository = new CategoryRepository();
  const typeComposantRepository = new TypeComposantRepository();
  const emplacementRepository = new EmplacementRepository();
  const fournisseurRepository = new FournisseurRepository();

  useEffect(() => {
    fetchCategories();
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    fetchTypesComposant();
    fetchEmplacements();
    fetchFournisseurs();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryRepository.fetchAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const fetchTypesComposant = async () => {
    try {
      const data = await typeComposantRepository.fetchAll();
      setTypesComposant(data);
    } catch (error) {
      console.error('Erreur lors du chargement des types de composants:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComponent(newComponent);
      setIsModalOpen(false);
      setNewComponent({
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
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout du composant:', err);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryRepository.create(newCategory.name, newCategory.parent_id || null);
      setIsCategoryModalOpen(false);
      fetchCategories();
      setNewCategory({ name: '', parent_id: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
    }
  };

  const getSubcategories = (parentId: string | null = null) => {
    return categories.filter(category => category.parent_id === parentId);
  };

  const getMainCategories = () => {
    return categories.filter(category => !category.parent_id);
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

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || component.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      alert('Vérifiez votre email pour confirmer votre inscription !');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchEmplacements = async () => {
    try {
      const data = await emplacementRepository.fetchAll();
      setEmplacements(data);
    } catch (error) {
      console.error('Erreur lors du chargement des emplacements:', error);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const data = await fournisseurRepository.fetchAll();
      setFournisseurs(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
    }
  };

  const handleTypeComposantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await typeComposantRepository.create(newTypeComposant.libelle);
      setIsTypeComposantModalOpen(false);
      fetchTypesComposant();
      setNewTypeComposant({ libelle: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du type de composant:', error);
    }
  };

  const handleEmplacementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emplacementRepository.create(newEmplacement.description);
      setIsEmplacementModalOpen(false);
      fetchEmplacements();
      setNewEmplacement({ description: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'emplacement:', error);
    }
  };

  const handleFournisseurSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fournisseurRepository.create(newFournisseur);
      setIsFournisseurModalOpen(false);
      fetchFournisseurs();
      setNewFournisseur({
        nom: '',
        site_web: '',
        email: '',
        telephone: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du fournisseur:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

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
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Chargement...' : 'Connexion'}
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                disabled={isLoading}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
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