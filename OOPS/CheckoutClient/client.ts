const { Checkout } = require('./clientClass');

const checkoutService = new Checkout('./request.json', 'http://localhost:3000/checkout');

checkoutService.checkoutCall();