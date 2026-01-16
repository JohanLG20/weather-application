async function getAllInfos(latitude, longitude) {
    const allInfos = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`)

    if(allInfos.ok){
       return allInfos.json()
    }
    else{
        throw new Error("Impossible de charger les données")
    }


}
