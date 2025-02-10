import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only run on API routes
  if (!request.url.includes('/api/')) {
    return NextResponse.next()
  }

  try {
    const response = await NextResponse.next()
    return response
  } catch (error) {
    console.error('API Error:', error)
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
