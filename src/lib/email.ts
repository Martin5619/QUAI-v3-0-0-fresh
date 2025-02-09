interface EmailParams {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: EmailParams) {
  // For now, just log the email (we'll implement actual sending later)
  console.log('[Email_v2414] Would send email:', {
    to,
    subject,
    text: text.trim()
  });
  
  // Return success
  return true;
}
