# 🌐 Build Online do WhatsApp Notifier

Este guia explica como gerar o APK do seu app Flutter usando GitHub Actions (build na nuvem).

## 🚀 Vantagens do Build Online

- ✅ **Não precisa instalar Android SDK**
- ✅ **Não ocupa espaço no seu PC**
- ✅ **Build automático a cada mudança**
- ✅ **Completamente gratuito**
- ✅ **APK sempre disponível para download**

## 📋 Pré-requisitos

1. **Conta no GitHub** (gratuita)
2. **Repositório criado** (público ou privado)
3. **Código enviado** para o GitHub

## 🔧 Como Configurar

### 1. Criar Repositório no GitHub
```bash
# No seu projeto, inicializar git (se ainda não fez)
git init
git add .
git commit -m "Initial commit"

# Adicionar remote do GitHub (substitua por seu repositório)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

### 2. Workflows Já Configurados ✅

Criamos 2 workflows para você:

#### **Workflow Automático** (`build-apk.yml`)
- ✅ Executa automaticamente a cada commit na main/master
- ✅ Roda testes e análise de código
- ✅ Cria release automaticamente
- ✅ APK disponível em "Releases"

#### **Workflow Manual** (`build-simple.yml`)
- ✅ Executa apenas quando você solicitar
- ✅ Mais rápido (sem testes)
- ✅ APK disponível em "Actions"

## 🎯 Como Executar o Build

### Opção 1: Build Automático
1. Faça commit das suas mudanças
2. Envie para o GitHub: `git push`
3. Aguarde ~5-10 minutos
4. APK estará em **Releases**

### Opção 2: Build Manual
1. Vá para seu repositório no GitHub
2. Clique em **Actions**
3. Selecione **Build APK Simple**
4. Clique **Run workflow**
5. Aguarde ~5-10 minutos
6. Baixe o APK em **Artifacts**

## 📥 Como Baixar o APK

### Via Releases (Automático)
1. Vá para `https://github.com/SEU_USUARIO/SEU_REPO/releases`
2. Clique na versão mais recente
3. Baixe `app-release.apk`

### Via Actions (Manual)
1. Vá para `https://github.com/SEU_USUARIO/SEU_REPO/actions`
2. Clique no workflow executado
3. Baixe o arquivo em **Artifacts**

## 📱 Como Instalar no Celular

1. **Transfira o APK** para seu celular
2. **Ative "Fontes desconhecidas"** nas configurações
3. **Instale o APK**
4. **Configure**:
   - URL: `https://fhd-automacao-industrial-bq67.vercel.app`
   - Número WhatsApp: seu número

## 🔄 Status do Build

Você pode acompanhar o progresso do build em:
- **Actions** → Status em tempo real
- **Badges** → Status no README (opcional)

## ⚡ Tempos Esperados

- **Build completo**: ~8-12 minutos
- **Build simples**: ~5-8 minutos
- **Download**: ~10-30 MB

## 🆘 Solução de Problemas

### Build falhou?
1. Verifique os **logs** na aba Actions
2. Problemas comuns:
   - Erro de sintaxe no código Dart
   - Dependências incompatíveis
   - Arquivo não encontrado

### APK não funcionando?
1. Verifique se permitiu **fontes desconhecidas**
2. Verifique se o **Android é compatível** (API 21+)
3. Teste em outro dispositivo

## 💡 Dicas

- **Builds são limitados**: 2000 minutos/mês gratuito
- **Use build manual** para economizar minutos
- **Mantenha logs** para debug
- **APKs expiram** em 30 dias (baixe logo)

---

🎉 **Agora você pode gerar APKs sem instalar nada no seu PC!**