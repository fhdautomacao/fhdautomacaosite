# 🔧 Implementar DynamicSEO nas Páginas

## 📋 Status Atual

O componente `DynamicSEO` está criado e funcionando, mas **NÃO está sendo usado** nas páginas atuais. As páginas estão usando `<Helmet>` com dados estáticos.

## 🎯 Objetivo

Substituir o `<Helmet>` estático pelo componente `DynamicSEO` que busca dados dinamicamente do banco de dados.

## 📝 Como Implementar

### **Passo 1: Identificar as Páginas**

As seguintes páginas precisam ser atualizadas:

- ✅ `src/pages/public/HomePage.jsx` → `pageName="home"`
- ✅ `src/pages/public/AboutPage.jsx` → `pageName="about"`
- ✅ `src/pages/public/ServicesPage.jsx` → `pageName="services"`
- ✅ `src/pages/public/ContactPage.jsx` → `pageName="contact"`
- ✅ `src/pages/public/ClientsPage.jsx` → `pageName="clients"`
- ✅ `src/pages/QuotationPage.jsx` → `pageName="quotation"`

### **Passo 2: Exemplo de Implementação**

**ANTES (dados estáticos):**
```jsx
import { Helmet } from 'react-helmet-async'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas</title>
        <meta name="description" content="..." />
        <meta name="keywords" content="..." />
        {/* ... mais meta tags ... */}
      </Helmet>
      
      <main>
        <Hero />
        <About />
        {/* ... componentes ... */}
      </main>
    </>
  )
}
```

**DEPOIS (dados dinâmicos):**
```jsx
import DynamicSEO from '@/components/common/DynamicSEO'

const HomePage = () => {
  return (
    <>
      <DynamicSEO pageName="home" />
      
      <main>
        <Hero />
        <About />
        {/* ... componentes ... */}
      </main>
    </>
  )
}
```

### **Passo 3: Implementar em Cada Página**

#### **1. HomePage.jsx**
```jsx
// Remover: import { Helmet } from 'react-helmet-async'
import DynamicSEO from '@/components/common/DynamicSEO'

const HomePage = () => {
  return (
    <>
      <DynamicSEO pageName="home" />
      
      <main>
        <Hero />
        <About />
        <ServicesSection />
        <Products />
        <Gallery />
        <Clients />
        <Contact />
      </main>
    </>
  )
}
```

#### **2. AboutPage.jsx**
```jsx
import DynamicSEO from '@/components/common/DynamicSEO'

const AboutPage = () => {
  return (
    <>
      <DynamicSEO pageName="about" />
      
      <main>
        <About />
      </main>
    </>
  )
}
```

#### **3. ServicesPage.jsx**
```jsx
import DynamicSEO from '@/components/common/DynamicSEO'

const ServicesPage = () => {
  return (
    <>
      <DynamicSEO pageName="services" />
      
      <main>
        <ServicesSection />
      </main>
    </>
  )
}
```

#### **4. ContactPage.jsx**
```jsx
import DynamicSEO from '@/components/common/DynamicSEO'

const ContactPage = () => {
  return (
    <>
      <DynamicSEO pageName="contact" />
      
      <main>
        <Contact />
      </main>
    </>
  )
}
```

#### **5. ClientsPage.jsx**
```jsx
import DynamicSEO from '@/components/common/DynamicSEO'

const ClientsPage = () => {
  return (
    <>
      <DynamicSEO pageName="clients" />
      
      <main>
        <Clients />
      </main>
    </>
  )
}
```

#### **6. QuotationPage.jsx**
```jsx
import DynamicSEO from '@/components/common/DynamicSEO'

const QuotationPage = () => {
  return (
    <>
      <DynamicSEO pageName="quotation" />
      
      <main>
        {/* ... conteúdo da página ... */}
      </main>
    </>
  )
}
```

## 🧪 Testar a Implementação

### **1. Teste a API:**
```bash
node scripts/test-dynamic-seo.js
```

### **2. Teste no Navegador:**
1. Abra o DevTools (F12)
2. Vá para a aba "Elements"
3. Procure por `<head>`
4. Verifique se as meta tags estão sendo aplicadas

### **3. Teste as Meta Tags:**
```bash
# Teste uma página específica
curl "http://localhost:5173" | grep -i "meta"
```

## ✅ Checklist de Implementação

- [ ] Remover import do `react-helmet-async` das páginas
- [ ] Adicionar import do `DynamicSEO`
- [ ] Substituir `<Helmet>` por `<DynamicSEO pageName="..." />`
- [ ] Testar cada página no navegador
- [ ] Verificar se as meta tags aparecem no `<head>`
- [ ] Testar com dados diferentes no admin panel

## 🎯 Benefícios da Implementação

1. **Dados Dinâmicos:** SEO pode ser alterado sem recompilar
2. **Admin Panel:** Controle total via interface administrativa
3. **Flexibilidade:** Fácil adicionar novas páginas
4. **Consistência:** Mesma estrutura para todas as páginas
5. **Manutenção:** Centralizado no banco de dados

## 🚀 Próximos Passos

Após implementar:

1. **Teste todas as páginas** no navegador
2. **Verifique as meta tags** no DevTools
3. **Teste no admin panel** alterando dados
4. **Monitore no Google Search Console**

---

**💡 Dica:** Implemente uma página por vez e teste antes de continuar para a próxima!
