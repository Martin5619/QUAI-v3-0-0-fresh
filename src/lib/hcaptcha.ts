interface HCaptchaVerifyResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  credit?: boolean
  "error-codes"?: string[]
}

export async function verifyHCaptcha(token: string): Promise<boolean> {
  try {
    console.log("Verifying hCaptcha token...")
    const secret = process.env.HCAPTCHA_SECRET_KEY
    if (!secret) {
      console.error("HCAPTCHA_SECRET_KEY is not set")
      return false
    }

    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `response=${token}&secret=${secret}`,
    })

    const data: HCaptchaVerifyResponse = await response.json()
    console.log("hCaptcha verification response:", data)

    if (!data.success) {
      console.error("hCaptcha verification failed:", data["error-codes"])
      return false
    }

    return true
  } catch (error) {
    console.error("hCaptcha verification error:", error)
    return false
  }
}
