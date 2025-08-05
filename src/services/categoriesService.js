// src/services/categoriesService.js
import { supabase } from '../lib/supabase';

/**
 * Serviço para gerenciar categorias no Supabase
 */
export class CategoriesService {
  /**
   * Busca todas as categorias de um tipo específico
   * @param {string} type - Tipo da categoria ('product', 'gallery', 'service')
   * @returns {Promise<Array>} Lista de categorias
   */
  static async getCategoriesByType(type) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', type)
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no serviço de categorias:', error);
      throw error;
    }
  }

  /**
   * Busca todas as categorias
   * @returns {Promise<Array>} Lista de todas as categorias
   */
  static async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar todas as categorias:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no serviço de categorias:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova categoria
   * @param {Object} category - Dados da categoria
   * @param {string} category.name - Nome da categoria
   * @param {string} category.type - Tipo da categoria
   * @returns {Promise<Object>} Categoria criada
   */
  static async createCategory(category) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de categorias:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma categoria existente
   * @param {string} id - ID da categoria
   * @param {Object} updates - Dados para atualizar
   * @returns {Promise<Object>} Categoria atualizada
   */
  static async updateCategory(id, updates) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de categorias:', error);
      throw error;
    }
  }

  /**
   * Remove uma categoria
   * @param {string} id - ID da categoria
   * @returns {Promise<boolean>} Sucesso da operação
   */
  static async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro no serviço de categorias:', error);
      throw error;
    }
  }
}

