const ops = require('./Operations');
const promptUser = require('prompt-sync')();
const stringConstant = require("./message.constants");
const util = require('./Utils');

class AuthService {
    private atmCard: { [key: string]: any };
    private isServerConnected: boolean = util.simulateServerResponse();

    constructor(atmCard: { [key: string]: any }) {
        this.atmCard = atmCard;
    }

    login(): void {
        try {
            while (this.atmCard.numberOfAttempts > 0 && !this.atmCard.isBlocked) {
                if (this.authenticateUser()) {
                    this.startATMOperations();
                    return;
                }
            }
            if (this.atmCard.numberOfAttempts === 0) {
                this.blockCard();
            }
        } catch (error: any) {
            console.log(`${stringConstant.LOGIN_FAILED}${error.message}`);
        }
    }

    private authenticateUser() {
        const pin = util.getIntegerInput(stringConstant.ENTER_PIN);
        this.checkConnecton();
        if (this.validatePin(pin)) {
            return true;
        }
        else {
            this.handleInValidPin();
        }
    }

    private checkConnecton() {
        if (!this.isServerConnected) {
            util.throwCustomError(stringConstant.SERVER_ERROR);
        }
    }

    private validatePin(pin: number): boolean {
        return this.atmCard.pin === pin;
    }

    private handleInValidPin() {
        this.decrementAttempts();
        console.log(`${stringConstant.WRONG_PIN} ${this.atmCard.numberOfAttempts}`);
    }

    private decrementAttempts(): void {
        this.atmCard.numberOfAttempts -= 1;
    }

    private startATMOperations(): void {
        const operations = new ops(this.atmCard);
        while (true) {
            operations.giveChoices();
        }
    }

    private blockCard(): void {
        this.atmCard.isBlocked = true;
        util.throwCustomError(stringConstant.CARD_BLOCKED);
    }
}


module.exports = AuthService;
