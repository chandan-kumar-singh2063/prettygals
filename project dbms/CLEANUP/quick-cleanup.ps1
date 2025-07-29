# Quick Cleanup Script (No Confirmation)
# For immediate cleanup without prompts

Write-Host "🧹 Quick Project Cleanup - Removing unnecessary files..." -ForegroundColor Yellow

$removed = 0

# All files to remove in one go
$filesToRemove = @(
    # Test pages
    "src\app\test-cart",
    "src\app\payment-test", 
    "src\app\cart-test",
    "src\app\complete-test",
    "src\app\debug-cart",
    
    # Test APIs
    "src\app\api\test-auth",
    "src\app\api\test-order",
    "src\app\api\db-auth-test", 
    "src\app\api\auth-test",
    "src\app\api\debug",
    
    # Duplicates
    "src\lib\mongodb_new.js",
    "src\app\layout_new.js",
    "src\app\checkout\page_new.js", 
    "src\app\api\products\route_new.js",
    "src\app\api\payment\verify\route_new.js",
    
    # Development files
    "src\app\api\seed-orders",
    "src\app\api\seed",
    "scripts\seed.js",
    "test-payment-flow.js",
    "TOAST_USAGE_EXAMPLES.js",
    "start-dev.bat"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        try {
            Remove-Item $file -Recurse -Force -ErrorAction Stop
            Write-Host "✅ $file" -ForegroundColor Green
            $removed++
        }
        catch {
            Write-Host "❌ $file - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Remove old cache files
Get-ChildItem -Path ".next\cache\webpack\*\index.pack.gz.old" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "✅ $($_.Name)" -ForegroundColor Green
    $removed++
}

Write-Host "`n🎉 Cleanup Complete! Removed $removed items." -ForegroundColor Green
