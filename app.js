const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

var longtitude = 0, latitude =0;

const lctURL = 
   "https://api.mapbox.com/geocoding/v5/mapbox.places/ha%20dong.json?country=vn&access_token=pk.eyJ1IjoiZmlubmlja2siLCJhIjoiY2twdHk2czkyMDhxNTMyb2p6MmU5MTY1bSJ9.iauRukEs2mSAIFiMzzlvJQ";


fetch(lctURL)
    .then(function (result) {
        return result.json();
    })
    .then(function (data) {
        latitude = data.features[0].center[0];
        longitude = data.features[0].center[1];
    })
    .then(function() {
      console.log(longitude,latitude)
        let api = 
        `https://api.tomorrow.io/v4/timelines?location=${longitude},${latitude}&fields=temperature,weatherCode&timezone=Asia/Ho_Chi_Minh&timesteps=1h&units=metric&apikey=wDvruCLRw4mNu8vF0SHJz9QwQW5R1aoB`; 
    fetch(api)
        .then(function(data){
            return data.json();
        })
        .then(function(data){
            weather.temperature.value = data.data.timelines[0].intervals[0].values.temperature;
            weather.description = data.data.timelines[0].intervals[0].startTime;
            weather.weatherCode = data.data.timelines[0].intervals[0].values.weatherCode;
            weather.weatherNow = changeCode(weather.weatherCode);
        })
        .then(function(){
            displayWeather();
        });
    })

    // DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = getIcons();
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = getDay();
    locationElement.innerHTML = `<p>Thanh Trì, Hà Nội</p>`;
    notificationElement.innerHTML = `<p>${weather.weatherNow}</P>`; 
}

//FUNCTION TO GET DAY
function getDay() {
    var date = new Date();
    var getday;
    getday = parseInt(date.getDate()) + "/"
          + parseInt(date.getMonth()+1) + "/" 
          + date.getFullYear();
    return getday;
  }

//DISPLAY NOTIFICATION
  function changeCode(weatherCode) {
    var hour = new Date();
    var hours = hour.getHours();
    switch (weatherCode) {
      case 1000: {
        if ((hours >= 0 && hours <= 4) || (hours >= 20 && hours <= 23))
          return "Clear";
        else return "Sunny";
      }
      case 1100: {
        if ((hours >= 0 && hours <= 4) || (hours >= 19 && hours <= 23))
          return "Mostly Clear";
        else return "Mostly Sunny";
      }
      case 1001: {
        return "Cloudy";
      }
      case 4000: {
        return "Drizzle";
      }
      case 4001: {
        return "Rain";
      }
      case 4200: {
        return "Light Rain";
      }
      case 4201: {
        return "Heavy Rain";
      }
      case 8000: {
        return "Thunderstorm";
      }
      case 2100: {
        return "Light Fog";
      }
      case 2000: {
        return "Fog";
      }
      case 1101: {
        return "Partly Cloudy";
      }
      case 1102: {
        return "Mostly Cloudy";
      }
    }
  }

//DISPLAY ICONS
  function getIcons() {
    var hour = new Date()
    var hours = hour.getHours()
    switch (weather.weatherCode) {
        default: {
            return `<img src="./icons/${weather.weatherCode}.svg"/>`;
        }
        case 1000: {
            if ((hours >= 0 && hours <= 4) || (hours >= 20 && hours <= 23))
            return `<img src="./icons/${weather.weatherCode}.svg"/>`;
            else return `<img src="./icons/icons-day/${weather.weatherCode}.svg"/>`
          }
        case 1100: {
            if ((hours >= 0 && hours <= 4) || (hours >= 20 && hours <= 23))
            return `<img src="./icons/${weather.weatherCode}.svg"/>`;
            else return `<img src="./icons/icons-day/${weather.weatherCode}.svg"/>`
          }
        case 1101: {
            if ((hours >= 0 && hours <= 4) || (hours >= 20 && hours <= 23))
            return `<img src="./icons/${weather.weatherCode}.svg"/>`;
            else return `<img src="./icons/icons-day/${weather.weatherCode}.svg"/>`
          }
    }
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});
