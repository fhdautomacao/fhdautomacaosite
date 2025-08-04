# FHD Automação Industrial - Site Institucional

## Visão Geral

Este é o site institucional da FHD Automação Industrial, desenvolvido em React com Vite, utilizando tecnologias modernas como Tailwind CSS, Shadcn/UI e integração com Supabase para funcionalidades administrativas.

## Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Biblioteca de componentes UI
- **React Router DOM** - Roteamento para aplicações React
- **Supabase** - Backend como serviço para autenticação e banco de dados
- **Framer Motion** - Biblioteca para animações
- **React Helmet Async** - Gerenciamento de meta tags para SEO

## Estrutura do Projeto

```
fhd-automacao-site/
├── public/                     # Arquivos estáticos
│   ├── favicon.ico
│   ├── logo.png
│   ├── logo_no_bg.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/                        # Código fonte
│   ├── api/                    # Serviços de API
│   ├── assets/                 # Recursos estáticos
│   ├── components/             # Componentes React
│   │   ├── common/            # Componentes comuns
│   │   ├── layout/            # Componentes de layout
│   │   ├── sections/          # Seções da página
│   │   └── ui/                # Componentes de interface
│   ├── contexts/              # Contextos React
│   ├── hooks/                 # Hooks customizados
│   ├── lib/                   # Bibliotecas e utilitários
│   ├── pages/                 # Páginas da aplicação
│   │   ├── admin/            # Páginas administrativas
│   │   └── public/           # Páginas públicas
│   └── utils/                 # Funções utilitárias
├── package.json               # Dependências e scripts
├── vite.config.js            # Configuração do Vite
├── tailwind.config.js        # Configuração do Tailwind
└── README.md                 # Este arquivo
```



## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou pnpm (recomendado)

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd fhd-automacao-site
```

2. Instale as dependências:
```bash
# Usando npm
npm install

# Ou usando pnpm (recomendado)
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env.local na raiz do projeto
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter ESLint

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O site estará disponível em `http://localhost:5173`

## Estrutura Detalhada dos Componentes

### Componentes Comuns (`src/components/common/`)

- **ProtectedRoute.jsx** - Componente para proteção de rotas administrativas
- **SEOHead.jsx** - Componente para gerenciamento de meta tags SEO

### Layout (`src/components/layout/`)

- **HeaderImproved.jsx** - Cabeçalho principal do site
- **Footer.jsx** - Rodapé do site

### Seções (`src/components/sections/`)

- **AboutImproved.jsx** - Seção "Sobre Nós"
- **HeroImproved.jsx** - Seção principal (hero)
- **ServicesImproved.jsx** - Seção de serviços
- **Clients.jsx** - Seção de clientes
- **Contact.jsx** - Seção de contato
- **Gallery.jsx** - Galeria de imagens
- **Products.jsx** - Seção de produtos

### Componentes UI (`src/components/ui/`)

Biblioteca completa de componentes baseados em Shadcn/UI, incluindo:
- Botões, cards, formulários
- Modais, tooltips, dropdowns
- Tabelas, acordeões, abas
- E muitos outros componentes reutilizáveis


## Páginas da Aplicação

### Páginas Públicas (`src/pages/public/`)

- **HomePage.jsx** - Página inicial
- **AboutPage.jsx** - Página "Quem Somos"
- **ServicesPage.jsx** - Página de serviços
- **ClientsPage.jsx** - Página de clientes
- **ContactPage.jsx** - Página de contato
- **PoliticaPrivacidade.jsx** - Política de privacidade
- **TermosDeUso.jsx** - Termos de uso

### Páginas Administrativas (`src/pages/admin/`)

- **LoginPage.jsx** - Página de login administrativo
- **AdminPageNew.jsx** - Painel administrativo principal
- **ClientsManager.jsx** - Gerenciamento de clientes
- **GalleryManager.jsx** - Gerenciamento de galeria
- **ProductsManager.jsx** - Gerenciamento de produtos
- **ContentManagers/** - Gerenciadores de conteúdo específicos
  - **HeroManager.jsx** - Gerenciamento da seção hero
  - **ServicesManager.jsx** - Gerenciamento de serviços

## Serviços de API (`src/api/`)

O projeto inclui uma camada de abstração para comunicação com APIs:

- **about.js** - Serviços relacionados à seção "Sobre"
- **auth.js** - Serviços de autenticação
- **clients.js** - Serviços de gerenciamento de clientes
- **contact.js** - Serviços de contato
- **contactInfo.js** - Informações de contato
- **gallery.js** - Serviços da galeria
- **hero.js** - Serviços da seção hero
- **products.js** - Serviços de produtos
- **services.js** - Serviços de serviços
- **seo.js** - Serviços de SEO
- **storage.js** - Serviços de armazenamento
- **testimonials.js** - Serviços de depoimentos

## Contextos e Hooks

### Contextos (`src/contexts/`)

- **AuthContext.jsx** - Contexto de autenticação para gerenciamento de estado de login

### Hooks Customizados (`src/hooks/`)

- **use-mobile.js** - Hook para detecção de dispositivos móveis
- **useScrollAnimation.js** - Hook para animações baseadas em scroll

## Bibliotecas e Utilitários

### Lib (`src/lib/`)

- **supabase.js** - Configuração e cliente do Supabase
- **utils.js** - Funções utilitárias gerais

### Utils (`src/utils/`)

- **seo.js** - Utilitários para SEO


## Sistema de Autenticação

O projeto implementa um sistema de autenticação robusto para proteger as áreas administrativas:

### Funcionalidades

- **Login Administrativo** - Acesso protegido ao painel de administração
- **Proteção de Rotas** - Rotas administrativas protegidas por autenticação
- **Persistência de Sessão** - Manutenção do estado de login entre sessões
- **Logout Seguro** - Limpeza completa da sessão ao fazer logout

### Credenciais de Desenvolvimento

Para acessar o painel administrativo em desenvolvimento:
- **Usuário:** `admin`
- **Senha:** `admin`

### Rotas Protegidas

- `/admin-fhd` - Painel administrativo principal
- `/login-admin` - Página de login

## Configuração do Supabase

O projeto está preparado para integração com Supabase. Para configurar:

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente no arquivo `.env.local`
3. Execute o script SQL fornecido em `supabase_complete_schema.sql`

### Variáveis de Ambiente Necessárias

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## Deploy e Produção

### Build de Produção

Para gerar a build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

### Deploy na Vercel

O projeto inclui configuração para deploy na Vercel (`vercel.json`):

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. O deploy será automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte aplicações React:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## SEO e Performance

### Otimizações Implementadas

- **Meta Tags Dinâmicas** - Usando React Helmet Async
- **Sitemap** - Arquivo sitemap.xml para indexação
- **Robots.txt** - Configuração para crawlers
- **Lazy Loading** - Carregamento otimizado de componentes
- **Code Splitting** - Divisão automática do código pelo Vite

### Estrutura de SEO

- Títulos e descrições únicos para cada página
- Open Graph tags para redes sociais
- Schema markup para rich snippets
- URLs amigáveis e estruturadas


## Manutenção e Desenvolvimento

### Estrutura de Desenvolvimento

O projeto segue as melhores práticas de desenvolvimento React:

- **Componentes Funcionais** - Uso exclusivo de componentes funcionais com hooks
- **Separação de Responsabilidades** - Cada componente tem uma responsabilidade específica
- **Reutilização** - Componentes UI reutilizáveis baseados em Shadcn/UI
- **Tipagem** - Preparado para migração para TypeScript
- **Linting** - ESLint configurado para manter qualidade do código

### Adicionando Novas Funcionalidades

#### Nova Página Pública

1. Crie o componente em `src/pages/public/`
2. Adicione a rota em `src/App.jsx`
3. Implemente o SEO necessário
4. Adicione links de navegação se necessário

#### Nova Página Administrativa

1. Crie o componente em `src/pages/admin/`
2. Adicione a rota protegida em `src/App.jsx`
3. Implemente a lógica de autenticação necessária

#### Novo Componente UI

1. Adicione o componente em `src/components/ui/`
2. Siga os padrões do Shadcn/UI
3. Documente as props e uso
4. Adicione ao sistema de design se necessário

### Boas Práticas

- **Commits Semânticos** - Use conventional commits
- **Testes** - Adicione testes para novas funcionalidades
- **Documentação** - Mantenha a documentação atualizada
- **Performance** - Monitore o bundle size e performance
- **Acessibilidade** - Siga as diretrizes WCAG

## Troubleshooting

### Problemas Comuns

#### Erro de Dependências

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

#### Problemas de Build

```bash
# Verifique se todas as dependências estão instaladas
npm install

# Execute o linter para verificar erros
npm run lint
```

#### Problemas de Autenticação

- Verifique se as variáveis de ambiente estão configuradas
- Confirme se o Supabase está configurado corretamente
- Verifique se as credenciais de desenvolvimento estão corretas

### Logs e Debugging

- Use o console do navegador para debugging
- Verifique os logs do servidor de desenvolvimento
- Use as ferramentas de desenvolvimento do React

## Contribuição

### Como Contribuir

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código

- Use ESLint para manter a qualidade do código
- Siga os padrões de nomenclatura estabelecidos
- Documente funções e componentes complexos
- Mantenha os componentes pequenos e focados

## Licença

Este projeto é propriedade da FHD Automação Industrial. Todos os direitos reservados.

## Contato

Para dúvidas sobre o desenvolvimento ou manutenção do site:

- **Empresa:** FHD Automação Industrial
- **Site:** [URL do site]
- **Email:** [email de contato]

---

**Documentação gerada automaticamente - Última atualização:** Janeiro 2025

