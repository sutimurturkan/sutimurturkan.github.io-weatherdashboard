// API key for OpenWeatherMap
//const apiKey = '87afab2cb1586b30ede3c5f0c079cde1';
const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

// Query selectors for HTML elements
const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-input');
const searchHistoryEl = document.querySelector('#search-history');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');

// Event listener for search form submission
searchFormEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchQuery = searchInputEl.value.trim();
  if (searchQuery) {
    // Call the OpenWeatherMap API to get the weather data
    getWeatherData(searchQuery)
      .then(data => {
        // Update the UI with the weather data
        updateSearchHistory(searchQuery);
        updateCurrentWeather(data.currentWeather);
        updateForecast(data.forecast);
        saveToLocalStorage(searchQuery);
      })
      .catch(error => {
        console.error(error);
      });
  }
});

// Function to call the OpenWeatherMap API and get the weather data for a city
function getWeatherData(cityName) {
  // First, get the latitude and longitude of the city
  return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const { lat, lon } = data[0];
      // Use the latitude and longitude to get the current weather and 5-day forecast
      const currentWeatherPromise = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json());
      const forecastPromise = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json());
      return Promise.all([currentWeatherPromise, forecastPromise])
        .then(data => {
          return {
            currentWeather: data[0],
            forecast: data[1].list.filter(item => item.dt_txt.endsWith('12:00:00'))
          };
        });
    });
}

// Function to update the search history UI with a new search query
function updateSearchHistory(searchQuery) {
  const searchHistoryItemEl = document.createElement('li');
  searchHistoryItemEl.textContent = searchQuery;
  searchHistoryItemEl.addEventListener('click', () => {
    searchInputEl.value = searchQuery;
    searchFormEl.dispatchEvent(new Event('submit'));
  });
  searchHistoryEl.appendChild(searchHistoryItemEl);
}

// Function to update the current weather UI with the current weather data
function updateCurrentWeather(currentWeatherData) {
  currentWeatherEl.innerHTML = `
    <h2>${currentWeatherData.name} (${new Date().toLocaleDateString()})</h2>
    <img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png" alt="${currentWeatherData.weather[0].description}">
    <p>Temperature: ${currentWeatherData.main.temp} &deg;C</p>
    <p>Humidity: ${currentWeatherData.main.humidity}%</p>
    <p>Wind Speed: ${currentWeatherData.wind.speed} m/s</p>
  `;
}

// Function to update the forecast UI with the forecast data
function updateForecast(forecastData) {
  forecastEl.innerHTML = '';
  forecastData.forEach(item => {
  const forecastItemEl = document.createElement('div');
  forecastItemEl.classList.add('forecast-item');
  forecastItemEl.innerHTML = `<h3>${new Date(item.dt_txt).toLocaleDateString()}</h3> <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}"> <p>Temperature: ${item.main.temp} &deg;C</p> <p>Humidity: ${item.main.humidity}%</p> <p>Wind Speed: ${item.wind.speed} m/s</p>` ;
  forecastEl.appendChild(forecastItemEl);
  });
  }

// Function to save the search history to localStorage
function saveToLocalStorage(searchQuery) {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(searchQuery)) {
  searchHistory.push(searchQuery);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
  }

// Function to load the search history from localStorage
function loadFromLocalStorage() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.forEach(searchQuery => {
  updateSearchHistory(searchQuery);
  });
  }

// Load the search history from localStorage on page load
loadFromLocalStorage();
  