import { LogLevel_v2414, type LogContext_v2414, type LogEntry_v2414 } from './types'

class Logger_v2414 {
  private static instance: Logger_v2414
  
  private constructor() {}

  static getInstance(): Logger_v2414 {
    if (!Logger_v2414.instance) {
      Logger_v2414.instance = new Logger_v2414()
    }
    return Logger_v2414.instance
  }

  private createLogEntry(
    level: LogLevel_v2414,
    message: string,
    context?: LogContext_v2414
  ): LogEntry_v2414 {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context || {},
      tags: context?.tags || []
    }
  }

  private async logToSystem(entry: LogEntry_v2414): Promise<void> {
    // Development logging
    if (process.env.NODE_ENV === 'development') {
      const logColor = {
        [LogLevel_v2414.ERROR]: '\x1b[31m', // Red
        [LogLevel_v2414.WARN]: '\x1b[33m',  // Yellow
        [LogLevel_v2414.INFO]: '\x1b[36m',  // Cyan
        [LogLevel_v2414.DEBUG]: '\x1b[32m', // Green
        [LogLevel_v2414.TRACE]: '\x1b[37m'  // White
      }[entry.level]

      console.log(
        `${logColor}[${entry.level}]\x1b[0m [${entry.timestamp}] ${entry.message}`,
        entry.context
      )
    }

    // Production logging (AWS CloudWatch)
    if (process.env.NODE_ENV === 'production') {
      // AWS CloudWatch implementation will go here
      // We'll add this when setting up AWS integration
    }
  }

  error(message: string, context?: LogContext_v2414): void {
    const entry = this.createLogEntry(LogLevel_v2414.ERROR, message, context)
    this.logToSystem(entry)
  }

  warn(message: string, context?: LogContext_v2414): void {
    const entry = this.createLogEntry(LogLevel_v2414.WARN, message, context)
    this.logToSystem(entry)
  }

  info(message: string, context?: LogContext_v2414): void {
    const entry = this.createLogEntry(LogLevel_v2414.INFO, message, context)
    this.logToSystem(entry)
  }

  debug(message: string, context?: LogContext_v2414): void {
    const entry = this.createLogEntry(LogLevel_v2414.DEBUG, message, context)
    this.logToSystem(entry)
  }

  trace(message: string, context?: LogContext_v2414): void {
    const entry = this.createLogEntry(LogLevel_v2414.TRACE, message, context)
    this.logToSystem(entry)
  }
}

export const logger_v2414 = Logger_v2414.getInstance()
