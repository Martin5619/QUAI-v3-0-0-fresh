import { AIProvider } from './types'
import { ClaudeProvider } from './claude'
import { OpenAIProvider } from './openai'

export * from './types'
export * from './retry'

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'claude'
  
  switch (provider) {
    case 'claude':
      return new ClaudeProvider()
    case 'openai':
      return new OpenAIProvider()
    default:
      throw new Error(`Unknown AI provider: ${provider}. Valid options are 'claude' or 'openai'.`)
  }
}
