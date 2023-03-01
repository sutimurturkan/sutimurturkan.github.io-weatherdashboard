const apiKey = "d91f911bcf2c0f925fb6535547a5ddc9";
let lat = "";
let lon = "";
let city = "";

const weatherDiv = document.getElementById("weather");
const searchForm = document.querySelector("form");
const searchInput = document.getElementById("city");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  city = searchInput.value.trim();
  localStorage.setItem("city", city);
  getWeatherData(city);
});

function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      lat = data.city.coord.lat;
      lon = data.city.coord.lon;
      localStorage.setItem("lat", lat);
      localStorage.setItem("lon", lon);
      displayWeatherData(data);
    })
    .catch(error => console.log(error));
}

function displayWeatherData(data) {
  weatherDiv.innerHTML = "";
  const forecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  forecasts.forEach(forecast => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    const date = new Date(forecast.dt * 1000);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const dateString = date.toLocaleDateString("en-US", options);

    const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    const description = forecast.weather[0].description;

    const temperature = Math.round(forecast.main.temp - 273.15);
    const humidity = forecast.main.humidity;
    const windSpeed = Math.round(forecast.wind.speed * 3.6);

    cardDiv.innerHTML = `
      <h2>${dateString}</h2>
      <img src="${iconUrl}" alt="${description}">
      <p>${description}</p>
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} km/h</p>
    `;

    weatherDiv.appendChild(cardDiv);
  });
}

if (localStorage.getItem("city") && localStorage.getItem("lat") && localStorage.getItem("lon")) {
  city = localStorage.getItem("city");
  lat = localStorage.getItem("lat");
  lon = localStorage.getItem("lon");
  getWeatherData(city);
}
