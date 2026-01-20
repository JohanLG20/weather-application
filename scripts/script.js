let loadedValues = new Map()
let currentDay = 0

/*
    Function that loads the informations from the API from the latitude and the longitude given by the user.
*/
async function loadInformations(latitude, longitude, infoToLoad) {

    const p = await getValuesAtLocation(latitude, longitude, infoToLoad)
    loadedValues = splitValuesDayByDay(p.hourly, Object.values(p.hourly_units)[1], infoToLoad) //We use this Object.values() to not have

}

/* 
    Function that return a map where each value is a DayValue that contain all the values for one day.
    Parameter : -values : An object that contain two arrays, one for the time and the other for the temperature
    Return : A map object of DayValue
*/
function splitValuesDayByDay(values, unit, infoToLoad) {

    let splittedValue = new Map()
    let tempTime = [values.time[0].split("T")[1]] // We get only the hour and not the full date
    let tempValue = [Math.round(Object.values(values)[1][0])]
    let dayCounter = 0

    for (let i = 1; i < values.time.length; i++) {

        //We compare the dates of the current tested value and the last
        if (values.time[i].split("T")[0] !== values.time[i - 1].split("T")[0]) {
            //Adding the value to the loadedDatas
            splittedValue.set(dayCounter, new DayValues(values.time[i - 1], tempTime, tempValue, unit, infoToLoad))
            tempTime = []
            tempValue = []
            dayCounter++
        }

        tempTime.push(values.time[i].split("T")[1]) // We get only the hour and not the full date
        tempValue.push(Math.round(Object.values(values)[1][i]))

    }
    splittedValue.set(dayCounter, new DayValues(values.time[values.time.length - 1], tempTime, tempValue, unit, infoToLoad))

    return splittedValue

}

/*
    Populate the div #weatherInformations with all the informations of the current day
    Parameter : - day : A number that contains the day we want to display
*/
function displayInfosOfDay(day) {
    
    let valuesToDisplay = loadedValues.get(day)

    setTitle(loadedValues.get(day).day)

    let weatherInformations = document.querySelector("#weatherInformations")

    if (weatherInformations.children.length > 0) {
        for (let i = weatherInformations.children.length - 1; i >= 0; i--) {
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
        val.textContent = `${valuesToDisplay.values[i]}${valuesToDisplay.unit}` //We add the unit after the value

        //Adding the elements to the page
        dataLine.appendChild(time)
        dataLine.appendChild(val)
        weatherInformations.appendChild(dataLine)
    }

}

/*
    Replace the last graph with a new graph that display all the datas of the requested day
    Parameter : - day : A number that contains the day we want to display
*/
function displayGraphicInfosOfDay(day) {
    let currenDayDisplayed = loadedValues.get(day)
    setTitle(currenDayDisplayed.day)

    let datasPreview = document.querySelector("#dataPreview")
    let newCanva = document.createElement("canvas")
    newCanva.id = "graph"

    let formatedLabel = currenDayDisplayed.unitDisplayed.replaceAll("_"," ")
    formatedLabel += " en "+currenDayDisplayed.unit
    formatedLabel = formatedLabel.replace(formatedLabel[0], formatedLabel[0].toUpperCase())
    
    const graph = new Chart(newCanva, {
        type: "line",
        data: {
            labels: currenDayDisplayed.time,
            datasets: [{
                label: formatedLabel,
                data: currenDayDisplayed.values,
                backgroundColor: ["red"]
            }]

        }
    })

    datasPreview.children[1].children[0].replaceWith(newCanva)

}

/*
    Function that call the display method that correspond to the type of datas the user want to display
*/
function displayRequestedDataForm() {
    //Make the data visible
    let datas = document.querySelector("#datas")
    datas.classList.remove("hidden")
    datas.classList.add("visible")

    let displayTextVersion = document.querySelector("#textVersion")
    let displayGraphicVersion = document.querySelector("#graphicVersion")
    if (displayTextVersion.classList.contains("menuFormPreviewActive")) displayInfosOfDay(currentDay)
    else if (displayGraphicVersion.classList.contains("menuFormPreviewActive")) displayGraphicInfosOfDay(currentDay)
}

/*
    Function that returns the value we want to display as the label for the graph
    Paramater : - value: The API name of the value we want to display
    Return : - a string which will be the label for the graph
*/
function getLabelForGraph(value) {
    switch (value) {
        case "temperature_2m":
            return "Température en °C"
            break;
        case "relative_humidity_2m":
            return "Humidité en %"
            break;
        case "wind_speed_10m":
            return "Vent en km/h"
        default:
            return ""
    }
}

/*
    Function that remove the class in all the given elements
    Parameter : -elements : An array of HTML elements
                -classToRemove : A string that is the class to remove
*/

function removeClassForAll(elements, classToRemove) {
    elements.forEach(elem => {
        elem.classList.remove(classToRemove)
    });
}

/*
    Set the title of the datas with the given title
    Parameter : -title : A string that is the title to give
*/
function setTitle(date) {
    let dayDisplayed = document.querySelector("#datasTitle")
    let title = new Date(date)

    dayDisplayed.textContent = title.toDateString()

}

/*
    Make the view of the given parameter visible and hide all other views of the options of the #dataPreview
    Parameter : -idOfViewToShow : A String that contains the id of the view we want to show
*/
function toggleDataTypeView(idOfViewToShow) {
    let allViews = document.querySelectorAll(".dataDisplayer")
    allViews.forEach(elem => {
        hide(elem)
    })

    let viewToMakeVisible = document.querySelector(`#${idOfViewToShow}`)
    show(viewToMakeVisible)
    
}

function toogleSearchMenu(idMenuToShow) {
    let allMenus = document.querySelectorAll(".searchMenuType")
    allMenus.forEach(elem => {
        hide(elem)
    })

    let viewToMakeVisible = document.querySelector(`#${idMenuToShow}`)
    show(viewToMakeVisible)

    let searchButtonLatLong = document.querySelector("#searchButtonLatLong")
    let searchButtonAddress = document.querySelector("#searchButtonAddress")
    if (idMenuToShow === "latitudeAndLongitude") {
        show(searchButtonLatLong)
        hide(searchButtonAddress)

    }
    else if (idMenuToShow === "searchAddress") {
        show(searchButtonAddress)
        hide(searchButtonLatLong)

    }
}

function displaySearchPreview(preview) {
    let searchPreview = document.querySelector("#searchPreview")

    for (let i = searchPreview.children.length - 1; i >= 0; i--) {
        searchPreview.removeChild(searchPreview.children[i])
    }

    preview.forEach((hint, index) => {
        let previewElement = document.createElement("p")
        previewElement.classList.add("searchPreviewItem")
        previewElement.textContent = `${Array.from(preview.values())[index].properties.label}` //The properties variable is not directly accessible it as to be done this way
        searchPreview.appendChild(previewElement)

        previewElement.addEventListener("click", async () => {
            let searchAddressInput = document.querySelector("#searchAddressInput")
            searchAddressInput.value = Array.from(preview.values())[index].properties.label

            searchPreview.classList.remove("visible")
            searchPreview.classList.add("hidden")

            let valueToObserve = document.querySelector("#valueToObserve").value
            await loadInformations(Array.from(preview.values())[index].geometry.coordinates[1],
                Array.from(preview.values())[index].geometry.coordinates[0],
                valueToObserve)
            displayRequestedDataForm()

        })

    })
}

/*
    Hide the given html element
    Parameter : -element : The element we want to hide
*/
function hide(element){
    element.classList.remove("visible")
    element.classList.add("hidden")
}

/*
    Show the given html element
    Parameter : -element : The element we want to show
*/
function show(element){
    element.classList.remove("hidden")
    element.classList.add("visible")
}