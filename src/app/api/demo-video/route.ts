import { NextResponse } from 'next/server'

// This would typically come from your database or CMS
const getDemoVideoConfig = async () => {
  // For testing, use the same video as background
  return {
    type: 'youtube' as const,
    url: 'dQw4w9WgXcQ'
  }
}

export async function GET() {
  try {
    const config = await getDemoVideoConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('[DEMO_VIDEO_CONFIG_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to get demo video configuration' },
      { status: 500 }
    )
  }
}
