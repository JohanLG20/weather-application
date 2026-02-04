let loadedValues
let currentDay = 0
let graph = null

/*
    Function that loads the informations from the API from the latitude and the longitude given by the user.
*/
async function loadInformations(latitude, longitude, infoToLoad) {
    const p = await getValuesAtLocation(latitude, longitude, infoToLoad)

    let dataCheckboxes = document.querySelectorAll(".dataCheckboxes")
    let valuesNames = getAllValuesNames(dataCheckboxes)

    loadedValues = splitValuesDayByDay(p.hourly, Object.values(p.hourly_units), infoToLoad, valuesNames) //We use this Object.values() to not have to specify the data name
    
    
    
}

/* 
    Function that return a map where each value is a DayValue that contain all the values for one day.
    Parameter : -values : An object that contain two arrays, one for the time and the other for the temperature
    Return : A Data object
*/
function splitValuesDayByDay(valuesInObject, unitsInObject, infoToLoad, valuesNames) {

    let dayVal = []
    let values = Object.values(valuesInObject)
    let units = Object.values(unitsInObject)

    let times = values[0]
    values.splice(0, 1) //We split the times and the values in two different variables for an easier code
    units.splice(0, 1) //We remove the unit of the time to only keep the units of the weather values


    let tempTime = [times[0].split("T")[1]] // We get only the hour and not the full date
    let tempValues = []
    for (let val = 0; val < values.length; val++) {//We push all the values that the API gave us
        tempValues.push([values[val][0]])
    }
    let day = 0

    for (let i = 1; i < values[0].length; i++) {
        if (times[i].split("T")[0] !== times[i - 1].split("T")[0]) {
            dayVal.push(new DayValues(times[i - 1].split("T")[0], tempTime, tempValues))
            tempTime = []
            tempValues = []
            for (let val = 0; val < values.length; val++) {//We push all the values that the API gave us
                tempValues.push([])
            }
            day++

        }

        tempTime.push(times[i].split("T")[1])
        for (let val = 0; val < values.length; val++) {//We push all the values that the API gave us
            tempValues[val].push(values[val][i])
        }

    }

    dayVal.push(new DayValues(times[times.length - 1].split("T")[0], tempTime, tempValues))

    let datas = new Datas(dayVal, units, infoToLoad, valuesNames)

    console.log(datas)

    return datas

}

/*
    Populate the div #weatherInformations with all the informations of the current day
    Parameter : - day : A number that contains the day we want to display
*/
function displayInfosOfDay(day) {

    let valuesToDisplay = loadedValues.values[day]

    //Creating the header
    let weatherInformationsHeader = document.querySelector("#weatherInformations thead tr")
    if (weatherInformationsHeader.children.length > 0) {
        for (let i = weatherInformationsHeader.children.length - 1; i >= 0; i--) {
            weatherInformationsHeader.removeChild(weatherInformationsHeader.children[i])
        }//Remove all the lines of the children

    }
    let time = document.createElement("th") 
    time.scope = "col"
    time.textContent = "Time"
    weatherInformationsHeader.appendChild(time)

    for(let i = 0; i < loadedValues.unit.length; i++){
        let valName = document.createElement("th")
        valName.scope = "col"
        valName.textContent = `${loadedValues.valuesNames[i]} (${loadedValues.unit[i]})`
        weatherInformationsHeader.appendChild(valName)
    }

    let weatherInformationsBody = document.querySelector("#weatherInformations tbody")
    if (weatherInformationsBody.children.length > 0) {
        for (let i = weatherInformationsBody.children.length - 1; i >= 0; i--) {
            weatherInformationsBody.removeChild(weatherInformationsBody.children[i])
        }//Remove all the lines of the children

    }

    for (let i = 0; i < valuesToDisplay.time.length; i++) {
        let dataValue = document.createElement("tr")

        let timeValue = document.createElement("th")
        timeValue.scope = "row"
        timeValue.textContent = valuesToDisplay.time[i]
        dataValue.appendChild(timeValue)

        for(let val = 0; val < valuesToDisplay.values.length; val++){
            let value = document.createElement("td")
            value.textContent = `${valuesToDisplay.values[val][i]} ${loadedValues.unit[val]}`
            dataValue.appendChild(value)
        }

        weatherInformationsBody.appendChild(dataValue)
    }

}

/*
    Replace the last graph with a new graph that display all the datas of the requested day
    Parameter : - day : A number that contains the day we want to display
*/
function displayGraphicInfosOfDay(day) {
    let currenDayDisplayed = loadedValues.values[day]

    let context = document.querySelector("#graph").getContext("2d")

    if (graph !== null) {
        graph.destroy()

    }
    let formatedLabel = currenDayDisplayed.unitDisplayed.replaceAll("_", " ")
    formatedLabel += " in " + currenDayDisplayed.unit
    formatedLabel = formatedLabel.replace(formatedLabel[0], formatedLabel[0].toUpperCase()) // Making first character capital

    graph = new Chart(context, {
        type: "line",
        data: {
            labels: currenDayDisplayed.time,
            datasets: [{
                label: formatedLabel,
                data: currenDayDisplayed.values,
                backgroundColor: ["red"]
            }]

        },

        options: {
            scales: {
                y: {
                    suggestedMax: loadedValues.get("max"),
                    suggestedMin: loadedValues.get("min")
                }
            }
        }
    })

}

/*
    Function that call the display method that correspond to the type of datas the user want to display
*/
function displayDatas() {
    //Make the data visible
    let datas = document.querySelector("#datas")
    datas.classList.remove("hidden")
    datas.classList.add("visible")

    setTitle(loadedValues.values[currentDay].day)

    let displayTextVersion = document.querySelector("#textVersion")
    let displayGraphicVersion = document.querySelector("#graphicVersion")
    if (displayTextVersion.classList.contains("menuFormPreviewActive")) displayInfosOfDay(currentDay)
    else if (displayGraphicVersion.classList.contains("menuFormPreviewActive")) displayGraphicInfosOfDay(currentDay)
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

/*

*/
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
            displayDatas()

        })

    })
}

/*
    Hide the given html element
    Parameter : -element : The element we want to hide
*/
function hide(element) {
    element.classList.remove("visible")
    element.classList.add("hidden")
}

/*
    Show the given html element
    Parameter : -element : The element we want to show
*/
function show(element) {
    element.classList.remove("hidden")
    element.classList.add("visible")
}

function getAllCheckedValues(elements) {
    let result = ""
    for (let checkbox of elements) {
        if (checkbox.checked) {
            result += `,${checkbox.value}`
        }
    }

    return result.slice(1) //Remove the first coma of the string
}

function getAllValuesNames(elements){

    let result = []
    for (let checkbox of elements) {
        if (checkbox.checked) {
            result.push(checkbox.parentElement.textContent)
        }
    }
    console.log(elements)
    return result
}