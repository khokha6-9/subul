export default function Home() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <h1 className="text-2xl font-bold text-[#c9a84c]">سُبُل</h1>
                <a href="/chat" className="bg-[#c9a84c] text-black px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">
                    🤖 المساعد الذكي
                </a>
                \
            </header>

            <section className="text-center py-24 px-4">
                <h2 className="text-5xl font-bold mb-6 leading-tight">
                    طريقك لكل وثيقة<br />
                    <span className="text-[#c9a84c]">في أي بلد كنت</span>
                </h2>
                <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                    دليلك الذكي للحصول على وثائقك الرسمية — بالعامية السورية، خطوة بخطوة.
                </p>
            </section>

            <section className="px-8 py-16">
                <h3 className="text-2xl font-bold text-center mb-10">اختر بلدك</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <a href="/germany" className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-[#c9a84c] cursor-pointer">
                        🇩🇪 ألمانيا
                    </a>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center opacity-50">
                        🇹🇷 تركيا
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center opacity-50">
                        🇱🇧 لبنان
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center opacity-50">
                        🇯🇴 الأردن
                    </div>
                </div>
            </section>

        </main >
    );
}