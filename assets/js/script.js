var uvIndex = "";



function getWeather(){
    var cityName = $("#cityName").val().trim();
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

            $("#cityNameHeader").text(cityName);
            $("#cityTemp").text(temperature + "F");
            $("#cityHumidity").text(humidity + "%");
            $("#cityWindSpeed").text(windSpeed + "mph");
            
            // set uv index by doing another fetch here!!!!!
        });
    })
}

function setWeather() {

}

$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    getWeather();
});