# 🎨 Componentes e UI

## 📋 Visão Geral

O sistema utiliza **React** com **Tailwind CSS** e **Shadcn/ui** para criar uma interface moderna e responsiva.

## 🎯 Sistema de Design

### **Cores**
```css
/* Cores principais */
--primary: #000000;      /* Preto */
--secondary: #ffffff;     /* Branco */
--accent: #3b82f6;       /* Azul */
--success: #10b981;      /* Verde */
--warning: #f59e0b;      /* Amarelo */
--error: #ef4444;        /* Vermelho */
```

### **Tipografia**
```css
/* Fontes */
font-family: 'Inter', sans-serif;

/* Tamanhos */
text-xs: 0.75rem;    /* 12px */
text-sm: 0.875rem;   /* 14px */
text-base: 1rem;     /* 16px */
text-lg: 1.125rem;   /* 18px */
text-xl: 1.25rem;    /* 20px */
text-2xl: 1.5rem;    /* 24px */
text-3xl: 1.875rem;  /* 30px */
```

### **Espaçamento**
```css
/* Sistema de espaçamento */
space-1: 0.25rem;    /* 4px */
space-2: 0.5rem;     /* 8px */
space-4: 1rem;       /* 16px */
space-6: 1.5rem;     /* 24px */
space-8: 2rem;       /* 32px */
space-12: 3rem;      /* 48px */
```

## 🧩 Componentes Base

### **Button** - Botões
```jsx
import { Button } from '@/components/ui/button'

// Botão primário
<Button variant="default">
  Salvar
</Button>

// Botão secundário
<Button variant="secondary">
  Cancelar
</Button>

// Botão outline
<Button variant="outline">
  Editar
</Button>

// Botão destrutivo
<Button variant="destructive">
  Excluir
</Button>
```

### **Input** - Campos de Entrada
```jsx
import { Input } from '@/components/ui/input'

// Campo de texto
<Input 
  type="text" 
  placeholder="Digite seu nome"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Campo de email
<Input 
  type="email" 
  placeholder="seu@email.com"
  required
/>

// Campo de senha
<Input 
  type="password" 
  placeholder="Sua senha"
/>
```

### **Card** - Cards
```jsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <h3 className="text-lg font-semibold">Título do Card</h3>
  </CardHeader>
  <CardContent>
    <p>Conteúdo do card</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### **Dialog** - Modais
```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
    </DialogHeader>
    <div>Conteúdo do modal</div>
  </DialogContent>
</Dialog>
```

### **Table** - Tabelas
```jsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>João Silva</TableCell>
      <TableCell>joao@email.com</TableCell>
      <TableCell>
        <Button size="sm">Editar</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## 📱 Componentes Específicos

### **PaymentReceiptUpload** - Upload de Comprovantes
```jsx
import { PaymentReceiptUpload } from '@/components/PaymentReceiptUpload'

<PaymentReceiptUpload 
  installment={installment}
  onUpload={handleUpload}
  onDelete={handleDelete}
/>
```

**Funcionalidades:**
- Upload de arquivos PDF
- Preview do arquivo
- Validação de tipo e tamanho
- Exclusão de arquivos
- Feedback visual

### **Dashboard** - Dashboard Principal
```jsx
import { Dashboard } from '@/components/Dashboard'

<Dashboard 
  data={dashboardData}
  loading={isLoading}
/>
```

**Funcionalidades:**
- Gráficos de vendas
- Métricas principais
- Alertas e notificações
- Atividades recentes

### **BillsList** - Lista de Boletos
```jsx
import { BillsList } from '@/components/BillsList'

<BillsList 
  bills={bills}
  onEdit={handleEdit}
  onDelete={handleDelete}
  filters={filters}
/>
```

**Funcionalidades:**
- Lista paginada
- Filtros avançados
- Busca em tempo real
- Ações em lote

## 🎨 Layouts

### **AdminLayout** - Layout Administrativo
```jsx
import { AdminLayout } from '@/components/layouts/AdminLayout'

<AdminLayout>
  <div>Conteúdo da página</div>
</AdminLayout>
```

**Características:**
- Sidebar de navegação
- Header com usuário
- Breadcrumbs
- Responsivo

### **PublicLayout** - Layout Público
```jsx
import { PublicLayout } from '@/components/layouts/PublicLayout'

<PublicLayout>
  <div>Conteúdo público</div>
</PublicLayout>
```

**Características:**
- Header simples
- Footer com informações
- SEO otimizado
- Performance otimizada

## 📊 Componentes de Dados

### **Charts** - Gráficos
```jsx
import { LineChart, BarChart, PieChart } from '@/components/charts'

// Gráfico de linha
<LineChart 
  data={salesData}
  title="Vendas Mensais"
/>

// Gráfico de barras
<BarChart 
  data={revenueData}
  title="Receita por Produto"
/>

// Gráfico de pizza
<PieChart 
  data={categoryData}
  title="Vendas por Categoria"
/>
```

### **DataTable** - Tabela de Dados
```jsx
import { DataTable } from '@/components/DataTable'

<DataTable 
  data={data}
  columns={columns}
  pagination={true}
  search={true}
  filters={filters}
/>
```

**Funcionalidades:**
- Paginação
- Busca
- Filtros
- Ordenação
- Exportação

## 🔧 Hooks Customizados

### **useAuth** - Autenticação
```jsx
import { useAuth } from '@/hooks/useAuth'

const { user, login, logout, loading } = useAuth()

// Login
await login(email, password)

// Logout
await logout()

// Verificar usuário
if (user) {
  console.log('Usuário logado:', user)
}
```

### **useApi** - Chamadas de API
```jsx
import { useApi } from '@/hooks/useApi'

const { data, loading, error, refetch } = useApi('/api/bills')

// Dados carregados
if (data) {
  console.log('Boletos:', data)
}

// Estado de loading
if (loading) {
  return <Spinner />
}

// Erro
if (error) {
  return <ErrorMessage error={error} />
}
```

### **useLocalStorage** - Armazenamento Local
```jsx
import { useLocalStorage } from '@/hooks/useLocalStorage'

const [theme, setTheme] = useLocalStorage('theme', 'light')

// Salvar tema
setTheme('dark')

// Usar tema
console.log('Tema atual:', theme)
```

## 🎯 Responsividade

### **Breakpoints**
```css
/* Mobile First */
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### **Classes Responsivas**
```jsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// Texto responsivo
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Título Responsivo
</h1>

// Espaçamento responsivo
<div className="p-4 md:p-6 lg:p-8">
  Conteúdo
</div>
```

## 🎨 Temas e Customização

### **Tema Claro**
```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #000000;
  --primary-foreground: #ffffff;
}
```

### **Tema Escuro**
```css
[data-theme="dark"] {
  --background: #000000;
  --foreground: #ffffff;
  --primary: #ffffff;
  --primary-foreground: #000000;
}
```

### **Customização de Componentes**
```jsx
// Customizar botão
<Button 
  className="bg-blue-500 hover:bg-blue-600 text-white"
  size="lg"
>
  Botão Customizado
</Button>

// Customizar card
<Card className="border-2 border-blue-500 shadow-lg">
  <CardContent className="p-6">
    Conteúdo customizado
  </CardContent>
</Card>
```

## 📱 PWA Features

### **Service Worker**
```javascript
// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css'
      ])
    })
  )
})
```

### **Manifest**
```json
{
  "name": "FHD Automação",
  "short_name": "FHD",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

## 🚀 Performance

### **Lazy Loading**
```jsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('@/components/Dashboard'))

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

### **Code Splitting**
```jsx
// Componentes pesados carregados sob demanda
const HeavyChart = lazy(() => import('@/components/HeavyChart'))
const DataTable = lazy(() => import('@/components/DataTable'))
```

### **Image Optimization**
```jsx
import { Image } from '@/components/ui/image'

<Image 
  src="/logo.png"
  alt="Logo FHD"
  width={200}
  height={100}
  loading="lazy"
/>
```

---

**Próximo**: [Autenticação e Segurança](./autenticacao-seguranca.md)
