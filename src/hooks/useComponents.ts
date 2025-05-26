import { useState, useEffect } from 'react';
import type { Component, NewComponentFormData } from '../types';
import { ComponentRepository } from '../repositories/ComponentRepository';

export function useComponents() {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const componentRepository = new ComponentRepository();

  const fetchComponents = async () => {
    try {
      setIsLoading(true);
      const data = await componentRepository.fetchAll();
      setComponents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const createComponent = async (component: NewComponentFormData) => {
    try {
      setIsLoading(true);
      await componentRepository.create(component);
      await fetchComponents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateColor = async (id: string, color: { r: number; g: number; b: number }) => {
    try {
      setIsLoading(true);
      await componentRepository.updateColor(id, color);
      await fetchComponents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  return {
    components,
    isLoading,
    error,
    createComponent,
    updateColor,
    refreshComponents: fetchComponents
  };
} 