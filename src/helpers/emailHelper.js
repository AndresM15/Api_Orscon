import nodemailer from 'nodemailer';

export async function sendRecoveryEmail(to, link) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <p>Hola,</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${link}">${link}</a>
      <p>Este enlace expirará en 15 minutos.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}
