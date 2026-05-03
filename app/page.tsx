export default function Germany() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            {/* Header */}
            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <span className="text-white/50 text-sm">🇩🇪 ألمانيا</span>
            </header>

            {/* Hero */}
            <section className="text-center py-16 px-4">
                <div className="text-6xl mb-4">🇩🇪</div>
                <h1 className="text-4xl font-bold mb-4">دليل السوري في ألمانيا</h1>
                <p className="text-white/60 max-w-xl mx-auto">
                    كل الوثائق التي تحتاجها — خطوة بخطوة، بالعامية السورية
                </p>
            </section>

            {/* Topics */}
            <section className="px-8 py-10 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">اختر موضوعك</h2>
                <div className="grid gap-4">
                    {[
                        { icon: "📘", title: "تجديد جواز السفر السوري", desc: "كيف تجدد جوازك من ألمانيا" },
                        { icon: "👨‍👩‍👧", title: "لمّ شمل الأسرة", desc: "إحضار عائلتك إلى ألمانيا" },
                        { icon: "🎓", title: "الاعتراف بالشهادات", desc: "توثيق شهادتك الجامعية" },
                        { icon: "🏠", title: "الجنسية الألمانية", desc: "شروط وخطوات التجنيس" },
                        { icon: "✈️", title: "العودة إلى سوريا", desc: "ما تحتاج معرفته قبل العودة" },
                    ].map((item) => (
                        <div key={item.title}
                            className="flex items-center gap-4 bg-white/5 border border-white/10 
              rounded-xl p-5 hover:border-[#c9a84c] cursor-pointer transition-all">
                            <span className="text-3xl">{item.icon}</span>
                            <div>
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-white/50 text-sm">{item.desc}</p>
                            </div>
                            <span className="mr-auto text-[#c9a84c]">←</span>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
}