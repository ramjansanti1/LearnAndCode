const axios = require('axios');
require('dotenv').config();

class GeoCodeApi {
    private apiKey: string;

    constructor(apiKey: string | undefined) {
        this.apiKey = apiKey || '';
    }

    private getApiUrl(userInputArea: { [key: string]: any }) {
        return `${process.env.API_END_POINT}?address=${userInputArea.area}+${userInputArea.city}&key=${this.apiKey}`
    }

    private async getData(userInputArea: { [key: string]: any }) {
        const geoCodeData = await axios.get(this.getApiUrl(userInputArea));
        return geoCodeData.data;
    }

    async getCoordinates(userInputArea: { [key: string]: any }) {
        const geoCodeData = await this.getData(userInputArea);

        return geoCodeData.results[0].geometry.location;
    }
}

module.exports = GeoCodeApi;
