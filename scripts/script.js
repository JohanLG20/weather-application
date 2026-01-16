/*
    Function that loads the informations from the API from the latitude and the longitude given by the user.
*/
async function loadInformations(){
    let latitude = parseFloat(document.querySelector("#latitudeInput").value)
    let longitude = parseFloat(document.querySelector("#longitudeInput").value)
    let datas = document.querySelector("#datas")

    //Checking if the values given by the user are corrects
    if(!isNaN(latitude) && !isNaN(longitude)){ 

        //Getting all the info from the API call
        const p = await getTemperatureAtLocation(latitude, longitude)
        let dataLine = null

        //Browsing all the datas. They are given in the object hourly that is {time:array, temperature_2m:array} 
        for(let i = 0; i < p.hourly.time.length; i++){
            //Creating the elements
            dataLine = document.createElement("div")
            let time = document.createElement("p")
            let temperature = document.createElement("p")
            dataLine.classList.add("dataLine")

            //Adding the corresponding value to the elements
            time.textContent = p.hourly.time[i]
            temperature.textContent = `${p.hourly.temperature_2m[i]} °C`

            //Adding the elements to the page
            dataLine.appendChild(time)
            dataLine.appendChild(temperature)
            datas.appendChild(dataLine)
        }

    }
    else{   
        alert("Veuillez rentrer une latitude et une longitude")
    }


}