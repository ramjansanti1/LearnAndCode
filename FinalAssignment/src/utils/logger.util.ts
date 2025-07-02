import fs from 'fs';
import path from 'path';
import { LogLevel } from '../types/types';

export class Logger {
    private logFilePath: string = '';
    private enableFileLogging: boolean;

    constructor(logDir: string = 'logs', fileName: string = 'app.log', enableFileLogging: boolean = true) {
        this.enableFileLogging = enableFileLogging;
        if (this.enableFileLogging) {
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            this.logFilePath = path.join(logDir, fileName);
        }
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    }

    private writeToFile(log: string) {
        if (this.enableFileLogging && this.logFilePath) {
            fs.appendFileSync(this.logFilePath, log + '\n', { encoding: 'utf-8' });
        }
    }

    info(message: string) {
        const log = this.formatMessage('info', message);
        console.log(log);
        this.writeToFile(log);
    }

    warn(message: string) {
        const log = this.formatMessage('warn', message);
        console.warn(log);
        this.writeToFile(log);
    }

    error(message: string) {
        const log = this.formatMessage('error', message);
        console.error(log);
        this.writeToFile(log);
    }

    debug(message: string) {
        const log = this.formatMessage('debug', message);
        if (process.env.NODE_ENV === 'development') {
            console.debug(log);
        }
        this.writeToFile(log);
    }
}
