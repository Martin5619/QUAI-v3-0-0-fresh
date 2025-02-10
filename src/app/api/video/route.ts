import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const videoPath = path.join(process.cwd(), 'public', 'hero-video.mp4')
    const videoBuffer = await readFile(videoPath)

    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('[VIDEO_ERROR]', error)
    return new NextResponse('Video not found', { status: 404 })
  }
}
