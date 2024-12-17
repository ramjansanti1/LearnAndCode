// Does this Employee class follow SRP?  NO
// This Employee class is not following SRP
// There are functions that are performing different functionalities
// Can be restructured in a better way
class Employee {
    id: number | undefined;
    name: string | undefined;
    department: string | undefined;
    working: boolean | undefined;

    saveEmployeeTODatabase() { }

    printEmployeeDetailReportXML() { }

    printEmployeeDetailReportCSV() { }

    terminateEmployee() { }

    isWorking(): boolean {
        return true;
    }
}; 