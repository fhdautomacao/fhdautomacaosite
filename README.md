# 🏢 FHD Automação - Sistema de Gestão Empresarial

Sistema completo de gestão empresarial com interface web moderna, APIs organizadas e documentação profissional.

## 🚀 Visão Geral

Sistema de gestão empresarial desenvolvido com **Next.js 14**, **Supabase** e **Tailwind CSS**, oferecendo funcionalidades completas para gestão de boletos, cotações, clientes e conteúdo do site.

## ✨ Funcionalidades Principais

### 🏢 **Área Administrativa**
- **Dashboard Avançado** - Métricas e relatórios em tempo real
- **Gestão de Boletos** - Contas a pagar/receber com parcelamento
- **Gestão de Cotações** - Orçamentos e propostas
- **Gestão de Clientes** - Cadastro e histórico completo
- **Divisão de Lucros** - Sistema de profit sharing
- **Upload de Comprovantes** - Gestão de arquivos PDF

### 🌐 **Área Pública**
- **Página Inicial** - Hero section com estatísticas
- **Sobre a Empresa** - Conteúdo institucional
- **Galeria de Projetos** - Portfolio visual
- **Depoimentos** - Testimonials de clientes
- **Contato** - Formulário e informações
- **SEO Otimizado** - Configurações por página

### 🔧 **Recursos Técnicos**
- **Autenticação Segura** - Supabase Auth com RLS
- **APIs Organizadas** - Estrutura modular
- **Responsivo** - Design mobile-first
- **PWA Ready** - Progressive Web App
- **Real-time** - Atualizações em tempo real

## 🛠️ Tecnologias

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **Tailwind CSS** - Framework CSS utilitário
- **React Hooks** - Gerenciamento de estado
- **Supabase JS** - Cliente para banco de dados

### **Backend**
- **Supabase** - Banco PostgreSQL + Auth + Storage
- **Vercel Functions** - APIs serverless
- **Row Level Security** - Segurança por usuário

### **Deploy & Infraestrutura**
- **Vercel** - Deploy e hosting
- **Supabase** - Banco de dados e autenticação
- **GitHub** - Versionamento

## 📦 Instalação

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no Vercel (opcional)

### **1. Clone o Repositório**
```bash
git clone https://github.com/fhdautomacao/fhdautomacaosite.git
cd fhdautomacaosite
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Configure as Variáveis de Ambiente**
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### **4. Configure o Supabase**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Inicializar projeto local
supabase init

# Aplicar migrações
supabase db push
```

### **5. Execute o Projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run start
```

## 📁 Estrutura do Projeto

```
fhd-automacao-site/
├── 📁 src/                    # Código fonte
│   ├── 📁 app/               # Páginas Next.js (App Router)
│   ├── 📁 components/        # Componentes React
│   ├── 📁 lib/              # Utilitários e configurações
│   ├── 📁 api/              # APIs do frontend
│   │   ├── 📁 server-apis/  # Wrappers das APIs do servidor
│   │   └── *.js             # APIs do Supabase
│   ├── 📁 hooks/            # Custom hooks
│   ├── 📁 services/         # Serviços externos
│   └── 📁 pages/            # Páginas administrativas
├── 📁 server-apis/           # APIs do servidor (Vercel Functions)
│   ├── 📁 api/              # Endpoints organizados
│   └── *.js                 # APIs principais
├── 📁 docs/                  # Documentação completa
│   ├── 📄 README.md         # Índice da documentação
│   ├── 📄 guia-inicio-rapido.md
│   ├── 📄 arquitetura.md
│   ├── 📄 apis-endpoints.md
│   ├── 📄 banco-dados.md
│   ├── 📄 funcionalidades.md
│   ├── 📄 componentes-ui.md
│   ├── 📄 autenticacao-seguranca.md
│   ├── 📄 deploy-producao.md
│   └── 📄 manutencao.md
├── 📁 supabase/              # Configurações do Supabase
│   └── 📁 migrations/       # Migrações do banco
├── 📄 vercel.json           # Configuração do Vercel
├── 📄 package.json          # Dependências
└── 📄 README.md            # Este arquivo
```

## 🔧 Configuração Detalhada

### **Supabase Setup**
1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente
3. Execute as migrações: `supabase db push`
4. Configure as políticas RLS
5. Configure o storage para arquivos

### **Vercel Setup**
1. Conecte o repositório ao [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático ativado

## 📊 Banco de Dados

### **Tabelas Principais**
- **`users`** - Usuários do sistema
- **`bills`** - Boletos e contas
- **`bill_installments`** - Parcelas dos boletos
- **`quotations`** - Cotações e orçamentos
- **`clients`** - Clientes
- **`companies`** - Empresas
- **`profit_sharing`** - Divisão de lucros
- **`products`** - Produtos
- **`services`** - Serviços
- **`categories`** - Categorias

### **Tabelas de Conteúdo**
- **`hero_content`** - Conteúdo da página inicial
- **`about_content`** - Sobre a empresa
- **`contact_info`** - Informações de contato
- **`gallery_items`** - Galeria de projetos
- **`testimonials`** - Depoimentos
- **`seo_settings`** - Configurações SEO

## 🔐 Segurança

### **Autenticação**
- Supabase Auth com JWT
- Row Level Security (RLS)
- Políticas de acesso por usuário
- Refresh tokens automáticos

### **Proteções**
- Validação de entrada
- Sanitização de dados
- Rate limiting
- Headers de segurança

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
# Deploy automático via GitHub
git push origin main
```

### **Variáveis de Ambiente (Vercel)**
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_ROLE_KEY=sua_service_role
```

## 📚 Documentação

Documentação completa disponível na pasta `docs/`:

- 📖 [Guia de Início Rápido](./docs/guia-inicio-rapido.md)
- 🏗️ [Arquitetura do Sistema](./docs/arquitetura.md)
- 🔧 [APIs e Endpoints](./docs/apis-endpoints.md)
- 🗄️ [Banco de Dados](./docs/banco-dados.md)
- 📱 [Funcionalidades](./docs/funcionalidades.md)
- 🎨 [Componentes e UI](./docs/componentes-ui.md)
- 🔐 [Autenticação e Segurança](./docs/autenticacao-seguranca.md)
- 🚀 [Deploy e Produção](./docs/deploy-producao.md)
- 🛠️ [Manutenção](./docs/manutencao.md)

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@fhdautomacao.com
- **Documentação**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/fhdautomacao/fhdautomacaosite/issues)

## 🏆 Status do Projeto

- ✅ **APIs Organizadas** - Estrutura modular
- ✅ **Documentação Completa** - 12 arquivos detalhados
- ✅ **Limpeza do Projeto** - Código otimizado
- ✅ **Deploy Configurado** - Vercel + Supabase
- ✅ **Segurança Implementada** - RLS + Auth
- ✅ **Responsivo** - Mobile-first design

---

**Desenvolvido com ❤️ pela FHD Automação**

