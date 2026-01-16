async function getTemperatureAtLocation(latitude, longitude) {
    const allInfos = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`)

    if(allInfos.ok){
       return allInfos.json()
    }
    else{
        throw new Error("Impossible de charger les données")
    }


}
