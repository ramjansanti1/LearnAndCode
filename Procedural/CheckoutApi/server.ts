const express = require('express');
const { connectDB } = require('./dbConnect.js');
const { addCheckout, getCheckout } = require('./controller.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app
    .post('/checkout', (req: any, res: any) => {
        addCheckout(req, res);
    })
    .get('/checkout', (req: any, res: any) => {
        getCheckout(req, res);
    });


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
