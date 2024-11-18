function getWeatherData(city) {
  const apiKey = "b6274dc355d13780dbac2ce1b85c77af";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then((response) => {
      displayWeather(response.data);

      axios
        .get(forecastApiUrl)
        .then((forecastResponse) => {
          displayForecast(forecastResponse.data);
        })
        .catch((error) => {
          console.error("Error fetching forecast data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
    });
}

function displayWeather(data) {
  let temperatureElement = document.querySelector("#current-temperature");
  let cityElement = document.querySelector("#current-city");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let precipitationElement = document.querySelector("#precipitation");
  let weatherIconElement = document.querySelector("#weather-icon");
  let weatherDescriptionElement = document.querySelector(
    "#weather-description"
  );
  let dateTimeElement = document.querySelector("#current-date-time");

  cityElement.innerHTML = `${data.name}, ${data.sys.country}`;
  temperatureElement.innerHTML = `${Math.round(
    data.main.temp
  )}<span class="degree">°C</span>`;
  humidityElement.innerHTML = `${data.main.humidity}%`;
  windSpeedElement.innerHTML = `${Math.round(data.wind.speed)} km/h`;
  precipitationElement.innerHTML = data.rain
    ? `${Math.round(data.rain["1h"] || 0)}%`
    : `0%`;
  weatherDescriptionElement.innerHTML = data.weather[0].description;

  let iconCode = data.weather[0].icon;
  weatherIconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}">`;

  let date = new Date(data.dt * 1000);
  dateTimeElement.innerHTML = formatDate(date);
}

function displayForecast(data) {
  let forecastElement = document.querySelector(".forecast-days");
  forecastElement.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    let dayData = data.list[i];
    let dayName = formatForecastDay(new Date(dayData.dt * 1000));
    let iconUrl = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
    let highTemp = Math.round(dayData.main.temp_max);
    let lowTemp = Math.round(dayData.main.temp_min);

    let forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-day");

    forecastItem.innerHTML = `
      <div class="forecast-day-name">${dayName}</div>
      <div class="forecast-icon"><img class="icon-size" src="${iconUrl}" alt="${dayData.weather[0].description}"></div>
      <div class="forecast-temp">
        <span class="high-temp">${highTemp}°C</span>
        <span class="low-temp">${lowTemp}°C</span>
      </div>
    `;
    forecastElement.appendChild(forecastItem);
  }
}

function formatDate(date) {
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let dateNum = date.getDate();
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day}, ${month} ${dateNum}, ${year}, ${hours}:${minutes} ${period}`;
}

function formatForecastDay(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function search(event) {
  event.preventDefault();

  let searchInputElement = document.querySelector("#city-input");
  let city = searchInputElement.value.trim();

  getWeatherData(city);
  searchInputElement.blur();
}

document.getElementById("search-form").addEventListener("submit", search);
