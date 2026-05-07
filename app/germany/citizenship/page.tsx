"use client";

import { ProtectedPage } from "@/lib/ProtectedPage";
function CitizenshipContent() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <a href="/germany" className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20">→ رجوع لألمانيا</a>
            </header>

            <section className="max-w-3xl mx-auto px-8 py-12">

                <div className="text-5xl mb-4">🏠</div>
                <h1 className="text-3xl font-bold mb-2">الجنسية الألمانية للسوريين</h1>
                <p className="text-white/50 mb-2">آخر تحديث: مايو 2026</p>
                <p className="text-white/70 mb-8 leading-relaxed">
                    دليل شامل لكل ما تحتاج معرفته عن التجنيس في ألمانيا — الشروط، الخطوات، الاختبارات، الرسوم، والمدة الزمنية لكل مرحلة.
                </p>

                <div className="bg-white/5 border border-[#c9a84c]/40 rounded-xl p-5 mb-10">
                    <p className="text-[#c9a84c] font-bold mb-2">📊 السوريون في الصدارة عالمياً</p>
                    <p className="text-white/80 text-sm leading-relaxed mb-2">
                        في 2024 منحت ألمانيا الجنسية لـ <span className="text-white font-bold">291,955</span> شخص، السوريون احتلوا المركز الأول بـ <span className="text-white font-bold">75,000+</span> متجنس — أي أكثر من ثلث الإجمالي.
                    </p>
                    <p className="text-white/60 text-sm">
                        هذا يعني أن الفرصة حقيقية ومتاحة، والكثير من السوريين الذين وصلوا في 2015-2016 أصبحوا الآن مواطنين ألمان.
                    </p>
                </div>

                {/* ───────── التغييرات الجديدة ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">قانون 2024 الجديد — ما الذي تغيّر؟</h2>
                <p className="text-white/60 text-sm mb-6">
                    قانون StaRModG دخل حيز التنفيذ في 27 يونيو 2024 وأحدث ثورة حقيقية في شروط التجنيس.
                </p>

                <div className="grid gap-4 mb-10">
                    <div className="bg-white/5 border border-green-500/30 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-green-400">✅ تخفيض المدة من 8 إلى 5 سنوات</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-2">
                            قبل القانون الجديد كنت تحتاج 8 سنوات إقامة قانونية. الآن 5 سنوات فقط كافية. هذا يعني أن السوريين الذين وصلوا في 2019 وما قبل أصبحوا مؤهلين للتقديم اليوم.
                        </p>
                        <p className="text-white/50 text-xs">
                            ملاحظة: فترة طلب اللجوء (الـ Aufenthaltsgestattung) تُحسب ضمن الـ 5 سنوات إذا تم قبول لجوئك لاحقاً.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-green-500/30 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-green-400">✅ ازدواج الجنسية مسموح للجميع</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-2">
                            قبل القانون: كان عليك التنازل عن جنسيتك الأصلية. الآن: تحتفظ بجنسيتك السورية مع الجنسية الألمانية بدون أي إجراءات إضافية.
                        </p>
                        <p className="text-white/50 text-xs">
                            ميزة خاصة للسوريين: الدستور السوري يمنع التنازل عن الجنسية أصلاً، لذا هذا التعديل أزال عقبة كبيرة.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-green-500/30 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-green-400">✅ 3 سنوات لحالات الاندماج المتميز</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-2">
                            يمكنك الحصول على الجنسية بعد 3 سنوات فقط إذا حققت إنجازات اندماج خاصة:
                        </p>
                        <ul className="text-white/60 text-xs space-y-1 mr-4">
                            <li>• مستوى لغة C1 بدلاً من B1</li>
                            <li>• إنجاز مهني متميز (ترقية، شهادة تخصصية)</li>
                            <li>• إنجاز دراسي متفوق (تخرج بدرجة عالية)</li>
                            <li>• عمل تطوعي موثّق (في جمعيات، نوادي)</li>
                            <li>• استقلال مالي تام بدون أي مساعدات</li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-green-500/30 rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-2 text-green-400">✅ جنسية تلقائية للأطفال المولودين في ألمانيا</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            إذا ولد طفلك في ألمانيا وكان أحد الوالدين مقيماً فيها 5 سنوات على الأقل، يحصل الطفل على الجنسية الألمانية تلقائياً عند الولادة، بالإضافة لجنسيته السورية.
                        </p>
                    </div>
                </div>

                {/* ───────── الشروط الكاملة ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">الشروط الكاملة للتجنيس</h2>
                <p className="text-white/60 text-sm mb-6">
                    يجب استيفاء كل هذه الشروط بدون استثناء — أي شرط ناقص يؤدي لرفض الطلب.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-4 text-white/70">
                        <li>
                            <span className="text-white font-bold">1. مدة الإقامة:</span> 5 سنوات إقامة قانونية متصلة (أو 3 سنوات لحالات الاندماج المتميز).
                        </li>
                        <li>
                            <span className="text-white font-bold">2. الإقامة الحالية:</span> يجب أن تكون لديك إقامة قانونية حالياً (Aufenthaltserlaubnis أو Niederlassungserlaubnis). الـ Duldung لا تكفي.
                        </li>
                        <li>
                            <span className="text-white font-bold">3. اللغة الألمانية:</span> شهادة B1 على الأقل من معهد معتمد (Goethe، TELC، ÖSD).
                        </li>
                        <li>
                            <span className="text-white font-bold">4. اختبار الجنسية:</span> اجتياز Einbürgerungstest بـ 17 إجابة صحيحة من 33.
                        </li>
                        <li>
                            <span className="text-white font-bold">5. الاستقلال المالي:</span> دخل ثابت يكفي لإعالتك وعائلتك بدون أي مساعدات (Bürgergeld، Sozialhilfe).
                        </li>
                        <li>
                            <span className="text-white font-bold">6. السكن المناسب:</span> سكن لائق بمساحة كافية لك ولعائلتك.
                        </li>
                        <li>
                            <span className="text-white font-bold">7. السجل العدلي:</span> سجل نظيف بدون عقوبات جنائية. المخالفات البسيطة لا تمنع، لكن الجرائم الجدية ترفض الطلب.
                        </li>
                        <li>
                            <span className="text-white font-bold">8. الالتزام بالدستور:</span> توقيع إقرار بالولاء للدستور الألماني والقيم الديمقراطية.
                        </li>
                    </ul>
                </div>

                {/* ───────── شهادة B1 ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">شهادة اللغة B1 — كل ما تحتاج معرفته</h2>
                <p className="text-white/60 text-sm mb-6">
                    شرط أساسي للتجنيس. إليك التفاصيل الكاملة عن الاختبار وأين تحصل عليه.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3 text-white">ما هو اختبار B1؟</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                        اختبار يثبت قدرتك على استخدام اللغة الألمانية في الحياة اليومية. يقيس 4 مهارات: القراءة، الكتابة، الاستماع، المحادثة.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs mb-1">المدة</p>
                            <p className="text-white">حوالي 3 ساعات</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs mb-1">السعر</p>
                            <p className="text-white">100-200 يورو</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs mb-1">صلاحية الشهادة</p>
                            <p className="text-white">مدى الحياة</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs mb-1">النتيجة</p>
                            <p className="text-white">خلال 4-6 أسابيع</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3 text-white">المعاهد المعتمدة</h3>
                    <ul className="space-y-3 text-white/70 text-sm">
                        <li>
                            <span className="text-white font-bold">معهد غوته (Goethe-Institut):</span> الأشهر والأكثر اعتراف. موجود في كل المدن الكبرى.
                            {' '}<a href="https://www.goethe.de/ins/de/de" target="_blank" className="text-[#c9a84c] hover:underline">اطلع →</a>
                        </li>
                        <li>
                            <span className="text-white font-bold">TELC:</span> أرخص قليلاً، معترف به في كل مكان.
                            {' '}<a href="https://www.telc.net" target="_blank" className="text-[#c9a84c] hover:underline">اطلع →</a>
                        </li>
                        <li>
                            <span className="text-white font-bold">ÖSD:</span> اختبار نمساوي معترف به في ألمانيا.
                            {' '}<a href="https://www.osd.at" target="_blank" className="text-[#c9a84c] hover:underline">اطلع →</a>
                        </li>
                        <li>
                            <span className="text-white font-bold">DTZ (Deutsch-Test für Zuwanderer):</span> مجاني إذا حضرت دورة اندماج، مخصص للمهاجرين.
                        </li>
                    </ul>
                </div>

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-10">
                    <p className="text-[#c9a84c] font-bold mb-2">💡 نصيحة عملية</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        احجز موعد الاختبار قبل شهرين على الأقل — المواعيد تنفد بسرعة في المدن الكبرى. سجل قبل 16 يوم على الأقل من تاريخ الاختبار.
                    </p>
                </div>

                {/* ───────── اختبار الجنسية ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">اختبار الجنسية (Einbürgerungstest) — التفاصيل الكاملة</h2>
                <p className="text-white/60 text-sm mb-6">
                    الاختبار الذي يقيس معرفتك بالنظام السياسي والقانوني الألماني.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3 text-white">معلومات الاختبار</h3>
                    <ul className="space-y-3 text-white/70 text-sm">
                        <li>📝 <span className="text-white">عدد الأسئلة:</span> 33 سؤال</li>
                        <li>📚 <span className="text-white">بنك الأسئلة الكامل:</span> 310 سؤال (300 عام + 10 خاصة بولايتك)</li>
                        <li>✅ <span className="text-white">للنجاح:</span> 17 إجابة صحيحة من 33 (50%)</li>
                        <li>⏱️ <span className="text-white">المدة:</span> 60 دقيقة (كافية جداً)</li>
                        <li>🔤 <span className="text-white">نوع الأسئلة:</span> اختيار من متعدد (4 خيارات، إجابة واحدة)</li>
                        <li>💶 <span className="text-white">التكلفة:</span> 25 يورو لكل محاولة</li>
                        <li>🔁 <span className="text-white">إعادة الاختبار:</span> غير محدودة (لكن كل مرة 25 يورو)</li>
                        <li>🌍 <span className="text-white">اللغة:</span> ألمانية فقط (لذلك تحتاج B1 أولاً)</li>
                        <li>📜 <span className="text-white">صلاحية الشهادة:</span> مدى الحياة</li>
                    </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3 text-white">من معفى من الاختبار؟</h3>
                    <ul className="space-y-2 text-white/70 text-sm">
                        <li>• الأطفال تحت 16 سنة</li>
                        <li>• كبار السن الذين لديهم سبب صحي موثق</li>
                        <li>• ذوي الإعاقة بشهادة طبية</li>
                        <li>• حاملو شهادة مدرسية ألمانية رسمية (Schulabschluss)</li>
                    </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3 text-white">كيف تحضّر للاختبار؟</h3>
                    <ul className="space-y-3 text-white/70 text-sm">
                        <li>
                            1. ادخل موقع التحضير الرسمي للـ BAMF — حل الـ 310 أسئلة تفاعلياً.
                            {' '}<a href="https://oet.bamf.de" target="_blank" className="text-[#c9a84c] hover:underline">oet.bamf.de →</a>
                        </li>
                        <li>
                            2. حمّل بنك الأسئلة كاملاً PDF من الموقع الرسمي.
                        </li>
                        <li>
                            3. ركّز على الـ 10 أسئلة الخاصة بولايتك — كثيرون يهملونها وتسبب رسوبهم.
                        </li>
                        <li>
                            4. حل 5-10 اختبارات تجريبية كاملة بوقت محدد قبل الاختبار الفعلي.
                        </li>
                        <li>
                            5. افهم الأسئلة، لا تحفظها فقط — الصياغة قد تختلف قليلاً في الاختبار.
                        </li>
                    </ul>
                </div>

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-10">
                    <p className="text-[#c9a84c] font-bold mb-2">💡 الحقيقة المريحة</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        نسبة النجاح في اختبار الجنسية الألمانية أكثر من 95% — لأن الأسئلة كلها معروفة مسبقاً ضمن بنك الـ 310 سؤال. يكفيك أسبوعان من المراجعة الجادة.
                    </p>
                </div>

                {/* ───────── الخطوات بالترتيب ───────── */}

                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">الخطوات الكاملة بالترتيب</h2>
                <p className="text-white/60 text-sm mb-6">
                    الرحلة من البداية للحصول على الجواز الأحمر — مع المدة الزمنية لكل مرحلة.
                </p>

                <div className="grid gap-4 mb-10">
                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">1</div>
                            <h3 className="font-bold text-lg">احصل على شهادة B1 (3-12 شهر)</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            ابدأ بدورة ألمانية إذا لم تكن وصلت B1 بعد. سجل في معهد معتمد وادرس بجدية. احجز موعد الاختبار مبكراً. التكلفة الإجمالية: 200-1500 يورو حسب عدد الدورات.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">2</div>
                            <h3 className="font-bold text-lg">حضّر واجتاز اختبار الجنسية (2-4 أسابيع)</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            ادخل oet.bamf.de وحل بنك الأسئلة كاملاً. سجل في أقرب مركز اختبار (مكاتب VHS أو مكتب الجنسية). 25 يورو رسوم. النتيجة بعد 4-6 أسابيع بالبريد.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">3</div>
                            <h3 className="font-bold text-lg">جهّز كل الوثائق (1-2 شهر)</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            جمع كل الوثائق المطلوبة (انظر القائمة أدناه). ترجم ما يحتاج ترجمة لدى مترجم محلف. صدّق ما يحتاج تصديق.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">4</div>
                            <h3 className="font-bold text-lg">قدّم الطلب في مكتب التجنيس (يوم واحد)</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            احجز موعد في Einbürgerungsbehörde في مدينتك. قدّم الملف كاملاً وادفع رسوم 255 يورو للبالغ (51 يورو لكل طفل).
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">5</div>
                            <h3 className="font-bold text-lg">انتظر المعالجة (6-24 شهر)</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            المكتب يدرس طلبك ويتحقق من كل الوثائق. قد يطلب وثائق إضافية أو مقابلة شخصية. المدة تختلف حسب الولاية والمدينة — برلين أبطأ من بافاريا مثلاً.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">6</div>
                            <h3 className="font-bold text-lg">ضمان التجنيس (Einbürgerungszusicherung)</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            عند قبول طلبك تحصل على وثيقة رسمية تضمن منحك الجنسية. هذه الوثيقة صالحة سنتين، خلالها تحضّر للحفل.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">7</div>
                            <h3 className="font-bold text-lg">حفل التجنيس وأداء القسم</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            تحضر حفل تسليم وثيقة التجنيس (Einbürgerungsurkunde) وتؤدي قسم الولاء للدستور الألماني. هذا اليوم رسمياً تصبح مواطناً ألمانياً.
                        </p>
                    </div>

                    <div className="card-hover bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-black font-bold flex items-center justify-center">8</div>
                            <h3 className="font-bold text-lg">اطلب جواز السفر الألماني</h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mr-13">
                            بعد الحفل، اذهب لـ Bürgeramt في مدينتك واطلب جواز السفر الألماني (60 يورو) وبطاقة الهوية (37 يورو). تستلمها خلال 4-6 أسابيع.
                        </p>
                    </div>
                </div>

                {/* ───────── الوثائق المطلوبة ───────── */}

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">قائمة الوثائق المطلوبة الكاملة</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-2 text-white/70 text-sm">
                        <li>✓ جواز سفر سوري ساري المفعول</li>
                        <li>✓ بطاقة الإقامة الألمانية (Aufenthaltstitel)</li>
                        <li>✓ شهادة B1 من معهد معتمد</li>
                        <li>✓ شهادة اختبار الجنسية (Einbürgerungstest)</li>
                        <li>✓ شهادة ميلاد مترجمة ومصدّقة</li>
                        <li>✓ عقد عمل ساري + كشوفات راتب آخر 3 أشهر</li>
                        <li>✓ سجل عدلي ألماني نظيف (Führungszeugnis) — 13 يورو</li>
                        <li>✓ شهادة تسجيل السكن (Meldebescheinigung)</li>
                        <li>✓ عقد إيجار أو ملكية المسكن</li>
                        <li>✓ تأمين صحي ساري</li>
                        <li>✓ صور شخصية حديثة بيومترية</li>
                        <li>✓ شهادة زواج (إن وُجدت) مترجمة</li>
                        <li>✓ شهادات ميلاد الأطفال (إن وُجدوا)</li>
                        <li>✓ السيرة الذاتية بالألمانية</li>
                        <li>✓ إقرار الولاء للدستور الألماني (يُملأ في المكتب)</li>
                    </ul>
                </div>

                {/* ───────── الرسوم ───────── */}

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">الرسوم الإجمالية المتوقعة</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <div className="space-y-2 text-white/70 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>دورات اللغة (إذا احتجت)</span>
                            <span className="text-white">200-1500 يورو</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>اختبار B1</span>
                            <span className="text-white">100-200 يورو</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>اختبار الجنسية</span>
                            <span className="text-white">25 يورو</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>رسوم التجنيس (للبالغ)</span>
                            <span className="text-white">255 يورو</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>رسوم التجنيس (لكل طفل)</span>
                            <span className="text-white">51 يورو</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>السجل العدلي</span>
                            <span className="text-white">13 يورو</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>ترجمة الوثائق</span>
                            <span className="text-white">100-300 يورو</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>جواز السفر الألماني</span>
                            <span className="text-white">60 يورو</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-bold text-white">المجموع التقديري</span>
                            <span className="font-bold text-[#c9a84c]">800-2400 يورو</span>
                        </div>
                    </div>
                </div>

                {/* ───────── المزايا ───────── */}

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">مزايا الجنسية الألمانية</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
                    <ul className="space-y-3 text-white/70 text-sm">
                        <li>🇪🇺 <span className="text-white">حرية التنقل والعمل في 27 دولة أوروبية</span> بدون تأشيرة أو إقامة</li>
                        <li>🛂 <span className="text-white">جواز سفر ألماني</span> — رابع أقوى جواز في العالم (190+ دولة بدون فيزا)</li>
                        <li>🗳️ <span className="text-white">حق التصويت والترشح</span> في الانتخابات المحلية والاتحادية</li>
                        <li>🛡️ <span className="text-white">الحماية القنصلية الألمانية</span> في كل دول العالم</li>
                        <li>💼 <span className="text-white">الوصول لوظائف القطاع العام</span> والوظائف الحكومية الحساسة</li>
                        <li>🏠 <span className="text-white">استقرار قانوني نهائي</span> لا تحتاج تجديد إقامة بعد الآن</li>
                        <li>👨‍👩‍👧 <span className="text-white">جنسية تلقائية لأطفالك</span> المولودين بعد التجنس</li>
                        <li>🏛️ <span className="text-white">حقوق سياسية كاملة</span> تشارك في تشكيل مستقبل البلد الذي تعيش فيه</li>
                    </ul>
                </div>

                {/* ───────── روابط رسمية ───────── */}

                <h2 className="text-2xl font-bold mb-4 text-[#c9a84c]">روابط ومصادر رسمية</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 space-y-3 text-white/70 text-sm">
                    <p>
                        <span className="text-white">المكتب الاتحادي للهجرة (BAMF): </span>
                        <a href="https://www.bamf.de" target="_blank" className="text-[#c9a84c] hover:underline">bamf.de →</a>
                    </p>
                    <p>
                        <span className="text-white">تحضير اختبار الجنسية الرسمي: </span>
                        <a href="https://oet.bamf.de" target="_blank" className="text-[#c9a84c] hover:underline">oet.bamf.de →</a>
                    </p>
                    <p>
                        <span className="text-white">وزارة الداخلية الألمانية: </span>
                        <a href="https://www.bmi.bund.de" target="_blank" className="text-[#c9a84c] hover:underline">bmi.bund.de →</a>
                    </p>
                    <p>
                        <span className="text-white">معهد غوته (للغة B1): </span>
                        <a href="https://www.goethe.de" target="_blank" className="text-[#c9a84c] hover:underline">goethe.de →</a>
                    </p>
                    <p>
                        <span className="text-white">TELC (اختبار لغة بديل): </span>
                        <a href="https://www.telc.net" target="_blank" className="text-[#c9a84c] hover:underline">telc.net →</a>
                    </p>
                    <p>
                        <span className="text-white">دليل ألمانيا الرسمي للجنسية: </span>
                        <a href="https://handbookgermany.de/ar/citizenship" target="_blank" className="text-[#c9a84c] hover:underline">handbookgermany.de →</a>
                    </p>
                    <p>
                        <span className="text-white">دليل التجنيس للسوريين: </span>
                        <a href="https://migrando.de/en/blog/naturalization/einbuergerungen-syrien" target="_blank" className="text-[#c9a84c] hover:underline">migrando.de →</a>
                    </p>
                </div>

                {/* ───────── التحذيرات ───────── */}

                <div className="bg-white/5 border border-[#c9a84c]/30 rounded-xl p-5 mb-4">
                    <p className="text-[#c9a84c] font-bold mb-2">💡 نصائح ذهبية</p>
                    <ul className="text-white/70 text-sm leading-relaxed space-y-2">
                        <li>• ابدأ بتحضير شهادة B1 مبكراً — إنها أطول مرحلة ولا يمكن تجاوزها.</li>
                        <li>• احجز موعد مكتب التجنيس قبل 6 أشهر — المواعيد محجوزة في المدن الكبرى.</li>
                        <li>• استشر مكتب Migrationsberatung مجاناً قبل التقديم — يساعدك على تجنب الأخطاء.</li>
                        <li>• وثّق كل عمل تطوعي تقوم به — يساعد في حالة طلب التجنيس بعد 3 سنوات.</li>
                    </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-4">
                    <p className="text-yellow-400 font-bold mb-2">⚠️ تحذيرات مهمة</p>
                    <ul className="text-white/70 text-sm leading-relaxed space-y-2">
                        <li>• الحكومة الجديدة قد تعدّل بعض الشروط — تابع آخر التطورات.</li>
                        <li>• أي مساعدة اجتماعية حالية (Bürgergeld) تمنع التجنيس — يجب أن تكون مستقلاً مالياً.</li>
                        <li>• عقوبة جنائية (حتى لو خفيفة) قد تؤجل أو ترفض الطلب.</li>
                        <li>• الذهاب للسفارة السورية بعد الحصول على اللجوء قد يلغي وضعك كلاجئ — استشر محامياً قبل ذلك.</li>
                    </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <p className="text-red-400 font-bold mb-2">⚠️ تنبيه قانوني</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                        هذه المعلومات للإرشاد فقط — قواعد التجنيس تختلف بين الولايات الألمانية. استشر دائماً محامي مختص أو مكتب Migrationsberatung قبل تقديم الطلب الرسمي.
                    </p>
                </div>

            </section>

        </main>
    );
}
export default function Citizenship() {
    return (
        <ProtectedPage>
            <CitizenshipContent />
        </ProtectedPage>
    );
}