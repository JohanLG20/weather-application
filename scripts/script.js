let loadedValues = new Map()
let currentDay = 0

/*
    Function that loads the informations from the API from the latitude and the longitude given by the user.
*/
async function loadInformations(latitude, longitude, infoToLoad) {
    //Getting all the info from the API call
    const p = await getValuesAtLocation(latitude, longitude, infoToLoad)
    loadedValues = splitValuesDayByDay(p.hourly, infoToLoad)

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
            splittedValue.set(dayCounter, new DayValues(values.time[i - 1].split("T")[0], infoToLoad, tempTime, tempValue))
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
    Populate the div #weatherInformations with all the informations of the current day
    Parameter : - day : A number that contains the day we want to display
*/
function displayInfosOfDay(day) {
    let dataPreview = document.querySelector("#dataPreview")
    let valuesToDisplay = loadedValues.get(day)

    /*let weatherInformations = document.createElement("div")
    weatherInformations.id = "weatherInformations"
    weatherInformations.classList.add("dataDisplayer") //used for the toggleDataTypeView function*/

    setTitle(loadedValues.get(day).day)

    let weatherInformations = document.querySelector("#weatherInformations")
    
    if(weatherInformations.children.length > 0){
        for(let i = weatherInformations.children.length - 1; i >=0 ;i--){
            weatherInformations.removeChild(weatherInformations.children[i])
        }//Remove all the lines of the children
        
    }
    

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
   // dataPreview.children[2].replaceWith(weatherInformations)

}

function displayGraphicInfosOfDay(day) {

    setTitle(loadedValues.get(day).day)

    let datasPreview = document.querySelector("#dataPreview")
    let newCanva = document.createElement("canvas")
    newCanva.id = "graph"

    const graph = new Chart(newCanva, {
        type: "line",
        data: {
            labels: loadedValues.get(day).time,
            datasets: [{
                label: getLabelForGraph(loadedValues.get(day).valueDisplayed),
                data: loadedValues.get(day).values,
                backgroundColor: ["red"]
            }]

        }
    })

    console.log(newCanva)
    datasPreview.children[1].children[0].replaceWith(newCanva)

}

function displayRequestedDataForm() {
    let displayTextVersion = document.querySelector("#textVersion")
    let displayGraphicVersion = document.querySelector("#graphicVersion")
    if (displayTextVersion.classList.contains("menuFormPreviewActive")) displayInfosOfDay(currentDay)
    else if (displayGraphicVersion.classList.contains("menuFormPreviewActive")) displayGraphicInfosOfDay(currentDay)
}

/*
    Return the unit of measure of the given parameter.
    Parameter : -info: A string that contain the unit we want. Note, the info as to be the parameter of the API to work
*/

function getCorrectMeasure(info) {
    switch (info) {
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

function getLabelForGraph(value) {
    switch (value) {
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

function removeClassForAll(elements, classToRemove){
    elements.forEach(elem => {
        elem.classList.remove(classToRemove)
    });
}

function setTitle(title){
    let dayDisplayed = document.querySelector("#datasTitle")
    dayDisplayed.textContent = title.slice(5)
   
}

function toggleDataTypeView(idOfViewVisible){
    let allViews = document.querySelectorAll(".dataDisplayer")
    console.log(allViews)
    allViews.forEach(elem => {
                                if(!elem.classList.contains("hidden")) elem.classList.add("hidden") //We put hidden to all the types of dataDisplayer views
                                if(elem.classList.contains("visible")) elem.classList.remove("visible")
                            }) 

    let viewToMakeVisible = document.querySelector(`#${idOfViewVisible}`)
    viewToMakeVisible.classList.remove("hidden")
    viewToMakeVisible.classList.add("visible")
    console.log(viewToMakeVisible)
}