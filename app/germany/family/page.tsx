export default function Family() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20">→ رجوع لألمانيا</a>
            </header>

            <section className="max-w-3xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">👨‍👩‍👧</div>
                <h1 className="text-3xl font-bold mb-2">لمّ شمل الأسرة في ألمانيا</h1>
                <p className="text-white/50 mb-2">آخر تحديث: مايو 2026</p>
                <p className="text-white/70 mb-10 leading-relaxed">
                    إحضار عائلتك إلى ألمانيا يعتمد على نوع إقامتك. القوانين تغيرت في 2025 — يجب الانتباه جيداً للشروط الجديدة.
                </p>

                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-5 mb-10">
                    <p className="text-red-400 font-bold mb-2">⚠️ تحديث مهم جداً — يوليو 2025</p>
                    <p className="text-white/80 text-sm leading-relaxed">
                        تم تعليق لمّ شمل الأسرة للحاصلين على <span className="text-white">الحماية الفرعية (Subsidiärer Schutz)</span> لمدة عامين ابتداءً من 24 يوليو 2025. الاستثناء الوحيد هو حالات الضرورة القصوى (خطر على الحياة).
                    </p>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">من يحق له لمّ الشمل؟</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-3 text-white/70">
                        <li>✅ <span className="text-white">المعترف بهم كلاجئين</span> (وفق اتفاقية جنيف) — يحق لهم لمّ الشمل بدون قيود مالية</li>
                        <li>✅ <span className="text-white">الحاصلون على حق اللجوء</span> (Asylberechtigte) — نفس الحقوق</li>
                        <li>⏸️ <span className="text-white">الحماية الفرعية</span> — معلّق حالياً حتى يوليو 2027</li>
                        <li>✅ <span className="text-white">الإقامة الدائمة</span> — يحق لهم بشروط مالية وسكنية</li>
                        <li>❌ <span className="text-white">حظر الترحيل (Duldung)</span> — لا يحق لهم</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-[#c9a84c]">الخطوات بالترتيب</h2>

                <div className="grid gap-4 mb-10">
                    {[
                        {
                            step: "1",
                            title: "حفظ المدة خلال 3 أشهر",
                            desc: <>هذه أهم خطوة. يجب تقديم <span className="text-[#c9a84c]">إشعار لمّ الشمل</span> خلال 3 أشهر من تاريخ منح اللجوء — هذا يسمى &quot;لمّ الشمل المتميز&quot; ويعفيك من شروط الدخل والسكن</>
                        },
                        {
                            step: "2",
                            title: "تقديم الطلب أونلاين",
                            desc: <>يقدم الطلب عبر الموقع الرسمي <a href="https://familyreunion-syria.diplo.de" target="_blank" className="text-[#c9a84c] hover:underline">familyreunion-syria.diplo.de →</a> هذا الموقع مخصص للسوريين تحديداً</>
                        },
                        {
                            step: "3",
                            title: "تجهيز الوثائق",
                            desc: "وثيقة الزواج المصدّقة، شهادات ميلاد الأولاد، جوازات السفر، صور شخصية حديثة، رأي BAMF عن العائلة"
                        },
                        {
                            step: "4",
                            title: "حضور المقابلة",
                            desc: <>العائلة تحضر مقابلة في أقرب سفارة ألمانية. <span className="text-white">السفارة الألمانية في دمشق مغلقة</span> — يجب الذهاب لـ بيروت أو عمان أو بغداد</>
                        },
                        {
                            step: "5",
                            title: "مدة الانتظار",
                            desc: "حالياً مدة الانتظار بين التسجيل واستلام الموعد حوالي 10 أسابيع، وبعدها معالجة الطلب تأخذ 3-12 شهر إضافية"
                        },
                        {
                            step: "6",
                            title: "الموافقة والسفر",
                            desc: "بعد الموافقة يحصل أفراد العائلة على فيزا D للسفر إلى ألمانيا، وبعد الوصول يسجلون في Bürgeramt ثم BAMF"
                        },
                    ].map((item) => (
                        <div key={item.step} className="card-hover flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
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

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">من يمكن استقدامهم؟</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 space-y-3 text-white/70">
                    <p>✅ <span className="text-white">الزوج/الزوجة</span> بشرط أن يكون الزواج قائماً قبل وصولك لألمانيا</p>
                    <p>✅ <span className="text-white">الأبناء القاصرين</span> (تحت 18 سنة)</p>
                    <p>✅ <span className="text-white">الوالدان</span> فقط إذا كنت أنت قاصراً وقت الوصول</p>
                    <p>⚠️ <span className="text-white">الإخوة والأخوات</span> فقط في حالات &quot;المشقة الاستثنائية&quot;</p>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">الرسوم الرسمية</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 space-y-2 text-white/70">
                    <p>💶 رسوم تأشيرة البالغ: <span className="text-white">75 يورو</span></p>
                    <p>💶 رسوم تأشيرة الطفل: <span className="text-white">37.50 يورو</span></p>
                    <p>💶 الترجمة المحلفة للوثائق: حسب عدد الصفحات</p>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">روابط ومصادر رسمية</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 space-y-3 text-white/70">
                    <p>
                        <span className="text-white">موقع لمّ الشمل للسوريين: </span>
                        <a href="https://familyreunion-syria.diplo.de" target="_blank" className="text-[#c9a84c] hover:underline">familyreunion-syria.diplo.de →</a>
                    </p>
                    <p>
                        <span className="text-white">المكتب الاتحادي للهجرة (BAMF): </span>
                        <a href="https://www.bamf.de" target="_blank" className="text-[#c9a84c] hover:underline">bamf.de →</a>
                    </p>
                    <p>
                        <span className="text-white">دليل ألمانيا الرسمي: </span>
                        <a href="https://handbookgermany.de/ar/family-reunification" target="_blank" className="text-[#c9a84c] hover:underline">handbookgermany.de →</a>
                    </p>
                    <p>
                        <span className="text-white">السفارة الألمانية في بيروت: </span>
                        <a href="https://beirut.diplo.de" target="_blank" className="text-[#c9a84c] hover:underline">beirut.diplo.de →</a>
                    </p>
                </div>

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-4">
                    <p className="text-[#c9a84c] font-bold mb-2">💡 نصيحة ذهبية</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        استشر مستشار هجرة (Migrationsberatung) مجاناً قبل تقديم الطلب — موجودون في كل مدينة ويعرفون التفاصيل الدقيقة لولايتك.
                    </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <p className="text-red-400 font-bold mb-2">⚠️ تنبيه قانوني</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        هذه المعلومات للإرشاد فقط — القوانين تتغير باستمرار. تحقق من الجهات الرسمية أو محامي مختص قبل اتخاذ أي قرار.
                    </p>
                </div>

            </section>

        </main>
    );
}