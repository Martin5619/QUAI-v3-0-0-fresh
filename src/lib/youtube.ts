import fetch from 'node-fetch';

// Extract YouTube video ID from URL
export function getVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Get video information using YouTube Data API
export async function getVideoInfo(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`
  );

  const data = await response.json();
  if (!data.items?.[0]) {
    throw new Error('Video not found');
  }

  const video = data.items[0];
  const duration = parseDuration(video.contentDetails.duration);

  return {
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
    duration, // in seconds
  };
}

// Parse ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const [, hours, minutes, seconds] = match;
  return (
    (parseInt(hours || '0') * 3600) +
    (parseInt(minutes || '0') * 60) +
    parseInt(seconds || '0')
  );
}
