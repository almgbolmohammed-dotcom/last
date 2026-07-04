# تشغيل المشروع محليًا (خارج Replit)

هذا الدليل يشرح كيف تشغل المشروع على جهازك (لابتوب) بعد فك ضغط الملف.

## المتطلبات

- Node.js 24 (نفس الإصدار المستخدم على Replit)
- pnpm (`npm install -g pnpm`)
- قاعدة بيانات PostgreSQL (محلية أو مستضافة، مثل Neon أو Supabase)

## 1. تثبيت الحزم

من مجلد المشروع الرئيسي:

```bash
pnpm install
```

## 2. متغيرات البيئة المطلوبة

أنشئ ملف `.env` في `artifacts/api-server/` (أو صدّرها كـ environment variables في نظامك) يحتوي:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
ADMIN_SECRET=اختر-قيمة-سرية-خاصة-بك
SESSION_SECRET=اختر-قيمة-سرية-أخرى
```

> ملاحظة: هذه القيم كانت محفوظة كأسرار (Secrets) على Replit ولا يمكن تصديرها تلقائيًا لأسباب أمنية — لازم تنشئ قيم جديدة بنفسك.

## 3. تجهيز قاعدة البيانات

من مجلد المشروع الرئيسي:

```bash
pnpm --filter @workspace/db run push
```

هذا الأمر يقوم بإنشاء جداول قاعدة البيانات حسب المخطط (schema) الموجود في `lib/db/src/schema`.

## 4. تشغيل الخادم (API Server)

في نافذة طرفية (terminal) منفصلة:

```bash
cd artifacts/api-server
PORT=8080 pnpm run dev
```

يشتغل على `http://localhost:8080`.

## 5. تشغيل الواجهة الأمامية (الموقع)

في نافذة طرفية أخرى:

```bash
cd artifacts/car-rental
PORT=5173 BASE_PATH=/ pnpm run dev
```

افتح المتصفح على: `http://localhost:5173`

طلبات `/api` من الواجهة الأمامية بتتوجه تلقائيًا لـ `http://localhost:8080` (تم إعداد ذلك في `vite.config.ts`، ويعمل فقط خارج بيئة Replit).

## بنية المشروع

- `artifacts/car-rental` — الواجهة الأمامية (React + Vite)
- `artifacts/api-server` — الخادم الخلفي (Express)
- `lib/db` — مخطط قاعدة البيانات (Drizzle ORM)
- `lib/api-zod`, `lib/api-spec`, `lib/api-client-react` — العقد بين الواجهة والخادم (OpenAPI + Zod + React Query)، يتم توليدها تلقائيًا

## أوامر مفيدة

- `pnpm run typecheck` — فحص الأنواع البرمجية لكامل المشروع
- `pnpm --filter @workspace/api-spec run codegen` — إعادة توليد ملفات الربط بين الواجهة والخادم بعد أي تعديل على العقد (OpenAPI)

## ملاحظات مهمة

- هذا المشروع كان مصمم أصلًا للعمل داخل بيئة Replit التي توفر نظام توجيه (proxy) وأسرار (secrets) ومتغيرات بيئة جاهزة. تشغيله محليًا يتطلب توفير هذه الأشياء يدويًا كما هو موضح أعلاه.
- للنشر (deploy) خارج Replit، ستحتاج لاستضافة الخادم الخلفي (Node.js) وقاعدة البيانات بشكل منفصل عن الواجهة الأمامية، لأن هذا المشروع يحتوي على خادم Express حقيقي وليس مجرد موقع ثابت.
