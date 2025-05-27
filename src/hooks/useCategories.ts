import { useState, useEffect } from 'react';
import type { Category } from '../types';
import { CategoryRepository } from '../repositories/CategoryRepository';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', parent_id: '' });
  const categoryRepository = new CategoryRepository();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryRepository.fetchAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryRepository.create(newCategory.name, newCategory.parent_id || null);
      await fetchCategories();
      setNewCategory({ name: '', parent_id: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
    }
  };

  return {
    categories,
    newCategory,
    setNewCategory,
    handleCategorySubmit
  };
}; 