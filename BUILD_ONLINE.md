# 🌐 Build Online - FHD Automação Industrial

Este projeto incluir **Site React** + **App Mobile Flutter** com build automático no GitHub Actions.

## 🚀 Características

### 🌐 **Site React**
- ✅ Build automático no GitHub Actions
- ✅ Deploy automático no Vercel
- ✅ Otimizado para produção
- ✅ PWA com Service Worker

### 📱 **App Mobile Flutter**
- ✅ Build de APK no GitHub Actions
- ✅ WhatsApp integration
- ✅ Notificações push locais
- ✅ Interface nativa Android

## 🔧 Como Configurar

### 1. **Preparar o Repositório**
```bash
# Execute o script de configuração
.\setup-github-build.ps1

# Siga as instruções para enviar ao GitHub
git add .
git commit -m "Setup Site + Flutter with GitHub Actions"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### 2. **Workflows Disponíveis**

#### **🌐 Site React** (Automático)
- **Trigger**: Push para main/master
- **Deploy**: Automático no Vercel
- **URL**: https://fhd-automacao-industrial-bq67.vercel.app

#### **📱 App Flutter** (Manual/Automático)
- **Arquivo**: `.github/workflows/build-flutter-apk.yml`
- **Trigger**: Manual ou mudanças em `mobile/**`
- **Output**: APK para download

#### **🚀 Build Completo** (Manual)
- **Arquivo**: `.github/workflows/build-all.yml`
- **Trigger**: Manual
- **Output**: Site + APK + Release completo

## 📱 Como Gerar APK

### **Opção 1: Build Automático**
1. Faça mudanças na pasta `mobile/`
2. Commit e push para main
3. Aguarde ~10 minutos
4. APK estará em **Releases**

### **Opção 2: Build Manual**
1. GitHub → **Actions**
2. **Build Flutter APK** → **Run workflow**
3. Aguarde ~8 minutos
4. Baixe APK em **Artifacts**

### **Opção 3: Build Completo**
1. GitHub → **Actions**
2. **Build Site + Mobile App** → **Run workflow**
3. Escolha o que buildar (Site ✓, Mobile ✓)
4. Aguarde ~15 minutos
5. Release completo será criado

## 📥 Como Baixar

### **APK (App Mobile)**
- **Releases**: `https://github.com/SEU_USUARIO/SEU_REPO/releases`
- **Actions**: `Actions → Workflow → Artifacts`

### **Site (React)**
- **Deploy**: Automático no Vercel
- **Build**: Actions → Artifacts (se necessário)

## 📱 Instalação do App

1. **Baixe** `app-release.apk`
2. **Permita** instalação de fontes desconhecidas
3. **Instale** o APK
4. **Configure**:
   - URL: `https://fhd-automacao-industrial-bq67.vercel.app`
   - WhatsApp: Seu número para receber notificações

## 🔄 Estrutura do Projeto

```
fhd-automacao-site/
├── .github/workflows/          # GitHub Actions
│   ├── build-flutter-apk.yml   # Build Flutter apenas
│   └── build-all.yml           # Build completo
├── src/                        # Código React
├── mobile/                     # App Flutter
│   ├── lib/                    # Código Dart
│   ├── android/                # Config Android
│   └── pubspec.yaml            # Dependências
├── public/                     # Assets públicos
├── package.json                # Dependências React
└── vercel.json                 # Config deploy
```

## ⚡ Tempos de Build

- **Site React**: ~3-5 minutos
- **App Flutter**: ~8-12 minutos  
- **Build Completo**: ~15-20 minutos

## 🆘 Troubleshooting

### **Build Flutter falhou?**
1. Verifique syntax errors no código Dart
2. Confira dependências no `pubspec.yaml`
3. Veja logs detalhados em Actions

### **Site não deploying?**
1. Verifique se Vercel está conectado ao GitHub
2. Confira configurações do `vercel.json`
3. Veja logs no dashboard Vercel

### **APK não instala?**
1. Permita "Fontes desconhecidas"
2. Verifique se Android é compatível (API 21+)
3. Teste em outro dispositivo

## 💡 Dicas

- **Economize minutos**: Use build manual quando necessário
- **Releases automáticos**: Apenas para main/master
- **Artifacts expiram**: Baixe em até 30 dias
- **Debug**: Sempre confira logs em Actions

---

🎉 **Agora você tem build online completo para Site + App!**