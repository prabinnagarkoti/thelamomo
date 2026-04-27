import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const mailOptions = {
    from: `"BizMenu Builder" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your verification code — BizMenu Builder",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(148,163,184,0.15);">
        <div style="background: linear-gradient(135deg, #f59e0b, #f97316, #e11d48); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">🍽️ BizMenu Builder</h1>
          <p style="margin: 8px 0 0; color: rgba(15,23,42,0.7); font-size: 13px;">Your Digital Menu, Your Rules</p>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 12px;">Verify your email</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Hi <strong style="color: #e2e8f0;">${name || "there"}</strong>, thanks for signing up! Enter the following 6-digit code to verify your email address.
          </p>
          <div style="background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f59e0b;">${token}</span>
          </div>
          <p style="color: #475569; font-size: 11px; margin: 20px 0 0;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendOrderConfirmationEmail(email: string, name: string, order: any, restaurantName: string = "BizMenu Restaurant") {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #334155; color: #f1f5f9;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #334155; color: #94a3b8;">x${item.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #334155; color: #f1f5f9; text-align: right;">$${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `).join("");

  const mailOptions = {
    from: `"${restaurantName}" <${process.env.GMAIL_USER}>`,
    to: email, // customer email
    subject: `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()} — ${restaurantName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(148,163,184,0.15);">
        <div style="background: linear-gradient(135deg, #f59e0b, #f97316, #e11d48); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">🍽️ ${restaurantName}</h1>
          <p style="margin: 8px 0 0; color: rgba(15,23,42,0.7); font-size: 13px;">Order Confirmation</p>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 12px;">Thank you for your order, ${name}!</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            We've received your order and are processing it right now. Below is your receipt.
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <thead>
              <tr>
                <th style="padding: 8px; border-bottom: 2px solid #334155; color: #f59e0b; text-align: left;">Item</th>
                <th style="padding: 8px; border-bottom: 2px solid #334155; color: #f59e0b; text-align: left;">Qty</th>
                <th style="padding: 8px; border-bottom: 2px solid #334155; color: #f59e0b; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px 8px; color: #f1f5f9; font-weight: bold; text-align: right;">Total:</td>
                <td style="padding: 12px 8px; color: #f59e0b; font-weight: bold; text-align: right;">$${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <p style="color: #475569; font-size: 11px; margin: 20px 0 0;">
            If you have any questions about your order, please contact the restaurant directly.
          </p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}
