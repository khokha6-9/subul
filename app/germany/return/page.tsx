export default function Return() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20">→ رجوع لألمانيا</a>
            </header>

            <section className="max-w-3xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">✈️</div>
                <h1 className="text-3xl font-bold mb-2">العودة إلى سوريا من ألمانيا</h1>
                <p className="text-white/50 mb-2">آخر تحديث: مايو 2026</p>
                <p className="text-white/70 mb-8 leading-relaxed">
                    بعد سقوط النظام في ديسمبر 2024، فتح باب العودة الطوعية للسوريين. هذا الدليل الشامل يجيب على كل أسئلتك القانونية والعملية.
                </p>

                <div className="bg-white/5 border border-[#c9a84c]/40 rounded-xl p-5 mb-10">
                    <p className="text-[#c9a84c] font-bold mb-2">📌 ملاحظة مهمة</p>
                    <p className="text-white/80 text-sm leading-relaxed">
                        كل الروابط الرسمية والمصادر التفصيلية موجودة في أسفل الصفحة — لا تتردد بالعودة إليها للتحقق من أحدث المعلومات.
                    </p>
                </div>

                <div className="bg-white/5 border border-green-500/30 rounded-xl p-5 mb-10">
                    <p className="text-green-400 font-bold mb-2">📊 إحصائيات العودة</p>
                    <p className="text-white/80 text-sm leading-relaxed mb-2">
                        منذ نوفمبر 2024 وحتى مايو 2026، عاد أكثر من <span className="text-white font-bold">1.3 مليون سوري</span> طوعاً من دول اللجوء حول العالم.
                    </p>
                    <p className="text-white/60 text-sm">
                        من ألمانيا تحديداً، استفاد 464 سورياً من برنامج العودة الاتحادي بين ديسمبر 2024 وأبريل 2025، والعدد في تزايد.
                    </p>
                </div>

                {/* ───────── قبل القرار ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">قبل اتخاذ قرار العودة</h2>
                <p className="text-white/60 text-sm mb-6">
                    العودة قرار مصيري — يجب التفكير فيه بهدوء بعيداً عن العاطفة. إليك الحقائق التي يجب معرفتها أولاً.
                </p>

                <div className="grid gap-4 mb-10">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-yellow-400">🏚️ الواقع الميداني في سوريا</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            يوجد 1.3 مليون نازح داخلي يعيشون في الخيام حتى الآن. البنية التحتية مدمرة جزئياً، المدارس قليلة في الأرياف، الكهرباء متقطعة، والاقتصاد ضعيف. وزير الخارجية الألماني وصف الوضع: &quot;في مناطق كثيرة لا يوجد حجر على حجر&quot;.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-yellow-400">🏠 وضع منزلك وممتلكاتك</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            تحقق قبل العودة من حالة منزلك الفعلية عبر أقارب موثوقين. كثير من المنازل مدمرة، مهدومة جزئياً، أو يسكنها آخرون. الوثائق العقارية الأصلية ضرورية لاستعادة الملكية.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-yellow-400">💼 ما ستتركه في ألمانيا</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            العمل، التأمين الصحي، المدارس للأطفال، الاستقرار. حالياً 200,000 طفل سوري يدرسون في المدارس الألمانية و50,000 شاب في برامج تدريب مهني. التخلي عن كل هذا قرار صعب.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-yellow-400">🛡️ خيار العودة المؤقتة</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            إذا كنت تحمل إقامة دائمة (Niederlassungserlaubnis) يمكنك السفر لسوريا والعودة لألمانيا خلال سنة دون فقدان إقامتك. هذا يسمح بزيارة استكشافية قبل القرار النهائي.
                        </p>
                    </div>
                </div>

                {/* ───────── البرامج المالية ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">برامج الدعم المالي للعودة</h2>
                <p className="text-white/60 text-sm mb-6">
                    الحكومة الألمانية تدفع مساعدات مالية كبيرة للعائدين طوعاً. إليك التفاصيل الكاملة.
                </p>

                <div className="grid gap-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 text-white">🥇 برنامج REAG/GARP — الأهم والأشهر</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">
                            البرنامج الرسمي الذي تنفذه IOM (المنظمة الدولية للهجرة) بالتعاون مع BAMF. يوفر دعماً شاملاً للعودة الطوعية.
                        </p>

                        <div className="space-y-2 text-sm">
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">تذاكر السفر</p>
                                <p className="text-white">مغطاة بالكامل (طائرة/حافلة/قطار)</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">بدل سفر للبالغ</p>
                                <p className="text-white">200 يورو</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">بدل سفر للأطفال (تحت 12)</p>
                                <p className="text-white">100 يورو</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">منحة بدء حياة للبالغ (StarthilfePlus)</p>
                                <p className="text-white">1,000 يورو</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">منحة بدء حياة للطفل</p>
                                <p className="text-white">500 يورو</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">دعم صحي (للحالات الخاصة)</p>
                                <p className="text-white">حتى 2,000 يورو</p>
                            </div>
                        </div>

                        <div className="mt-4 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-lg p-3">
                            <p className="text-[#c9a84c] font-bold text-sm mb-1">مثال عملي</p>
                            <p className="text-white/80 text-sm">
                                عائلة من والدين وطفلين تحصل على ما يصل إلى <span className="font-bold">4,000 يورو</span> + تذاكر السفر مجانية.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 text-white">🥈 البرنامج الأوروبي EURP — لإعادة الإدماج</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-3">
                            يبدأ بعد وصولك سوريا. يدعمك على المدى الطويل لإعادة بناء حياتك.
                        </p>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>💰 دعم مالي إضافي بعد الوصول</li>
                            <li>🏪 تمويل لمشاريع صغيرة (محل، تجارة بسيطة)</li>
                            <li>🎓 تدريب مهني للحصول على عمل</li>
                            <li>📚 استشارات لإعادة التأهيل</li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 text-white">🥉 برنامج NRP SYR — مخصص للسوريين</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-3">
                            برنامج خاص بالعائدين السوريين تحديداً. يركز على المساعدة الإنسانية والاستقرار.
                        </p>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>💵 دعم مالي خاص للمحتاجين</li>
                            <li>🏠 مساعدة في إيجاد سكن مؤقت</li>
                            <li>🤝 دعم اجتماعي للاندماج المحلي</li>
                            <li>🏥 إحالة لخدمات صحية</li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 text-white">📋 برنامج StartHope@Home — التحضير</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-3">
                            برنامج استشارات قبل العودة لمساعدتك على اتخاذ قرار صحيح.
                        </p>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>🗣️ استشارات شخصية مع خبراء</li>
                            <li>📊 معلومات محدثة عن سوريا</li>
                            <li>📝 خطط إعادة اندماج فردية</li>
                            <li>🔗 ربط بشبكات دعم محلية</li>
                        </ul>
                    </div>
                </div>

                {/* ───────── الخطوات بالترتيب ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">الخطوات بالترتيب</h2>
                <p className="text-white/60 text-sm mb-6">
                    من قرار العودة حتى الوصول لسوريا — كل ما تحتاج فعله بالترتيب.
                </p>

                <div className="grid gap-4 mb-10">
                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">1</div>
                            <h3 className="font-bold text-lg">احجز موعد في مركز استشارات العودة</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            لا يمكن تقديم طلب REAG/GARP إلا عبر مركز استشارات معتمد. هذه المراكز موجودة في كل ولاية وخدماتها مجانية تماماً. يمكنك الاتصال بالصليب الأحمر الألماني (DRK) أو Caritas للحصول على أقرب مركز.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">2</div>
                            <h3 className="font-bold text-lg">جلسة استشارة (مجانية وغير ملزمة)</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            يقابلك مستشار يشرح لك كل البرامج المتاحة، الحقوق، الواجبات، وما ستحصل عليه. هذه الجلسة لا تلزمك بأي شيء — يمكنك التراجع في أي وقت.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">3</div>
                            <h3 className="font-bold text-lg">قدم طلب REAG/GARP</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            يقدم الطلب رقمياً عبر المركز المعتمد. تجهز الوثائق المطلوبة: جواز سفر سوري ساري، وثيقة سفر بديلة، أو إقرار من السفارة السورية. ملاحظة: نسخة من الوثائق غير كافية — يجب الأصلية.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">4</div>
                            <h3 className="font-bold text-lg">التخلي عن إقامتك الألمانية</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            للحصول على المنحة، يجب التخلي رسمياً عن تصريح الإقامة. هذا قرار نهائي — لا يمكن العودة لألمانيا إلا بفيزا جديدة. (الاستثناء: حاملي الإقامة الدائمة يمكنهم الإحتفاظ بها لسنة).
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">5</div>
                            <h3 className="font-bold text-lg">إنهاء الالتزامات في ألمانيا</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            ألغ الإيجار، التأمين الصحي، الإنترنت، الكهرباء. أنهِ عقد عملك بشكل قانوني. أبلغ المدارس بانتقال الأطفال. سجّل خروجك من Bürgeramt (Abmeldung) — هذه خطوة قانونية ضرورية.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">6</div>
                            <h3 className="font-bold text-lg">السفر إلى سوريا</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            IOM تنظم السفر بالكامل. ستصلك تذاكر الطائرة والترتيبات اللوجستية. عادة الرحلات تكون عبر بيروت أو عمّان ثم براً للحدود السورية، أو مباشرة لمطار دمشق إذا كان متاحاً.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">7</div>
                            <h3 className="font-bold text-lg">الوصول إلى سوريا والاستقبال</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            عند الوصول، تستلم منحة بدء الحياة. شركاء IOM في سوريا يساعدونك خلال الأسابيع الأولى. تتواصل مع برنامج إعادة الإدماج للحصول على دعم إضافي حسب احتياجاتك.
                        </p>
                    </div>
                </div>

                {/* ───────── الوثائق المطلوبة ───────── */}

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">الوثائق التي يجب تجهيزها</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-2 text-white/70 text-sm">
                        <li>✓ جواز سفر سوري ساري (أو وثيقة سفر بديلة من السفارة السورية)</li>
                        <li>✓ بطاقة الهوية السورية</li>
                        <li>✓ إخراج قيد عائلي حديث</li>
                        <li>✓ شهادات ميلاد الأطفال</li>
                        <li>✓ شهادة الزواج</li>
                        <li>✓ وثائق ملكية البيوت والأراضي في سوريا</li>
                        <li>✓ شهادات الأطفال المدرسية الألمانية (مترجمة)</li>
                        <li>✓ السجلات الطبية والوصفات الدوائية</li>
                        <li>✓ شهادات العمل والخبرة من ألمانيا</li>
                        <li>✓ كل ما يثبت الممتلكات والحسابات البنكية</li>
                    </ul>
                </div>

                {/* ───────── نصائح عملية ───────── */}

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">نصائح عملية للعودة</h2>
                <div className="grid gap-4 mb-10">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">💰 المال والمدخرات</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            حوّل أموالك تدريجياً عبر قنوات قانونية (Wise، Western Union، Sham Cash). لا تحمل مبالغ كبيرة نقداً عند العبور — قد تصادر. احتفظ بحساب بنكي ألماني نشط لفترة بعد العودة.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">🏥 الرعاية الصحية</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            احتفظ بسجلاتك الطبية الكاملة ومخزون أدويتك لـ 3-6 أشهر. الخدمات الطبية في سوريا محدودة، خاصة للأمراض المزمنة. اشتر أدويتك من ألمانيا قبل السفر.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">📚 تعليم الأطفال</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            جهّز شهادات أطفالك المدرسية مترجمة ومصدّقة. وزارة التربية السورية أصدرت في سبتمبر 2025 تعليمات لتسهيل التسجيل المدرسي للعائدين. قد يحتاج طفلك دعم تقوية في العربية.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">📱 التواصل والإنترنت</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            الإنترنت في سوريا أبطأ وأغلى. احتفظ بأرقام مهمة مكتوبة على ورق احتياطاً. اشترك في خدمة VPN قبل السفر إذا كنت تحتاج بعض التطبيقات.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2">⚠️ احذر المعلومات الخاطئة</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            مواقع التواصل مليئة بالشائعات حول العودة — منها ما يبالغ في التشاؤم ومنها ما يبالغ في التفاؤل. اعتمد فقط على المصادر الرسمية (IOM، UNHCR، BAMF) وشهادات أقاربك المباشرين.
                        </p>
                    </div>
                </div>

                {/* ───────── روابط رسمية ───────── */}

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">روابط ومصادر رسمية</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 space-y-3 text-white/70 text-sm">
                    <p>
                        <span className="text-white">المنظمة الدولية للهجرة (IOM): </span>
                        <a href="https://returningfromgermany.de" target="_blank" className="text-[#c9a84c] hover:underline">returningfromgermany.de →</a>
                    </p>
                    <p>
                        <span className="text-white">المكتب الاتحادي للهجرة (BAMF): </span>
                        <a href="https://www.bamf.de" target="_blank" className="text-[#c9a84c] hover:underline">bamf.de →</a>
                    </p>
                    <p>
                        <span className="text-white">منصة &quot;سوريا هي الوطن&quot; (UNHCR): </span>
                        <a href="https://syriaishome.unhcr.org" target="_blank" className="text-[#c9a84c] hover:underline">syriaishome.unhcr.org →</a>
                    </p>
                    <p>
                        <span className="text-white">دليل ألمانيا للعودة الطوعية: </span>
                        <a href="https://handbookgermany.de/ar/voluntary-return" target="_blank" className="text-[#c9a84c] hover:underline">handbookgermany.de →</a>
                    </p>
                    <p>
                        <span className="text-white">الصليب الأحمر الألماني (استشارات): </span>
                        <a href="https://www.drk.de" target="_blank" className="text-[#c9a84c] hover:underline">drk.de →</a>
                    </p>
                    <p>
                        <span className="text-white">Caritas (استشارات): </span>
                        <a href="https://www.caritas.de" target="_blank" className="text-[#c9a84c] hover:underline">caritas.de →</a>
                    </p>
                    <p>
                        <span className="text-white">Pro Asyl (دعم قانوني للاجئين): </span>
                        <a href="https://www.proasyl.de" target="_blank" className="text-[#c9a84c] hover:underline">proasyl.de →</a>
                    </p>
                    <p>
                        <span className="text-white">إيميل استفسارات IOM: </span>
                        <a href="mailto:returnsfromgermany@iom.int" className="text-[#c9a84c] hover:underline">returnsfromgermany@iom.int →</a>
                    </p>
                </div>

                {/* ───────── التحذيرات ───────── */}

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-4">
                    <p className="text-[#c9a84c] font-bold mb-2">💡 نصائح ذهبية</p>
                    <ul className="text-white/70 text-sm leading-relaxed space-y-2">
                        <li>• فكّر بالعودة الاستكشافية أولاً (إن كنت تحمل إقامة دائمة) قبل القرار النهائي.</li>
                        <li>• اطلب من أقاربك صور حقيقية لمنزلك قبل أن تقرر — الوضع قد يختلف عن المتوقع.</li>
                        <li>• ادّخر على الأقل 3 أشهر مصاريف بالإضافة لمنحة الـ 1,000 يورو.</li>
                        <li>• حافظ على علاقاتك في ألمانيا — قد تحتاج التواصل لاحقاً (شهادات، توصيات).</li>
                        <li>• استشر عائلتك بصراحة — العودة قرار جماعي وليس فردي.</li>
                    </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-4">
                    <p className="text-yellow-400 font-bold mb-2">⚠️ تحذيرات مهمة</p>
                    <ul className="text-white/70 text-sm leading-relaxed space-y-2">
                        <li>• التخلي عن الإقامة الألمانية قرار شبه نهائي — لا تستعجل.</li>
                        <li>• إذا كنت لاجئاً معترفاً به، الذهاب للسفارة السورية قبل العودة قد يلغي وضعك.</li>
                        <li>• الحالة الأمنية في بعض المناطق السورية لا تزال غير مستقرة — تحقق قبل الذهاب.</li>
                        <li>• المساعدات المالية لا تكفي لإعادة بناء حياة كاملة — يجب أن يكون لديك خطة بديلة.</li>
                        <li>• الأطفال المولودون في ألمانيا قد يفقدون بعض الحقوق إذا غادرتم نهائياً.</li>
                    </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <p className="text-red-400 font-bold mb-2">⚠️ تنبيه قانوني</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        هذه المعلومات للإرشاد فقط — قرار العودة له تبعات قانونية مهمة. استشر دائماً مركز استشارات معتمد أو محامي مختص قبل اتخاذ خطوات نهائية.
                    </p>
                </div>

            </section>

        </main>
    );
}