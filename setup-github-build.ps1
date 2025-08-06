# Script para configurar build online do Site + Flutter no GitHub
Write-Host "🚀 Configurando Build Online do Site + Flutter..." -ForegroundColor Green

# Verificar se é um repositório git
if (!(Test-Path ".git")) {
    Write-Host "📁 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositório Git criado!" -ForegroundColor Green
} else {
    Write-Host "✅ Repositório Git já existe!" -ForegroundColor Green
}

# Criar .gitignore se não existir
if (!(Test-Path ".gitignore")) {
    Write-Host "📝 Criando .gitignore..." -ForegroundColor Yellow
    @"
# Build outputs
build/
dist/
*.apk
*.ipa

# Dependencies
node_modules/
.flutter-plugins
.flutter-plugins-dependencies

# IDE
.vscode/
.idea/
*.iml

# Logs
*.log
npm-debug.log*

# Environment
.env
.env.local
.env.production

# OS
.DS_Store
Thumbs.db

# Flutter
mobile/.dart_tool/
mobile/.flutter-plugins
mobile/.flutter-plugins-dependencies
mobile/.packages
mobile/build/
mobile/ios/Pods/
mobile/ios/Runner.xcworkspace/
mobile/android/.gradle/
mobile/android/captures/
mobile/android/gradlew
mobile/android/gradlew.bat
mobile/android/local.properties
mobile/android/key.properties
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore criado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Crie um repositório no GitHub" -ForegroundColor White
Write-Host "2. Execute os comandos abaixo:" -ForegroundColor White
Write-Host ""
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m 'Setup Site + Flutter with GitHub Actions'" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Builds disponíveis:" -ForegroundColor Green
Write-Host "   🌐 Site React: Deploy automático no Vercel" -ForegroundColor White
Write-Host "   📱 App Flutter: Build manual ou automático" -ForegroundColor White
Write-Host ""
Write-Host "📱 Para build do Flutter:" -ForegroundColor Cyan
Write-Host "   - GitHub → Actions → Build Flutter APK → Run workflow" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para build completo (Site + App):" -ForegroundColor Cyan
Write-Host "   - GitHub → Actions → Build Site + Mobile App → Run workflow" -ForegroundColor White
Write-Host ""
Write-Host "📥 Downloads disponíveis em:" -ForegroundColor Cyan
Write-Host "   - Releases (builds automáticos)" -ForegroundColor White
Write-Host "   - Actions → Artifacts (builds manuais)" -ForegroundColor White
Write-Host ""
Write-Host "✅ Configuração concluída!" -ForegroundColor Green