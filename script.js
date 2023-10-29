const searchInput = document.querySelector("#searchinput");
const searchButton = document.querySelector("#searchbutton");
const weatherIcon = document.querySelector("#weatherIcon");
const weather = document.querySelector("#weather");
const description = document.querySelector("#description");
const windSpeed = document.querySelector("#windspeed");
const humidity = document.querySelector(".humidity");
const minTemp = document.querySelector("#mint")
const maxTemp = document.querySelector("#maxt")
const API = config.API;

const setWeatherDetails = (data) => {
    description.innerHTML = "Feels like:"+data.weather[0].description;
    weather.innerHTML = "Temp:"+Math.round(data.main.temp - 273.15) + "°C";
    minTemp.innerHTML = "Min.temp:"+Math.round(data.main.temp_min - 273.15) + "°C";
    maxTemp.innerHTML = "Max.temp:"+Math.round(data.main.temp_max - 273.15) + "°C";
    humidity.innerHTML = data.main.humidity + "%";
    windSpeed.innerHTML = data.wind.speed + "km/h";
    switch (data.weather[0].main) {
        case 'Clouds':
            weatherIcon.src = "images/clouds.png";
            break;
        case 'Clear':
            weatherIcon.src = "images/clear.png";
            break;
        case 'Rain':
            weatherIcon.src = "images/rain.png";
            break;
        case 'Mist':
            weatherIcon.src = "images/mist.png";
            break;
        case 'Snow':
            weatherIcon.src = "images/snow.png";
            break;
        case 'Haze':
            weatherIcon.src = "images/drizzle.png";
            break;
    }
};

const setLocation = (data) => {
    let lat = data[0].lat;
    let lon = data[0].lon;
    callWeatherApi(API, lat, lon);
};

const callGeoApi = (id) => {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value}&appid=${id}`)
        .then(response => {
            if (!response.ok) {
                alert("Check spelling of City and try again or Something Went Wrong!");
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setLocation(data);
        })
        .catch(error => console.log(error));
};

const callWeatherApi = (id, lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${id}`)
        .then(response => {
            if (!response.ok) {
                alert("Check spelling of City and try again or Something Went Wrong!");
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setWeatherDetails(data);
        })
        .catch(error => console.log(error));
};

searchButton.addEventListener("click", (e) => {
    if (searchInput.value === "") {
        alert("Please Enter City Name.");
    } else {
        callGeoApi(API);
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchButton.click();
    }
});

