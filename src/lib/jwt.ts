import jwt from "jsonwebtoken"

interface TokenPayload {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: string
  plan: string
}

export function signJwtAccessToken(payload: TokenPayload) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not defined")
  }
  
  const token = jwt.sign(payload, secret, {
    expiresIn: "1d"
  })
  
  return token
}

export function verifyJwtToken(token: string) {
  try {
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new Error("NEXTAUTH_SECRET is not defined")
    }
    
    const decoded = jwt.verify(token, secret)
    return decoded as TokenPayload
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}
