const AtmMachine = require('./AtmMachine');
const messageConstant = require('./message.constants');
const utils = require('./Utils');

class Operations {
    private atmMachine;

    constructor(card: { [key: string]: any }) {
        this.atmMachine = new AtmMachine(card);
    }

    giveChoices() {
        this.showMenu();
        const choice = utils.getIntegerInput(messageConstant.SELECT_OPTION);
        this.getOperationFunction(choice);
    }

    private showMenu() {
        console.log();
        console.log(messageConstant.CHECK_BALANCE_CHOICE);
        console.log(messageConstant.ADD_MONEY_CHOICE);
        console.log(messageConstant.WITHDRAW_MONEY_CHOICE);
        console.log(messageConstant.EXIT_CHOICE);
    }

    private addAmount() {
        const moneyAdded = utils.getIntegerInput(messageConstant.ENTER_DEPOSIT);
        this.atmMachine.addMoney(moneyAdded);
        utils.displayAmount(this.atmMachine);
    }

    private withdrawMoney() {
        try {
            const requestedMoney = utils.getIntegerInput(messageConstant.ENTER_WITHDRAW);
            this.atmMachine.withdrawMoney(requestedMoney);
            utils.displayAmount(this.atmMachine);
        }
        catch (error: any) {
            console.log(error.message);
        }
    }

    private getOperationFunction(choice: number) {
        switch (choice) {
            case 1:
                utils.displayAmount(this.atmMachine);
                break;
            case 2:
                this.addAmount();
                break;
            case 3:
                this.withdrawMoney();
                break;
            default:
                process.exit();
        }
    }
}

module.exports = Operations;