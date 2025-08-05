import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../api/categories';

/**
 * Hook personalizado para gerenciar categorias
 * @param {string} type - Tipo da categoria ('product', 'gallery', 'service')
 * @returns {Object} Estado e funções para gerenciar categorias
 */
export const useCategories = (type = null) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  /**
   * Recarrega as categorias
   */
  const refetch = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

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
    loadCategories();
  }, [loadCategories]);

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
export const useProductCategories = () => useCategories('product');

/**
 * Hook específico para categorias de galeria
 */
export const useGalleryCategories = () => useCategories('gallery');

/**
 * Hook específico para categorias de serviços
 */
export const useServiceCategories = () => useCategories('service');


