async function loadInformations(){
    let latitude = parseFloat(document.querySelector("#latitudeInput").value)
    let longitude = parseFloat(document.querySelector("#longitudeInput").value)

    if(!isNaN(latitude) && !isNaN(longitude)){ 
        const p = await getAllInfos(latitude, longitude)
        console.log(p)
    }
    else{
        
        alert("Veuillez rentrer une latitude et une longitude")
    }


}