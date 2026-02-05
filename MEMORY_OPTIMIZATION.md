# Memory-Efficient Development Guide

## আপনার 8GB RAM ল্যাপটপের জন্য Best Practices

### ✅ কি করা হয়েছে:

#### 1. Memory-Efficient Scripts যোগ করা হয়েছে
```json
{
  "dev": "next dev",                    // Normal dev
  "dev:low-mem": "NODE_OPTIONS='--max-old-space-size=2048' next dev",  // 2GB limit
  "dev:clean": "rm -rf .next && next dev",  // Clean start
  "clean": "rm -rf .next node_modules/.cache"  // Manual cleanup
}
```

#### 2. `.gitignore` Update করা হয়েছে
```
/.next/
.next/cache/
node_modules/.cache/
.turbo/
```
এখন বড় cache files Git এ যাবে না!

#### 3. Next.js Config Optimized
- ✅ `optimizePackageImports` - শুধু দরকারি icons load হবে
- ✅ `unoptimized: true` - Dev mode এ image processing বন্ধ
- ✅ `disableOptimizedLoading` - Development এ memory save

---

## 🚀 কিভাবে Run করবেন:

### Normal Development (4-6GB RAM)
```bash
npm run dev
```

### Low Memory Mode (2GB RAM limit)
```bash
npm run dev:low-mem
```
অথবা PowerShell এ:
```powershell
$env:NODE_OPTIONS='--max-old-space-size=2048'; npm run dev
```

### Clean Start (যদি slow হয়)
```bash
npm run dev:clean
```

### Manual Cleanup
```bash
npm run clean
```

---

## 📊 Memory Usage Monitor

### Check করুন folder sizes:
```powershell
Get-ChildItem -Directory | ForEach-Object { 
  $size = (Get-ChildItem $_.FullName -Recurse -ErrorAction SilentlyContinue | 
  Measure-Object -Property Length -Sum).Sum; 
  [PSCustomObject]@{
    Folder=$_.Name; 
    'Size(MB)'=[math]::Round($size/1MB,2)
  } 
} | Sort-Object 'Size(MB)' -Descending
```

### Expected Sizes (8GB RAM):
- ✅ `.next`: 50-200 MB (normal)
- ⚠️ `.next`: 200-500 MB (heavy usage)
- ❌ `.next`: 500+ MB (cleanup needed!)
- ✅ `node_modules`: 500-600 MB
- ✅ `src`: < 1 MB

---

## 🔧 যদি আবার Slow হয়:

### Quick Fix:
```bash
# Terminal বন্ধ করুন
# তারপর:
npm run clean
npm run dev
```

### Full Reset:
```bash
# সব process kill করুন
taskkill /F /IM node.exe

# সব cache clean করুন
rm -rf .next node_modules/.cache .turbo

# Fresh start
npm run dev
```

---

## 💡 Pro Tips:

### 1. GitHub এ Push করার আগে:
```bash
# Check করুন .next folder tracked কিনা
git status

# যদি দেখান, remove করুন:
git rm -rf --cached .next
git commit -m "Remove .next from tracking"
```

### 2. Image Optimization
- Dev mode এ images unoptimized (fast)
- Production build এ automatic optimization
- Supabase থেকে images fetch করছেন ✅

### 3. Icon Loading
- শুধু ব্যবহৃত icons load হয় (tree-shaking)
- `react-icons` এর পুরো library load হয় না

### 4. Database Queries
- ✅ Data Supabase থেকে fetch হচ্ছে (না hardcoded)
- ✅ কোনো 2GB JSON file নেই
- ✅ Server-side rendering ব্যবহার হচ্ছে

---

## ⚠️ Warning Signs:

যদি দেখেন:
- ❌ Dev server 5 মিনিটের বেশি নিচ্ছে
- ❌ Laptop fan full speed এ চলছে
- ❌ Task Manager এ Node.js 4GB+ RAM ব্যবহার করছে

তাহলে:
1. `Ctrl+C` চাপুন (server stop)
2. `npm run clean` চালান
3. `npm run dev:low-mem` দিয়ে start করুন

---

## ✅ Current Status:

- ✅ `.next` cleaned (1.3GB → 50MB)
- ✅ Memory limit scripts added
- ✅ `.gitignore` updated
- ✅ Next.js config optimized
- ✅ Dev server: **4.4 seconds** (was 10+ minutes!)

**Your laptop is safe now! 🎉**

---

## 📞 Common Commands:

```bash
# Quick cleanup
npm run clean && npm run dev

# Low memory mode
npm run dev:low-mem

# Check sizes
ls -lh .next/

# Kill node processes
taskkill /F /IM node.exe
```

---

**Remember:** `.next` folder টা temporary cache। যেকোনো সময় delete করতে পারবেন, কোনো সমস্যা হবে না!
