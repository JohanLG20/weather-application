/*
    Search buttons
*/
let searchButtonLatLong = document.querySelector("#searchButtonLatLong")

searchButtonLatLong.addEventListener("click", async () => {
    let valueToObserve = document.querySelector("#valueToObserve").value
    let latitude = parseFloat(document.querySelector("#latitudeInput").value)
    let longitude = parseFloat(document.querySelector("#longitudeInput").value)

    if (!isNaN(latitude) && !isNaN(longitude)) {
        //Loading the information
        if (valueToObserve === "temperature") await loadInformations(latitude, longitude, "temperature_2m")
        else if (valueToObserve === "humidity") await loadInformations(latitude, longitude, "relative_humidity_2m")
        else if (valueToObserve === "wind") await loadInformations(latitude, longitude, "wind_speed_10m")
        else alert('Une erreur est survenue, veuillez réessayer')

        //Make the data visible
        let datas = document.querySelector("#datas")
        datas.classList.remove("hidden")
        datas.classList.add("visible")

        displayRequestedDataForm() //Displaying the information
        

    }
    else {
        alert('Veuillez entrer une latitude et une longitude comprise entre -90 et 90')
    }
})

let searchButtonAddress = document.querySelector("#searchButtonAddress")

searchButtonAddress.addEventListener("click", ()=>{
    alert("yiha")
})
/*
    Preview Menu Type selection buttons
*/
let displayTypePreview = document.querySelectorAll(".menuFormPreview")

displayTypePreview.forEach((but) => but.addEventListener("click", (e) => {
    removeClassForAll(displayTypePreview, "menuFormPreviewActive")
    e.target.classList.add("menuFormPreviewActive")
    displayRequestedDataForm()    
    switch(e.target.id){
        case "textVersion":
            toggleDataTypeView("weatherInformations")
            break;
        
        case "graphicVersion":
            toggleDataTypeView("canvas")
            break;
    }

}))



/*
    Previous/next day buttons
*/
let previousDayButton = document.querySelector("#previousDayButton")
let nextDayButton = document.querySelector("#nextDayButton")

previousDayButton.addEventListener("click", () => {
    //Enabling the next button if it's dis
    if (nextDayButton.disabled) nextDayButton.disabled = false

    currentDay--
    if (currentDay === 0) {
        previousDayButton.disabled = true
    }

    displayRequestedDataForm()
})

nextDayButton.addEventListener("click", () => {

    if (previousDayButton.disabled) previousDayButton.disabled = false

    currentDay++
    if (currentDay === loadedValues.size - 1) {
        nextDayButton.disabled = true
    }

    displayRequestedDataForm()

})


/* 
    Switching search menu
*/
let searchMenuTypesIcons = document.querySelectorAll(".switchMenuIcon")
searchMenuTypesIcons.forEach((icons) =>{
    icons.addEventListener("click", (e) => {
        console.log(e.target.id)
        switch(e.target.id){
            case "latAndLongIcons":
                toogleSearchMenu("searchAddress")
                break;
            case "searchAddressIcons":
                toogleSearchMenu("latitudeAndLongitude")
                break;
            
        }
    })
})