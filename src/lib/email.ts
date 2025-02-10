interface EmailParams {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: EmailParams) {
  // For now, just log the email (we'll implement actual sending later)
  console.log('[Email_v3] Would send email:', {
    to,
    subject,
    text: text.trim()
  });
  
  // Return success
  return true;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify your QUAi account',
    text: `
      Welcome to QUAi!
      
      Please verify your email address by clicking the link below:
      ${verificationUrl}
      
      If you didn't create this account, you can safely ignore this email.
      
      Best regards,
      The QUAi Team
    `
  });
}
