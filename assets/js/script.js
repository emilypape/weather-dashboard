var searchBtn = document.querySelector('#search-btn');
var locationInput = document.querySelector('#city-search-input');

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


function fetchWeatherData(city) {
    var key = '3e0ffccaa80f03a52b4c7d59d7b97591';
    // grab initial api data
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        };
    });
};

function clickEvent() {
        // grab user input and set equal to city
        var city = locationInput.value;
        fetchWeatherData(city);
        saveSearchHistory(city);
        
}



searchBtn.addEventListener('click', clickEvent);

