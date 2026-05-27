# GitHub Authentication Setup

## للرفع على الـ Private Repo: https://github.com/yashar-excellence/EGEA

---

### 🔐 الخطوة 1: إنشاء Personal Access Token

1. روح [GitHub.com](https://github.com) وافتح حسابك
2. انقر على صورتك (أعلى يمين) → **Settings**
3. في آخر القائمة الشمال: **Developer settings**
4. اختار **Personal access tokens** → **Tokens (classic)**
5. انقر **Generate new token (classic)**
6. املأ البيانات:
   - **Note**: `EGEA Platform Access`
   - **Expiration**: 90 days (or No expiration)
   - **Scopes**: ✅ صحّح على `repo` (Full control of private repositories)
7. انقر **Generate token** في آخر الصفحة
8. **انسخ التوكن فوراً** (مش هيتعرض تاني!)

---

### 📤 الخطوة 2: Push للـ GitHub

افتح PowerShell ونفّذ:

```powershell
cd "e:\Yashar\00000000\Yashar\EGEA_INUVAIRA_Windsurf\platform\web"

# لو مش initialized
# git init
# git add .
# git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/yashar-excellence/EGEA.git

# Push
git branch -M main
git push -u origin main
```

**لما يطلب:**
- `Username`: `yashar-excellence`
- `Password`: الصق الـ Token هنا (مش الباسورد العادي!)

---

### ✅ التحقق

```bash
git remote -v
# هيطبع:
# origin  https://github.com/yashar-excellence/EGEA.git (fetch)
# origin  https://github.com/yashar-excellence/EGEA.git (push)
```

---

### 🔄 Push Updates مستقبلاً

بعد ما تربط مرة، أي تعديل جديد:

```bash
git add .
git commit -m "Update: [وصف التعديل]"
git push
```

---

### ⚠️ مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| `fatal: not a git repository` | شغّل `git init` الأول |
| `remote already exists` | شغّل `git remote remove origin` ثم أضفه تاني |
| `Authentication failed` | اتأكد إنك مستخدم Token مش Password |
| `rejected: non-fast-forward` | شغّل `git pull origin main` الأول |

---

### 📋 Files to Ignore (.gitignore موجود)

```
node_modules/
.next/
.env.local
.env.*.local
*.log
```
