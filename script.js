const apiKey = "87afab2cb1586b30ede3c5f0c079cde1";

const app = document.getElementById("app");
const cityInput = document.getElementById("city");
const weatherInfo = document.getElementById("weather-info");

const getCoordinates = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return {
    lat: data.coord.lat,
    lon: data.coord.lon
  };
};

const getWeatherData = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.list;
};

const renderWeatherData = (weatherData) => {
  weatherInfo.innerHTML = "";
  weatherData.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;

    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent = item.weather[0].description;

    const temp = document.createElement
