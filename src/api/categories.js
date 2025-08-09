import { supabase } from "../lib/supabase";

export const categoriesAPI = {
  // Buscar todas as categorias por tipo
  getByType: async (type) => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("type", type)
      .order("name", { ascending: true });

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      throw error;
    }
    return data;
  },

  // Buscar categorias por múltiplos tipos em UMA chamada
  getByTypes: async (types = []) => {
    const query = supabase
      .from("categories")
      .select("*")
      .order("type", { ascending: true })
      .order("name", { ascending: true });

    const finalQuery = Array.isArray(types) && types.length > 0
      ? query.in("type", types)
      : query;

    const { data, error } = await finalQuery;

    if (error) {
      console.error("Erro ao buscar categorias (múltiplos tipos):", error);
      throw error;
    }
    return data;
  },

  // Buscar todas as categorias
  getAll: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("type", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Erro ao buscar todas as categorias:", error);
      throw error;
    }
    return data;
  },

  // Criar nova categoria
  create: async (categoryData) => {
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
    return data;
  },

  // Atualizar categoria
  update: async (id, categoryData) => {
    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
    return data;
  },

  // Deletar categoria
  delete: async (id) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
    return true;
  },
};

