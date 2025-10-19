# 🗑️ Project Cleanup Script
# تنظيف وتنظيم ملفات المشروع

Write-Host "🧹 Starting project cleanup..." -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود Git
$gitStatus = git status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Git is not initialized. Please initialize git first." -ForegroundColor Yellow
    exit 1
}

# 1. إنشاء Backup
Write-Host "📦 Creating backup commit..." -ForegroundColor Yellow
git add .
git commit -m "📦 backup: pre-cleanup backup" 2>$null

# 2. إنشاء المجلدات
Write-Host "📁 Creating archive directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "docs\archive" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\images" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\snippets" | Out-Null

# 3. نقل ملفات SUMMARY
Write-Host "📝 Moving SUMMARY files..." -ForegroundColor Yellow
$summaryFiles = @(
    "AUTH_PAGES_REVIEW_SUMMARY.md",
    "AUTH_UNIFICATION_SUMMARY.md",
    "ERROR_HANDLING_SUMMARY.md",
    "IMPROVEMENTS_SUMMARY.md",
    "PHASE_1_SUMMARY.md",
    "PHASE_2_SUMMARY.md",
    "SIGNIN_SKELETON_SUMMARY.md",
    "SIGNUP_COMPONENTS_SUMMARY.md"
)

$movedCount = 0
foreach ($file in $summaryFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs\archive\" -Force
        Write-Host "  ✅ Moved: $file" -ForegroundColor Green
        $movedCount++
    } else {
        Write-Host "  ⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

# 4. نقل raw.jpg
Write-Host "🖼️  Moving images..." -ForegroundColor Yellow
if (Test-Path "raw.jpg") {
    Move-Item -Path "raw.jpg" -Destination "docs\images\database-schema.jpg" -Force
    Write-Host "  ✅ Moved: raw.jpg → docs\images\database-schema.jpg" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  raw.jpg not found" -ForegroundColor Yellow
}

# 5. نقل refrance.md
Write-Host "📄 Moving reference files..." -ForegroundColor Yellow
if (Test-Path "refrance.md") {
    Move-Item -Path "refrance.md" -Destination "docs\snippets\code-examples.md" -Force
    Write-Host "  ✅ Moved: refrance.md → docs\snippets\code-examples.md" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  refrance.md not found" -ForegroundColor Yellow
}

# 6. حذف .windsurfrules المكرر
Write-Host "🗑️  Removing duplicate files..." -ForegroundColor Yellow
if (Test-Path "docs\.windsurfrules") {
    Remove-Item -Path "docs\.windsurfrules" -Force
    Write-Host "  ✅ Removed: docs\.windsurfrules (duplicate)" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  docs\.windsurfrules not found" -ForegroundColor Cyan
}

# 7. حذف QUICK_ADMIN_SETUP.md إذا كان مكرراً
Write-Host "🗑️  Checking for duplicate QUICK_ADMIN_SETUP.md..." -ForegroundColor Yellow
if ((Test-Path "QUICK_ADMIN_SETUP.md") -and (Test-Path "docs\QUICK_ADMIN_SETUP.md")) {
    Remove-Item -Path "QUICK_ADMIN_SETUP.md" -Force
    Write-Host "  ✅ Removed: QUICK_ADMIN_SETUP.md (duplicate in docs/)" -ForegroundColor Green
} elseif (Test-Path "QUICK_ADMIN_SETUP.md") {
    Write-Host "  ℹ️  Keeping QUICK_ADMIN_SETUP.md (no duplicate)" -ForegroundColor Cyan
}

# 8. Commit التغييرات
Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "🗑️ cleanup: organize project structure

- Moved $movedCount SUMMARY files to docs/archive/
- Moved images to docs/images/
- Moved reference files to docs/snippets/
- Removed duplicate files
" 2>$null

# 9. عرض النتائج
Write-Host ""
Write-Host "✅ Cleanup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  - Moved $movedCount SUMMARY files" -ForegroundColor White
Write-Host "  - Organized images and snippets" -ForegroundColor White
Write-Host "  - Removed duplicates" -ForegroundColor White
Write-Host ""
Write-Host "📁 New structure:" -ForegroundColor Cyan
Write-Host "  docs/archive/    - Old SUMMARY files" -ForegroundColor White
Write-Host "  docs/images/     - Images and diagrams" -ForegroundColor White
Write-Host "  docs/snippets/   - Code examples" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your project is now cleaner and more organized!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the changes: git log -1" -ForegroundColor White
Write-Host "  2. Test the project: npm run build" -ForegroundColor White
Write-Host "  3. If everything works, push: git push" -ForegroundColor White
Write-Host ""
