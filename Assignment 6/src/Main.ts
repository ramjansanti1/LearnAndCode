const authService = require('./AuthService');

const atmCard = {
    cardNumber: 123456789,
    isBlocked: false,
    pin: 3232,
    dailyLimit: 25000,
    moneyWithdrawn: 0,
    numberOfAttempts: 3,
    balance: 100000
};

const atmLogin = new authService(atmCard);
atmLogin.login();