const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff delays in ms

export class AIError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly retryable: boolean = true
  ) {
    super(message)
    this.name = 'AIError'
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry if explicitly marked as non-retryable
      if (error instanceof AIError && !error.retryable) {
        throw error
      }

      if (attempt === RETRY_DELAYS.length) {
        throw new AIError(
          `Failed after ${attempt + 1} attempts: ${lastError.message}`,
          lastError
        )
      }

      // Notify of retry
      if (onRetry) {
        onRetry(attempt + 1, lastError)
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]))
    }
  }

  throw lastError! // This should never happen due to the for loop condition
}
