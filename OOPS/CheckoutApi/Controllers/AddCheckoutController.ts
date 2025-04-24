import { Controller } from "../Interaces/controllerInterface";

export class AddCheckout implements Controller {
    getQuery() {
        return `INSERT INTO checkout (productDetails, quantity, priceDetails, paymentMethod, discount, shippingMethod, subTotal, total)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
    }

    sendResponse(res: any, message: string, statusCode: number, data?: any) {
        res.status(statusCode).json({ message: message, order: data });
    }

    getProcessedRequest(req: any): any[] {
        const { productDetails, quantity, priceDetails, paymentMethod, discount, shippingMethod, subTotal, total } = req.body;
        return [productDetails, quantity, priceDetails, paymentMethod, discount, shippingMethod, subTotal, total];
    }

    async addCheckout(req: any, res: any, db: any) {
        try {
            const query = this.getQuery();
            const values = this.getProcessedRequest(req);
            
            const result = await db.client.query(query, values);
            
            this.sendResponse(res, 'Order saved successfully', 201, result.rows[0]);
        } catch (error) {
            this.sendResponse(res, 'Internal Server Error', 500);
        }
    }
}