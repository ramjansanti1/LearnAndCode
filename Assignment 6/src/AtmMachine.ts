const messageConstants = require('./message.constants');
const utilsFunctions = require('./Utils');

class ATMMachine {
    private card: { [key: string]: any };

    constructor(card: { [key: string]: any }) {
        this.card = card;
    }

    checkBalance() {
        return this.card.balance;
    }

    addMoney(addedAmount: number) {
        this.card.balance += addedAmount;
    }

    withdrawMoney(requestedMoney: number) {
        if (requestedMoney > this.card.balance) {
            utilsFunctions.throwCustomError(messageConstants.INSUFFICIENT_BALANCE);
        }
        if (requestedMoney > (this.card.dailyLimit - this.card.moneyWithdrawn)) {
            utilsFunctions.throwCustomError(messageConstants.DAILY_LIMIT);
        }
        this.card.balance -= requestedMoney;
        this.card.moneyWithdrawn += requestedMoney;
    }
}

module.exports = ATMMachine;