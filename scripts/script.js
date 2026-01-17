let loadedValues = new Map()
let currentDay = 0
/*
    Function that loads the informations from the API from the latitude and the longitude given by the user.
*/
async function loadInformations() {
    let latitude = parseFloat(document.querySelector("#latitudeInput").value)
    let longitude = parseFloat(document.querySelector("#longitudeInput").value)


    //Checking if the values given by the user are corrects
    if (!isNaN(latitude) && !isNaN(longitude)) {

        //Getting all the info from the API call
        const p = await getTemperatureAtLocation(latitude, longitude)
        splitValuesDayByDay(p.hourly)
        displayInfosOfDay(currentDay)

    }
    else {
        alert("Veuillez rentrer une latitude et une longitude")
    }


}

function splitValuesDayByDay(values) {
    let tempTime = [values.time[0]]
    let tempTemperature = [Math.round(values.temperature_2m[0])]
    let dayCounter = 0
    console.log(values)
    for(let i = 1; i < values.time.length; i++){

        //We compare the dates of the current tested value and the last
        if(values.time[i].split("T")[0] !== values.time[i-1].split("T")[0]){
            //Adding the value to the loadedDatas
            loadedValues.set(dayCounter, new DayValues(values.time[i-1].split("T")[0], tempTime, tempTemperature))
            tempTime = []
            tempTemperature = []
            dayCounter++
        }

        tempTime.push(values.time[i])
        tempTemperature.push(Math.round(values.temperature_2m[i]))

    }
    loadedValues.set(dayCounter, new DayValues(values.time[values.time.length-1].split("T")[0], tempTime, tempTemperature))
    console.log(loadedValues)

}

function displayInfosOfDay(day) {
    let datas = document.querySelector("#datas")
    let valuesToDisplay = loadedValues.get(day)
    let weatherInformations = document.createElement("div")
    weatherInformations.classList.add("weatherInformations")

    //Setting the title of the datas as the day displayed
    let dayDisplayed = document.createElement("h2")
    dayDisplayed.textContent = valuesToDisplay.day.slice(5)
    weatherInformations.appendChild(dayDisplayed)

    //Browsing all the datas
    for (let i = 0; i < valuesToDisplay.time.length; i++) {
        //Creating the elements
        dataLine = document.createElement("div")
        let time = document.createElement("p")
        let temperature = document.createElement("p")
        dataLine.classList.add("dataLine")

        //Adding the corresponding value to the elements
        time.textContent = valuesToDisplay.time[i].split("T")[1]
        temperature.textContent = `${valuesToDisplay.temperature[i]} °C`

        //Adding the elements to the page
        dataLine.appendChild(time)
        dataLine.appendChild(temperature)
        weatherInformations.appendChild(dataLine)
    }
    //Replacing the current displayed infos by the ones resquested
    datas.children[0].replaceWith(weatherInformations)

}