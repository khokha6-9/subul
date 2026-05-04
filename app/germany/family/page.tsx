export default function Family() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="text-white/50 text-sm hover:text-white">← ألمانيا</a>
            </header>

            <section className="max-w-2xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">👨‍👩‍👧</div>
                <h1 className="text-3xl font-bold mb-2">لمّ شمل الأسرة</h1>
                <p className="text-white/50 mb-8">إحضار عائلتك إلى ألمانيا — خطوة بخطوة</p>

                <div className="grid gap-4">
                    {[
                        { step: "1", title: "تحقق من شروط اللم", desc: "يجب أن يكون لديك إقامة دائمة أو حماية لاجئ معترف بها في ألمانيا" },
                        { step: "2", title: "جهّز الوثائق", desc: "وثيقة الزواج، شهادات ميلاد الأولاد، إثبات الدخل والسكن، تأمين صحي" },
                        { step: "3", title: "تقديم الطلب", desc: "تقدم العائلة طلب فيزا لمّ الشمل في أقرب سفارة ألمانية في بلدهم" },
                        { step: "4", title: "المقابلة", desc: "العائلة تحضر مقابلة في السفارة وتقدم الوثائق الأصلية" },
                        { step: "5", title: "الموافقة والسفر", desc: "بعد الموافقة (3-12 شهر) يحصلون على فيزا للسفر إلى ألمانيا" },
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
                    <p className="text-white/60 text-sm">القوانين تتغير باستمرار — تحقق دائماً من السفارة الألمانية أو محامي مختص قبل البدء</p>
                </div>

            </section>

        </main>
    );
}