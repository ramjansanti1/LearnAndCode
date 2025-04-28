class MESSAGES {
    static menuTitle: "\nTO-DO MENU\n";

    static menuOptions: [
        "1. Add Task",
        "2. Remove Task",
        "3. Mark Task as Done",
        "4. List All Tasks",
        "5. Exit"
    ];

    static promptChoice: "Select an option (1-5): ";

    static promptTaskDescription: "Enter task description: ";

    static promptRemoveTask: "Enter task number to remove: ";

    static promptMarkDone: "Enter task number to mark as done: ";

    static taskAdded: "Task added successfully!";

    static taskEmptyWarning: "Task description cannot be empty.";

    static noTasksToRemove: "No tasks to remove.";

    static invalidTaskNumber: "Invalid task number.";

    static noTasksToComplete: "No tasks to mark as completed.";

    static taskListEmpty: "Your task list is empty.";

    static currentTasks: "\nCurrent Tasks:";

    static exitMessage: "Exiting To-Do App. Goodbye!";

    static invalidChoice: "Invalid choice. Please try again.";
};

enum Choice {
    AddTask,
    Removetask,
    MarkTaskAsCompleted,
    ListTasks,
    Exit
}

module.exports = { MESSAGES, Choice };