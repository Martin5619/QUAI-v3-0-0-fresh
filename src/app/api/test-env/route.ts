import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Check if DATABASE_URL exists (without exposing it)
    const hasDbUrl = !!process.env.DATABASE_URL
    
    // Check other critical environment variables
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      hasDbUrl,
      // Add other env checks here (without exposing sensitive values)
    }
    
    console.log('Environment status:', envStatus)
    
    return NextResponse.json({ 
      status: 'Environment check complete',
      checks: envStatus
    })
  } catch (error) {
    console.error('Environment check failed:', error)
    return NextResponse.json({ error: 'Environment check failed' }, { status: 500 })
  }
}
