export enum LogLevel_v2414 {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

export interface LogContext_v2414 {
  userId?: string
  action?: string
  feature?: string
  error?: Error
  metadata?: Record<string, any>
  tags?: string[]
}

export interface LogEntry_v2414 {
  timestamp: string
  level: LogLevel_v2414
  message: string
  context: LogContext_v2414
  tags: string[]
}
