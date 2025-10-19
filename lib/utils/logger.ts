import { isDevelopment, isProduction } from "@/lib/config/runtime-env"

/**
 * Log levels for structured logging
 */
export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

/**
 * Color codes for console output
 */
const COLORS = {
    DEBUG: "\x1b[36m", // Cyan
    INFO: "\x1b[32m", // Green
    WARN: "\x1b[33m", // Yellow
    ERROR: "\x1b[31m", // Red
    RESET: "\x1b[0m", // Reset
} as const

/**
 * Format timestamp for logs
 */
function getTimestamp(): string {
    return new Date().toISOString()
}

/**
 * Format log message with color and timestamp
 */
function formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = getTimestamp()
    const color = COLORS[level]
    const reset = COLORS.RESET

    let formattedMessage = `${color}[${timestamp}] [${level}]${reset} ${message}`

    if (data !== undefined) {
        formattedMessage += `\n${color}Data:${reset} ${JSON.stringify(data, null, 2)}`
    }

    return formattedMessage
}

/**
 * Logger class for structured logging
 * Provides different log levels and conditional logging based on environment
 */
class Logger {
    /**
     * Log debug messages (only in development)
     * Use for detailed debugging information
     */
    debug(message: string, data?: unknown): void {
        if (isDevelopment) {
            console.log(formatMessage(LogLevel.DEBUG, message, data))
        }
    }

    /**
     * Log informational messages
     * Use for general information about application flow
     */
    info(message: string, data?: unknown): void {
        if (isDevelopment) {
            console.log(formatMessage(LogLevel.INFO, message, data))
        }
    }

    /**
     * Log warning messages
     * Use for potentially harmful situations
     */
    warn(message: string, data?: unknown): void {
        console.warn(formatMessage(LogLevel.WARN, message, data))
    }

    /**
     * Log error messages
     * Use for error events that might still allow the application to continue
     */
    error(message: string, error?: unknown): void {
        const errorData = error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
            }
            : error

        console.error(formatMessage(LogLevel.ERROR, message, errorData))

        // In production, send to error tracking service
        if (isProduction) {
            this.sendToErrorTracking(message, errorData)
        }
    }

    /**
     * Send errors to external error tracking service
     * TODO: Integrate with Sentry, LogRocket, or similar service
     */
    private sendToErrorTracking(message: string, error?: unknown): void {
        // Placeholder for error tracking integration
        // In production, you would send this to Sentry, LogRocket, etc.
        try {
            // Example: Sentry.captureException(error)
            // For now, we just ensure it's logged
            if (error) {
                // Error is already logged to console
            }
        } catch (trackingError) {
            // Fail silently to not break the application
            console.error("Failed to send error to tracking service:", trackingError)
        }
    }

    /**
     * Log API request
     */
    apiRequest(method: string, path: string, data?: unknown): void {
        this.debug(`API Request: ${method} ${path}`, data)
    }

    /**
     * Log API response
     */
    apiResponse(method: string, path: string, status: number, data?: unknown): void {
        const message = `API Response: ${method} ${path} - Status: ${status}`
        if (status >= 400) {
            this.error(message, data)
        } else {
            this.debug(message, data)
        }
    }

    /**
     * Log database query
     */
    dbQuery(query: string, params?: unknown): void {
        this.debug("Database Query", { query, params })
    }

    /**
     * Log authentication event
     */
    auth(event: string, userId?: number | string, data?: unknown): void {
        this.info(`Auth Event: ${event}`, { userId, data })
    }

    /**
     * Log performance metrics
     */
    performance(label: string, duration: number): void {
        this.debug(`Performance: ${label}`, { duration: `${duration}ms` })
    }

    /**
     * Create a timer for performance measurement
     */
    startTimer(label: string): () => void {
        const start = performance.now()
        return () => {
            const duration = performance.now() - start
            this.performance(label, duration)
        }
    }
}

/**
 * Global logger instance
 * Import and use this throughout your application
 * 
 * @example
 * import { logger } from '@/lib/utils/logger'
 * 
 * logger.info('User logged in', { userId: 123 })
 * logger.error('Failed to fetch data', error)
 * logger.debug('Debug info', { data: someData })
 */
export const logger = new Logger()

/**
 * Type for logger instance
 */
export type LoggerType = typeof logger
