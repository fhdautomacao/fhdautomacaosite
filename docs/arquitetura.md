# 🏗️ Arquitetura do Sistema

## 📋 Visão Geral

O site da FHD Automação Industrial é uma aplicação web moderna baseada em **JAMstack** (JavaScript, APIs, Markup) com arquitetura distribuída.

## 🎯 Arquitetura Geral

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Supabase)    │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Supabase      │    │   Storage       │
│   (Deploy)      │    │   (Auth/API)    │    │   (Files)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🏛️ Estrutura de Camadas

### 1. **Camada de Apresentação (Frontend)**
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS + Shadcn/ui
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router DOM

### 2. **Camada de API (Backend)**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Supabase REST + Custom Server APIs
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### 3. **Camada de Infraestrutura**
- **Deploy**: Vercel
- **CDN**: Vercel Edge Network
- **Domain**: Custom Domain
- **SSL**: Automático (Vercel)

## 📁 Estrutura de Pastas

```
fhd-automacao-site/
├── 📁 src/                          # Código fonte principal
│   ├── 📁 components/               # Componentes React
│   │   ├── 📁 ui/                  # Componentes base (Shadcn)
│   │   ├── 📁 sections/            # Seções da página
│   │   └── 📁 layouts/             # Layouts da aplicação
│   ├── 📁 pages/                   # Páginas da aplicação
│   │   ├── 📁 Admin/              # Área administrativa
│   │   └── 📁 Public/             # Páginas públicas
│   ├── 📁 api/                     # APIs do frontend
│   │   ├── 📁 server-apis/        # APIs do servidor
│   │   └── *.js                   # APIs do Supabase
│   ├── 📁 hooks/                   # Custom hooks
│   ├── 📁 contexts/                # Contextos React
│   ├── 📁 utils/                   # Utilitários
│   ├── 📁 lib/                     # Bibliotecas
│   ├── 📁 constants/               # Constantes
│   └── 📁 assets/                  # Assets estáticos
├── 📁 server-apis/                 # APIs do servidor (Vercel)
│   ├── 📁 api/                     # APIs organizadas
│   └── *.js                        # Endpoints do servidor
├── 📁 public/                      # Arquivos públicos
├── 📁 supabase/                    # Migrações do banco
│   └── 📁 migrations/             # Arquivos SQL
├── 📁 docs/                        # Documentação
└── 📄 Configuração                 # Arquivos de config
```

## 🔄 Fluxo de Dados

### 1. **Autenticação**
```
Usuário → Login → Supabase Auth → JWT Token → Acesso ao Sistema
```

### 2. **CRUD Operations**
```
Frontend → API Call → Supabase Client → PostgreSQL → Response
```

### 3. **File Upload**
```
Frontend → FormData → Server API → Supabase Storage → URL
```

### 4. **Real-time Updates**
```
Database Change → Supabase Realtime → Frontend → UI Update
```

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18**: Framework principal
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS
- **Shadcn/ui**: Component library
- **Lucide React**: Ícones
- **React Router**: Navegação

### **Backend**
- **Supabase**: Backend as a Service
- **PostgreSQL**: Database
- **Supabase Auth**: Autenticação
- **Supabase Storage**: File storage
- **Supabase Realtime**: Real-time features

### **Deploy & Infra**
- **Vercel**: Deploy e hosting
- **Vercel Edge Functions**: Serverless APIs
- **GitHub**: Version control

## 🔐 Segurança

### **Autenticação**
- JWT tokens (Supabase Auth)
- Row Level Security (RLS)
- Role-based access control

### **API Security**
- CORS configurado
- Rate limiting
- Input validation
- SQL injection protection

### **Data Protection**
- HTTPS obrigatório
- Environment variables
- Secure headers

## 📊 Performance

### **Otimizações Frontend**
- Code splitting
- Lazy loading
- Image optimization
- Bundle optimization

### **Otimizações Backend**
- Database indexing
- Query optimization
- Caching strategies
- CDN distribution

## 🔧 Configuração de Ambiente

### **Desenvolvimento**
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local_key
NEXT_PUBLIC_APP_URL=http://localhost:5173
```

### **Produção**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🚀 Escalabilidade

### **Horizontal Scaling**
- Vercel auto-scaling
- Supabase auto-scaling
- CDN global

### **Vertical Scaling**
- Database upgrades
- Memory optimization
- CPU optimization

## 📈 Monitoramento

### **Performance**
- Vercel Analytics
- Core Web Vitals
- Error tracking

### **Uptime**
- Vercel status
- Supabase status
- Custom monitoring

---

**Próximo**: [APIs e Endpoints](./apis-endpoints.md)
