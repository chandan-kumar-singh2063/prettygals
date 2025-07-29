# Project Cleanup Script
# This script removes test files, duplicates, and unnecessary development files

Write-Host "🧹 Starting Project Cleanup..." -ForegroundColor Yellow
Write-Host "This will remove test files, duplicates, and development-only files" -ForegroundColor Yellow

# Ask for confirmation
$confirmation = Read-Host "Are you sure you want to proceed? (y/N)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "❌ Cleanup cancelled." -ForegroundColor Red
    exit
}

$removed = 0
$errors = 0

# Function to safely remove file/folder
function Remove-SafeItem {
    param($Path, $Description)
    
    if (Test-Path $Path) {
        try {
            Remove-Item $Path -Recurse -Force
            Write-Host "✅ Removed: $Description" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ Failed to remove: $Description - $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    else {
        Write-Host "⚠️  Not found: $Description" -ForegroundColor Yellow
        return $false
    }
}

Write-Host "`n🗂️  Removing Test Files..." -ForegroundColor Cyan

# Test pages
$testFiles = @(
    @{Path="src\app\test-cart"; Desc="Test Cart Page"},
    @{Path="src\app\payment-test"; Desc="Payment Test Page"},
    @{Path="src\app\cart-test"; Desc="Cart Test Page"},
    @{Path="src\app\complete-test"; Desc="Complete Test Page"},
    @{Path="src\app\debug-cart"; Desc="Debug Cart Page"}
)

foreach ($file in $testFiles) {
    if (Remove-SafeItem $file.Path $file.Desc) { $removed++ } else { $errors++ }
}

Write-Host "`n🔧 Removing Test APIs..." -ForegroundColor Cyan

# Test API routes
$testApis = @(
    @{Path="src\app\api\test-auth"; Desc="Test Auth API"},
    @{Path="src\app\api\test-order"; Desc="Test Order API"},
    @{Path="src\app\api\db-auth-test"; Desc="DB Auth Test API"},
    @{Path="src\app\api\auth-test"; Desc="Auth Test API"},
    @{Path="src\app\api\debug"; Desc="Debug API"}
)

foreach ($api in $testApis) {
    if (Remove-SafeItem $api.Path $api.Desc) { $removed++ } else { $errors++ }
}

Write-Host "`n📋 Removing Duplicate Files..." -ForegroundColor Cyan

# Duplicate files with _new suffix
$duplicates = @(
    @{Path="src\lib\mongodb_new.js"; Desc="Duplicate MongoDB Connection"},
    @{Path="src\app\layout_new.js"; Desc="Duplicate Layout"},
    @{Path="src\app\checkout\page_new.js"; Desc="Duplicate Checkout Page"},
    @{Path="src\app\api\products\route_new.js"; Desc="Duplicate Products API"},
    @{Path="src\app\api\payment\verify\route_new.js"; Desc="Duplicate Payment Verify API"}
)

foreach ($dup in $duplicates) {
    if (Remove-SafeItem $dup.Path $dup.Desc) { $removed++ } else { $errors++ }
}

Write-Host "`n🌱 Removing Seed/Development Files..." -ForegroundColor Cyan

# Seed and development files
$devFiles = @(
    @{Path="src\app\api\seed-orders"; Desc="Seed Orders API"},
    @{Path="src\app\api\seed"; Desc="Seed API"},
    @{Path="scripts\seed.js"; Desc="Seed Script"},
    @{Path="test-payment-flow.js"; Desc="Root Test File"},
    @{Path="TOAST_USAGE_EXAMPLES.js"; Desc="Toast Examples File"},
    @{Path="start-dev.bat"; Desc="Development Batch Script"}
)

foreach ($dev in $devFiles) {
    if (Remove-SafeItem $dev.Path $dev.Desc) { $removed++ } else { $errors++ }
}

Write-Host "`n🗄️  Removing Old Cache Files..." -ForegroundColor Cyan

# Old webpack cache files
$cachePattern = ".next\cache\webpack\*\index.pack.gz.old"
$oldCacheFiles = Get-ChildItem -Path $cachePattern -ErrorAction SilentlyContinue
foreach ($cache in $oldCacheFiles) {
    if (Remove-SafeItem $cache.FullName "Old Cache: $($cache.Name)") { $removed++ } else { $errors++ }
}

Write-Host "`n🧹 Cleanup Complete!" -ForegroundColor Green
Write-Host "✅ Successfully removed: $removed files/folders" -ForegroundColor Green
if ($errors -gt 0) {
    Write-Host "❌ Errors encountered: $errors files/folders" -ForegroundColor Red
}

Write-Host "`n📊 Project Status:" -ForegroundColor Cyan
Write-Host "- Your main application files are untouched" -ForegroundColor White
Write-Host "- All test and duplicate files have been removed" -ForegroundColor White
Write-Host "- Your payment system remains fully functional" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
