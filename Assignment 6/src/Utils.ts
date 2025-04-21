const promptSync = require('prompt-sync')();
const constants = require('./message.constants');
const customError = require('./CustomError');

class Utils {
    static throwCustomError(message: string) {
        throw new customError(message);
    }

    static getIntegerInput(message: string) {
        return parseInt(promptSync(message), 10);
    }

    static displayAmount(atmMachine: any) {
        console.log(`${constants.AVAILABLE_BALANCE}${atmMachine.checkBalance()}`);
    }

    static getRandomNumber(): number {
        return Math.floor(Math.random() * 100) + 1;
    }

    static simulateServerResponse(): boolean {
        return Utils.getRandomNumber() % 2 === 0;
    }
}

module.exports = Utils;