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

export const sendOrderConfirmationEmail = async ({ email, orderId, productName, quantity, total }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de Orden - Orscon',
    html: `
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu orden #${orderId} ha sido procesada exitosamente.</p>
      <h2>Detalles de la orden:</h2>
      <ul>
        <li>Producto: ${productName}</li>
        <li>Cantidad: ${quantity}</li>
        <li>Total: $${total}</li>
      </ul>
      <p>Te mantendremos informado sobre el estado de tu envío.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar correo de confirmación:', error);
    throw error;
  }
};
