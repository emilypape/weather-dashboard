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
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                fetchAdditionWeatherData(lat, lon, data.name);
            });
        };
    });
};

function currentConditions(data, cityName) {
    // convert Unix time into date
    var resets = $('.dailyForecastBox');
    if(resets) {
        resets.remove();
    }

    var objectDate = data.current.dt
    var date = (objectDate * 1000);
    var dateObject = new Date(date);
    var humanDateObject = dateObject.toLocaleString();

    // need to convert weather icon here***
    var weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weatherIcon')
    icon = data.current.weather[0].icon;
    weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    // append city and date title
    var dailyForecastBox = document.createElement('div')
    dailyForecastBox.classList.add('dailyForecastBox');
    dailyForecast.appendChild(dailyForecastBox);
    dailyForecastBox.textContent = cityName + ' (' +humanDateObject + ')';
    dailyForecastBox.appendChild(weatherIcon);

    // append weather information for current city and date
    var temp = document.createElement('div');
    temp.classList.add('dailyWeatherStyles')
    temp.textContent = 'Temperature: ' + data.current.temp + '°F'
    dailyForecastBox.appendChild(temp);

    var wind = document.createElement('div');
    wind.classList.add('dailyWeatherStyles');
    wind.textContent = 'Wind: ' + data.current.wind_speed + ' MPH';
    dailyForecastBox.appendChild(wind);

    var humidity = document.createElement('div');
    humidity.classList.add('dailyWeatherStyles');
    humidity.textContent = 'Humidity: ' + data.current.humidity + '%';
    dailyForecastBox.appendChild(humidity)

    var uvIndex = document.createElement('div');
    uvIndex.classList.add('dailyWeatherStyles');
    uvIndex.setAttribute('id', 'uvi-style');
    uvIndex.textContent = 'UV Index: ' + data.current.uvi 
    dailyForecastBox.appendChild(uvIndex);

    if(data.current.uvi <= 2) {
        uvIndex.style.backgroundColor = 'green';
        uvIndex.style.width = '15%';
    } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
        uvIndex.style.backgroundColor = 'yellow';
        uvIndex.style.width = '15%';
    } else if (data.current.uvi > 5 && data.current.uvi <= 7) {
        uvIndex.style.backgroundColor = 'orange';
        uvIndex.style.width = '15%';
    } else if (data.current.uvi > 7 && data.current.uvi <= 10) {
        uvIndex.style.backgroundColor = 'red';
        uvIndex.style.width = '15%';
    } else if (data.current.uvi > 10) {
        uvIndex.style.backgroundColor = 'purple';
        uvIndex.style.width = '15%';
    } else {
        return;
    }
    // end weather info append
}

function fiveDayConditions (data) {
    var weeklyForecast = data.daily
    var reset = $('.weatherDayBox');
    if(reset) {
        reset.remove();
    }

    for (var i = 0; i <= 4; i++) {
        var day = weeklyForecast[i]
        var weatherDayBox = document.createElement('div')
        weatherDayBox.classList.add('weatherDayBox');
        weeklyForecastBox.appendChild(weatherDayBox);

        var objectDateEl = day.dt
        var dateEl = document.createElement('div');
        dateEl.textContent = new Date(objectDateEl * 1000).toDateString();
        weatherDayBox.appendChild(dateEl);

        var weatherIcons = document.createElement('img');
        weatherIcons.classList.add('weatherIconWeekly')
        icon = data.current.weather[0].icon;
        weatherIcons.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        weatherDayBox.appendChild(weatherIcons);

        var tempEl = document.createElement('div');
        tempEl.classList.add('weatherStyles');
        tempEl.textContent = 'Temperature: ' + day.temp.max + '°F'
        weatherDayBox.appendChild(tempEl);

        var windEl = document.createElement('div');
        windEl.classList.add('weatherStyles');
        windEl.textContent = 'Wind: ' + day.wind_speed + ' MPH';
        weatherDayBox.appendChild(windEl);

        var humidityEl = document.createElement('div');
        humidityEl.textContent = 'Humidity: ' + day.humidity + '%';
        weatherDayBox.appendChild(humidityEl)
    }


}

function cityRecall () {
    city = this.textContent;

    fetchWeatherData(city);
    saveSearchHistory(city);

}

function clickEvent() {
        // grab user input and set equal to city
        var city = locationInput.value;
        fetchWeatherData(city);
        saveSearchHistory(city);
        
        var cityEl = document.createElement('button');
        cityEl.classList = 'viewSearch'
        cityEl.setAttribute('id', 'city-el');
        cityEl.textContent = city

        cityEl.addEventListener('click', cityRecall);

        recentSearches.classList.remove('hidden');
        recentSearches.appendChild(cityEl);

}


searchBtn.addEventListener('click', clickEvent);


