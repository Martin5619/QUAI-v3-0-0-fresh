import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Redis environment variables')
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

interface CacheOptions {
  ttl?: number // Time to live in seconds
}

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 3600 } = options // Default 1 hour TTL

  try {
    // Try to get from cache first
    const cached = await redis.get<T>(key)
    if (cached) {
      return cached
    }

    // If not in cache, fetch fresh data
    const freshData = await fetchFn()

    // Store in cache
    await redis.set(key, freshData, {
      ex: ttl
    })

    return freshData
  } catch (error) {
    console.error('Cache error:', error)
    // If cache fails, fall back to direct fetch
    return fetchFn()
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache invalidation error:', error)
  }
}

export async function getCacheKeys(pattern: string): Promise<string[]> {
  try {
    return await redis.keys(pattern)
  } catch (error) {
    console.error('Error getting cache keys:', error)
    return []
  }
}

export async function clearCache(): Promise<void> {
  try {
    const keys = await redis.keys('*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}
