import { randomBytes } from "crypto"

/**
 * Generate a secure random token for email verification
 * @returns Promise<string> A secure random token
 */
export async function generateVerificationToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(32, (err, buf) => {
      if (err) {
        reject(err)
        return
      }
      resolve(buf.toString("hex"))
    })
  })
}

/**
 * Generate a secure random token for password reset
 * @param expiryHours Number of hours before token expires
 * @returns Promise<{token: string, expires: Date}> Token and expiry date
 */
export async function generateResetToken(expiryHours: number = 24): Promise<{ token: string; expires: Date }> {
  const token = await generateVerificationToken()
  const expires = new Date()
  expires.setHours(expires.getHours() + expiryHours)
  
  return {
    token,
    expires
  }
}
