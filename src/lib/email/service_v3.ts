import nodemailer from 'nodemailer'
import { verificationEmailTemplate, passwordResetTemplate } from './templates_v3'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendVerificationEmail = async (
  to: string,
  verificationToken: string
) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Verify your email address',
    html: verificationEmailTemplate(verificationUrl),
  })
}

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your password',
    html: passwordResetTemplate(resetUrl),
  })
}
