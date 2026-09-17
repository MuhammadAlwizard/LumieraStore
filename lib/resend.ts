import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset Password Admin LUMIÉRA Shine',
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Reset Password</h2>
      <p>Ada permintaan untuk reset password akun admin LUMIÉRA Shine kamu.</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px">Reset Password</a></p>
      <p>Link ini berlaku selama 1 jam. Kalau kamu tidak meminta ini, abaikan saja email ini.</p>
    </div>`,
  });
}
