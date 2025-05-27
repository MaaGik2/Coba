import { useState, useEffect } from 'react';
import type { Emplacement } from '../types';
import { EmplacementRepository } from '../repositories/EmplacementRepository';

export const useEmplacements = () => {
  const [emplacements, setEmplacements] = useState<Emplacement[]>([]);
  const [newEmplacement, setNewEmplacement] = useState({ description: '' });
  const emplacementRepository = new EmplacementRepository();

  useEffect(() => {
    fetchEmplacements();
  }, []);

  const fetchEmplacements = async () => {
    try {
      const data = await emplacementRepository.fetchAll();
      setEmplacements(data);
    } catch (error) {
      console.error('Erreur lors du chargement des emplacements:', error);
    }
  };

  const handleEmplacementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emplacementRepository.create(newEmplacement.description);
      await fetchEmplacements();
      setNewEmplacement({ description: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'emplacement:', error);
    }
  };

  return {
    emplacements,
    newEmplacement,
    setNewEmplacement,
    handleEmplacementSubmit
  };
}; 