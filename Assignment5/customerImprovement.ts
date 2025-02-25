class Customer {
    private firstName: string;
    private lastName: string;
    private myWallet: Wallet;

    constructor(firstName: string, lastName: string, myWallet: Wallet) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.myWallet = myWallet;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getWallet(): Wallet {
        return this.myWallet;
    }
}

class Wallet {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    public getTotalMoney(): number {
        return this.value;
    }

    public setTotalMoney(newValue: number) {
        this.value = newValue;
    }

    public addMoney(deposit: number) {
        this.value += deposit;
    }

    public subtractMoney(debit: number) {
        this.value -= debit;
    }
}

// Client code…. assuming some delivery boy wants to get his payment
// code from some method inside the delivery boy class... payment = 2.00; //
// “I want my two dollars!”

let firstName: string = "Ramjan", lastName: string = "Santi", payment: number = 200;

const myCustomer = new Customer(firstName, lastName, new Wallet(100));
const theWallet = myCustomer.getWallet();

if (theWallet.getTotalMoney() > payment) {
    theWallet.subtractMoney(payment);
    console.log(`Payment successful`);
    console.log(`Remaining Balance: ${theWallet.getTotalMoney()}`);
} else {
    console.log(`Payment failed`);
    console.log(`Remaining Balance: ${theWallet.getTotalMoney()}`);
}