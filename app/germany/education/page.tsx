export default function Education() {
    const academicSteps = [
        { step: "1", title: "تحقق من شهادتك في anabin", desc: "ادخل قاعدة بيانات anabin.kmk.org وابحث عن جامعتك السورية. إذا كانت بتصنيف H+ فهي معترف بها بالكامل" },
        { step: "2", title: "اختر طريق الاعتراف", desc: "إذا كانت جامعتك H+ تتقدم مباشرة، إذا غير مدرجة تحتاج Statement of Comparability من ZAB" },
        { step: "3", title: "ترجمة الوثائق", desc: "ترجم شهادتك الجامعية وكشف العلامات وشهادة الثانوية لدى مترجم محلف معتمد في ألمانيا" },
        { step: "4", title: "تقديم الطلب لـ ZAB", desc: "أرسل الوثائق المترجمة + استمارة anabin إلى المكتب المركزي للتعليم الأجنبي في بون" },
        { step: "5", title: "دفع الرسوم", desc: "الرسوم حوالي 200 يورو — تدفع بعد قبول الطلب الأولي" },
        { step: "6", title: "استلام التقييم", desc: "تستغرق المعالجة 3-6 أشهر، وتحصل على Zeugnisbewertung تثبت معادلة شهادتك" },
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20">→ رجوع لألمانيا</a>
            </header>

            <section className="max-w-3xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">🎓</div>
                <h1 className="text-3xl font-bold mb-2">الاعتراف بالشهادات السورية في ألمانيا</h1>
                <p className="text-white/50 mb-2">آخر تحديث: مايو 2026</p>
                <p className="text-white/70 mb-10 leading-relaxed">
                    توثيق شهاداتك السورية ضروري للعمل والدراسة في ألمانيا. الإجراءات تختلف حسب نوع الشهادة — مدرسية، جامعية، أو مهنية.
                </p>

                <div className="bg-white/5 border border-[#c9a84c]/40 rounded-xl p-5 mb-10">
                    <p className="text-[#c9a84c] font-bold mb-2">🌟 خبر سار للسوريين</p>
                    <p className="text-white/80 text-sm leading-relaxed">
                        معظم الجامعات السورية الحكومية الكبرى مثل دمشق وحلب وتشرين وحمص معترف بها في anabin بتصنيف H+ — أي معادلة كاملة لخريجيها.
                    </p>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">أنواع الشهادات وجهات الاعتراف</h2>
                <div className="grid gap-4 mb-10">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">📜 الشهادة الثانوية (البكالوريا)</h3>
                        <p className="text-white/60 text-sm leading-relaxed">يتم الاعتراف بها عبر مكاتب الاعتراف في الولايات (Zeugnisanerkennungsstelle). كل ولاية لها مكتب خاص.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">🎓 الشهادة الجامعية</h3>
                        <p className="text-white/60 text-sm leading-relaxed">يتم الاعتراف بها عبر المكتب المركزي للتعليم الأجنبي ZAB في بون.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">🔧 المؤهلات المهنية</h3>
                        <p className="text-white/60 text-sm leading-relaxed">يتم الاعتراف بها عبر Anerkennungs-Finder حسب المهنة والمدينة.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-[#c9a84c]">خطوات الاعتراف بالشهادة الجامعية</h2>

                <div className="grid gap-4 mb-10">
                    {academicSteps.map((item) => (
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

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">المهن المنظمة (تتطلب اعتراف إجباري)</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-3 text-white/70">
                        <li>⚕️ الأطباء والصيادلة وأطباء الأسنان</li>
                        <li>👨‍⚖️ المحامون والقضاة</li>
                        <li>👨‍🏫 المعلمون</li>
                        <li>👷 المهندسون (في بعض الحالات)</li>
                        <li>🩺 الممرضون والقابلات</li>
                        <li>💼 المحاسبون القانونيون</li>
                    </ul>
                    <p className="text-white/50 text-xs mt-4">للمهن غير المنظمة (مثل المبرمج، الإداري) لست مجبراً على الاعتراف، لكنه مفيد لسوق العمل.</p>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">الوثائق المطلوبة</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-3 text-white/70">
                        <li>✓ الشهادة الجامعية الأصلية ونسخة مصدقة</li>
                        <li>✓ كشف العلامات الكامل (Transcript)</li>
                        <li>✓ شهادة الثانوية العامة (البكالوريا)</li>
                        <li>✓ ترجمة محلفة لكل الوثائق</li>
                        <li>✓ نسخة عن الإقامة الألمانية</li>
                        <li>✓ السيرة الذاتية بالألمانية أو الإنجليزية</li>
                        <li>✓ صورة شخصية حديثة</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">روابط ومصادر رسمية</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 space-y-3 text-white/70">
                    <p>
                        <span className="text-white">قاعدة بيانات anabin: </span>
                        <a href="https://anabin.kmk.org" target="_blank" className="text-[#c9a84c] hover:underline">anabin.kmk.org →</a>
                    </p>
                    <p>
                        <span className="text-white">المكتب المركزي ZAB: </span>
                        <a href="https://www.kmk.org/zab" target="_blank" className="text-[#c9a84c] hover:underline">kmk.org/zab →</a>
                    </p>
                    <p>
                        <span className="text-white">الاعتراف الرسمي بالشهادات: </span>
                        <a href="https://www.anerkennung-in-deutschland.de" target="_blank" className="text-[#c9a84c] hover:underline">anerkennung-in-deutschland.de →</a>
                    </p>
                    <p>
                        <span className="text-white">دليل الشهادات السورية: </span>
                        <a href="https://anabin.net/syria-gov" target="_blank" className="text-[#c9a84c] hover:underline">anabin.net/syria-gov →</a>
                    </p>
                    <p>
                        <span className="text-white">دليل ألمانيا للاعتراف: </span>
                        <a href="https://handbookgermany.de/ar/recognition" target="_blank" className="text-[#c9a84c] hover:underline">handbookgermany.de →</a>
                    </p>
                </div>

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-4">
                    <p className="text-[#c9a84c] font-bold mb-2">💡 نصيحة ذهبية</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        ابحث عن جامعتك في anabin أولاً قبل أي خطوة — توفر عليك أشهراً من الانتظار إذا كانت H+ معترف بها.
                    </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <p className="text-red-400 font-bold mb-2">⚠️ تنبيه قانوني</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        هذه المعلومات للإرشاد فقط — قواعد الاعتراف تختلف بين الولايات الألمانية. تحقق من المكتب المختص في ولايتك قبل تقديم الطلب.
                    </p>
                </div>

            </section>

        </main>
    );
}