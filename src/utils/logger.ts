type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogMessage {
    message: string;
    [key: string]: any;
}

export class Logger {
    private static instance: Logger;
    private readonly isDevelopment: boolean;

    private constructor() {
        // Simple development check - you can customize this based on your build setup
        this.isDevelopment = typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             (window as any).__DEV__ === true);
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(level: LogLevel, message: LogMessage): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${JSON.stringify(message)}`;
    }

    private log(level: LogLevel, message: LogMessage): void {
        const formattedMessage = this.formatMessage(level, message);
        
        // Always log to console in development
        if (this.isDevelopment) {
            switch (level) {
                case 'INFO':
                    console.info(formattedMessage);
                    break;
                case 'WARN':
                    console.warn(formattedMessage);
                    break;
                case 'ERROR':
                    console.error(formattedMessage);
                    break;
                case 'DEBUG':
                    console.debug(formattedMessage);
                    break;
            }
        }

        // Here you could add remote logging service integration
        // Example: sendToRemoteLoggingService(level, message);
    }

    public info(message: LogMessage): void {
        this.log('INFO', message);
    }

    public warn(message: LogMessage): void {
        this.log('WARN', message);
    }

    public error(message: LogMessage): void {
        this.log('ERROR', message);
    }

    public debug(message: LogMessage): void {
        this.log('DEBUG', message);
    }
}

// Export a singleton instance
export const logger = Logger.getInstance(); 