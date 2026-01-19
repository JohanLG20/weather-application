let loadedValues = new Map()
let currentDay = 0

/*
    Function that loads the informations from the API from the latitude and the longitude given by the user.
*/
async function loadInformations(latitude, longitude, infoToLoad) {
    //Getting all the info from the API call
    const p = await getValuesAtLocation(latitude, longitude, infoToLoad)
    loadedValues = splitValuesDayByDay(p.hourly, infoToLoad)
    displayInfosOfDay(currentDay)
    displayGraphicInfosOfDay(currentDay)

}

/* 
    Function that return a map where each value is a DayValue that contain all the values for one day.
    Parameter : -values : An object that contain two arrays, one for the time and the other for the temperature
    Return : A map object of DayValue
*/
function splitValuesDayByDay(values, infoToLoad) {

    let splittedValue = new Map()
    let tempTime = [values.time[0].split("T")[1]] // We get only the hour and not the full date
    let tempValue = [Math.round(Object.values(values)[1][0])]
    let dayCounter = 0

    for (let i = 1; i < values.time.length; i++) {

        //We compare the dates of the current tested value and the last
        if (values.time[i].split("T")[0] !== values.time[i - 1].split("T")[0]) {
            //Adding the value to the loadedDatas
            splittedValue.set(dayCounter, new DayValues(values.time[i - 1].split("T")[0], infoToLoad,tempTime, tempValue))
            tempTime = []
            tempValue = []
            dayCounter++
        }

        tempTime.push(values.time[i].split("T")[1]) // We get only the hour and not the full date
        tempValue.push(Math.round(Object.values(values)[1][i]))

    }
    splittedValue.set(dayCounter, new DayValues(values.time[values.time.length - 1].split("T")[0], infoToLoad, tempTime, tempValue))

    return splittedValue

}

/*
    Build a div that will contains all the datas of the current day. This div will replace the current one.
    Parameter : - day : A number that contains the day we want to display
*/
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
        let val = document.createElement("p")
        dataLine.classList.add("dataLine")

        //Adding the corresponding value to the elements
        time.textContent = valuesToDisplay.time[i]
        val.textContent = `${valuesToDisplay.values[i]}${getCorrectMeasure(valuesToDisplay.valueDisplayed)}` //We add the unit after the value

        //Adding the elements to the page
        dataLine.appendChild(time)
        dataLine.appendChild(val)
        weatherInformations.appendChild(dataLine)
    }

    //Replacing the current displayed infos by the ones resquested
    datas.children[1].replaceWith(weatherInformations)

}

function displayGraphicInfosOfDay(day){
    let datas = document.querySelector("#datas")
    let newCanva = document.createElement("canvas")
    newCanva.id = "canvas"

    console.log(document)
    new Chart(newCanva, {
        type:"line",
        data:{
            labels: loadedValues.get(day).time,
            datasets: [{
                label: getLabelForGraph(loadedValues.get(day).valueDisplayed),
                data: loadedValues.get(day).values,
                backgroundColor:["red"]
        }]
            
        }
    })

    datas.children[0].replaceWith(newCanva)

}

/*
    Return the unit of measure of the given parameter.
    Parameter : -info: A string that contain the unit we want. Note, the info as to be the parameter of the API to work
*/

function getCorrectMeasure(info){
    switch(info){
        case "temperature_2m":
            return "°"
            break;
        case "relative_humidity_2m":
            return "%"
            break;
        case "wind_speed_10m":
            return "kmh/h"
        default:
            return ""
    }
}

function getLabelForGraph(value){
    switch(value){
        case "temperature_2m":
            return "Température en °C"
            break;
        case "relative_humidity_2m":
            return "Humidité en %"
            break;
        case "wind_speed_10m":
            return "Vent en kmh/h"
        default:
            return ""
    }
}