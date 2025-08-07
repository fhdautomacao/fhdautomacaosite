# FHD Automação - Sistema de Gestão

Sistema completo de gestão empresarial com aplicativo móvel e interface web.

## 🚀 Tecnologias

### Backend & Web
- **Next.js 14** - Framework React
- **Supabase** - Banco de dados e autenticação
- **Tailwind CSS** - Estilização
- **Vercel** - Deploy

### Mobile
- **Flutter** - Framework mobile
- **Dio** - HTTP client
- **Provider** - Gerenciamento de estado

## 📱 Funcionalidades

### Web
- Dashboard administrativo
- Gestão de contas a pagar/receber
- Gestão de orçamentos
- Gestão de clientes
- Sistema de notificações
- Relatórios

### Mobile
- Login/Logout
- Visualização de dados
- Notificações push
- Modo offline
- Sincronização de dados

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- Flutter 3.32+
- Git

### Backend & Web
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar em desenvolvimento
npm run dev
```

### Mobile
```bash
# Navegar para o diretório mobile
cd mobile

# Instalar dependências
flutter pub get

# Executar em desenvolvimento
flutter run
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### Supabase
1. Crie um projeto no Supabase
2. Configure as tabelas necessárias
3. Configure as políticas de segurança

## 📦 Deploy

### Web (Vercel)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Mobile
```bash
# Build para Android
flutter build apk --release

# Build para iOS
flutter build ios --release
```

## 📁 Estrutura do Projeto

```
fhd-automacao-site/
├── src/                    # Código fonte web
│   ├── app/               # Páginas Next.js
│   ├── components/        # Componentes React
│   ├── lib/              # Utilitários
│   └── api/              # APIs
├── mobile/                # Aplicativo Flutter
│   ├── lib/              # Código Dart
│   ├── android/          # Configuração Android
│   └── ios/              # Configuração iOS
├── api/                   # APIs Vercel
└── public/               # Arquivos estáticos
```

## 🔐 Autenticação

O sistema usa Supabase Auth com:
- Login por email/senha
- Tokens JWT
- Refresh tokens
- Políticas de segurança

## 📊 Banco de Dados

Tabelas principais:
- `users` - Usuários do sistema
- `bills` - Contas a pagar/receber
- `quotations` - Orçamentos
- `clients` - Clientes
- `notifications` - Notificações

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@fhd.com

