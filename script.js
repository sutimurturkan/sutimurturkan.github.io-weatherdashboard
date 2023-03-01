// API key
const apiKey = "d91f911bcf2c0f925fb6535547a5ddc9";

// Elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const cityList = document.querySelector("#city-list");
const currentCity = document.querySelector("#current-city");
const currentTemp = document.querySelector("#current-temp");
const currentDesc = document.querySelector("#current-desc");
const currentIcon = document.querySelector("#current-icon");
const forecastTable = document.querySelector("#forecast-table");

// Event listeners
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (city !== "") {
    getWeatherData(city);
    searchInput.value = "";
  }
});

cityList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const city = event.target.textContent;
    getWeatherData(city);
  }
});

// Functions
function getWeatherData(city) {
  // Check localStorage for cached data
  const cachedData = JSON.parse(localStorage.getItem(city));
  if (cachedData && Date.now() < cachedData.expires) {
    displayWeatherData(cachedData);
    return;
  }

  // Fetch weather data
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const weatherData = parseWeatherData(data);
      const expires = Date.now() + 1000 * 60 * 10; // Cache data for 10 minutes
      localStorage.setItem(city, JSON.stringify({ weatherData, expires }));
      displayWeatherData({ weatherData });
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to fetch weather data.");
    });
}

function parseWeatherData(data) {
  const city = data.city.name;
  const weatherData = {
    current: {
      temp: kelvinToCelsius(data.list[0].main.temp),
      desc: data.list[0].weather[0].description,
      icon: data.list[0].weather[0].icon,
    },
    forecast: [],
  };
  for (let i = 1; i < data.list.length; i += 8) {
    const date = new Date(data.list[i].dt_txt);
    const forecastData = {
      date: date.toLocaleDateString(),
      temp: kelvinToCelsius(data.list[i].main.temp),
      desc: data.list[i].weather[0].description,
      icon: data.list[i].weather[0].icon,
    };
    weatherData.forecast.push(forecastData);
  }
  return { city, ...weatherData };
}

function displayWeatherData({ city, current, forecast }) {
  // Current weather
  currentCity.textContent = city;
  currentTemp.textContent = `${current.temp}°C`;
  currentDesc.textContent = current.desc;
  currentIcon.src = `http://openweathermap.org/img/w/${current.icon}.png`;

  // Forecast
  let forecastHtml = "";
  forecast.forEach((data) => {
    forecastHtml += `
      <tr>
        <td>${data.date}</td>
        <td>${data.temp}°C</td>
        <td>${data.desc}</td>
        <td><img src="http://openweathermap.org/img/w/${data.icon}.png" alt="${data.desc}"></td>
      </tr>
    `;
  });
  forecastTable.innerHTML = forecastHtml; 
