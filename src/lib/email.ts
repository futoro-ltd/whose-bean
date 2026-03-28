import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_URL = process.env.APP_URL || 'http://localhost:9500';

export async function sendVerificationEmail(
  email: string,
  token: string,
  isAdmin: boolean,
  inviterEmail: string
) {
  const verifyUrl = `${APP_URL}/verify/${token}`;

  const subject = isAdmin
    ? "You're invited to join as an Admin"
    : "You're invited to join Whose Bean";

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 30px;">
                    <img src="${APP_URL}/whose-bean.svg" alt="Whose Bean Logo" style="display: block; margin: 0 auto 20px auto; max-width: 150px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #333;">You're invited!</h2>
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #666;">${inviterEmail} has invited you to join Whose Bean${isAdmin ? ' as an Admin' : ''}.</p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #666;">Click the button below to set up your account:</p>
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                      <tr>
                        <td align="center" bgcolor="#4f46e5" style="border-radius: 8px; mso-padding-alt: 12px 24px;">
                          <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; background-color: #4f46e5; border-radius: 8px; mso-padding-alt: 0; border: 0;">Set Up Account</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0;"><a href="${verifyUrl}" rel="noopener" target="_blank" style="color: #4f46e5; text-decoration: underline;">Or click here to set up your account</a></p>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #999; word-break: break-all;">Or copy this link: ${verifyUrl}</p>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #999;">This link expires in 24 hours.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 12px; color: #999;">If you didn't request this invitation, please ignore this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `${inviterEmail} has invited you to join Whose Bean${isAdmin ? ' as an Admin' : ''}.\n\nClick the link below to set up your account:\n${verifyUrl}\n\nThis link expires in 24 hours.`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@whosebean.com',
      to: email,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password/${token}`;

  const subject = 'Reset Your Password';

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 30px;">
                    <img src="${APP_URL}/whose-bean.svg" alt="Whose Bean Logo" style="display: block; margin: 0 auto 20px auto; max-width: 150px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #333;">Reset Your Password</h2>
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #666;">We received a request to reset your password. Click the button below to create a new password:</p>
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                      <tr>
                        <td align="center" bgcolor="#4f46e5" style="border-radius: 8px; mso-padding-alt: 12px 24px;">
                          <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; background-color: #4f46e5; border-radius: 8px; mso-padding-alt: 0; border: 0;">Reset Password</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0;"><a href="${resetUrl}" rel="noopener" target="_blank" style="color: #4f46e5; text-decoration: underline;">Or click here to reset your password</a></p>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #999; word-break: break-all;">Or copy this link: ${resetUrl}</p>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #999;">This link expires in 1 hour.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 12px; color: #999;">If you didn't request a password reset, please ignore this email. Your password will not be changed.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `We received a request to reset your password.\n\nClick the link below to create a new password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request a password reset, please ignore this email.`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@whosebean.com',
      to: email,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}
