# إعداد Backend الخاص بـ TECNOVA

الـ Backend موجود في `backend/worker.js` ويستخدم Cloudflare Workers + D1. وهو مخصص لحفظ تقدم قائد المهمة دون طلب اسم الطفل أو بريده الإلكتروني.

## ما الذي يقدمه؟

- `GET /health` فحص حالة الخدمة.
- `POST /v1/session` إنشاء معرّف عشوائي للجلسة ورمز موقّع.
- `GET /v1/state` استرجاع تقدم الجلسة.
- `PUT /v1/state` حفظ الموارد والقرارات والشارات ونتيجة المهمة.
- التحقق من المدخلات، وتحديد أحجام البيانات، وCORS، ورمز جلسة موقّع.
- لا يخزن نصوص محادثة NOVA أو الاسم الحقيقي أو البريد أو أي بيانات تعريفية.

## نشر الخدمة (يتطلب حساب Cloudflare)

1. ثبتي Node.js وWrangler ثم سجلي الدخول:
   `npx wrangler login`
2. من مجلد المشروع أنشئي قاعدة D1:
   `npx wrangler d1 create lunar-outpost`
3. انسخي قيمة `database_id` التي يعرضها الأمر إلى `backend/wrangler.toml` بدل النص التجريبي.
4. نفذي ترحيل قاعدة البيانات:
   `npx wrangler d1 migrations apply lunar-outpost --remote --config backend/wrangler.toml`
5. أنشئي سر جلسات عشوائيًا بطول 32 حرفًا على الأقل:
   `npx wrangler secret put SESSION_SECRET --config backend/wrangler.toml`
   أدخلي السر في مطالبة Wrangler نفسها؛ لا تضعيه في GitHub أو في ملفات التطبيق.
6. انشري الـ Worker:
   `npx wrangler deploy --config backend/wrangler.toml`
7. اختبري:
   `https://YOUR-WORKER.workers.dev/health`
8. بعد نجاح النشر، ضعي رابط Worker الحقيقي في `src/backend-config.js` مكان القيمة الفارغة، ثم أعيدي بناء APK.

## ملاحظات مهمة

- لا يمكن تفعيل المزامنة السحابية بمجرد وجود الكود؛ يجب إنشاء D1 ونشر Worker أولًا، ثم وضع رابط الخدمة الحقيقي في إعداد التطبيق.
- قبل النشر، راجعي قائمة النطاقات المسموح بها في `ALLOWED_ORIGINS`.
- عند عدم إعداد الخدمة، تظل اللعبة تعمل بالحفظ المحلي، ولا تعرض نفسها على أنها متصلة بالسحابة.
- هذا الـ Backend ليس منصة محادثة توليدية. NOVA الحالي مساعد علمي محلي يعتمد على مكتبة إجابات ومصادر محددة. إضافة نموذج AI خارجي تحتاج موافقة مناسبة لبيانات الأطفال، وفلترة مدخلات ومخرجات، ومفتاحًا محفوظًا في الخادم فقط.
