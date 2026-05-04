export default function Education() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="text-white/50 text-sm hover:text-white">← ألمانيا</a>
            </header>

            <section className="max-w-2xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">🎓</div>
                <h1 className="text-3xl font-bold mb-2">الاعتراف بالشهادات</h1>
                <p className="text-white/50 mb-8">توثيق شهادتك السورية في ألمانيا</p>

                <div className="grid gap-4">
                    {[
                        { step: "1", title: "حدد نوع شهادتك", desc: "جامعية، مهنية، ثانوية — كل نوع له جهة اعتراف مختلفة في ألمانيا" },
                        { step: "2", title: "تواصل مع ZAB", desc: "المكتب المركزي للتعليم الأجنبي يقيّم شهادتك الجامعية — kmk.org/zab" },
                        { step: "3", title: "ترجمة الوثائق", desc: "ترجم شهاداتك وكشف العلامات لدى مترجم محلف معتمد في ألمانيا" },
                        { step: "4", title: "تقديم الطلب", desc: "ادفع الرسوم (200 يورو تقريباً) وانتظر النتيجة 3-4 أشهر" },
                        { step: "5", title: "استلم الاعتراف", desc: "ستحصل على وثيقة Zeugnisbewertung تثبت معادلة شهادتك" },
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
                    <p className="text-[#c9a84c] font-bold mb-2">💡 نصيحة</p>
                    <p className="text-white/60 text-sm">للمهن الطبية والهندسية يوجد مسار خاص — استشر غرفة المهندسين أو الأطباء في ولايتك</p>
                </div>

            </section>

        </main>
    );
}