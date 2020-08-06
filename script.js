let input = document.querySelector("#input");
let submit = document.querySelector("#btn-search");
let name = document.querySelector("#name");
let temp = document.querySelector("#temp");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let UV = document.querySelector("#UV");
let fiveDay = document.querySelector("#five-day");
let search = document.querySelector("#search");
let cityIcon = document.querySelector("#city-icon");
let lastSearch = '';

let icons = {
    clouds: 'icons/png/cloudy.png',
    sunny:  'icons/png/sunny.png',
    partyCloudy: 'icons/png/partlycloudy.png',
    Rain: 'icons/png/rainy.png',
    snowy: 'icons/png/snowy.png',
    thunder: 'icons/png/thunderstorm.png'
}

let apiKey = '7529f7be67780d5b335f0689ae25c356';
let lat = 0;
let lon = 0;


// displays the previously searched cities
Getcities();


submit.addEventListener('click', function() {
    fiveDay.innerHTML = '';
    GetData(input.value);
    localStorage.setItem('last', input.value);
    input.value = '';
});


// Calls the api's 
function GetData(city) {
    
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        
        if (data.cod == 200) {

            let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}&units=imperial`;
        
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
}

navigator.geolocation.getCurrentPosition(GetLocation);

function GetLocation(position) {
   let lat = position.coords.latitude;
   let lon = position.coords.longitude;
   let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}`;
   fetch(url)
   .then(function(response) {
       return response.json();
   })
   .then(function(data){
       if (localStorage.getItem(data.name) == null) {
            GetData(data.name);
       } else {
            GetData(localStorage.getItem('last'));
       }
   })
}

function DisplayUV(data) {
    UV.textContent = "UV Index: " + data.value;
}


function DisplayCity(data) {
    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1); 
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    name.textContent = `${data.name} (${today})`;
    cityIcon.setAttribute('src', SetImage(data.weather[0]));
    temp.textContent = "Tempurature: " + data.main.temp + " \u00B0F";
    humidity.textContent = "Humidity: " + data.main.humidity;
    wind.textContent =  "Wind Speed: " + data.wind.speed + " MPH";
    lat = data.coord.lat;
    lon = data.coord.lon;
    localStorage.setItem(data.name, data.name);
    Getcities();
    localStorage.setItem('last', data.name);
}


// creates the buttons for the previously searched cities
function Getcities() {
    
    let list = document.querySelector('#list');
    list.innerHTML = '';
    keys = Object.keys(localStorage);
    for (var i  = 0; i < keys.length; i++){
        if(keys[i] != 'last') {
            btn = document.createElement("div");
            btn.setAttribute('class', 'previous');
            btn.setAttribute('data-city', keys[i]);
            
            btn.textContent = keys[i];
          
            list.appendChild(btn);
        }
        
    } 
    let prev = document.getElementsByClassName('previous');
    createPreviousButtons(prev);
}

// adds eventlisteners to all the left side buttons
function createPreviousButtons(data) {

    for (let index = 0; index < data.length; index++) {
        data[index].addEventListener('click', function() {
            fiveDay.innerHTML = '';
            GetData(data[index].getAttribute('data-city')); 
        })
    }
}


function DisplayFiveDay(data) {
    
    for (var i = 0; i < data.list.length; i+=8) {

        card = document.createElement("span");
        card.setAttribute('class', 'day');

        date = document.createElement('h4');
        icon = document.createElement('img');
        temp = document.createElement('h4');
        humid = document.createElement('h4');

        date.textContent = data.list[i].dt_txt.split(" ")[0];
        icon.setAttribute('src', SetImage(data.list[i].weather[0]));
        temp.textContent = "Temp: " + data.list[i].main.temp + " \u00B0F";
        humid.textContent = "Humidity: " + data.list[i].main.humidity + "%";
        
        card.appendChild(date);
        card.appendChild(icon);
        card.appendChild(temp);
        card.appendChild(humid);

        fiveDay.appendChild(card);
    }
}


// Picks the weather icon based on weather discription
function SetImage(data) {
    let image = '';
    let description = data.main;
    if (description == 'Rain') {
        image = icons.Rain;
    } else if (description == 'Clouds') {
        image = icons.clouds;
        let clouds = data.description.split(" ");
        if (clouds[0] == 'broken' || clouds[0] == 'few' || clouds[0] == 'scattered') {
            image = icons.partyCloudy;
        }
    } else if (description == 'Clear') {
        image = icons.sunny;
    } else if (description == 'Snow') {
        image = icons.snowy;
    } else if (description == 'Thunderstorm') {
        image = icons.thunder;
    }
    return image;
}