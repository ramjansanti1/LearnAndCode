class Marks {
    subject: string;
    marks: number;

    constructor(subject: string, marks: number) {
        this.subject = subject;
        this.marks = marks;
    }
}

class Student {
    name: string;
    rollNumber: number;
    marksArray: Marks[];

    constructor(name: string, rollNumber: number, marksArray: Marks[]) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.marksArray = marksArray;
    }
}

const display = (selectedRollNumber: number, studentsArray: Student[]): void => {
    const maximumMarksPerSubject = 100;
    const selectedStudent = studentsArray.find(student => student.rollNumber === selectedRollNumber);
    if (!selectedStudent) {
        console.log("Not found: " + selectedRollNumber);
        return;
    }
    const totalMarks = selectedStudent.marksArray.reduce((sum, subjectMarks) => sum + subjectMarks.marks, 0);
    const percentage = (totalMarks / (selectedStudent.marksArray.length * maximumMarksPerSubject)) * maximumMarksPerSubject;

    console.log("Name: " + selectedStudent.name);
    console.log("Roll: " + selectedStudent.rollNumber);
    console.log("Details:");
    selectedStudent.marksArray.forEach(subjectObject => {
        console.log(" " + subjectObject.subject + ": " + subjectObject.marks);
    });
    console.log("Total: " + totalMarks);
    console.log("Percentage: " + percentage.toFixed(2) + "%");
    console.log("----------------------");
};

const studentsArray: Student[] = [
    new Student("A", 101, [new Marks("Maths", 85), new Marks("English", 90), new Marks("Science", 78)]),
    new Student("B", 102, [new Marks("Maths", 70), new Marks("English", 88), new Marks("Science", 92)]),
    new Student("C", 103, [new Marks("Maths", 95), new Marks("English", 80), new Marks("Science", 85)]),
];

display(102, studentsArray);