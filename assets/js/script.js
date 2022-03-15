var searchBtn = document.querySelector('#search-btn');
var locationInput = document.querySelector('#city-search-input');
var recentSearches = document.querySelector('#recent-searches');
var dailyForecast = document.querySelector('#city-weather-box');
var weeklyForecastBox = document.querySelector('#forecast-box');

function saveSearchHistory(city) {
    var searchHistory = localStorage.getItem('cities');

    if(!searchHistory) {
        searchHistory = JSON.stringify([city]);
    } else {
        searchHistory = JSON.parse(searchHistory);
        searchHistory.push(city);
        searchHistory = JSON.stringify(searchHistory);
    }
    localStorage.setItem('cities', searchHistory);
}

var key = '3e0ffccaa80f03a52b4c7d59d7b97591';

function fetchAdditionWeatherData(lat, lon, city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                currentConditions(data, city);
                fiveDayConditions(data);
            })
        }
    })
}

function fetchWeatherData(city) {
    // grab initial api data
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&dt&appid=${key}`
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                fetchAdditionWeatherData(lat, lon, data.name);
            });
        };
    });
};

function currentConditions(data, cityName) {
    // convert Unix time into date
    var objectDate = data.current.dt
    var dateMilliseconds = (objectDate * 1000);
    var dateObject = new Date(dateMilliseconds);
    var humanDateObject = dateObject.toLocaleString();

    // need to convert weather icon here***

    // append city and date title
    var dailyForecastBox = document.createElement('div')
    dailyForecast.appendChild(dailyForecastBox);
    dailyForecastBox.textContent = cityName + ' (' +humanDateObject + ')';

    // append weather information for current city and date
    var temp = document.createElement('div');
    temp.textContent = 'Temperature: ' + data.current.temp + '°F'
    dailyForecastBox.appendChild(temp);

    var wind = document.createElement('div');
    wind.textContent = 'Wind: ' + data.current.wind_speed + ' MPH';
    dailyForecastBox.appendChild(wind);

    var humidity = document.createElement('div');
    humidity.textContent = 'Humidity: ' + data.current.humidity + '%';
    dailyForecastBox.appendChild(humidity)

    var uvIndex = document.createElement('div');
    uvIndex.textContent = 'UV Index: ' + data.current.uvi 
    dailyForecastBox.appendChild(uvIndex);
    // end weather info append
}

function fiveDayConditions (data) {


}

function clickEvent() {
        // grab user input and set equal to city
        var city = locationInput.value;
        fetchWeatherData(city);
        saveSearchHistory(city);
        
        var cityEl = document.createElement('div');
        cityEl.classList = 'viewSearch'
        cityEl.id = '#city-el-recall'
        cityEl.textContent = city

        recentSearches.classList.remove('hidden');
        recentSearches.appendChild(cityEl);

}


searchBtn.addEventListener('click', clickEvent);

