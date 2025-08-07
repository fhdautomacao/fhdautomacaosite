# 🚀 Guia de Início Rápido

Este guia te ajudará a configurar e executar o projeto FHD Automação em poucos minutos.

## 📋 Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Conta Supabase** ([Criar conta](https://supabase.com/))

## ⚡ Configuração Rápida

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/fhd-automacao-site.git
cd fhd-automacao-site
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:5173
NEXT_PUBLIC_APP_NAME=FHD Automação

# Mobile API Configuration
NEXT_PUBLIC_MOBILE_API_URL=http://localhost:5173/api
```

### 4. Execute o Projeto

```bash
npm run dev
```

O site estará disponível em: `http://localhost:5173`

## 🔧 Configuração do Supabase

### 1. Crie um Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Digite um nome para o projeto
5. Escolha uma senha para o banco
6. Escolha uma região
7. Clique em "Create new project"

### 2. Configure as Migrações

Execute as migrações do banco de dados:

```bash
# Instale o CLI do Supabase
npm install -g supabase

# Faça login
supabase login

# Execute as migrações
supabase db push
```

### 3. Configure as Variáveis

No dashboard do Supabase:
1. Vá em **Settings** → **API**
2. Copie a **URL** e **anon key**
3. Cole no arquivo `.env`

## 🎯 Estrutura do Projeto

```
fhd-automacao-site/
├── src/                    # Código fonte
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── api/               # APIs do frontend
│   ├── hooks/             # Custom hooks
│   ├── contexts/          # Contextos React
│   ├── utils/             # Utilitários
│   └── lib/               # Bibliotecas
├── server-apis/           # APIs do servidor
├── public/                # Arquivos estáticos
├── supabase/              # Migrações do banco
└── docs/                  # Documentação
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Visualiza build de produção

# Linting e Formatação
npm run lint         # Executa ESLint
npm run format       # Formata código com Prettier

# Testes
npm run test         # Executa testes
npm run test:watch   # Executa testes em modo watch
```

## 🔍 Verificando a Instalação

Após executar `npm run dev`, você deve ver:

1. ✅ Servidor rodando em `http://localhost:5173`
2. ✅ Página inicial carregando
3. ✅ Sem erros no console
4. ✅ Conexão com Supabase funcionando

## 🆘 Solução de Problemas

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

### Erro de Dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Build
```bash
npm run build
# Verifique os erros no terminal
```

## 📞 Próximos Passos

1. **Configure o banco de dados**: [Banco de Dados](./banco-dados.md)
2. **Entenda a arquitetura**: [Arquitetura](./arquitetura.md)
3. **Explore as funcionalidades**: [Funcionalidades](./funcionalidades.md)

---

**Precisa de ajuda?** Consulte a seção [Manutenção](./manutencao.md) ou entre em contato com o suporte.
