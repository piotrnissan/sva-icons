# 🚀 Exclude SVA Icons from OneDrive Sync
# This script moves the project to local storage for faster development

param(
    [switch]$WhatIf,     # Show what would happen without doing it
    [switch]$Force,      # Skip confirmation prompts
    [switch]$Backup      # Create backup in OneDrive before moving
)

Write-Host "🔧 OneDrive Exclusion Tool for SVA Icons" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$currentPath = "C:\Users\wesolp\OneDrive - Nissan Motor Corporation\projects\sva-icons"
$newPath = "C:\Users\wesolp\projects\sva-icons"
$backupPath = "C:\Users\wesolp\OneDrive - Nissan Motor Corporation\projects\sva-icons-backup"

# Check if project exists in OneDrive
if (-not (Test-Path $currentPath)) {
    Write-Host "❌ Project not found in OneDrive path: $currentPath" -ForegroundColor Red
    Write-Host "💡 Project may already be excluded from OneDrive" -ForegroundColor Yellow
    exit 1
}

# Show current status
Write-Host "📍 Current Status:" -ForegroundColor Yellow
Write-Host "   Source: $currentPath" -ForegroundColor Gray
Write-Host "   Target: $newPath" -ForegroundColor Gray
if ($Backup) {
    Write-Host "   Backup: $backupPath" -ForegroundColor Gray
}

# Check current attributes
$attributes = (Get-ItemProperty $currentPath).Attributes
Write-Host "   Attributes: $attributes" -ForegroundColor Gray

if ($WhatIf) {
    Write-Host "🔍 WHAT-IF MODE - No changes will be made" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Would perform these actions:" -ForegroundColor Yellow
    if ($Backup) {
        Write-Host "   1. Create backup: $backupPath" -ForegroundColor Gray
    }
    Write-Host "   2. Create target directory: C:\Users\wesolp\projects" -ForegroundColor Gray
    Write-Host "   3. Move project: $currentPath → $newPath" -ForegroundColor Gray
    Write-Host "   4. Remove OneDrive attributes" -ForegroundColor Gray
    Write-Host "   5. Validate project integrity" -ForegroundColor Gray
    exit 0
}

# Confirmation
if (-not $Force) {
    Write-Host ""
    Write-Host "⚠️  This will:" -ForegroundColor Yellow
    if ($Backup) {
        Write-Host "   • Create backup in OneDrive" -ForegroundColor Gray
    }
    Write-Host "   • Move project out of OneDrive sync" -ForegroundColor Gray
    Write-Host "   • Speed up file operations" -ForegroundColor Gray
    Write-Host "   • Stop automatic cloud backup" -ForegroundColor Gray
    Write-Host ""
    $confirm = Read-Host "Continue? (y/N)"
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Host "❌ Operation cancelled" -ForegroundColor Red
        exit 0
    }
}

Write-Host ""
Write-Host "🚀 Starting OneDrive exclusion..." -ForegroundColor Green

try {
    # Step 1: Create backup if requested
    if ($Backup) {
        Write-Host "📦 Creating backup..." -ForegroundColor Yellow
        if (Test-Path $backupPath) {
            Remove-Item $backupPath -Recurse -Force
        }
        Copy-Item $currentPath $backupPath -Recurse -Force
        Write-Host "✅ Backup created: $backupPath" -ForegroundColor Green
    }

    # Step 2: Create target directory
    Write-Host "📁 Creating target directory..." -ForegroundColor Yellow
    $targetDir = Split-Path $newPath -Parent
    if (-not (Test-Path $targetDir)) {
        New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
    }

    # Step 3: Remove ReadOnly attributes before move
    Write-Host "🔓 Removing OneDrive attributes..." -ForegroundColor Yellow
    & attrib -R "$currentPath\*" /S /D 2>$null

    # Step 4: Move the project
    Write-Host "🔄 Moving project..." -ForegroundColor Yellow
    Move-Item $currentPath $newPath -Force

    # Step 5: Remove any remaining OneDrive attributes
    Write-Host "🧹 Cleaning attributes..." -ForegroundColor Yellow
    & attrib -R "$newPath\*" /S /D 2>$null

    # Step 6: Validate the move
    Write-Host "✅ Validating project integrity..." -ForegroundColor Yellow
    if (Test-Path "$newPath\package.json") {
        $packageJson = Get-Content "$newPath\package.json" | ConvertFrom-Json
        Write-Host "   Project: $($packageJson.name) v$($packageJson.version)" -ForegroundColor Gray
    }

    if (Test-Path "$newPath\svg") {
        $iconCount = (Get-ChildItem "$newPath\svg" -Filter "*.svg").Count
        Write-Host "   Icons: $iconCount SVG files" -ForegroundColor Gray
    }

    # Step 7: Test build system
    Write-Host "🔧 Testing build system..." -ForegroundColor Yellow
    Push-Location $newPath
    try {
        & npm run validate-icons *>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build system validated" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Build system needs attention" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  Could not test build system" -ForegroundColor Yellow
    } finally {
        Pop-Location
    }

    Write-Host ""
    Write-Host "🎉 OneDrive exclusion completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 New project location: $newPath" -ForegroundColor Cyan
    Write-Host "⚡ File operations will now be faster" -ForegroundColor Green
    Write-Host "🔧 No more OneDrive permission issues" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "   cd `"$newPath`"" -ForegroundColor Gray
    Write-Host "   npm run full-update    # Test complete rebuild" -ForegroundColor Gray
    if ($Backup) {
        Write-Host "   # Backup available at: $backupPath" -ForegroundColor Gray
    }

} catch {
    Write-Host ""
    Write-Host "❌ Error during OneDrive exclusion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Try running with administrator privileges" -ForegroundColor Yellow
    exit 1
}
