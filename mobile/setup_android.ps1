# Script para configurar Android SDK para Flutter
# Execute como Administrador

Write-Host "🚀 Configurando Android SDK para Flutter..." -ForegroundColor Green

# Definir caminhos
$androidPath = "C:\Android"
$cmdlineToolsPath = "$androidPath\cmdline-tools"
$latestPath = "$cmdlineToolsPath\latest"
$flutterPath = "C:\Users\Higor_PC\Desktop\flutter\flutter_windows_3.32.8-stable\flutter"

# Criar diretórios necessários
if (!(Test-Path $androidPath)) {
    New-Item -ItemType Directory -Path $androidPath -Force
    Write-Host "✅ Diretório Android criado" -ForegroundColor Green
}

if (!(Test-Path $cmdlineToolsPath)) {
    New-Item -ItemType Directory -Path $cmdlineToolsPath -Force
}

if (!(Test-Path $latestPath)) {
    New-Item -ItemType Directory -Path $latestPath -Force
}

Write-Host "📦 Por favor, faça o download manual do Android Command Line Tools:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://developer.android.com/studio#command-tools" -ForegroundColor Cyan
Write-Host "2. Baixe 'Command line tools only' para Windows" -ForegroundColor Cyan
Write-Host "3. Extraia o conteúdo para: $latestPath" -ForegroundColor Cyan
Write-Host "4. Execute este script novamente após a extração" -ForegroundColor Cyan

# Verificar se cmdline-tools foi extraído
$sdkmanagerPath = "$latestPath\bin\sdkmanager.bat"
if (Test-Path $sdkmanagerPath) {
    Write-Host "✅ Command Line Tools encontrado!" -ForegroundColor Green
    
    # Aceitar licenças
    Write-Host "📜 Aceitando licenças..." -ForegroundColor Yellow
    & $sdkmanagerPath --licenses
    
    # Instalar componentes
    Write-Host "📦 Instalando componentes necessários..." -ForegroundColor Yellow
    & $sdkmanagerPath "platform-tools"
    & $sdkmanagerPath "platforms;android-33"
    & $sdkmanagerPath "build-tools;33.0.0"
    
    # Configurar Flutter
    Write-Host "⚙️ Configurando Flutter..." -ForegroundColor Yellow
    & "$flutterPath\bin\flutter.bat" config --android-sdk $androidPath
    
    # Adicionar ao PATH (necessário reiniciar o terminal)
    Write-Host "🔧 Configurando variáveis de ambiente..." -ForegroundColor Yellow
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    $pathsToAdd = @(
        "$androidPath\cmdline-tools\latest\bin",
        "$androidPath\platform-tools",
        "$flutterPath\bin"
    )
    
    foreach ($pathToAdd in $pathsToAdd) {
        if ($currentPath -notlike "*$pathToAdd*") {
            $newPath = "$currentPath;$pathToAdd"
            [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
            Write-Host "✅ Adicionado ao PATH: $pathToAdd" -ForegroundColor Green
        }
    }
    
    Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
    Write-Host "🔄 Reinicie o PowerShell e execute 'flutter doctor' para verificar" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Command Line Tools não encontrado em $latestPath" -ForegroundColor Red
    Write-Host "Por favor, extraia os arquivos baixados para esta pasta" -ForegroundColor Yellow
}

Write-Host "`n🎯 Próximos passos:" -ForegroundColor Magenta
Write-Host "1. Baixar Command Line Tools (se ainda não fez)" -ForegroundColor White
Write-Host "2. Extrair para $latestPath" -ForegroundColor White
Write-Host "3. Executar este script novamente" -ForegroundColor White
Write-Host "4. Reiniciar PowerShell" -ForegroundColor White
Write-Host "5. Executar: flutter doctor" -ForegroundColor White
Write-Host "6. Executar: flutter build apk --release" -ForegroundColor White