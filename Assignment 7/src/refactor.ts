const promptSync = require('prompt-sync')();
const constant = require('./Constants');

type Task = {
    description: string;
    completed: boolean;
};

class TodoApp {
    private tasks: Task[] = [];

    public run(): void {
        while (true) {
            this.displayMenu();
            const choice = this.getUserChoice();

            switch (choice) {
                case 1:
                    this.addTask();
                    break;
                case 2:
                    this.removeTask();
                    break;
                case 3:
                    this.markTaskAsCompleted();
                    break;
                case 4:
                    this.listTasks();
                    break;
                case 5:
                    console.log(constant.exitMessage);
                    return;
                default:
                    console.log(constant.invalidChoice);
            }
        }
    }

    private displayMenu(): void {
        console.log(constant.menuTitle);
        MESSAGES.menuOptions.forEach(option => console.log(option));
    }

    private getUserChoice(): number {
        const input = promptSync(constant.promptChoice);
        return parseInt(input.trim());
    }

    private addTask(): void {
        const description = promptSync(constant.promptTaskDescription);
        if (description.trim()) {
            this.tasks.push({ description, completed: false });
            console.log(constant.taskAdded);
        } else {
            console.log(constant.taskEmptyWarning);
        }
    }

    private removeTask(): void {
        if (this.tasks.length === 0) {
            console.log(constant.noTasksToRemove);
            return;
        }

        this.listTasks();
        const index = parseInt(promptSync(constant.pro)) - 1;

        if (this.isValidIndex(index)) {
            const removedTask = this.tasks.splice(index, 1)[0];
            console.log(`Removed: "${removedTask.description}"`);
        } else {
            console.log(constant.invalidTaskNumber);
        }
    }

    private markTaskAsCompleted(): void {
        if (this.tasks.length === 0) {
            console.log(constant.noTasksToComplete);
            return;
        }

        this.listTasks();
        const index = parseInt(promptSync(constant.promptMarkDone)) - 1;

        if (this.isValidIndex(index)) {
            this.tasks[index].completed = true;
            console.log(`Marked "${this.tasks[index].description}" as completed.`);
        } else {
            console.log(constant.invalidTaskNumber);
        }
    }

    private listTasks(): void {
        if (this.tasks.length === 0) {
            console.log(constant.taskListEmpty);
            return;
        }

        console.log(constant.currentTasks);
        this.tasks.forEach((task, index) => {
            const status = task.completed ? "[✔]" : "[ ]";
            console.log(`${index + 1}. ${status} ${task.description}`);
        });
    }

    private isValidIndex(index: number): boolean {
        return index >= 0 && index < this.tasks.length;
    }
}

const app = new TodoApp();
app.run();
