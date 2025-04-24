export interface Controller {
    sendResponse(res: any, message: string, statusCode: number, data?: any): void;
    getQuery(): string;
}