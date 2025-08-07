# Gestão FHD - App Mobile

> **🎉 Novo App de Gestão Empresarial da FHD Automação Industrial**

## 📱 Sobre o App

O **Gestão FHD** é um aplicativo móvel completo para gestão empresarial da FHD Automação Industrial, substituindo o antigo sistema de notificações WhatsApp por uma solução robusta e profissional.

### ✨ Principais Funcionalidades

- **🏠 Dashboard Interativo** - Visão geral dos negócios
- **📄 Gestão de Boletos** - Controle completo de vencimentos
- **💼 Orçamentos** - Gerenciamento de propostas comerciais
- **👥 Clientes** - Base de dados de clientes
- **🔔 Notificações Avançadas** - Sistema completo de alertas
- **⚙️ Configurações** - Personalização e preferências

### 🚀 Tecnologias Utilizadas

- **Flutter 3.0+** - Framework principal
- **Riverpod** - Gerenciamento de estado
- **Hive** - Armazenamento local
- **Awesome Notifications** - Sistema de notificações
- **Dio** - Cliente HTTP
- **Material Design 3** - Interface moderna

## 🛠️ Como Executar

### Pré-requisitos

1. **Flutter SDK** (versão 3.0 ou superior)
2. **Android Studio** ou **VS Code**
3. **Device/Emulador Android** configurado

### Instalação

1. **Navegar para o diretório do app:**
   ```bash
   cd mobile
   ```

2. **Instalar dependências:**
   ```bash
   flutter pub get
   ```

3. **Executar o app:**
   ```bash
   flutter run
   ```

### 📱 APK de Produção

Para gerar APK de release:

```bash
flutter build apk --release
```

O APK será gerado em: `build/app/outputs/flutter-apk/app-release.apk`

## 🔐 Credenciais de Login

### Desenvolvimento
- **Admin:** `adminfhd@fhd.com` / `admin123`
- **Usuário:** `fhduser@fhd.com` / `user123`

### Produção
- Integração com a API web do projeto principal

## 🎨 Design System

### Cores Principais
- **Primária:** `#1E40AF` (Azul corporativo FHD)
- **Secundária:** `#059669` (Verde)
- **Erro:** `#EF4444`
- **Sucesso:** `#10B981`
- **Aviso:** `#F59E0B`

### Tipografia
- **Fonte:** Inter (Regular, Medium, SemiBold, Bold)
- **Tamanhos:** Responsivos seguindo Material Design 3

## 🔔 Sistema de Notificações

### Tipos de Notificação

1. **Boletos Vencidos** 🚨
   - Prioridade: URGENTE
   - Som personalizado
   - Vibração intensa
   - LED vermelho

2. **Próximos Vencimentos** ⚠️
   - Prioridade: ALTA
   - Notificações programadas (7, 3, 1 dia antes)
   - Som moderado

3. **Novos Orçamentos** 📋
   - Prioridade: NORMAL
   - Som suave
   - Vibração leve

4. **Notificações Gerais** ℹ️
   - Prioridade: BAIXA
   - Configurável pelo usuário

### Configurações Avançadas

- **Sons personalizados** por tipo
- **Padrões de vibração** específicos
- **LED colorido** (Android)
- **Notificações agendadas**
- **Modo não perturbe** configurável
- **Histórico de notificações**

## 📊 Funcionalidades Principais

### Dashboard
- Métricas em tempo real
- Gráficos interativos
- Ações rápidas
- Atividade recente

### Boletos
- Lista organizada por status
- Filtros avançados
- Criação/edição
- Alertas automáticos
- Relatórios

### Orçamentos
- Workflow completo
- Status tracking
- Aprovações
- Integração com clientes

### Clientes
- Base completa
- Histórico de transações
- Dados de contato
- Segmentação

## 🔌 Integração com API

### Endpoints Principais
- `POST /api/auth/login` - Autenticação
- `GET /api/bills` - Lista de boletos
- `POST /api/bills` - Criar boleto
- `GET /api/quotations` - Lista de orçamentos
- `GET /api/clients` - Lista de clientes
- `GET /api/dashboard` - Dados do dashboard

### Cache Offline
- **5 minutos** de cache para dados críticos
- **Funcionamento offline** com dados em cache
- **Sincronização automática** quando online

## 📁 Estrutura do Projeto

```
mobile/
├── lib/
│   ├── core/                 # Core do app
│   │   ├── constants/       # Constantes (cores, strings)
│   │   ├── routes/          # Sistema de rotas
│   │   ├── services/        # Serviços (API, Storage, Notifications)
│   │   └── theme/           # Tema do app
│   ├── features/            # Features organizadas
│   │   ├── auth/           # Autenticação
│   │   ├── dashboard/      # Dashboard
│   │   ├── bills/          # Boletos
│   │   ├── quotations/     # Orçamentos
│   │   ├── clients/        # Clientes
│   │   ├── notifications/  # Notificações
│   │   └── settings/       # Configurações
│   ├── app.dart            # App principal
│   └── main.dart           # Entry point
└── assets/                 # Assets (imagens, fontes)
```

## 🎯 Próximos Passos

### Features Planejadas
- [ ] **Relatórios PDF** - Geração de relatórios
- [ ] **Backup na nuvem** - Sincronização de dados
- [ ] **Modo escuro** - Tema dark mode
- [ ] **Biometria** - Login por digital/face
- [ ] **Chat interno** - Comunicação da equipe
- [ ] **Localização GPS** - Tracking de visitas

### Melhorias Técnicas
- [ ] **Testes automatizados** - Unit + Widget tests
- [ ] **CI/CD Pipeline** - Deploy automatizado
- [ ] **Crash reporting** - Monitoramento de erros
- [ ] **Analytics** - Métricas de uso
- [ ] **Performance** - Otimizações

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro de dependências:**
```bash
flutter clean
flutter pub get
```

**2. Erro de build:**
```bash
flutter doctor
# Resolver problemas apontados
```

**3. Notificações não funcionam:**
- Verificar permissões no dispositivo
- Testar em device físico (não emulador)

**4. Login não funciona:**
- Verificar conexão com internet
- Confirmar URL do servidor
- Testar credenciais

## 📞 Suporte

Para dúvidas ou problemas:
- **Desenvolvedor:** [Seu Nome]
- **Email:** [seu.email@exemplo.com]
- **Projeto:** FHD Automação Industrial

---

**Gestão FHD v2.0.0** - Desenvolvido com ❤️ para FHD Automação Industrial