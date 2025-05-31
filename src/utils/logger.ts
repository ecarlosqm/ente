import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
    private static instance: Logger;
    private logFilePath: string;
    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private readonly MAX_FILES = 5;

    private constructor() {
        this.logFilePath = path.join(process.cwd(), '.logs');
        this.ensureLogDirectory();
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private ensureLogDirectory(): void {
        const dir = path.dirname(this.logFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    private rotateLogs(): void {
        if (!fs.existsSync(this.logFilePath)) return;

        const stats = fs.statSync(this.logFilePath);
        if (stats.size < this.MAX_FILE_SIZE) return;

        // Rotate existing log files
        for (let i = this.MAX_FILES - 1; i >= 0; i--) {
            const oldPath = i === 0 ? this.logFilePath : `${this.logFilePath}.${i}`;
            const newPath = `${this.logFilePath}.${i + 1}`;

            if (fs.existsSync(oldPath)) {
                if (i === this.MAX_FILES - 1) {
                    fs.unlinkSync(oldPath);
                } else {
                    fs.renameSync(oldPath, newPath);
                }
            }
        }
    }

    private formatMessage(level: LogLevel, message: Record<string, any>): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${JSON.stringify(message)}\n`;
    }

    private writeLog(level: LogLevel, message: Record<string, any>): void {
        this.rotateLogs();
        const formattedMessage = this.formatMessage(level, message);
        fs.appendFileSync(this.logFilePath, formattedMessage);
    }

    public info(message: Record<string, any>): void {
        this.writeLog('INFO', message);
    }

    public warn(message: Record<string, any>): void {
        this.writeLog('WARN', message);
    }

    public error(message: Record<string, any>): void {
        this.writeLog('ERROR', message);
    }

    public debug(message: Record<string, any>): void {
        this.writeLog('DEBUG', message);
    }
}

// Export a singleton instance
export const logger = Logger.getInstance(); 