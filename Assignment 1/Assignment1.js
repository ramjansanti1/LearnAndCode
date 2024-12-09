"use strict";
exports.__esModule = true;
var promptSync = require("prompt-sync");
var prompt = promptSync();
var countryCodes = {
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
function getCountryName(code) {
    return countryCodes[code];
}
function main() {
    var countryCode = prompt("Enter a country code (e.g., IN, US, NZ): ").toUpperCase();
    var countryName = getCountryName(countryCode);
    if (countryName) {
        console.log("You have entered: ".concat(countryName));
    }
    else {
        console.log("Invalid country code entered. Please try again.");
    }
}
main();
