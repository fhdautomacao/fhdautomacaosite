# Estrutura Detalhada do Projeto

## Visão Geral da Organização

Este documento detalha a estrutura organizacional do projeto FHD Automação Industrial, explicando a função de cada diretório e arquivo.

## Estrutura de Diretórios

### Raiz do Projeto

```
fhd-automacao-site/
├── README.md                   # Documentação principal
├── ESTRUTURA.md               # Este arquivo - estrutura detalhada
├── package.json               # Dependências e configurações do projeto
├── package-lock.json          # Lock file das dependências
├── vite.config.js            # Configuração do bundler Vite
├── jsconfig.json             # Configuração do JavaScript/paths
├── components.json           # Configuração dos componentes Shadcn/UI
├── eslint.config.js          # Configuração do linter ESLint
├── vercel.json              # Configuração para deploy na Vercel
└── index.html               # Template HTML principal
```

### Diretório Public (`/public`)

Contém arquivos estáticos que são servidos diretamente:

```
public/
├── favicon.ico              # Ícone do site
├── logo.png                # Logo da empresa
├── logo_no_bg.png          # Logo sem fundo
├── robots.txt              # Instruções para crawlers
└── sitemap.xml             # Mapa do site para SEO
```

### Diretório Source (`/src`)

Código fonte principal da aplicação:

```
src/
├── App.jsx                 # Componente raiz da aplicação
├── App.css                 # Estilos globais da aplicação
├── main.jsx               # Ponto de entrada da aplicação
├── index.css              # Estilos base e Tailwind
├── api/                   # Serviços de API
├── assets/                # Recursos estáticos
├── components/            # Componentes React
├── contexts/              # Contextos React
├── hooks/                 # Hooks customizados
├── lib/                   # Bibliotecas e configurações
├── pages/                 # Páginas da aplicação
└── utils/                 # Funções utilitárias
```

## Detalhamento dos Diretórios

### API (`/src/api`)

Camada de abstração para comunicação com APIs externas e Supabase:

```
api/
├── about.js               # API para seção "Sobre"
├── auth.js                # Serviços de autenticação
├── clients.js             # Gerenciamento de clientes
├── contact.js             # Formulários de contato
├── contactInfo.js         # Informações de contato
├── gallery.js             # Galeria de imagens
├── hero.js                # Seção hero/banner
├── products.js            # Catálogo de produtos
├── services.js            # Serviços oferecidos
├── seo.js                 # Dados para SEO
├── storage.js             # Armazenamento de arquivos
└── testimonials.js        # Depoimentos de clientes
```

**Função:** Centralizar todas as chamadas de API, facilitando manutenção e reutilização.

### Assets (`/src/assets`)

Recursos estáticos utilizados na aplicação:

```
assets/
└── logo.png               # Logo principal da empresa
```

**Função:** Armazenar imagens, ícones e outros recursos que são importados diretamente no código.

### Components (`/src/components`)

Componentes React organizados por categoria:

#### Common (`/src/components/common`)

Componentes reutilizáveis em toda a aplicação:

```
common/
├── ProtectedRoute.jsx     # HOC para proteção de rotas
└── SEOHead.jsx           # Componente para meta tags SEO
```

#### Layout (`/src/components/layout`)

Componentes de estrutura da página:

```
layout/
├── HeaderImproved.jsx     # Cabeçalho principal
└── Footer.jsx            # Rodapé do site
```

#### Sections (`/src/components/sections`)

Seções específicas das páginas:

```
sections/
├── AboutImproved.jsx      # Seção "Sobre Nós"
├── Clients.jsx           # Seção de clientes
├── Contact.jsx           # Seção de contato
├── Gallery.jsx           # Galeria de imagens
├── HeroImproved.jsx      # Seção hero principal
├── Products.jsx          # Seção de produtos
└── ServicesImproved.jsx  # Seção de serviços
```

#### UI (`/src/components/ui`)

Biblioteca de componentes de interface baseada em Shadcn/UI:

```
ui/
├── accordion.jsx          # Componente acordeão
├── alert-dialog.jsx       # Diálogos de alerta
├── alert.jsx             # Alertas e notificações
├── aspect-ratio.jsx      # Controle de proporção
├── avatar.jsx            # Avatares de usuário
├── badge.jsx             # Badges e etiquetas
├── breadcrumb.jsx        # Navegação breadcrumb
├── button.jsx            # Botões
├── calendar.jsx          # Calendário
├── card.jsx              # Cards
├── carousel.jsx          # Carrossel de imagens
├── chart.jsx             # Gráficos
├── checkbox.jsx          # Checkboxes
├── collapsible.jsx       # Elementos colapsáveis
├── command.jsx           # Interface de comandos
├── context-menu.jsx      # Menus contextuais
├── dialog.jsx            # Diálogos modais
├── drawer.jsx            # Gavetas laterais
├── dropdown-menu.jsx     # Menus dropdown
├── form.jsx              # Formulários
├── hover-card.jsx        # Cards com hover
├── input-otp.jsx         # Input para OTP
├── input.jsx             # Campos de entrada
├── label.jsx             # Labels
├── menubar.jsx           # Barra de menu
├── navigation-menu.jsx   # Menu de navegação
├── pagination.jsx        # Paginação
├── popover.jsx           # Popovers
├── progress.jsx          # Barras de progresso
├── radio-group.jsx       # Grupos de radio buttons
├── resizable.jsx         # Elementos redimensionáveis
├── scroll-area.jsx       # Áreas de scroll
├── select.jsx            # Seletores
├── separator.jsx         # Separadores
├── sheet.jsx             # Folhas laterais
├── sidebar.jsx           # Barras laterais
├── skeleton.jsx          # Skeletons de carregamento
├── slider.jsx            # Sliders
├── sonner.jsx            # Notificações toast
├── switch.jsx            # Switches
├── table.jsx             # Tabelas
├── tabs.jsx              # Abas
├── textarea.jsx          # Áreas de texto
├── toggle-group.jsx      # Grupos de toggle
├── toggle.jsx            # Toggles
└── tooltip.jsx           # Tooltips
```

**Função:** Fornecer uma biblioteca consistente de componentes UI reutilizáveis.


### Contexts (`/src/contexts`)

Contextos React para gerenciamento de estado global:

```
contexts/
└── AuthContext.jsx        # Contexto de autenticação
```

**Função:** Gerenciar estado global da aplicação, especialmente autenticação.

### Hooks (`/src/hooks`)

Hooks customizados para lógica reutilizável:

```
hooks/
├── use-mobile.js          # Hook para detecção mobile
└── useScrollAnimation.js  # Hook para animações de scroll
```

**Função:** Encapsular lógica reutilizável em hooks customizados.

### Lib (`/src/lib`)

Bibliotecas e configurações:

```
lib/
├── supabase.js           # Cliente e configuração do Supabase
└── utils.js              # Utilitários gerais (cn, etc.)
```

**Função:** Configurar e exportar instâncias de bibliotecas externas.

### Pages (`/src/pages`)

Páginas da aplicação organizadas por tipo:

#### Public (`/src/pages/public`)

Páginas públicas do site:

```
public/
├── HomePage.jsx           # Página inicial
├── AboutPage.jsx          # Página "Quem Somos"
├── ServicesPage.jsx       # Página de serviços
├── ClientsPage.jsx        # Página de clientes
├── ContactPage.jsx        # Página de contato
├── PoliticaPrivacidade.jsx # Política de privacidade
└── TermosDeUso.jsx       # Termos de uso
```

#### Admin (`/src/pages/admin`)

Páginas administrativas protegidas:

```
admin/
├── LoginPage.jsx          # Página de login
├── AdminPageNew.jsx       # Dashboard principal
├── ClientsManager.jsx     # Gerenciamento de clientes
├── GalleryManager.jsx     # Gerenciamento de galeria
├── ProductsManager.jsx    # Gerenciamento de produtos
└── ContentManagers/       # Gerenciadores específicos
    ├── HeroManager.jsx    # Gerenciamento da seção hero
    └── ServicesManager.jsx # Gerenciamento de serviços
```

**Função:** Separar páginas públicas das administrativas para melhor organização e segurança.

### Utils (`/src/utils`)

Funções utilitárias:

```
utils/
└── seo.js                # Utilitários para SEO
```

**Função:** Funções auxiliares que não se encaixam em outras categorias.

## Fluxo de Dados

### Arquitetura da Aplicação

```
App.jsx (Raiz)
├── AuthProvider (Contexto Global)
├── Router (Roteamento)
├── Header (Layout)
├── Routes (Páginas)
│   ├── Páginas Públicas
│   └── Páginas Admin (Protegidas)
└── Footer (Layout)
```

### Fluxo de Autenticação

1. **Login:** `LoginPage.jsx` → `AuthContext` → `localStorage`
2. **Proteção:** `ProtectedRoute.jsx` verifica `AuthContext`
3. **Redirecionamento:** Usuário não autenticado → `/login-admin`

### Fluxo de Dados API

1. **Componente** chama função em `/src/api`
2. **API Service** faz requisição para Supabase
3. **Resposta** é processada e retornada
4. **Componente** atualiza estado com os dados

## Convenções de Nomenclatura

### Arquivos e Diretórios

- **Componentes:** PascalCase (ex: `HomePage.jsx`)
- **Hooks:** camelCase com prefixo "use" (ex: `useScrollAnimation.js`)
- **Utilitários:** camelCase (ex: `seo.js`)
- **Diretórios:** camelCase ou kebab-case

### Componentes

- **Props:** camelCase
- **Estados:** camelCase
- **Funções:** camelCase
- **Constantes:** UPPER_SNAKE_CASE

## Padrões de Organização

### Importações

Ordem padrão de importações:

1. Bibliotecas externas (React, etc.)
2. Componentes internos
3. Hooks e contextos
4. Utilitários e configurações
5. Estilos

### Estrutura de Componentes

```jsx
// Importações
import React from 'react'
import { useState } from 'react'

// Componente principal
const ComponentName = ({ prop1, prop2 }) => {
  // Estados
  const [state, setState] = useState()
  
  // Efeitos
  useEffect(() => {
    // lógica
  }, [])
  
  // Funções auxiliares
  const handleFunction = () => {
    // lógica
  }
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

export default ComponentName
```

## Dependências Principais

### Produção

- **react**: ^18.0.0 - Biblioteca principal
- **react-router-dom**: ^7.7.1 - Roteamento
- **@supabase/supabase-js**: ^2.48.1 - Backend
- **tailwindcss**: ^4.1.7 - CSS Framework
- **framer-motion**: ^12.15.0 - Animações
- **lucide-react**: ^0.510.0 - Ícones

### Desenvolvimento

- **vite**: ^6.3.5 - Build tool
- **eslint**: ^9.25.0 - Linter
- **@vitejs/plugin-react**: ^4.4.1 - Plugin React

## Considerações de Performance

### Otimizações Implementadas

1. **Code Splitting** - Divisão automática pelo Vite
2. **Lazy Loading** - Componentes carregados sob demanda
3. **Tree Shaking** - Remoção de código não utilizado
4. **Asset Optimization** - Otimização de imagens e recursos

### Monitoramento

- Bundle size analysis via Vite
- Performance metrics no browser
- Lighthouse scores para SEO e performance

## Segurança

### Medidas Implementadas

1. **Proteção de Rotas** - ProtectedRoute component
2. **Sanitização** - Inputs sanitizados
3. **HTTPS** - Forçado em produção
4. **Environment Variables** - Credenciais em variáveis de ambiente

### Boas Práticas

- Nunca commitar credenciais
- Validar inputs no frontend e backend
- Usar HTTPS em produção
- Implementar rate limiting quando necessário

