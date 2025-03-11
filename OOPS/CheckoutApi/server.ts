const express = require('express');
const { Database } = require('./Config/dbConnect');
const { AddCheckout } = require('./Controllers/AddCheckoutController');
const { GetCheckout } = require('./Controllers/GetCheckoutController');

const app = express();
const PORT = 3000;
const db = new Database();
const addCheckoutController = new AddCheckout();
const getCheckoutController = new GetCheckout();

app.use(express.json());

app
    .post('/checkout', (req: any, res: any) => {
        addCheckoutController.addCheckout(req, res, db);
    })
    .get('/checkout', (req: any, res: any) => {
        getCheckoutController.getCheckout(req, res, db);
    });

db.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
