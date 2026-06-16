import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'سُبُل <noreply@subul.app>';

// إيميل الترحيب عند التسجيل
export async function sendWelcomeEmail(email: string, name?: string) {
  const displayName = name || 'عزيزي المستخدم';

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'أهلاً بك في سُبُل 🌟',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;direction:rtl;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:12px;border:1px solid #222222;overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background:#111111;padding:40px;text-align:center;border-bottom:1px solid #222222;">
                    <h1 style="margin:0;font-size:28px;color:#c9a84c;letter-spacing:2px;">سُبُل</h1>
                    <p style="margin:8px 0 0;color:#666666;font-size:13px;">طريقك للبداية الجديدة</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">أهلاً بك ${displayName} 👋</h2>
                    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.7;">
                      يسعدنا انضمامك لمنصة سُبُل — مستشارك الذكي للوصول لهدفك.
                    </p>
                    <p style="margin:0 0 24px;color:#aaaaaa;font-size:15px;line-height:1.7;">
                      يمكنك الآن الاستفادة من 15 سؤالاً مجانياً لاستكشاف المنصة والحصول على إجابات دقيقة حول المنح والتأشيرات والوثائق الرسمية.
                    </p>
                    
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                      <tr>
                        <td style="background:#c9a84c;border-radius:8px;">
                          <a href="https://subul.app/chat" style="display:block;padding:14px 32px;color:#000000;font-size:15px;font-weight:bold;text-decoration:none;">
                            ابدأ الآن ←
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0;color:#555555;font-size:13px;line-height:1.7;">
                      إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا الإيميل.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px;border-top:1px solid #222222;text-align:center;">
                    <p style="margin:0;color:#444444;font-size:12px;">
                      نحن في سُبُل، طريقك للبداية الجديدة
                    </p>
                    <p style="margin:8px 0 0;color:#333333;font-size:11px;">
                      subul.app
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

// إيميل تفعيل الاشتراك
export async function sendSubscriptionActivatedEmail(
  email: string,
  plan: string,
  credits: number,
  name?: string,
  priceUsd?: number,
  expiresAt?: Date
) {
  const displayName = name || 'عزيزي المستخدم';

  const planNames: Record<string, string> = {
    starter: 'سُبُل ستارتر',
    plus: 'سُبُل بلس',
    pro: 'سُبُل برو',
  };

  const planName = planNames[plan] || plan;

  const expiryStr = expiresAt
    ? expiresAt.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `تم تفعيل اشتراكك في ${planName} ✅`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;direction:rtl;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:12px;border:1px solid #222222;overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background:#111111;padding:40px;text-align:center;border-bottom:1px solid #222222;">
                    <h1 style="margin:0;font-size:28px;color:#c9a84c;letter-spacing:2px;">سُبُل</h1>
                    <p style="margin:8px 0 0;color:#666666;font-size:13px;">طريقك للبداية الجديدة</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <div style="text-align:center;margin-bottom:32px;">
                      <div style="display:inline-block;background:#1a2a1a;border:1px solid #2a4a2a;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;">
                        ✅
                      </div>
                    </div>
                    
                    <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;text-align:center;">
                      تم تفعيل اشتراكك بنجاح
                    </h2>
                    
                    <p style="margin:0 0 24px;color:#aaaaaa;font-size:15px;line-height:1.7;text-align:center;">
                      ${displayName}، اشتراكك في <strong style="color:#c9a84c;">${planName}</strong> أصبح نشطاً الآن.
                    </p>

                    <!-- Plan Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;border:1px solid #222222;margin-bottom:32px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:#666666;font-size:13px;padding-bottom:12px;">الخطة</td>
                              <td style="color:#ffffff;font-size:13px;font-weight:bold;text-align:left;padding-bottom:12px;">${planName}</td>
                            </tr>
                            <tr>
                              <td style="color:#666666;font-size:13px;padding-bottom:12px;">الرصيد المتاح</td>
                              <td style="color:#c9a84c;font-size:13px;font-weight:bold;text-align:left;padding-bottom:12px;">${credits} سؤال</td>
                            </tr>
                            ${priceUsd ? `
                            <tr>
                              <td style="color:#666666;font-size:13px;padding-bottom:12px;">المبلغ المدفوع</td>
                              <td style="color:#ffffff;font-size:13px;font-weight:bold;text-align:left;padding-bottom:12px;">${priceUsd}$</td>
                            </tr>
                            ` : ''}
                            ${expiryStr ? `
                            <tr>
                              <td style="color:#666666;font-size:13px;">ينتهي في</td>
                              <td style="color:#ffffff;font-size:13px;font-weight:bold;text-align:left;">${expiryStr}</td>
                            </tr>
                            ` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                      <tr>
                        <td style="background:#c9a84c;border-radius:8px;">
                          <a href="https://subul.app/chat" style="display:block;padding:14px 32px;color:#000000;font-size:15px;font-weight:bold;text-decoration:none;">
                            ابدأ الاستشارة ←
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px;border-top:1px solid #222222;text-align:center;">
                    <p style="margin:0;color:#444444;font-size:12px;">
                      نحن في سُبُل، طريقك للبداية الجديدة
                    </p>
                    <p style="margin:8px 0 0;color:#333333;font-size:11px;">
                      subul.app
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}