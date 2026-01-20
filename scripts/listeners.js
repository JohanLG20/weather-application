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
        await loadInformations(latitude, longitude, valueToObserve)

        displayRequestedDataForm() //Displaying the information
        

    }
    else {
        alert('Veuillez entrer une latitude et une longitude comprise entre -90 et 90')
    }
})

/*
    Input text modification
*/
let searchAddressInput = document.querySelector("#searchAddressInput")
searchAddressInput.addEventListener("input", () =>{
    let searchPreview = document.querySelector("#searchPreview")
    if(searchAddressInput.value.length > 2){ // The api doesn't return anything if there is too few characters   
        searchPreview.classList.remove("hidden")
        searchPreview.classList.add("visible")
        fetch(`https://data.geopf.fr/geocodage/search?q=${searchAddressInput.value}&limit=5`)
        .then(r => r.json())
            .then(preview => displaySearchPreview(preview.features))
        .catch((e) => console.log(e))

    }

    else{ //Hidding the preview
        hide(searchPreview)

    }
    
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