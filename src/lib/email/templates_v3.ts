export const verificationEmailTemplate = (verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      background-color: #6D28D9;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      color: #666;
      font-size: 14px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify your email address</h1>
    <p>Thanks for signing up for QUAi! Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" class="button">Verify Email</a>
    <p>If you didn't create an account with QUAi, you can safely ignore this email.</p>
    <div class="footer">
      <p>This link will expire in 24 hours.</p>
      <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
    </div>
  </div>
</body>
</html>
`

export const passwordResetTemplate = (resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      background-color: #6D28D9;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      color: #666;
      font-size: 14px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset your password</h1>
    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <div class="footer">
      <p>This link will expire in 1 hour.</p>
      <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
    </div>
  </div>
</body>
</html>
`
