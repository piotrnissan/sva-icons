# SVA Icons - Add New Icon Script
# This script automates the process of adding a new icon to the SVA Icons system
# Usage: .\add-icon.ps1 -SourcePath "path\to\icon.svg" -IconName "proper_icon_name"

param(
    [Parameter(Mandatory=$true, HelpMessage="Path to the source SVG file")]
    [string]$SourcePath,
    
    [Parameter(Mandatory=$true, HelpMessage="Proper icon name following naming convention (e.g., 'battery_low')")]
    [string]$IconName,
    
    [Parameter(Mandatory=$false, HelpMessage="Skip build process (useful when adding multiple icons)")]
    [switch]$SkipBuild,
    
    [Parameter(Mandatory=$false, HelpMessage="Force overwrite if icon already exists")]
    [switch]$Force
)

# Set error handling
$ErrorActionPreference = "Stop"

Write-Host "🚀 SVA Icons - Add New Icon" -ForegroundColor Blue
Write-Host "=================================" -ForegroundColor Blue
Write-Host ""

# Validate inputs
if (!(Test-Path $SourcePath)) {
    Write-Host "❌ Error: Source SVG file not found: $SourcePath" -ForegroundColor Red
    exit 1
}

# Validate icon name follows convention
if ($IconName -notmatch '^[a-z0-9_]+$') {
    Write-Host "❌ Error: Icon name '$IconName' doesn't follow naming convention" -ForegroundColor Red
    Write-Host "   Must be lowercase letters, numbers, and underscores only" -ForegroundColor Yellow
    Write-Host "   Examples: battery_low, arrow_left, user_profile" -ForegroundColor Yellow
    exit 1
}

# Ensure .svg extension
$targetFileName = if ($IconName.EndsWith('.svg')) { $IconName } else { "$IconName.svg" }
$targetPath = "svg\$targetFileName"

# Check if icon already exists
if ((Test-Path $targetPath) -and !$Force) {
    Write-Host "❌ Error: Icon '$targetFileName' already exists" -ForegroundColor Red
    Write-Host "   Use -Force to overwrite" -ForegroundColor Yellow
    exit 1
}

try {
    Write-Host "📋 Icon Details:" -ForegroundColor Cyan
    Write-Host "   Source: $SourcePath" -ForegroundColor White
    Write-Host "   Target: $targetPath" -ForegroundColor White
    Write-Host "   CSS Class: sva-icon-$($IconName.Replace('_', '-'))" -ForegroundColor White
    Write-Host "   JS Function: $((Get-Culture).TextInfo.ToTitleCase($IconName.Replace('_', ' ')).Replace(' ', ''))" -ForegroundColor White
    Write-Host ""

    # Step 1: Copy and rename the SVG file
    Write-Host "📁 Step 1: Copying SVG file..." -ForegroundColor Yellow
    Copy-Item $SourcePath $targetPath
    Write-Host "   ✅ Copied to $targetPath" -ForegroundColor Green

    # Step 2: Optimize SVG if SVGO is available
    Write-Host "🎨 Step 2: Optimizing SVG..." -ForegroundColor Yellow
    if (Get-Command svgo -ErrorAction SilentlyContinue) {
        svgo $targetPath --config=svgo.config.json
        Write-Host "   ✅ SVG optimized" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ SVGO not found, skipping optimization" -ForegroundColor Yellow
    }

    if (!$SkipBuild) {
        # Step 3: Build icons
        Write-Host "🔧 Step 3: Building icon system..." -ForegroundColor Yellow
        npm run build:icons
        Write-Host "   ✅ Icons built" -ForegroundColor Green

        # Step 4: Build class-based API
        Write-Host "🏗️ Step 4: Building class-based API..." -ForegroundColor Yellow
        npm run build:class-based
        Write-Host "   ✅ Class-based API built" -ForegroundColor Green

        # Step 5: Build CSS
        Write-Host "🎨 Step 5: Building CSS..." -ForegroundColor Yellow
        npm run build:css
        Write-Host "   ✅ CSS built" -ForegroundColor Green

        # Step 6: Verify generated files
        Write-Host "🔍 Step 6: Verifying generated files..." -ForegroundColor Yellow
        $iconNameWithoutExt = $IconName
        $expectedFiles = @(
            "dist\icons\esm\$iconNameWithoutExt.js",
            "dist\icons\cjs\$iconNameWithoutExt.js"
        )

        $allFilesExist = $true
        foreach ($file in $expectedFiles) {
            if (Test-Path $file) {
                Write-Host "   ✅ Found: $file" -ForegroundColor Green
            } else {
                Write-Host "   ❌ Missing: $file" -ForegroundColor Red
                $allFilesExist = $false
            }
        }

        if ($allFilesExist) {
            Write-Host ""
            Write-Host "🎉 SUCCESS! Icon '$IconName' added successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 Next Steps:" -ForegroundColor Cyan
            Write-Host "   1. Test the icon in the browser:" -ForegroundColor White
            Write-Host "      <i class=`"sva-icon-$($IconName.Replace('_', '-'))`"></i>" -ForegroundColor Gray
            Write-Host "   2. Import in JavaScript:" -ForegroundColor White
            Write-Host "      import { $((Get-Culture).TextInfo.ToTitleCase($IconName.Replace('_', ' ')).Replace(' ', '')) } from 'sva-icons';" -ForegroundColor Gray
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "⚠️ WARNING: Some files were not generated. Check build output for errors." -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "✅ Icon file added. Run build manually when ready:" -ForegroundColor Green
        Write-Host "   npm run build:icons && npm run build:class-based && npm run build:css" -ForegroundColor Gray
    }

} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to add icon: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
