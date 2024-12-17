// Does this Book class follow SRP?  NO
// This Book class is not following SRP
// There are functions that are performing different functionalities
// Can be restructured in a better way
class Book {
    getTitle() {
        return "A Great Book";
    }

    getAuthor() {
        return "John Doe";
    }

    turnPage() {
        // pointer to next page
    }

    getCurrentPage() {
        return "current page content";
    }

    getLocation() {
        // returns the position in the library
        // ie. shelf number & room number
    }

    save() {
        const filename = `/documents/${this.getTitle()} - ${this.getAuthor()}`;
        this.writeToFile(filename, this);
    }

    writeToFile(filename: string, book: Book) {
        // Implementation to save in file
    }
}

interface Printer {
    printPage(page: any): void;
}

class PlainTextPrinter implements Printer {
    printPage(page: any) {
        console.log(page);
    }
}

class HtmlPrinter implements Printer {
    printPage(page: any) {
        console.log(`<div style="single-page">${page}</div>`);
    }
}