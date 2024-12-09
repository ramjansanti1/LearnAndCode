import promptSync = require("prompt-sync");

const prompt = promptSync();

const countryCodes: { [key: string]: string } = {
    'IN': 'India',
    'US': 'United States',
    'NZ': 'New Zealand',
    'CA': 'Canada',
    'AU': 'Australia',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'BR': 'Brazil',
    'CN': 'China',
    'RU': 'Russia',
    'ZA': 'South Africa'
};

function getCountryName(code: string): string | undefined {
    return countryCodes[code];
}

function main() {
    const countryCode = prompt("Enter a country code (e.g., IN, US, NZ): ").toUpperCase();

    const countryName = getCountryName(countryCode);

    if (countryName) {
        console.log(`You have entered: ${countryName}`);
    } else {
        console.log("Invalid country code entered. Please try again.");
    }
}

main();