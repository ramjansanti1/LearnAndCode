const { client } = require('./dbConnect');

function getQuery(req: any): string {
    let query: string = '';
    if (req.method === 'GET') {
        query = `SELECT * FROM checkout`;
    }
    else if (req.method === 'POST') {
        query = `INSERT INTO checkout (productDetails, quantity, priceDetails, paymentMethod, discount, shippingMethod, subTotal, total)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
    }
    return query;
}

function sendResponse(res: any, message: string, statusCode: number, data?: any) {
    res.status(statusCode).json({ message: message, order: data });
}

function getProcessedData(req: any) {
    let processedData: any[] = [];
    if (req.method === 'GET') {
        processedData = [];
    }
    else if (req.method === 'POST') {
        const { productDetails, quantity, priceDetails, paymentMethod, discount, shippingMethod, subTotal, total } = req.body;
        processedData = [productDetails, quantity, priceDetails, paymentMethod, discount, shippingMethod, subTotal, total];
    }
    return processedData;
}

async function addCheckout(req: any, res: any) {
    try {
        const query = getQuery(req);
        const values = getProcessedData(req);

        const result = await client.query(query, values);

        sendResponse(res, 'Order saved successfully', 201, result.rows[0]);
    } catch (error) {
        sendResponse(res, 'Internal Server Error', 500);
    }
}

async function getCheckout(req: any, res: any) {
    try {
        const query = getQuery(req);
        const result = await client.query(query);

        sendResponse(res, 'Order fetched successfully', 200, result.rows);
    } catch (error) {
        sendResponse(res, 'Internal Server Error', 500);
    }
}

export { addCheckout, getCheckout }