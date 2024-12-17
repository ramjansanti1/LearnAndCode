interface Customer {
    CustomerID: number;
    CompanyName: string;
    ContactName: string;
    Country: string;
}

class CustomerSearch {
    SearchByCountry(customers: Customer[], country: string) {
        return customers
            .filter(customer => customer.Country.includes(country))
            .sort((a, b) => a.CustomerID - b.CustomerID);
    }

    searchByCompanyName(customers: Customer[], company: string): Customer[] {
        return customers
            .filter(customer => customer.CompanyName.includes(company))
            .sort((a, b) => a.CustomerID - b.CustomerID);
    }

    searchByContact(customers: Customer[], contact: string): Customer[] {
        return customers
            .filter(customer => customer.ContactName.includes(contact))
            .sort((a, b) => a.CustomerID - b.CustomerID);
    }

    exportToCSV(data: any[]): string {
        const rows: string[] = data.map(item => {
            return `${item.CustomerID},${item.CompanyName},${item.ContactName},${item.Country}`;
        });

        return rows.join("\n");
    }
} 