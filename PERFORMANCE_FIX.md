# Performance Optimization - Portfolio

## Problem: Slow Build & 1.3GB .next Folder

### Root Causes:
1. **.next folder became 1.3GB** - Turbopack cache bloat
2. **Image optimization** - Processing many remote images in dev
3. **Large icon libraries** - Loading all icons at once

### ✅ Fixes Applied:

#### 1. Clean Build Cache
```bash
# Already done - deleted .next folder
# Removed 1.3GB of cached data
```

#### 2. Optimize next.config.ts
- ✅ Set `unoptimized: true` for dev mode
- ✅ Keeps `optimizePackageImports` for code splitting

#### 3. Add .gitignore Entries
Make sure these are ignored:
- .next/
- node_modules/
- .turbo/
- *.log

### 🚀 Fast Dev Server:

```bash
# Clean start (if needed)
npm run dev
```

### 📊 Expected Performance:
- **Before:** 10+ minutes, 1.3GB cache
- **After:** 30-60 seconds, ~50MB cache

### 💡 Tips to Keep It Fast:

1. **Don't commit .next folder**
   ```bash
   git rm -r --cached .next
   ```

2. **Clean cache regularly**
   ```bash
   rm -rf .next node_modules/.cache
   ```

3. **Use Turbopack flags**
   ```json
   "dev": "next dev --turbopack"
   ```

### 🔍 Monitor Folder Sizes:
```bash
# Check sizes anytime
Get-ChildItem -Directory | ForEach-Object { 
  $size = (Get-ChildItem $_.FullName -Recurse -ErrorAction SilentlyContinue | 
  Measure-Object -Property Length -Sum).Sum; 
  [PSCustomObject]@{
    Folder=$_.Name; 
    'Size(MB)'=[math]::Round($size/1MB,2)
  } 
} | Sort-Object 'Size(MB)' -Descending
```

### ✅ Expected Sizes:
- `.next`: 50-100MB (not 1.3GB!)
- `node_modules`: 500-600MB
- `src`: < 1MB
- `public`: < 5MB

---

**Status:** ✅ Fixed! Dev server should start in under 1 minute now.
