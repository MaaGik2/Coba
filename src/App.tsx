import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Save, Grid, X, LogOut } from 'lucide-react';
import type { Component, Category, NewComponentFormData } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [components, setComponents] = useState<Component[]>([]);
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

  useEffect(() => {
    fetchCategories();
    fetchComponents();
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      return;
    }
    setCategories(data);
  };

  const fetchComponents = async () => {
    const { data, error } = await supabase
      .from('components')
      .select('*');
    if (error) {
      console.error('Erreur lors du chargement des composants:', error);
      return;
    }
    setComponents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('components')
      .insert([newComponent]);
    
    if (error) {
      console.error('Erreur lors de l\'ajout du composant:', error);
      return;
    }

    setIsModalOpen(false);
    fetchComponents();
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
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      name: newCategory.name,
      parent_id: newCategory.parent_id || null
    };
    
    const { error } = await supabase
      .from('categories')
      .insert([categoryData]);
    
    if (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      return;
    }

    setIsCategoryModalOpen(false);
    fetchCategories();
    setNewCategory({ name: '', parent_id: '' });
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

  const handleColorChange = async (id: string, color: { r: number; g: number; b: number }) => {
    const { error } = await supabase
      .from('components')
      .update({
        led_color_r: color.r,
        led_color_g: color.g,
        led_color_b: color.b
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la mise à jour de la couleur:', error);
      return;
    }

    fetchComponents();
  };

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
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border rounded-lg"
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestionnaire de Composants Électroniques
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un composant..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <select
              className="px-4 py-2 border rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {renderCategoryOptions(getMainCategories())}
            </select>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
            >
              <Plus size={20} />
              Nouvelle Catégorie
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} />
              Nouveau Composant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map(component => (
              <div key={component.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{component.name}</h3>
                    <p className="text-sm text-gray-600">
                      Catégorie: {categories.find(c => c.id === component.category_id)?.name}
                    </p>
                    {component.value && (
                      <p className="text-sm text-gray-600">
                        Valeur: {component.value} {component.unit}
                      </p>
                    )}
                  </div>
                  <button className="text-red-500 hover:text-red-600">
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
                      className="w-full px-3 py-2 border rounded-lg"
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
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Rangée"
                        onChange={() => {}}
                      />
                      <input
                        type="number"
                        value={component.grid_column}
                        className="w-full px-3 py-2 border rounded-lg"
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
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={component.led_color_r}
                      onChange={(e) => handleColorChange(component.id, {
                        r: parseInt(e.target.value),
                        g: component.led_color_g,
                        b: component.led_color_b
                      })}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={component.led_color_g}
                      onChange={(e) => handleColorChange(component.id, {
                        r: component.led_color_r,
                        g: parseInt(e.target.value),
                        b: component.led_color_b
                      })}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={component.led_color_b}
                      onChange={(e) => handleColorChange(component.id, {
                        r: component.led_color_r,
                        g: component.led_color_g,
                        b: parseInt(e.target.value)
                      })}
                      className="flex-1"
                    />
                  </div>
                  <div
                    className="w-full h-8 rounded-lg mt-2"
                    style={{
                      backgroundColor: `rgb(${component.led_color_r},${component.led_color_g},${component.led_color_b})`
                    }}
                  />
                </div>

                <div className="flex justify-between">
                  <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
                    <Grid size={16} />
                    Propriétés
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-600">
                    <Save size={16} />
                    Sauvegarder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Nouveau Composant</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
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
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      required
                      value={newComponent.category_id}
                      onChange={(e) => setNewComponent({...newComponent, category_id: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {renderCategoryOptions(getMainCategories())}
                    </select>
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
                        className="w-full px-3 py-2 border rounded-lg"
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
                        className="w-full px-3 py-2 border rounded-lg"
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
                      className="w-full px-3 py-2 border rounded-lg"
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
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Colonne"
                        value={newComponent.grid_column}
                        onChange={(e) => setNewComponent({...newComponent, grid_column: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Couleur LED
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-8">R:</span>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={newComponent.led_color_r}
                          onChange={(e) => setNewComponent({
                            ...newComponent,
                            led_color_r: parseInt(e.target.value)
                          })}
                          className="flex-1"
                        />
                        <span className="text-sm w-8">{newComponent.led_color_r}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-8">G:</span>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={newComponent.led_color_g}
                          onChange={(e) => setNewComponent({
                            ...newComponent,
                            led_color_g: parseInt(e.target.value)
                          })}
                          className="flex-1"
                        />
                        <span className="text-sm w-8">{newComponent.led_color_g}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-8">B:</span>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={newComponent.led_color_b}
                          onChange={(e) => setNewComponent({
                            ...newComponent,
                            led_color_b: parseInt(e.target.value)
                          })}
                          className="flex-1"
                        />
                        <span className="text-sm w-8">{newComponent.led_color_b}</span>
                      </div>
                    </div>
                    <div
                      className="w-full h-8 rounded-lg mt-2"
                      style={{
                        backgroundColor: `rgb(${newComponent.led_color_r},${newComponent.led_color_g},${newComponent.led_color_b})`
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
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
        )}

        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Nouvelle Catégorie</h2>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la catégorie
                    </label>
                    <input
                      type="text"
                      required
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie parente (optionnel)
                    </label>
                    <select
                      value={newCategory.parent_id}
                      onChange={(e) => setNewCategory({...newCategory, parent_id: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Aucune (catégorie principale)</option>
                      {renderCategoryOptions(getMainCategories())}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;