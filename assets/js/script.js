var uvIndex = "";



function getWeather(cityName){
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=3e8aa64128a8b382a871af127be1e2d0&units=imperial`;

    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            var cityLat = data.city.coord.lat;
            var cityLong = data.city.coord.lon;
            var temperature = data.list[0].main.temp;
            var humidity = data.list[0].main.humidity;
            var windSpeed = data.list[0].wind.speed;
            var currentDate = moment.unix(data.list[0].dt).format("MM/DD/YYYY");
            $("#cityNameHeader").html(`<h4>${cityName} (${currentDate}) <img src="https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png" /></h4>`);
            $("#cityTemp").text(temperature + "F");
            $("#cityHumidity").text(humidity + "%");
            $("#cityWindSpeed").text(windSpeed + "mph");
            
            // set uv index by doing another fetch here!!!!!
        });
    })
}


$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var cityName = $("#cityName").val().trim();
    getWeather(cityName);
});


/* TO-DO
- Fetch request for UV Index
- For Loop to populate forecast data
- appendChild for search history Buttons
- Event Handling for search history buttons
- Local Storage set and get for Search History Buttons
- Fix the display height
*/