const userInput = document.querySelector("#city-input");
const searchButton = document.querySelector(".search-btn");
const loadingMessage = document.querySelector("#loading");
const weatherInfo = document.querySelector(".weather-info");

async function fetchCoordinates(location) {
  try {
    const request = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
    );
    const response = await request.json();
    if (response.length === 0) {
      throw new Error("Invalid city name");
    }
    return [response[0].lat, response[0].lon];
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error("Failed to fetch coordinates: " + error.message);
  }
}

async function fetchWeatherData(lat, lon) {
  try {
    const weatherRequest = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const weatherResponse = await weatherRequest.json();
    if (weatherResponse.cod !== 200) {
      throw new Error("Failed to fetch weather data");
    }
    return weatherResponse;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data: " + error.message);
  }
}

function validateCityName(name) {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(name);
}

searchButton.addEventListener("click", async function () {
  const cityName = userInput.value.trim();
  if (!cityName) {
    alert("Enter a valid city name");
    return;
  }

  if (!validateCityName(cityName)) {
    alert("City name can only contain alphabetic characters and spaces");
    return;
  }

  try {
    loadingMessage.classList.remove("hidden");
    weatherInfo.classList.add("hidden");

    const coords = await fetchCoordinates(cityName);
    console.log("Coordinates fetched:", coords);

    const [latitude, longitude] = coords;

    const weatherData = await fetchWeatherData(latitude, longitude);
    console.log("Weather data fetched:", weatherData);

    loadingMessage.classList.add("hidden");
    weatherInfo.classList.remove("hidden");

    document.querySelector("#climate").textContent =
      weatherData.weather[0].main;
    document.querySelector("#description").textContent =
      weatherData.weather[0].description;
    document.querySelector("#temp-min").textContent = weatherData.main.temp_min;
    document.querySelector("#temp-max").textContent = weatherData.main.temp_max;
  } catch (error) {
    loadingMessage.classList.add("hidden");
    alert(error.message);
  }
});
