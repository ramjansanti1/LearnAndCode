const GeoCodeLocateApi = require('./geoCodeApi');
const promptSync = require('prompt-sync')();
require('dotenv').config();

class GeoLocater {
    private geoCodeApi: any;

    constructor() {
        this.geoCodeApi = new GeoCodeLocateApi(process.env.GEOCODING_API_KEY);
    }

    private getUserInput() {
        const area = promptSync("Please enter the Area: ");
        const city = promptSync("Please enter the City: ");

        return { area, city };
    }

    async getCoordinates() {
        try {
            const userInput = this.getUserInput();
            const coordinates = await this.geoCodeApi.getCoordinates(userInput);
            return coordinates;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = GeoLocater;
