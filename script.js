let input = document.querySelector("#input");
let submit = document.querySelector("#btn-search");
let name = document.querySelector("#name");
let temp = document.querySelector("#temp");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let UV = document.querySelector("#UV");
let fiveDay = document.querySelectorAll(".day");

let icons = {
    clouds: 'icons/png/cloudy.png',
    sunny:  'icons/png/sunny.png',
    partyCloudy: 'icons/png/partlycloudy.png',
    Rain: 'icons/png/rainy.png',
    snowy: 'icons/png/snowy.png',
    thunder: 'icons/png/thunderstorm.png'
}

let apiKey = '7529f7be67780d5b335f0689ae25c356';
let city = '';
let lat = 0;
let lon = 0;

submit.addEventListener('click', function() {
    city = input.value;
    
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        
        if (data.cod == 200) {

            let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},us&APPID=${apiKey}&units=imperial`;
        
            fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                DisplayFiveDay(data);
            })


            DisplayCity(data);
       
            url = `https://api.openweathermap.org/data/2.5/uvi?&APPID=${apiKey}&lat=${lat}&lon=${lon}`;
            fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                DisplayUV(data);
            })
        }
        
    })
});



function DisplayUV(data) {
    UV.textContent = "UV Index: " + data.value;
}


function DisplayCity(data) {
    name.textContent = data.name;
    
    temp.textContent = "Tempurature: " + data.main.temp + " F";
    humidity.textContent = "Humidity: " + data.main.humidity;
    wind.textContent =  "Wind Speed: " + data.wind.speed + " mph";
    lat = data.coord.lat;
    lon = data.coord.lon;
}

function DisplayFiveDay(data) {
    
    for (var i = 0; i < data.list.length; i+=8) {
        fiveDay[i / 8].querySelector(".date").textContent = data.list[i].dt_txt.split(" ")[0];
        fiveDay[i / 8].querySelector(".temp").textContent = "Temp: " + data.list[i].main.temp + " F";
        fiveDay[i / 8].querySelector(".humid").textContent = "Humidity: " + data.list[i].main.humidity + "%";
        
        let image = '';
        let description = data.list[i].weather[0].main;
        if (description == 'Rain') {
            image = icons.Rain;
        } else if (description == 'Clouds') {
            image = icons.clouds;
            let clouds = data.list[i].weather[0].description.split(" ");
            if (clouds[0] == 'broken' || clouds[0] == 'few' || clouds[0] == 'scattered') {
                image = icons.partyCloudy;
            }
        } else if (description == 'Clear') {
            image = icons.sunny;
        } else if (description[1] == 'Snow') {
            image = icons.snowy;
        } else if (description == 'Thunderstorm') {
            image = icons.thunder;
        }
        fiveDay[i / 8].querySelector("img").setAttribute('src', image)
    }
}