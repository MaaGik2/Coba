import { useState, useEffect } from 'react';
import type { TypeComposant } from '../types';
import { TypeComposantRepository } from '../repositories/TypeComposantRepository';

export const useTypesComposant = () => {
  const [typesComposant, setTypesComposant] = useState<TypeComposant[]>([]);
  const [newTypeComposant, setNewTypeComposant] = useState({ libelle: '' });
  const typeComposantRepository = new TypeComposantRepository();

  useEffect(() => {
    fetchTypesComposant();
  }, []);

  const fetchTypesComposant = async () => {
    try {
      const data = await typeComposantRepository.fetchAll();
      setTypesComposant(data);
    } catch (error) {
      console.error('Erreur lors du chargement des types de composants:', error);
    }
  };

  const handleTypeComposantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await typeComposantRepository.create(newTypeComposant.libelle);
      await fetchTypesComposant();
      setNewTypeComposant({ libelle: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du type de composant:', error);
    }
  };

  return {
    typesComposant,
    newTypeComposant,
    setNewTypeComposant,
    handleTypeComposantSubmit
  };
}; 