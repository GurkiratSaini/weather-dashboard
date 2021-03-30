$(document).ready(function() {
    if(localStorage.length === 0 || !localStorage.getItem("cities")){
        console.log("No Search history found, setting first search query to Toronto");
        getWeather("Toronto");
    }
    // let lastSearch = localStorage.getItem(`city${localStorage.length-1}`);
});

var cities = [];

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
            console.log(data);
            var cityLat = data.city.coord.lat;
            var cityLong = data.city.coord.lon;

            /* old data, displays using apiUrl, onecallUrl shows better info
            var temperature = data.list[0].main.temp;
            var humidity = data.list[0].main.humidity;
            var windSpeed = data.list[0].wind.speed;
            var currentDate = moment.unix(data.list[0].dt).format("MM/DD/YYYY");
            $("#cityNameHeader").html(`<h4>${cityName} (${currentDate}) <img src="https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png" /></h4>`);
            $("#cityTemp").text(temperature + "F");
            $("#cityHumidity").text(humidity + "%");
            $("#cityWindSpeed").text(windSpeed + "mph");
            */

            var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&exclude=minutely,hourly,alerts&appid=3e8aa64128a8b382a871af127be1e2d0&units=imperial`;

            fetch(onecallUrl)
            .then(function(response){
                response.json().then(function(data){
                    console.log(data);
                    var currentTemp = data.current.temp;
                    var currentHumidity = data.current.humidity;
                    var currentWindSpeed = data.current.wind_speed;
                    var currentDate = data.current.dt;
                    var currentUVIndex = data.current.uvi;
                    var currentWeatherIcon = data.current.weather[0].icon;
                    $(`#cityNameHeader`).html(`<h4>${cityName} (${currentDate}) <img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png" /></h4>`);
                    $(`#cityTemp`).text(`${currentTemp}F`);
                    $(`#cityHumidity`).text(`${currentHumidity}%`);
                    $(`#cityWindSpeed`).text(`${currentWindSpeed}mph`);
                    $(`#cityUV`).text(`${currentUVIndex}`);

                    // 5-day forecast
                    // forecastDate Img Temp Humidity
                    for (let i = 1; i<=5; i++) {
                        $(`#forecastDate${i}`).text(data.daily[i].dt);
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


/* TO-DO
- appendChild for search history Buttons
- Event Handling for search history buttons
- Local Storage set and get for Search History Buttons
- Fix the display height
*/