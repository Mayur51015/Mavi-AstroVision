import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendDailyHoroscopeEmail = async ({ to, name, zodiacSign, prediction }) => {
  try {
    const mailOptions = {
      from: `"Mavi-AstroVision ✨" <${process.env.SMTP_USER}>`,
      to,
      subject: `🌟 Your Daily Horoscope for ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)} — ${new Date().toDateString()}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a0533; color: #f5f5f5; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4b1a7a, #1a0533); padding: 40px 30px; text-align: center;">
            <h1 style="color: #f5c842; font-size: 28px; margin: 0;">✨ Mavi-AstroVision</h1>
            <p style="color: #c9a0ff; margin: 8px 0 0;">Your Daily Cosmic Guidance</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #f5c842;">Hello, ${name}! 🌙</h2>
            <p style="color: #c9a0ff; font-size: 16px;">Here's your daily horoscope for <strong style="color: #f5c842;">${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}</strong>:</p>
            <div style="background: rgba(255,255,255,0.05); border-left: 4px solid #f5c842; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #f0e6ff; font-size: 15px; line-height: 1.8; margin: 0;">${prediction}</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.CLIENT_URL}" style="background: linear-gradient(135deg, #f5c842, #e8a200); color: #1a0533; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">View Full Chart →</a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #6b5a8e; font-size: 12px;">
            <p>Mavi-AstroVision • Cosmic Guidance Every Day</p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`📧 Horoscope email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

export const sendVerificationEmail = async ({ to, name, verificationLink }) => {
  try {
    const mailOptions = {
      from: `"Mavi-AstroVision ✨" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Welcome to Mavi-AstroVision - Verify Your Email',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a0533; color: #f5f5f5; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4b1a7a, #1a0533); padding: 40px 30px; text-align: center;">
            <h1 style="color: #f5c842; font-size: 28px; margin: 0;">✨ Mavi-AstroVision</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #f5c842;">Welcome, ${name}!</h2>
            <p style="color: #c9a0ff; font-size: 16px;">Thank you for joining our cosmic community. Verify your email to get started.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${verificationLink}" style="background: linear-gradient(135deg, #f5c842, #e8a200); color: #1a0533; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">Verify Email</a>
            </div>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Verification email error:', err.message);
    return false;
  }
};

export const sendPasswordResetEmail = async ({ to, name, resetLink }) => {
  try {
    const mailOptions = {
      from: `"Mavi-AstroVision ✨" <${process.env.SMTP_USER || 'no-reply@maviastrovision.com'}>`,
      to,
      subject: '🔐 Reset Your Password — Mavi-AstroVision',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a0533; color: #f5f5f5; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4b1a7a, #1a0533); padding: 40px 30px; text-align: center;">
            <h1 style="color: #f5c842; font-size: 28px; margin: 0;">✨ Mavi-AstroVision</h1>
            <p style="color: #c9a0ff; margin: 8px 0 0;">Password Reset Request</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #f5c842;">Hello ${name || 'Stargazer'},</h2>
            <p style="color: #c9a0ff; font-size: 15px; line-height: 1.6;">
              We received a request to reset your password. Click the cosmic key below to set a new password. This link will expire in 1 hour.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #f5c842, #e8a200); color: #1a0533; padding: 14px 32px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password →</a>
            </div>
            <p style="color: #8f7fa8; font-size: 13px;">If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    };
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'your@gmail.com') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[Dev Mode] Password reset link for ${to}: ${resetLink}`);
    }
    return true;
  } catch (err) {
    console.error('Password reset email error:', err.message);
    return false;
  }
};

export const sendWelcomeEmail = async ({ to, name }) => {
  try {
    const mailOptions = {
      from: `"Mavi-AstroVision ✨" <${process.env.SMTP_USER || 'no-reply@maviastrovision.com'}>`,
      to,
      subject: '🌟 Welcome to Mavi-AstroVision — Your Celestial Journey Begins',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a0533; color: #f5f5f5; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4b1a7a, #1a0533); padding: 40px 30px; text-align: center;">
            <h1 style="color: #f5c842; font-size: 28px; margin: 0;">✨ Mavi-AstroVision</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #f5c842;">Welcome, ${name}!</h2>
            <p style="color: #c9a0ff; font-size: 15px; line-height: 1.6;">
              Your celestial journey has begun. Discover your birth chart, daily astrological transits, and personal horoscope guidance.
            </p>
          </div>
        </div>
      `,
    };
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'your@gmail.com') {
      await transporter.sendMail(mailOptions);
    }
    return true;
  } catch (err) {
    console.error('Welcome email error:', err.message);
    return false;
  }
};
