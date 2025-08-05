import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: ".env" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertCategories() {
  const productCategories = [
    { name: 'Sistemas Hidráulicos', type: 'product' },
    { name: 'Atuadores', type: 'product' },
    { name: 'Controle', type: 'product' },
    { name: 'Bombas', type: 'product' },
    { name: 'Motores', type: 'product' },
    { name: 'Armazenamento', type: 'product' },
    { name: 'Sistemas Compactos', type: 'product' },
    { name: 'Filtros', type: 'product' },
    { name: 'Acessórios', type: 'product' }
  ];

  const galleryCategories = [
    { name: 'Unidades Hidráulicas', type: 'gallery' },
    { name: 'Cilindros', type: 'gallery' },
    { name: 'Tubulações', type: 'gallery' },
    { name: 'Bombas', type: 'gallery' },
    { name: 'Válvulas', type: 'gallery' },
    { name: 'Projetos', type: 'gallery' },
    { name: 'Testes', type: 'gallery' },
    { name: 'Equipe', type: 'gallery' }
  ];

  const serviceCategories = [
    { name: 'Automação', type: 'service' },
    { name: 'Projetos', type: 'service' },
    { name: 'Manutenção', type: 'service' },
    { name: 'Fabricação', type: 'service' },
    { name: 'Instalação', type: 'service' }
  ];

  const allCategories = [...productCategories, ...galleryCategories, ...serviceCategories];

  for (const category of allCategories) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select();

      if (error) {
        if (error.code === '23505') { // Duplicate key error
          console.log(`Categoria '${category.name}' do tipo '${category.type}' já existe. Pulando.`);
        } else {
          throw error;
        }
      } else {
        console.log(`Categoria '${category.name}' do tipo '${category.type}' inserida com sucesso:`, data);
      }
    } catch (error) {
      console.error(`Erro ao inserir categoria '${category.name}' do tipo '${category.type}':`, error.message);
    }
  }
}

insertCategories();


