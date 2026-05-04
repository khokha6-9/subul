export default function Return() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="text-white/50 text-sm hover:text-white">← ألمانيا</a>
            </header>

            <section className="max-w-2xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">✈️</div>
                <h1 className="text-3xl font-bold mb-2">العودة إلى سوريا</h1>
                <p className="text-white/50 mb-8">ما تحتاج معرفته قبل العودة من ألمانيا</p>

                <div className="grid gap-4">
                    {[
                        { step: "1", title: "احفظ إقامتك أولاً", desc: "إذا كنت تحمل إقامة دائمة لا تتركها — يمكنك السفر والعودة بحرية لمدة سنة" },
                        { step: "2", title: "برنامج REAG/GARP", desc: "تدفع لك ألمانيا تكاليف السفر + 200-3500 يورو مساعدة بدء — راجع IOM" },
                        { step: "3", title: "وثائقك السورية", desc: "تأكد من صلاحية جوازك السوري وأوراق ملكية بيتك وأرضك في سوريا" },
                        { step: "4", title: "أموالك ومدخراتك", desc: "حوّل أموالك تدريجياً عبر قنوات قانونية — احذر من الكميات الكبيرة دفعة واحدة" },
                        { step: "5", title: "الرعاية الصحية", desc: "احتفظ بسجلاتك الطبية وأدويتك لفترة كافية — الخدمات في سوريا محدودة" },
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
                    <p className="text-[#c9a84c] font-bold mb-2">⚠️ قرار مصيري</p>
                    <p className="text-white/60 text-sm">العودة قرار صعب — استشر عائلتك ومنظمات اللاجئين قبل اتخاذ خطوة نهائية</p>
                </div>

            </section>

        </main>
    );
}