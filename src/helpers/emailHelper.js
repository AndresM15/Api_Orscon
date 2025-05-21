import nodemailer from 'nodemailer';

export async function sendRecoveryEmail(to, link = null, coupon = null) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  let subject = 'Mensaje de Orscon';
  if (link) subject = 'Recuperación de contraseña';
  if (coupon) subject = '¡Tu cupón de bienvenida está aquí!';

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: `
      <p>Hola,</p>
      ${link ? `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${link}">${link}</a>` : ''}
      ${coupon ? `<p>Gracias por suscribirte. Tu cupón de bienvenida es: <strong>${coupon}</strong></p>` : ''}
    `
  };
  await transporter.sendMail(mailOptions);
}
