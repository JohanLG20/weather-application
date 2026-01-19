/*
    Search button
*/
let searchButton = document.querySelector("#searchButton")

searchButton.addEventListener("click", () => {
    let valueToObserve = document.querySelector("#valueToObserve").value
    let latitude = parseFloat(document.querySelector("#latitudeInput").value)
    let longitude = parseFloat(document.querySelector("#longitudeInput").value)

    if (!isNaN(latitude) && !isNaN(longitude)) {
        switch (valueToObserve) {
            case "temperature":
                loadInformations(latitude, longitude, "temperature_2m")
                break;

            case "humidity":
                loadInformations(latitude, longitude, "relative_humidity_2m")
                break;

            case "wind":
                loadInformations(latitude, longitude, "wind_speed_10m")
                break;
            default:
                alert('Une erreur est survenue, veuillez réessayer')
        }

        let datas = document.querySelector("#datas")
        datas.classList.remove("hidden")
        datas.classList.add("visible")
        
    }
    else {
        alert('Veuillez entrer une latitude et une longitude comprise entre -90 et 90')
    }
})
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

    displayInfosOfDay(currentDay)
    displayGraphicInfosOfDay(currentDay)
})

nextDayButton.addEventListener("click", () => {

    if (previousDayButton.disabled) previousDayButton.disabled = false

    currentDay++
    if (currentDay === loadedValues.size -1) {
        nextDayButton.disabled = true
    }
    
    displayInfosOfDay(currentDay)
    displayGraphicInfosOfDay(currentDay)
})

