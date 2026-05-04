export default function Passport() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20">→ رجوع لألمانيا</a>
            </header>

            <section className="max-w-3xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">📘</div>
                <h1 className="text-3xl font-bold mb-2">تجديد الجواز السوري في ألمانيا</h1>
                <p className="text-white/50 mb-2">آخر تحديث: مايو 2026</p>
                <p className="text-white/70 mb-10 leading-relaxed">
                    استأنفت السفارة السورية في برلين إصدار جوازات السفر منذ 12 مارس 2025 عبر نظام حجز مواعيد إلكتروني جديد. إليك الخطوات الكاملة.
                </p>

                <h2 className="text-2xl font-bold mb-6 text-[#c9a84c]">الخطوات بالترتيب</h2>

                <div className="grid gap-4 mb-10">
                    {[
                        { step: "1", title: "ادخل لبوابة المغتربين", desc: "افتح موقع ecsc-expatriates.sy وأنشئ حساباً جديداً برقمك الوطني وبريدك الإلكتروني" },
                        { step: "2", title: "املأ استمارة التجديد", desc: "ادخل بياناتك بالعربية والألمانية بشكل دقيق — أي خطأ يؤخر معاملتك أشهر" },
                        { step: "3", title: "اختر نوع الدور", desc: "الدور العادي 175 يورو (ينتظر 2-3 أشهر) أو المستعجل 345 يورو (نفس اليوم أو أيام قليلة)" },
                        { step: "4", title: "حجز موعد في السفارة", desc: "اختر موعداً متاحاً في السفارة في برلين — Rauchstr. 25, 10787 Berlin" },
                        { step: "5", title: "احضر يوم الموعد", desc: "احضر مع جوازك القديم + 5 صور شخصية بالمواصفات + الاستمارة المطبوعة + الرسوم نقداً باليورو" },
                        { step: "6", title: "استلام الجواز", desc: "ستتلقى رسالة عند جاهزية الجواز — تحضره شخصياً أو ترسل وكيلاً مفوضاً" },
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">{item.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">الوثائق المطلوبة</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-3 text-white/70">
                        <li>✓ جواز السفر السوري القديم (حتى لو منتهي الصلاحية)</li>
                        <li>✓ بطاقة الهوية السورية أو إخراج قيد حديث ومصدّق</li>
                        <li>✓ 5 صور شخصية بالمواصفات (خلفية بيضاء، مواجهة مباشرة)</li>
                        <li>✓ الاستمارة المطبوعة من البوابة الإلكترونية</li>
                        <li>✓ نسخة عن الإقامة الألمانية (Aufenthaltstitel)</li>
                        <li>✓ الرسوم نقداً باليورو فقط</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">معلومات الاتصال بالسفارة</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 space-y-3 text-white/70">
                    <p>
                        <span className="text-white">العنوان: </span>
                        <a href="https://maps.google.com/?q=Rauchstr.+25,+10787+Berlin" target="_blank" className="text-[#c9a84c] hover:underline">
                            Rauchstr. 25, 10787 Berlin →
                        </a>
                    </p>
                    <p>
                        <span className="text-white">قسم الجوازات: </span>
                        <a href="tel:+493050177433" className="text-[#c9a84c] hover:underline">
                            03050177433
                        </a>
                    </p>
                    <p>
                        <span className="text-white">واتساب (طوارئ فقط): </span>
                        <a href="https://wa.me/4915214577874" target="_blank" className="text-[#c9a84c] hover:underline">
                            004915214577874 →
                        </a>
                    </p>
                    <p>
                        <span className="text-white">الموقع الرسمي: </span>
                        <a href="https://syrian-embassy.de" target="_blank" className="text-[#c9a84c] hover:underline">
                            syrian-embassy.de →
                        </a>
                    </p>
                    <p>
                        <span className="text-white">بوابة المعاملات: </span>
                        <a href="https://ecsc-expatriates.sy" target="_blank" className="text-[#c9a84c] hover:underline">
                            ecsc-expatriates.sy →
                        </a>
                    </p>
                    <p><span className="text-white">الدوام:</span> الإثنين-الخميس، 8:30 صباحاً - 4:00 عصراً</p>
                </div>

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-4">
                    <p className="text-[#c9a84c] font-bold mb-2">💡 نصيحة مهمة</p>
                    <p className="text-white/70 text-sm leading-relaxed">قدّم طلب التجديد قبل انتهاء صلاحية جوازك بـ 6 أشهر على الأقل — الازدحام كبير والمواعيد تنفد بسرعة.</p>
                </div>

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-4">
                    <p className="text-[#c9a84c] font-bold mb-2">🆕 جديد 2026</p>
                    <p className="text-white/70 text-sm leading-relaxed">افتُتحت قنصلية بون مجدداً في فبراير 2026 — يمكن للمقيمين في غرب ألمانيا تقديم معاملاتهم هناك بدلاً من السفر إلى برلين.</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <p className="text-red-400 font-bold mb-2">⚠️ تنبيه قانوني</p>
                    <p className="text-white/70 text-sm leading-relaxed">هذه المعلومات للإرشاد فقط — تحقق دائماً من الموقع الرسمي للسفارة قبل الذهاب لأن الإجراءات والرسوم قد تتغير.</p>
                </div>

            </section>

        </main>
    );
}