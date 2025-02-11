import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// This would typically come from your database or CMS
const getVideoConfig = async () => {
  try {
    // Check for local video first
    const localPath = path.join(process.cwd(), 'public', 'hero-video.mp4')
    await readFile(localPath)
    return {
      type: 'local' as const,
      url: '/hero-video.mp4'
    }
  } catch {
    // Fallback to remote or YouTube
    return {
      type: 'youtube' as const,
      url: 'dQw4w9WgXcQ' // Default video ID
    }
  }
}

export async function GET() {
  try {
    const config = await getVideoConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('[VIDEO_CONFIG_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to get video configuration' },
      { status: 500 }
    )
  }
}

// For streaming local video content
export async function HEAD(request: Request) {
  const url = new URL(request.url)
  if (url.searchParams.get('stream') !== 'true') {
    return new NextResponse(null, { status: 404 })
  }

  try {
    const videoPath = path.join(process.cwd(), 'public', 'hero-video.mp4')
    const stat = await readFile(videoPath)
    return new NextResponse(null, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.length.toString(),
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (error) {
    console.error('[VIDEO_STREAM_ERROR]', error)
    return new NextResponse(null, { status: 404 })
  }
}
