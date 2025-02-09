export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public retryable?: boolean
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export interface APIResponse<T> {
  data?: T
  error?: APIError
}

export interface APIOptions {
  timeout?: number
  retries?: number
  retryDelay?: number
}

const DEFAULT_TIMEOUT = 300000 // 300 seconds
const DEFAULT_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second

export async function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit & { timeout?: number }
): Promise<Response> {
  const timeout = init?.timeout || DEFAULT_TIMEOUT

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getQuestionSet(id: string) {
  return apiRequest(`/api/questions/sets/${id}`)
}

export async function apiRequestSimple<T>(
  endpoint: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = 300000, ...fetchOptions } = options
  
  console.log('Making API request:', {
    endpoint,
    method: fetchOptions.method || 'GET',
    timeout,
    hasBody: !!fetchOptions.body
  })
  
  if (fetchOptions.body) {
    console.log('Request body:', fetchOptions.body)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(endpoint, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    clearTimeout(timeoutId)
    
    console.log('API response received:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('API error response:', error)
      throw new APIError(
        error.message || `HTTP error! status: ${response.status}`,
        response.status,
        error.retryable ?? false
      )
    }

    const data = await response.json()
    console.log('API response data:', data)
    return data as T
  } catch (error) {
    console.error('API request failed:', error)
    
    if (error instanceof APIError) {
      throw error
    }
    
    if (error.name === 'AbortError') {
      throw new APIError(
        'Request timed out after ' + (timeout / 1000) + ' seconds',
        408,
        true
      )
    }

    throw new APIError(
      error.message || 'Failed to fetch',
      500,
      true
    )
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unknown error occurred'
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'TypeError' || error.name === 'AbortError')
  )
}

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const
