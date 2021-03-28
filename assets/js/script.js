var apiUrl = fetch("https://api.openweathermap.org/data/2.5/weather?q=Toronto&APPID=3e8aa64128a8b382a871af127be1e2d0");

function getWeather(cityName){
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=3e8aa64128a8b382a871af127be1e2d0`;

    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    })
}

// getWeather("Toronto");