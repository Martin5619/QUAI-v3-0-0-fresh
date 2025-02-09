export interface AIConfig {
  provider: 'claude' | 'openai'
  maxRetries: number
  batchSize: number
  temperature: number
}

const defaultConfig: AIConfig = {
  provider: 'claude',
  maxRetries: 3,
  batchSize: 5,
  temperature: 0.7,
}

export function getAIConfig(): AIConfig {
  return {
    provider: (process.env.AI_PROVIDER as 'claude' | 'openai') || defaultConfig.provider,
    maxRetries: Number(process.env.AI_MAX_RETRIES) || defaultConfig.maxRetries,
    batchSize: Number(process.env.AI_BATCH_SIZE) || defaultConfig.batchSize,
    temperature: Number(process.env.AI_TEMPERATURE) || defaultConfig.temperature,
  }
}
