/**
* Function that return an object that contains all the temperatures for the 7 next days, hours by hours.
* 
* @param {Number} latitude the latitude of the targeted location
* @param {Number} longitude the longitude of the targeted location
* @returns An object containing all the temperatures. Can throw an error if the API is unreachable
*/
async function getTemperatureAtLocation(latitude, longitude) {
    
    const allInfos = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`)

    if (allInfos.ok) {
        return allInfos.json()
    }
    else {
        throw new Error("Impossible de charger les données")
    }

}

/**
* Function that return an object that contains the humidity values for the 7 next days, hours by hours.
* 
* @param {Number} latitude the latitude of the targeted location
* @param {Number} longitude the longitude of the targeted location
* @returns An object containing the humidity values. Can throw an error if the API is unreachable
*/
async function getValuesAtLocation(latitude, longitude, valueToGet) {
    
    const allInfos = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${valueToGet}`)

    if (allInfos.ok) {
        return allInfos.json()
    }
    else {
        throw new Error("Impossible de charger les données")
    }

}

