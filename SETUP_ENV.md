# Configuração de Variáveis de Ambiente

## Para Desenvolvimento Local

1. **Crie um arquivo `.env` na raiz do projeto** com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# App Configuration
NEXT_PUBLIC_APP_URL=https://fhd-automacao-industrial-bq67.vercel.app
NEXT_PUBLIC_APP_NAME=FHD Automação

# Mobile API Configuration
NEXT_PUBLIC_MOBILE_API_URL=https://fhd-automacao-industrial-bq67.vercel.app/api
```

## Para Produção (Vercel)

1. **No Vercel Dashboard**:
   - Vá para seu projeto
   - Settings → Environment Variables
   - Adicione as seguintes variáveis:

### Variáveis Obrigatórias:
- `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua anon key do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` = sua service role key do Supabase

### Como obter a Service Role Key:
1. No Supabase Dashboard
2. Settings → API
3. Copie a "service_role" key (não a anon key)

## Importante:
- O arquivo `.env` está no `.gitignore` por segurança
- Nunca commite as chaves reais no Git
- Use sempre as variáveis de ambiente no Vercel para produção
