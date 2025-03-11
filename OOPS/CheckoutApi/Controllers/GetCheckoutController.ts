import { Controller } from "../Interaces/controllerInterface";

export class GetCheckout implements Controller {
    getQuery() {
        return `SELECT * FROM checkout`;
    }

    sendResponse(res: any, message: string, statusCode: number, data?: any) {
        res.status(statusCode).json({ message: message, order: data });
    }

    async getCheckout(req: any, res: any, db: any) {
        try {
            const query = this.getQuery();

            const result = await db.client.query(query);

            this.sendResponse(res, 'Order fetched successfully', 200, result.rows);
        } catch (error) {
            this.sendResponse(res, 'Internal Server Error', 500);
        }
    }
}