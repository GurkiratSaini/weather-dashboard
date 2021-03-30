var cities = JSON.parse(localStorage.getItem("cities"));

$(document).ready(function() {
    if( cities == null || !localStorage.getItem("cities")){
        cities = [];
        console.log("No Search history found, setting first search query to Toronto");
        getWeather("Toronto");
    }
    else {
        for (let i = 0; i < cities.length; i++) {
            $(".btn-group-vertical").append($(`<button type="button" class="btn btn-light">${cities[i]}</button>`));
        }
        getWeather(cities[cities.length-1]);
    }
});

function getWeather(cityName){
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=3e8aa64128a8b382a871af127be1e2d0&units=imperial&exclude=current,minutely,hourly`;

    $("#cityName").val("");
    var searchHistoryBtn = $(`<button type="button" class="btn btn-light">${cityName}</button>`);
    $(".btn-group-vertical").append(searchHistoryBtn);
    cities.push(cityName);
    console.log(cities);
    localStorage.setItem("cities", JSON.stringify(cities));

    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            var cityLat = data.city.coord.lat;
            var cityLong = data.city.coord.lon;

            var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&exclude=minutely,hourly,alerts&appid=3e8aa64128a8b382a871af127be1e2d0&units=imperial`;

            fetch(onecallUrl)
            .then(function(response){
                response.json().then(function(data){
                    var currentTemp = data.current.temp;
                    var currentHumidity = data.current.humidity;
                    var currentWindSpeed = data.current.wind_speed;
                    var currentDate = moment.unix(data.current.dt).format("MM/DD/YYYY");
                    var currentUVIndex = data.current.uvi;
                    var currentWeatherIcon = data.current.weather[0].icon;
                    $(`#cityNameHeader`).html(`<h4>${cityName} (${currentDate}) <img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png" /></h4>`);
                    $(`#cityTemp`).text(`${currentTemp}F`);
                    $(`#cityHumidity`).text(`${currentHumidity}%`);
                    $(`#cityWindSpeed`).text(`${currentWindSpeed}mph`);
                    $(`#cityUV`).text(`${currentUVIndex}`);

                    // 5-day forecast
                    for (let i = 1; i<=5; i++) {
                        $(`#forecastDate${i}`).text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
                        $(`#forecastImg${i}`).attr("src", `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`);
                        $(`#forecastTemp${i}`).text(data.daily[i].temp.day + "F");
                        $(`#forecastHumidity${i}`).text(data.daily[i].humidity + "%");
                    }
                });
            });
        });
    });
}


$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var cityName = $("#cityName").val().trim();
    getWeather(cityName);
});

// $(".btn-group-vertical").children("button").each(on("click", getWeather($(""))))


/* TO-DO
- Add function to check for city name redundancy
- Add click event listeners for each city button
- Add error handling for bad response
- Add delete button to clear search history
*/