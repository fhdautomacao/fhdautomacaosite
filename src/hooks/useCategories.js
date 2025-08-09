import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../api/categories';

/**
 * Hook personalizado para gerenciar categorias
 * @param {string} type - Tipo da categoria ('product', 'gallery', 'service')
 * @returns {Object} Estado e funções para gerenciar categorias
 */
export const useCategories = (type = null, options = {}) => {
  const { initialData = null, enabled = true } = options;
  const [categories, setCategories] = useState(initialData || []);
  const [loading, setLoading] = useState(enabled && !initialData);
  const [error, setError] = useState(null);

  /**
   * Carrega as categorias do Supabase
   */
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (type) {
        data = await categoriesAPI.getByType(type);
      } else {
        data = await categoriesAPI.getAll();
      }
      
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, [type]);

  /**
   * Recarrega as categorias
   */
  const refetch = useCallback(() => {
    if (!enabled) return;
    loadCategories();
  }, [enabled, loadCategories]);

  /**
   * Adiciona uma nova categoria
   */
  const addCategory = useCallback(async (categoryData) => {
    try {
      const newCategory = await categoriesAPI.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err.message || 'Erro ao adicionar categoria');
      throw err;
    }
  }, []);

  /**
   * Atualiza uma categoria existente
   */
  const updateCategory = useCallback(async (id, updates) => {
    try {
      const updatedCategory = await categoriesAPI.update(id, updates);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      );
      return updatedCategory;
    } catch (err) {
      setError(err.message || 'Erro ao atualizar categoria');
      throw err;
    }
  }, []);

  /**
   * Remove uma categoria
   */
  const removeCategory = useCallback(async (id) => {
    try {
      await categoriesAPI.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Erro ao remover categoria');
      throw err;
    }
  }, []);

  // Carrega as categorias quando o hook é montado ou o tipo muda
  useEffect(() => {
    if (!enabled || initialData) return;
    loadCategories();
  }, [enabled, initialData, loadCategories]);

  return {
    categories,
    loading,
    error,
    refetch,
    addCategory,
    updateCategory,
    removeCategory
  };
};

/**
 * Hook específico para categorias de produtos
 */
export const useProductCategories = (options = {}) => useCategories('product', options);

/**
 * Hook específico para categorias de galeria
 */
export const useGalleryCategories = (options = {}) => useCategories('gallery', options);

/**
 * Hook específico para categorias de serviços
 */
export const useServiceCategories = (options = {}) => useCategories('service', options);


