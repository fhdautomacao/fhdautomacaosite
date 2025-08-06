# Script para instalar Flutter no Windows
Write-Host "🚀 Instalando Flutter..." -ForegroundColor Green

# Criar diretório para Flutter
$flutterPath = "C:\flutter"
if (!(Test-Path $flutterPath)) {
    New-Item -ItemType Directory -Path $flutterPath -Force
    Write-Host "✅ Diretório criado: $flutterPath" -ForegroundColor Green
}

# Baixar Flutter
$flutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.5-stable.zip"
$flutterZip = "$flutterPath\flutter.zip"

Write-Host "📥 Baixando Flutter..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $flutterUrl -OutFile $flutterZip

# Extrair Flutter
Write-Host "📦 Extraindo Flutter..." -ForegroundColor Yellow
Expand-Archive -Path $flutterZip -DestinationPath "C:\" -Force

# Adicionar ao PATH
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$flutterBinPath = "$flutterPath\bin"

if ($userPath -notlike "*$flutterBinPath*") {
    [Environment]::SetEnvironmentVariable("PATH", "$userPath;$flutterBinPath", "User")
    Write-Host "✅ Flutter adicionado ao PATH" -ForegroundColor Green
}

# Limpar arquivo ZIP
Remove-Item $flutterZip -Force

Write-Host "✅ Flutter instalado com sucesso!" -ForegroundColor Green
Write-Host "🔄 Reinicie o terminal para usar o Flutter" -ForegroundColor Yellow 