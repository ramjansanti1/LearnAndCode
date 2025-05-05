const GeoLocaterClass = require('./GeoLocater');

(async () => {
    const geoLocater = new GeoLocaterClass();

    const coordinates = await geoLocater.getLocation();

    console.log(coordinates);
})();