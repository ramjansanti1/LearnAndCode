import readline from 'readline';

export default class Utils {
    private rl: any;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    askQuestion(query: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(query, (answer: string) => {
                resolve(answer);
            });
        });
    }

    displayTable(title: string, data: any[], fields: string[]) {
        if (!Array.isArray(data) || data.length === 0) {
            console.log(`\n=== ${title} ===`);
            console.log("No data found.\n");
            return;
        }
        console.log(`\n=== ${title} ===\n`);
        data.forEach((item, index) => {
            console.log(`----- ${title} #${index + 1} -----`);
            fields.forEach((field) => {
                console.log(`${this.formatLabel(field)}: ${item[field] ?? 'N/A'}`);
            });
            console.log();
        });
    }
    
    private formatLabel(label: string): string {
        return label
            .replace(/([a-z])([A-Z])/g, '$1 $2')  
            .replace(/_/g, ' ')                  
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }
}