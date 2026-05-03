export default function Passport() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="text-white/50 text-sm hover:text-white">← ألمانيا</a>
            </header>

            <section className="max-w-2xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">📘</div>
                <h1 className="text-3xl font-bold mb-2">تجديد جواز السفر السوري</h1>
                <p className="text-white/50 mb-8">من ألمانيا — خطوة بخطوة</p>

                <div className="grid gap-4">
                    {[
                        { step: "1", title: "احجز موعد", desc: "اذهب لموقع السفارة السورية في برلين واحجز موعداً أونلاين على syrian-embassy.de" },
                        { step: "2", title: "جهّز الأوراق", desc: "جواز سفرك القديم، صورتان شخصيتان، إقامتك الألمانية، رسوم التجديد 100 يورو" },
                        { step: "3", title: "احضر الموعد", desc: "اذهب للسفارة في الموعد المحدد مع كل الأوراق الأصلية" },
                        { step: "4", title: "استلم جوازك", desc: "يستغرق التجديد 4-8 أسابيع، ستُعلَم عبر البريد الإلكتروني" },
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
                    <p className="text-[#c9a84c] font-bold mb-2">⚠️ ملاحظة مهمة</p>
                    <p className="text-white/60 text-sm">هذه المعلومات للإرشاد فقط — تحقق دائماً من الموقع الرسمي للسفارة قبل الذهاب</p>
                </div>

            </section>

        </main>
    );
}