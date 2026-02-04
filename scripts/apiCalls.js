
/**
* Function that return an object that contains the humidity values for the 7 next days, hours by hours.
* 
* @param {Number} latitude the latitude of the targeted location
* @param {Number} longitude the longitude of the targeted location
* @returns An object containing the humidity values. Can throw an error if the API is unreachable
*/
async function getValuesAtLocation(latitude, longitude, valueToGet) {

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${valueToGet}`)

        if (!response.ok) {
            throw new Error(`Impossible de charger les données. Code : ${response.status}`)
        }

        const allInfos = await response.json()

        return allInfos

    }
    catch(err){
        console.log(err)
    }
    
    

}

