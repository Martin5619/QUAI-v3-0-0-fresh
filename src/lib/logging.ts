type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  userId?: string
  error?: any
  metadata?: Record<string, any>
}

export class Logger_v2414 {
  private static formatError(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      }
    }
    return error
  }

  private static createLogEntry(
    level: LogLevel,
    category: string,
    message: string,
    userId?: string,
    error?: any,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      userId,
      error: error ? this.formatError(error) : undefined,
      metadata,
    }
  }

  private static log(entry: LogEntry) {
    // In development, pretty print to console
    if (process.env.NODE_ENV === "development") {
      const colors = {
        info: "\x1b[36m", // cyan
        warn: "\x1b[33m", // yellow
        error: "\x1b[31m", // red
        debug: "\x1b[35m", // magenta
      }
      const reset = "\x1b[0m"
      
      console.log(
        `${colors[entry.level]}[${entry.timestamp}] [${entry.level.toUpperCase()}] [${
          entry.category
        }]${reset} ${entry.message}`
      )
      
      if (entry.userId) {
        console.log(`  User ID: ${entry.userId}`)
      }
      
      if (entry.error) {
        console.error("  Error:", entry.error)
      }
      
      if (entry.metadata) {
        console.log("  Metadata:", entry.metadata)
      }
    } else {
      // In production, log structured JSON for log aggregation
      console.log(JSON.stringify(entry))
    }

    // TODO: In production, send to log aggregation service
    // if (process.env.NODE_ENV === "production") {
    //   // Send to logging service (e.g., DataDog, CloudWatch, etc.)
    // }
  }

  static info(category: string, message: string, userId?: string, metadata?: Record<string, any>) {
    this.log(this.createLogEntry("info", category, message, userId, undefined, metadata))
  }

  static warn(category: string, message: string, userId?: string, metadata?: Record<string, any>) {
    this.log(this.createLogEntry("warn", category, message, userId, undefined, metadata))
  }

  static error(category: string, message: string, error: any, userId?: string, metadata?: Record<string, any>) {
    this.log(this.createLogEntry("error", category, message, userId, error, metadata))
  }

  static debug(category: string, message: string, userId?: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === "development") {
      this.log(this.createLogEntry("debug", category, message, userId, undefined, metadata))
    }
  }
}
