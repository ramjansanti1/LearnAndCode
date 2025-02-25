class Employee {
    private name: string;
    private age: number;
    private salary: number;
    
    public getName(): string { 
        return this.name;
    }
    
    public setName(name: string): void {
        this.name = name;
    }
    
    public getAge(): number {
        return this.age;
    }
    
    public setAge(age: number) {
        this.age = age;
    }
    
    public getSalary(): number {
        return this.salary;
    }
    
    public setSalary(salary: number): void{
        this.salary = salary;
    };
};
    
// Employee employee;

//  Is 'employee' an object or a data structure? Why?

/* The 'employee' here is a data structure as there are no behaviours in the Employee class,
this signifies that the 'employee' is a data structure with just getters and setters for the
class variables */