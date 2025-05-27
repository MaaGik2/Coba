import { useState, useEffect } from 'react';
import type { Fournisseur } from '../types';
import { FournisseurRepository } from '../repositories/FournisseurRepository';

export const useFournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [newFournisseur, setNewFournisseur] = useState({
    nom: '',
    site_web: '',
    email: '',
    telephone: ''
  });
  const fournisseurRepository = new FournisseurRepository();

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const data = await fournisseurRepository.fetchAll();
      setFournisseurs(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
    }
  };

  const handleFournisseurSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fournisseurRepository.create(newFournisseur);
      await fetchFournisseurs();
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

  return {
    fournisseurs,
    newFournisseur,
    setNewFournisseur,
    handleFournisseurSubmit
  };
}; 