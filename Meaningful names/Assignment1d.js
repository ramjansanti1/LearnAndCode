var Marks = /** @class */ (function () {
    function Marks(subject, marks) {
        this.subject = subject;
        this.marks = marks;
    }
    return Marks;
}());
var Student = /** @class */ (function () {
    function Student(name, rollNumber, marksArray) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.marksArray = marksArray;
    }
    return Student;
}());
var display = function (selectedRollNumber, studentsArray) {
    var maximumMarksPerSubject = 100;
    var selectedStudent = studentsArray.find(function (student) { return student.rollNumber === selectedRollNumber; });
    if (!selectedStudent) {
        console.log("Not found: " + selectedRollNumber);
        return;
    }
    var totalMarks = selectedStudent.marksArray.reduce(function (sum, subjectMarks) { return sum + subjectMarks.marks; }, 0);
    var percentage = (totalMarks / (selectedStudent.marksArray.length * maximumMarksPerSubject)) * maximumMarksPerSubject;
    console.log("Name: " + selectedStudent.name);
    console.log("Roll: " + selectedStudent.rollNumber);
    console.log("Details:");
    selectedStudent.marksArray.forEach(function (subjectObject) {
        console.log(" " + subjectObject.subject + ": " + subjectObject.marks);
    });
    console.log("Total: " + totalMarks);
    console.log("Percentage: " + percentage.toFixed(2) + "%");
    console.log("----------------------");
};
var studentsArray = [
    new Student("A", 101, [new Marks("Maths", 85), new Marks("English", 90), new Marks("Science", 78)]),
    new Student("B", 102, [new Marks("Maths", 70), new Marks("English", 88), new Marks("Science", 92)]),
    new Student("C", 103, [new Marks("Maths", 95), new Marks("English", 80), new Marks("Science", 85)]),
];
display(102, studentsArray);
