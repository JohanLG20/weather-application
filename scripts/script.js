const { createElement } = require("react")

async function loadInformations(){
    let latitude = parseFloat(document.querySelector("#latitudeInput").value)
    let longitude = parseFloat(document.querySelector("#longitudeInput").value)
    let datas = document.querySelector("#datas")

    if(!isNaN(latitude) && !isNaN(longitude)){ 
        const p = await getTemperatureAtLocation(latitude, longitude)
        console.log(p)
        let dataLine = null
        for(let i = 0; i < p.hourly.time.length; i++){
            dataLine = document.createElement("div")
            dataLine.classList.add("dataLine")
            
            let time = document.createElement("p")
            time.textContent = p.hourly.time[i]
            let temperature = document.createElement("p")
            temperature.textContent = p.hourly.temperature_2m[i]
            dataLine.appendChild(time)
            dataLine.appendChild(temperature)
            datas.appendChild(dataLine)
        }

    }
    else{   
        alert("Veuillez rentrer une latitude et une longitude")
    }


}