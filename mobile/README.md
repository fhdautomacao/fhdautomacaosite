# WhatsApp Notifier App

App mobile para receber notificações e enviar automaticamente para WhatsApp.

## 📱 Funcionalidades

- ✅ Recebe notificações do servidor
- ✅ Envia mensagens para WhatsApp automaticamente
- ✅ Interface simples e intuitiva
- ✅ Funciona offline
- ✅ Notificações push locais
- ✅ Configurações salvas localmente

## 🔧 Como Gerar o APK

### Pré-requisitos:
- Flutter SDK instalado
- Android Studio (para APK)

### Comandos:
```bash
# Navegar para a pasta do app
cd mobile

# Instalar dependências
flutter pub get

# Gerar APK de release
flutter build apk --release

# APK será gerado em: build/app/outputs/flutter-apk/app-release.apk
```

## 📦 Instalação

1. Transfira o arquivo `app-release.apk` para seu celular
2. Instale o APK (permita instalação de fontes desconhecidas)
3. Configure o número do WhatsApp nas configurações
4. Pronto! App funcionando

## ⚙️ Configuração

O app precisa de:
- URL do servidor (seu site Vercel)
- Número do WhatsApp para enviar mensagens
- Permissões de notificação

## 🚀 Como Funciona

1. **Site detecta evento** (boleto vencendo, novo orçamento, etc.)
2. **API processa** a notificação
3. **App recebe** a notificação (opcional)
4. **WhatsApp abre** automaticamente com a mensagem

## 📋 Tipos de Notificação

- 🚨 **Boletos Vencendo**: Empresa, valor, vencimento
- 📋 **Novos Orçamentos**: Cliente, empresa, serviço
- 💰 **Divisão de Lucro**: Empresa, valor, data

## 🔗 Integração

O app se conecta com:
- **API**: `/api/notify-mobile` (Vercel Functions)
- **WhatsApp**: Link direto `wa.me`
- **Notificações**: Locais do Flutter

## 🛠️ Desenvolvimento

```bash
# Executar em modo debug
flutter run

# Hot reload
r

# Hot restart
R
``` 