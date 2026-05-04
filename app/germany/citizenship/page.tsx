export default function Citizenship() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="text-white/50 text-sm hover:text-white">← ألمانيا</a>
            </header>

            <section className="max-w-2xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">🏠</div>
                <h1 className="text-3xl font-bold mb-2">الجنسية الألمانية</h1>
                <p className="text-white/50 mb-8">شروط وخطوات التجنيس بعد قانون 2024 الجديد</p>

                <div className="grid gap-4">
                    {[
                        { step: "1", title: "مدة الإقامة", desc: "5 سنوات إقامة قانونية في ألمانيا (3 سنوات في حالات الاندماج المتميز)" },
                        { step: "2", title: "إثبات اللغة", desc: "شهادة لغة ألمانية مستوى B1 على الأقل من معهد معتمد" },
                        { step: "3", title: "الاستقلال المالي", desc: "إثبات أنك تعيل نفسك وعائلتك بدون مساعدات اجتماعية (Bürgergeld)" },
                        { step: "4", title: "اختبار الجنسية", desc: "اجتياز Einbürgerungstest عن الثقافة والقانون الألماني (33 سؤال)" },
                        { step: "5", title: "تقديم الطلب", desc: "قدم طلبك في مكتب التجنيس Einbürgerungsbehörde في مدينتك مع الوثائق" },
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">{item.title}</h3>
                                <p className="text-white/50 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5">
                    <p className="text-[#c9a84c] font-bold mb-2">🆕 جديد 2024</p>
                    <p className="text-white/60 text-sm">يمكنك الآن الاحتفاظ بجنسيتك السورية مع الجنسية الألمانية — الازدواجية مسموحة</p>
                </div>

            </section>

        </main>
    );
}